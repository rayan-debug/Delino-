import { NextResponse } from 'next/server';
import path from 'node:path';
import { uploadMediaBuffer } from '@luxora/shared/cloudinary';
import { getSession } from '@/lib/session';

export const runtime = 'nodejs';
// Video transcoding on Cloudinary's side can outlast the default budget.
export const maxDuration = 300;

const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: 'bad form data' }, { status: 400 });
  }

  const file = formData.get('file');
  const folder = String(formData.get('folder') ?? 'luxora');
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'no file' }, { status: 400 });
  }

  const isVideo = file.type.startsWith('video/');
  const isImage = file.type.startsWith('image/');
  if (!isVideo && !isImage) {
    return NextResponse.json(
      { error: 'only image and video uploads are allowed' },
      { status: 415 }
    );
  }

  const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES;
  if (file.size > limit) {
    return NextResponse.json(
      { error: `file too large (max ${Math.round(limit / 1024 / 1024)}MB)` },
      { status: 413 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const result = await uploadMediaBuffer(buffer, file.name || 'upload', {
      folder,
      resourceType: isVideo ? 'video' : 'image',
      localBaseDir: path.join(process.cwd(), 'public', 'uploads'),
      publicPath: '/uploads',
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'upload failed' }, { status: 500 });
  }
}
