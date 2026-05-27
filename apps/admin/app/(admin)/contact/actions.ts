'use server';
import { prisma } from '@luxora/db';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { bustWebCache } from '@/lib/revalidate';

export async function saveContact(formData: FormData) {
  const studios = JSON.parse(String(formData.get('studios') ?? '[]')) as { city: string; address: string }[];
  const socials = JSON.parse(String(formData.get('socials') ?? '[]')) as { label: string; href: string }[];

  await prisma.contactContent.update({
    where: { id: 'default' },
    data: {
      headline: String(formData.get('headline') ?? ''),
      email: String(formData.get('email') ?? ''),
      phone: String(formData.get('phone') ?? ''),
      address: String(formData.get('address') ?? ''),
      studios: {
        deleteMany: {},
        create: studios.filter((x) => x.city || x.address).map((x, i) => ({ city: x.city, address: x.address, order: i + 1 })),
      },
      socials: {
        deleteMany: {},
        create: socials.filter((x) => x.label || x.href).map((x, i) => ({ label: x.label, href: x.href, order: i + 1 })),
      },
    },
  });
  revalidatePath('/contact');
  await bustWebCache(['/', '/contact']);
  redirect('/contact');
}
