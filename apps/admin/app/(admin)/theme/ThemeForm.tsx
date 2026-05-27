'use client';
import { useState } from 'react';

const PRESETS = [
  { name: 'Luxora Gold', vals: { themeBg: '#0a0a0a', themeSurface: '#141414', themeAccent: '#c9a86a', themeAccentSoft: '#d9bf85', themeText: '#f5f1ea', themeMuted: '#9a958e', themeLine: 'rgba(245, 241, 234, 0.12)' } },
  { name: 'Riviera Rose', vals: { themeBg: '#0c0808', themeSurface: '#1a1212', themeAccent: '#d4a3a3', themeAccentSoft: '#e6c2c2', themeText: '#f7ede9', themeMuted: '#a89a96', themeLine: 'rgba(247, 237, 233, 0.12)' } },
  { name: 'Marbella Blue', vals: { themeBg: '#070b12', themeSurface: '#0f1620', themeAccent: '#7da6c8', themeAccentSoft: '#a5c2d9', themeText: '#eaf1f8', themeMuted: '#8a9bab', themeLine: 'rgba(234, 241, 248, 0.12)' } },
  { name: 'Atlas Emerald', vals: { themeBg: '#080c0a', themeSurface: '#101715', themeAccent: '#7fae8e', themeAccentSoft: '#a8c8b5', themeText: '#eaf3ee', themeMuted: '#90a098', themeLine: 'rgba(234, 243, 238, 0.12)' } },
  { name: 'Ivory Light', vals: { themeBg: '#f5f1ea', themeSurface: '#ebe6dc', themeAccent: '#8a6f3c', themeAccentSoft: '#a98a51', themeText: '#0e0e0e', themeMuted: '#5b5751', themeLine: 'rgba(14, 14, 14, 0.12)' } },
  { name: 'Onyx Crimson', vals: { themeBg: '#0a0707', themeSurface: '#181010', themeAccent: '#b54a4a', themeAccentSoft: '#d57272', themeText: '#f6ecea', themeMuted: '#9d8a87', themeLine: 'rgba(246, 236, 234, 0.12)' } },
];

const FIELDS: { key: string; label: string }[] = [
  { key: 'themeBg', label: 'Background' },
  { key: 'themeSurface', label: 'Surface' },
  { key: 'themeAccent', label: 'Accent' },
  { key: 'themeAccentSoft', label: 'Accent Soft' },
  { key: 'themeText', label: 'Text' },
  { key: 'themeMuted', label: 'Muted' },
  { key: 'themeLine', label: 'Line' },
];

const FONTS = ['Playfair Display', 'Cormorant Garamond', 'Cinzel', 'Italiana', 'Marcellus', 'Inter'];

export default function ThemeForm({ site }: { site: any }) {
  const [vals, setVals] = useState({
    themeBg: site.themeBg,
    themeSurface: site.themeSurface,
    themeAccent: site.themeAccent,
    themeAccentSoft: site.themeAccentSoft,
    themeText: site.themeText,
    themeMuted: site.themeMuted,
    themeLine: site.themeLine,
    fontSerif: site.fontSerif,
    fontSans: site.fontSans,
  });

  const apply = (next: Record<string, string>) => setVals((v) => ({ ...v, ...next }));

  return (
    <>
      <div className="card">
        <h3 className="font-display text-lg mb-2">Palette Presets</h3>
        <p className="text-xs mb-4" style={{ color: 'var(--c-muted)' }}>One click to switch the entire mood of the site.</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {PRESETS.map((p) => (
            <button
              type="button"
              key={p.name}
              onClick={() => apply(p.vals)}
              className="card card-tight text-left hover:border-[color:var(--c-accent)] transition-colors"
            >
              <div className="flex gap-1 mb-3">
                {[p.vals.themeBg, p.vals.themeSurface, p.vals.themeAccent, p.vals.themeAccentSoft, p.vals.themeText].map((c, i) => (
                  <div key={i} className="w-6 h-6 rounded" style={{ background: c, border: '1px solid rgba(255,255,255,0.08)' }} />
                ))}
              </div>
              <div className="font-display text-sm">{p.name}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-display text-lg mb-4">Colors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FIELDS.map((f) => (
            <div key={f.key}>
              <label className="field-label">{f.label}</label>
              <div className="flex items-center gap-2">
                {f.key !== 'themeLine' && (
                  <input
                    type="color"
                    className="admin-input w-16 flex-shrink-0"
                    value={(vals as any)[f.key]}
                    onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}
                  />
                )}
                <input
                  name={f.key}
                  className="admin-input flex-1 font-mono text-xs"
                  value={(vals as any)[f.key]}
                  onChange={(e) => setVals({ ...vals, [f.key]: e.target.value })}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="font-display text-lg mb-4">Typography</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="field-label">Display Font (headlines)</label>
            <select name="fontSerif" className="admin-input" value={vals.fontSerif} onChange={(e) => setVals({ ...vals, fontSerif: e.target.value })}>
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="field-label">Body Font</label>
            <select name="fontSans" className="admin-input" value={vals.fontSans} onChange={(e) => setVals({ ...vals, fontSans: e.target.value })}>
              {FONTS.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
