'use client';
import { useMemo } from 'react';

type Particle = {
  left: string;
  top: string;
  size: number;
  delay: string;
  duration: string;
  drift: string;
  opacity: number;
};

function generateParticles(count: number, seed = 1): Particle[] {
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return Array.from({ length: count }, () => ({
    left: `${rand() * 100}%`,
    top: `${rand() * 100}%`,
    size: 1.5 + rand() * 3,
    delay: `${rand() * -20}s`,
    duration: `${10 + rand() * 14}s`,
    drift: `${(rand() - 0.5) * 80}px`,
    opacity: 0.25 + rand() * 0.5,
  }));
}

export default function HeroBackdrop({ accent = '#c9a86a' }: { accent?: string }) {
  const particles = useMemo(() => generateParticles(80, 7), []);
  const sparkles = useMemo(() => generateParticles(24, 13), []);

  return (
    <div
      className="absolute inset-0"
      aria-hidden
      style={{ pointerEvents: 'none', touchAction: 'pan-y', overflow: 'hidden' }}
    >
      <div className="luxora-aurora" style={{ ['--accent' as never]: accent }} />
      {particles.map((p, i) => (
        <span
          key={`d-${i}`}
          className="luxora-dust"
          style={{
            left: p.left,
            top: p.top,
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            background: accent,
            animationDelay: p.delay,
            animationDuration: p.duration,
            ['--drift' as never]: p.drift,
          }}
        />
      ))}
      {sparkles.map((p, i) => (
        <span
          key={`s-${i}`}
          className="luxora-sparkle"
          style={{
            left: p.left,
            top: p.top,
            opacity: p.opacity,
            animationDelay: p.delay,
            animationDuration: `${4 + (i % 5)}s`,
            color: accent,
          }}
        />
      ))}
    </div>
  );
}
