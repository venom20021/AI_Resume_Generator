export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

export interface Skill {
  id: string;
  name: string;
  level: "beginner" | "intermediate" | "advanced" | "expert";
  category: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  jobDescriptions: string[];
}

export type ResumeStep = "personal" | "education" | "experience" | "skills" | "optimize";
export type ResumeTemplate = "modern" | "classic" | "minimal";

export const SKILL_CATEGORIES = [
  "Languages",
  "Frameworks & Libraries",
  "Databases",
  "Tools & Platforms",
  "Soft Skills",
  "Other",
] as const;

export const SKILL_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
] as const;

export function createEmptyResumeData(): ResumeData {
  return {
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      website: "",
      summary: "",
    },
    education: [],
    experience: [],
    skills: [],
    jobDescriptions: [],
  };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
