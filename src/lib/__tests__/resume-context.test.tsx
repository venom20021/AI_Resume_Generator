import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { ResumeProvider, useResume } from "../resume-context";
import type { ResumeData } from "../types";
import { createEmptyResumeData } from "../types";

beforeEach(() => {
  localStorage.clear();
});

// Helper to render the hook within the provider
function renderResumeHook() {
  return renderHook(() => useResume(), {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <ResumeProvider>{children}</ResumeProvider>
    ),
  });
}

describe("ResumeProvider - initial state", () => {
  it("initializes with empty resume data", () => {
    const { result } = renderResumeHook();
    expect(result.current.data).toEqual(createEmptyResumeData());
  });

  it("initializes with the first step selected", () => {
    const { result } = renderResumeHook();
    expect(result.current.currentStep).toBe("personal");
  });

  it("initializes with modern template", () => {
    const { result } = renderResumeHook();
    expect(result.current.selectedTemplate).toBe("modern");
  });

  it("provides the correct number of steps", () => {
    const { result } = renderResumeHook();
    expect(result.current.steps).toHaveLength(5);
    expect(result.current.steps.map((s) => s.key)).toEqual([
      "personal",
      "education",
      "experience",
      "skills",
      "optimize",
    ]);
  });
});

describe("ResumeProvider - personal info", () => {
  it("updatePersonalInfo updates a field", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.updatePersonalInfo("fullName", "John Doe");
    });

    expect(result.current.data.personalInfo.fullName).toBe("John Doe");
  });

  it("updatePersonalInfo updates only the specified field", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.updatePersonalInfo("email", "john@example.com");
    });

    expect(result.current.data.personalInfo.fullName).toBe("");
    expect(result.current.data.personalInfo.email).toBe("john@example.com");
  });

  it("updateSummary sets the summary text", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.updateSummary("A highly motivated developer.");
    });

    expect(result.current.data.personalInfo.summary).toBe(
      "A highly motivated developer."
    );
  });
});

describe("ResumeProvider - education", () => {
  it("addEducation creates a new empty education entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addEducation();
    });

    expect(result.current.data.education).toHaveLength(1);
    expect(result.current.data.education[0].institution).toBe("");
    expect(result.current.data.education[0].degree).toBe("");
    expect(result.current.data.education[0].id).toBeTruthy();
  });

  it("updateEducation modifies a field on an education entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addEducation();
    });

    const id = result.current.data.education[0].id;

    act(() => {
      result.current.updateEducation(id, "institution", "MIT");
    });

    expect(result.current.data.education[0].institution).toBe("MIT");
  });

  it("removeEducation deletes an education entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addEducation();
      result.current.addEducation();
    });

    expect(result.current.data.education).toHaveLength(2);
    const id = result.current.data.education[0].id;

    act(() => {
      result.current.removeEducation(id);
    });

    expect(result.current.data.education).toHaveLength(1);
    expect(result.current.data.education[0].id).not.toBe(id);
  });
});

describe("ResumeProvider - experience", () => {
  it("addExperience creates a new empty experience entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addExperience();
    });

    expect(result.current.data.experience).toHaveLength(1);
    expect(result.current.data.experience[0].company).toBe("");
    expect(result.current.data.experience[0].bulletPoints).toEqual([""]);
    expect(result.current.data.experience[0].current).toBe(false);
  });

  it("updateExperience updates a string field", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addExperience();
    });

    const id = result.current.data.experience[0].id;

    act(() => {
      result.current.updateExperience(id, "position", "Senior Dev");
    });

    expect(result.current.data.experience[0].position).toBe("Senior Dev");
  });

  it("updateExperience updates a boolean field", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addExperience();
    });

    const id = result.current.data.experience[0].id;

    act(() => {
      result.current.updateExperience(id, "current", true);
    });

    expect(result.current.data.experience[0].current).toBe(true);
  });

  it("updateBulletPoints replaces bullet points", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addExperience();
    });

    const id = result.current.data.experience[0].id;
    const newBullets = ["Built feature X", "Fixed bug Y"];

    act(() => {
      result.current.updateBulletPoints(id, newBullets);
    });

    expect(result.current.data.experience[0].bulletPoints).toEqual(newBullets);
  });

  it("removeExperience deletes an experience entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addExperience();
      result.current.addExperience();
    });

    const id = result.current.data.experience[0].id;

    act(() => {
      result.current.removeExperience(id);
    });

    expect(result.current.data.experience).toHaveLength(1);
  });
});

describe("ResumeProvider - skills", () => {
  it("addSkill creates a new skill with default values", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addSkill();
    });

    expect(result.current.data.skills).toHaveLength(1);
    expect(result.current.data.skills[0].name).toBe("");
    expect(result.current.data.skills[0].level).toBe("intermediate");
    expect(result.current.data.skills[0].category).toBe("Other");
  });

  it("updateSkill modifies a skill field", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addSkill();
    });

    const id = result.current.data.skills[0].id;

    act(() => {
      result.current.updateSkill(id, "name", "TypeScript");
    });

    expect(result.current.data.skills[0].name).toBe("TypeScript");
  });

  it("removeSkill deletes a skill", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addSkill();
      result.current.addSkill();
    });

    const id = result.current.data.skills[0].id;

    act(() => {
      result.current.removeSkill(id);
    });

    expect(result.current.data.skills).toHaveLength(1);
  });

  it("addSkillsBulk appends multiple skills", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addSkillsBulk([
        { name: "React", category: "Frameworks & Libraries", level: "advanced" },
        { name: "Python", category: "Languages", level: "intermediate" },
      ]);
    });

    expect(result.current.data.skills).toHaveLength(2);
    expect(result.current.data.skills[0].name).toBe("React");
    expect(result.current.data.skills[0].level).toBe("advanced");
    expect(result.current.data.skills[1].name).toBe("Python");
    expect(result.current.data.skills[1].category).toBe("Languages");
  });

  it("addSkillsBulk adds to existing skills", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addSkill();
      result.current.addSkillsBulk([
        { name: "Node.js", category: "Tools & Platforms", level: "expert" },
      ]);
    });

    expect(result.current.data.skills).toHaveLength(2);
  });
});

describe("ResumeProvider - importData", () => {
  it("importData completely replaces resume data", () => {
    const { result } = renderResumeHook();

    const newData: ResumeData = {
      personalInfo: {
        fullName: "Imported User",
        email: "imported@test.com",
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

    act(() => {
      result.current.importData(newData);
    });

    expect(result.current.data.personalInfo.fullName).toBe("Imported User");
  });
});

describe("ResumeProvider - step navigation", () => {
  it("setCurrentStep changes the current step", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.setCurrentStep("experience");
    });

    expect(result.current.currentStep).toBe("experience");
  });
});

describe("ResumeProvider - template selection", () => {
  it("setSelectedTemplate changes the template", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.setSelectedTemplate("classic");
    });

    expect(result.current.selectedTemplate).toBe("classic");
  });
});

describe("useResume - error boundary", () => {
  it("throws error when used outside provider", () => {
    expect(() => {
      renderHook(() => useResume());
    }).toThrow("useResume must be used within a ResumeProvider");
  });
});

describe("ResumeProvider - history features", () => {
  it("saveResumeSnapshot creates a snapshot with a label", () => {
    const { result } = renderResumeHook();

    // Add some data first
    act(() => {
      result.current.updatePersonalInfo("fullName", "Jane Doe");
    });

    act(() => {
      result.current.saveResumeSnapshot("Version 1");
    });

    expect(result.current.resumeHistory).toHaveLength(1);
    expect(result.current.resumeHistory[0].label).toBe("Version 1");
    expect(result.current.resumeHistory[0].data.personalInfo.fullName).toBe("Jane Doe");
    expect(result.current.resumeHistory[0].id).toBeTruthy();
    expect(result.current.resumeHistory[0].timestamp).toBeGreaterThan(0);
  });

  it("restoreResumeSnapshot restores data from a snapshot", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.updatePersonalInfo("fullName", "Original Name");
    });

    act(() => {
      result.current.saveResumeSnapshot("Original version");
    });

    const snapshotId = result.current.resumeHistory[0].id;

    // Change the name
    act(() => {
      result.current.updatePersonalInfo("fullName", "Changed Name");
    });

    expect(result.current.data.personalInfo.fullName).toBe("Changed Name");

    // Restore snapshot
    act(() => {
      result.current.restoreResumeSnapshot(snapshotId);
    });

    expect(result.current.data.personalInfo.fullName).toBe("Original Name");
  });

  it("deleteResumeSnapshot removes a snapshot", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.saveResumeSnapshot("Snapshot 1");
      result.current.saveResumeSnapshot("Snapshot 2");
    });

    expect(result.current.resumeHistory).toHaveLength(2);

    const id = result.current.resumeHistory[0].id;

    act(() => {
      result.current.deleteResumeSnapshot(id);
    });

    expect(result.current.resumeHistory).toHaveLength(1);
    expect(result.current.resumeHistory[0].id).not.toBe(id);
  });

  it("addToJdHistory adds a JD entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addToJdHistory("Senior Software Engineer at Google");
    });

    expect(result.current.jdHistory).toHaveLength(1);
    expect(result.current.jdHistory[0].text).toBe("Senior Software Engineer at Google");
    expect(result.current.jdHistory[0].id).toBeTruthy();
    expect(result.current.jdHistory[0].timestamp).toBeGreaterThan(0);
  });

  it("addToJdHistory does not add duplicate text", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addToJdHistory("Unique JD text");
      result.current.addToJdHistory("Unique JD text");
    });

    expect(result.current.jdHistory).toHaveLength(1);
  });

  it("addToJdHistory ignores empty text", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addToJdHistory("");
      result.current.addToJdHistory("   ");
    });

    expect(result.current.jdHistory).toHaveLength(0);
  });

  it("removeFromJdHistory removes a JD entry", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.addToJdHistory("Job at Google");
      result.current.addToJdHistory("Job at Meta");
    });

    expect(result.current.jdHistory).toHaveLength(2);

    const id = result.current.jdHistory[0].id;

    act(() => {
      result.current.removeFromJdHistory(id);
    });

    expect(result.current.jdHistory).toHaveLength(1);
    expect(result.current.jdHistory[0].id).not.toBe(id);
  });

  it("saveResumeSnapshot deep-clones data (mutating original doesn't affect snapshot)", () => {
    const { result } = renderResumeHook();

    act(() => {
      result.current.updatePersonalInfo("fullName", "Original");
    });

    act(() => {
      result.current.saveResumeSnapshot("Snapshot");
    });

    // Mutate current data
    act(() => {
      result.current.updatePersonalInfo("fullName", "Mutated");
    });

    // Snapshot should still have "Original"
    expect(result.current.resumeHistory[0].data.personalInfo.fullName).toBe("Original");
    expect(result.current.data.personalInfo.fullName).toBe("Mutated");
  });
});
