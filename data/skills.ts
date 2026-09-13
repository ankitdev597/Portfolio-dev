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
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Languages",
    icon: "code",
    skills: ["JavaScript (ES6+)", "TypeScript", "PHP", "SQL", "HTML5", "CSS3", "Bash"],
  },
  {
    name: "Frontend",
    icon: "frontend",
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
    skills: ["Node.js", "Express.js", "Laravel", "RESTful API Design", "WebSockets", "Laravel Reverb"],
  },
  {
    name: "Databases",
    icon: "database",
    skills: ["MySQL", "MongoDB", "Oracle Database", "Redis"],
  },
  {
    name: "Cloud & DevOps",
    icon: "cloud",
    skills: [
      "AWS (EC2, SES, SNS)",
      "CI/CD Pipelines",
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
    skills: [
      "OpenAI API",
      "Third-Party LLM Integration",
      "Prompt Engineering",
      "Cursor",
      "Claude AI",
    ],
  },
  {
    name: "Creative Engineering",
    icon: "creative",
    skills: ["Three.js", "React Three Fiber", "GSAP", "Motion", "Lenis"],
  },
  {
    name: "Tools & Practices",
    icon: "tools",
    skills: ["Git/GitHub", "Postman", "Code Review", "Agile Collaboration", "Mentoring"],
  },
];
