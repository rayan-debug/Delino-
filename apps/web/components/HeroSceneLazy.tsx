'use client';
import dynamic from 'next/dynamic';
import PassiveCanvasFix from './three/PassiveCanvasFix';

const HeroScene = dynamic(() => import('./three/HeroScene'), { ssr: false });

export default function HeroSceneLazy({ accent }: { accent: string }) {
  return (
    <PassiveCanvasFix>
      <HeroScene accent={accent} />
    </PassiveCanvasFix>
  );
}
