/**
 * Laravel Echo / Reverb client bootstrap. Not connected to any channel yet
 * - the live-visitor dashboard (spec #23) subscribes in the CRM/Realtime
 * phase. Declared here now so the env wiring (VITE_REVERB_*) and the
 * window.Echo instance exist from day one.
 *
 * Guarded on VITE_REVERB_HOST being set: the Vercel deployment target
 * (see Dockerfile.vercel/vercel.json) deliberately runs no Reverb server
 * at all - Vercel's serverless model can't host a persistent WebSocket
 * process - so that build simply omits VITE_REVERB_* and this skips
 * initializing Echo entirely, rather than creating a Pusher-js client
 * that endlessly retries connecting to a host that doesn't exist. Nothing
 * in the app subscribes to a channel yet, so skipping this is a no-op
 * everywhere it's skipped.
 */
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
    interface Window {
        Pusher: typeof Pusher;
        Echo?: Echo<'reverb'>;
    }
}

if (import.meta.env.VITE_REVERB_HOST) {
    window.Pusher = Pusher;

    window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 8080),
        wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
    });
}
