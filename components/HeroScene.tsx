"use client";

import { useEffect, useRef } from "react";
import {
  Color,
  Group,
  InstancedBufferAttribute,
  InstancedMesh,
  Matrix4,
  MeshBasicMaterial,
  NormalBlending,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  SRGBColorSpace,
  Vector3,
  WebGLRenderer,
} from "three";
import { SCENE } from "@/lib/scene-palette";
import { useTheme } from "@/components/ThemeProvider";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { usePageVisible } from "@/lib/use-page-visible";

const COUNT = 2500;
const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5));
const OVERSAMPLE = 2.5;
const TARGET_DT = 1000 / 60;

function lerp(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMin === inMax) return outMin;
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * AssistBee-style Fibonacci particle sphere — InstancedMesh dots,
 * soft additive glow, auto-rotate, drag spin, pointer repulsion void.
 * Muted brass / pearl / dusty rose for a senior Crimson Noir look.
 */
export default function HeroScene() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const reduceMotion = usePrefersReducedMotion();
  const pageVisible = usePageVisible();
  const reduceRef = useRef(reduceMotion);
  const visibleRef = useRef(pageVisible);
  const isLight = theme === "light";

  useEffect(() => {
    reduceRef.current = reduceMotion;
    visibleRef.current = pageVisible;
  }, [reduceMotion, pageVisible]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    let disposed = false;
    let raf = 0;

    const readW = () => host.clientWidth || 400;
    const readH = () => host.clientHeight || 400;

    let cssW = readW();
    let cssH = readH();
    let bufW = cssW * OVERSAMPLE;
    let bufH = cssH * OVERSAMPLE;
    let offsetX = (bufW - cssW) / 2;
    let offsetY = (bufH - cssH) / 2;

    const scene = new Scene();
    const sphereRadius = lerp(0.6, 0, 1, 0.25, 1.25);
    const fov =
      2 * Math.atan(OVERSAMPLE * Math.tan((50 * Math.PI) / 360)) * (180 / Math.PI);
    const camera = new PerspectiveCamera(fov, bufW / bufH, 0.1, 1000);
    camera.position.z = Math.max(3, sphereRadius + 1);

    const renderer = new WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(bufW, bufH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = SRGBColorSpace;

    const canvas = renderer.domElement;
    canvas.style.position = "absolute";
    canvas.style.left = `-${offsetX}px`;
    canvas.style.top = `-${offsetY}px`;
    canvas.style.width = `${bufW}px`;
    canvas.style.height = `${bufH}px`;
    canvas.style.pointerEvents = "auto";
    canvas.style.cursor = "grab";
    host.appendChild(canvas);

    const base: Vector3[] = [];
    const offsets: Vector3[] = [];
    const velocities: Vector3[] = [];

    for (let i = 0; i < COUNT; i++) {
      const y = 1 - (i / (COUNT - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = GOLDEN_ANGLE * i;
      const x = Math.cos(theta) * radius * sphereRadius;
      const z = Math.sin(theta) * radius * sphereRadius;
      const py = y * sphereRadius;
      base.push(new Vector3(x, py, z));
      offsets.push(new Vector3(0, 0, 0));
      velocities.push(new Vector3(0, 0, 0));
    }

    // Tighter dots ? executive, not neon. Dark mode stays muted (no harsh additive bloom).
    const dotRadius = 0.12 * lerp(0.3, 0.1, 1, 0.01, 0.1);
    const geometry = new SphereGeometry(dotRadius, 8, 8);
    const material = new MeshBasicMaterial({
      color: 0xffffff,
      blending: NormalBlending,
      transparent: true,
      opacity: isLight ? 0.9 : 0.55,
      depthWrite: false,
    });

    const mesh = new InstancedMesh(geometry, material, COUNT);
    const matrix = new Matrix4();
    for (let i = 0; i < COUNT; i++) {
      matrix.setPosition(base[i].x, base[i].y, base[i].z);
      mesh.setMatrixAt(i, matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;

    const brass = new Color(isLight ? SCENE.particleBrassLight : SCENE.particleBrass);
    const pearl = new Color(isLight ? SCENE.particlePearlLight : SCENE.particlePearl);
    const rose = new Color(isLight ? SCENE.particleRoseLight : SCENE.particleRose);
    const colors = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const roll = i % 7;
      const c = roll === 0 ? rose : roll % 2 === 0 ? brass : pearl;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    mesh.instanceColor = new InstancedBufferAttribute(colors, 3);

    const group = new Group();
    group.add(mesh);
    scene.add(group);

    const currentRot = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const inertia = { x: 0, y: 0 };
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let pointer: { x: number; y: number } | null = null;
    let lastTime = performance.now();

    // Calm desktop spin ? yesterday pacing, not a disco orb
    const autoSpeed = lerp(0.8, 0.1, 1, 0.01, 0.028);
    const follow = lerp(1, 0, 1, 0.4, 0.03);
    const damp = lerp(1, 0, 1, 0.7, 0.96);
    const repel = lerp(1, 0, 1, 0, 15);

    const tmpWorld = new Vector3();
    const tmpPush = new Vector3();
    const tmpCamX = new Vector3();
    const tmpCamY = new Vector3();
    const tmpInv = new Matrix4();
    const tmpMat = new Matrix4();
    const tmpPos = new Vector3();

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);

      if (!visibleRef.current) {
        lastTime = performance.now();
        return;
      }

      const now = performance.now();
      const frames = Math.min((now - lastTime) / TARGET_DT, 3);
      lastTime = now;

      const reduce = reduceRef.current;
      const spin = reduce ? 0 : autoSpeed;

      if (!dragging && spin !== 0) {
        targetRot.x += 0.1 * spin * frames;
      }

      if (!dragging && (Math.abs(inertia.x) > 0.01 || Math.abs(inertia.y) > 0.01)) {
        targetRot.x += inertia.x * frames;
        targetRot.y += inertia.y * frames;
        targetRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRot.y));
        const decay = Math.pow(damp, frames);
        inertia.x *= decay;
        inertia.y *= decay;
      }

      const dx = targetRot.x - currentRot.x;
      const dy = targetRot.y - currentRot.y;
      if (Math.abs(dx) > 0.01 || Math.abs(dy) > 0.01 || spin !== 0 || dragging) {
        const t = 1 - Math.pow(1 - follow, frames);
        currentRot.x += dx * t;
        currentRot.y += dy * t;
        currentRot.y = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, currentRot.y));
      }

      group.rotation.y = currentRot.x;
      group.rotation.x = currentRot.y;
      group.updateMatrixWorld(true);

      if (pointer && !reduce) {
        tmpCamX.setFromMatrixColumn(camera.matrixWorld, 0);
        tmpCamY.setFromMatrixColumn(camera.matrixWorld, 1);
        tmpInv.copy(group.matrixWorld).invert();

        for (let i = 0; i < COUNT; i++) {
          tmpWorld.copy(base[i]).add(offsets[i]).applyMatrix4(group.matrixWorld);
          tmpWorld.project(camera);
          const px = (0.5 * tmpWorld.x + 0.5) * bufW;
          const py = (-0.5 * tmpWorld.y + 0.5) * bufH;
          const ox = pointer.x - px;
          const oy = pointer.y - py;
          const distSq = ox * ox + oy * oy;
          if (distSq < 10000 && distSq > 0) {
            const angle = Math.atan2(oy, ox);
            const force =
              ((100 - Math.sqrt(distSq)) / 100) * repel * 0.8 * frames * 0.01;
            tmpPush
              .set(0, 0, 0)
              .addScaledVector(tmpCamX, -Math.cos(angle) * force)
              .addScaledVector(tmpCamY, Math.sin(angle) * force)
              .applyMatrix4(tmpInv);
            offsets[i].add(tmpPush);
          }
        }
      }

      const spring = Math.pow(0.88, frames);
      const friction = 1 - 0.032 * frames;
      for (let i = 0; i < COUNT; i++) {
        offsets[i].multiplyScalar(spring).multiplyScalar(friction);
        offsets[i].addScaledVector(velocities[i], 0.1 * frames);
        velocities[i].multiplyScalar(Math.pow(0.95, frames)).multiplyScalar(friction);
        tmpPos.copy(base[i]).add(offsets[i]);
        tmpMat.setPosition(tmpPos.x, tmpPos.y, tmpPos.z);
        mesh.setMatrixAt(i, tmpMat);
      }
      mesh.instanceMatrix.needsUpdate = true;
      renderer.render(scene, camera);
    };

    raf = requestAnimationFrame(tick);

    const onLeave = () => {
      pointer = null;
    };
    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      pointer = {
        x: e.clientX - rect.left + offsetX,
        y: e.clientY - rect.top + offsetY,
      };
    };
    const onDown = (e: MouseEvent) => {
      dragging = true;
      canvas.style.cursor = "grabbing";
      lastX = e.clientX;
      lastY = e.clientY;
      const onDrag = (ev: MouseEvent) => {
        const sens = lerp(0.5, 0, 1, 0.001, 0.02);
        targetRot.x += (ev.clientX - lastX) * sens;
        targetRot.y += (ev.clientY - lastY) * sens;
        lastX = ev.clientX;
        lastY = ev.clientY;
      };
      const onUp = () => {
        document.removeEventListener("mousemove", onDrag);
        dragging = false;
        canvas.style.cursor = "grab";
      };
      document.addEventListener("mousemove", onDrag);
      document.addEventListener("mouseup", onUp, { once: true });
    };

    canvas.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);
    canvas.addEventListener("mousemove", onMove);
    canvas.addEventListener("mousedown", onDown);

    const onResize = () => {
      cssW = readW();
      cssH = readH();
      bufW = cssW * OVERSAMPLE;
      bufH = cssH * OVERSAMPLE;
      offsetX = (bufW - cssW) / 2;
      offsetY = (bufH - cssH) / 2;
      renderer.setSize(bufW, bufH);
      camera.aspect = bufW / bufH;
      camera.updateProjectionMatrix();
      canvas.style.left = `-${offsetX}px`;
      canvas.style.top = `-${offsetY}px`;
      canvas.style.width = `${bufW}px`;
      canvas.style.height = `${bufH}px`;
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      canvas.removeEventListener("mouseleave", onLeave);
      canvas.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("mousedown", onDown);
      document.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
      geometry.dispose();
      material.dispose();
      mesh.dispose();
      renderer.dispose();
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
    };
  }, [isLight]);

  return (
    <div
      ref={hostRef}
      className="relative h-full w-full"
      style={{ overflow: "visible" }}
      aria-hidden="true"
    />
  );
}
