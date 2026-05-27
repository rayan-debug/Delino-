'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { bustWebCache } from '@/lib/revalidate';

export async function addService(formData: FormData) {
  const last = await prisma.service.findFirst({ orderBy: { order: 'desc' } });
  await prisma.service.create({
    data: {
      icon: String(formData.get('icon') ?? 'monitor'),
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      order: (last?.order ?? 0) + 1,
    },
  });
  revalidatePath('/services');
  await bustWebCache(['/', '/services']);
}

export async function updateService(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.service.update({
    where: { id },
    data: {
      icon: String(formData.get('icon') ?? 'monitor'),
      title: String(formData.get('title') ?? '').trim(),
      description: String(formData.get('description') ?? '').trim(),
      order: Number(formData.get('order') ?? 0),
      published: String(formData.get('published') ?? 'true') === 'true',
    },
  });
  revalidatePath('/services');
  await bustWebCache(['/', '/services']);
}

export async function removeService(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.service.delete({ where: { id } });
  revalidatePath('/services');
  await bustWebCache(['/', '/services']);
}
