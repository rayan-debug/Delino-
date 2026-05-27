'use client';
import { useRef, useState } from 'react';
import { Upload, Trash2, Link as LinkIcon } from 'lucide-react';

export default function ImageInput({
  name,
  defaultValue,
  folder = 'luxora',
  label = 'Image',
  aspect = 'aspect-video',
}: {
  name: string;
  defaultValue?: string;
  folder?: string;
  label?: string;
  aspect?: string;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('folder', folder);
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      if (!res.ok) throw new Error('Upload failed');
      const data = (await res.json()) as { url: string };
      setValue(data.url);
    } catch (e: any) {
      setError(e.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <input type="hidden" name={name} value={value} />
      <div className="flex gap-3 items-start">
        <div className={`w-40 ${aspect} bg-cover bg-center border flex items-center justify-center`} style={{ borderColor: 'var(--c-line)', background: 'var(--c-bg)', backgroundImage: value ? `url(${value})` : undefined }}>
          {!value && <div className="text-[0.6rem] tracking-luxe" style={{ color: 'var(--c-muted)' }}>NO IMAGE</div>}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--c-muted)' }}>
            <LinkIcon size={12} /> Paste an image URL
          </div>
          <input
            type="url"
            className="admin-input"
            value={value}
            placeholder="https://..."
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex items-center gap-2 text-xs mt-3" style={{ color: 'var(--c-muted)' }}>
            <Upload size={12} /> Or upload from your computer
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload size={14} /> {uploading ? 'Uploading…' : 'Upload File'}
            </button>
            {value && (
              <button type="button" className="btn btn-secondary" onClick={() => setValue('')}>
                <Trash2 size={14} /> Clear
              </button>
            )}
          </div>
          {error && <div className="text-xs mt-1" style={{ color: '#e07c7c' }}>{error}</div>}
        </div>
      </div>
    </div>
  );
}
