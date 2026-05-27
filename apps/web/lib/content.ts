import { prisma } from '@luxora/db';
import {
  DEFAULT_SITE,
  DEFAULT_HERO,
  DEFAULT_ABOUT,
  DEFAULT_CONTACT,
  DEFAULT_SERVICES,
  DEFAULT_PROJECTS,
} from '@luxora/db/defaults';

// Fetch all site-wide content. Falls back to defaults if DB is unreachable
// (so the marketing site still renders during local dev before `db:seed`).

export async function getSite() {
  try {
    const s = await prisma.siteSettings.findUnique({ where: { id: 'default' } });
    return s ?? { id: 'default', ...DEFAULT_SITE, updatedAt: new Date() };
  } catch {
    return { id: 'default', ...DEFAULT_SITE, updatedAt: new Date() };
  }
}

export async function getHero() {
  try {
    const h = await prisma.heroContent.findUnique({ where: { id: 'default' } });
    return h ?? { id: 'default', ...DEFAULT_HERO, updatedAt: new Date() };
  } catch {
    return { id: 'default', ...DEFAULT_HERO, updatedAt: new Date() };
  }
}

export async function getAbout() {
  try {
    const a = await prisma.aboutContent.findUnique({
      where: { id: 'default' },
      include: {
        stats: { orderBy: { order: 'asc' } },
        values: { orderBy: { order: 'asc' } },
      },
    });
    if (a) return a;
  } catch {}
  return {
    id: 'default',
    ...DEFAULT_ABOUT,
    updatedAt: new Date(),
    stats: DEFAULT_ABOUT.stats.map((s, i) => ({ ...s, id: `d${i}`, aboutId: 'default' })),
    values: DEFAULT_ABOUT.values.map((v, i) => ({ ...v, id: `dv${i}`, aboutId: 'default' })),
  };
}

export async function getContact() {
  try {
    const c = await prisma.contactContent.findUnique({
      where: { id: 'default' },
      include: {
        studios: { orderBy: { order: 'asc' } },
        socials: { orderBy: { order: 'asc' } },
      },
    });
    if (c) return c;
  } catch {}
  return {
    id: 'default',
    ...DEFAULT_CONTACT,
    updatedAt: new Date(),
    studios: DEFAULT_CONTACT.studios.map((s, i) => ({ ...s, id: `s${i}`, contactId: 'default' })),
    socials: DEFAULT_CONTACT.socials.map((s, i) => ({ ...s, id: `so${i}`, contactId: 'default' })),
  };
}

export async function getServices() {
  try {
    return await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });
  } catch {
    return DEFAULT_SERVICES.map((s, i) => ({
      ...s,
      id: `d${i}`,
      published: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}

export async function getProjects({ featuredOnly = false }: { featuredOnly?: boolean } = {}) {
  try {
    return await prisma.project.findMany({
      where: { published: true, ...(featuredOnly ? { featured: true } : {}) },
      orderBy: { order: 'asc' },
    });
  } catch {
    const list = featuredOnly ? DEFAULT_PROJECTS.filter((p) => p.featured) : DEFAULT_PROJECTS;
    return list.map((p, i) => ({
      ...p,
      id: `d${i}`,
      published: true,
      gallery: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }
}

export async function getProjectBySlug(slug: string) {
  try {
    return await prisma.project.findUnique({ where: { slug } });
  } catch {
    const p = DEFAULT_PROJECTS.find((x) => x.slug === slug);
    if (!p) return null;
    return { ...p, id: 'd', published: true, gallery: [], createdAt: new Date(), updatedAt: new Date() };
  }
}

