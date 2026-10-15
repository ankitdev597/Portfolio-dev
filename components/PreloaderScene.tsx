"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

function RotatingWireframe({ spin }: { spin: boolean }) {
  const meshRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin) return;
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.12;
      meshRef.current.rotation.y += delta * 0.18;
    }
    if (coreRef.current) {
      coreRef.current.rotation.y -= delta * 0.35;
      coreRef.current.rotation.z += delta * 0.1;
    }
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2.15, 1]} />
        <meshStandardMaterial
          color="#C4A26E"
          emissive="#B4343E"
          emissiveIntensity={0.28}
          wireframe
          transparent
          opacity={0.42}
        />
      </mesh>
      <mesh ref={coreRef} scale={0.42}>
        <octahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial
          color="#B4343E"
          emissive="#C4A26E"
          emissiveIntensity={0.45}
          wireframe
          transparent
          opacity={0.55}
        />
      </mesh>
    </group>
  );
}

/**
 * Robotic wireframe boot scene for the preloader (client-only WebGL).
 * Brand name stays in Preloader HTML for reliability without font assets.
 */
export default function PreloaderScene() {
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.65} />
      <pointLight position={[4, 4, 4]} intensity={28} color="#f87171" />
      <pointLight position={[-4, -2, -2]} intensity={16} color="#d4af37" />
      <RotatingWireframe spin={!prefersReducedMotion} />
    </Canvas>
  );
}
