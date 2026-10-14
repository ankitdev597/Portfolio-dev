"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePageVisible } from "@/lib/use-page-visible";
import { useTheme } from "@/components/ThemeProvider";
import { SCENE } from "@/lib/scene-palette";
import SceneCanvas from "@/components/SceneCanvas";

type DbColors = {
  body: string;
  band: string;
  top: string;
  bottom: string;
  key: string;
  gold: string;
  fill: string;
};

function useDbColors(): DbColors {
  const { theme } = useTheme();
  if (theme === "light") {
    return {
      body: "#E8DFD0",
      band: "#F4EDE2",
      top: "#FFFCF8",
      bottom: "#D6C8B2",
      key: SCENE.primary,
      gold: SCENE.gold,
      fill: "#F8F2E8",
    };
  }
  return {
    body: SCENE.elevated,
    band: SCENE.surface,
    top: SCENE.surface,
    bottom: SCENE.background,
    key: SCENE.primary,
    gold: SCENE.accent,
    fill: SCENE.text,
  };
}

/**
 * Recognizable database cylinder: elliptical top disk, stacked rings.
 * Theme-aware metals — graphite in dark, warm brass cream in light.
 */
function DatabaseCylinder({ spin, colors }: { spin: boolean; colors: DbColors }) {
  const groupRef = useRef<Group>(null);
  const pulseA = useRef<Mesh>(null);
  const pulseB = useRef<Mesh>(null);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!spin || !groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.16;
    tRef.current += delta;

    const t = tRef.current;
    if (pulseA.current) {
      pulseA.current.position.y = -0.55 + ((t * 0.35) % 1.3);
      const mat = pulseA.current.material as { opacity: number };
      mat.opacity = 0.25 + 0.55 * Math.sin(t * 2.2) ** 2;
    }
    if (pulseB.current) {
      pulseB.current.position.y = -0.55 + (((t * 0.35) + 0.55) % 1.3);
      const mat = pulseB.current.material as { opacity: number };
      mat.opacity = 0.2 + 0.5 * Math.sin(t * 2.2 + 1.1) ** 2;
    }
  });

  const layers = [-0.45, 0, 0.45] as const;

  return (
    <group ref={groupRef} rotation={[0.18, 0.35, 0]} scale={1.05}>
      {/* Body */}
      <mesh>
        <cylinderGeometry args={[0.72, 0.72, 1.35, 48]} />
        <meshStandardMaterial
          color={colors.body}
          metalness={0.72}
          roughness={0.32}
          envMapIntensity={0.6}
        />
      </mesh>

      {/* Stacked horizontal bands */}
      {layers.map((y) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[0.735, 0.735, 0.045, 48]} />
          <meshStandardMaterial
            color={colors.band}
            metalness={0.55}
            roughness={0.4}
            emissive={colors.key}
            emissiveIntensity={0.12}
          />
        </mesh>
      ))}

      {/* Elliptical top disk */}
      <mesh position={[0, 0.68, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.72, 48]} />
        <meshStandardMaterial
          color={colors.top}
          metalness={0.65}
          roughness={0.28}
          emissive={colors.gold}
          emissiveIntensity={0.08}
        />
      </mesh>

      {/* Top rim ring */}
      <mesh position={[0, 0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.72, 0.028, 10, 48]} />
        <meshStandardMaterial
          color={colors.key}
          emissive={colors.key}
          emissiveIntensity={0.35}
          metalness={0.8}
          roughness={0.25}
        />
      </mesh>

      {/* Bottom cap */}
      <mesh position={[0, -0.68, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.72, 48]} />
        <meshStandardMaterial
          color={colors.bottom}
          metalness={0.7}
          roughness={0.4}
        />
      </mesh>

      {/* Ascending data pulses along the cylinder wall */}
      <mesh ref={pulseA} position={[0.74, -0.4, 0]}>
        <sphereGeometry args={[0.045, 10, 10]} />
        <meshStandardMaterial
          color={colors.gold}
          emissive={colors.gold}
          emissiveIntensity={0.9}
          transparent
          opacity={0.6}
        />
      </mesh>
      <mesh ref={pulseB} position={[-0.52, 0.1, 0.52]}>
        <sphereGeometry args={[0.038, 10, 10]} />
        <meshStandardMaterial
          color={colors.key}
          emissive={colors.key}
          emissiveIntensity={0.75}
          transparent
          opacity={0.5}
        />
      </mesh>
    </group>
  );
}

export default function DatabaseScene3D() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const colors = useDbColors();
  const { theme } = useTheme();
  const isLight = theme === "light";

  return (
    <SceneCanvas camera={{ position: [0, 0.35, 3.4], fov: 36 }} dpr={[1, 1.25]}>
      <ambientLight intensity={isLight ? 0.65 : 0.4} />
      <pointLight position={[2.2, 2.4, 2.2]} intensity={isLight ? 16 : 22} color={colors.key} />
      <pointLight position={[-2.2, -0.8, -1.6]} intensity={isLight ? 14 : 12} color={colors.gold} />
      <pointLight position={[0, 2.5, -1.5]} intensity={isLight ? 8 : 6} color={colors.fill} />
      <DatabaseCylinder spin={!prefersReducedMotion && pageVisible} colors={colors} />
    </SceneCanvas>
  );
}
