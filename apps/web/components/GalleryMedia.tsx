'use client';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { isVideoUrl, videoPosterUrl } from '@luxora/shared/media';

// Guard rails so one freak panorama or a sliver of a clip can't wreck the row.
const MIN_RATIO = 0.5; // tallest allowed  (1:2)
const MAX_RATIO = 2.0; // widest allowed   (2:1)

const clamp = (r: number) => Math.min(MAX_RATIO, Math.max(MIN_RATIO, r));

/**
 * One gallery tile, shaped to fit its own media.
 *
 * The card measures what it holds and takes that aspect ratio, so a landscape
 * clip gets a landscape card and a vertical one gets a tall card — no letterbox
 * bars, no cropping, and the grid ends up with a natural mix of shapes.
 *
 * Measuring is free for video: the poster frame is already being fetched to
 * display, and it shares the clip's dimensions, so reading it avoids pulling
 * video metadata over the wire. `aspect` is the fallback used until the real
 * ratio is known and if measurement fails.
 *
 * Videos stay unloaded (`preload="none"`) behind their poster until the viewer
 * hits play — a project page can hold a dozen clips, and preloading them all
 * would cost tens of megabytes on first paint. Playback pauses when the tile
 * scrolls out of view so two clips never talk over each other.
 */
export default function GalleryMedia({
  src,
  poster,
  aspect = 'aspect-[4/5]',
  fit = 'cover',
}: {
  src: string;
  poster?: string;
  aspect?: string;
  /**
   * 'cover' fills the card and crops the overflow. 'contain' shows the whole
   * frame. Once the card matches its media the two look identical; contain is
   * the safe default for a gallery, where a fallback shape may still apply.
   */
  fit?: 'cover' | 'contain';
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const [ratio, setRatio] = useState<number | null>(null);
  const video = isVideoUrl(src);
  // What we display behind the play button. The `poster` prop is a generic
  // project cover, fine to look at but NOT this clip's own frame.
  const still = video ? videoPosterUrl(src) ?? poster : src;
  // What we are allowed to measure: only media that genuinely shares this
  // item's dimensions. Measuring the fallback cover would shape the card to
  // the wrong thing entirely.
  const measurable = video ? videoPosterUrl(src) : src;

  useEffect(() => {
    let cancelled = false;
    if (!measurable) return;
    const img = new Image();
    img.onload = () => {
      if (!cancelled && img.naturalWidth && img.naturalHeight) {
        setRatio(clamp(img.naturalWidth / img.naturalHeight));
      }
    };
    img.src = measurable;
    return () => {
      cancelled = true;
    };
  }, [measurable]);

  useEffect(() => {
    const el = videoRef.current;
    if (!video || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting && !el.paused) el.pause();
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [video]);

  // Once measured the ratio wins; until then the caller's class holds the space
  // so the layout doesn't jump.
  const shape = ratio ? '' : aspect;
  const shapeStyle = ratio ? { aspectRatio: String(ratio) } : undefined;
  const objectFit = fit === 'contain' ? 'object-contain' : 'object-cover';

  if (!video) {
    return (
      <div
        className={`${shape} bg-center bg-no-repeat ${
          fit === 'contain' && !ratio ? 'bg-contain' : 'bg-cover'
        }`}
        style={{
          ...shapeStyle,
          backgroundImage: `url(${src})`,
          backgroundColor: 'var(--c-surface)',
        }}
      />
    );
  }

  return (
    <div
      className={`relative overflow-hidden ${shape}`}
      style={{ ...shapeStyle, background: 'var(--c-surface)' }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={still ?? undefined}
        // With no measurable poster, load just the header (a few KB, since the
        // files are written faststart) so the clip can report its own size.
        preload={measurable ? 'none' : 'metadata'}
        playsInline
        controls={started}
        className={`absolute inset-0 h-full w-full ${ratio ? 'object-cover' : objectFit}`}
        onPlay={() => setStarted(true)}
        onLoadedMetadata={(e) => {
          // Belt and braces: if the poster never resolved, take the real
          // dimensions once the clip itself reports them.
          const el = e.currentTarget;
          if (!ratio && el.videoWidth && el.videoHeight) {
            setRatio(clamp(el.videoWidth / el.videoHeight));
          }
        }}
      />
      {!started && (
        <button
          type="button"
          aria-label="Play video"
          data-hover
          onClick={() => void videoRef.current?.play()}
          className="absolute inset-0 flex items-center justify-center group"
          style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.15), rgba(0,0,0,0.45))' }}
        >
          <span
            className="flex h-16 w-16 items-center justify-center rounded-full border transition-transform duration-500 group-hover:scale-110"
            style={{
              borderColor: 'var(--c-accent)',
              background: 'rgba(0,0,0,0.35)',
              color: 'var(--c-accent)',
            }}
          >
            <Play size={20} fill="currentColor" />
          </span>
        </button>
      )}
    </div>
  );
}
