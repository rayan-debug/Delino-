import { prisma } from '@luxora/db';
import { DEFAULT_SITE } from '@luxora/db/defaults';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import ThemeForm from './ThemeForm';
import { saveTheme } from './actions';

export const dynamic = 'force-dynamic';

export default async function ThemePage() {
  let site: any;
  try {
    site = await prisma.siteSettings.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...DEFAULT_SITE },
      update: {},
    });
  } catch {
    site = { id: 'default', ...DEFAULT_SITE };
  }

  return (
    <div>
      <PageHeader title="Theme & Fonts" subtitle="Colors and typography across the entire site." />
      <form action={saveTheme} className="p-8 max-w-4xl space-y-6">
        <ThemeForm site={site} />
        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
