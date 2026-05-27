'use server';
import { prisma } from '@luxora/db';

export type ContactFormState =
  | { status: 'idle' }
  | { status: 'ok' }
  | { status: 'error'; message: string };

export async function submitContact(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const company = String(formData.get('company') ?? '').trim() || null;
  const message = String(formData.get('message') ?? '').trim();

  if (!name || !email || !message) {
    return { status: 'error', message: 'Please fill in your name, email, and a message.' };
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return { status: 'error', message: 'That email address doesn\'t look right.' };
  }
  if (message.length > 5000) {
    return { status: 'error', message: 'Message is too long.' };
  }

  try {
    await prisma.message.create({
      data: { name, email, company: company ?? undefined, message },
    });
    return { status: 'ok' };
  } catch (e) {
    return { status: 'error', message: 'Something went wrong on our end. Please try again.' };
  }
}
