import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE_NAME, SESSION_COOKIE_MAX_AGE, createSession, verifySession, type SessionPayload } from '@luxora/shared/auth';

export async function setSessionCookie(payload: SessionPayload) {
  const token = await createSession(payload);
  const c = await cookies();
  c.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_COOKIE_MAX_AGE,
  });
}

export async function clearSessionCookie() {
  const c = await cookies();
  c.delete(SESSION_COOKIE_NAME);
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = await cookies();
  const token = c.get(SESSION_COOKIE_NAME)?.value;
  return await verifySession(token);
}

export async function requireSession(): Promise<SessionPayload> {
  const s = await getSession();
  if (!s) redirect('/login');
  return s;
}
