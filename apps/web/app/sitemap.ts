import type { MetadataRoute } from 'next';
import { getProjects } from '@/lib/content';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const projects = await getProjects();

  const staticPages = ['', '/services', '/work', '/about', '/contact'].map(
    (p) => ({ url: `${base}${p}`, lastModified: new Date() })
  );

  const projectPages = projects.map((p) => ({
    url: `${base}/work/${p.slug}`,
    lastModified: p.updatedAt,
  }));

  return [...staticPages, ...projectPages];
}
