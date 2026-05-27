'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function StudiosSocialsEditor({ studios, socials }: { studios: any[]; socials: any[] }) {
  const [s, setS] = useState(studios.map((x) => ({ city: x.city, address: x.address })));
  const [so, setSo] = useState(socials.map((x) => ({ label: x.label, href: x.href })));

  return (
    <>
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Offices</h3>
          <button type="button" className="btn btn-secondary" onClick={() => setS([...s, { city: '', address: '' }])}>
            <Plus size={14} /> Add office
          </button>
        </div>
        <input type="hidden" name="studios" value={JSON.stringify(s)} />
        <div className="space-y-2">
          {s.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className="admin-input" placeholder="City" value={row.city} onChange={(e) => setS(s.map((x, idx) => idx === i ? { ...x, city: e.target.value } : x))} />
              <input className="admin-input" placeholder="Address" value={row.address} onChange={(e) => setS(s.map((x, idx) => idx === i ? { ...x, address: e.target.value } : x))} />
              <button type="button" className="btn btn-danger btn-icon" onClick={() => setS(s.filter((_, idx) => idx !== i))}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display text-lg">Social links</h3>
          <button type="button" className="btn btn-secondary" onClick={() => setSo([...so, { label: '', href: '' }])}>
            <Plus size={14} /> Add social
          </button>
        </div>
        <input type="hidden" name="socials" value={JSON.stringify(so)} />
        <div className="space-y-2">
          {so.map((row, i) => (
            <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
              <input className="admin-input" placeholder="Label (Instagram)" value={row.label} onChange={(e) => setSo(so.map((x, idx) => idx === i ? { ...x, label: e.target.value } : x))} />
              <input className="admin-input" placeholder="URL" value={row.href} onChange={(e) => setSo(so.map((x, idx) => idx === i ? { ...x, href: e.target.value } : x))} />
              <button type="button" className="btn btn-danger btn-icon" onClick={() => setSo(so.filter((_, idx) => idx !== i))}><X size={14} /></button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
