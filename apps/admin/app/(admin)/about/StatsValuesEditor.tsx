'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

type Stat = { label: string; value: string };
type Value = { title: string; text: string };

export default function StatsValuesEditor({ stats, values }: { stats: any[]; values: any[] }) {
  const [s, setS] = useState<Stat[]>(stats.map((x) => ({ label: x.label, value: x.value })));
  const [v, setV] = useState<Value[]>(values.map((x) => ({ title: x.title, text: x.text })));

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Stats</h3>
          <button type="button" className="btn btn-secondary" onClick={() => setS([...s, { label: '', value: '' }])}>
            <Plus size={14} /> Add stat
          </button>
        </div>
        <input type="hidden" name="stats" value={JSON.stringify(s)} />
        <div className="space-y-2">
          {s.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className="admin-input" placeholder="Value (e.g. 120+)" value={row.value} onChange={(e) => setS(s.map((x, idx) => idx === i ? { ...x, value: e.target.value } : x))} />
              <input className="admin-input" placeholder="Label" value={row.label} onChange={(e) => setS(s.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
              <button type="button" className="btn btn-danger btn-icon" onClick={() => setS(s.filter((_, idx) => idx !== i))}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Values</h3>
          <button type="button" className="btn btn-secondary" onClick={() => setV([...v, { title: '', text: '' }])}>
            <Plus size={14} /> Add value
          </button>
        </div>
        <input type="hidden" name="values" value={JSON.stringify(v)} />
        <div className="space-y-3">
          {v.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_3fr_auto] gap-2 items-start">
              <input className="admin-input" placeholder="Title" value={row.title} onChange={(e) => setV(v.map((x, idx) => idx === i ? { ...x, title: e.target.value } : x))} />
              <textarea className="admin-textarea" rows={2} placeholder="Description" value={row.text} onChange={(e) => setV(v.map((x, idx) => idx === i ? { ...x, text: e.target.value } : x))} />
              <button type="button" className="btn btn-danger btn-icon" onClick={() => setV(v.filter((_, idx) => idx !== i))}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
