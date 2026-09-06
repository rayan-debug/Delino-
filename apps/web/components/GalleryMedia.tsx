'use client';
import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { isVideoUrl, videoPosterUrl } from '@luxora/shared/media';

/**
 * One gallery tile. Images keep the original cover-fill treatment; videos get
 * a real player.
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
   * 'cover' fills the card and crops the overflow — right for a cover image
   * whose framing we control. 'contain' shows the whole frame, which a mixed
   * gallery needs: landscape clips fill a 16:9 card while vertical ones
   * pillarbox instead of having their top and bottom sliced off.
   */
  fit?: 'cover' | 'contain';
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const video = isVideoUrl(src);

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
        className={`${aspect} bg-center bg-no-repeat ${
          fit === 'contain' ? 'bg-contain' : 'bg-cover'
        }`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundColor: fit === 'contain' ? 'var(--c-surface)' : undefined,
        }}
      />
    );
  }

  const still = videoPosterUrl(src) ?? poster;

  return (
    <div className={`relative overflow-hidden ${aspect}`} style={{ background: 'var(--c-surface)' }}>
      <video
        ref={videoRef}
        src={src}
        poster={still ?? undefined}
        preload="none"
        playsInline
        controls={started}
        className={`absolute inset-0 h-full w-full ${
          fit === 'contain' ? 'object-contain' : 'object-cover'
        }`}
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
