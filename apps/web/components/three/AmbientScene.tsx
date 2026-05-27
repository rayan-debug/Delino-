'use client';
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import type * as THREE from 'three';

function Dust({ count = 160, color = '#c9a86a' }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 12;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 2;
    }
    return arr;
  }, [count]);
  useFrame(({ clock }) => {
    if (ref.current) ref.current.rotation.y = clock.elapsedTime * 0.04;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.03} color={color} transparent opacity={0.55} depthWrite={false} />
    </points>
  );
}

function Wireframe({ color }: { color: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.08 + mouse.y * 0.1;
      ref.current.rotation.y = clock.elapsedTime * 0.1 + mouse.x * 0.15;
    }
  });
  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.4}>
      <mesh ref={ref} position={[0, 0, -1]}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial color={color} wireframe transparent opacity={0.18} />
      </mesh>
    </Float>
  );
}

export default function AmbientScene({ accent = '#c9a86a' }: { accent?: string }) {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.8]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={0.6} color={accent} />
      <Suspense fallback={null}>
        <Sparkles count={40} scale={[10, 6, 4]} size={2} speed={0.3} color={accent} opacity={0.55} />
        <Dust color={accent} />
        <Wireframe color={accent} />
      </Suspense>
    </Canvas>
  );
}
