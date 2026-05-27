import { v2 as cloudinary } from 'cloudinary';
import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';

let configured = false;
function configure() {
  if (configured) return;
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
  configured = true;
}

export function cloudinaryConfigured(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export type UploadResult = { url: string; provider: 'cloudinary' | 'local' };

/**
 * Upload a file buffer. In production with Cloudinary creds set, uses Cloudinary.
 * Otherwise (development) writes to apps/admin/public/uploads and returns a /uploads/... URL.
 */
export async function uploadImageBuffer(
  buffer: Buffer,
  filename: string,
  opts: { folder?: string; localBaseDir?: string; publicPath?: string } = {}
): Promise<UploadResult> {
  if (cloudinaryConfigured()) {
    configure();
    return new Promise<UploadResult>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: opts.folder ?? 'luxora', resource_type: 'image' },
        (err, result) => {
          if (err || !result) return reject(err ?? new Error('Cloudinary upload failed'));
          resolve({ url: result.secure_url, provider: 'cloudinary' });
        }
      );
      stream.end(buffer);
    });
  }

  // Local dev fallback
  const baseDir = opts.localBaseDir ?? path.join(process.cwd(), 'public', 'uploads');
  await mkdir(baseDir, { recursive: true });
  const safe = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const finalName = `${Date.now()}_${safe}`;
  await writeFile(path.join(baseDir, finalName), buffer);
  const publicPath = opts.publicPath ?? '/uploads';
  return { url: `${publicPath}/${finalName}`, provider: 'local' };
}
