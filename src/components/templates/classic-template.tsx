"use client";

import type { ResumeData } from "@/lib/types";

interface TemplateProps {
  data: ResumeData;
}

export function ClassicTemplate({ data }: TemplateProps) {
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
    <div className="mx-auto max-w-[816px]">
      <div className="flex min-h-full">
        {/* Sidebar */}
        <div className="w-[200px] shrink-0 bg-slate-800 p-5 text-white flex flex-col gap-5">
          {/* Name & Title */}
          <div>
            {personalInfo.fullName && (
              <h1 className="text-base font-bold leading-tight">{personalInfo.fullName}</h1>
            )}
          </div>

          {/* Contact */}
          <div className="space-y-1.5">
            <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Contact
            </h2>
            <div className="space-y-1 text-[11px] text-slate-300">
              {personalInfo.email && <p>{personalInfo.email}</p>}
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
              {personalInfo.linkedIn && (
                <p className="text-blue-300">{personalInfo.linkedIn}</p>
              )}
              {personalInfo.website && <p>{personalInfo.website}</p>}
            </div>
          </div>

          {/* Skills */}
          {Object.keys(skillsByCategory).length > 0 && (
            <div className="space-y-2">
              <h2 className="text-[10px] font-semibold uppercase tracking-widest text-slate-400">
                Skills
              </h2>
              <div className="space-y-2">
                {Object.entries(skillsByCategory).map(([category, catSkills]) => (
                  <div key={category}>
                    <h3 className="text-[10px] font-medium text-slate-300 uppercase">
                      {category}
                    </h3>
                    <div className="mt-0.5 flex flex-wrap gap-1">
                      {catSkills.map((s, i) => (
                        <span
                          key={i}
                          className="text-[11px] text-slate-400"
                        >
                          {s.name}{i < catSkills.length - 1 ? "," : ""}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-white p-6 space-y-5">
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1">
                Professional Summary
              </h2>
              <p className="text-[11px] leading-relaxed text-slate-700">
                {personalInfo.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1">
                Experience
              </h2>
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">{exp.position}</h3>
                        <p className="text-[11px] font-medium text-slate-600">
                          {exp.company}
                          {exp.location && ` — ${exp.location}`}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 whitespace-nowrap ml-4">
                        {exp.startDate}
                        {exp.startDate && exp.endDate && " – "}
                        {exp.current ? "Present" : exp.endDate}
                      </p>
                    </div>
                    {exp.bulletPoints.filter((b) => b.trim()).length > 0 && (
                      <ul className="mt-1 list-disc list-inside space-y-0.5">
                        {exp.bulletPoints.map(
                          (bullet, i) =>
                            bullet.trim() && (
                              <li key={i} className="text-[11px] leading-relaxed text-slate-700">
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
              <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-800 border-b-2 border-slate-800 pb-1">
                Education
              </h2>
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold text-slate-800">{edu.institution}</h3>
                        <p className="text-[11px] text-slate-600">
                          {edu.degree}
                          {edu.field && ` in ${edu.field}`}
                          {edu.gpa && ` — GPA: ${edu.gpa}`}
                        </p>
                      </div>
                      <p className="text-[10px] text-slate-500 whitespace-nowrap ml-4">
                        {edu.startDate}
                        {edu.startDate && edu.endDate && " – "}
                        {edu.endDate}
                      </p>
                    </div>
                    {edu.description && (
                      <p className="mt-0.5 text-[11px] leading-relaxed text-slate-600">
                        {edu.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
