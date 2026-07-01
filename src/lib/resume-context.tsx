"use client";

import { createContext, useContext, useState, useEffect, startTransition, type ReactNode } from "react";
import {
  type ResumeData,
  type ResumeStep,
  type ResumeTemplate,
  type ResumeSnapshot,
  type JdHistoryEntry,
  createEmptyResumeData,
  generateId,
} from "./types";

const STORAGE_KEY = "resume-builder-state";

interface SavedState {
  data: ResumeData;
  currentStep: ResumeStep;
  selectedTemplate: ResumeTemplate;
  resumeHistory?: ResumeSnapshot[];
  jdHistory?: JdHistoryEntry[];
}

function loadState(): SavedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.data || !parsed.currentStep || !parsed.selectedTemplate) {
      return null;
    }
    return parsed as SavedState;
  } catch {
    return null;
  }
}

function saveState(state: SavedState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or unavailable
  }
}

interface ResumeContextType {
  data: ResumeData;
  updatePersonalInfo: (field: string, value: string) => void;
  addEducation: () => void;
  updateEducation: (id: string, field: string, value: string) => void;
  removeEducation: (id: string) => void;
  addExperience: () => void;
  updateExperience: (
    id: string,
    field: string,
    value: string | boolean | string[]
  ) => void;
  removeExperience: (id: string) => void;
  addSkill: () => void;
  updateSkill: (id: string, field: string, value: string) => void;
  removeSkill: (id: string) => void;
  updateSummary: (summary: string) => void;
  updateBulletPoints: (id: string, bulletPoints: string[]) => void;
  importData: (data: ResumeData) => void;
  addSkillsBulk: (newSkills: { name: string; category: string; level: string }[]) => void;
  updateJobDescription: (index: number, value: string) => void;
  addJobDescription: () => void;
  addJobDescriptionWithValue: (text: string) => void;
  removeJobDescription: (index: number) => void;
  currentStep: ResumeStep;
  setCurrentStep: (step: ResumeStep) => void;
  steps: { key: ResumeStep; label: string; icon: string }[];
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: (template: ResumeTemplate) => void;
  // History features
  resumeHistory: ResumeSnapshot[];
  jdHistory: JdHistoryEntry[];
  saveResumeSnapshot: (label: string) => void;
  restoreResumeSnapshot: (id: string) => void;
  deleteResumeSnapshot: (id: string) => void;
  addToJdHistory: (text: string) => void;
  removeFromJdHistory: (id: string) => void;
}

const steps: { key: ResumeStep; label: string; icon: string }[] = [
  { key: "personal", label: "Personal Info", icon: "User" },
  { key: "education", label: "Education", icon: "GraduationCap" },
  { key: "experience", label: "Experience", icon: "Briefcase" },
  { key: "skills", label: "Skills", icon: "Wrench" },
  { key: "optimize", label: "Job Match", icon: "Target" },
];

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  // Always start with empty defaults so server and client render match.
  const [data, setData] = useState<ResumeData>(createEmptyResumeData());
  const [currentStep, setCurrentStep] = useState<ResumeStep>("personal");
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>("modern");
  const [resumeHistory, setResumeHistory] = useState<ResumeSnapshot[]>([]);
  const [jdHistory, setJdHistory] = useState<JdHistoryEntry[]>([]);

  // Restore saved state after hydration (useEffect runs client-only, so no
  // mismatch between server HTML and first client render).
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      startTransition(() => {
        setData(saved.data);
        setCurrentStep(saved.currentStep);
        setSelectedTemplate(saved.selectedTemplate);
        if (saved.resumeHistory) setResumeHistory(saved.resumeHistory);
        if (saved.jdHistory) setJdHistory(saved.jdHistory);
      });
    }
  }, []);

  // Auto-save to localStorage whenever state changes.
  useEffect(() => {
    saveState({ data, currentStep, selectedTemplate, resumeHistory, jdHistory });
  }, [data, currentStep, selectedTemplate, resumeHistory, jdHistory]);

  const updatePersonalInfo = (field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value },
    }));
  };

  const updateSummary = (summary: string) => {
    setData((prev) => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, summary },
    }));
  };

  const addEducation = () => {
    setData((prev) => ({
      ...prev,
      education: [
        ...prev.education,
        {
          id: generateId(),
          institution: "",
          degree: "",
          field: "",
          startDate: "",
          endDate: "",
          gpa: "",
          description: "",
        },
      ],
    }));
  };

  const updateEducation = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.map((edu) =>
        edu.id === id ? { ...edu, [field]: value } : edu
      ),
    }));
  };

  const removeEducation = (id: string) => {
    setData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  };

  const addExperience = () => {
    setData((prev) => ({
      ...prev,
      experience: [
        ...prev.experience,
        {
          id: generateId(),
          company: "",
          position: "",
          location: "",
          startDate: "",
          endDate: "",
          current: false,
          bulletPoints: [""],
        },
      ],
    }));
  };

  const updateExperience = (
    id: string,
    field: string,
    value: string | boolean | string[]
  ) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      ),
    }));
  };

  const removeExperience = (id: string) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }));
  };

  const updateBulletPoints = (id: string, bulletPoints: string[]) => {
    setData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) =>
        exp.id === id ? { ...exp, bulletPoints } : exp
      ),
    }));
  };

  const addSkill = () => {
    setData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        {
          id: generateId(),
          name: "",
          level: "intermediate",
          category: "Other",
        },
      ],
    }));
  };

  const updateSkill = (id: string, field: string, value: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.map((skill) =>
        skill.id === id ? { ...skill, [field]: value } : skill
      ),
    }));
  };

  const removeSkill = (id: string) => {
    setData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill.id !== id),
    }));
  };

  const importData = (importedData: ResumeData) => {
    setData(importedData);
  };

  const updateJobDescription = (index: number, value: string) => {
    setData((prev) => {
      const updated = [...prev.jobDescriptions];
      updated[index] = value;
      return { ...prev, jobDescriptions: updated };
    });
  };

  const addJobDescription = () => {
    setData((prev) => ({
      ...prev,
      jobDescriptions: [...prev.jobDescriptions, ""],
    }));
  };

  const addJobDescriptionWithValue = (text: string) => {
    setData((prev) => ({
      ...prev,
      jobDescriptions: [...prev.jobDescriptions, text],
    }));
  };

  const removeJobDescription = (index: number) => {
    setData((prev) => ({
      ...prev,
      jobDescriptions: prev.jobDescriptions.filter((_, i) => i !== index),
    }));
  };

  const addSkillsBulk = (newSkills: { name: string; category: string; level: string }[]) => {
    setData((prev) => ({
      ...prev,
      skills: [
        ...prev.skills,
        ...newSkills.map((s) => ({
          id: generateId(),
          name: s.name,
          level: s.level as "beginner" | "intermediate" | "advanced" | "expert",
          category: s.category,
        })),
      ],
    }));
  };

  // ── History features ──────────────────────────────────────────

  const saveResumeSnapshot = (label: string) => {
    const snapshot: ResumeSnapshot = {
      id: generateId(),
      timestamp: Date.now(),
      label,
      data: JSON.parse(JSON.stringify(data)), // deep clone
    };
    setResumeHistory((prev) => [snapshot, ...prev].slice(0, 20)); // keep last 20
  };

  const restoreResumeSnapshot = (id: string) => {
    const snapshot = resumeHistory.find((s) => s.id === id);
    if (snapshot) {
      setData(JSON.parse(JSON.stringify(snapshot.data)));
    }
  };

  const deleteResumeSnapshot = (id: string) => {
    setResumeHistory((prev) => prev.filter((s) => s.id !== id));
  };

  const addToJdHistory = (text: string) => {
    if (!text.trim()) return;
    // Don't add duplicates (same text)
    setJdHistory((prev) => {
      const exists = prev.some((e) => e.text === text);
      if (exists) return prev;
      const entry: JdHistoryEntry = {
        id: generateId(),
        text,
        label: text.slice(0, 60) + (text.length > 60 ? "..." : ""),
        timestamp: Date.now(),
      };
      return [entry, ...prev].slice(0, 50); // keep last 50
    });
  };

  const removeFromJdHistory = (id: string) => {
    setJdHistory((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <ResumeContext.Provider
      value={{
        data,
        updatePersonalInfo,
        addEducation,
        updateEducation,
        removeEducation,
        addExperience,
        updateExperience,
        removeExperience,
        addSkill,
        updateSkill,
        removeSkill,
        updateSummary,
        updateBulletPoints,
        importData,
        addSkillsBulk,
        updateJobDescription,
        addJobDescription,
        addJobDescriptionWithValue,
        removeJobDescription,
        currentStep,
        setCurrentStep,
        steps,
        selectedTemplate,
        setSelectedTemplate,
        resumeHistory,
        jdHistory,
        saveResumeSnapshot,
        restoreResumeSnapshot,
        deleteResumeSnapshot,
        addToJdHistory,
        removeFromJdHistory,
      }}
    >
      {children}
    </ResumeContext.Provider>
  );
}

export function useResume() {
  const context = useContext(ResumeContext);
  if (!context) {
    throw new Error("useResume must be used within a ResumeProvider");
  }
  return context;
}
