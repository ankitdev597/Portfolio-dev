# Deploying to Render

> **Legacy / optional.** Vercel is now the primary deployment target — see
> `VERCEL_DEPLOY.md`. Nothing here is required anymore; this file and
> `render.yaml` are left as a working fallback if you ever want them, but
> the live site doesn't depend on Render.

This repo deploys as a Render **Blueprint** (`render.yaml`), which provisions
everything in one pass:

| Service | Type | Role |
|---|---|---|
| `portfolio-crm-web` | Web Service (Docker) | Public site + `/admin` CMS. Runs migrations on boot, **and** runs `php artisan queue:work` in-process (see note below). |
| `portfolio-crm-reverb` | Web Service (Docker) | Laravel Reverb websocket server — needs to be public. |
| `portfolio-crm-db` | Postgres | Render has no managed MySQL, so the app runs on Postgres here (local XAMPP dev keeps using MySQL — see `config/database.php`, both connections are defined). |
| `portfolio-crm-redis` | Key Value | Redis-compatible — session/cache/queue driver. |

Both app services build from the same root `Dockerfile`; which process each
one runs is picked by the `APP_ROLE` env var (`web` / `worker` / `reverb`) —
see `docker/entrypoint.sh`.

**No separate worker service:** Render's free plan doesn't offer the
"Background Worker" service type — a Blueprint sync that tries to create one
fails with `service type is not available for this plan`. So `portfolio-crm-web`
runs `php artisan queue:work` as a background process inside the same
container as `php artisan serve` (wrapped in a restart loop, since there's no
process supervisor in the image — see `docker/entrypoint.sh`). This is a
reasonable tradeoff for a low-traffic portfolio/CRM; if job volume grows or
you upgrade to a paid plan, `render.yaml` has the exact `worker` service
block commented in at the top ready to uncomment (the `APP_ROLE=worker`
branch in `entrypoint.sh` already supports it, unchanged).

## One-time setup

1. Push this repo to GitHub (see the main deploy message for exact steps).
2. In the Render dashboard: **New +** → **Blueprint** → connect this GitHub
   repo → Render reads `render.yaml` and shows a preview of all resources
   it's about to create (env group, Postgres, Key Value, and the two app
   services) → **Apply**.
3. Wait for both Docker builds to finish (the web service's build also
   runs the Vite frontend build — first build is the slowest, ~5-10 min).
4. Open `portfolio-crm-web`'s URL and confirm the site loads, then log in at
   `/login` with the Super Admin account from `AdminUserSeeder` and change
   the password immediately (production credentials should never be the
   seeded default).
5. **Verify the Reverb hostname.** `render.yaml` and `.env.production`
   assume the Reverb service ends up at
   `https://portfolio-crm-reverb.onrender.com`. If Render assigned a
   different hostname (name collision), update `VITE_REVERB_HOST` in
   `.env.production` and `REVERB_HOST` in `render.yaml`'s `portfolio-crm-shared`
   group to match, then redeploy `portfolio-crm-web` so the frontend bundle
   picks up the corrected value.

## Known limitation: uploaded files don't persist on the free plan

Render's **free** web service has no persistent disk. Every avatar, resume,
project thumbnail, certification badge, and site favicon/logo uploaded
through the CMS is written to local disk and **will be lost** the next time
the service redeploys or spins down from inactivity.

The fix is already wired into the code (`config/filesystems.php`) — it just
needs object storage credentials:

1. Create a free [Cloudflare R2](https://developers.cloudflare.com/r2/) bucket
   (or any S3-compatible provider — AWS S3, Backblaze B2, etc. all work the
   same way since Laravel's `s3` driver is protocol-compatible).
2. In the Render dashboard, add these env vars to `portfolio-crm-web` (only
   the web service needs them — it's the only one that handles uploads):
   - `PUBLIC_DISK_DRIVER=s3`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_DEFAULT_REGION` (R2 uses `auto`)
   - `AWS_BUCKET`
   - `AWS_ENDPOINT` (R2's S3 API endpoint for your account)
   - `AWS_USE_PATH_STYLE_ENDPOINT=true`
   - `AWS_URL` (your bucket's public base URL, so `Storage::disk('public')->url()`
     returns a real link)
3. Redeploy. No code changes needed — every `Storage::disk('public')` /
   `self::DISK` call in the Service classes starts writing to the bucket
   instead of local disk automatically.

Until this is set up, treat the free deployment as a **demo/preview link**,
not the permanent home for real uploads.

## Free plan expiry reminder

Render deletes free Postgres and free Key Value instances **30 days** after
creation unless upgraded to a paid plan before then. Set yourself a
reminder — losing the database silently is the failure mode to avoid. The
web/reverb free services don't expire, they just spin down after 15
minutes of inactivity (cold start of ~30-60s on the next request). Note that
a spin-down also stops the in-process queue worker running inside
`portfolio-crm-web` — queued jobs simply wait until the next request wakes
the service back up.

## Redeploying after future CMS batches

Render auto-deploys on every push to the connected branch (`autoDeploy` is
on by default for Blueprint-created services). Once this repo is the
source of truth on GitHub, future sessions should push there instead of
(or in addition to) the device-bridge push to your local machine — ask
whichever session is doing the work to keep both in sync, or make GitHub
the only target once you're comfortable relying on it.
