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
  | "realtime";

export interface Service {
  title: string;
  description: string;
  icon: ServiceIconKey;
}

export const services: Service[] = [
  {
    title: "Full Stack Development",
    description: "End-to-end web application development from database to UI.",
    icon: "fullstack",
  },
  {
    title: "Laravel Development",
    description: "Robust, scalable backends built on Laravel and PHP.",
    icon: "laravel",
  },
  {
    title: "React Development",
    description: "Modern, interactive frontends built with React and TypeScript.",
    icon: "react",
  },
  {
    title: "MERN Development",
    description: "Full JavaScript-stack applications with MongoDB, Express, React, and Node.js.",
    icon: "mern",
  },
  {
    title: "AI / LLM Integration",
    description: "Integrating OpenAI and other LLMs into production applications.",
    icon: "ai",
  },
  {
    title: "API Development",
    description: "RESTful API architecture and integration.",
    icon: "api",
  },
  {
    title: "AWS Deployment",
    description: "Cloud infrastructure and deployment on AWS (EC2, SES, SNS).",
    icon: "aws",
  },
  {
    title: "CI/CD",
    description: "Automated build, test, and deployment pipelines.",
    icon: "cicd",
  },
  {
    title: "Server Configuration",
    description: "Linux server administration, Nginx/Apache, and SSL setup.",
    icon: "server",
  },
  {
    title: "Real-Time WebSocket Applications",
    description: "Real-time features powered by WebSockets and Laravel Reverb.",
    icon: "realtime",
  },
];
