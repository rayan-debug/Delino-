import { prisma } from '@luxora/db';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import ProjectForm from '../ProjectForm';
import DeleteProjectButton from './DeleteProjectButton';
import { updateProject, deleteProject } from '../actions';

export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  let project: any = null;
  try {
    project = await prisma.project.findUnique({ where: { id } });
  } catch {}
  if (!project) notFound();

  return (
    <div>
      <PageHeader
        title={project.title}
        subtitle="Edit project"
        actions={<DeleteProjectButton id={project.id} title={project.title} action={deleteProject} />}
      />
      <div className="p-8 max-w-4xl">
        <ProjectForm action={updateProject} project={project} />
      </div>
    </div>
  );
}
