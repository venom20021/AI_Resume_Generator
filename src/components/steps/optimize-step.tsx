"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResume } from "@/lib/resume-context";
import { Plus, Trash2, Sparkles, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function OptimizeStep() {
  const {
    data,
    updateJobDescription,
    addJobDescription,
    removeJobDescription,
    importData,
  } = useResume();
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);

  const hasResumeContent =
    data.personalInfo.fullName ||
    data.experience.length > 0 ||
    data.education.length > 0;

  const optimizeForJob = async (index: number) => {
    const jd = data.jobDescriptions[index];
    if (!jd.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }
    if (!hasResumeContent) {
      toast.error("Fill in your resume details before optimizing.");
      return;
    }

    setOptimizingIndex(index);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "optimize",
          current: jd,
          context: { resume: data },
        }),
      });
      const json = await res.json();
      if (json.error) {
        toast.error(json.error);
        return;
      }
      if (json.resume) {
        const optimized = json.resume;
        // Merge optimized fields into existing data to avoid data loss
        const merged = {
          ...data,
          personalInfo: {
            ...data.personalInfo,
            ...(optimized.personalInfo || {}),
          },
          experience: data.experience.map((exp) => {
            const optExp = optimized.experience?.find(
              (o: { id: string }) => o.id === exp.id
            );
            return optExp
              ? { ...exp, bulletPoints: optExp.bulletPoints || exp.bulletPoints }
              : exp;
          }),
          skills: optimized.skills || data.skills,
        };
        importData(merged);
        toast.success("Resume optimized for this job description!");
      } else {
        toast.error("Failed to optimize resume. Try again.");
      }
    } catch {
      toast.error("Failed to optimize resume. Check your API key or try again.");
    } finally {
      setOptimizingIndex(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Match Resume to Job</h2>
        <p className="text-sm text-muted-foreground">
          Paste job descriptions below and let AI rewrite your resume to match
          each role. Your bullet points and summary will be tailored with
          relevant keywords and achievements.
        </p>
      </div>

      {!hasResumeContent && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Fill in your personal info, experience, education, and skills first
            so the AI can tailor your resume effectively.
          </span>
        </div>
      )}

      {data.jobDescriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Sparkles className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Paste a job description and the AI will rewrite your resume to match
            it — optimizing bullet points, summary, and keywords.
          </p>
          <Button
            onClick={addJobDescription}
            size="sm"
            className="mt-4 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Job Description
          </Button>
        </div>
      )}

      {data.jobDescriptions.map((jd, index) => (
        <div
          key={index}
          className="relative rounded-lg border p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Job #{index + 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => optimizeForJob(index)}
                disabled={optimizingIndex === index || !jd.trim() || !hasResumeContent}
                className="gap-1.5"
              >
                {optimizingIndex === index ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Optimize Resume
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeJobDescription(index)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`jd-${index}`}>Job Description</Label>
            <Textarea
              id={`jd-${index}`}
              placeholder="Paste the full job description here..."
              className="min-h-[200px] resize-y"
              value={jd}
              onChange={(e) => updateJobDescription(index, e.target.value)}
            />
          </div>

          {optimizingIndex === index && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>
                Analyzing job description and rewriting your resume...
              </span>
            </div>
          )}
        </div>
      ))}

      {data.jobDescriptions.length > 0 && (
        <Button
          variant="outline"
          onClick={addJobDescription}
          className="w-full gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Another Job Description
        </Button>
      )}

      {data.jobDescriptions.length > 0 && hasResumeContent && (
        <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            How it works
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
            <li>
              The AI reads the job description and identifies key skills,
              requirements, and keywords.
            </li>
            <li>
              Your summary, bullet points, and skills are rewritten to
              highlight relevant experience.
            </li>
            <li>
              Only your summary, bullet points, and skills are rewritten —
              your personal info, education, and job details are preserved.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
