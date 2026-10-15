/**
 * Summer / industrial training — only programs the portfolio owner completed.
 */
export interface TrainingEntry {
  title: string;
  organization: string;
  location: string;
  focus: string;
  summary: string;
  url: string;
  logo: string;
  image: string;
  imageAlt: string;
  highlights: string[];
  tags: string[];
}

export const trainingIntro =
  "Hands-on summer training that sharpened backend fundamentals — with real projects, not slide decks only.";

export const training: TrainingEntry[] = [
  {
    title: "Summer Training — Python with Django",
    organization: "Techpile Technology",
    location: "Lucknow, India",
    focus: "Python · Django",
    summary:
      "Intensive summer training on Python and Django — building backend foundations, web frameworks, and practical project work under industry mentors at Techpile.",
    url: "https://www.techpile.in/",
    logo: "/images/orgs/techpile-logo.png",
    image: "/images/orgs/techpile.png",
    imageAlt: "Techpile Technology website — summer training in Lucknow",
    highlights: [
      "Python and Django backend development with live project practice",
      "Web framework workflows — models, views, templates, and APIs",
      "Industry-oriented mentoring focused on employable full-stack skills",
    ],
    tags: ["Python", "Django", "Summer Training", "Backend"],
  },
];
