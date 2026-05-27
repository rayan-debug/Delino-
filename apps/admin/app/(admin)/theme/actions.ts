'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { bustWebCache } from '@/lib/revalidate';
import { redirect } from 'next/navigation';

export async function saveTheme(formData: FormData) {
  const data = {
    themeBg: String(formData.get('themeBg') ?? '#0a0a0a'),
    themeSurface: String(formData.get('themeSurface') ?? '#141414'),
    themeAccent: String(formData.get('themeAccent') ?? '#c9a86a'),
    themeAccentSoft: String(formData.get('themeAccentSoft') ?? '#d9bf85'),
    themeText: String(formData.get('themeText') ?? '#f5f1ea'),
    themeMuted: String(formData.get('themeMuted') ?? '#9a958e'),
    themeLine: String(formData.get('themeLine') ?? 'rgba(245, 241, 234, 0.12)'),
    fontSerif: String(formData.get('fontSerif') ?? 'Playfair Display'),
    fontSans: String(formData.get('fontSans') ?? 'Inter'),
  };
  await prisma.siteSettings.update({ where: { id: 'default' }, data });
  revalidatePath('/theme');
  await bustWebCache(['/']);
  redirect('/theme');
}
