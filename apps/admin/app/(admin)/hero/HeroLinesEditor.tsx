'use client';
import { useState } from 'react';
import { Plus, X } from 'lucide-react';

export default function HeroLinesEditor({ defaultLines }: { defaultLines: string[] }) {
  const [lines, setLines] = useState<string[]>(defaultLines.length > 0 ? defaultLines : ['']);

  return (
    <div>
      <label className="field-label">Headline lines</label>
      <input type="hidden" name="headlineLines" value={JSON.stringify(lines)} />
      <div className="space-y-2">
        {lines.map((l, i) => (
          <div key={i} className="flex gap-2">
            <input
              className="admin-input flex-1"
              value={l}
              onChange={(e) => setLines(lines.map((x, idx) => (idx === i ? e.target.value : x)))}
              placeholder={`Line ${i + 1}`}
            />
            <button
              type="button"
              className="btn btn-danger btn-icon"
              onClick={() => setLines(lines.filter((_, idx) => idx !== i))}
              title="Remove line"
            >
              <X size={14} />
            </button>
          </div>
        ))}
        <button type="button" className="btn btn-secondary" onClick={() => setLines([...lines, ''])}>
          <Plus size={14} /> Add line
        </button>
      </div>
    </div>
  );
}
