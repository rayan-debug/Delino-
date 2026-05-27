import PageHeader from '@/components/PageHeader';
import JournalForm from '../JournalForm';
import { createPost } from '../actions';

export default function NewJournalPage() {
  return (
    <div>
      <PageHeader title="New Journal Entry" subtitle="Write something considered." />
      <div className="p-8 max-w-3xl">
        <JournalForm action={createPost} />
      </div>
    </div>
  );
}
