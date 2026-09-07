import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
// Deep-imported (not the `@react-three/drei` barrel) on purpose: the
// barrel's index re-exports drei's <Text>/<Text3D> too, which pull in
// troika-three-text -> bidi-js. bidi-js ships a package.json the Vite 5/
// esbuild dependency scanner can't resolve on some npm/OS combinations
// ("Failed to resolve entry for package 'bidi-js'"), and that failure
// happens at dependency-scan time - before tree-shaking - so it crashes
// `npm run dev` even though nothing here ever renders <Text>. Importing
// only what's actually used avoids the scanner ever reaching that code
// path. The globe/network below only needs three.js's own primitives
// (points, lineSegments, bufferGeometry) - no drei import at all for it.
import { Stars } from '@react-three/drei/core/Stars';
import * as THREE from 'three';

const PREFERS_REDUCED_MOTION =
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Normalized 0-1 scroll position of the whole document. */
function scrollProgress(): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    return max > 0 ? THREE.MathUtils.clamp(window.scrollY / max, 0, 1) : 0;
}

/** Evenly-spaced points on a sphere surface (Fibonacci sphere method). */
function fibonacciSpherePoints(count: number, radius: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < count; i++) {
        const y = 1 - (i / (count - 1)) * 2;
        const ringRadius = Math.sqrt(1 - y * y);
        const theta = goldenAngle * i;

        points.push(
            new THREE.Vector3(Math.cos(theta) * ringRadius, y, Math.sin(theta) * ringRadius).multiplyScalar(radius)
        );
    }

    return points;
}

/**
 * A "living AI brain" globe - a wireframe sphere shell, a breathing inner
 * glow core, and a network of nodes connected to their nearest neighbors
 * whose brightness and size pulse like signals firing across a neural net.
 * Evokes a global/neural network rather than a generic decorative shape
 * (fits the "AI | DevOps" positioning in the hero headline). Sits in the
 * upper-right of the viewport, away from centered text, but is sized and
 * lit to read as a genuine hero centerpiece rather than a faint accent.
 */
function AiGlobe() {
    const groupRef = useRef<THREE.Group>(null);
    const coreRef = useRef<THREE.Mesh>(null);
    const shellRef = useRef<THREE.Mesh>(null);
    const pointsMaterialRef = useRef<THREE.PointsMaterial>(null);
    const linesMaterialRef = useRef<THREE.LineBasicMaterial>(null);
    const clockRef = useRef(0);

    const radius = 1.75;
    const nodeCount = 72;
    const neighborsPerNode = 2;

    const { nodePositions, linePositions } = useMemo(() => {
        const nodes = fibonacciSpherePoints(nodeCount, radius);

        const nodeFloats = new Float32Array(nodes.length * 3);
        nodes.forEach((point, i) => point.toArray(nodeFloats, i * 3));

        // Connect each node to its N nearest neighbors, deduping pairs so
        // A-B is never drawn twice as both A-B and B-A.
        const seenPairs = new Set<string>();
        const segments: number[] = [];

        nodes.forEach((point, i) => {
            const distances = nodes
                .map((other, j) => ({ j, distance: i === j ? Infinity : point.distanceTo(other) }))
                .sort((a, b) => a.distance - b.distance)
                .slice(0, neighborsPerNode);

            distances.forEach(({ j }) => {
                const key = i < j ? `${i}-${j}` : `${j}-${i}`;
                if (seenPairs.has(key)) {
                    return;
                }
                seenPairs.add(key);
                segments.push(point.x, point.y, point.z, nodes[j].x, nodes[j].y, nodes[j].z);
            });
        });

        return { nodePositions: nodeFloats, linePositions: new Float32Array(segments) };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useFrame((state, delta) => {
        const group = groupRef.current;
        if (!group || PREFERS_REDUCED_MOTION) {
            return;
        }

        clockRef.current += delta;
        const t = clockRef.current;
        const progress = scrollProgress();

        group.rotation.y += delta * (0.08 + progress * 0.22);
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, state.pointer.y * 0.12, 0.03);

        // "Breathing" pulse - a slow sine wave drives node size/brightness,
        // line opacity, the glow core's scale, and the outer shell's
        // opacity in sync, so the whole globe reads as one living object.
        const pulse = (Math.sin(t * 1.1) + 1) / 2; // 0..1

        if (pointsMaterialRef.current) {
            pointsMaterialRef.current.size = 0.05 + pulse * 0.035;
            pointsMaterialRef.current.opacity = 0.65 + pulse * 0.25;
        }
        if (linesMaterialRef.current) {
            linesMaterialRef.current.opacity = 0.2 + pulse * 0.2;
        }
        if (coreRef.current) {
            const coreScale = 0.85 + pulse * 0.2;
            coreRef.current.scale.setScalar(coreScale);
        }
        if (shellRef.current) {
            const material = shellRef.current.material as THREE.MeshBasicMaterial;
            material.opacity = 0.18 + pulse * 0.12;
        }
    });

    return (
        // Centered behind the hero content (was off to the upper-right) so
        // it reads as the hero's signature centerpiece - a glowing "halo"
        // behind the name - rather than a side accent. Pushed back in Z
        // (paired with <fog> below, and a CSS scrim in Welcome.tsx's hero
        // section) so it stays a soft backdrop and never fights the text
        // for contrast.
        <group ref={groupRef} position={[0, 0.35, -3.6]}>
            {/* Soft glowing core - additive blending fakes a bloom/light
                source at the centre of the network without a postprocessing
                pass. */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[radius * 0.4, 24, 24]} />
                <meshBasicMaterial color="#22d3ee" transparent opacity={0.35} blending={THREE.AdditiveBlending} depthWrite={false} />
            </mesh>

            <mesh ref={shellRef}>
                <icosahedronGeometry args={[radius, 3]} />
                <meshBasicMaterial color="#8b5cf6" wireframe transparent opacity={0.28} />
            </mesh>

            <points>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
                </bufferGeometry>
                <pointsMaterial
                    ref={pointsMaterialRef}
                    color="#22d3ee"
                    size={0.06}
                    sizeAttenuation
                    transparent
                    opacity={0.9}
                    blending={THREE.AdditiveBlending}
                    depthWrite={false}
                />
            </points>

            <lineSegments>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
                </bufferGeometry>
                <lineBasicMaterial ref={linesMaterialRef} color="#60a5fa" transparent opacity={0.35} />
            </lineSegments>
        </group>
    );
}

/**
 * Fixed, full-viewport, non-interactive canvas mounted once in
 * PublicLayout so it persists as a backdrop behind every section of the
 * single-page portfolio (`pointer-events-none` so it never steals clicks).
 * Lazy-imported from PublicLayout so pages without it (auth, admin) never
 * pay for the three.js bundle - see vite.config.ts's `three` chunk.
 */
export default function HeroScene() {
    return (
        <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden="true">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                dpr={[1, 1.75]}
                gl={{ antialias: true, alpha: true }}
            >
                {/* Matches the page's deep navy-violet background (app.css
                    --background) so the centered globe fades into the page
                    at depth instead of reading as a hard-edged shape. */}
                <fog attach="fog" args={['#0a0912', 3, 10]} />

                <ambientLight intensity={0.5} />
                <pointLight position={[5, 5, 5]} intensity={0.8} color="#22d3ee" />
                <pointLight position={[-5, -3, -5]} intensity={0.4} color="#8b5cf6" />

                <AiGlobe />

                <Stars radius={60} depth={40} count={2000} factor={3} saturation={0} fade speed={0.4} />
            </Canvas>
        </div>
    );
}
