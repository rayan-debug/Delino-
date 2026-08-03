import PageHeader from '@/components/PageHeader';
import SectionForm from '../SectionForm';
import { createSection } from '../actions';

export default function NewSectionPage() {
  return (
    <div>
      <PageHeader title="New Section" subtitle="Create a group, then add as many projects to it as you need." />
      <div className="p-8 max-w-4xl">
        <SectionForm action={createSection} />
      </div>
    </div>
  );
}
