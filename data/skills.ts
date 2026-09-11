export interface SkillCategory {
  name: string;
  icon: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    name: "Frontend",
    icon: "🧩",
    skills: [
      "React.js",
      "Angular",
      "Vue.js",
      "JavaScript",
      "TypeScript",
      "Tailwind CSS",
      "Inertia.js",
    ],
  },
  {
    name: "Backend",
    icon: "🧩",
    skills: [
      "Laravel",
      "PHP",
      "Node.js",
      "Express.js",
      "WebSockets",
      "Redis",
      "Laravel Reverb",
    ],
  },
  {
    name: "Database",
    icon: "🧩",
    skills: ["MySQL", "MongoDB", "Oracle"],
  },
  {
    name: "Cloud & DevOps",
    icon: "🧩",
    skills: ["AWS", "EC2", "SES", "SNS", "CI/CD", "Linux", "Nginx", "Apache", "SSL"],
  },
  {
    name: "AI & LLM",
    icon: "🧩",
    skills: ["OpenAI API", "LLM Integration"],
  },
  {
    name: "3D & Animation",
    icon: "🧩",
    skills: ["Three.js", "React Three Fiber", "GSAP", "Motion", "Lenis"],
  },
  {
    name: "Tools",
    icon: "🧩",
    skills: ["Git", "GitHub", "Postman"],
  },
];
