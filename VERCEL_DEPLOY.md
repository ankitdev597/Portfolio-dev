# Deploying to Vercel

This is a **second, parallel deployment target** alongside Render (see
`DEPLOY.md`) - nothing about the Render setup was touched or removed. You can
run both, keep only one, or use Render purely as the database/file layer
while Vercel serves the actual site. The files that make this work:

| File | Purpose |
|---|---|
| `Dockerfile.vercel` | Separate image from the root `Dockerfile` - builds the frontend, installs PHP deps, runs on FrankenPHP (Vercel's documented way to run Laravel). |
| `Caddyfile.vercel` | Web server config - routes every request through `public/index.php`. |
| `vercel.json` | Tells Vercel to run this as a container service, not a Node function. |
| `.vercelignore` | Mirrors `.dockerignore` - keeps `.env`, `vendor/`, `node_modules/` etc. out of the deploy. |

## What's different from the Render deployment, and why

Vercel's compute model is fundamentally different from Render's: every
request runs in a fresh, short-lived container instead of one long-running
VM. Two features can't survive that move, and this deployment target simply
doesn't run them:

- **No Laravel Reverb (websockets).** Vercel can't host a persistent
  process. `BROADCAST_CONNECTION=null` on this target. Nothing in the app
  currently uses Reverb for a real feature yet (it was scaffolded for a
  future real-time phase - see `routes/channels.php`), so this removes
  nothing that works today. `resources/js/bootstrap.ts` now skips creating
  an Echo/Pusher-js client entirely when `VITE_REVERB_HOST` isn't set at
  build time (which it isn't, here) - no pointless reconnect attempts in
  the browser console.
- **No background queue worker.** `QUEUE_CONNECTION=sync` - any future
  `dispatch()` call runs inline during the request instead of being queued.
  Nothing in the app dispatches a queued job today, so this is a no-op in
  practice.
- **Session storage:** `SESSION_DRIVER=cookie` instead of the database/Redis
  driver Render uses. A serverless container has no durable local disk and
  every instance is a stranger to every other one, so the two options are
  "store session data in the browser's encrypted cookie" (zero extra
  infrastructure) or "point at an external Redis" (one more account/service
  to wire up). Cookie sessions are the simpler, zero-dependency choice for
  a portfolio/CRM's session size, so that's the default here - if you ever
  need shared server-side session state, swap this for `redis` and add a
  `REDIS_URL` pointing at the same Render Key Value instance.
- **File storage:** unchanged - still Cloudflare R2 via
  `PUBLIC_DISK_DRIVER=s3` (see the storage fix from earlier). Object storage
  doesn't care which compute platform is asking for a file, so nothing
  here needed to change at all.
- **Database:** unchanged - still your existing Render Postgres. You are
  **not** migrating data anywhere; Vercel just needs the *external*
  connection string for the same database (see below).

## One-time setup

### 1. Generate an `APP_KEY`

Every Laravel app needs one, and it must be stable (never regenerate it once
real users/sessions depend on it). Here's a freshly generated one you can
use for this deployment:

```
base64:OU4rV1JyukUmHLYeLWnh1QhFb1X0ev/2uCXuiB9MmV4=
```

Treat it like a password - set it only in Vercel's Environment Variables
dashboard (or `vercel env add APP_KEY`), never commit it to the repo.

### 2. Get your Postgres connection string from Render

Render's Postgres exposes two URLs; the **internal** one only works from
other Render services, so you need the **external** one for Vercel:

1. Render dashboard -> `portfolio-crm-db` -> **Connect** -> copy **External
   Database URL**.
2. It'll look like `postgresql://user:pass@host/dbname`. Laravel needs the
   `pgsql://` scheme instead of `postgresql://` - change just that prefix
   before using it as `DB_URL` below (or leave it as-is: `DB_CONNECTION=pgsql`
   is already set explicitly in `Dockerfile.vercel`, which is what actually
   picks the driver either way).

### 3. Set environment variables in Vercel

Project Settings -> Environment Variables:

| Key | Value |
|---|---|
| `APP_KEY` | the value from step 1 |
| `APP_URL` | your Vercel deployment URL (e.g. `https://your-project.vercel.app`) |
| `DB_URL` | the external Postgres URL from step 2 |
| `AWS_ACCESS_KEY_ID` | same R2 credentials already set on Render |
| `AWS_SECRET_ACCESS_KEY` | same R2 credentials already set on Render |
| `AWS_BUCKET` | `portfolio-crm` |
| `AWS_ENDPOINT` | same R2 endpoint already set on Render |
| `AWS_URL` | same R2 public URL already set on Render |

Everything else (`APP_ENV`, `SESSION_DRIVER`, `QUEUE_CONNECTION`,
`BROADCAST_CONNECTION`, `PUBLIC_DISK_DRIVER`, the PHP extensions, etc.) is
already baked into `Dockerfile.vercel`'s `ENV` block, so you don't need to
set those again in the dashboard.

### 4. Run migrations once

Vercel's own guidance is explicit: **don't** run migrations from inside the
container's startup (multiple cold-start instances could race each other
into running them concurrently). Since your Render Postgres is the same
database either way, the simplest safe option is to let the *existing*
Render web service keep doing what it already does - it runs
`php artisan migrate --force` on every boot (see `docker/entrypoint.sh`),
which is exactly the "release step" Vercel recommends running separately.
You don't have to serve public traffic from Render to get this - it can sit
there doing nothing but keeping the schema current. If you'd rather not
keep two services running at all, run `php artisan migrate --force` by hand
from any machine that can reach the external Postgres URL.

### 5. Deploy

```
npm i -g vercel   # if you don't have the CLI
vercel login
vercel link       # connect this repo to a Vercel project
vercel deploy --prod
```

Or connect the GitHub repo directly in the Vercel dashboard for git-push
auto-deploys, same as Render.

## After deploying

Open the Vercel URL and confirm the homepage and `/admin` login both work.
Log in with the same Super Admin account seeded on Render (same database).
