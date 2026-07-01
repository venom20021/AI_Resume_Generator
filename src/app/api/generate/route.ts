import { generateText } from "ai";
import { google } from "@ai-sdk/google";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { type, current, context } = await req.json();

    if (!type || !current) {
      return Response.json(
        { error: "Missing required fields: type, current" },
        { status: 400 }
      );
    }

    const systemPrompt =
      "You are an expert resume writer and career coach. You help professionals " +
      "craft compelling, ATS-friendly resume content. Your writing is concise, " +
      "impactful, and quantifiable. You use strong action verbs and focus on " +
      "achievements rather than responsibilities. Never use first-person pronouns.";

    let userPrompt = "";

    switch (type) {
      case "summary": {
        userPrompt =
          "Improve the following professional summary for a resume. Make it more impactful, concise, and ATS-friendly. Keep it to 3-4 sentences.\n\nCurrent summary: \"" +
          current +
          "\"\n" +
          (context?.skills ? "Relevant skills: " + context.skills : "") +
          "\n" +
          (context?.name ? "Name: " + context.name : "") +
          "\n\nRespond with ONLY the improved summary text. Do not include any explanations or markdown.";
        break;
      }
      case "bullet": {
        userPrompt =
          "Improve the following resume bullet point to be more impactful and achievement-oriented. Use strong action verbs and include quantifiable results where possible.\n\nCurrent bullet point: \"" +
          current +
          "\"\n\nRespond with ONLY the improved bullet point text. Do not include any explanations or markdown.";
        break;
      }
      case "skills": {
        const existingContext =
          context?.existingSkills || "No skills listed yet.";
        userPrompt =
          'Based on the user\'s description of "' +
          current +
          '" and their existing skills (' +
          existingContext +
          "), suggest relevant technical and professional skills to add to their resume.\n\nRespond with a JSON array of skill objects, each with \"name\", \"category\" (one of: Languages, Frameworks & Libraries, Databases, Tools & Platforms, Soft Skills, Other), and \"level\" (one of: beginner, intermediate, advanced, expert).\n\nFormat: [{ \"name\": \"React\", \"category\": \"Frameworks & Libraries\", \"level\": \"advanced\" }]\nRespond with ONLY the JSON array, no other text.";
        break;
      }
      case "optimize": {
        const resume = context?.resume;
        if (!resume) {
          return Response.json(
            { error: "No resume data provided for optimization" },
            { status: 400 }
          );
        }
        const summaryText = resume.personalInfo?.summary || "No summary provided.";
        const experienceText =
          resume.experience && resume.experience.length > 0
            ? resume.experience
                .map(
                  (exp: { position: string; company: string; bulletPoints: string[] }) =>
                    "  - " +
                    exp.position +
                    " at " +
                    exp.company +
                    "\n    Bullets: " +
                    (exp.bulletPoints?.filter((b: string) => b.trim()).join("; ") ||
                      "None")
                )
                .join("\n")
            : "No experience listed.";
        const skillsText =
          resume.skills && resume.skills.length > 0
            ? resume.skills.map((s: { name: string }) => s.name).join(", ")
            : "None";

        userPrompt =
          "I have the following resume and a job description. Rewrite the resume to be optimized for this specific job. " +
          "Tailor the professional summary, bullet points, and skills to match the job requirements. " +
          "Use keywords from the job description. Keep all factual information intact (company names, dates, positions). " +
          "Add relevant missing skills to the skills list based on the job description.\n\n" +
          "Job Description:\n" +
          current +
          "\n\n" +
          "Current Resume:\n" +
          "Professional Summary: " +
          summaryText +
          "\n\n" +
          "Experience:\n" +
          experienceText +
          "\n\n" +
          "Skills: " +
          skillsText +
          "\n\n" +
          "Respond with a JSON object in the following format (and ONLY the JSON, no other text):\n" +
          JSON.stringify({
            personalInfo: {
              summary: "rewritten summary here",
            },
            experience: [
              {
                id: "keep-original-id",
                bulletPoints: ["rewritten bullet 1", "rewritten bullet 2"],
              },
            ],
            skills: [
              { name: "Skill1", category: "Category", level: "advanced" },
            ],
          }) +
          "\n\n" +
          "IMPORTANT RULES:\n" +
          "1. Return ONLY a JSON object with keys: personalInfo (only summary field), experience (array with id and bulletPoints), and skills (array of {name, category, level}).\n" +
          "2. Each experience entry must include its original 'id' field so I can match it.\n" +
          "3. Skills that already exist should be kept, new ones from the JD should be added.\n" +
          "4. Keep bullet points factual but rewrite them to highlight achievements relevant to the job.\n" +
          "5. Do not fabricate experience or companies that don't exist.";
        break;
      }
      default: {
        return Response.json({ error: "Invalid type" }, { status: 400 });
      }
    }

    const { text } = await generateText({
      model: google("gemini-2.0-flash"),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
    });

    // For skills, parse the JSON response
    if (type === "skills") {
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const skills = JSON.parse(jsonMatch[0]);
          return Response.json({ skills });
        }
        return Response.json({ skills: JSON.parse(text) });
      } catch {
        return Response.json({ skills: [] });
      }
    }

    // For optimize, parse the full JSON response into resume data
    if (type === "optimize") {
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const optimized = JSON.parse(jsonMatch[0]);
          return Response.json({ resume: optimized });
        }
        return Response.json({ resume: JSON.parse(text) });
      } catch {
        return Response.json({
          error: "Failed to parse optimized resume from AI response",
        });
      }
    }

    return Response.json({ text: text.trim() });
  } catch (error) {
    console.error("AI generation error:", error);
    return Response.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
