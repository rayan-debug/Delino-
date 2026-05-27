import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const secret = searchParams.get('secret');
  if (!process.env.ADMIN_SESSION_SECRET || secret !== process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }
  const path = searchParams.get('path') ?? '/';
  try {
    revalidatePath(path);
    return NextResponse.json({ ok: true, path });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? 'failed' }, { status: 500 });
  }
}
