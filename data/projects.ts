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
}

/**
 * Descriptions are kept to a similar length (~2 short sentences) so project
 * cards read evenly in the grid and stay aligned with each project name.
 */
export const projects: Project[] = [
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
  },
  {
    title: "TovaPulse - Health & Wellness App",
    slug: "tovapulse-health-wellness-app",
    description:
      "Health and wellness app focused on pulse monitoring, sleep tracking, and AI integration for vitals insights and recovery guidance.",
    featured: true,
    technologies: ["Laravel", "MySQL", "Firebase", "OpenAI API", "Agora"],
    icon: "health",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Keystone FM - Facilities Management CRM",
    slug: "keystone-fm-facilities-management-crm",
    description:
      "Facilities management CRM for a UK cleaning company — public site plus super-admin tools for requests, clients, and operations.",
    featured: false,
    technologies: ["Angular", "Node.js", "Express.js", "MySQL"],
    icon: "facilities",
    liveUrl: "https://www.keystonefm.co.uk/",
    githubUrl: null,
  },
  {
    title: "Colossians Cleaning & Care Services - Client Portal & CRM",
    slug: "colossians-cleaning-care-services-platform",
    description:
      "Cleaning and care services portal with client/staff login, booking flows, and a separate CRM for scheduling and role-based access.",
    featured: false,
    technologies: ["React.js", "Node.js", "Laravel", "MySQL"],
    icon: "care",
    liveUrl: "https://app.colossianscleaningservices.com/",
    githubUrl: null,
  },
  {
    title: "Nollywood Verified - Talent & Casting Platform",
    slug: "nollywood-verified-talent-network",
    description:
      "Talent and casting platform connecting verified cast, crew, and producers with identity checks and casting-call workflows.",
    featured: false,
    technologies: ["React.js", "Node.js", "MongoDB", "AWS SES"],
    icon: "casting",
    liveUrl: "https://nollywoodverified.com/",
    githubUrl: null,
  },
  {
    title: "SwapCircle - Trading Platform Admin Portal",
    slug: "swapcircle-trading-platform-admin-portal",
    description:
      "Trading platform admin portal with activity dashboards and user management for monitoring day-to-day platform operations.",
    featured: false,
    technologies: ["React.js", "Node.js", "Express.js", "MongoDB"],
    icon: "trading",
    liveUrl: "https://portal.swapcircle.trade/admin",
    githubUrl: null,
  },
  {
    title: "SOW Finance - Fintech Web Application",
    slug: "sow-finance-fintech-web-application",
    description:
      "Fintech web application for secure bank-account connections via Plaid, with polished front-end flows and backend API integration.",
    featured: false,
    technologies: ["React.js", "Node.js", "MySQL", "AWS"],
    icon: "finance",
    liveUrl: "https://www.sow.finance/",
    githubUrl: null,
  },
  {
    title: "Shakti Travels & Tours - Booking Website",
    slug: "shakti-travels-tours-booking-platform",
    description:
      "Travel and tours booking website for a multi-vehicle fleet — service listings, tour packages, and customer enquiry handling.",
    featured: false,
    technologies: ["PHP", "Laravel", "MySQL", "jQuery"],
    icon: "travel",
    liveUrl: "http://shaktitravelsandtours.com/",
    githubUrl: null,
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
    featured: false,
    technologies: ["Next.js", "TypeScript", "Laravel", "MySQL"],
    icon: "business",
    liveUrl: "https://akatibird.com/en",
    githubUrl: null,
    secondaryUrl: "https://author.akatibird.com/",
    secondaryLabel: "Author panel",
  },
];
