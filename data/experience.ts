export interface ExperienceEntry {
  roleTitle: string;
  companyName: string;
  location: string;
  employmentType: "full_time" | "apprentice" | "part_time" | "contract" | "freelance";
  employmentTypeLabel: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  bullets: string[];
}

export const experience: ExperienceEntry[] = [
  {
    roleTitle: "Senior Software Engineer",
    companyName: "Jamtech Technology Pvt. Ltd.",
    location: "Lucknow, India",
    employmentType: "full_time",
    employmentTypeLabel: "Full-Time",
    startDate: "2022-06-01",
    endDate: null,
    isCurrent: true,
    bullets: [
      "Build and ship full-stack applications across the MERN and MEAN stacks plus Laravel/PHP, delivering scalable features on AWS (EC2, SES, SNS).",
      "Integrate OpenAI and third-party LLM APIs into product features, including real-time AI chat over WebSockets.",
      "Use AI-assisted tools such as Cursor and Claude AI to accelerate coding, debugging, and code review.",
      "Design, build, and automate CI/CD deployment pipelines using SSH and Bash scripting for Linux server provisioning and release automation.",
      "Configure and maintain Nginx/Apache servers and SSL certificates for secure, high-availability production environments.",
      "Lead code reviews to keep the team aligned on architecture and engineering best practices, and mentor junior developers on coding and testing workflows.",
      "Partner directly with cross-functional teams and clients to scope requirements and hit delivery deadlines.",
    ],
  },
  {
    roleTitle: "Apprentice",
    companyName: "Softpro India Computer Technologies (P) Ltd.",
    location: "Lucknow, India",
    employmentType: "apprentice",
    employmentTypeLabel: "Apprentice",
    startDate: "2022-04-01",
    endDate: "2022-06-01",
    isCurrent: false,
    bullets: [
      "Completed an intensive full-stack web development apprenticeship covering HTML, CSS, JavaScript, and Oracle Database fundamentals.",
      "Assisted senior development teams building backend components in Java and Python.",
      "Took part in summer training initiatives and corporate workshops, strengthening technical troubleshooting and communication skills.",
    ],
  },
];
