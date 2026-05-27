'use client';
import { useState } from 'react';
import { ChevronDown, ChevronUp, Trash2, Save } from 'lucide-react';
import { updateService, removeService } from './actions';

const ICONS = ['monitor', 'pen', 'play', 'camera', 'sparkles', 'compass', 'layers', 'briefcase'];

export default function ServiceRow({ service }: { service: any }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="card">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-4">
          <span className="text-[0.6rem] tracking-luxe px-2 py-1 rounded" style={{ background: 'rgba(201,168,106,0.12)', color: 'var(--c-accent)' }}>
            {service.icon}
          </span>
          <span className="font-display text-lg">{service.title}</span>
        </div>
        {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {open && (
        <form action={updateService} className="mt-4 space-y-4 pt-4 border-t" style={{ borderColor: 'var(--c-line)' }}>
          <input type="hidden" name="id" value={service.id} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="field-label">Icon</label>
              <select name="icon" className="admin-input" defaultValue={service.icon}>
                {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="field-label">Title</label>
              <input className="admin-input" name="title" defaultValue={service.title} required />
            </div>
          </div>
          <div>
            <label className="field-label">Description</label>
            <textarea className="admin-textarea" name="description" rows={3} defaultValue={service.description} required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="field-label">Order</label>
              <input className="admin-input" type="number" name="order" defaultValue={service.order} />
            </div>
            <div>
              <label className="field-label">Status</label>
              <select className="admin-input" name="published" defaultValue={service.published ? 'true' : 'false'}>
                <option value="true">Published</option>
                <option value="false">Hidden</option>
              </select>
            </div>
          </div>
          <div className="flex justify-between gap-2">
            <button
              type="button"
              className="btn btn-danger"
              onClick={(e) => {
                if (!confirm(`Delete "${service.title}"?`)) return;
                const fd = new FormData();
                fd.append('id', service.id);
                removeService(fd);
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
            <button type="submit" className="btn"><Save size={14} /> Save</button>
          </div>
        </form>
      )}
    </div>
  );
}
