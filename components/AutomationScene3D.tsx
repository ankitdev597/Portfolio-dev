"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { CatmullRomCurve3, TubeGeometry, Vector3 } from "three";
import type { Group, Mesh } from "three";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePageVisible } from "@/lib/use-page-visible";
import { SCENE } from "@/lib/scene-palette";
import SceneCanvas from "@/components/SceneCanvas";

/** Server rack blocks + clear API data-flow path. */
const SERVERS: { pos: [number, number, number]; h: number }[] = [
  { pos: [-1.35, -0.15, 0.15], h: 0.95 },
  { pos: [-0.35, 0.05, -0.1], h: 1.15 },
  { pos: [0.7, -0.05, 0.2], h: 1.0 },
];

const FLOW: [number, number, number][] = [
  [-1.35, 0.45, 0.15],
  [-0.35, 0.7, -0.1],
  [0.7, 0.55, 0.2],
  [1.45, 0.15, 0],
];

function ServerBlock({
  position,
  height,
}: {
  position: [number, number, number];
  height: number;
}) {
  const slots = 3;
  return (
    <group position={position}>
      <mesh>
        <boxGeometry args={[0.55, height, 0.4]} />
        <meshStandardMaterial
          color={SCENE.elevated}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>
      {Array.from({ length: slots }).map((_, i) => {
        const y = -height / 2 + 0.18 + i * ((height - 0.3) / (slots - 1 || 1));
        return (
          <mesh key={i} position={[0, y, 0.205]}>
            <boxGeometry args={[0.42, 0.06, 0.02]} />
            <meshStandardMaterial
              color={i === 1 ? SCENE.accent : SCENE.primary}
              emissive={i === 1 ? SCENE.accent : SCENE.primary}
              emissiveIntensity={0.45}
              metalness={0.5}
              roughness={0.35}
            />
          </mesh>
        );
      })}
      {/* Status LED */}
      <mesh position={[0.2, height / 2 - 0.08, 0.205]}>
        <sphereGeometry args={[0.035, 8, 8]} />
        <meshStandardMaterial
          color={SCENE.accent}
          emissive={SCENE.accent}
          emissiveIntensity={1}
        />
      </mesh>
    </group>
  );
}

function ApiFlow({ animate }: { animate: boolean }) {
  const groupRef = useRef<Group>(null);
  const pulseRef = useRef<Mesh>(null);
  const progressRef = useRef(0);

  const curve = useMemo(
    () => new CatmullRomCurve3(FLOW.map((p) => new Vector3(...p))),
    [],
  );
  const tubeGeometry = useMemo(
    () => new TubeGeometry(curve, 40, 0.018, 6, false),
    [curve],
  );

  useFrame((_, delta) => {
    if (!animate) return;
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.08;
    }
    if (!pulseRef.current) return;
    progressRef.current = (progressRef.current + delta * 0.22) % 1;
    pulseRef.current.position.copy(curve.getPointAt(progressRef.current));
  });

  return (
    <group ref={groupRef} scale={0.92}>
      {SERVERS.map((s) => (
        <ServerBlock key={s.pos.join(",")} position={s.pos} height={s.h} />
      ))}

      <mesh geometry={tubeGeometry}>
        <meshStandardMaterial
          color={SCENE.primary}
          emissive={SCENE.primary}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.45}
        />
      </mesh>

      {/* API endpoint node */}
      <mesh position={[1.45, 0.15, 0]}>
        <octahedronGeometry args={[0.16, 0]} />
        <meshStandardMaterial
          color={SCENE.accent}
          emissive={SCENE.accent}
          emissiveIntensity={0.5}
          metalness={0.6}
          roughness={0.3}
        />
      </mesh>

      <mesh ref={pulseRef} position={FLOW[0]}>
        <sphereGeometry args={[0.055, 10, 10]} />
        <meshStandardMaterial
          color={SCENE.accent}
          emissive={SCENE.accent}
          emissiveIntensity={0.85}
        />
      </mesh>
    </group>
  );
}

export default function AutomationScene3D() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();

  return (
    <SceneCanvas camera={{ position: [0.2, 0.6, 4.1], fov: 34 }} dpr={[1, 1.25]}>
      <ambientLight intensity={0.38} />
      <pointLight position={[2.4, 2.6, 2.4]} intensity={20} color={SCENE.primary} />
      <pointLight position={[-2.2, -1, -1.4]} intensity={10} color={SCENE.accent} />
      <ApiFlow animate={!prefersReducedMotion && pageVisible} />
    </SceneCanvas>
  );
}
