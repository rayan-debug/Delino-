'use client';
import dynamic from 'next/dynamic';

const HeroLines = dynamic(() => import('./HeroLines'), { ssr: false });

export default function HeroLinesLazy({ accent }: { accent: string }) {
  return <HeroLines accent={accent} />;
}
