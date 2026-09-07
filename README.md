# Portfolio CRM Platform — Phase 1

Premium 3D Developer Portfolio + Personal CRM + Admin CMS for Ankit Vishwakarma.
Laravel 12 + Inertia.js + React + TypeScript + Tailwind CSS, with Redis, Laravel
Reverb, and Spatie Permission wired into the architecture.

**This is Phase 1 of a 10-phase build** (see the project's phased spec): architecture,
database schema, models, roles/permissions, and authentication. The public 3D
experience, admin CMS screens, CRM/analytics, and real-time visitor tracking are
built in the phases that follow, on top of this foundation.

## Why you need to run two commands before this runs anywhere

This codebase was written in a sandboxed environment whose network policy allows
`npm`/`registry.npmjs.org` but blocks `composer`/`repo.packagist.org`. Every PHP file
here (migrations, models, controllers, services, policies, config) was hand-written
to exact Laravel 12 conventions and syntax-checked (`php -l`), but **`vendor/` does
not exist yet** — Composer never ran. The frontend, by contrast, has already been
`npm install`-ed and both `tsc --noEmit` and `vite build` were run successfully
against this exact code.

## Setup

```bash
composer install
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
- `DB_*` — your MySQL connection.
- `REDIS_*` — your Redis connection (cache, session, and queue all default to redis).
- `REVERB_*` / `VITE_REVERB_*` — leave the local defaults for development, or generate
  your own app id/key/secret for staging/production.
- `ADMIN_SEED_EMAIL` / `ADMIN_SEED_PASSWORD` — the Super Admin account that
  `AdminUserSeeder` will create. **Set a real password before seeding** — the seeder
  refuses to run with the placeholder value.
- `MAIL_*` — used for the contact-form/lead notification emails (wired up in the CRM
  phase).

```bash
php artisan migrate
php artisan db:seed
npm install
npm run build   # or `npm run dev` for local development
```

Run the queue worker and Reverb server (needed once the CRM/real-time phases land;
harmless to start now):

```bash
php artisan queue:work
php artisan reverb:start
```

Then `php artisan serve` (or point your web server's document root at `public/`)
and log in at `/login` with the admin account you seeded.

## What's implemented in this phase

- **Database**: all 26 tables from the spec (profiles, experiences, skills,
  projects + 5 related tables, services, certifications, social links, contact
  messages, the full visitor/session/page-view/event CRM schema, leads + lead
  activities, site_settings, seo_settings, activity_logs), plus Spatie
  Permission's role/permission tables. Every migration is reversible.
- **Models**: one Eloquent model per table, with relationships, casts (including
  PHP 8.1+ backed enums for classification/status/type columns), and query scopes.
  Requires PHP 8.2+ (matches Laravel 12's own minimum); nothing in this codebase
  uses PHP-8.3-exclusive syntax, so it runs fine on 8.2 if that's what you have.
  No N+1-prone default eager loading assumptions — call sites are expected to
  `with()` explicitly (enforced in dev via `Model::shouldBeStrict()`).
- **Roles & policies**: `super_admin` and `editor` roles (Spatie Permission).
  A single reusable `App\Policies\ContentPolicy` is bound to every
  editor-manageable content model (DRY) via `Gate::policy()` in
  `AppServiceProvider`; `SiteSettingPolicy` and `UserPolicy` cover the
  Super-Admin-only surfaces (settings, user management) per the spec's role
  rules.
- **Auth**: login, logout, password reset, password confirmation, email
  verification, and account (name/email/password) self-service — all
  Inertia + React + TypeScript pages. There is **no public registration route**:
  this is an invite-only CMS, so Super Admins provision Editor/Admin accounts
  from `/admin/users`.
- **Services**: `SiteSettingService` (cached key/value settings — this is why
  nothing is hard-coded: WhatsApp number, email, social links, theme tokens all
  flow through it) and `ActivityLogService` (writes `activity_logs` rows; IPs are
  stored as SHA-256 hashes, never plain text).
- **Seed data**: sourced strictly from the resume/spec facts provided — company
  names, titles, and dates for both roles; the full core-technology list,
  categorized for both `technologies` (project/experience tagging) and
  `skills`/`skill_categories` (public skills section); GitHub/LinkedIn social
  links; the ten suggested service categories; and the AI-Powered Hiring
  Sentiment Analysis Platform as a **draft, unpublished** featured project
  (see `database/seeders/ProjectSeeder.php` for why classification is left as
  `experiment` pending your confirmation). Nothing else was invented — no
  fabricated metrics, client names, or project details.
- **Frontend architecture**: `Components/UI` (Button, TextInput, InputLabel,
  InputError, Checkbox, TextLink), `Layouts` (GuestLayout, AdminLayout),
  `Hooks` (`usePage`, `useAuth`), `Utils` (`cn`), `Types` (shared Inertia page
  props). GSAP, Motion, Lenis, Three.js, React Three Fiber, and Drei are
  installed and code-split from the main bundle (see `vite.config.ts`) but not
  yet used — that's the 3D/Animation phase.

## What's deliberately NOT in this phase

Admin CRUD screens for projects/skills/experience/services/etc., the public
marketing site (hero, timeline, skills constellation, project gallery), the 3D
scene, GSAP/Motion/Lenis usage, visitor tracking + CRM dashboards, live-visitor
WebSocket broadcasting, and SEO (sitemap/robots/meta) all come in their own
phases, built against this schema — not stubbed out here.

## Before you seed against production data

`ProjectSeeder` publishes the AI Hiring Sentiment Analysis project as a **draft**
(`is_published => false`) with `classification => experiment`. Please confirm the
correct classification (real / personal / experiment) and flesh out the full
case-study fields from the admin CMS before publishing it — the seeder only used
what was explicitly stated in the spec, per the project's "never misrepresent a
project" rule.
