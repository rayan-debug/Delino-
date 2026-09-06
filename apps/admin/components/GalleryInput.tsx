'use client';
import { useRef, useState } from 'react';
import { Upload, Trash2, ArrowUp, ArrowDown, Film, Image as ImageIcon, AlertCircle } from 'lucide-react';
import { isVideoUrl, videoPosterUrl } from '@luxora/shared/media';
import { uploadFile } from '@/lib/uploadClient';

/**
 * Gallery editor for a project: upload many images or videos at once, paste
 * URLs, reorder, remove. Submits as the same newline-separated string the
 * server action already parses, so nothing downstream changes.
 */
export default function GalleryInput({
  name,
  defaultValue = [],
  folder = 'luxora/projects',
  label = 'Gallery',
}: {
  name: string;
  defaultValue?: string[];
  folder?: string;
  label?: string;
}) {
  const [items, setItems] = useState<string[]>(defaultValue);
  // Removing and reordering only stage a change — nothing is written until the
  // form is submitted. Compare against what we loaded so we can say so.
  const initial = useRef(defaultValue.join('\n'));
  const dirty = items.join('\n') !== initial.current;
  const removedCount = Math.max(0, defaultValue.length - items.length);
  const [pending, setPending] = useState<{
    done: number;
    total: number;
    name: string;
    pct: number;
  } | null>(null);
  const [errors, setErrors] = useState<string[]>([]);
  const [paste, setPaste] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadAll = async (files: File[]) => {
    setErrors([]);
    setPending({ done: 0, total: files.length, name: files[0].name, pct: 0 });
    const added: string[] = [];
    const failed: string[] = [];

    // Sequential: a batch of large clips uploaded at once saturates the
    // connection and makes every individual progress bar meaningless.
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setPending({ done: i, total: files.length, name: file.name, pct: 0 });
      try {
        const url = await uploadFile(file, folder, (fraction) =>
          setPending({ done: i, total: files.length, name: file.name, pct: Math.round(fraction * 100) })
        );
        added.push(url);
      } catch (e: any) {
        failed.push(`${file.name}: ${e?.message ?? 'upload failed'}`);
      }
    }

    setItems((prev) => [...prev, ...added]);
    setErrors(failed);
    setPending(null);
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [row] = next.splice(from, 1);
      next.splice(to, 0, row);
      return next;
    });
  };

  const addPasted = () => {
    const urls = paste
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean);
    if (urls.length) setItems((prev) => [...prev, ...urls]);
    setPaste('');
  };

  return (
    <div>
      <label className="field-label">{label}</label>
      <input type="hidden" name={name} value={items.join('\n')} />

      {dirty && (
        <div
          className="mb-3 flex items-start gap-2 border px-3 py-2 text-xs"
          style={{ borderColor: 'var(--c-accent)', color: 'var(--c-accent)' }}
        >
          <AlertCircle size={14} className="mt-px shrink-0" />
          <span>
            {removedCount > 0
              ? `${removedCount} item${removedCount === 1 ? '' : 's'} removed — not saved yet.`
              : 'Gallery changed — not saved yet.'}{' '}
            Click <strong>Save Changes</strong> at the bottom of this page to apply it.
          </span>
        </div>
      )}

      {items.length > 0 && (
        <ul className="space-y-2 mb-4">
          {items.map((src, i) => {
            const video = isVideoUrl(src);
            const thumb = video ? videoPosterUrl(src) : src;
            return (
              <li
                key={`${src}-${i}`}
                className="flex items-center gap-3 border p-2"
                style={{ borderColor: 'var(--c-line)' }}
              >
                <div
                  className="h-12 w-16 shrink-0 bg-cover bg-center flex items-center justify-center"
                  style={{
                    background: 'var(--c-bg)',
                    backgroundImage: thumb ? `url(${thumb})` : undefined,
                  }}
                >
                  {!thumb &&
                    (video ? (
                      <Film size={14} style={{ color: 'var(--c-muted)' }} />
                    ) : (
                      <ImageIcon size={14} style={{ color: 'var(--c-muted)' }} />
                    ))}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[0.6rem] tracking-luxe uppercase" style={{ color: 'var(--c-accent)' }}>
                    {video ? <Film size={10} /> : <ImageIcon size={10} />}
                    {video ? 'Video' : 'Image'}
                  </div>
                  <div className="truncate text-xs" style={{ color: 'var(--c-muted)' }} title={src}>
                    {src}
                  </div>
                </div>
                <div className="flex shrink-0 gap-1">
                  <button type="button" className="btn btn-secondary" onClick={() => move(i, i - 1)} aria-label="Move up">
                    <ArrowUp size={12} />
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => move(i, i + 1)} aria-label="Move down">
                    <ArrowDown size={12} />
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setItems((prev) => prev.filter((_, n) => n !== i))}
                    aria-label="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <input
        ref={fileRef}
        type="file"
        accept="image/*,video/*"
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) void uploadAll(files);
          e.target.value = '';
        }}
      />
      <button
        type="button"
        className="btn btn-secondary"
        onClick={() => fileRef.current?.click()}
        disabled={!!pending}
      >
        <Upload size={14} />
        {pending
          ? `Uploading ${pending.done + 1}/${pending.total} — ${pending.pct}%`
          : 'Upload Images or Videos'}
      </button>

      {pending && (
        <div className="mt-2">
          <div className="truncate text-xs" style={{ color: 'var(--c-muted)' }}>
            {pending.name}
          </div>
          <div className="mt-1 h-1 w-full" style={{ background: 'var(--c-line)' }}>
            <div
              className="h-1 transition-all duration-200"
              style={{ width: `${pending.pct}%`, background: 'var(--c-accent)' }}
            />
          </div>
        </div>
      )}

      <div className="mt-4">
        <div className="text-xs mb-2" style={{ color: 'var(--c-muted)' }}>
          Or paste URLs, one per line
        </div>
        <textarea
          className="admin-textarea"
          rows={3}
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          placeholder="https://...&#10;https://..."
        />
        <button type="button" className="btn btn-secondary mt-2" onClick={addPasted} disabled={!paste.trim()}>
          Add to gallery
        </button>
      </div>

      {errors.length > 0 && (
        <ul className="mt-3 space-y-1 text-xs" style={{ color: '#e07c7c' }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <p className="text-xs mt-3" style={{ color: 'var(--c-muted)' }}>
        Images up to 10MB, videos up to 200MB. Videos play inline on the project
        page; their poster frame is generated automatically.
      </p>
    </div>
  );
}
