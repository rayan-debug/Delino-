'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { bustWebCache } from '@/lib/revalidate';

export async function saveAbout(formData: FormData) {
  const stats = JSON.parse(String(formData.get('stats') ?? '[]')) as { label: string; value: string }[];
  const values = JSON.parse(String(formData.get('values') ?? '[]')) as { title: string; text: string }[];

  await prisma.aboutContent.update({
    where: { id: 'default' },
    data: {
      eyebrow: String(formData.get('eyebrow') ?? ''),
      headline: String(formData.get('headline') ?? ''),
      body: String(formData.get('body') ?? ''),
      image: String(formData.get('image') ?? ''),
      stats: {
        deleteMany: {},
        create: stats
          .filter((x) => x.label || x.value)
          .map((x, i) => ({ label: x.label, value: x.value, order: i + 1 })),
      },
      values: {
        deleteMany: {},
        create: values
          .filter((x) => x.title || x.text)
          .map((x, i) => ({ title: x.title, text: x.text, order: i + 1 })),
      },
    },
  });
  revalidatePath('/about');
  await bustWebCache(['/', '/about']);
  redirect('/about');
}
