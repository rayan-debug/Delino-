'use client';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';

export default function SectionForm({
  action,
  section,
}: {
  action: (fd: FormData) => Promise<void>;
  section?: any;
}) {
  return (
    <form action={action} className="space-y-6">
      {section?.id && <input type="hidden" name="id" value={section.id} />}

      <div className="card space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Section Title</label>
            <input
              className="admin-input"
              name="title"
              defaultValue={section?.title ?? ''}
              placeholder="Logo Design"
              required
            />
          </div>
          <div>
            <label className="field-label">Slug</label>
            <input
              className="admin-input"
              name="slug"
              defaultValue={section?.slug ?? ''}
              placeholder="auto-generated if blank"
            />
          </div>
        </div>
        <div>
          <label className="field-label">Description (optional)</label>
          <textarea
            className="admin-textarea"
            name="description"
            rows={3}
            defaultValue={section?.description ?? ''}
            placeholder="Shown under the section heading on the work page."
          />
        </div>
      </div>

      <div className="card">
        <ImageInput
          name="image"
          defaultValue={section?.image ?? ''}
          folder="luxora/sections"
          label="Section Cover (optional)"
          aspect="aspect-[4/3]"
        />
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Order</label>
          <input className="admin-input" type="number" name="order" defaultValue={section?.order ?? 0} />
        </div>
        <div>
          <label className="field-label">Status</label>
          <select
            className="admin-input"
            name="published"
            defaultValue={section?.published === false ? 'false' : 'true'}
          >
            <option value="true">Published</option>
            <option value="false">Hidden</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton label={section?.id ? 'Save Changes' : 'Create Section'} />
      </div>
    </form>
  );
}
