import { SignJWT, jwtVerify } from 'jose';

const SESSION_COOKIE = 'luxora_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET is required');
  return new TextEncoder().encode(s);
}

export type SessionPayload = {
  uid: string;
  email: string;
};

export async function createSession(payload: SessionPayload): Promise<string> {
  return await new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .setIssuer('luxora-admin')
    .sign(getSecret());
}

export async function verifySession(token: string | undefined | null): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), { issuer: 'luxora-admin' });
    if (typeof payload.uid !== 'string' || typeof payload.email !== 'string') return null;
    return { uid: payload.uid, email: payload.email };
  } catch {
    return null;
  }
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE;
export const SESSION_COOKIE_MAX_AGE = SESSION_MAX_AGE;
