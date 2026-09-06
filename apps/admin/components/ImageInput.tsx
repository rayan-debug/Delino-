'use client';
import { useRef, useState } from 'react';
import { Upload, Trash2, Link as LinkIcon } from 'lucide-react';
import { stillImageUrl } from '@luxora/shared/media';
import { uploadFile } from '@/lib/uploadClient';

export default function ImageInput({
  name,
  defaultValue,
  folder = 'luxora',
  label = 'Image',
  aspect = 'aspect-video',
  allowVideo = false,
}: {
  name: string;
  defaultValue?: string;
  folder?: string;
  label?: string;
  aspect?: string;
  allowVideo?: boolean;
}) {
  const [value, setValue] = useState(defaultValue ?? '');
  const [uploading, setUploading] = useState(false);
  const [pct, setPct] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async (file: File) => {
    setError(null);
    setUploading(true);
    setPct(0);
    try {
      const url = await uploadFile(file, folder, (f) => setPct(Math.round(f * 100)));
      setValue(url);
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
        <div className={`w-40 ${aspect} bg-cover bg-center border flex items-center justify-center`} style={{ borderColor: 'var(--c-line)', background: 'var(--c-bg)', backgroundImage: value ? `url(${stillImageUrl(value)})` : undefined }}>
          {!value && <div className="text-[0.6rem] tracking-luxe" style={{ color: 'var(--c-muted)' }}>NO MEDIA</div>}
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 text-xs" style={{ color: 'var(--c-muted)' }}>
            <LinkIcon size={12} /> Paste {allowVideo ? 'an image or video' : 'an image'} URL
          </div>
          <input
            type="url"
            className="admin-input"
            value={value}
            placeholder="https://..."
            onChange={(e) => setValue(e.target.value)}
          />
          <div className="flex items-center gap-2 text-xs mt-3" style={{ color: 'var(--c-muted)' }}>
            <Upload size={12} /> Or upload {allowVideo ? "an image or video" : "an image"} from your computer
          </div>
          <input
            ref={fileRef}
            type="file"
            accept={allowVideo ? "image/*,video/*" : "image/*"}
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) upload(f);
            }}
          />
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload size={14} /> {uploading ? `Uploading… ${pct}%` : 'Upload File'}
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
