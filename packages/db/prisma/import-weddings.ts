/**
 * One-shot importer for the "Weddings Shoot" project.
 *
 * Uploads a directory of web-encoded clips (and their poster frames) to
 * Cloudinary, then upserts the project row pointing at them.
 *
 * Idempotent: every asset uses a deterministic public_id and the project is
 * upserted by slug, so re-running after a failure resumes rather than
 * duplicating. Already-uploaded assets are skipped unless FORCE=1.
 *
 *   pnpm db:import-weddings
 *
 * Env:
 *   WEDDING_MEDIA_DIR  directory holding <base>.mp4 and <base>.jpg pairs
 *   FORCE=1            re-upload assets even if they already exist
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { v2 as cloudinary } from 'cloudinary';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const MEDIA_DIR = process.env.WEDDING_MEDIA_DIR;
const FOLDER = 'luxora/projects/weddings';
const SLUG = 'weddings-shoot';
const FORCE = process.env.FORCE === '1';

// The work page groups projects into sections — the "folders" in the admin.
// This project lives in Filmmaking alongside any future video work.
const SECTION_SLUG = 'filmmaking';
const SECTION_TITLE = 'Filmmaking';

function requireEnv(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing ${name}. Set it in the repo-root .env.`);
  return v;
}

cloudinary.config({
  cloud_name: requireEnv('CLOUDINARY_CLOUD_NAME'),
  api_key: requireEnv('CLOUDINARY_API_KEY'),
  api_secret: requireEnv('CLOUDINARY_API_SECRET'),
  secure: true,
});

async function existingUrl(publicId: string, resourceType: 'image' | 'video') {
  if (FORCE) return null;
  try {
    const r = await cloudinary.api.resource(publicId, { resource_type: resourceType });
    return r.secure_url as string;
  } catch {
    return null;
  }
}

async function upload(file: string, publicId: string, resourceType: 'image' | 'video') {
  const already = await existingUrl(publicId, resourceType);
  if (already) {
    console.log(`  = ${path.basename(file)} (already uploaded)`);
    return already;
  }

  const buffer = await readFile(file);
  const mb = (buffer.length / 1024 / 1024).toFixed(1);
  process.stdout.write(`  ↑ ${path.basename(file)} (${mb}MB) … `);

  const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
    const params = {
      public_id: publicId,
      resource_type: resourceType,
      overwrite: true,
      ...(resourceType === 'video' ? { chunk_size: 20 * 1024 * 1024 } : {}),
    } as Record<string, unknown>;

    const handler = (err: unknown, res: { secure_url: string } | undefined) =>
      err || !res ? reject(err ?? new Error('upload failed')) : resolve(res);

    const stream =
      resourceType === 'video'
        ? cloudinary.uploader.upload_chunked_stream(params, handler as never)
        : cloudinary.uploader.upload_stream(params, handler as never);
    stream.end(buffer);
  });

  console.log('done');
  return result.secure_url;
}

async function main() {
  if (!MEDIA_DIR) {
    throw new Error('Set WEDDING_MEDIA_DIR to the folder holding the encoded clips.');
  }

  const files = await readdir(MEDIA_DIR);
  // Bases are numbered (wedding-01-…), so a plain sort is the running order.
  const bases = files
    .filter((f) => f.toLowerCase().endsWith('.mp4'))
    .map((f) => f.replace(/\.mp4$/i, ''))
    .sort();

  if (bases.length === 0) throw new Error(`No .mp4 files found in ${MEDIA_DIR}`);
  console.log(`Uploading ${bases.length} clips to Cloudinary (${FOLDER})\n`);

  const videoUrls: string[] = [];
  let coverUrl = '';

  for (const base of bases) {
    console.log(base);
    const videoUrl = await upload(path.join(MEDIA_DIR, `${base}.mp4`), `${FOLDER}/${base}`, 'video');
    videoUrls.push(videoUrl);

    // The poster is uploaded too so the cover works even on a plan where
    // on-the-fly video frame extraction is unavailable.
    const posterFile = path.join(MEDIA_DIR, `${base}.jpg`);
    if (files.includes(`${base}.jpg`)) {
      const posterUrl = await upload(posterFile, `${FOLDER}/${base}-poster`, 'image');
      if (!coverUrl) coverUrl = posterUrl;
    }
  }

  // Create the Filmmaking folder if it isn't there yet, but never overwrite a
  // title or description that has since been edited in the admin.
  const existingSection = await prisma.workSection.findUnique({
    where: { slug: SECTION_SLUG },
  });
  const section =
    existingSection ??
    (await prisma.workSection.create({
      data: {
        slug: SECTION_SLUG,
        title: SECTION_TITLE,
        description:
          'Films made in house — event coverage, venue walkthroughs and detail work, shot and cut by the studio.',
        order: (await prisma.workSection.findFirst({ orderBy: { order: 'desc' } }))?.order ?? 0,
        published: true,
      },
    }));
  console.log(
    `\n${existingSection ? 'Using existing' : 'Created'} section "${section.title}" (${section.slug})`
  );

  const data = {
    sectionId: section.id,
    title: 'Weddings Shoot',
    // Category mirrors the section title, matching what the admin form does.
    category: section.title,
    description:
      'A collection of wedding decoration films — ceremony builds, floral installations, table settings and full venue walkthroughs, shot and cut in house.',
    year: String(new Date().getFullYear()),
    image: coverUrl || videoUrls[0],
    gallery: videoUrls,
    tags: ['Weddings', 'Decoration', 'Video', 'Events'],
    published: true,
  };

  const existing = await prisma.project.findUnique({ where: { slug: SLUG } });
  if (existing) {
    await prisma.project.update({ where: { slug: SLUG }, data });
    console.log(`\nUpdated project "${data.title}" (/work/${SLUG})`);
  } else {
    const last = await prisma.project.findFirst({ orderBy: { order: 'desc' } });
    await prisma.project.create({
      data: { ...data, slug: SLUG, order: (last?.order ?? 0) + 1, featured: false },
    });
    console.log(`\nCreated project "${data.title}" (/work/${SLUG})`);
  }

  console.log(`${videoUrls.length} videos in the gallery, filed under "${section.title}".`);
}

main()
  .catch((e) => {
    console.error('\nImport failed:', e.message ?? e);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
