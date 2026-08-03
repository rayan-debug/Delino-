'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { bustWebCache } from '@/lib/revalidate';

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function parseTags(raw: string): string[] {
  return raw
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

function parseGallery(raw: string): string[] {
  return raw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

// A project belongs to at most one section. When it does, `category` mirrors
// the section title (the public detail page still shows it as the discipline);
// otherwise the free-text category field is used as-is.
async function resolveSection(formData: FormData) {
  const sectionId = String(formData.get('sectionId') ?? '').trim() || null;
  const typedCategory = String(formData.get('category') ?? '').trim();
  if (!sectionId) return { sectionId: null, category: typedCategory };

  const section = await prisma.workSection.findUnique({
    where: { id: sectionId },
    select: { id: true, title: true },
  });
  if (!section) return { sectionId: null, category: typedCategory };
  return { sectionId: section.id, category: section.title };
}

export async function createProject(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  // A hand-typed slug goes through slugify too — a raw value like
  // "Food Photography" produces a URL the /work/[slug] route can't match.
  let slug = slugify(String(formData.get('slug') ?? '').trim()) || slugify(title);
  // ensure unique slug
  let n = 1;
  while (await prisma.project.findUnique({ where: { slug } })) {
    slug = `${slugify(title)}-${++n}`;
  }
  const last = await prisma.project.findFirst({ orderBy: { order: 'desc' } });
  const { sectionId, category } = await resolveSection(formData);

  const project = await prisma.project.create({
    data: {
      slug,
      title,
      sectionId,
      category,
      description: String(formData.get('description') ?? '').trim(),
      year: String(formData.get('year') ?? '').trim() || null,
      client: String(formData.get('client') ?? '').trim() || null,
      image: String(formData.get('image') ?? '').trim(),
      gallery: parseGallery(String(formData.get('gallery') ?? '')),
      tags: parseTags(String(formData.get('tags') ?? '')),
      order: Number(formData.get('order') ?? (last?.order ?? 0) + 1),
      featured: String(formData.get('featured')) === 'true',
      published: String(formData.get('published') ?? 'true') === 'true',
    },
  });
  revalidatePath('/projects');
  revalidatePath('/sections');
  if (sectionId) revalidatePath(`/sections/${sectionId}`);
  await bustWebCache(['/', '/work', `/work/${project.slug}`]);
  redirect(`/projects/${project.id}`);
}

export async function updateProject(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const title = String(formData.get('title') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? '').trim()) || slugify(title);

  const existing = await prisma.project.findFirst({ where: { slug, NOT: { id } } });
  const finalSlug = existing ? `${slug}-${Math.floor(Math.random() * 1000)}` : slug;
  const { sectionId, category } = await resolveSection(formData);

  await prisma.project.update({
    where: { id },
    data: {
      slug: finalSlug,
      title,
      sectionId,
      category,
      description: String(formData.get('description') ?? '').trim(),
      year: String(formData.get('year') ?? '').trim() || null,
      client: String(formData.get('client') ?? '').trim() || null,
      image: String(formData.get('image') ?? '').trim(),
      gallery: parseGallery(String(formData.get('gallery') ?? '')),
      tags: parseTags(String(formData.get('tags') ?? '')),
      order: Number(formData.get('order') ?? 0),
      featured: String(formData.get('featured')) === 'true',
      published: String(formData.get('published') ?? 'true') === 'true',
    },
  });
  revalidatePath(`/projects/${id}`);
  revalidatePath('/projects');
  revalidatePath('/sections');
  if (sectionId) revalidatePath(`/sections/${sectionId}`);
  await bustWebCache(['/', '/work', `/work/${finalSlug}`]);
  redirect(`/projects/${id}`);
}

export async function deleteProject(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const project = await prisma.project.findUnique({ where: { id } });
  await prisma.project.delete({ where: { id } });
  revalidatePath('/projects');
  revalidatePath('/sections');
  if (project?.sectionId) revalidatePath(`/sections/${project.sectionId}`);
  if (project) await bustWebCache(['/', '/work', `/work/${project.slug}`]);
  redirect('/projects');
}
