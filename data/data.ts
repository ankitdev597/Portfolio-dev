/**
 * Single source of truth for portfolio content.
 * Do not invent skills, projects, metrics, or links beyond this file.
 */

export const siteConfig = {
  name: "Ankit Vishwakarma",
  title: "Full Stack Developer | Laravel | MERN Stack | DevOps | AI Integration",
  location: "Pratapgarh, Uttar Pradesh, India",
  email: "av841344@gmail.com",
  phone: "+91 8112656226",
  phoneHref: "tel:+918112656226",
  linkedin: "https://www.linkedin.com/in/ankit-vishwakarma-15b6b1233",
  github: "https://github.com/ankitdev597",
  resumePath: "/resume.pdf",
  profileImage: "/images/profile-photo.jpg",
  availability: "Immediate Joiner",
  yearsExperienceLabel: "4+ Years Experience",
  projectsCountLabel: "11 Projects",
  summary:
    "Senior Software Engineer with 4+ years of experience building and deploying production web applications and REST APIs with Laravel (PHP), React.js, Node.js, Express.js, MongoDB and MySQL. Integrates OpenAI and third-party LLM APIs, builds real-time WebSocket features, and deploys with Docker, CI/CD and AWS on Linux servers (Nginx/Apache). Delivered SaaS, CRM, fintech and AI hiring products for UK and international clients.",
  valueProposition:
    "I build and ship production web apps and APIs across Laravel, MERN, DevOps, and AI integration — end to end.",
} as const;

export const navLinks = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
] as const;

export const aboutHighlights = [
  {
    title: "Laravel / PHP",
    description: "Production backends, Blade UIs, REST APIs, auth, and RBAC on Laravel.",
  },
  {
    title: "MERN",
    description: "React.js, Node.js, Express.js, and MongoDB for full-stack product delivery.",
  },
  {
    title: "DevOps & Docker",
    description: "Docker locally, CI/CD, AWS, Nginx/Apache, SSL, and Linux server operations.",
  },
  {
    title: "AI / LLM Integration",
    description: "OpenAI and third-party LLMs, prompt workflows, and real-time WebSocket AI features.",
  },
] as const;

export const skillCategories = [
  {
    name: "Backend",
    skills: [
      "Laravel",
      "PHP",
      "Blade",
      "Node.js",
      "Express.js",
      "REST APIs",
      "WebSockets",
      "Authentication & RBAC",
      "MVC",
      "Third-Party & Meta API Integration",
      "Firebase",
    ],
  },
  {
    name: "Frontend",
    skills: [
      "React.js",
      "JavaScript (ES6+)",
      "Vue.js",
      "HTML5",
      "CSS3",
      "Bootstrap 5",
      "jQuery",
      "Responsive Design",
    ],
  },
  {
    name: "Databases",
    skills: ["MySQL", "MongoDB", "Oracle Database", "Database Design", "Data Migration"],
  },
  {
    name: "DevOps & Deployment",
    skills: [
      "Docker (local development and deployment)",
      "CI/CD",
      "AWS (EC2, SES, SNS)",
      "Linux Server Administration",
      "Nginx",
      "Apache",
      "SSL",
      "SSH",
      "Bash",
    ],
  },
  {
    name: "AI Integration",
    skills: [
      "OpenAI API",
      "LLM Integration",
      "Prompt Engineering",
      "AI-Assisted Development (Cursor, Claude)",
    ],
  },
  {
    name: "Development Tools",
    skills: [
      "Git",
      "GitHub",
      "Postman",
      "Code Review",
      "Agile Collaboration",
      "Technical Mentoring",
    ],
  },
] as const;

export type ExperienceItem = {
  role: string;
  company: string;
  location: string;
  start: string;
  end: string;
  bullets: string[];
};

export const experience: ExperienceItem[] = [
  {
    role: "Senior Software Engineer",
    company: "Jamtech Technology Pvt. Ltd",
    location: "Lucknow, India",
    start: "06/2022",
    end: "Present",
    bullets: [
      "Lead projects and develop hands-on, from requirements, architecture and REST API design to deployment and production support on MERN and Laravel/PHP stacks.",
      "Integrate OpenAI and third-party LLM APIs, including real-time WebSocket chat and automated response generation.",
      "Led the backend redesign of an HR Copilot SaaS product and built three products for an AI hiring and job application platform.",
      "Architect backend systems (APIs, schemas, authentication, business logic) for multiple client mobile and web apps from wireframes.",
      "Run applications locally with Docker, deploy on AWS, build CI/CD and release automation with SSH and Bash, configure Nginx/Apache and SSL.",
      "Planned and executed an application migration with API integration; integrated and tested social media APIs; handled Meta app review and access-token requirements.",
      "Lead code reviews, mentor junior developers, resolve complex defects, and deliver on schedule across concurrent client projects.",
    ],
  },
  {
    role: "Apprentice",
    company: "Softpro India Computer Technologies (P) Ltd.",
    location: "Lucknow, India",
    start: "04/2022",
    end: "06/2022",
    bullets: [
      "Full-stack web development apprenticeship covering HTML, CSS, JavaScript, and Oracle Database.",
    ],
  },
];

export type ProjectFilter = "All" | "Laravel/PHP" | "MERN" | "AI";

export type Project = {
  id: string;
  name: string;
  description: string;
  role: string;
  tech: string[];
  tags: Array<"Laravel" | "MERN" | "AI">;
  featured?: boolean;
  links?: { label: string; url: string }[];
};

export const projects: Project[] = [
  {
    id: "sentimenter-ai",
    name: "Sentimenter AI",
    description:
      "AI hiring sentiment platform using OpenAI LLMs to evaluate interview responses in real time via WebSocket chat.",
    role: "Project Leader & Developer",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB", "OpenAI API", "WebSockets"],
    tags: ["MERN", "AI"],
    featured: true,
    links: [{ label: "Live", url: "https://sentimenter.ai" }],
  },
  {
    id: "colossians",
    name: "Colossians Cleaning & Care Services Portal & CRM",
    description:
      "UK client/staff portal and CRM for bookings, scheduling, and staff management.",
    role: "Project Leader & Developer",
    tech: ["React.js", "Node.js", "Laravel", "MySQL"],
    tags: ["Laravel"],
    featured: true,
    links: [
      { label: "Live", url: "https://app.colossianscleaningservices.com" },
      { label: "CRM", url: "https://crm.colossianscareservices.co.uk" },
    ],
  },
  {
    id: "hr-copilot",
    name: "HR Copilot SaaS & AI Hiring Platform",
    description:
      "Rebuilt the complete backend and developed three products for an AI hiring and job application platform.",
    role: "Project Leader & Developer",
    tech: ["Node.js", "Laravel", "REST APIs"],
    tags: ["Laravel", "AI"],
    featured: true,
  },
  {
    id: "mobile-backends",
    name: "Mobile App Backends",
    description:
      "Backend APIs, schemas, and authentication from wireframes for LetsPlaylist, Tattoo Studio Booking, and Networking & Community apps.",
    role: "Project Leader & Developer",
    tech: ["Node.js", "Laravel", "REST APIs"],
    tags: ["Laravel"],
  },
  {
    id: "keystone-fm",
    name: "Keystone FM CRM",
    description: "UK public website and super-admin CRM dashboard for facilities management.",
    role: "Project Leader & Developer",
    tech: ["Laravel"],
    tags: ["Laravel"],
    links: [{ label: "Live", url: "https://crm.keystonefm.co.uk" }],
  },
  {
    id: "shakti-travels",
    name: "Shakti Travels & Tours",
    description: "Travel booking website for tours and customer enquiries.",
    role: "Project Leader & Developer",
    tech: ["PHP", "Laravel", "MySQL", "jQuery"],
    tags: ["Laravel"],
    links: [{ label: "Live", url: "https://shaktitravelsandtours.com" }],
  },
  {
    id: "turfbook",
    name: "TurfBook",
    description: "Delivered assigned development tasks on a turf booking product.",
    role: "Developer",
    tech: ["Laravel", "Blade"],
    tags: ["Laravel"],
  },
  {
    id: "adtrova",
    name: "Adtrova",
    description: "Meta app review and access-token integration.",
    role: "Developer",
    tech: ["Laravel", "Meta API"],
    tags: ["Laravel"],
  },
  {
    id: "nollywood-verified",
    name: "Nollywood Verified",
    description:
      "Verified-profile casting and hiring platform for cast, crew, and producers.",
    role: "Project Leader & Developer",
    tech: ["React.js", "Node.js", "MongoDB", "AWS SES"],
    tags: ["MERN"],
  },
  {
    id: "swapcircle",
    name: "SwapCircle Admin Portal",
    description: "Admin dashboards for platform activity and users.",
    role: "Project Leader & Developer",
    tech: ["React.js", "Node.js", "Express.js", "MongoDB"],
    tags: ["MERN"],
    links: [{ label: "Live", url: "https://portal.swapcircle.trade/admin" }],
  },
  {
    id: "sow-finance",
    name: "SOW Finance",
    description:
      "Front-end interfaces, backend API integrations, and tested social media API functionality.",
    role: "Developer",
    tech: ["React.js", "Node.js", "MySQL", "AWS"],
    tags: ["MERN"],
    links: [{ label: "Live", url: "https://sow.finance" }],
  },
];

/** Optional personal projects — fill in later. */
export const personalProjects: Project[] = [];

export const education = [
  {
    degree: "B.Tech, Computer Science & Engineering",
    school: "Dr. MC Saxena College of Engineering",
    location: "Lucknow, India",
    start: "07/2025",
    end: "Present",
  },
  {
    degree: "Diploma, Computer Science & Engineering",
    school: "Government Polytechnic Mohammadi Kheri",
    location: "Lakhimpur, India",
    start: "07/2018",
    end: "07/2022",
  },
] as const;

export const certifications = [
  "Scout Member Grade A+ (Certificate of Completion)",
  "Summer Training Certificate (Good Performance)",
] as const;

export const seo = {
  siteTitle: "Ankit Vishwakarma | Full Stack Developer",
  title: "Ankit Vishwakarma | Full Stack Developer — Laravel, MERN, DevOps, AI",
  description:
    "Full Stack Developer with 4+ years building Laravel, MERN, DevOps, and AI-integrated production apps. Immediate joiner based in Pratapgarh, Uttar Pradesh, India.",
  keywords: [
    "Ankit Vishwakarma",
    "Full Stack Developer",
    "Laravel",
    "MERN",
    "DevOps",
    "AI Integration",
    "React.js",
    "Node.js",
    "PHP",
  ],
} as const;
