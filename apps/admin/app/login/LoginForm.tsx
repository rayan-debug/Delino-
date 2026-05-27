'use client';
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import type { LoginState } from './actions';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn w-full justify-center" disabled={pending}>
      {pending ? 'Signing in…' : 'Sign In'}
    </button>
  );
}

export default function LoginForm({
  action,
}: {
  action: (s: LoginState, fd: FormData) => Promise<LoginState>;
}) {
  const [state, formAction] = useActionState<LoginState, FormData>(action, { status: 'idle' });
  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="field-label">Email</label>
        <input className="admin-input" type="email" name="email" required autoFocus />
      </div>
      <div>
        <label className="field-label">Password</label>
        <input className="admin-input" type="password" name="password" required />
      </div>
      {state.status === 'error' && (
        <div className="text-sm" style={{ color: '#e07c7c' }}>{state.message}</div>
      )}
      <SubmitButton />
    </form>
  );
}
