import { describe, it, expect } from "vitest";
import { createEmptyResumeData, generateId } from "../types";

describe("createEmptyResumeData", () => {
  it("returns an object with the correct shape", () => {
    const data = createEmptyResumeData();

    expect(data).toHaveProperty("personalInfo");
    expect(data).toHaveProperty("education");
    expect(data).toHaveProperty("experience");
    expect(data).toHaveProperty("skills");
  });

  it("initializes personalInfo with empty strings", () => {
    const { personalInfo } = createEmptyResumeData();

    expect(personalInfo.fullName).toBe("");
    expect(personalInfo.email).toBe("");
    expect(personalInfo.phone).toBe("");
    expect(personalInfo.location).toBe("");
    expect(personalInfo.linkedIn).toBe("");
    expect(personalInfo.website).toBe("");
    expect(personalInfo.summary).toBe("");
  });

  it("initializes education, experience, and skills as empty arrays", () => {
    const data = createEmptyResumeData();

    expect(data.education).toEqual([]);
    expect(data.experience).toEqual([]);
    expect(data.skills).toEqual([]);
  });

  it("returns a new object each time it is called", () => {
    const data1 = createEmptyResumeData();
    const data2 = createEmptyResumeData();

    expect(data1).not.toBe(data2);
  });

  it("does not share references between calls", () => {
    const data1 = createEmptyResumeData();
    const data2 = createEmptyResumeData();

    data1.personalInfo.fullName = "John Doe";
    expect(data2.personalInfo.fullName).toBe("");
  });
});

describe("generateId", () => {
  it("returns a string", () => {
    const id = generateId();
    expect(typeof id).toBe("string");
  });

  it("returns a 9-character string", () => {
    const id = generateId();
    expect(id.length).toBe(9);
  });

  it("returns alphanumeric characters", () => {
    const id = generateId();
    expect(id).toMatch(/^[a-z0-9]+$/);
  });

  it("generates unique IDs on successive calls", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      ids.add(generateId());
    }
    expect(ids.size).toBe(100);
  });
});
