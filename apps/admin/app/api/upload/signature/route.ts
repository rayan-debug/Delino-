import { NextResponse } from 'next/server';
import crypto from 'node:crypto';
import { cloudinaryConfigured } from '@luxora/shared/cloudinary';
import { getSession } from '@/lib/session';

export const runtime = 'nodejs';

/**
 * Hands the browser a short-lived signature so it can upload straight to
 * Cloudinary.
 *
 * Media cannot be proxied through /api/upload in production: Vercel caps a
 * serverless request body at ~4.5MB, which any real video blows past. Signing
 * here keeps the API secret on the server while the bytes go direct.
 *
 * When Cloudinary isn't configured (local dev), this reports `configured:
 * false` and the client falls back to /api/upload, which writes to
 * public/uploads.
 */
export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  if (!cloudinaryConfigured()) {
    return NextResponse.json({ configured: false });
  }

  let body: { folder?: string; resourceType?: string };
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const folder = String(body.folder ?? 'luxora');
  const resourceType = body.resourceType === 'video' ? 'video' : 'image';
  const timestamp = Math.round(Date.now() / 1000);

  // Cloudinary signs the alphabetically sorted params that are actually sent,
  // excluding file, api_key and resource_type.
  const toSign = `folder=${folder}&timestamp=${timestamp}`;
  const signature = crypto
    .createHash('sha1')
    .update(toSign + process.env.CLOUDINARY_API_SECRET)
    .digest('hex');

  return NextResponse.json({
    configured: true,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    timestamp,
    signature,
    folder,
    resourceType,
  });
}
