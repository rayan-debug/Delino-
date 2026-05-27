'use client';
import { useState } from 'react';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';

export default function ProjectForm({
  action,
  project,
}: {
  action: (fd: FormData) => Promise<void>;
  project?: any;
}) {
  const [tags, setTags] = useState<string>((project?.tags ?? []).join(', '));
  const [gallery, setGallery] = useState<string>((project?.gallery ?? []).join('\n'));

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Category</label>
            <input className="admin-input" name="category" defaultValue={project?.category ?? ''} required />
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
