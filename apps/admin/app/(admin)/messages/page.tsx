import { prisma } from '@luxora/db';
import { Trash2, Mail, MailOpen } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { markRead, removeMessage } from './actions';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
  let messages: any[] = [];
  try {
    messages = await prisma.message.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {}

  const unread = messages.filter((m) => !m.read).length;

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle={`Messages from the public contact form${unread ? ` · ${unread} unread` : ''}.`}
      />
      <div className="p-8 max-w-4xl space-y-3">
        {messages.length === 0 && (
          <div className="card text-center" style={{ color: 'var(--c-muted)' }}>No messages yet.</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className="card">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className={m.read ? 'chip chip-muted' : 'chip'}>
                    {m.read ? <MailOpen size={10} /> : <Mail size={10} />} {m.read ? 'Read' : 'New'}
                  </span>
                  <div className="font-display text-lg">{m.name}</div>
                  <a href={`mailto:${m.email}`} className="text-sm" style={{ color: 'var(--c-accent)' }}>{m.email}</a>
                  {m.company && <span className="text-xs" style={{ color: 'var(--c-muted)' }}>· {m.company}</span>}
                </div>
                <p className="mt-3 text-sm leading-relaxed whitespace-pre-wrap">{m.message}</p>
                <div className="text-[0.65rem] tracking-luxe mt-3" style={{ color: 'var(--c-muted)' }}>
                  {new Date(m.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="flex gap-2">
                {!m.read && (
                  <form action={markRead}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="btn btn-secondary"><MailOpen size={14} /> Mark read</button>
                  </form>
                )}
                <form action={removeMessage}>
                  <input type="hidden" name="id" value={m.id} />
                  <button type="submit" className="btn btn-danger btn-icon" onClick={(e) => { if (!confirm('Delete this message?')) e.preventDefault(); }}>
                    <Trash2 size={14} />
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
