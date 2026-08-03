import Link from 'next/link';
import { prisma } from '@luxora/db';
import { Plus, Pencil, FolderTree } from 'lucide-react';
import PageHeader from '@/components/PageHeader';

export const dynamic = 'force-dynamic';

type Group = { id: string | null; title: string; projects: any[] };

export default async function ProjectsListPage() {
  let projects: any[] = [];
  let sections: any[] = [];
  try {
    [projects, sections] = await Promise.all([
      prisma.project.findMany({ orderBy: { order: 'asc' } }),
      prisma.workSection.findMany({ orderBy: { order: 'asc' } }),
    ]);
  } catch {}

  // One group per section, in section order, then a catch-all for projects
  // that have not been assigned to a section yet.
  const groups: Group[] = sections.map((s) => ({
    id: s.id,
    title: s.title,
    projects: projects.filter((p) => p.sectionId === s.id),
  }));
  const unassigned = projects.filter((p) => !p.sectionId);
  if (unassigned.length > 0) {
    groups.push({ id: null, title: 'No section', projects: unassigned });
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        subtitle="All work that appears on the public site, grouped by section."
        actions={
          <>
            <Link href="/sections" className="btn btn-secondary">
              <FolderTree size={14} /> Sections
            </Link>
            <Link href="/projects/new" className="btn">
              <Plus size={14} /> New Project
            </Link>
          </>
        }
      />
      <div className="p-8 space-y-8">
        {projects.length === 0 && (
          <div className="card text-center py-12" style={{ color: 'var(--c-muted)' }}>
            No projects yet.
          </div>
        )}

        {groups.map((g) => (
          <div key={g.id ?? 'none'}>
            <div className="flex items-end justify-between gap-4 mb-3">
              <div>
                <h2 className="font-display text-xl">{g.title}</h2>
                <div className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>
                  {g.projects.length} {g.projects.length === 1 ? 'work' : 'works'}
                </div>
              </div>
              {g.id ? (
                <div className="flex items-center gap-2">
                  <Link href={`/sections/${g.id}`} className="btn btn-secondary">
                    Edit section
                  </Link>
                  <Link href={`/projects/new?section=${g.id}`} className="btn btn-secondary">
                    <Plus size={14} /> Add to section
                  </Link>
                </div>
              ) : null}
            </div>

            <div className="card p-0 overflow-hidden">
              <table className="table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Year</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {g.projects.length === 0 && (
                    <tr>
                      <td colSpan={4} className="text-center py-8" style={{ color: 'var(--c-muted)' }}>
                        Nothing in this section yet.
                      </td>
                    </tr>
                  )}
                  {g.projects.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 bg-cover bg-center rounded shrink-0"
                            style={{ backgroundImage: `url(${p.image})` }}
                          />
                          <div>
                            <div className="font-display text-base">{p.title}</div>
                            <div className="text-xs" style={{ color: 'var(--c-muted)' }}>
                              /{p.slug}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>{p.year ?? '—'}</td>
                      <td>
                        {p.published ? (
                          <span className="chip">Live</span>
                        ) : (
                          <span className="chip chip-muted">Draft</span>
                        )}
                        {p.featured && <span className="chip ml-2">Featured</span>}
                      </td>
                      <td className="text-right">
                        <Link href={`/projects/${p.id}`} className="btn btn-secondary btn-icon" title="Edit">
                          <Pencil size={14} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
