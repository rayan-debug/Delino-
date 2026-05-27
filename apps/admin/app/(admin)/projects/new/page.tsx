import PageHeader from '@/components/PageHeader';
import ProjectForm from '../ProjectForm';
import { createProject } from '../actions';

export default function NewProjectPage() {
  return (
    <div>
      <PageHeader title="New Project" subtitle="Add a new piece of work." />
      <div className="p-8 max-w-4xl">
        <ProjectForm action={createProject} />
      </div>
    </div>
  );
}
