import { resume } from "@/data/profile";

/** Canonical live site — Vercel production URL */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfolio-dev-flax-rho.vercel.app"
).replace(/\/$/, "");

/** Absolute public URL for shares / QR (always the deployed site). */
export function getSiteUrl(): string {
  return SITE_URL;
}

export function getResumeUrl(): string {
  return `${SITE_URL}${resume.path}`;
}
