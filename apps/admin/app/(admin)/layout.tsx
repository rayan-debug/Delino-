import Link from 'next/link';
import { LogOut, ExternalLink, Layers, Palette, Home as HomeIcon, Briefcase, Building2, Users, BookOpen, Mail, Inbox, Settings, Image as ImageIcon } from 'lucide-react';
import { requireSession } from '@/lib/session';
import { logoutAction } from './actions';
import LogoutButton from './LogoutButton';

const NAV = [
  { href: '/', label: 'Overview', icon: HomeIcon },
  { href: '/brand', label: 'Brand & Logo', icon: Layers },
  { href: '/theme', label: 'Theme & Fonts', icon: Palette },
  { href: '/hero', label: 'Hero', icon: ImageIcon },
  { href: '/services', label: 'Services', icon: Briefcase },
  { href: '/projects', label: 'Projects', icon: Building2 },
  { href: '/clients', label: 'Clients', icon: Users },
  { href: '/about', label: 'About', icon: BookOpen },
  { href: '/journal', label: 'Journal', icon: BookOpen },
  { href: '/contact', label: 'Contact', icon: Mail },
  { href: '/messages', label: 'Inbox', icon: Inbox },
  { href: '/settings', label: 'Account', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await requireSession();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--c-bg)' }}>
      <aside className="w-64 shrink-0 border-r flex flex-col" style={{ borderColor: 'var(--c-line)', background: 'var(--c-surface)' }}>
        <div className="p-6 border-b" style={{ borderColor: 'var(--c-line)' }}>
          <div className="font-display text-2xl tracking-luxe">LUXORA</div>
          <div className="flex items-center gap-2 mt-2">
            <span className="dot-live" />
            <span className="text-[0.6rem] tracking-luxe" style={{ color: 'var(--c-muted)' }}>
              STUDIO ADMIN
            </span>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="flex items-center gap-3 px-6 py-3 text-sm transition-colors hover:bg-[rgba(201,168,106,0.05)]"
              >
                <Icon size={16} strokeWidth={1.5} />
                <span>{t.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t space-y-3 text-xs" style={{ borderColor: 'var(--c-line)' }}>
          <div style={{ color: 'var(--c-muted)' }}>{session.email}</div>
          <a href={siteUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-[color:var(--c-accent)]">
            <ExternalLink size={14} /> View live site
          </a>
          <LogoutButton action={logoutAction} />
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
