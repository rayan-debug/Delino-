import Link from 'next/link';
import { prisma } from '@luxora/db';
import { notFound } from 'next/navigation';
import { Plus, Pencil, ChevronUp, ChevronDown } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import SectionForm from '../SectionForm';
import DeleteSectionButton from './DeleteSectionButton';
import RemoveFromSectionButton from './RemoveFromSectionButton';
import {
  updateSection,
  deleteSection,
  moveProjectInSection,
  removeProjectFromSection,
} from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let section: any = null;
  try {
    section = await prisma.workSection.findUnique({
      where: { id },
      include: { projects: { orderBy: { order: 'asc' } } },
    });
  } catch {}
  if (!section) notFound();

  const projects: any[] = section.projects ?? [];

  return (
    <div>
      <PageHeader
        title={section.title}
        subtitle={`${projects.length} project${projects.length === 1 ? '' : 's'} in this section`}
        actions={
          <>
            <Link href={`/projects/new?section=${section.id}`} className="btn">
              <Plus size={14} /> Add Project
            </Link>
            <DeleteSectionButton id={section.id} title={section.title} action={deleteSection} />
          </>
        }
      />

      <div className="p-8 max-w-4xl space-y-8">
        <SectionForm action={updateSection} section={section} />

        <div>
          <div className="flex items-end justify-between gap-4 mb-3">
            <div>
              <h2 className="font-display text-xl">Projects in this section</h2>
              <p className="text-xs mt-1" style={{ color: 'var(--c-muted)' }}>
                These appear as a grid under &ldquo;{section.title}&rdquo; on the work page, in this order.
              </p>
            </div>
            <Link href={`/projects/new?section=${section.id}`} className="btn btn-secondary">
              <Plus size={14} /> Add Project
            </Link>
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
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-12" style={{ color: 'var(--c-muted)' }}>
                      No projects in this section yet. Use “Add Project” to create the first one.
                    </td>
                  </tr>
                )}
                {projects.map((p, i) => (
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
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <form action={moveProjectInSection}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="sectionId" value={section.id} />
                          <input type="hidden" name="direction" value="up" />
                          <button className="btn btn-secondary btn-icon" title="Move up" disabled={i === 0}>
                            <ChevronUp size={14} />
                          </button>
                        </form>
                        <form action={moveProjectInSection}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="sectionId" value={section.id} />
                          <input type="hidden" name="direction" value="down" />
                          <button
                            className="btn btn-secondary btn-icon"
                            title="Move down"
                            disabled={i === projects.length - 1}
                          >
                            <ChevronDown size={14} />
                          </button>
                        </form>
                        <Link href={`/projects/${p.id}`} className="btn btn-secondary btn-icon" title="Edit">
                          <Pencil size={14} />
                        </Link>
                        <RemoveFromSectionButton
                          id={p.id}
                          sectionId={section.id}
                          title={p.title}
                          action={removeProjectFromSection}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
