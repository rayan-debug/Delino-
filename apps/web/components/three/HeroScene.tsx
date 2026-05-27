'use client';
import { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sparkles, Stars } from '@react-three/drei';
import type * as THREE from 'three';

function Dust({ count = 220, color = '#c9a86a' }: { count?: number; color?: string }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 0] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1.5;
    }
    return arr;
  }, [count]);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.08) * 0.08;
      ref.current.rotation.x = Math.cos(clock.elapsedTime * 0.06) * 0.04;
    }
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color={color} transparent opacity={0.7} depthWrite={false} />
    </points>
  );
}

function GoldOrb({ color = '#c9a86a' }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock, mouse }) => {
    if (ref.current) {
      const t = clock.elapsedTime;
      ref.current.rotation.x = t * 0.12 + mouse.y * 0.15;
      ref.current.rotation.y = t * 0.18 + mouse.x * 0.15;
      ref.current.position.x = mouse.x * 0.4 + 2.4;
      ref.current.position.y = mouse.y * 0.3 + 0.4;
    }
  });
  return (
    <Float speed={1.4} rotationIntensity={0.5} floatIntensity={1.2}>
      <mesh ref={ref} position={[2.4, 0.4, 0]}>
        <icosahedronGeometry args={[1.1, 6]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.18}
          metalness={0.9}
          distort={0.35}
          speed={1.4}
          emissive={color}
          emissiveIntensity={0.15}
        />
      </mesh>
    </Float>
  );
}

function Ring({ color = '#c9a86a' }: { color?: string }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.x = clock.elapsedTime * 0.25;
      ref.current.rotation.y = clock.elapsedTime * 0.12;
    }
  });
  return (
    <Float speed={1} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={ref} position={[-2.6, -0.6, -1]}>
        <torusGeometry args={[0.9, 0.015, 64, 200]} />
        <meshStandardMaterial color={color} metalness={0.95} roughness={0.15} emissive={color} emissiveIntensity={0.2} />
      </mesh>
    </Float>
  );
}

export default function HeroScene({ accent = '#c9a86a' }: { accent?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
    >
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color={accent} />
      <pointLight position={[-3, -2, 4]} intensity={0.6} color="#fff" />
      <Suspense fallback={null}>
        <Stars radius={50} depth={30} count={1200} factor={2} saturation={0} fade speed={0.5} />
        <Sparkles count={60} scale={[10, 6, 4]} size={2.5} speed={0.4} color={accent} opacity={0.8} />
        <Dust color={accent} />
        <GoldOrb color={accent} />
        <Ring color={accent} />
      </Suspense>
    </Canvas>
  );
}
