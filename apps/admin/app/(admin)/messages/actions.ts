'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';

export async function markRead(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.message.update({ where: { id }, data: { read: true } });
  revalidatePath('/messages');
}

export async function removeMessage(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  if (!id) return;
  await prisma.message.delete({ where: { id } });
  revalidatePath('/messages');
}
