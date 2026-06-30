"use client";

import { useResume } from "@/lib/resume-context";
import { ModernTemplate } from "@/components/templates/modern-template";
import { ClassicTemplate } from "@/components/templates/classic-template";
import { MinimalTemplate } from "@/components/templates/minimal-template";

export function ResumePreview() {
  const { data, selectedTemplate } = useResume();
  const { personalInfo, education, experience, skills } = data;

  const hasContent =
    personalInfo.fullName ||
    personalInfo.email ||
    education.length > 0 ||
    experience.length > 0 ||
    skills.length > 0;

  if (!hasContent) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="h-8 w-8 text-muted-foreground"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-muted-foreground">
            Your resume preview will appear here
          </h3>
          <p className="mt-1 text-xs text-muted-foreground/60">
            Fill out the form to see a live preview.
          </p>
        </div>
      </div>
    );
  }

  const templateMap: Record<string, React.ReactNode> = {
    modern: <ModernTemplate data={data} />,
    classic: <ClassicTemplate data={data} />,
    minimal: <MinimalTemplate data={data} />,
  };

  return (
    <div className="h-full overflow-y-auto bg-white">
      {templateMap[selectedTemplate] || <ModernTemplate data={data} />}
    </div>
  );
}
