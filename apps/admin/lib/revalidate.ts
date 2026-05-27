import { revalidatePath, revalidateTag } from 'next/cache';

// After admin writes, ping the web app to revalidate (best-effort).
export async function bustWebCache(paths: string[] = ['/']) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return;
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return;
  try {
    await Promise.all(
      paths.map((p) =>
        fetch(`${siteUrl}/api/revalidate?path=${encodeURIComponent(p)}&secret=${encodeURIComponent(secret)}`, {
          method: 'POST',
          cache: 'no-store',
        }).catch(() => null)
      )
    );
  } catch {
    // ignore
  }
}

export { revalidatePath, revalidateTag };
