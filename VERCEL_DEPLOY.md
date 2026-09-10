# Deploying to Vercel

Vercel is now the **primary** deployment target — Render is no longer
required to run anything. `render.yaml`, the root `Dockerfile`, and
`DEPLOY.md` are left in the repo untouched (harmless if unused, and a
working fallback if you ever want it), but nothing here depends on them
anymore. Once you've confirmed the Vercel site works, you can pause or
delete the Render Postgres, Redis, and web services from Render's own
dashboard — this repo doesn't need them.

| File | Purpose |
|---|---|
| `Dockerfile.vercel` | Separate image from the root `Dockerfile` — builds the frontend, installs PHP deps, runs on FrankenPHP (Vercel's documented way to run Laravel). |
| `Caddyfile.vercel` | Web server config — routes every request through `public/index.php`. |
| `vercel.json` | Tells Vercel to run this as a container service, not a Node function. |
| `.vercelignore` | Mirrors `.dockerignore` — keeps `.env`, `vendor/`, `node_modules/` etc. out of the deploy. |

## What's different from the old Render deployment, and why

Vercel's compute model is fundamentally different from Render's: every
request runs in a fresh, short-lived container instead of one long-running
VM. A few things follow from that:

- **No Laravel Reverb (websockets).** Vercel can't host a persistent
  process. `BROADCAST_CONNECTION=null` on this target. Nothing in the app
  uses Reverb for a real feature (it was scaffolded for a future phase —
  see `routes/channels.php`), so this removes nothing that works today.
  `resources/js/bootstrap.ts` skips creating an Echo/Pusher-js client
  entirely when `VITE_REVERB_HOST` isn't set at build time (which it isn't,
  here) — no pointless reconnect attempts in the browser console.
- **No background queue worker.** `QUEUE_CONNECTION=sync` — any future
  `dispatch()` call runs inline during the request instead of being
  queued. Nothing in the app dispatches a queued job today.
- **Sessions:** `SESSION_DRIVER=cookie`. A serverless container has no
  durable local disk and every instance is a stranger to every other one,
  so cookie sessions are the simplest zero-dependency choice here.
- **Database:** Postgres via [Neon](https://neon.tech), provisioned
  *through* Vercel (Marketplace integration) rather than Render's managed
  Postgres — see setup below.
- **Migrations:** run on demand via a secured HTTP endpoint
  (`/system/deploy-hook`), not at container boot — see "Run migrations"
  below for why.
- **File storage:** unchanged — still Cloudflare R2 via
  `PUBLIC_DISK_DRIVER=s3`. See "About Vercel Blob" below for why R2 stays
  the pick instead of Vercel's own Blob product.

## About Vercel Blob (why this still uses Cloudflare R2)

You've asked for Vercel Blob a couple of times, so it's worth being
straight about why this deployment doesn't use it, rather than quietly
routing around the request.

Vercel Blob only ships an official SDK for JavaScript/TypeScript and
Python. I checked Vercel's own SDK documentation for the raw HTTP API a
PHP app would need to call directly (endpoint URLs, required headers,
signing scheme) — it explicitly does not publish that. The docs only
describe the SDK's behavior and tell you to inspect the SDK's own source
if you need the wire format. Building a Laravel filesystem driver against
that would mean reverse-engineering an undocumented, unversioned internal
API — it could break on any Vercel SDK update with no changelog entry to
warn you, and it's the kind of fragile, unsupported code this project's
own rules explicitly rule out ("always generate production-ready code").

Cloudflare R2 is genuinely S3-compatible with a fully documented API, and
object storage doesn't care which compute platform is asking for a file —
Vercel talking to R2 is exactly as "fully on Vercel" as Vercel talking to
Blob, in every way that affects your app or your bill (R2 also has a much
more generous free tier: 10 GB storage, no egress fee for typical use, vs.
Blob's free tier egress caps). If you'd still rather use Blob and are okay
with unsupported reverse-engineered code maintained on a best-effort
basis, say so explicitly and I'll build it — but R2 is the recommendation.

## One-time setup

### 1. Generate an `APP_KEY`

Every Laravel app needs one, and it must be stable (never regenerate it
once real users/sessions depend on it). Here's a freshly generated one you
can use for this deployment:

```
base64:OU4rV1JyukUmHLYeLWnh1QhFb1X0ev/2uCXuiB9MmV4=
```

Treat it like a password — set it only in Vercel's Environment Variables
dashboard (or `vercel env add APP_KEY`), never commit it to the repo.

### 2. Provision a Postgres database via Neon (Vercel Marketplace)

"Vercel Postgres" was retired — Vercel now partners with Neon for this,
and it's a couple of clicks from inside your Vercel project:

1. Vercel dashboard → your project → **Storage** tab → **Create Database**
   → **Marketplace Database Providers** → **Neon**.
2. **Install** (or **Create New Neon Account** if you don't already have
   one) → accept the terms → pick a region close to your users → pick the
   Free plan.
3. Name the database (e.g. `portfolio-crm`) → **Connect Project** →
   confirm connecting it to this Vercel project.

That's it — no connection string to copy by hand. Vercel automatically
injects `DATABASE_URL` (pooled, use this one), `DATABASE_URL_UNPOOLED`,
and the individual `PGHOST`/`PGUSER`/`PGDATABASE`/`PGPASSWORD` vars into
every deployment of this project. `config/database.php`'s `pgsql`
connection already reads `DATABASE_URL` as a fallback (falls back to
`DB_URL` first, for compatibility with the old Render setup) — so once
this integration is installed, the database "just works" with zero extra
env vars for you to set.

Neon's free tier: 512 MB storage, no credit card required. Plenty for a
portfolio/CRM at this scale.

**If you have real data already in Render's Postgres** (contact-form
submissions, activity logs, any admin users you created by hand — not
just seeded content, which `db:seed` will recreate automatically), export
it from Render and import it into Neon before you decommission Render's
database, or that data is gone:

```bash
# From a machine with the Postgres client tools installed:
pg_dump --no-owner --no-privileges "<Render External Database URL>" > backup.sql
psql "<Neon connection string from the Storage tab>" < backup.sql
```

Get the Render External Database URL from Render dashboard →
`portfolio-crm-db` → **Connect** → **External Database URL**. Get the
Neon one from Vercel → Storage → your database → **.env.local** tab
(that's `DATABASE_URL_UNPOOLED` — use the unpooled one for `psql`/`pg_dump`
work, not the pooled `DATABASE_URL`).

### 3. Set the remaining environment variables in Vercel

Project Settings → Environment Variables:

| Key | Value |
|---|---|
| `APP_KEY` | the value from step 1 |
| `APP_URL` | your Vercel deployment URL (e.g. `https://your-project.vercel.app`) |
| `DEPLOY_HOOK_SECRET` | any long random string you generate yourself (e.g. `openssl rand -hex 32`) — this protects the migration endpoint in step 4 |
| `AWS_ACCESS_KEY_ID` | your Cloudflare R2 access key |
| `AWS_SECRET_ACCESS_KEY` | your Cloudflare R2 secret key |
| `AWS_BUCKET` | `portfolio-crm` |
| `AWS_ENDPOINT` | your R2 endpoint (`https://<account-id>.r2.cloudflarestorage.com`) |
| `AWS_URL` | your R2 public bucket URL |

You do **not** need to set `DATABASE_URL`, `DB_URL`, or any `DB_*`
variable — the Neon integration from step 2 injects `DATABASE_URL`
automatically, and everything else database-related
(`DB_CONNECTION=pgsql`, `DB_SSLMODE=require`) is already baked into
`Dockerfile.vercel`'s `ENV` block. Same for `APP_ENV`, `SESSION_DRIVER`,
`QUEUE_CONNECTION`, `BROADCAST_CONNECTION`, `PUBLIC_DISK_DRIVER`, and the
PHP extensions — none of those need re-setting in the dashboard.

### 4. Deploy

```
npm i -g vercel   # if you don't have the CLI
vercel login
vercel link       # connect this repo to a Vercel project
vercel deploy --prod
```

Or connect the GitHub repo directly in the Vercel dashboard for
git-push auto-deploys.

### 5. Run migrations (once per deploy that changes the schema)

Vercel's own guidance is explicit: **don't** run migrations from inside a
container's startup command — multiple cold-start instances could race
each other into running them concurrently, corrupting the schema. Instead,
this repo ships a small authenticated endpoint that runs
`migrate --force` + `db:seed --force` on demand
(`App\Http\Controllers\System\DeployHookController`, wired at
`POST /system/deploy-hook`). Call it once, by hand, right after each
deploy that changes the database:

```bash
curl -X POST https://your-project.vercel.app/system/deploy-hook \
  -H "Authorization: Bearer <your DEPLOY_HOOK_SECRET value>"
```

A successful response looks like `{"ok":true,"migrate":"...","seed":"..."}`.
Leaving `DEPLOY_HOOK_SECRET` unset makes this endpoint 404 unconditionally
everywhere it isn't explicitly configured (including the old Render
deployment), so there's no exposure risk from having the route exist.

## After deploying

Open the Vercel URL and confirm the homepage and `/admin` login both
work. The Super Admin account is created by `AdminUserSeeder`, which only
runs if `ADMIN_SEED_PASSWORD` was set as an env var when you last called
the deploy-hook — set it in Vercel's dashboard alongside the others above
if you haven't already, then re-run step 5.
