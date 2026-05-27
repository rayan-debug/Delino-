'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { bustWebCache } from '@/lib/revalidate';
import { redirect } from 'next/navigation';

export async function saveHero(formData: FormData) {
  let lines: string[] = [];
  try {
    const raw = String(formData.get('headlineLines') ?? '[]');
    lines = (JSON.parse(raw) as string[]).map((l) => l.trim()).filter(Boolean);
  } catch {
    lines = [];
  }

  await prisma.heroContent.update({
    where: { id: 'default' },
    data: {
      eyebrow: String(formData.get('eyebrow') ?? ''),
      headlineLines: lines,
      description: String(formData.get('description') ?? ''),
      image: String(formData.get('image') ?? ''),
      trustBadge: String(formData.get('trustBadge') ?? ''),
      primaryCta: String(formData.get('primaryCta') ?? ''),
      secondaryCta: String(formData.get('secondaryCta') ?? ''),
    },
  });
  revalidatePath('/hero');
  await bustWebCache(['/']);
  redirect('/hero');
}
