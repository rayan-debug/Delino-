import { Lock } from 'lucide-react';
import LoginForm from './LoginForm';
import { loginAction } from './actions';

export const metadata = { title: 'Sign In' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--c-bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="font-display text-3xl tracking-luxe">LUXORA</div>
          <div className="text-[0.6rem] tracking-luxe mt-1" style={{ color: 'var(--c-muted)' }}>
            STUDIO ADMIN
          </div>
        </div>
        <div className="glass p-8 rounded-md">
          <div className="flex items-center gap-3 mb-6">
            <Lock size={18} style={{ color: 'var(--c-accent)' }} />
            <h1 className="font-display text-xl">Sign in</h1>
          </div>
          <LoginForm action={loginAction} />
        </div>
        <p className="text-center text-xs mt-6" style={{ color: 'var(--c-muted)' }}>
          Use the credentials set in your env (ADMIN_EMAIL / ADMIN_PASSWORD).
        </p>
      </div>
    </div>
  );
}
