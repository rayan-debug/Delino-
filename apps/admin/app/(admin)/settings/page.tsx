import PageHeader from '@/components/PageHeader';
import SaveButton from '@/components/SaveButton';
import { changePassword } from './actions';
import { getSession } from '@/lib/session';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await getSession();
  return (
    <div>
      <PageHeader title="Account" subtitle="Manage your admin credentials." />
      <div className="p-8 max-w-xl space-y-6">
        <div className="card">
          <div className="eyebrow mb-2">Signed in as</div>
          <div className="font-display text-xl">{session?.email}</div>
        </div>

        <form action={changePassword} className="card space-y-4">
          <h3 className="font-display text-lg">Change password</h3>
          <div>
            <label className="field-label">Current password</label>
            <input type="password" className="admin-input" name="current" required />
          </div>
          <div>
            <label className="field-label">New password</label>
            <input type="password" className="admin-input" name="next" required minLength={8} />
          </div>
          <div className="flex justify-end">
            <SaveButton label="Update Password" />
          </div>
        </form>
      </div>
    </div>
  );
}
