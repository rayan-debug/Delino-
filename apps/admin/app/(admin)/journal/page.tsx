import Link from 'next/link';
import { prisma } from '@luxora/db';
import { Plus, Pencil } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function JournalListPage() {
  let posts: any[] = [];
  try {
    posts = await prisma.journalPost.findMany({ orderBy: { publishedAt: 'desc' } });
  } catch {}

  return (
    <div>
      <PageHeader
        title="Journal"
        subtitle="Editorial entries on craft, design, and hospitality."
        actions={<Link href="/journal/new" className="btn"><Plus size={14} /> New Entry</Link>}
      />
      <div className="p-8">
        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr><th>Title</th><th>Category</th><th>Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {posts.length === 0 && <tr><td colSpan={5} className="text-center py-12" style={{ color: 'var(--c-muted)' }}>No entries yet.</td></tr>}
              {posts.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cover bg-center rounded" style={{ backgroundImage: `url(${p.image})` }} />
                      <div className="font-display text-base">{p.title}</div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{new Date(p.publishedAt).toLocaleDateString()}</td>
                  <td>{p.published ? <span className="chip">Live</span> : <span className="chip chip-muted">Draft</span>}</td>
                  <td className="text-right">
                    <Link href={`/journal/${p.id}`} className="btn btn-secondary btn-icon"><Pencil size={14} /></Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
