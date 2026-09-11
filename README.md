# Ankit Vishwakarma — Portfolio

A single-page developer portfolio built with Next.js. No backend, no database, no API routes — every section (profile, skills, experience, projects, services, resume, contact) is sourced from typed static data in `data/` and rendered as a fully static, prerendered site.

## Stack

- **Framework:** Next.js (App Router, Turbopack)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animation:** GSAP + ScrollTrigger, Motion, Lenis (smooth scroll)
- **3D:** Three.js, React Three Fiber, Drei

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Editing content

All site content lives in `data/*.ts` as typed exports — edit those files and the site updates on next build. No CMS, no migrations, no seeders.

- `data/profile.ts` — name, headline, bio, SEO metadata, resume info
- `data/skills.ts` — skill categories
- `data/experience.ts` — work history
- `data/projects.ts` — portfolio projects (title, description, tech, live links)
- `data/services.ts` — services offered

## Build

```bash
npm run build
```

Produces a fully static, prerenderable output — no server runtime or environment variables required. Deploys cleanly to Vercel with zero configuration.

## History

This repository previously hosted a Laravel + Inertia.js + React CRM/CMS version of this site. That backend was removed in favor of a static Next.js single-page app; the Laravel code remains recoverable from this repo's git history.
