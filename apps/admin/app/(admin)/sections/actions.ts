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

async function uniqueSlug(base: string, exceptId?: string): Promise<string> {
  const root = slugify(base) || 'section';
  let slug = root;
  let n = 1;
  // Sections are few, so a simple loop is fine.
  while (
    await prisma.workSection.findFirst({
      where: { slug, ...(exceptId ? { NOT: { id: exceptId } } : {}) },
      select: { id: true },
    })
  ) {
    slug = `${root}-${++n}`;
  }
  return slug;
}

export async function createSection(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  if (!title) return;
  const slug = await uniqueSlug(String(formData.get('slug') ?? '').trim() || title);
  const last = await prisma.workSection.findFirst({ orderBy: { order: 'desc' } });

  const section = await prisma.workSection.create({
    data: {
      slug,
      title,
      description: String(formData.get('description') ?? '').trim(),
      image: String(formData.get('image') ?? '').trim(),
      order: Number(formData.get('order') ?? 0) || (last?.order ?? 0) + 1,
      published: String(formData.get('published') ?? 'true') === 'true',
    },
  });

  revalidatePath('/sections');
  await bustWebCache(['/', '/work']);
  redirect(`/sections/${section.id}`);
}

export async function updateSection(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const title = String(formData.get('title') ?? '').trim();
  const slug = await uniqueSlug(String(formData.get('slug') ?? '').trim() || title, id);

  await prisma.workSection.update({
    where: { id },
    data: {
      slug,
      title,
      description: String(formData.get('description') ?? '').trim(),
      image: String(formData.get('image') ?? '').trim(),
      order: Number(formData.get('order') ?? 0),
      published: String(formData.get('published') ?? 'true') === 'true',
    },
  });

  // Projects mirror their section's title in `category`, which the public
  // detail page still shows as the discipline.
  await prisma.project.updateMany({ where: { sectionId: id }, data: { category: title } });

  revalidatePath('/sections');
  revalidatePath(`/sections/${id}`);
  revalidatePath('/projects');
  await bustWebCache(['/', '/work']);
  redirect(`/sections/${id}`);
}

// Deleting a section leaves its projects in place (sectionId is set to null by
// the relation's onDelete: SetNull) so no work is ever lost by accident. They
// fall back to being grouped by their `category` text on /work.
export async function deleteSection(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.workSection.delete({ where: { id } });
  revalidatePath('/sections');
  revalidatePath('/projects');
  await bustWebCache(['/', '/work']);
  redirect('/sections');
}

export async function moveSection(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const direction = String(formData.get('direction') ?? '');
  if (!id || (direction !== 'up' && direction !== 'down')) return;

  const sections = await prisma.workSection.findMany({ orderBy: { order: 'asc' } });
  const index = sections.findIndex((s) => s.id === id);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= sections.length) return;

  // Orders can be duplicated or sparse in existing data, so rewrite the whole
  // list from the reordered array instead of swapping two `order` values.
  const reordered = [...sections];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];

  await prisma.$transaction(
    reordered.map((s, i) =>
      prisma.workSection.update({ where: { id: s.id }, data: { order: i + 1 } })
    )
  );

  revalidatePath('/sections');
  await bustWebCache(['/', '/work']);
}

export async function moveProjectInSection(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const sectionId = String(formData.get('sectionId') ?? '');
  const direction = String(formData.get('direction') ?? '');
  if (!id || !sectionId || (direction !== 'up' && direction !== 'down')) return;

  const projects = await prisma.project.findMany({
    where: { sectionId },
    orderBy: { order: 'asc' },
  });
  const index = projects.findIndex((p) => p.id === id);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= projects.length) return;

  const reordered = [...projects];
  [reordered[index], reordered[swapWith]] = [reordered[swapWith], reordered[index]];

  // Reuse the order values this section already occupies so reordering inside
  // one section never reshuffles projects in another.
  const slots = projects.map((p) => p.order).sort((a, b) => a - b);
  await prisma.$transaction(
    reordered.map((p, i) => prisma.project.update({ where: { id: p.id }, data: { order: slots[i] } }))
  );

  revalidatePath(`/sections/${sectionId}`);
  revalidatePath('/projects');
  await bustWebCache(['/', '/work']);
}

export async function removeProjectFromSection(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const sectionId = String(formData.get('sectionId') ?? '');
  if (!id) return;
  await prisma.project.update({ where: { id }, data: { sectionId: null } });
  if (sectionId) revalidatePath(`/sections/${sectionId}`);
  revalidatePath('/projects');
  await bustWebCache(['/', '/work']);
}
