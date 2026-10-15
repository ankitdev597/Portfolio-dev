export type ProjectIconKey =
  | "wallet"
  | "comms"
  | "facilities"
  | "care"
  | "casting"
  | "trading"
  | "ai-chat"
  | "travel"
  | "health"
  | "finance"
  | "sports"
  | "jobs"
  | "data"
  | "automation"
  | "scheduler"
  | "ai-toolkit"
  | "business";

export interface Project {
  title: string;
  slug: string;
  description: string;
  featured: boolean;
  technologies: string[];
  icon: ProjectIconKey;
  liveUrl: string | null;
  githubUrl: string | null;
  /** A second live link worth surfacing (e.g. a companion admin/author panel). */
  secondaryUrl?: string;
  secondaryLabel?: string;
  /** Homepage / primary UI screenshot under /public */
  image?: string;
  /**
   * How to label `image`. Defaults to "screenshot" when `image` is set.
   * Use "representative" only for non-live placeholder art — never pass stock
   * art off as a real website capture.
   */
  imageKind?: "screenshot" | "representative";
  /** Optional extra screenshots */
  gallery?: string[];
  /** Short bullets shown on featured cards when present */
  features?: string[];
}

/**
 * Descriptions are kept to a similar length (~2 short sentences) so project
 * cards read evenly in the grid and stay aligned with each project name.
 */
export const projects: Project[] = [
  {
    title: "Colossians Cleaning Services — Portal & Admin CRM",
    slug: "colossians-cleaning-care-services-platform",
    description:
      "UK cleaning operations platform: client/staff portal entry plus a full admin CRM for jobs, customers, cleaners, scheduling, invoices, and payroll.",
    featured: true,
    technologies: ["React.js", "Node.js", "Laravel", "MySQL", "REST APIs"],
    icon: "care",
    liveUrl: "https://app.colossianscleaningservices.com/",
    githubUrl: null,
    secondaryUrl: "https://crm.colossianscareservices.co.uk",
    secondaryLabel: "Admin CRM",
    image: "/images/projects/colossians-portal.jpg",
    imageKind: "screenshot",
    gallery: [
      "/images/projects/colossians-portal.jpg",
      "/images/projects/colossians-admin-dashboard.png",
    ],
    features: [
      "Client vs staff portal selection with multi-step sign-in",
      "Admin dashboard: jobs, customers, cleaners, properties",
      "Scheduling, invoices, work hours & pay (STARS staff app)",
    ],
  },
  {
    title: "E-Commerce Checkout & Wallet Platform",
    slug: "e-commerce-checkout-wallet-platform",
    description:
      "E-commerce checkout and wallet platform with card gateways and an in-app digital wallet for balance-based payments across the storefront.",
    featured: true,
    technologies: ["React.js", "Laravel", "MySQL", "Stripe", "PayPal", "CinetPay", "PawaPay"],
    icon: "wallet",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Service CRM with Video, Audio, SMS & Chat",
    slug: "service-crm-with-video-audio-sms-chat",
    description:
      "Service CRM dashboard combining live video, audio, SMS, and real-time chat so teams manage customer conversations in one place.",
    featured: true,
    technologies: ["Laravel", "WebSockets", "Laravel Reverb", "Firebase", "Agora", "Twilio"],
    icon: "comms",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Sentimenter AI - Hiring Sentiment Analysis Platform",
    slug: "sentimenter-ai",
    description:
      "Hiring sentiment analysis platform that scores candidate responses in real time with LLM insights and low-latency WebSocket AI chat.",
    featured: true,
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB", "OpenAI API", "WebSockets"],
    icon: "ai-chat",
    liveUrl: "https://sentimenter.ai/",
    githubUrl: null,
    image: "/images/projects/sentimenter-ai.png",
    imageKind: "screenshot",
    features: [
      "Agentic CX workspace for feedback, reviews, and NPS signals",
      "Customer-pulse dashboard with sentiment score and trends",
      "Collect → explain → assign action workflow on the marketing site",
    ],
  },
  {
    title: "TovaPulse - Health & Wellness App",
    slug: "tovapulse-health-wellness-app",
    description:
      "Health and wellness app focused on pulse monitoring, sleep tracking, and AI integration for vitals insights and recovery guidance.",
    featured: true,
    technologies: ["Laravel", "MySQL", "Firebase", "OpenAI API", "Agora"],
    icon: "health",
    liveUrl: "https://tovapulse.com/",
    githubUrl: null,
    image: "/images/projects/tovapulse.png",
    imageKind: "screenshot",
    features: [
      "Health intelligence from consumer app through admin console",
      "Pulse overview with signal quality and wearable sync status",
      "AI insights and audit-stream positioning for operators",
    ],
  },
  {
    title: "Keystone FM - Facilities Management CRM",
    slug: "keystone-fm-facilities-management-crm",
    description:
      "Facilities management CRM for a UK cleaning company — public site plus super-admin tools for requests, clients, and operations.",
    featured: true,
    technologies: ["Angular", "Node.js", "Express.js", "MySQL"],
    icon: "facilities",
    liveUrl: "https://crm.keystonefm.co.uk/login",
    githubUrl: null,
    secondaryUrl: "https://www.keystonefm.co.uk/",
    secondaryLabel: "Public site",
    image: "/images/projects/keystone-fm.png",
    imageKind: "screenshot",
    features: [
      "ERP portal login for facilities management access",
      "Secure sign-in with remember-me and password recovery",
      "Public marketing site plus CRM operations tooling",
    ],
  },
  {
    title: "Nollywood Verified - Talent & Casting Platform",
    slug: "nollywood-verified-talent-network",
    description:
      "Talent and casting platform connecting verified cast, crew, and producers with identity checks and casting-call workflows.",
    featured: true,
    technologies: ["React.js", "Node.js", "MongoDB", "AWS SES"],
    icon: "casting",
    liveUrl: "https://nollywoodverified.com/",
    githubUrl: null,
    image: "/images/projects/nollywood-verified.png",
    imageKind: "screenshot",
    features: [
      "Cast / crew discovery with verified real-person profiles",
      "Join and login flows for talent and hiring teams",
      "Nigeria + diaspora positioning with casting workflows",
    ],
  },
  {
    title: "SwapCircle - Trading Platform Admin Portal",
    slug: "swapcircle-trading-platform-admin-portal",
    description:
      "Trading platform admin portal with activity dashboards and user management for monitoring day-to-day platform operations.",
    featured: true,
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
    icon: "trading",
    liveUrl: "https://swapcircle.trade/",
    githubUrl: null,
    secondaryUrl: "https://portal.swapcircle.trade/admin",
    secondaryLabel: "Admin portal",
    image: "/images/projects/swapcircle.png",
    imageKind: "screenshot",
    features: [
      "Community exchange platform for diaspora coverage and services",
      "Plan selection, sign-in, and onboarding CTAs on the public site",
      "Admin portal entry for day-to-day platform operations",
    ],
  },
  {
    title: "SOW Finance - Fintech Web Application",
    slug: "sow-finance-fintech-web-application",
    description:
      "Fintech web application for secure bank-account connections via Plaid, with polished front-end flows and backend API integration.",
    featured: true,
    technologies: ["React.js", "Node.js", "MySQL", "AWS"],
    icon: "finance",
    liveUrl: "https://www.sow.finance/",
    githubUrl: null,
    image: "/images/projects/sow-finance.png",
    imageKind: "screenshot",
    features: [
      "Creator workspace with balance, growth, and credit metrics",
      "Early payout CTA and earnings trend visualization",
      "Integrations positioning for TikTok, YouTube, Twitch, and more",
    ],
  },
  {
    title: "Shakti Travels & Tours - Booking Website",
    slug: "shakti-travels-tours-booking-platform",
    description:
      "Travel and tours booking website for a multi-vehicle fleet — service listings, tour packages, and customer enquiry handling.",
    featured: true,
    technologies: ["PHP", "Laravel", "MySQL", "jQuery"],
    icon: "travel",
    liveUrl: "https://shaktitravelsandtours.com/",
    githubUrl: null,
    image: "/images/projects/shakti-travels.png",
    imageKind: "screenshot",
    features: [
      "Premium car rentals, corporate travel, and pilgrimage tours",
      "Services, driver registration, and contact CTAs",
      "Pan-India coverage messaging with fleet-focused hero",
    ],
  },
  {
    title: "Turf Booking - Cricket & Football Slot Reservations",
    slug: "turf-booking-cricket-football-slot-reservations",
    description:
      "Turf booking app for cricket and football grounds with live slot availability and online payment for reservations.",
    featured: false,
    technologies: ["React.js", "Laravel", "MySQL", "Stripe"],
    icon: "sports",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Job Portal - HR & Candidate Management",
    slug: "job-portal-hr-candidate-management",
    description:
      "Job portal with an HR dashboard for openings and applicants, plus a candidate portal to apply and track application status.",
    featured: false,
    technologies: ["React.js", "Laravel", "MySQL"],
    icon: "jobs",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Excel Data Reader & Processing Tool",
    slug: "excel-data-reader-processing-tool",
    description:
      "Excel data reader and processing tool that validates large workbooks and imports clean, structured records into the app.",
    featured: false,
    technologies: ["Laravel", "PHP"],
    icon: "data",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Automation Scraper & Data Collection Tool",
    slug: "automation-scraper-data-collection-tool",
    description:
      "Automation scraper and data collection tool that schedules crawls, normalizes third-party data, and stores ready-to-use results.",
    featured: false,
    technologies: ["Laravel", "PHP"],
    icon: "automation",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Custom Cron, Queue & Signal-Aware Worker System",
    slug: "custom-cron-queue-signal-aware-worker-system",
    description:
      "Custom cron, queue, and signal-aware worker system for scheduled jobs with graceful shutdown on operating-system signals.",
    featured: false,
    technologies: ["Laravel", "WebSockets", "Redis"],
    icon: "scheduler",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "AI/LLM Integration Toolkit",
    slug: "ai-llm-integration-toolkit",
    description:
      "AI/LLM integration toolkit that plugs OpenAI and local Ollama models into app workflows with a reusable adapter layer.",
    featured: false,
    technologies: ["Laravel", "OpenAI API", "LLM Integration", "Ollama"],
    icon: "ai-toolkit",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "June Fast Firm",
    slug: "june-fast-firm",
    description:
      "Business platform for June Fast Firm covering core company workflows, records, and operations on a Laravel and MySQL stack.",
    featured: false,
    technologies: ["Laravel", "MySQL"],
    icon: "business",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "AkatiBird - Business Hub Platform",
    slug: "akatibird-business-hub-platform",
    description:
      "Business hub platform with multilingual e-commerce, meeting scheduling, and an author panel for managing site content.",
    featured: true,
    technologies: ["Next.js", "TypeScript", "Laravel", "MySQL"],
    icon: "business",
    liveUrl: "https://akatibird.com/en",
    githubUrl: null,
    secondaryUrl: "https://author.akatibird.com/",
    secondaryLabel: "Author panel",
    image: "/images/projects/akatibird.png",
    imageKind: "screenshot",
    gallery: [
      "/images/projects/akatibird.png",
      "/images/projects/akatibird-author.png",
    ],
    features: [
      "Multilingual reading hub with search and discover CTAs",
      "App Store / Google Play download entry points",
      "Author panel sign-in for content management",
    ],
  },
];
