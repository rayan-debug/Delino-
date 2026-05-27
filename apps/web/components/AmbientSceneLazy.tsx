'use client';
import dynamic from 'next/dynamic';
import PassiveCanvasFix from './three/PassiveCanvasFix';

const AmbientScene = dynamic(() => import('./three/AmbientScene'), { ssr: false });

export default function AmbientSceneLazy({ accent }: { accent: string }) {
  return (
    <PassiveCanvasFix>
      <AmbientScene accent={accent} />
    </PassiveCanvasFix>
  );
}
