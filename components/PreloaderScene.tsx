"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text } from "@react-three/drei";
import type { Group, Mesh } from "three";
import { profile } from "@/data/profile";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function RotatingWireframe({ spin }: { spin: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.1;
    meshRef.current.rotation.y += delta * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[2.4, 1]} />
      <meshStandardMaterial
        color="#dc2626"
        emissive="#7f1d1d"
        emissiveIntensity={0.35}
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  );
}

function NameReveal({ animate }: { animate: boolean }) {
  const groupRef = useRef<Group>(null);
  const scaleRef = useRef(animate ? 0.001 : 1);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (animate && scaleRef.current < 1) {
      // Quick ease-out approach to 1 - a small overshoot reads as a
      // deliberate "pop" rather than a slow fade, fitting for a preloader
      // that's only on screen for a moment.
      scaleRef.current += (1.06 - scaleRef.current) * Math.min(delta * 6, 1);
      const s = scaleRef.current;
      group.scale.set(s, s, s);
    } else if (!animate) {
      group.scale.set(1, 1, 1);
    }
  });

  return (
    <group ref={groupRef}>
      <Text
        font="/fonts/inter-700.woff"
        fontSize={0.62}
        maxWidth={4.6}
        lineHeight={1.15}
        textAlign="center"
        anchorX="center"
        anchorY="middle"
        color="#f5f0f0"
        outlineWidth={0.012}
        outlineColor="#d4af37"
        outlineOpacity={0.8}
      >
        {profile.fullName}
      </Text>
    </group>
  );
}

/**
 * Full-name reveal shown inside the Preloader, client-only (mounted via
 * next/dynamic with ssr:false in Preloader.tsx) since WebGL has no
 * server-side representation. A plain-text/SR fallback still lives in
 * Preloader.tsx itself so the name is present even before this chunk
 * loads or if WebGL is unavailable.
 */
export default function PreloaderScene() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 4, 4]} intensity={35} color="#f87171" />
      <pointLight position={[-4, -2, -2]} intensity={18} color="#d4af37" />
      <RotatingWireframe spin={!prefersReducedMotion} />
      <NameReveal animate={!prefersReducedMotion} />
    </Canvas>
  );
}
