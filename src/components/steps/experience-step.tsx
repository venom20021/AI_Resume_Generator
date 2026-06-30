"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResume } from "@/lib/resume-context";
import { Plus, Trash2, Sparkles, Loader2, X } from "lucide-react";
import { useState } from "react";

function BulletPointInput({
  value,
  index,
  expId,
  onChange,
  onRemove,
}: {
  value: string;
  index: number;
  expId: string;
  onChange: (value: string) => void;
  onRemove: () => void;
}) {
  const [isImproving, setIsImproving] = useState(false);

  const improveBullet = async () => {
    if (!value.trim()) return;
    setIsImproving(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "bullet",
          current: value,
          context: {},
        }),
      });
      const json = await res.json();
      if (json.text) {
        onChange(json.text);
      }
    } catch (error) {
      console.error("Failed to improve bullet point:", error);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="flex gap-2 items-start">
      <Textarea
        placeholder="Describe an accomplishment or responsibility..."
        className="min-h-[60px] resize-y text-sm flex-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="flex flex-col gap-1 shrink-0">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={improveBullet}
          disabled={isImproving || !value.trim()}
          className="h-8 w-8"
          title="Improve with AI"
        >
          {isImproving ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Sparkles className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onRemove}
          className="h-8 w-8 text-destructive hover:text-destructive"
          title="Remove bullet point"
        >
          <X className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

export function ExperienceStep() {
  const { data, addExperience, updateExperience, removeExperience, updateBulletPoints } =
    useResume();

  const addBulletPoint = (expId: string) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (exp) {
      updateBulletPoints(expId, [...exp.bulletPoints, ""]);
    }
  };

  const updateBullet = (expId: string, index: number, value: string) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (exp) {
      const updated = [...exp.bulletPoints];
      updated[index] = value;
      updateBulletPoints(expId, updated);
    }
  };

  const removeBullet = (expId: string, index: number) => {
    const exp = data.experience.find((e) => e.id === expId);
    if (exp && exp.bulletPoints.length > 1) {
      const updated = exp.bulletPoints.filter((_, i) => i !== index);
      updateBulletPoints(expId, updated);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Experience</h2>
          <p className="text-sm text-muted-foreground">
            Add your work experience, from most recent first.
          </p>
        </div>
        <Button onClick={addExperience} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Experience
        </Button>
      </div>

      {data.experience.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No experience entries yet. Click "Add Experience" to get started.
          </p>
        </div>
      )}

      {data.experience.map((exp, index) => (
        <div key={exp.id} className="relative rounded-lg border p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              #{index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeExperience(exp.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor={`company-${exp.id}`}>Company</Label>
              <Input
                id={`company-${exp.id}`}
                placeholder="Acme Corp"
                value={exp.company}
                onChange={(e) =>
                  updateExperience(exp.id, "company", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`position-${exp.id}`}>Position</Label>
              <Input
                id={`position-${exp.id}`}
                placeholder="Senior Software Engineer"
                value={exp.position}
                onChange={(e) =>
                  updateExperience(exp.id, "position", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`location-exp-${exp.id}`}>Location</Label>
              <Input
                id={`location-exp-${exp.id}`}
                placeholder="San Francisco, CA"
                value={exp.location}
                onChange={(e) =>
                  updateExperience(exp.id, "location", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-exp-${exp.id}`}>Start Date</Label>
              <Input
                id={`startDate-exp-${exp.id}`}
                placeholder="Jan 2022"
                value={exp.startDate}
                onChange={(e) =>
                  updateExperience(exp.id, "startDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-exp-${exp.id}`}>End Date</Label>
              <div className="flex items-center gap-3">
                <Input
                  id={`endDate-exp-${exp.id}`}
                  placeholder="Present"
                  value={exp.endDate}
                  disabled={exp.current}
                  onChange={(e) =>
                    updateExperience(exp.id, "endDate", e.target.value)
                  }
                  className={exp.current ? "opacity-50" : ""}
                />
                <label className="flex items-center gap-1.5 text-sm whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={exp.current}
                    onChange={(e) =>
                      updateExperience(exp.id, "current", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  Current
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">Bullet Points</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => addBulletPoint(exp.id)}
                className="gap-1 text-xs"
              >
                <Plus className="h-3 w-3" />
                Add Bullet
              </Button>
            </div>

            {exp.bulletPoints.map((bullet, bIndex) => (
              <BulletPointInput
                key={bIndex}
                value={bullet}
                index={bIndex}
                expId={exp.id}
                onChange={(value) => updateBullet(exp.id, bIndex, value)}
                onRemove={() => removeBullet(exp.id, bIndex)}
              />
            ))}
          </div>
        </div>
      ))}

      {data.experience.length > 0 && (
        <Button
          variant="outline"
          onClick={addExperience}
          className="w-full gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Another Experience
        </Button>
      )}
    </div>
  );
}
