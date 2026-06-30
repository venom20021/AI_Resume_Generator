"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import {
  type ResumeData,
  type ResumeStep,
  type ResumeTemplate,
  createEmptyResumeData,
  generateId,
} from "./types";

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
  removeJobDescription: (index: number) => void;
  currentStep: ResumeStep;
  setCurrentStep: (step: ResumeStep) => void;
  steps: { key: ResumeStep; label: string; icon: string }[];
  selectedTemplate: ResumeTemplate;
  setSelectedTemplate: (template: ResumeTemplate) => void;
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
  const [data, setData] = useState<ResumeData>(createEmptyResumeData());
  const [currentStep, setCurrentStep] = useState<ResumeStep>("personal");
  const [selectedTemplate, setSelectedTemplate] = useState<ResumeTemplate>("modern");

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
        removeJobDescription,
        currentStep,
        setCurrentStep,
        steps,
        selectedTemplate,
        setSelectedTemplate,
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
