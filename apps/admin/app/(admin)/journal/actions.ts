'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { bustWebCache } from '@/lib/revalidate';

function slugify(input: string): string {
  return input.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
}

export async function createPost(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  let slug = String(formData.get('slug') ?? '').trim() || slugify(title);
  let n = 1;
  while (await prisma.journalPost.findUnique({ where: { slug } })) {
    slug = `${slugify(title)}-${++n}`;
  }
  const post = await prisma.journalPost.create({
    data: {
      slug,
      title,
      excerpt: String(formData.get('excerpt') ?? '').trim(),
      body: String(formData.get('body') ?? ''),
      category: String(formData.get('category') ?? 'Essay').trim(),
      readTime: String(formData.get('readTime') ?? '5 min read').trim(),
      image: String(formData.get('image') ?? '').trim(),
      published: String(formData.get('published') ?? 'true') === 'true',
      publishedAt: new Date(String(formData.get('publishedAt') ?? new Date().toISOString())),
    },
  });
  revalidatePath('/journal');
  await bustWebCache(['/', '/journal', `/journal/${post.slug}`]);
  redirect(`/journal/${post.id}`);
}

export async function updatePost(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const title = String(formData.get('title') ?? '').trim();
  const slugRaw = String(formData.get('slug') ?? '').trim();
  let slug = slugRaw || slugify(title);
  const existing = await prisma.journalPost.findFirst({ where: { slug, NOT: { id } } });
  if (existing) slug = `${slug}-${Math.floor(Math.random() * 1000)}`;

  await prisma.journalPost.update({
    where: { id },
    data: {
      slug,
      title,
      excerpt: String(formData.get('excerpt') ?? '').trim(),
      body: String(formData.get('body') ?? ''),
      category: String(formData.get('category') ?? 'Essay').trim(),
      readTime: String(formData.get('readTime') ?? '5 min read').trim(),
      image: String(formData.get('image') ?? '').trim(),
      published: String(formData.get('published') ?? 'true') === 'true',
      publishedAt: new Date(String(formData.get('publishedAt') ?? new Date().toISOString())),
    },
  });
  revalidatePath('/journal');
  await bustWebCache(['/', '/journal', `/journal/${slug}`]);
  redirect(`/journal/${id}`);
}

export async function deletePost(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const post = await prisma.journalPost.findUnique({ where: { id } });
  await prisma.journalPost.delete({ where: { id } });
  revalidatePath('/journal');
  if (post) await bustWebCache(['/', '/journal', `/journal/${post.slug}`]);
  redirect('/journal');
}
