import { describe, it, expect } from "vitest";
import {
  validatePersonalInfo,
  validateEducation,
  validateExperience,
  validateSkills,
  validateResume,
  isResumeComplete,
} from "../validation";
import type { ResumeData } from "../types";
import { createEmptyResumeData } from "../types";

function makeSampleData(overrides?: Partial<ResumeData>): ResumeData {
  return {
    ...createEmptyResumeData(),
    personalInfo: {
      fullName: "Jane Doe",
      email: "jane@example.com",
      phone: "555-0000",
      location: "SF",
      linkedIn: "linkedin.com/in/jane",
      website: "janedoe.dev",
      summary: "A great developer.",
    },
    education: [
      {
        id: "edu1",
        institution: "UC Berkeley",
        degree: "B.S.",
        field: "Computer Science",
        startDate: "Aug 2020",
        endDate: "May 2024",
        gpa: "3.8",
        description: "",
      },
    ],
    experience: [
      {
        id: "exp1",
        company: "Acme Corp",
        position: "Engineer",
        location: "SF",
        startDate: "Jun 2024",
        endDate: "",
        current: true,
        bulletPoints: ["Built a thing"],
      },
    ],
    skills: [
      { id: "sk1", name: "React", level: "advanced", category: "Frameworks & Libraries" },
    ],
    ...overrides,
  };
}

describe("validatePersonalInfo", () => {
  it("returns no errors for valid personal info", () => {
    const data = makeSampleData();
    expect(validatePersonalInfo(data)).toHaveLength(0);
  });

  it("returns error when fullName is empty", () => {
    const data = makeSampleData({ personalInfo: { ...makeSampleData().personalInfo, fullName: "" } });
    const errors = validatePersonalInfo(data);
    expect(errors).toHaveLength(1);
    expect(errors[0].field).toBe("fullName");
  });

  it("returns error when fullName is only whitespace", () => {
    const data = makeSampleData({ personalInfo: { ...makeSampleData().personalInfo, fullName: "   " } });
    expect(validatePersonalInfo(data)).toHaveLength(1);
  });

  it("returns error when email is empty", () => {
    const data = makeSampleData({ personalInfo: { ...makeSampleData().personalInfo, email: "" } });
    const errors = validatePersonalInfo(data);
    expect(errors.some((e) => e.field === "email")).toBe(true);
  });

  it("returns error when email format is invalid", () => {
    const data = makeSampleData({ personalInfo: { ...makeSampleData().personalInfo, email: "not-an-email" } });
    const errors = validatePersonalInfo(data);
    expect(errors.some((e) => e.field === "email")).toBe(true);
  });

  it("returns multiple errors when multiple fields are invalid", () => {
    const data = makeSampleData({ personalInfo: { ...makeSampleData().personalInfo, fullName: "", email: "bad" } });
    expect(validatePersonalInfo(data)).toHaveLength(2);
  });
});

describe("validateEducation", () => {
  it("returns no errors for valid education", () => {
    const data = makeSampleData();
    expect(validateEducation(data.education)).toHaveLength(0);
  });

  it("returns errors for empty institution", () => {
    const edu = [{ ...makeSampleData().education[0], institution: "" }];
    const errors = validateEducation(edu);
    expect(errors.some((e) => e.field === "institution")).toBe(true);
  });

  it("returns errors for empty degree", () => {
    const edu = [{ ...makeSampleData().education[0], degree: "" }];
    const errors = validateEducation(edu);
    expect(errors.some((e) => e.field === "degree")).toBe(true);
  });

  it("includes the index for education errors", () => {
    const edu = [
      { ...makeSampleData().education[0], institution: "" },
      { ...makeSampleData().education[0], degree: "" },
    ];
    const errors = validateEducation(edu);
    expect(errors[0].index).toBe(0);
    expect(errors[1].index).toBe(1);
  });

  it("returns empty array when no education entries exist", () => {
    expect(validateEducation([])).toHaveLength(0);
  });
});

describe("validateExperience", () => {
  it("returns no errors for valid experience", () => {
    const data = makeSampleData();
    expect(validateExperience(data.experience)).toHaveLength(0);
  });

  it("returns error when company is empty", () => {
    const exp = [{ ...makeSampleData().experience[0], company: "" }];
    const errors = validateExperience(exp);
    expect(errors.some((e) => e.field === "company")).toBe(true);
  });

  it("returns error when position is empty", () => {
    const exp = [{ ...makeSampleData().experience[0], position: "" }];
    const errors = validateExperience(exp);
    expect(errors.some((e) => e.field === "position")).toBe(true);
  });

  it("returns error when endDate is empty and not current position", () => {
    const exp = [
      { ...makeSampleData().experience[0], current: false, endDate: "" },
    ];
    const errors = validateExperience(exp);
    expect(errors.some((e) => e.field === "endDate")).toBe(true);
  });

  it("does not require endDate when current is true", () => {
    const exp = [
      { ...makeSampleData().experience[0], current: true, endDate: "" },
    ];
    const errors = validateExperience(exp);
    expect(errors.some((e) => e.field === "endDate")).toBe(false);
  });

  it("returns error when no bullet points are filled", () => {
    const exp = [
      { ...makeSampleData().experience[0], bulletPoints: ["", "  "] },
    ];
    const errors = validateExperience(exp);
    expect(errors.some((e) => e.field === "bulletPoints")).toBe(true);
  });

  it("returns empty array when no experience entries exist", () => {
    expect(validateExperience([])).toHaveLength(0);
  });
});

describe("validateSkills", () => {
  it("returns no errors for valid skills", () => {
    expect(validateSkills(makeSampleData().skills)).toHaveLength(0);
  });

  it("returns error when skill name is empty", () => {
    const skills = [{ id: "s1", name: "", level: "advanced" as const, category: "Languages" }];
    const errors = validateSkills(skills);
    expect(errors.some((e) => e.field === "name")).toBe(true);
  });

  it("returns empty array when no skills exist", () => {
    expect(validateSkills([])).toHaveLength(0);
  });
});

describe("validateResume", () => {
  it("returns no errors for a fully valid resume", () => {
    expect(validateResume(makeSampleData())).toHaveLength(0);
  });

  it("aggregates errors from all sections", () => {
    const data = makeSampleData();
    data.personalInfo.fullName = "";
    data.education[0].institution = "";
    data.experience[0].company = "";
    data.skills[0].name = "";

    const errors = validateResume(data);
    expect(errors.length).toBeGreaterThanOrEqual(4);
    const sections = new Set(errors.map((e) => e.section));
    expect(sections.has("personalInfo")).toBe(true);
    expect(sections.has("education")).toBe(true);
    expect(sections.has("experience")).toBe(true);
    expect(sections.has("skills")).toBe(true);
  });
});

describe("isResumeComplete", () => {
  it("returns true for valid data", () => {
    expect(isResumeComplete(makeSampleData())).toBe(true);
  });

  it("returns false for invalid data", () => {
    const data = makeSampleData({ personalInfo: { ...makeSampleData().personalInfo, fullName: "" } });
    expect(isResumeComplete(data)).toBe(false);
  });
});
