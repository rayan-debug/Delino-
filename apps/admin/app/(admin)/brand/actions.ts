'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { bustWebCache } from '@/lib/revalidate';
import { redirect } from 'next/navigation';

export async function saveBrand(formData: FormData) {
  const data = {
    brandName: String(formData.get('brandName') ?? '').trim() || 'LUXORA',
    brandTagline: String(formData.get('brandTagline') ?? '').trim(),
    brandLogoUrl: (String(formData.get('brandLogoUrl') ?? '').trim() || null) as string | null,
    footerNote: String(formData.get('footerNote') ?? '').trim(),
    footerCopyright: String(formData.get('footerCopyright') ?? '').trim(),
  };
  await prisma.siteSettings.update({ where: { id: 'default' }, data });
  revalidatePath('/brand');
  await bustWebCache(['/']);
  redirect('/brand');
}
