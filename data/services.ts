export type ServiceIconKey =
  | "fullstack"
  | "laravel"
  | "react"
  | "mern"
  | "ai"
  | "api"
  | "aws"
  | "cicd"
  | "server"
  | "realtime"
  | "database"
  | "automation";

/**
 * Visual key for each service card.
 * Mapped 1:1 in `components/service-visuals`. Database also mounts lazy WebGL.
 */
export type ServiceVisual = ServiceIconKey;

export interface Service {
  title: string;
  description: string;
  icon: ServiceIconKey;
  /** Required — every card has a matching visual. */
  visual: ServiceVisual;
  /** Short technology/technique chips shown under the description. */
  techBadges?: string[];
}

export const services: Service[] = [
  {
    title: "Full Stack Development",
    description:
      "End-to-end product delivery — schema, APIs, and polished UI — shipped as one coherent system your team can own.",
    icon: "fullstack",
    visual: "fullstack",
    techBadges: ["React", "Node.js", "Laravel"],
  },
  {
    title: "Database Design & Architecture",
    description:
      "Relational and document schema design, indexing, and query optimization — modeling data so it stays fast and consistent as the product grows.",
    icon: "database",
    visual: "database",
    techBadges: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    title: "Workflow & Process Automation",
    description:
      "Automating repetitive engineering and business workflows — background jobs, notifications, and third-party integrations — so teams ship with fewer manual steps.",
    icon: "automation",
    visual: "automation",
    techBadges: ["Queues", "Webhooks", "Scheduled Jobs"],
  },
  {
    title: "Laravel Development",
    description:
      "Robust PHP backends on Laravel — auth, RBAC, queues, and maintainable domain logic built for production scale.",
    icon: "laravel",
    visual: "laravel",
    techBadges: ["Laravel", "PHP", "MySQL"],
  },
  {
    title: "React Development",
    description:
      "Modern, accessible frontends with React and TypeScript — component systems that feel fast and stay easy to evolve.",
    icon: "react",
    visual: "react",
    techBadges: ["React", "TypeScript", "Next.js"],
  },
  {
    title: "MERN Development",
    description:
      "Full JavaScript-stack applications with MongoDB, Express, React, and Node.js — one language, clear ownership across the stack.",
    icon: "mern",
    visual: "mern",
    techBadges: ["MongoDB", "Express", "React", "Node.js"],
  },
  {
    title: "AI / LLM Integration",
    description:
      "OpenAI and third-party LLMs wired into real product flows — chat, analysis, and assistants that ship beyond demos.",
    icon: "ai",
    visual: "ai",
    techBadges: ["OpenAI", "WebSockets", "APIs"],
  },
  {
    title: "API Development",
    description:
      "Clean REST architecture, auth, and integrations — contracts your frontend and partners can trust.",
    icon: "api",
    visual: "api",
    techBadges: ["REST", "JWT", "Webhooks"],
  },
  {
    title: "AWS Deployment",
    description:
      "Cloud infrastructure and release paths on AWS — EC2 compute with SES and SNS for transactional messaging.",
    icon: "aws",
    visual: "aws",
    techBadges: ["AWS", "EC2", "SES"],
  },
  {
    title: "CI/CD",
    description:
      "Automated build, test, and deploy pipelines so every merge can reach production with confidence.",
    icon: "cicd",
    visual: "cicd",
    techBadges: ["GitHub Actions", "Docker", "Pipelines"],
  },
  {
    title: "Server Configuration",
    description:
      "Linux administration with Nginx/Apache, SSL, and hardening — servers that stay secure and predictable.",
    icon: "server",
    visual: "server",
    techBadges: ["Linux", "Nginx", "SSL"],
  },
  {
    title: "Real-Time WebSocket Applications",
    description:
      "Live features powered by WebSockets and Laravel Reverb — presence, chat, and instant updates that feel native.",
    icon: "realtime",
    visual: "realtime",
    techBadges: ["WebSockets", "Reverb", "Laravel"],
  },
];
