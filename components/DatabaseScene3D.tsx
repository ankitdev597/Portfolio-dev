"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Group } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

/**
 * Three wireframe "drums" - one per database engine this service covers -
 * orbiting a small core. Colors stay inside the site's red/gold palette
 * rather than each engine's real brand color, so the visual reads as one
 * cohesive piece rather than a logo soup.
 */
const DRUMS = [
  { color: "#dc2626", angle: 0 },
  { color: "#d4af37", angle: (Math.PI * 2) / 3 },
  { color: "#f87171", angle: (Math.PI * 4) / 3 },
];

function DatabaseCluster({ spin }: { spin: boolean }) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!spin || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.3;
  });

  return (
    <group ref={groupRef}>
      {DRUMS.map((drum, i) => (
        <Float
          key={drum.color}
          speed={1.2 + i * 0.2}
          rotationIntensity={spin ? 0.5 : 0}
          floatIntensity={spin ? 1 : 0}
        >
          <mesh
            position={[Math.cos(drum.angle) * 1.4, Math.sin(i * 2) * 0.3, Math.sin(drum.angle) * 1.4]}
          >
            <cylinderGeometry args={[0.5, 0.5, 0.85, 16, 1, true]} />
            <meshStandardMaterial color={drum.color} wireframe roughness={0.35} />
          </mesh>
        </Float>
      ))}
      <mesh>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial color="#f5f0f0" wireframe transparent opacity={0.25} />
      </mesh>
    </group>
  );
}

/**
 * Purely decorative card visual for the "Database Design & Architecture"
 * service. Client-only (mounted via next/dynamic with ssr:false in
 * Services.tsx) since WebGL has no server-side representation.
 */
export default function DatabaseScene3D() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0.5, 4], fov: 40 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 3, 3]} intensity={30} color="#f87171" />
      <pointLight position={[-3, -2, -2]} intensity={16} color="#d4af37" />
      <DatabaseCluster spin={!prefersReducedMotion} />
    </Canvas>
  );
}
