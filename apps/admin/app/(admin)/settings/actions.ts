'use server';
import bcrypt from 'bcryptjs';
import { prisma } from '@luxora/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function changePassword(formData: FormData) {
  const session = await getSession();
  if (!session) return;
  const current = String(formData.get('current') ?? '');
  const next = String(formData.get('next') ?? '');
  if (!current || !next || next.length < 8) return;

  const user = await prisma.adminUser.findUnique({ where: { id: session.uid } });
  if (!user) return;
  const ok = await bcrypt.compare(current, user.password);
  if (!ok) return;

  const hash = await bcrypt.hash(next, 10);
  await prisma.adminUser.update({ where: { id: user.id }, data: { password: hash } });
  revalidatePath('/settings');
}
