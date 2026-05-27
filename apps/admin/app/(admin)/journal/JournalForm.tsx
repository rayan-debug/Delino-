'use client';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';

export default function JournalForm({ action, post }: { action: (fd: FormData) => Promise<void>; post?: any }) {
  return (
    <form action={action} className="space-y-6">
      {post?.id && <input type="hidden" name="id" value={post.id} />}

      <div className="card space-y-4">
        <div>
          <label className="field-label">Title</label>
          <input className="admin-input" name="title" defaultValue={post?.title ?? ''} required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="field-label">Slug</label>
            <input className="admin-input" name="slug" defaultValue={post?.slug ?? ''} placeholder="auto" />
          </div>
          <div>
            <label className="field-label">Category</label>
            <input className="admin-input" name="category" defaultValue={post?.category ?? 'Essay'} />
          </div>
          <div>
            <label className="field-label">Read time</label>
            <input className="admin-input" name="readTime" defaultValue={post?.readTime ?? '5 min read'} />
          </div>
        </div>
        <div>
          <label className="field-label">Excerpt</label>
          <textarea className="admin-textarea" name="excerpt" rows={2} defaultValue={post?.excerpt ?? ''} required />
        </div>
        <div>
          <label className="field-label">Body (use blank lines for paragraphs)</label>
          <textarea className="admin-textarea" name="body" rows={10} defaultValue={post?.body ?? ''} />
        </div>
      </div>

      <div className="card">
        <ImageInput name="image" defaultValue={post?.image ?? ''} folder="luxora/journal" label="Cover Image" aspect="aspect-[16/9]" />
      </div>

      <div className="card grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="field-label">Status</label>
          <select className="admin-input" name="published" defaultValue={post?.published === false ? 'false' : 'true'}>
            <option value="true">Published</option>
            <option value="false">Draft</option>
          </select>
        </div>
        <div>
          <label className="field-label">Publish date</label>
          <input className="admin-input" type="date" name="publishedAt" defaultValue={post?.publishedAt ? new Date(post.publishedAt).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10)} />
        </div>
      </div>

      <div className="flex justify-end">
        <SaveButton label={post?.id ? 'Save Changes' : 'Create Entry'} />
      </div>
    </form>
  );
}
