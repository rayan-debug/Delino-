'use server';
import bcrypt from 'bcryptjs';
import { prisma } from '@luxora/db';
import { redirect } from 'next/navigation';
import { setSessionCookie } from '@/lib/session';

export type LoginState = { status: 'idle' } | { status: 'error'; message: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { status: 'error', message: 'Email and password are required.' };
  }

  try {
    const user = await prisma.adminUser.findUnique({ where: { email } });
    if (!user) return { status: 'error', message: 'Invalid credentials.' };
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return { status: 'error', message: 'Invalid credentials.' };

    await setSessionCookie({ uid: user.id, email: user.email });
  } catch (e) {
    return { status: 'error', message: 'Login failed. Check your DATABASE_URL and try again.' };
  }
  redirect('/');
}
