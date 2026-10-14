# Ankit Vishwakarma — Portfolio

Professional, fully responsive developer portfolio built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and light **Motion** fade/slide effects. Dark by default with a light/dark toggle. No Three.js, GSAP, or particle canvases.

## Stack

- Next.js 16 (App Router)
- React 19
- Tailwind CSS v4
- Motion (`motion/react`) for light entrance animations
- Lucide icons
- Deploy target: Vercel

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build
npm start
```

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import the project in [Vercel](https://vercel.com).
3. Set environment variables (optional):
   - `NEXT_PUBLIC_SITE_URL` — canonical site URL (default `https://ankitvishwakarma.dev`)
   - `NEXT_PUBLIC_FORMSPREE_ID` — Formspree form id for the contact form
4. Deploy.

## Content

All copy lives in [`data/data.ts`](./data/data.ts). Update that file to change profile, skills, experience, projects, education, and SEO strings.

Optional personal projects: fill the empty `personalProjects` array in `data/data.ts`.

## What you need to replace

| Item | Path / env | Notes |
| --- | --- | --- |
| Profile photo | `public/images/profile-photo.jpg` | Used in hero + Open Graph |
| Resume PDF | `public/resume.pdf` | Linked from navbar + hero |
| Contact form | `NEXT_PUBLIC_FORMSPREE_ID` | Without it, the form falls back to `mailto:` |
| Site URL | `NEXT_PUBLIC_SITE_URL` | Canonical URL, sitemap, JSON-LD |

## Sections

1. Sticky navbar + theme toggle + Download Resume  
2. Hero  
3. About  
4. Skills  
5. Experience  
6. Projects (filter tabs)  
7. Education & Certifications  
8. Contact + footer  

## Accessibility & SEO

- Skip-to-content link, semantic landmarks, visible focus rings  
- `prefers-reduced-motion` respected  
- Meta, Open Graph, Twitter cards, JSON-LD `Person`  
- `app/sitemap.ts`, `app/robots.ts`, `public/favicon.svg`
