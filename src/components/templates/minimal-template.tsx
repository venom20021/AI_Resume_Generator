"use client";

import type { ResumeData } from "@/lib/types";

interface TemplateProps {
  data: ResumeData;
}

export function MinimalTemplate({ data }: TemplateProps) {
  const { personalInfo, education, experience, skills } = data;

  const skillsByCategory = skills.reduce<Record<string, { name: string; level: string }[]>>(
    (acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push({ name: skill.name, level: skill.level });
      return acc;
    },
    {}
  );

  return (
    <div className="mx-auto max-w-[816px] p-10">
      <div className="space-y-8">
        {/* Header */}
        <header>
          {personalInfo.fullName && (
            <h1 className="text-xl font-light text-neutral-800 tracking-wide">
              {personalInfo.fullName}
            </h1>
          )}
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-0.5 text-[11px] text-neutral-400">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section className="space-y-2">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              About
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              Experience
            </h2>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-800">{exp.position}</h3>
                      <p className="text-xs text-neutral-500">
                        {exp.company}
                        {exp.location && ` — ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-300 whitespace-nowrap">
                      {exp.startDate}
                      {exp.startDate && exp.endDate && " — "}
                      {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  {exp.bulletPoints.filter((b) => b.trim()).length > 0 && (
                    <div className="mt-2 space-y-1">
                      {exp.bulletPoints.map(
                        (bullet, i) =>
                          bullet.trim() && (
                            <p key={i} className="text-xs leading-relaxed text-neutral-500 pl-3 border-l border-neutral-200">
                              {bullet}
                            </p>
                          )
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-baseline justify-between gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-neutral-800">{edu.institution}</h3>
                      <p className="text-xs text-neutral-500">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && ` — GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <p className="text-[11px] text-neutral-300 whitespace-nowrap">
                      {edu.startDate}
                      {edu.startDate && edu.endDate && " — "}
                      {edu.endDate}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-xs leading-relaxed text-neutral-500 pl-3 border-l border-neutral-200">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section className="space-y-3">
            <h2 className="text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-300">
              Skills
            </h2>
            <div className="space-y-2">
              {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div key={category} className="flex items-baseline gap-2">
                  <span className="text-xs text-neutral-400 min-w-[100px]">{category}</span>
                  <span className="text-xs text-neutral-600">
                    {catSkills.map((s) => s.name).join(", ")}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
