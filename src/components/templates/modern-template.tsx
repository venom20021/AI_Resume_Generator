"use client";

import type { ResumeData } from "@/lib/types";

interface TemplateProps {
  data: ResumeData;
}

export function ModernTemplate({ data }: TemplateProps) {
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
    <div className="mx-auto max-w-[816px] p-8">
      <div className="space-y-6">
        {/* Header */}
        <header className="text-center">
          {personalInfo.fullName && (
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              {personalInfo.fullName}
            </h1>
          )}
          <div className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1 text-xs text-gray-600">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
            {personalInfo.linkedIn && (
              <span className="text-blue-600">{personalInfo.linkedIn}</span>
            )}
            {personalInfo.website && <span>{personalInfo.website}</span>}
          </div>
        </header>

        {/* Summary */}
        {personalInfo.summary && (
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1">
              Professional Summary
            </h2>
            <p className="text-xs leading-relaxed text-gray-700">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1">
              Experience
            </h2>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{exp.position}</h3>
                      <p className="text-xs font-medium text-gray-700">
                        {exp.company}
                        {exp.location && ` — ${exp.location}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {exp.startDate}
                      {exp.startDate && exp.endDate && " — "}
                      {exp.current ? "Present" : exp.endDate}
                    </p>
                  </div>
                  {exp.bulletPoints.filter((b) => b.trim()).length > 0 && (
                    <ul className="mt-1.5 list-disc list-inside space-y-0.5">
                      {exp.bulletPoints.map(
                        (bullet, i) =>
                          bullet.trim() && (
                            <li key={i} className="text-xs leading-relaxed text-gray-700">
                              {bullet}
                            </li>
                          )
                      )}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        {education.length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1">
              Education
            </h2>
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-gray-900">{edu.institution}</h3>
                      <p className="text-xs text-gray-700">
                        {edu.degree}
                        {edu.field && ` in ${edu.field}`}
                        {edu.gpa && ` — GPA: ${edu.gpa}`}
                      </p>
                    </div>
                    <p className="text-xs text-gray-500 whitespace-nowrap ml-4">
                      {edu.startDate}
                      {edu.startDate && edu.endDate && " — "}
                      {edu.endDate}
                    </p>
                  </div>
                  {edu.description && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-600">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills */}
        {Object.keys(skillsByCategory).length > 0 && (
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-900 border-b border-gray-300 pb-1">
              Skills
            </h2>
            <div className="space-y-2">
              {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                <div key={category}>
                  <h3 className="text-xs font-medium text-gray-700">{category}</h3>
                  <p className="text-xs text-gray-600">{catSkills.map((s) => s.name).join(", ")}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
