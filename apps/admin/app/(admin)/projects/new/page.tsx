import { prisma } from '@luxora/db';
import PageHeader from '@/components/PageHeader';
import ProjectForm from '../ProjectForm';
import { createProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ section?: string }>;
}) {
  const { section } = await searchParams;
  let sections: { id: string; title: string }[] = [];
  try {
    sections = await prisma.workSection.findMany({
      orderBy: { order: 'asc' },
      select: { id: true, title: true },
    });
  } catch {}

  const preselected = sections.find((s) => s.id === section);

  return (
    <div>
      <PageHeader
        title="New Project"
        subtitle={preselected ? `Adding to “${preselected.title}”` : 'Add a new piece of work.'}
      />
      <div className="p-8 max-w-4xl">
        <ProjectForm
          action={createProject}
          sections={sections}
          defaultSectionId={preselected?.id ?? ''}
        />
      </div>
    </div>
  );
}
