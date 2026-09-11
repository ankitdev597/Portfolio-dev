export interface Project {
  title: string;
  slug: string;
  description: string;
  featured: boolean;
  technologies: string[];
  liveUrl: string | null;
  githubUrl: string | null;
}

export const projects: Project[] = [
  {
    title: "E-Commerce Checkout & Wallet Platform",
    slug: "e-commerce-checkout-wallet-platform",
    description:
      "A full-stack storefront with a custom checkout flow, card payment gateway integration, and an in-app digital wallet for balance-based payments.",
    featured: true,
    technologies: ["React.js", "Laravel", "MySQL", "Stripe", "PayPal", "CinetPay", "PawaPay"],
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
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "Keystone FM - Cleaning & Facilities Management Platform",
    slug: "keystone-fm-cleaning-facilities-management-platform",
    description:
      "A full booking-to-billing platform for Keystone FM, a UK facilities-management company serving offices, schools, and medical practices. Built the public marketing site plus a role-based ERP/CRM superadmin panel for managing staff, contracts, and service schedules.",
    featured: false,
    technologies: ["Laravel", "Spatie Laravel-Permission", "MySQL", "Agora", "Twilio"],
    liveUrl: "https://www.keystonefm.co.uk/",
    githubUrl: null,
  },
  {
    title: "Colossians Cleaning & Care Services Platform",
    slug: "colossians-cleaning-care-services-platform",
    description:
      "A customer-facing service portal and companion CRM built for Colossians, a UK cleaning and home-care provider - covering customer login/booking on one app and staff/operations management on a separate CRM, with a dedicated dev environment for safe iteration.",
    featured: false,
    technologies: ["Laravel", "MySQL", "Spatie Laravel-Permission"],
    liveUrl: "https://app.colossianscleaningservices.com/",
    githubUrl: null,
  },
  {
    title: "Nollywood Verified - Talent Network for Nigerian Film Industry",
    slug: "nollywood-verified-talent-network",
    description:
      "A verified professional network and hiring marketplace for the Nollywood film industry, connecting identity-verified cast, crew, and producers across Nigeria and the diaspora with role- and sub-role-based access for admins, content managers, and moderators.",
    featured: false,
    technologies: ["Laravel", "Spatie Laravel-Permission", "MySQL"],
    liveUrl: "https://nollywoodverified.com/",
    githubUrl: null,
  },
  {
    title: "SwapCircle - Peer-to-Peer Trading Platform",
    slug: "swapcircle-peer-to-peer-trading-platform",
    description:
      "A closed peer-to-peer order-book trading platform letting members trade directly with one another, with a dedicated admin portal for order-book oversight and member management.",
    featured: false,
    technologies: ["Laravel", "MySQL"],
    liveUrl: "https://portal.swapcircle.trade/admin",
    githubUrl: null,
  },
  {
    title: "Sentimenter.ai",
    slug: "sentimenter-ai",
    description:
      "An AI-powered product built on the OpenAI/LLM integration toolkit - full case-study detail to be added.",
    featured: false,
    technologies: ["Laravel", "OpenAI API", "LLM Integration"],
    liveUrl: "https://sentimenter.ai/",
    githubUrl: null,
  },
  {
    title: "Shakti Travels & Tours - Booking Platform",
    slug: "shakti-travels-tours-booking-platform",
    description:
      "A booking platform for Shakti Travels & Tours, a 100+ vehicle transportation company operating across India since 2010 - covering car rentals, corporate travel, pilgrimage tours, airport transfers, and wedding transport with GPS-enabled fleet tracking.",
    featured: false,
    technologies: ["Laravel", "MySQL"],
    liveUrl: "http://shaktitravelsandtours.com/",
    githubUrl: null,
  },
  {
    title: "TovaPulse - Health & Wellness App",
    slug: "tovapulse-health-wellness-app",
    description:
      "A healthcare app connecting patients with providers, with consultation scheduling, video calls, and real-time notifications.",
    featured: true,
    technologies: ["Laravel", "MySQL", "Firebase", "Agora"],
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "SOW Finance - Bank Account Connections",
    slug: "sow-finance-bank-account-connections",
    description:
      "A finance platform letting users securely create and manage bank account connections via a third-party financial data API (Plaid).",
    featured: false,
    technologies: ["Laravel", "MySQL", "Plaid"],
    liveUrl: "https://www.sow.finance/",
    githubUrl: null,
  },
  {
    title: "Turf Booking - Cricket & Football Slot Reservations",
    slug: "turf-booking-cricket-football-slot-reservations",
    description:
      "A turf/ground booking app for cricket and football, with real-time slot availability and online payment.",
    featured: false,
    technologies: ["React.js", "Laravel", "MySQL", "Stripe"],
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
    liveUrl: null,
    githubUrl: null,
  },
  {
    title: "AI/LLM Integration Toolkit",
    slug: "ai-llm-integration-toolkit",
    description:
      "A pluggable AI layer integrating OpenAI and locally-hosted Ollama models into application workflows.",
    featured: true,
    technologies: ["Laravel", "OpenAI API", "LLM Integration", "Ollama"],
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
    liveUrl: null,
    githubUrl: null,
  },
];
