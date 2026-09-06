import { revalidatePath, revalidateTag } from 'next/cache';

// After admin writes, ping the web app to revalidate (best-effort).
export async function bustWebCache(paths: string[] = ['/']) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.warn(
      '[revalidate] NEXT_PUBLIC_SITE_URL is not set on the admin app — the public site will not refresh until its 60s cache expires.'
    );
    return;
  }
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) {
    console.warn('[revalidate] ADMIN_SESSION_SECRET is not set on the admin app — cannot revalidate the public site.');
    return;
  }

  // Every failure here used to be swallowed, so a misconfigured site URL or a
  // secret that doesn't match the web app looked exactly like a broken save:
  // the admin reports success and the live page keeps serving stale content.
  await Promise.all(
    paths.map(async (p) => {
      const url = `${siteUrl}/api/revalidate?path=${encodeURIComponent(p)}&secret=${encodeURIComponent(secret)}`;
      try {
        const res = await fetch(url, { method: 'POST', cache: 'no-store' });
        if (!res.ok) {
          const hint =
            res.status === 401
              ? ' — ADMIN_SESSION_SECRET differs between the admin and web apps'
              : '';
          console.warn(`[revalidate] ${p} failed: HTTP ${res.status}${hint}`);
        }
      } catch (e: any) {
        console.warn(
          `[revalidate] ${p} failed: ${e?.message ?? e} — check NEXT_PUBLIC_SITE_URL points at the public site.`
        );
      }
    })
  );
}

export { revalidatePath, revalidateTag };
