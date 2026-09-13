/**
 * Static site data. Sourced from Ankit's own resume and live project
 * history. There is no backend or database here on purpose - update this
 * file and redeploy to change content, same as the "single-page, no API"
 * brief asked for.
 */

export interface Profile {
  fullName: string;
  headline: string;
  tagline: string;
  shortBio: string;
  yearsExperience: number;
  availability: "available" | "unavailable";
  availabilityNote: string;
  email: string;
  location: string | null;
}

export const profile: Profile = {
  fullName: "Ankit Vishwakarma",
  headline: "Full Stack Developer & Senior Software Engineer",
  tagline: "Full-Stack Engineering • AI/LLM Integration • Cloud & DevOps",
  shortBio:
    "I'm a Full Stack Developer and Senior Software Engineer with 4+ years shipping production web applications across the MERN, MEAN, and Laravel/PHP stacks, deployed on AWS. I integrate OpenAI and third-party LLM APIs into real product features - from real-time AI chat over WebSockets to a live hiring-sentiment-analysis platform - and lean on AI-assisted tools like Cursor and Claude to move fast without cutting corners. Beyond writing code, I own CI/CD pipelines, administer Linux servers, lead code reviews, and mentor junior engineers. My work spans cleaning services, facilities management, entertainment, fintech, and travel, for clients across India, the UK, and Nigeria.",
  yearsExperience: 4,
  availability: "available",
  availabilityNote:
    "Currently serving notice (last working day 10 Nov 2026) - immediate joiner available with an early release.",
  email: "av841344@gmail.com",
  location: "Pratapgarh, Uttar Pradesh, India",
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
    "Full Stack Developer and Senior Software Engineer with 4+ years building production web apps across MERN, MEAN, and Laravel/PHP - AI/LLM integration, real-time systems, and AWS deployment for clients in cleaning services, fintech, entertainment, and travel.",
  keywords:
    "full stack developer, senior software engineer, react developer, node.js developer, laravel developer, AI LLM integration, AWS deployment, portfolio",
  metaTitle: "Ankit Vishwakarma | Senior Software Engineer & Full Stack Developer",
  metaDescription:
    "Full Stack Developer and Senior Software Engineer with 4+ years across MERN, MEAN, and Laravel/PHP - AI/LLM integration, real-time applications, and AWS deployment.",
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
