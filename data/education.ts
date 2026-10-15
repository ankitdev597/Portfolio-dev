export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
  /** Official institution website */
  url: string;
  logo: string;
}

export const education: EducationEntry[] = [
  {
    degree: "Bachelor of Technology (B.Tech), Computer Science & Engineering",
    institution: "Dr. MC Saxena College of Engineering",
    location: "Lucknow, India",
    startDate: "2025-07-01",
    endDate: null,
    isCurrent: true,
    url: "https://www.mcsgoc.com/",
    logo: "/images/orgs/mcsgoc-logo.png",
  },
  {
    degree: "Diploma, Computer Science & Engineering",
    institution: "Government Polytechnic Mohammadi Kheri",
    location: "Lakhimpur, India",
    startDate: "2018-07-01",
    endDate: "2022-07-01",
    isCurrent: false,
    url: "https://gpmkheri.in/",
    logo: "/images/orgs/gpmkheri-logo.png",
  },
];
