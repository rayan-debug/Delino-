// One-off migration: turn every distinct Project.category into a WorkSection
// and link its projects to it. Safe to re-run — it only touches projects that
// still have no section, and reuses sections that already exist.
//
//   pnpm db:backfill-sections

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

async function main() {
  console.log('🔁 Backfilling work sections from project categories...');

  const orphans = await prisma.project.findMany({
    where: { sectionId: null },
    orderBy: { order: 'asc' },
  });

  if (orphans.length === 0) {
    console.log('  ✓ nothing to do — every project already belongs to a section');
    return;
  }

  // Preserve the order categories first appear in, so sections land on /work
  // in roughly the order the projects were already showing.
  const categories: string[] = [];
  for (const p of orphans) {
    const category = p.category.trim() || 'Selected Work';
    if (!categories.includes(category)) categories.push(category);
  }

  const lastSection = await prisma.workSection.findFirst({ orderBy: { order: 'desc' } });
  let order = (lastSection?.order ?? 0) + 1;

  for (const title of categories) {
    const slug = slugify(title) || 'section';

    let section = await prisma.workSection.findFirst({
      where: { OR: [{ slug }, { title }] },
    });

    if (!section) {
      const cover = orphans.find((p) => (p.category.trim() || 'Selected Work') === title);
      section = await prisma.workSection.create({
        data: { slug, title, image: cover?.image ?? '', order: order++ },
      });
      console.log(`  + created section "${title}"`);
    }

    const { count } = await prisma.project.updateMany({
      where: { sectionId: null, category: { equals: title } },
      data: { sectionId: section.id },
    });
    console.log(`    ↳ linked ${count} project(s) to "${title}"`);
  }

  // Anything with a blank category falls into the catch-all section.
  const blank = await prisma.project.findMany({ where: { sectionId: null } });
  if (blank.length > 0) {
    const fallback =
      (await prisma.workSection.findFirst({ where: { slug: 'selected-work' } })) ??
      (await prisma.workSection.create({
        data: { slug: 'selected-work', title: 'Selected Work', order: order++ },
      }));
    await prisma.project.updateMany({
      where: { sectionId: null },
      data: { sectionId: fallback.id },
    });
    console.log(`    ↳ linked ${blank.length} uncategorised project(s) to "Selected Work"`);
  }

  console.log('✨ Backfill complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
