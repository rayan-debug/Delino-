import { prisma } from '@luxora/db';
import { Plus } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import DeleteButton from '@/components/DeleteButton';
import { addService, removeService } from './actions';
import ServiceRow from './ServiceRow';

export const dynamic = 'force-dynamic';

const ICONS = ['monitor', 'pen', 'play', 'camera', 'sparkles', 'compass', 'layers', 'briefcase'];

export default async function ServicesPage() {
  let services: any[] = [];
  try {
    services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
  } catch {}

  return (
    <div>
      <PageHeader title="Services" subtitle="The disciplines you offer. Shown on Home and on /services." />
      <div className="p-8 max-w-4xl space-y-6">
        <form action={addService} className="card">
          <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Plus size={18} /> Add a service</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="field-label">Icon</label>
              <select name="icon" className="admin-input" defaultValue="monitor">
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Title</label>
              <input className="admin-input" name="title" required />
            </div>
          </div>
          <div className="mt-4">
            <label className="field-label">Description</label>
            <textarea className="admin-textarea" name="description" rows={3} required />
          </div>
          <div className="mt-4 flex justify-end">
            <button type="submit" className="btn"><Plus size={14} /> Add Service</button>
          </div>
        </form>

        <div className="space-y-3">
          {services.length === 0 && (
            <div className="card text-center" style={{ color: 'var(--c-muted)' }}>No services yet.</div>
          )}
          {services.map((s) => (
            <ServiceRow key={s.id} service={s} />
          ))}
        </div>
      </div>
    </div>
  );
}
