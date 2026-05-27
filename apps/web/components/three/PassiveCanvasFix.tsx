'use client';
import { useEffect, useRef } from 'react';

/**
 * Wrap an R3F <Canvas> with this to defeat the touch-action: none and
 * pointer-events that R3F sets on the canvas DOM node — those block
 * page scrolling on Chrome (trackpad gestures are treated as touch).
 *
 * Implementation detail: we use a MutationObserver to wait for the
 * <canvas> element to appear, then set styles ONCE and disconnect.
 * We must not write to canvas.style from within the observer callback
 * without an equality check, or we trigger an infinite mutation loop
 * that saturates the main thread and blocks scroll events.
 */
export default function PassiveCanvasFix({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root) return;

    let applied = false;

    const apply = (canvas: HTMLCanvasElement) => {
      if (applied) return;
      if (canvas.style.touchAction !== 'pan-y') {
        canvas.style.setProperty('touch-action', 'pan-y', 'important');
      }
      if (canvas.style.pointerEvents !== 'none') {
        canvas.style.setProperty('pointer-events', 'none', 'important');
      }
      applied = true;
    };

    const existing = root.querySelector('canvas');
    if (existing) apply(existing);

    if (!applied) {
      const mo = new MutationObserver(() => {
        const c = root.querySelector('canvas');
        if (c) {
          apply(c);
          mo.disconnect();
        }
      });
      mo.observe(root, { childList: true, subtree: true });
      return () => mo.disconnect();
    }
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
