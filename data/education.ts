export interface EducationEntry {
  degree: string;
  institution: string;
  location: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export const education: EducationEntry[] = [
  {
    degree: "Bachelor of Technology (B.Tech), Computer Science & Engineering",
    institution: "Dr. MC Saxena College of Engineering",
    location: "Lucknow, India",
    startDate: "2025-07-01",
    endDate: null,
    isCurrent: true,
  },
  {
    degree: "Diploma, Computer Science & Engineering",
    institution: "Government Polytechnic Mohammadi Kheri",
    location: "Lakhimpur, India",
    startDate: "2018-07-01",
    endDate: "2022-07-01",
    isCurrent: false,
  },
];
