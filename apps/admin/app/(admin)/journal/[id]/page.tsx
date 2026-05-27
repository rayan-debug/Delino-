import { prisma } from '@luxora/db';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import JournalForm from '../JournalForm';
import { updatePost, deletePost } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditJournalPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let post: any = null;
  try {
    post = await prisma.journalPost.findUnique({ where: { id } });
  } catch {}
  if (!post) notFound();

  return (
    <div>
      <PageHeader
        title={post.title}
        subtitle="Edit entry"
        actions={
          <form action={deletePost}>
            <input type="hidden" name="id" value={post.id} />
            <button type="submit" className="btn btn-danger" onClick={(e) => { if (!confirm(`Delete "${post.title}"?`)) e.preventDefault(); }}>
              Delete
            </button>
          </form>
        }
      />
      <div className="p-8 max-w-3xl">
        <JournalForm action={updatePost} post={post} />
      </div>
    </div>
  );
}
