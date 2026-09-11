"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";

function RotatingCore() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.12;
    meshRef.current.rotation.y += delta * 0.18;
  });

  return (
    <Float speed={1.4} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[1.6, 1]} />
        <meshStandardMaterial
          color="#dc2626"
          emissive="#7f1d1d"
          emissiveIntensity={0.4}
          wireframe
          roughness={0.3}
        />
      </mesh>
    </Float>
  );
}

/**
 * Purely decorative, sits behind the hero copy. Client-only (mounted via
 * next/dynamic with ssr:false) since WebGL has no server-side
 * representation - see Hero.tsx.
 */
export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 4, 4]} intensity={40} color="#f87171" />
      <pointLight position={[-4, -2, -2]} intensity={20} color="#d4af37" />
      <RotatingCore />
    </Canvas>
  );
}
