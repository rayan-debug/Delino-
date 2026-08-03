import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import {
  DEFAULT_SITE,
  DEFAULT_HERO,
  DEFAULT_SERVICES,
  DEFAULT_SECTIONS,
  DEFAULT_PROJECTS,
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
} from '../src/defaults';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Luxora database...');

  // Site settings (single row)
  await prisma.siteSettings.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...DEFAULT_SITE },
    update: {},
  });
  console.log('  ✓ site settings');

  // Hero (single row)
  await prisma.heroContent.upsert({
    where: { id: 'default' },
    create: { id: 'default', ...DEFAULT_HERO },
    update: {},
  });
  console.log('  ✓ hero');

  // About (single row + nested stats/values)
  const existingAbout = await prisma.aboutContent.findUnique({ where: { id: 'default' } });
  if (!existingAbout) {
    await prisma.aboutContent.create({
      data: {
        id: 'default',
        eyebrow: DEFAULT_ABOUT.eyebrow,
        headline: DEFAULT_ABOUT.headline,
        body: DEFAULT_ABOUT.body,
        image: DEFAULT_ABOUT.image,
        stats: { create: DEFAULT_ABOUT.stats },
        values: { create: DEFAULT_ABOUT.values },
      },
    });
  }
  console.log('  ✓ about');

  // Contact (single row + nested studios/socials)
  const existingContact = await prisma.contactContent.findUnique({ where: { id: 'default' } });
  if (!existingContact) {
    await prisma.contactContent.create({
      data: {
        id: 'default',
        headline: DEFAULT_CONTACT.headline,
        email: DEFAULT_CONTACT.email,
        phone: DEFAULT_CONTACT.phone,
        address: DEFAULT_CONTACT.address,
        studios: { create: DEFAULT_CONTACT.studios },
        socials: { create: DEFAULT_CONTACT.socials },
      },
    });
  }
  console.log('  ✓ contact');

  // Services
  for (const s of DEFAULT_SERVICES) {
    await prisma.service.upsert({
      where: { id: `seed-${s.title.toLowerCase().replace(/\s+/g, '-')}` },
      create: { id: `seed-${s.title.toLowerCase().replace(/\s+/g, '-')}`, ...s },
      update: {},
    });
  }
  console.log('  ✓ services');

  // Work sections (groups of projects on /work)
  const sectionIdBySlug = new Map<string, string>();
  for (const s of DEFAULT_SECTIONS) {
    const section = await prisma.workSection.upsert({
      where: { slug: s.slug },
      create: s,
      update: {},
    });
    sectionIdBySlug.set(s.slug, section.id);
  }
  console.log('  ✓ work sections');

  // Projects
  for (const { sectionSlug, ...p } of DEFAULT_PROJECTS) {
    await prisma.project.upsert({
      where: { slug: p.slug },
      create: { ...p, sectionId: sectionIdBySlug.get(sectionSlug) ?? null },
      update: {},
    });
  }
  console.log('  ✓ projects');

  // Admin bootstrap user
  const email = process.env.ADMIN_EMAIL ?? 'admin@example.com';
  const password = process.env.ADMIN_PASSWORD ?? 'change-me';
  const hash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    create: { email, password: hash, name: 'Studio Admin' },
    update: {},
  });
  console.log(`  ✓ admin user (${email})`);

  console.log('✨ Seed complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
