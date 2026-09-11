export interface ExperienceEntry {
  roleTitle: string;
  companyName: string;
  employmentType: "full_time" | "apprentice" | "part_time" | "contract" | "freelance";
  employmentTypeLabel: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
}

export const experience: ExperienceEntry[] = [
  {
    roleTitle: "Senior Software Engineer",
    companyName: "Jamtech Technology Pvt. Ltd.",
    employmentType: "full_time",
    employmentTypeLabel: "Full-Time",
    startDate: "2022-06-01",
    endDate: null,
    isCurrent: true,
  },
  {
    roleTitle: "Apprentice",
    companyName: "Softpro India Computer Technologies",
    employmentType: "apprentice",
    employmentTypeLabel: "Apprentice",
    startDate: "2022-04-01",
    endDate: "2022-06-01",
    isCurrent: false,
  },
];
