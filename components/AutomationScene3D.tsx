"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import type { Mesh } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/** Four pipeline stages: trigger -> build -> test -> deploy. */
const STAGE_POSITIONS: [number, number, number][] = [
  [-1.8, 0, 0],
  [-0.6, 0.4, 0],
  [0.6, -0.4, 0],
  [1.8, 0, 0],
];

function PipelineFlow({ animate }: { animate: boolean }) {
  const pulseRef = useRef<Mesh>(null);
  const progressRef = useRef(0);

  const curve = useMemo(
    () => new CatmullRomCurve3(STAGE_POSITIONS.map((p) => new Vector3(...p))),
    [],
  );
  const tubeGeometry = useMemo(() => new TubeGeometry(curve, 64, 0.014, 8, false), [curve]);

  useFrame((_, delta) => {
    if (!animate || !pulseRef.current) return;
    progressRef.current = (progressRef.current + delta * 0.22) % 1;
    pulseRef.current.position.copy(curve.getPointAt(progressRef.current));
  });

  return (
    <group>
      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial color="#7f1d1d" emissive="#7f1d1d" emissiveIntensity={0.35} />
      </mesh>

      {STAGE_POSITIONS.map((pos, i) => (
        <mesh key={i} position={pos}>
          <icosahedronGeometry args={[0.26, 0]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? "#dc2626" : "#d4af37"}
            wireframe
            roughness={0.35}
          />
        </mesh>
      ))}

      {/* The "task" moving through the automated pipeline. */}
      <mesh ref={pulseRef} position={STAGE_POSITIONS[0]}>
        <sphereGeometry args={[0.09, 12, 12]} />
        <meshStandardMaterial color="#f87171" emissive="#f87171" emissiveIntensity={1.3} />
      </mesh>
    </group>
  );
}

/**
 * Purely decorative card visual for the "Workflow & Process Automation"
 * service - a small glowing task pulses along a pipeline of stages,
 * reading as an automated build/deploy (or any automated) flow. Client-only
 * (mounted via next/dynamic with ssr:false in Services.tsx).
 */
export default function AutomationScene3D() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 4.4], fov: 38 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={30} color="#f87171" />
      <pointLight position={[-3, -2, -2]} intensity={16} color="#d4af37" />
      <PipelineFlow animate={!prefersReducedMotion} />
    </Canvas>
  );
}
