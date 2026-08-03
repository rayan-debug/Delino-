'use client';
import { useState } from 'react';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';

type SectionOption = { id: string; title: string };

export default function ProjectForm({
  action,
  project,
  sections = [],
  defaultSectionId = '',
}: {
  action: (fd: FormData) => Promise<void>;
  project?: any;
  sections?: SectionOption[];
  defaultSectionId?: string;
}) {
  const [tags, setTags] = useState<string>((project?.tags ?? []).join(', '));
  const [gallery, setGallery] = useState<string>((project?.gallery ?? []).join('\n'));
  const [sectionId, setSectionId] = useState<string>(project?.sectionId ?? defaultSectionId ?? '');

  return (
    <form action={action} className="space-y-6">
      {project?.id && <input type="hidden" name="id" value={project.id} />}

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Title</label>
            <input className="admin-input" name="title" defaultValue={project?.title ?? ''} required />
          </div>
          <div>
            <label className="field-label">Slug</label>
            <input className="admin-input" name="slug" defaultValue={project?.slug ?? ''} placeholder="auto-generated if blank" />
          </div>
        </div>
        <div>
          <label className="field-label">Section</label>
          <select
            className="admin-input"
            name="sectionId"
            value={sectionId}
            onChange={(e) => setSectionId(e.target.value)}
          >
            <option value="">— No section (use a custom category) —</option>
            {sections.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
          <p className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>
            {sections.length === 0 ? (
              <>
                No sections yet —{' '}
                <a href="/sections/new" className="underline">
                  create one
                </a>{' '}
                to group several projects together on the work page.
              </>
            ) : (
              <>A section can hold as many projects as you like; they all show as a grid under it on the work page.</>
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Category</label>
            <input
              className="admin-input"
              name="category"
              defaultValue={project?.category ?? ''}
              disabled={!!sectionId}
              placeholder={sectionId ? 'Taken from the section' : 'e.g. Logo Design'}
            />
            {!!sectionId && (
              <p className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>
                Set from the section title.
              </p>
            )}
          </div>
          <div>
            <label className="field-label">Year</label>
            <input className="admin-input" name="year" defaultValue={project?.year ?? ''} />
          </div>
          <div>
            <label className="field-label">Client</label>
            <input className="admin-input" name="client" defaultValue={project?.client ?? ''} />
          </div>
        </div>
        <div>
          <label className="field-label">Description</label>
          <textarea className="admin-textarea" name="description" rows={4} defaultValue={project?.description ?? ''} required />
        </div>
        <div>
          <label className="field-label">Tags (comma-separated)</label>
          <input className="admin-input" name="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Web, Booking, CMS" />
        </div>
      </div>

      <div className="card">
        <ImageInput name="image" defaultValue={project?.image ?? ''} folder="luxora/projects" label="Cover Image" aspect="aspect-[4/3]" />
      </div>

      <div className="card">
        <label className="field-label">Gallery (one image URL per line)</label>
        <textarea className="admin-textarea" name="gallery" rows={5} value={gallery} onChange={(e) => setGallery(e.target.value)} placeholder="https://...&#10;https://..." />
        <p className="text-xs mt-2" style={{ color: 'var(--c-muted)' }}>For uploaded images, use the Upload Media tool on its own page (coming soon) or paste Cloudinary URLs.</p>
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="field-label">Order</label>
          <input className="admin-input" type="number" name="order" defaultValue={project?.order ?? 0} />
        </div>
        <div>
          <label className="field-label">Featured</label>
          <select className="admin-input" name="featured" defaultValue={project?.featured ? 'true' : 'false'}>
            <option value="false">No</option>
            <option value="true">Yes — show on homepage</option>
          </select>
        </div>
        <div>
          <label className="field-label">Status</label>
          <select className="admin-input" name="published" defaultValue={project?.published === false ? 'false' : 'true'}>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton label={project?.id ? 'Save Changes' : 'Create Project'} />
      </div>
    </form>
  );
}
