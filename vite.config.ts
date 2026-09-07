import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'node:path';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.tsx'],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'resources/js'),
        },
    },
    server: {
        // Force IPv4 loopback. On Windows, Node resolves "localhost" to the
        // IPv6 ::1 address first, so without this Vite injects
        // `http://[::1]:5173/...` <script>/<link> tags into the page. Some
        // browsers/security software mishandle or block that IPv6-literal
        // origin outright (net::ERR_BLOCKED_BY_CLIENT) even though the dev
        // server itself is running fine - the whole page then loads with
        // zero JS/CSS (blank, unstyled, no animation, no preloader). Pinning
        // both the bind host and the HMR client host to 127.0.0.1 avoids the
        // ambiguity entirely. strictPort surfaces a port conflict loudly
        // instead of silently starting on 5174+ while `public/hot` (and the
        // page) still points at 5173.
        host: '127.0.0.1',
        port: 5173,
        strictPort: true,
        hmr: {
            host: '127.0.0.1',
        },
    },
    build: {
        // Keep the 3D/animation vendor bundle separate from the app shell so
        // pages that never mount the 3D scene (e.g. auth screens) don't pay
        // for three.js on first load - see spec #33 (lazy-load 3D scenes).
        //
        // Function form on purpose (not the static object form used before):
        // the static `{ motion: ['gsap', 'motion', 'lenis'] }` form tells
        // Rollup to eagerly resolve those packages as chunk entry points
        // even though nothing imports them yet (Animation phase hasn't
        // landed) - harmless here (produces an empty chunk) but fails hard
        // on some npm/Rollup version combinations ("Failed to resolve entry
        // for package 'motion'"). A function only assigns a chunk name for
        // modules Rollup actually encounters while walking the real import
        // graph, so unused vendor packages are never force-resolved - once
        // Phase 5 actually imports gsap/motion/lenis somewhere, they'll
        // start landing in the `vendor-animation` chunk automatically.
        rollupOptions: {
            output: {
                manualChunks(id: string) {
                    if (!id.includes('node_modules')) {
                        return undefined;
                    }

                    if (id.includes('three') || id.includes('@react-three')) {
                        return 'three';
                    }

                    if (id.includes('gsap') || id.includes('/motion/') || id.includes('lenis')) {
                        return 'vendor-animation';
                    }

                    return undefined;
                },
            },
        },
    },
});
