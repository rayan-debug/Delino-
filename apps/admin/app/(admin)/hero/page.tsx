import { prisma } from '@luxora/db';
import { DEFAULT_HERO } from '@luxora/db/defaults';
import PageHeader from '@/components/PageHeader';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';
import HeroLinesEditor from './HeroLinesEditor';
import { saveHero } from './actions';

export const dynamic = 'force-dynamic';

export default async function HeroPage() {
  let hero: any;
  try {
    hero = await prisma.heroContent.upsert({
      where: { id: 'default' },
      create: { id: 'default', ...DEFAULT_HERO },
      update: {},
    });
  } catch {
    hero = { id: 'default', ...DEFAULT_HERO };
  }

  return (
    <div>
      <PageHeader title="Homepage Hero" subtitle="The first impression. Make it count." />
      <form action={saveHero} className="p-8 max-w-3xl space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="field-label">Eyebrow</label>
            <input className="admin-input" name="eyebrow" defaultValue={hero.eyebrow} />
          </div>
          <HeroLinesEditor defaultLines={hero.headlineLines as string[]} />
          <div>
            <label className="field-label">Description</label>
            <textarea className="admin-textarea" name="description" rows={4} defaultValue={hero.description} />
          </div>
        </div>

        <div className="card">
          <ImageInput name="image" defaultValue={hero.image} folder="luxora/hero" label="Hero Background Image" aspect="aspect-video" />
        </div>

        <div className="card space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Primary CTA label</label>
              <input className="admin-input" name="primaryCta" defaultValue={hero.primaryCta} />
            </div>
            <div>
              <label className="field-label">Secondary CTA label</label>
              <input className="admin-input" name="secondaryCta" defaultValue={hero.secondaryCta} />
            </div>
          </div>
          <div>
            <label className="field-label">Trust Badge</label>
            <input className="admin-input" name="trustBadge" defaultValue={hero.trustBadge} />
          </div>
        </div>

        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
