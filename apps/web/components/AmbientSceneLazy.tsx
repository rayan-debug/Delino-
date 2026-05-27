'use client';
import dynamic from 'next/dynamic';

const AmbientScene = dynamic(() => import('./three/AmbientScene'), { ssr: false });

export default function AmbientSceneLazy({ accent }: { accent: string }) {
  return <AmbientScene accent={accent} />;
}
