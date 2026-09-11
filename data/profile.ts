/**
 * Static site data, ported 1:1 from the live Laravel/Postgres content
 * (read directly from the production Inertia page props) at the time of
 * the Next.js rewrite. There is no backend or database here on purpose -
 * update this file and redeploy to change content, same as the
 * "single-page, no API" brief asked for.
 */

export interface Profile {
  fullName: string;
  headline: string;
  tagline: string;
  shortBio: string;
  yearsExperience: number;
  availability: "available" | "unavailable";
  email: string;
  location: string | null;
}

export const profile: Profile = {
  fullName: "Ankit Vishwakarma",
  headline: "Senior Software Engineer | Full Stack Developer | AI | DevOps",
  tagline: "Full Stack Development • AI/LLM Integration • Cloud & DevOps",
  shortBio:
    "Senior Software Engineer with 4+ years of experience across full-stack development, AI/LLM integration, real-time applications, and cloud/DevOps.",
  yearsExperience: 4,
  availability: "available",
  email: "av841344@gmail.com",
  location: null,
};

export interface SeoData {
  siteTitle: string;
  title: string;
  description: string;
  keywords: string;
  metaTitle: string;
  metaDescription: string;
}

export const seo: SeoData = {
  siteTitle: "Ankit Vishwakarma | Senior Software Engineer",
  title: "Ankit Vishwakarma - Full Stack Developer",
  description:
    "Full stack developer specializing in Laravel, React, and modern web platforms - e-commerce, CRM, real-time video/audio, and AI-integrated applications built for real clients.",
  keywords:
    "full stack developer, laravel developer, react developer, web application developer, portfolio",
  metaTitle: "Ankit Vishwakarma | Senior Software Engineer & Full Stack Developer",
  metaDescription:
    "Senior Software Engineer specializing in full-stack development, AI/LLM integration, real-time applications, and cloud/DevOps.",
};

export interface SocialLink {
  platform: "github" | "linkedin";
  label: string;
  url: string;
}

export const socialLinks: SocialLink[] = [
  { platform: "github", label: "GitHub", url: "https://github.com/ankitdev597" },
  {
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/ankit-vishwakarma-15b6b1233",
  },
];

export interface ResumeData {
  roleTitle: string;
  fileName: string;
  path: string;
}

export const resume: ResumeData = {
  roleTitle: "Full Stack Developer",
  fileName: "Ankit_Vishwakarma_FullStack_Developer_Resume.pdf",
  path: "/resume/Ankit_Vishwakarma_FullStack_Developer_Resume.pdf",
};
