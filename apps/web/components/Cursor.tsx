'use client';
import { useEffect, useRef } from 'react';

export default function Cursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf = 0;
    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (dot.current) dot.current.style.transform = `translate3d(${mx - 3}px, ${my - 3}px, 0)`;
    };
    const update = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate3d(${rx - 18}px, ${ry - 18}px, 0)`;
      raf = requestAnimationFrame(update);
    };
    const onOver = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('a, button, [data-hover]')) ring.current?.classList.add('hovering');
    };
    const onOut = (e: MouseEvent) => {
      const el = e.target as HTMLElement | null;
      if (el?.closest('a, button, [data-hover]')) ring.current?.classList.remove('hovering');
    };

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseover', onOver);
    window.addEventListener('mouseout', onOut);
    update();
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseover', onOver);
      window.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div ref={dot} className="cursor-dot" aria-hidden />
      <div ref={ring} className="cursor-ring" aria-hidden />
    </>
  );
}
