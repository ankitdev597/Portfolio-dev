"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePageVisible } from "@/lib/use-page-visible";
import { SCENE } from "@/lib/scene-palette";
import SceneCanvas from "@/components/SceneCanvas";

function RotatingWireframe({ spin }: { spin: boolean }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin || !meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.07;
    meshRef.current.rotation.y += delta * 0.1;
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[1.75, 1]} />
      <meshStandardMaterial
        color={SCENE.primary}
        emissive={SCENE.secondary}
        emissiveIntensity={0.22}
        wireframe
        transparent
        opacity={0.42}
        roughness={0.35}
        metalness={0.4}
      />
    </mesh>
  );
}

/** Compact brand wireframe — restrained so the HTML name remains the focus. */
export default function PreloaderScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();

  return (
    <SceneCanvas camera={{ position: [0, 0, 5.5], fov: 40 }}>
      <ambientLight intensity={0.4} />
      <pointLight position={[3, 3, 3]} intensity={20} color={SCENE.primary} />
      <pointLight position={[-2, -1, -2]} intensity={10} color={SCENE.accent} />
      <RotatingWireframe spin={!prefersReducedMotion && pageVisible} />
    </SceneCanvas>
  );
}
