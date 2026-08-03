import Link from 'next/link';
import { prisma } from '@luxora/db';
import { Plus, Pencil, ChevronUp, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { moveSection } from './actions';

export const dynamic = 'force-dynamic';

export default async function SectionsListPage() {
  let sections: any[] = [];
  let orphanCount = 0;
  try {
    sections = await prisma.workSection.findMany({
      orderBy: { order: 'asc' },
      include: { _count: { select: { projects: true } } },
    });
    orphanCount = await prisma.project.count({ where: { sectionId: null } });
  } catch {}

  return (
    <div>
      <PageHeader
        title="Work Sections"
        subtitle="Groups of projects on the public work page. Each section can hold as many projects as you need."
        actions={
          <Link href="/sections/new" className="btn">
            <Plus size={14} /> New Section
          </Link>
        }
      />
      <div className="p-8 space-y-6">
        {orphanCount > 0 && (
          <div className="card text-sm" style={{ color: 'var(--c-muted)' }}>
            {orphanCount} project{orphanCount === 1 ? '' : 's'} {orphanCount === 1 ? 'is' : 'are'} not
            in a section yet. They still show on the work page, grouped by their old category text —
            open each one under{' '}
            <Link href="/projects" className="underline">
              Projects
            </Link>{' '}
            to assign a section.
          </div>
        )}

        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Projects</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {sections.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-12" style={{ color: 'var(--c-muted)' }}>
                    No sections yet. Create one, then add projects to it.
                  </td>
                </tr>
              )}
              {sections.map((s, i) => (
                <tr key={s.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 bg-cover bg-center rounded shrink-0"
                        style={{
                          backgroundImage: s.image ? `url(${s.image})` : undefined,
                          background: s.image ? undefined : 'var(--c-bg)',
                        }}
                      />
                      <div>
                        <div className="font-display text-base">{s.title}</div>
                        <div className="text-xs" style={{ color: 'var(--c-muted)' }}>
                          /{s.slug}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    {s._count.projects} {s._count.projects === 1 ? 'work' : 'works'}
                  </td>
                  <td>
                    {s.published ? (
                      <span className="chip">Live</span>
                    ) : (
                      <span className="chip chip-muted">Hidden</span>
                    )}
                  </td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <form action={moveSection}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="direction" value="up" />
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Move up"
                          disabled={i === 0}
                        >
                          <ChevronUp size={14} />
                        </button>
                      </form>
                      <form action={moveSection}>
                        <input type="hidden" name="id" value={s.id} />
                        <input type="hidden" name="direction" value="down" />
                        <button
                          className="btn btn-secondary btn-icon"
                          title="Move down"
                          disabled={i === sections.length - 1}
                        >
                          <ChevronDown size={14} />
                        </button>
                      </form>
                      <Link href={`/sections/${s.id}`} className="btn btn-secondary btn-icon" title="Edit">
                        <Pencil size={14} />
                      </Link>
                    </div>
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
