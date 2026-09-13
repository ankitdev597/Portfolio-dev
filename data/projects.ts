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

export const projects: Project[] = [
  {
    title: "E-Commerce Checkout & Wallet Platform",
    slug: "e-commerce-checkout-wallet-platform",
    description:
      "A full-stack storefront with a custom checkout flow, card payment gateway integration, and an in-app digital wallet for balance-based payments.",
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
      "A full service-business CRM panel with live video calls, audio calls, SMS, and real-time chat built into one dashboard.",
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
      "An AI-driven hiring platform that evaluates candidate responses and interview conversations in real time using an LLM. Built a live WebSocket chat interface for low-latency candidate-AI conversation, integrated OpenAI for natural-language understanding, sentiment scoring, and automated responses, and designed the backend to handle concurrent chat sessions reliably under load.",
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
      "A healthcare app connecting patients with providers, with consultation scheduling, video calls, and real-time notifications.",
    featured: true,
    technologies: ["Laravel", "MySQL", "Firebase", "Agora"],
    icon: "health",
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Keystone FM - Facilities Management CRM",
    slug: "keystone-fm-facilities-management-crm",
    description:
      "Built the public-facing site and a super-admin CRM dashboard for a UK commercial cleaning and facilities management company, with admin features for managing service requests, client accounts, and operational reporting.",
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
      "Developed a full-stack client and staff login portal for managing cleaning-service bookings and accounts, plus a separate CRM (with its own dev/staging environment) for care-services scheduling, client records, and staff management - with authentication and role-based access across both apps.",
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
      "A platform connecting verified cast, crew, and producers across Nigeria and the diaspora for casting and hiring - verified-profile workflows tie real identities to accounts, alongside hiring and casting-call features.",
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
      "Developed the admin portal for a trading platform, including dashboards for monitoring platform activity and managing users.",
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
      "A fintech web application enabling users to securely create and manage bank account connections via a third-party financial data API (Plaid) - built the front-end interfaces and backend API integrations.",
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
      "Built a travel and tours booking website for Shakti Travels & Tours, a 100+ vehicle transportation company operating across India, covering service listings, tour packages, and customer inquiry handling.",
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
      "A turf/ground booking app for cricket and football, with real-time slot availability and online payment.",
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
      "A job-portal platform pairing an HR-facing dashboard for managing openings and applicants with a candidate-facing portal for applying and tracking status.",
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
      "A utility that reads, validates, and imports large Excel workbooks into structured application data.",
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
      "A scheduled scraping/automation tool that collects and normalizes data from third-party sites on a recurring basis.",
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
      "A backend scheduling system for custom cron jobs and queue workers with graceful shutdown on OS signals.",
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
      "A pluggable AI layer integrating OpenAI and locally-hosted Ollama models into application workflows.",
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
      "A business platform built for June Fast Firm - full case-study detail to be added.",
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
      "A multilingual business hub platform combining an e-commerce storefront with meeting/appointment scheduling, backed by a companion author panel for managing site content.",
    featured: false,
    technologies: ["Next.js", "TypeScript", "Laravel", "MySQL"],
    icon: "business",
    liveUrl: "https://akatibird.com/en",
    githubUrl: null,
    secondaryUrl: "https://author.akatibird.com/",
    secondaryLabel: "Author panel",
  },
];
