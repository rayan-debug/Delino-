'use client';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Vanilla Three.js hero animation — flowing 3D gold lines that drift
 * across the scene. Deliberately does NOT use React Three Fiber so there
 * is no event system attaching wheel/pointer listeners to the canvas.
 * The canvas has pointer-events: none + touch-action: pan-y so the page
 * underneath always receives scroll.
 */
export default function HeroLines({ accent = '#c9a86a' }: { accent?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const accentColor = new THREE.Color(accent);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, 16 / 9, 0.1, 100);
    camera.position.set(0, 0, 9);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, 0);
    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.inset = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.touchAction = 'pan-y';
    canvas.style.pointerEvents = 'none';
    container.appendChild(canvas);

    // 8 flowing curves, each with N control points that wobble independently.
    const LINE_COUNT = 8;
    const CONTROL_POINTS = 10;
    const SAMPLES = 220;

    type Strand = {
      base: THREE.Vector3[];
      points: THREE.Vector3[];
      phases: { x: number; y: number; z: number; sx: number; sy: number; sz: number }[];
      line: THREE.Line;
      positionAttr: THREE.BufferAttribute;
    };

    const strands: Strand[] = [];

    for (let i = 0; i < LINE_COUNT; i++) {
      const base: THREE.Vector3[] = [];
      const phases: Strand['phases'] = [];
      for (let j = 0; j < CONTROL_POINTS; j++) {
        const t = j / (CONTROL_POINTS - 1);
        base.push(
          new THREE.Vector3(
            (t - 0.5) * 14 + (Math.random() - 0.5) * 2,
            Math.sin(t * Math.PI * 2 + i) * 2 + (Math.random() - 0.5) * 1.2,
            (Math.random() - 0.5) * 3 - 1
          )
        );
        phases.push({
          x: Math.random() * Math.PI * 2,
          y: Math.random() * Math.PI * 2,
          z: Math.random() * Math.PI * 2,
          sx: 0.3 + Math.random() * 0.4,
          sy: 0.25 + Math.random() * 0.5,
          sz: 0.2 + Math.random() * 0.3,
        });
      }
      const points = base.map((p) => p.clone());

      const positions = new Float32Array(SAMPLES * 3);
      const geometry = new THREE.BufferGeometry();
      const positionAttr = new THREE.BufferAttribute(positions, 3);
      positionAttr.setUsage(THREE.DynamicDrawUsage);
      geometry.setAttribute('position', positionAttr);

      const material = new THREE.LineBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.35 + (i / LINE_COUNT) * 0.35,
      });
      const line = new THREE.Line(geometry, material);
      scene.add(line);

      strands.push({ base, points, phases, line, positionAttr });
    }

    // Soft sparkle field — small Points.
    const SPARKS = 220;
    const sparkPositions = new Float32Array(SPARKS * 3);
    for (let i = 0; i < SPARKS; i++) {
      sparkPositions[i * 3 + 0] = (Math.random() - 0.5) * 18;
      sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      sparkPositions[i * 3 + 2] = (Math.random() - 0.5) * 8 - 2;
    }
    const sparkGeo = new THREE.BufferGeometry();
    sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
    const sparkMat = new THREE.PointsMaterial({
      color: accentColor,
      size: 0.035,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
      sizeAttenuation: true,
    });
    const sparkles = new THREE.Points(sparkGeo, sparkMat);
    scene.add(sparkles);

    const tmp = new THREE.Vector3();
    const curveVec = new THREE.Vector3();

    const updateStrand = (s: Strand, t: number) => {
      for (let j = 0; j < CONTROL_POINTS; j++) {
        const b = s.base[j];
        const ph = s.phases[j];
        s.points[j].set(
          b.x + Math.sin(t * ph.sx + ph.x) * 0.6,
          b.y + Math.cos(t * ph.sy + ph.y) * 0.5,
          b.z + Math.sin(t * ph.sz + ph.z) * 0.4
        );
      }
      const curve = new THREE.CatmullRomCurve3(s.points, false, 'catmullrom', 0.5);
      const arr = s.positionAttr.array as Float32Array;
      for (let k = 0; k < SAMPLES; k++) {
        curve.getPoint(k / (SAMPLES - 1), curveVec);
        arr[k * 3 + 0] = curveVec.x;
        arr[k * 3 + 1] = curveVec.y;
        arr[k * 3 + 2] = curveVec.z;
      }
      s.positionAttr.needsUpdate = true;
    };

    let raf = 0;
    let last = performance.now();
    const start = last;

    const onResize = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    onResize();

    const animate = () => {
      const now = performance.now();
      const t = (now - start) / 1000;
      last = now;

      for (const s of strands) updateStrand(s, t);
      sparkles.rotation.y = Math.sin(t * 0.05) * 0.2;
      sparkles.rotation.x = Math.cos(t * 0.04) * 0.1;
      scene.rotation.y = Math.sin(t * 0.04) * 0.06;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      strands.forEach((s) => {
        s.line.geometry.dispose();
        (s.line.material as THREE.Material).dispose();
        scene.remove(s.line);
      });
      sparkGeo.dispose();
      sparkMat.dispose();
      scene.remove(sparkles);
      renderer.dispose();
      if (canvas.parentNode === container) container.removeChild(canvas);
    };
  }, [accent]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="absolute inset-0"
      style={{ pointerEvents: 'none', touchAction: 'pan-y', overflow: 'hidden' }}
    />
  );
}
