import Link from 'next/link';
import { prisma } from '@luxora/db';
import { Plus, Pencil } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

export default async function ProjectsListPage() {
  let projects: any[] = [];
  try {
    projects = await prisma.project.findMany({ orderBy: { order: 'asc' } });
  } catch {}

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="All work that appears on the public site."
        actions={
          <Link href="/projects/new" className="btn">
            <Plus size={14} /> New Project
          </Link>
        }
      />
      <div className="p-8">
        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Project</th>
                <th>Category</th>
                <th>Year</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {projects.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12" style={{ color: 'var(--c-muted)' }}>No projects yet.</td></tr>
              )}
              {projects.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-cover bg-center rounded" style={{ backgroundImage: `url(${p.image})` }} />
                      <div>
                        <div className="font-display text-base">{p.title}</div>
                        <div className="text-xs" style={{ color: 'var(--c-muted)' }}>/{p.slug}</div>
                      </div>
                    </div>
                  </td>
                  <td>{p.category}</td>
                  <td>{p.year ?? '—'}</td>
                  <td>
                    {p.published ? <span className="chip">Live</span> : <span className="chip chip-muted">Draft</span>}
                    {p.featured && <span className="chip ml-2">Featured</span>}
                  </td>
                  <td className="text-right">
                    <Link href={`/projects/${p.id}`} className="btn btn-secondary btn-icon" title="Edit"><Pencil size={14} /></Link>
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
