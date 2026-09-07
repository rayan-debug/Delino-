'use client';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { isVideoUrl, videoPosterUrl, optimizedVideoUrl, optimizedImageUrl } from '@luxora/shared/media';

/**
 * One gallery tile.
 *
 * Every card is the same shape — the grid stays even and predictable — and the
 * media is fitted inside it rather than cropped to fill it. With `contain`, a
 * landscape clip spans the card edge to edge and a vertical one sits centred
 * against the surface colour, whole either way.
 *
 * Videos stay unloaded (`preload="none"`) behind their poster until the viewer
 * hits play — a project page can hold a dozen clips, and preloading them all
 * would cost tens of megabytes on first paint. Playback pauses when the tile
 * scrolls out of view so two clips never talk over each other.
 */
export default function GalleryMedia({
  src,
  poster,
  aspect = 'aspect-video',
  fit = 'cover',
}: {
  src: string;
  poster?: string;
  aspect?: string;
  /**
   * 'cover' fills the card and crops the overflow — right for a cover image
   * whose framing we choose. 'contain' shows the whole frame, which a gallery
   * of mixed orientations needs.
   */
  fit?: 'cover' | 'contain';
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const video = isVideoUrl(src);
  const still = video ? videoPosterUrl(src) ?? optimizedImageUrl(poster) : optimizedImageUrl(src);
  const contain = fit === 'contain';

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

  if (!video) {
    return (
      <div
        className={`${aspect} bg-center bg-no-repeat ${contain ? 'bg-contain' : 'bg-cover'}`}
        style={{
          backgroundImage: `url(${optimizedImageUrl(src)})`,
          backgroundColor: 'var(--c-surface)',
        }}
      />
    );
  }

  return (
    <div className={`relative overflow-hidden ${aspect}`} style={{ background: 'var(--c-surface)' }}>
      <video
        ref={videoRef}
        src={optimizedVideoUrl(src)}
        poster={still ?? undefined}
        preload="none"
        playsInline
        controls={started}
        className={`absolute inset-0 h-full w-full ${contain ? 'object-contain' : 'object-cover'}`}
        onPlay={() => setStarted(true)}
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
