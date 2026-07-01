"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useResume } from "@/lib/resume-context";
import { SKILL_CATEGORIES, SKILL_LEVELS } from "@/lib/types";
import { Plus, Trash2, Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SkillsStep() {
  const { data, addSkill, updateSkill, removeSkill, addSkillsBulk } =
    useResume();
  const [suggestion, setSuggestion] = useState("");
  const [isSuggesting, setIsSuggesting] = useState(false);

  const suggestSkills = async () => {
    if (!suggestion.trim()) return;
    setIsSuggesting(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "skills",
          current: suggestion,
          context: {
            existingSkills: data.skills.map((s) => s.name).join(", "),
          },
        }),
      });
      const json = await res.json();
      if (json.skills && Array.isArray(json.skills) && json.skills.length > 0) {
        addSkillsBulk(json.skills);
        setSuggestion("");
        toast.success(`Added ${json.skills.length} suggested skills`);
      } else {
        toast.error("No skills could be generated. Try a different description.");
      }
    } catch (error) {
      console.error("Failed to suggest skills:", error);
      toast.error("Failed to get AI suggestions. Check your API key or try again.");
    } finally {
      setIsSuggesting(false);
    }
  };

  const levelColor = (level: string) => {
    switch (level) {
      case "expert":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400";
      case "advanced":
        return "bg-blue-500/10 text-blue-600 dark:text-blue-400";
      case "intermediate":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400";
      case "beginner":
        return "bg-gray-500/10 text-gray-600 dark:text-gray-400";
      default:
        return "";
    }
  };

  // Group skills by category
  const groupedSkills = SKILL_CATEGORIES.map((cat) => ({
    category: cat,
    skills: data.skills.filter((s) => s.category === cat),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Skills</h2>
          <p className="text-sm text-muted-foreground">
            Add your technical and professional skills.
          </p>
        </div>
        <Button onClick={addSkill} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      {/* AI Skill Suggestion */}
      <div className="rounded-lg border bg-muted/20 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">AI Skill Suggestions</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Describe a role, project, or technology stack and the AI will suggest
          relevant skills to add.
        </p>
        <div className="flex gap-2">
          <Input
            placeholder="e.g., Full-stack web developer with React, Node.js, and AWS"
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !isSuggesting) suggestSkills();
            }}
          />
          <Button
            onClick={suggestSkills}
            disabled={isSuggesting || !suggestion.trim()}
            className="gap-1.5 shrink-0"
          >
            {isSuggesting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4" />
            )}
            Suggest
          </Button>
        </div>
      </div>

      {data.skills.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No skills added yet. Use AI suggestions above or click {'\u201C'}Add Skill{'\u201D'}
            to get started.
          </p>
        </div>
      )}

      {/* Skills grouped by category */}
      {groupedSkills.map(
        (group) =>
          group.skills.length > 0 && (
            <div key={group.category} className="space-y-2">
              <h3 className="text-sm font-medium text-muted-foreground">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge
                    key={skill.id}
                    variant="secondary"
                    className={levelColor(skill.level)}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
          )
      )}

      {/* Skill input list */}
      <div className="space-y-3">
        {data.skills.map((skill) => (
          <div
            key={skill.id}
            className="flex flex-wrap items-end gap-3 rounded-lg border p-3"
          >
            <div className="flex-1 space-y-1.5 min-w-[160px]">
              <Label
                htmlFor={`skill-name-${skill.id}`}
                className="text-xs text-muted-foreground"
              >
                Skill Name
              </Label>
              <Input
                id={`skill-name-${skill.id}`}
                placeholder="React, Python, AWS..."
                value={skill.name}
                onChange={(e) => updateSkill(skill.id, "name", e.target.value)}
              />
            </div>

            <div className="space-y-1.5 min-w-[140px]">
              <Label
                htmlFor={`skill-category-${skill.id}`}
                className="text-xs text-muted-foreground"
              >
                Category
              </Label>
              <select
                id={`skill-category-${skill.id}`}
                value={skill.category}
                onChange={(e) =>
                  updateSkill(skill.id, "category", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {SKILL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5 min-w-[120px]">
              <Label
                htmlFor={`skill-level-${skill.id}`}
                className="text-xs text-muted-foreground"
              >
                Level
              </Label>
              <select
                id={`skill-level-${skill.id}`}
                value={skill.level}
                onChange={(e) =>
                  updateSkill(skill.id, "level", e.target.value)
                }
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {SKILL_LEVELS.map((lv) => (
                  <option key={lv.value} value={lv.value}>
                    {lv.label}
                  </option>
                ))}
              </select>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeSkill(skill.id)}
              className="h-9 w-9 text-destructive hover:text-destructive shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
