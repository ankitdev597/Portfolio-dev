"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePageVisible } from "@/lib/use-page-visible";
import { useTheme } from "@/components/ThemeProvider";
import { SCENE } from "@/lib/scene-palette";
import SceneCanvas from "@/components/SceneCanvas";

function BrandOrb({ spin, isLight }: { spin: boolean; isLight: boolean }) {
  const groupRef = useRef<Group>(null);
  const shellRef = useRef<Mesh>(null);
  const coreRef = useRef<Mesh>(null);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!spin) return;
    const d = Math.min(delta, 0.033);
    tRef.current += d;

    if (groupRef.current) {
      groupRef.current.rotation.y += d * 0.22;
      groupRef.current.position.y = Math.sin(tRef.current * 1.1) * 0.04;
    }
    if (shellRef.current) {
      shellRef.current.rotation.x -= d * 0.12;
      shellRef.current.rotation.z += d * 0.08;
    }
    if (coreRef.current) {
      const s = 1 + Math.sin(tRef.current * 2.2) * 0.04;
      coreRef.current.scale.setScalar(s);
    }
  });

  const wire = isLight ? SCENE.gold : SCENE.primary;
  const glow = isLight ? SCENE.primary : SCENE.gold;

  return (
    <group ref={groupRef}>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.72, 1]} />
        <meshStandardMaterial
          color={isLight ? "#E8DFD0" : "#140e11"}
          emissive={glow}
          emissiveIntensity={isLight ? 0.2 : 0.28}
          metalness={0.75}
          roughness={0.28}
        />
      </mesh>
      <mesh ref={shellRef} scale={1.55}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial
          color={wire}
          wireframe
          transparent
          opacity={0.48}
          depthWrite={false}
        />
      </mesh>
      <mesh rotation={[Math.PI / 2.4, 0.2, 0]}>
        <torusGeometry args={[1.55, 0.012, 10, 96]} />
        <meshStandardMaterial
          color={SCENE.gold}
          emissive={SCENE.gold}
          emissiveIntensity={0.35}
          metalness={0.85}
          roughness={0.2}
        />
      </mesh>
    </group>
  );
}

/** Compact brand orb for the loader — slow spin + gold ring. */
export default function PreloaderScene() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <SceneCanvas camera={{ position: [0, 0.1, 5.2], fov: 38 }} dpr={[1, 1.5]}>
      <ambientLight intensity={isLight ? 0.55 : 0.35} />
      <pointLight position={[3, 3, 3]} intensity={18} color={SCENE.primary} />
      <pointLight position={[-2.2, -1, -2]} intensity={12} color={SCENE.gold} />
      <BrandOrb spin={!prefersReducedMotion && pageVisible} isLight={isLight} />
    </SceneCanvas>
  );
}
