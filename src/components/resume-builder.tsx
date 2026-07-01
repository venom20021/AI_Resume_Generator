"use client";

import { useState, useRef } from "react";
import { useResume } from "@/lib/resume-context";
import type { ResumeData } from "@/lib/types";
import { toast } from "sonner";
import { ResumePreview } from "@/components/resume-preview";
import { PersonalInfoStep } from "@/components/steps/personal-info-step";
import { EducationStep } from "@/components/steps/education-step";
import { ExperienceStep } from "@/components/steps/experience-step";
import { SkillsStep } from "@/components/steps/skills-step";
import { OptimizeStep } from "@/components/steps/optimize-step";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
  Upload,
  FileDown,
  User,
  GraduationCap,
  Briefcase,
  Wrench,
  Target,
} from "lucide-react";

const stepIcons: Record<string, React.ReactNode> = {
  personal: <User className="h-4 w-4" />,
  education: <GraduationCap className="h-4 w-4" />,
  experience: <Briefcase className="h-4 w-4" />,
  skills: <Wrench className="h-4 w-4" />,
  optimize: <Target className="h-4 w-4" />,
};

export function ResumeBuilder() {
  const { currentStep, setCurrentStep, steps, data, importData, selectedTemplate, setSelectedTemplate } = useResume();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentIndex = steps.findIndex((s) => s.key === currentStep);

  const goNext = () => {
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    }
  };

  const goBack = () => {
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key);
    }
  };

  const handleGeneratePdf = async () => {
    setIsGeneratingPdf(true);
    try {
      const res = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, template: selectedTemplate }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `resume-${data.personalInfo.fullName.trim() || "untitled"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF download failed:", error);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handleExportJson = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `resume-${data.personalInfo.fullName.trim() || "untitled"}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (
          imported.personalInfo &&
          Array.isArray(imported.education) &&
          Array.isArray(imported.experience) &&
          Array.isArray(imported.skills)
        ) {
          if (
            hasContent &&
            !confirm(
              "Importing will replace all current resume data. Continue?"
            )
          ) {
            return;
          }
          importData(imported as ResumeData);
          toast.success("Resume data imported successfully");
        } else {
          toast.error("Invalid resume JSON file");
        }
      } catch {
        toast.error("Failed to parse JSON file");
      }
    };
    reader.readAsText(file);
    // Reset so the same file can be re-imported
    e.target.value = "";
  };

  const hasContent =
    data.personalInfo.fullName ||
    data.personalInfo.email ||
    data.education.length > 0 ||
    data.experience.length > 0 ||
    data.skills.length > 0;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col lg:flex-row">
      {/* Form Panel */}
      <div className="flex w-full flex-col border-r lg:w-[480px] xl:w-[540px]">
        {/* Step Navigation */}
        <nav className="flex shrink-0 items-center border-b bg-muted/30 px-4 py-3">
          <div className="flex items-center gap-1">
            {steps.map((step, i) => (
              <div key={step.key} className="flex items-center">
                <button
                  onClick={() => setCurrentStep(step.key)}
                  className={"flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors " + (
                    currentStep === step.key
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  )}
                >
                  {stepIcons[step.key]}
                  <span className="hidden sm:inline">{step.label}</span>
                </button>
                {i < steps.length - 1 && (
                  <ChevronRight className="mx-1 h-3 w-3 text-muted-foreground/40" />
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Form Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="mx-auto max-w-lg">
            {currentStep === "personal" && <PersonalInfoStep />}
            {currentStep === "education" && <EducationStep />}
            {currentStep === "experience" && <ExperienceStep />}
            {currentStep === "skills" && <SkillsStep />}
            {currentStep === "optimize" && <OptimizeStep />}
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="flex shrink-0 items-center justify-between border-t bg-muted/30 px-4 py-3">
          <Button
            variant="ghost"
            onClick={goBack}
            disabled={currentIndex === 0}
            size="sm"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            {/* Import / Export */}
            <div className="flex items-center gap-1">
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleImportJson}
                className="hidden"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5 text-muted-foreground"
              >
                <Upload className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Import</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportJson}
                disabled={!hasContent}
                className="gap-1.5 text-muted-foreground"
              >
                <FileDown className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>

            <div className="h-4 w-px bg-border" />

            <Button
              variant="outline"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={isGeneratingPdf || !hasContent}
              className="gap-1.5"
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              Download PDF
            </Button>

            {currentIndex < steps.length - 1 ? (
              <Button onClick={goNext} size="sm">
                Next
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={goNext} size="sm" disabled>
                Complete
                <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Preview Panel */}
      <div className="hidden flex-1 bg-muted/20 lg:block">
        <div className="flex h-full flex-col">
          <div className="flex shrink-0 items-center justify-between border-b bg-muted/30 px-4 py-2.5">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Preview</span>
            </div>
            <div className="flex items-center gap-2">
              {/* Template Selector */}
              <div className="flex items-center gap-0.5 rounded-md border p-0.5 bg-background">
                <button
                  onClick={() => setSelectedTemplate("modern")}
                  className={`px-2 py-1 text-[11px] font-medium rounded-sm transition-colors ${
                    selectedTemplate === "modern"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Modern
                </button>
                <button
                  onClick={() => setSelectedTemplate("classic")}
                  className={`px-2 py-1 text-[11px] font-medium rounded-sm transition-colors ${
                    selectedTemplate === "classic"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Classic
                </button>
                <button
                  onClick={() => setSelectedTemplate("minimal")}
                  className={`px-2 py-1 text-[11px] font-medium rounded-sm transition-colors ${
                    selectedTemplate === "minimal"
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Minimal
                </button>
              </div>
              <Badge variant="secondary" className="text-xs">
                ATS-friendly
              </Badge>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <ResumePreview />
          </div>
        </div>
      </div>
    </div>
  );
}
