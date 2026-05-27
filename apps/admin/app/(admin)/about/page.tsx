import { prisma } from '@luxora/db';
import { DEFAULT_ABOUT } from '@luxora/db/defaults';
import PageHeader from '@/components/PageHeader';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';
import StatsValuesEditor from './StatsValuesEditor';
import { saveAbout } from './actions';

export const dynamic = 'force-dynamic';

export default async function AboutAdminPage() {
  let about: any;
  try {
    about = await prisma.aboutContent.findUnique({
      where: { id: 'default' },
      include: { stats: { orderBy: { order: 'asc' } }, values: { orderBy: { order: 'asc' } } },
    });
    if (!about) {
      about = await prisma.aboutContent.create({
        data: {
          id: 'default',
          eyebrow: DEFAULT_ABOUT.eyebrow,
          headline: DEFAULT_ABOUT.headline,
          body: DEFAULT_ABOUT.body,
          image: DEFAULT_ABOUT.image,
          stats: { create: DEFAULT_ABOUT.stats },
          values: { create: DEFAULT_ABOUT.values },
        },
        include: { stats: true, values: true },
      });
    }
  } catch {
    about = { ...DEFAULT_ABOUT, stats: DEFAULT_ABOUT.stats, values: DEFAULT_ABOUT.values };
  }

  return (
    <div>
      <PageHeader title="About" subtitle="The studio's story, statistics, and values." />
      <form action={saveAbout} className="p-8 max-w-3xl space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="field-label">Eyebrow</label>
            <input className="admin-input" name="eyebrow" defaultValue={about.eyebrow} />
          </div>
          <div>
            <label className="field-label">Headline</label>
            <input className="admin-input" name="headline" defaultValue={about.headline} required />
          </div>
          <div>
            <label className="field-label">Body</label>
            <textarea className="admin-textarea" name="body" rows={6} defaultValue={about.body} />
          </div>
        </div>

        <div className="card">
          <ImageInput name="image" defaultValue={about.image} folder="luxora/about" label="About Image" aspect="aspect-[4/5]" />
        </div>

        <StatsValuesEditor stats={about.stats} values={about.values} />

        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
