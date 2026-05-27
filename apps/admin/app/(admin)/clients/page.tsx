import { prisma } from '@luxora/db';
import { Plus, Trash2 } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { addClient, updateClient, removeClient } from './actions';

export const dynamic = 'force-dynamic';

export default async function ClientsPage() {
  let clients: any[] = [];
  try {
    clients = await prisma.client.findMany({ orderBy: { order: 'asc' } });
  } catch {}

  return (
    <div>
      <PageHeader title="Clients" subtitle="The brands shown in your client roster." />
      <div className="p-8 max-w-3xl space-y-6">
        <form action={addClient} className="card">
          <h3 className="font-display text-lg mb-4 flex items-center gap-2"><Plus size={18} /> Add a client</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input className="admin-input md:col-span-2" name="name" placeholder="Client name" required />
            <button type="submit" className="btn">Add</button>
          </div>
        </form>

        <div className="card p-0 overflow-hidden">
          <table className="table">
            <thead>
              <tr><th>Order</th><th>Name</th><th>Logo URL</th><th></th></tr>
            </thead>
            <tbody>
              {clients.length === 0 && <tr><td colSpan={4} className="text-center py-8" style={{ color: 'var(--c-muted)' }}>No clients yet.</td></tr>}
              {clients.map((c) => (
                <tr key={c.id}>
                  <td style={{ width: 80 }}>
                    <form action={updateClient} className="flex gap-1">
                      <input type="hidden" name="id" value={c.id} />
                      <input className="admin-input" type="number" name="order" defaultValue={c.order} style={{ width: 70 }} />
                    </form>
                  </td>
                  <td>
                    <form action={updateClient}>
                      <input type="hidden" name="id" value={c.id} />
                      <input className="admin-input" name="name" defaultValue={c.name} />
                    </form>
                  </td>
                  <td>
                    <form action={updateClient}>
                      <input type="hidden" name="id" value={c.id} />
                      <input className="admin-input" name="logoUrl" defaultValue={c.logoUrl ?? ''} placeholder="https://..." />
                    </form>
                  </td>
                  <td>
                    <form action={removeClient}>
                      <input type="hidden" name="id" value={c.id} />
                      <button type="submit" className="btn btn-danger btn-icon" onClick={(e) => { if (!confirm(`Delete ${c.name}?`)) e.preventDefault(); }}>
                        <Trash2 size={14} />
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-xs" style={{ color: 'var(--c-muted)' }}>
          Tip: each cell is its own form — pressing Enter saves that field.
        </p>
      </div>
    </div>
  );
}
