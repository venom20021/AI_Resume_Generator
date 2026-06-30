import { NextRequest } from "next/server";
import ReactPDF, { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";

// Node.js runtime required for @react-pdf/renderer (uses fs, Buffer)
export const runtime = "nodejs";

export const maxDuration = 30;
export const dynamic = "force-dynamic";

const modernStyles = StyleSheet.create({
  page: {
    padding: 48,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#1a1a1a",
  },
  header: {
    textAlign: "center",
    marginBottom: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    justifyContent: "center" as const,
    gap: 4,
    fontSize: 9,
    color: "#4a4a4a",
  },
  contactItem: {
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    borderBottomWidth: 1,
    borderBottomColor: "#cccccc",
    paddingBottom: 3,
    marginBottom: 8,
    marginTop: 14,
  },
  summaryText: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333333",
  },
  experienceBlock: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: "bold",
  },
  expCompany: {
    fontSize: 10,
    fontWeight: "medium" as const,
    color: "#4a4a4a",
    marginTop: 1,
  },
  expDate: {
    fontSize: 9,
    color: "#666666",
  },
  bulletList: {
    marginTop: 3,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.5,
    color: "#333333",
    marginBottom: 1,
    paddingLeft: 14,
  },
  eduBlock: {
    marginBottom: 8,
  },
  eduHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  eduInstitution: {
    fontSize: 11,
    fontWeight: "bold",
  },
  eduDegree: {
    fontSize: 10,
    color: "#4a4a4a",
    marginTop: 1,
  },
  eduDate: {
    fontSize: 9,
    color: "#666666",
  },
  eduDescription: {
    fontSize: 10,
    color: "#4a4a4a",
    marginTop: 2,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCatTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },
  skillList: {
    fontSize: 10,
    color: "#4a4a4a",
  },
});

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedIn: string;
  website: string;
  summary: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bulletPoints: string[];
}

interface Skill {
  id: string;
  name: string;
  level: string;
  category: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
}

const classicStyles = StyleSheet.create({
  page: {
    flexDirection: "row" as const,
  },
  sidebar: {
    width: 180,
    backgroundColor: "#1e293b",
    padding: 24,
    paddingTop: 40,
  },
  sidebarName: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 20,
  },
  sidebarSectionTitle: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    color: "#94a3b8",
    marginBottom: 6,
    marginTop: 14,
  },
  sidebarText: {
    fontSize: 9,
    color: "#cbd5e1",
    marginBottom: 2,
  },
  sidebarSkillCat: {
    fontSize: 8,
    fontWeight: "bold",
    color: "#94a3b8",
    textTransform: "uppercase" as const,
    marginTop: 8,
    marginBottom: 2,
  },
  sidebarSkill: {
    fontSize: 9,
    color: "#94a3b8",
    marginBottom: 1,
  },
  main: {
    flex: 1,
    padding: 28,
    paddingTop: 40,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: "bold",
    textTransform: "uppercase" as const,
    letterSpacing: 1.5,
    borderBottomWidth: 2,
    borderBottomColor: "#1e293b",
    paddingBottom: 3,
    marginBottom: 8,
    marginTop: 14,
    color: "#1e293b",
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#475569",
  },
  experienceBlock: {
    marginBottom: 10,
  },
  expHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "flex-start" as const,
  },
  expTitle: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
  },
  expCompany: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 1,
  },
  expDate: {
    fontSize: 8,
    color: "#94a3b8",
  },
  bulletList: {
    marginTop: 2,
  },
  bullet: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#475569",
    marginBottom: 1,
    paddingLeft: 14,
  },
  eduBlock: {
    marginBottom: 8,
  },
  eduHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
  },
  eduInstitution: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#1e293b",
  },
  eduDegree: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 1,
  },
  eduDate: {
    fontSize: 8,
    color: "#94a3b8",
  },
  eduDescription: {
    fontSize: 9,
    color: "#64748b",
    marginTop: 2,
  },
  skillCategory: {
    marginBottom: 6,
  },
  skillCatTitle: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 2,
  },
  skillList: {
    fontSize: 9,
    color: "#475569",
  },
});

const minimalStyles = StyleSheet.create({
  page: {
    padding: 56,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#404040",
  },
  header: {
    marginBottom: 28,
  },
  name: {
    fontSize: 18,
    fontWeight: "light",
    letterSpacing: 1,
    color: "#262626",
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row" as const,
    flexWrap: "wrap" as const,
    gap: 4,
    fontSize: 9,
    color: "#a3a3a3",
  },
  contactItem: {
    marginHorizontal: 4,
  },
  sectionTitle: {
    fontSize: 8,
    fontWeight: "medium",
    textTransform: "uppercase" as const,
    letterSpacing: 3,
    color: "#d4d4d4",
    marginBottom: 10,
    marginTop: 18,
  },
  summaryText: {
    fontSize: 11,
    lineHeight: 1.6,
    color: "#525252",
  },
  experienceBlock: {
    marginBottom: 14,
  },
  expHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "baseline" as const,
  },
  expTitle: {
    fontSize: 11,
    fontWeight: "medium",
    color: "#262626",
  },
  expCompany: {
    fontSize: 10,
    color: "#737373",
    marginTop: 1,
  },
  expDate: {
    fontSize: 9,
    color: "#d4d4d4",
  },
  bulletList: {
    marginTop: 4,
  },
  bullet: {
    fontSize: 10,
    lineHeight: 1.6,
    color: "#525252",
    marginBottom: 2,
    borderLeftWidth: 1,
    borderLeftColor: "#e5e5e5",
    paddingLeft: 12,
  },
  eduBlock: {
    marginBottom: 10,
  },
  eduHeader: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "baseline" as const,
  },
  eduInstitution: {
    fontSize: 11,
    fontWeight: "medium",
    color: "#262626",
  },
  eduDegree: {
    fontSize: 10,
    color: "#737373",
    marginTop: 1,
  },
  eduDate: {
    fontSize: 9,
    color: "#d4d4d4",
  },
  eduDescription: {
    fontSize: 10,
    color: "#737373",
    marginTop: 2,
    borderLeftWidth: 1,
    borderLeftColor: "#e5e5e5",
    paddingLeft: 12,
  },
  skillCategory: {
    flexDirection: "row" as const,
    alignItems: "baseline" as const,
    marginBottom: 4,
  },
  skillCatTitle: {
    fontSize: 10,
    color: "#a3a3a3",
    width: 100,
  },
  skillList: {
    fontSize: 10,
    color: "#525252",
    flex: 1,
  },
});

function ModernDocument({ data, styles }: { data: ResumeData; styles: typeof modernStyles }) {
  const { personalInfo, education, experience, skills } = data;

  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach((skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <View>
      {personalInfo.fullName && (
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.fullName}</Text>
          <View style={styles.contactRow}>
            {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
            {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
            {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
            {personalInfo.linkedIn && <Text style={styles.contactItem}>{personalInfo.linkedIn}</Text>}
            {personalInfo.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
          </View>
        </View>
      )}
      {personalInfo.summary && (
        <View>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.summaryText}>{personalInfo.summary}</Text>
        </View>
      )}
      {experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.experienceBlock}>
              <View style={styles.expHeader}>
                <View>
                  <Text style={styles.expTitle}>{exp.position}</Text>
                  <Text style={styles.expCompany}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</Text>
                </View>
                <Text style={styles.expDate}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) && " – "}{exp.current ? "Present" : exp.endDate}</Text>
              </View>
              {exp.bulletPoints.filter((b) => b.trim()).length > 0 && (
                <View style={styles.bulletList}>
                  {exp.bulletPoints.map((bullet, i) => bullet.trim() && <Text key={i} style={styles.bullet}>{"\u2022"} {bullet}</Text>)}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      {education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.eduBlock}>
              <View style={styles.eduHeader}>
                <View>
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
                  <Text style={styles.eduDegree}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` — GPA: ${edu.gpa}` : ""}</Text>
                </View>
                <Text style={styles.eduDate}>{edu.startDate}{edu.startDate && edu.endDate && " – "}{edu.endDate}</Text>
              </View>
              {edu.description && <Text style={styles.eduDescription}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}
      {Object.keys(skillsByCategory).length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          {Object.entries(skillsByCategory).map(([category, catSkills]) => (
            <View key={category} style={styles.skillCategory}>
              <Text style={styles.skillCatTitle}>{category}</Text>
              <Text style={styles.skillList}>{catSkills.join(", ")}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ClassicDocument({ data }: { data: ResumeData }) {
  const { personalInfo, education, experience, skills } = data;
  const s = classicStyles;

  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach((skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <View style={s.page}>
      {/* Sidebar */}
      <View style={s.sidebar}>
        {personalInfo.fullName && <Text style={s.sidebarName}>{personalInfo.fullName}</Text>}
        <View>
          <Text style={s.sidebarSectionTitle}>Contact</Text>
          {personalInfo.email && <Text style={s.sidebarText}>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text style={s.sidebarText}>{personalInfo.phone}</Text>}
          {personalInfo.location && <Text style={s.sidebarText}>{personalInfo.location}</Text>}
          {personalInfo.linkedIn && <Text style={s.sidebarText}>{personalInfo.linkedIn}</Text>}
          {personalInfo.website && <Text style={s.sidebarText}>{personalInfo.website}</Text>}
        </View>
        {Object.keys(skillsByCategory).length > 0 && (
          <View>
            <Text style={s.sidebarSectionTitle}>Skills</Text>
            {Object.entries(skillsByCategory).map(([category, catSkills]) => (
              <View key={category}>
                <Text style={s.sidebarSkillCat}>{category}</Text>
                {catSkills.map((sk, i) => <Text key={i} style={s.sidebarSkill}>{sk}</Text>)}
              </View>
            ))}
          </View>
        )}
      </View>
      {/* Main */}
      <View style={s.main}>
        {personalInfo.summary && (
          <View>
            <Text style={s.sectionTitle}>Professional Summary</Text>
            <Text style={s.summaryText}>{personalInfo.summary}</Text>
          </View>
        )}
        {experience.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Experience</Text>
            {experience.map((exp) => (
              <View key={exp.id} style={s.experienceBlock}>
                <View style={s.expHeader}>
                  <View>
                    <Text style={s.expTitle}>{exp.position}</Text>
                    <Text style={s.expCompany}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</Text>
                  </View>
                  <Text style={s.expDate}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) && " – "}{exp.current ? "Present" : exp.endDate}</Text>
                </View>
                {exp.bulletPoints.filter((b) => b.trim()).length > 0 && (
                  <View style={s.bulletList}>
                    {exp.bulletPoints.map((bullet, i) => bullet.trim() && <Text key={i} style={s.bullet}>{"\u2022"} {bullet}</Text>)}
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        {education.length > 0 && (
          <View>
            <Text style={s.sectionTitle}>Education</Text>
            {education.map((edu) => (
              <View key={edu.id} style={s.eduBlock}>
                <View style={s.eduHeader}>
                  <View>
                    <Text style={s.eduInstitution}>{edu.institution}</Text>
                    <Text style={s.eduDegree}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` — GPA: ${edu.gpa}` : ""}</Text>
                  </View>
                  <Text style={s.eduDate}>{edu.startDate}{edu.startDate && edu.endDate && " – "}{edu.endDate}</Text>
                </View>
                {edu.description && <Text style={s.eduDescription}>{edu.description}</Text>}
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

function MinimalDocument({ data, styles }: { data: ResumeData; styles: typeof minimalStyles }) {
  const { personalInfo, education, experience, skills } = data;

  const skillsByCategory: Record<string, string[]> = {};
  skills.forEach((skill) => {
    if (!skillsByCategory[skill.category]) {
      skillsByCategory[skill.category] = [];
    }
    skillsByCategory[skill.category].push(skill.name);
  });

  return (
    <View>
      <View style={styles.header}>
        {personalInfo.fullName && <Text style={styles.name}>{personalInfo.fullName}</Text>}
        <View style={styles.contactRow}>
          {personalInfo.email && <Text style={styles.contactItem}>{personalInfo.email}</Text>}
          {personalInfo.phone && <Text style={styles.contactItem}>{personalInfo.phone}</Text>}
          {personalInfo.location && <Text style={styles.contactItem}>{personalInfo.location}</Text>}
          {personalInfo.linkedIn && <Text style={styles.contactItem}>{personalInfo.linkedIn}</Text>}
          {personalInfo.website && <Text style={styles.contactItem}>{personalInfo.website}</Text>}
        </View>
      </View>
      {personalInfo.summary && (
        <View>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.summaryText}>{personalInfo.summary}</Text>
        </View>
      )}
      {experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
          {experience.map((exp) => (
            <View key={exp.id} style={styles.experienceBlock}>
              <View style={styles.expHeader}>
                <View>
                  <Text style={styles.expTitle}>{exp.position}</Text>
                  <Text style={styles.expCompany}>{exp.company}{exp.location ? ` — ${exp.location}` : ""}</Text>
                </View>
                <Text style={styles.expDate}>{exp.startDate}{exp.startDate && (exp.endDate || exp.current) && " — "}{exp.current ? "Present" : exp.endDate}</Text>
              </View>
              {exp.bulletPoints.filter((b) => b.trim()).length > 0 && (
                <View style={styles.bulletList}>
                  {exp.bulletPoints.map((bullet, i) => bullet.trim() && <Text key={i} style={styles.bullet}>{bullet}</Text>)}
                </View>
              )}
            </View>
          ))}
        </View>
      )}
      {education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Education</Text>
          {education.map((edu) => (
            <View key={edu.id} style={styles.eduBlock}>
              <View style={styles.eduHeader}>
                <View>
                  <Text style={styles.eduInstitution}>{edu.institution}</Text>
                  <Text style={styles.eduDegree}>{edu.degree}{edu.field ? ` in ${edu.field}` : ""}{edu.gpa ? ` — GPA: ${edu.gpa}` : ""}</Text>
                </View>
                <Text style={styles.eduDate}>{edu.startDate}{edu.startDate && edu.endDate && " — "}{edu.endDate}</Text>
              </View>
              {edu.description && <Text style={styles.eduDescription}>{edu.description}</Text>}
            </View>
          ))}
        </View>
      )}
      {Object.keys(skillsByCategory).length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
          {Object.entries(skillsByCategory).map(([category, catSkills]) => (
            <View key={category} style={styles.skillCategory}>
              <Text style={styles.skillCatTitle}>{category}</Text>
              <Text style={styles.skillList}>{catSkills.join(", ")}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

function ResumeDocument({ data, template }: { data: ResumeData; template: string }) {
  let pageStyle;
  let content: React.ReactNode;

  if (template === "classic") {
    pageStyle = { flexDirection: "row" as const };
    content = <ClassicDocument data={data} />;
  } else if (template === "minimal") {
    pageStyle = minimalStyles.page;
    content = <MinimalDocument data={data} styles={minimalStyles} />;
  } else {
    pageStyle = modernStyles.page;
    content = <ModernDocument data={data} styles={modernStyles} />;
  }

  return (
    <Document>
      <Page size="LETTER" style={pageStyle}>
        {content}
      </Page>
    </Document>
  );
}

export async function POST(req: NextRequest) {
  try {
    const { template: reqTemplate, ...body } = await req.json();
    const data: ResumeData = body;
    const template = reqTemplate || "modern";

    if (!data) {
      return new Response(JSON.stringify({ error: "No data provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const buffer = await ReactPDF.renderToBuffer(<ResumeDocument data={data} template={template} />);

    const filename = `resume-${
      data.personalInfo.fullName?.trim()?.replace(/\s+/g, "-").toLowerCase() ||
      "untitled"
    }.pdf`;

    // Convert Buffer to Uint8Array for Response compatibility
    const uint8Array = new Uint8Array(buffer);
    return new Response(uint8Array, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to generate PDF" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
