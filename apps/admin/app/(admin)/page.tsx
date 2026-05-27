import Link from 'next/link';
import { prisma } from '@luxora/db';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

async function getStats() {
  try {
    const [projects, services, clients, journal, unread] = await Promise.all([
      prisma.project.count(),
      prisma.service.count(),
      prisma.client.count(),
      prisma.journalPost.count(),
      prisma.message.count({ where: { read: false } }),
    ]);
    return { projects, services, clients, journal, unread, ok: true };
  } catch {
    return { projects: 0, services: 0, clients: 0, journal: 0, unread: 0, ok: false };
  }
}

export default async function Dashboard() {
  const stats = await getStats();
  const cards = [
    { label: 'Projects', value: stats.projects, href: '/projects' },
    { label: 'Services', value: stats.services, href: '/services' },
    { label: 'Clients', value: stats.clients, href: '/clients' },
    { label: 'Journal', value: stats.journal, href: '/journal' },
  ];

  return (
    <div>
      <PageHeader title="Overview" subtitle="Welcome back to the studio." />
      <div className="p-8 max-w-6xl space-y-8">
        {!stats.ok && (
          <div className="card" style={{ borderColor: '#b94a4a' }}>
            <div className="font-display text-lg" style={{ color: '#e89a9a' }}>Database not reachable</div>
            <p className="text-sm mt-2" style={{ color: 'var(--c-muted)' }}>
              Make sure <code>DATABASE_URL</code> is set and run <code>pnpm db:push</code> followed by <code>pnpm db:seed</code>.
            </p>
          </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {cards.map((c) => (
            <Link key={c.label} href={c.href} className="card hover:border-[color:var(--c-accent)] transition-colors">
              <div className="eyebrow">{c.label}</div>
              <div className="font-display text-4xl mt-3" style={{ color: 'var(--c-accent)' }}>{c.value}</div>
            </Link>
          ))}
        </div>
        <div className="card">
          <h3 className="font-display text-xl mb-2">Quick start</h3>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--c-muted)' }}>
            Use the sidebar to manage every part of the live website. Updates are written to your Postgres database
            and reflected on the public site after revalidation (or instantly via on-demand revalidation).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mt-6">
            <Link href="/projects" className="btn">Manage Projects</Link>
            <Link href="/theme" className="btn btn-secondary">Customize Theme</Link>
            <Link href="/brand" className="btn btn-secondary">Update Logo</Link>
            <Link href="/messages" className="btn btn-secondary">
              View Inbox {stats.unread > 0 && <span className="chip">{stats.unread}</span>}
            </Link>
            <Link href="/hero" className="btn btn-secondary">Edit Homepage Hero</Link>
            <Link href="/journal" className="btn btn-secondary">Write a Journal Post</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
