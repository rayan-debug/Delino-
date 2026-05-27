'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { ArrowRight, Check } from 'lucide-react';
import type { ContactFormState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary" disabled={pending}>
      {pending ? 'Sending…' : 'Send Message'} <ArrowRight size={14} />
    </button>
  );
}

export default function ContactForm({
  action,
}: {
  action: (state: ContactFormState, fd: FormData) => Promise<ContactFormState>;
}) {
  const [state, formAction] = useActionState<ContactFormState, FormData>(action, { status: 'idle' });

  if (state.status === 'ok') {
    return (
      <div className="glass p-12 text-center">
        <div className="w-14 h-14 rounded-full mx-auto flex items-center justify-center" style={{ background: 'var(--c-accent)', color: 'var(--c-bg)' }}>
          <Check size={26} />
        </div>
        <h3 className="font-display text-3xl mt-6">Thank you.</h3>
        <p className="mt-4" style={{ color: 'var(--c-muted)' }}>
          Your message has reached the studio. We will get back to you within two business days.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <label className="field-label">Your name</label>
          <input className="field" name="name" placeholder="Camille Laurent" required />
        </div>
        <div>
          <label className="field-label">Email</label>
          <input className="field" type="email" name="email" placeholder="you@brand.com" required />
        </div>
      </div>
      <div>
        <label className="field-label">Company / Property</label>
        <input className="field" name="company" placeholder="Grand Luxe Resort" />
      </div>
      <div>
        <label className="field-label">Tell us about your project</label>
        <textarea className="field" rows={5} name="message" placeholder="A few sentences is plenty." required />
      </div>
      {state.status === 'error' && (
        <div className="text-sm" style={{ color: '#e07c7c' }}>{state.message}</div>
      )}
      <SubmitButton />
    </form>
  );
}
