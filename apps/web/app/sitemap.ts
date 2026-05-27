import type { MetadataRoute } from 'next';
import { getProjects, getJournalPosts } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const [projects, posts] = await Promise.all([getProjects(), getJournalPosts()]);

  const staticPages = ['', '/services', '/work', '/about', '/clients', '/journal', '/contact'].map(
    (p) => ({ url: `${base}${p}`, lastModified: new Date() })
  );

  const projectPages = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  const journalPages = posts.map((j) => ({
    url: `${base}/journal/${j.slug}`,
    lastModified: j.updatedAt,
  }));

  return [...staticPages, ...projectPages, ...journalPages];
}
