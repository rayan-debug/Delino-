'use client';
import { useEffect, useRef } from 'react';

/**
 * Wrap an R3F <Canvas> with this to defeat the touch-action: none and
 * pointer-events that R3F sets on the canvas DOM node — those block
 * page scrolling on Chrome (trackpad gestures are treated as touch).
 * We watch for any style mutation on the inner <canvas> and re-assert
 * the values we need.
 */
export default function PassiveCanvasFix({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    const enforce = () => {
      const canvas = root.querySelector('canvas');
      if (!canvas) return;
      canvas.style.setProperty('touch-action', 'pan-y', 'important');
      canvas.style.setProperty('pointer-events', 'none', 'important');
    };

    enforce();
    const mo = new MutationObserver(enforce);
    mo.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['style'] });

    return () => mo.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0"
      style={{ pointerEvents: 'none', touchAction: 'pan-y' }}
    >
      {children}
    </div>
  );
}
