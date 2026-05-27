import { NextResponse } from 'next/server';
import path from 'node:path';
import { uploadImageBuffer } from '@luxora/shared/cloudinary';
import { getSession } from '@/lib/session';

export const runtime = 'nodejs';

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
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: 'file too large (max 10MB)' }, { status: 413 });
  }
  if (!file.type.startsWith('image/')) {
    return NextResponse.json({ error: 'only image uploads are allowed' }, { status: 415 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  try {
    const result = await uploadImageBuffer(buffer, file.name || 'upload', {
      folder,
      localBaseDir: path.join(process.cwd(), 'public', 'uploads'),
      publicPath: '/uploads',
    });
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'upload failed' }, { status: 500 });
  }
}
