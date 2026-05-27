import { prisma } from '@luxora/db';
import { DEFAULT_SITE } from '@luxora/db/defaults';
import PageHeader from '@/components/PageHeader';
import ImageInput from '@/components/ImageInput';
import SaveButton from '@/components/SaveButton';
import { saveBrand } from './actions';

export const dynamic = 'force-dynamic';

export default async function BrandPage() {
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
      <PageHeader title="Brand & Logo" subtitle="The wordmark, tagline, and logo shown on every page." />
      <form action={saveBrand} className="p-8 max-w-3xl space-y-6">
        <div className="card space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Brand Name</label>
              <input className="admin-input" name="brandName" defaultValue={site.brandName} required />
            </div>
            <div>
              <label className="field-label">Tagline</label>
              <input className="admin-input" name="brandTagline" defaultValue={site.brandTagline} />
            </div>
          </div>
        </div>

        <div className="card">
          <ImageInput name="brandLogoUrl" defaultValue={site.brandLogoUrl ?? ''} folder="luxora/brand" label="Logo Mark (optional)" aspect="aspect-[2/1]" />
          <p className="text-xs mt-3" style={{ color: 'var(--c-muted)' }}>
            If no logo is set, the brand name + tagline appears as a wordmark.
          </p>
        </div>

        <div className="card space-y-4">
          <h3 className="font-display text-lg">Footer</h3>
          <div>
            <label className="field-label">Footer Note</label>
            <textarea className="admin-textarea" name="footerNote" defaultValue={site.footerNote} rows={2} />
          </div>
          <div>
            <label className="field-label">Copyright Line</label>
            <input className="admin-input" name="footerCopyright" defaultValue={site.footerCopyright} />
          </div>
        </div>

        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
