import type { ResumeData, Education, Experience, Skill } from "./types";

export interface ValidationError {
  field: string;
  message: string;
  section: "personalInfo" | "education" | "experience" | "skills";
  index?: number;
}

export function validatePersonalInfo(data: ResumeData): ValidationError[] {
  const errors: ValidationError[] = [];
  const { personalInfo } = data;

  if (!personalInfo.fullName.trim()) {
    errors.push({
      field: "fullName",
      message: "Full name is required",
      section: "personalInfo",
    });
  }

  if (!personalInfo.email.trim()) {
    errors.push({
      field: "email",
      message: "Email is required",
      section: "personalInfo",
    });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalInfo.email.trim())) {
    errors.push({
      field: "email",
      message: "Email is not valid",
      section: "personalInfo",
    });
  }

  return errors;
}

export function validateEducation(education: Education[]): ValidationError[] {
  const errors: ValidationError[] = [];

  education.forEach((edu, index) => {
    if (!edu.institution.trim()) {
      errors.push({
        field: "institution",
        message: "Institution name is required",
        section: "education",
        index,
      });
    }
    if (!edu.degree.trim()) {
      errors.push({
        field: "degree",
        message: "Degree is required",
        section: "education",
        index,
      });
    }
    if (!edu.startDate.trim()) {
      errors.push({
        field: "startDate",
        message: "Start date is required",
        section: "education",
        index,
      });
    }
    if (!edu.endDate.trim()) {
      errors.push({
        field: "endDate",
        message: "End date is required",
        section: "education",
        index,
      });
    }
  });

  return errors;
}

export function validateExperience(
  experience: Experience[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  experience.forEach((exp, index) => {
    if (!exp.company.trim()) {
      errors.push({
        field: "company",
        message: "Company name is required",
        section: "experience",
        index,
      });
    }
    if (!exp.position.trim()) {
      errors.push({
        field: "position",
        message: "Position is required",
        section: "experience",
        index,
      });
    }
    if (!exp.startDate.trim()) {
      errors.push({
        field: "startDate",
        message: "Start date is required",
        section: "experience",
        index,
      });
    }
    if (!exp.current && !exp.endDate.trim()) {
      errors.push({
        field: "endDate",
        message: "End date is required unless this is your current position",
        section: "experience",
        index,
      });
    }

    const filledBullets = exp.bulletPoints.filter((b) => b.trim());
    if (filledBullets.length === 0) {
      errors.push({
        field: "bulletPoints",
        message: "At least one bullet point is required",
        section: "experience",
        index,
      });
    }
  });

  return errors;
}

export function validateSkills(skills: Skill[]): ValidationError[] {
  const errors: ValidationError[] = [];

  skills.forEach((skill, index) => {
    if (!skill.name.trim()) {
      errors.push({
        field: "name",
        message: "Skill name is required",
        section: "skills",
        index,
      });
    }
  });

  return errors;
}

export function validateResume(data: ResumeData): ValidationError[] {
  return [
    ...validatePersonalInfo(data),
    ...validateEducation(data.education),
    ...validateExperience(data.experience),
    ...validateSkills(data.skills),
  ];
}

export function isResumeComplete(data: ResumeData): boolean {
  return validateResume(data).length === 0;
}
