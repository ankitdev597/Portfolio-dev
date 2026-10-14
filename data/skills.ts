export type SkillIconKey =
  | "code"
  | "frontend"
  | "backend"
  | "database"
  | "cloud"
  | "ai"
  | "creative"
  | "tools";

export interface SkillCategory {
  name: string;
  icon: SkillIconKey;
  /** One-line focus — fills card space alongside chips */
  summary: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    icon: "code",
    summary: "Core languages I write production features and scripts in every week.",
    skills: ["JavaScript (ES6+)", "TypeScript", "PHP", "SQL", "HTML5", "CSS3", "Bash"],
  },
  {
    name: "Frontend",
    icon: "frontend",
    summary: "UI systems across React, Angular, and Vue — fast, accessible, and shippable.",
    skills: [
      "React.js",
      "Angular",
      "Vue.js",
      "Next.js",
      "Inertia.js",
      "Tailwind CSS",
      "Bootstrap 5",
      "jQuery",
      "Alpine.js",
    ],
  },
  {
    name: "Backend",
    icon: "backend",
    summary: "APIs, auth, queues, and real-time channels built for production load.",
    skills: [
      "Node.js",
      "Express.js",
      "Laravel",
      "RESTful API Design",
      "WebSockets",
      "Laravel Reverb",
      "JWT Auth",
      "Queue Workers",
    ],
  },
  {
    name: "Databases",
    icon: "database",
    summary: "Schema design, indexing, and caching so data stays fast as products grow.",
    skills: [
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      "Oracle Database",
      "Redis",
      "Query Optimization",
      "Schema Design",
      "Indexing",
    ],
  },
  {
    name: "Cloud & DevOps",
    icon: "cloud",
    summary: "Deploy, observe, and harden apps on AWS and Linux with clean CI/CD.",
    skills: [
      "AWS (EC2, SES, SNS)",
      "CI/CD Pipelines",
      "Docker",
      "Linux Server Administration",
      "SSH",
      "Bash Scripting",
      "Nginx",
      "Apache",
      "SSL Configuration",
    ],
  },
  {
    name: "AI & LLM Integration",
    icon: "ai",
    summary: "OpenAI and LLM features wired into real product flows — not demos only.",
    skills: [
      "OpenAI API",
      "Third-Party LLM Integration",
      "AI Tools",
      "Prompt Engineering",
      "Cursor",
      "Claude AI",
      "ChatGPT",
      "Streaming Responses",
    ],
  },
  {
    name: "Creative Engineering",
    icon: "creative",
    summary: "Motion and 3D that add presence — GSAP, R3F, and smooth scroll systems.",
    skills: [
      "Three.js",
      "React Three Fiber",
      "GSAP",
      "ScrollTrigger",
      "Motion",
      "Lenis",
      "WebGL",
      "Canvas API",
    ],
  },
  {
    name: "Tools & Practices",
    icon: "tools",
    summary: "How the work stays reviewable, collaborative, and ready for the next engineer.",
    skills: [
      "Git/GitHub",
      "Postman",
      "Docker",
      "VS Code",
      "Code Review",
      "Agile Collaboration",
      "Mentoring",
      "Documentation",
    ],
  },
];

