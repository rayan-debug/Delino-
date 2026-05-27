import { SignJWT, jwtVerify } from 'jose';

const PREVIEW_TTL = 60 * 30; // 30 minutes

function getSecret(): Uint8Array {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s) throw new Error('ADMIN_SESSION_SECRET is required');
  return new TextEncoder().encode(s);
}

export async function createPreviewToken(): Promise<string> {
  return await new SignJWT({ scope: 'preview' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${PREVIEW_TTL}s`)
    .setIssuer('luxora-admin')
    .setAudience('luxora-web')
    .sign(getSecret());
}

export async function verifyPreviewToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, getSecret(), { issuer: 'luxora-admin', audience: 'luxora-web' });
    return true;
  } catch {
    return false;
  }
}
