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
    description: "End-to-end web application development from database to UI.",
    icon: "fullstack",
    visual: "fullstack",
  },
  {
    title: "Database Design & Architecture",
    description:
      "Relational and document schema design, indexing, and query optimization - modeling data so it stays fast and consistent as the product grows.",
    icon: "database",
    visual: "database",
    techBadges: ["MongoDB", "MySQL", "PostgreSQL"],
  },
  {
    title: "Workflow & Process Automation",
    description:
      "Automating repetitive engineering and business workflows - background jobs, notifications, and third-party integrations - so teams ship with fewer manual steps.",
    icon: "automation",
    visual: "automation",
    techBadges: ["Queues", "Webhooks", "Scheduled Jobs"],
  },
  {
    title: "Laravel Development",
    description: "Robust, scalable backends built on Laravel and PHP.",
    icon: "laravel",
    visual: "laravel",
  },
  {
    title: "React Development",
    description: "Modern, interactive frontends built with React and TypeScript.",
    icon: "react",
    visual: "react",
  },
  {
    title: "MERN Development",
    description: "Full JavaScript-stack applications with MongoDB, Express, React, and Node.js.",
    icon: "mern",
    visual: "mern",
  },
  {
    title: "AI / LLM Integration",
    description: "Integrating OpenAI and other LLMs into production applications.",
    icon: "ai",
    visual: "ai",
  },
  {
    title: "API Development",
    description: "RESTful API architecture and integration.",
    icon: "api",
    visual: "api",
  },
  {
    title: "AWS Deployment",
    description: "Cloud infrastructure and deployment on AWS (EC2, SES, SNS).",
    icon: "aws",
    visual: "aws",
  },
  {
    title: "CI/CD",
    description: "Automated build, test, and deployment pipelines.",
    icon: "cicd",
    visual: "cicd",
  },
  {
    title: "Server Configuration",
    description: "Linux server administration, Nginx/Apache, and SSL setup.",
    icon: "server",
    visual: "server",
  },
  {
    title: "Real-Time WebSocket Applications",
    description: "Real-time features powered by WebSockets and Laravel Reverb.",
    icon: "realtime",
    visual: "realtime",
  },
];
