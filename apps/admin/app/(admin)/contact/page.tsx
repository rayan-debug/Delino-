import { prisma } from '@luxora/db';
import { DEFAULT_CONTACT } from '@luxora/db/defaults';
import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import StudiosSocialsEditor from './StudiosSocialsEditor';
import { saveContact } from './actions';

export const dynamic = 'force-dynamic';

export default async function ContactAdminPage() {
  let contact: any;
  try {
    contact = await prisma.contactContent.findUnique({
      where: { id: 'default' },
      include: { studios: { orderBy: { order: 'asc' } }, socials: { orderBy: { order: 'asc' } } },
    });
    if (!contact) {
      contact = await prisma.contactContent.create({
        data: {
          id: 'default',
          headline: DEFAULT_CONTACT.headline,
          email: DEFAULT_CONTACT.email,
          phone: DEFAULT_CONTACT.phone,
          address: DEFAULT_CONTACT.address,
          studios: { create: DEFAULT_CONTACT.studios },
          socials: { create: DEFAULT_CONTACT.socials },
        },
        include: { studios: true, socials: true },
      });
    }
  } catch {
    contact = { ...DEFAULT_CONTACT, studios: DEFAULT_CONTACT.studios, socials: DEFAULT_CONTACT.socials };
  }

  return (
    <div>
      <PageHeader title="Contact & Studios" subtitle="The page visitors see when they want to reach you." />
      <form action={saveContact} className="p-8 max-w-3xl space-y-6">
        <div className="card space-y-4">
          <div>
            <label className="field-label">Headline</label>
            <input className="admin-input" name="headline" defaultValue={contact.headline} required />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="field-label">Email</label>
              <input className="admin-input" type="email" name="email" defaultValue={contact.email} />
            </div>
            <div>
              <label className="field-label">Phone</label>
              <input className="admin-input" name="phone" defaultValue={contact.phone} />
            </div>
          </div>
          <div>
            <label className="field-label">Primary address</label>
            <input className="admin-input" name="address" defaultValue={contact.address} />
          </div>
        </div>

        <StudiosSocialsEditor studios={contact.studios} socials={contact.socials} />

        <div className="flex justify-end">
          <SaveButton />
        </div>
      </form>
    </div>
  );
}
