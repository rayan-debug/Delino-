'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { bustWebCache } from '@/lib/revalidate';

export async function addClient(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim();
  if (!name) return;
  const last = await prisma.client.findFirst({ orderBy: { order: 'desc' } });
  await prisma.client.create({ data: { name, order: (last?.order ?? 0) + 1 } });
  revalidatePath('/clients');
  await bustWebCache(['/', '/clients']);
}

export async function updateClient(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  const current = await prisma.client.findUnique({ where: { id } });
  if (!current) return;
  await prisma.client.update({
    where: { id },
    data: {
      name: formData.get('name') != null ? String(formData.get('name')).trim() : current.name,
      logoUrl: formData.get('logoUrl') != null ? String(formData.get('logoUrl')).trim() || null : current.logoUrl,
      order: formData.get('order') != null ? Number(formData.get('order')) : current.order,
    },
  });
  revalidatePath('/clients');
  await bustWebCache(['/', '/clients']);
}

export async function removeClient(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.client.delete({ where: { id } });
  revalidatePath('/clients');
  await bustWebCache(['/', '/clients']);
}
