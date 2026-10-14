import type { SimpleIcon } from "simple-icons";
import {
  siJavascript,
  siTypescript,
  siPhp,
  siMysql,
  siHtml5,
  siCss,
  siGnubash,
  siReact,
  siAngular,
  siVuedotjs,
  siNextdotjs,
  siInertia,
  siTailwindcss,
  siBootstrap,
  siJquery,
  siAlpinedotjs,
  siNodedotjs,
  siExpress,
  siLaravel,
  siMongodb,
  siRedis,
  siLinux,
  siNginx,
  siApache,
  siClaude,
  siThreedotjs,
  siGreensock,
  siGit,
  siGithub,
  siPostman,
  siFirebase,
  siPostgresql,
  siDocker,
  siFramer,
} from "simple-icons";
import extras from "@/lib/brand-extras.json";

export type BrandMark = Pick<SimpleIcon, "title" | "hex" | "path">;

function fromExtra(key: keyof typeof extras, hex: string): BrandMark {
  return {
    title: extras[key].title,
    path: extras[key].path,
    hex,
  };
}

/** Marks removed from current Simple Icons releases (trademark policy). */
const EXTRA = {
  aws: fromExtra("amazonaws.svg", "FF9900"),
  openai: fromExtra("openai.svg", "412991"),
  oracle: fromExtra("oracle.svg", "F80000"),
} as const;

/**
 * Display-name → official brand mark. Names match portfolio data strings.
 */
export const BRAND_BY_LABEL: Record<string, BrandMark> = {
  "JavaScript (ES6+)": siJavascript,
  JavaScript: siJavascript,
  TypeScript: siTypescript,
  PHP: siPhp,
  SQL: siMysql,
  HTML5: siHtml5,
  CSS3: siCss,
  Bash: siGnubash,
  "React.js": siReact,
  React: siReact,
  Angular: siAngular,
  "Vue.js": siVuedotjs,
  "Next.js": siNextdotjs,
  "Inertia.js": siInertia,
  "Tailwind CSS": siTailwindcss,
  "Bootstrap 5": siBootstrap,
  Bootstrap: siBootstrap,
  jQuery: siJquery,
  "Alpine.js": siAlpinedotjs,
  "Node.js": siNodedotjs,
  "Express.js": siExpress,
  Express: siExpress,
  Laravel: siLaravel,
  MySQL: siMysql,
  MongoDB: siMongodb,
  "Oracle Database": EXTRA.oracle,
  Oracle: EXTRA.oracle,
  Redis: siRedis,
  "AWS (EC2, SES, SNS)": EXTRA.aws,
  "AWS SES": EXTRA.aws,
  "AWS EC2": EXTRA.aws,
  SES: EXTRA.aws,
  SNS: EXTRA.aws,
  AWS: EXTRA.aws,
  "Linux Server Administration": siLinux,
  Linux: siLinux,
  Nginx: siNginx,
  Apache: siApache,
  "Bash Scripting": siGnubash,
  "OpenAI API": EXTRA.openai,
  OpenAI: EXTRA.openai,
  ChatGPT: EXTRA.openai,
  "AI Tools": EXTRA.openai,
  "Prompt Engineering": EXTRA.openai,
  "Claude AI": siClaude,
  Claude: siClaude,
  "Three.js": siThreedotjs,
  GSAP: siGreensock,
  Motion: siFramer,
  "Git/GitHub": siGithub,
  Git: siGit,
  GitHub: siGithub,
  Postman: siPostman,
  Firebase: siFirebase,
  PostgreSQL: siPostgresql,
  Docker: siDocker,
  "React Three Fiber": siReact,
};

/** Primary brand mark for service cards keyed by ServiceIconKey. */
export const SERVICE_BRANDS: Record<string, BrandMark> = {
  laravel: siLaravel,
  react: siReact,
  aws: EXTRA.aws,
  database: siMongodb,
  mern: siNodedotjs,
  ai: EXTRA.openai,
};

export function resolveBrand(label: string): BrandMark | null {
  return BRAND_BY_LABEL[label] ?? null;
}

/** Near-black brand hexes become light so marks stay visible on graphite UI. */
export function brandFill(hex: string): string {
  const h = hex.replace("#", "").toLowerCase();
  if (h === "000" || h === "000000" || h === "181717" || h === "121212") {
    return "#F1F5F9";
  }
  return `#${hex}`;
}
