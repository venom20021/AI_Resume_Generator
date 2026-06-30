"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useResume } from "@/lib/resume-context";
import { Plus, Trash2 } from "lucide-react";

export function EducationStep() {
  const { data, addEducation, updateEducation, removeEducation } = useResume();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Education</h2>
          <p className="text-sm text-muted-foreground">
            Add your educational background, from most recent first.
          </p>
        </div>
        <Button onClick={addEducation} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Education
        </Button>
      </div>

      {data.education.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No education entries yet. Click "Add Education" to get started.
          </p>
        </div>
      )}

      {data.education.map((edu, index) => (
        <div
          key={edu.id}
          className="relative rounded-lg border p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              #{index + 1}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => removeEducation(edu.id)}
              className="h-8 w-8 text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor={`institution-${edu.id}`}>Institution</Label>
              <Input
                id={`institution-${edu.id}`}
                placeholder="University of California, Berkeley"
                value={edu.institution}
                onChange={(e) =>
                  updateEducation(edu.id, "institution", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
              <Input
                id={`degree-${edu.id}`}
                placeholder="Bachelor of Science"
                value={edu.degree}
                onChange={(e) =>
                  updateEducation(edu.id, "degree", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
              <Input
                id={`field-${edu.id}`}
                placeholder="Computer Science"
                value={edu.field}
                onChange={(e) =>
                  updateEducation(edu.id, "field", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`startDate-edu-${edu.id}`}>Start Date</Label>
              <Input
                id={`startDate-edu-${edu.id}`}
                placeholder="Aug 2020"
                value={edu.startDate}
                onChange={(e) =>
                  updateEducation(edu.id, "startDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`endDate-edu-${edu.id}`}>End Date</Label>
              <Input
                id={`endDate-edu-${edu.id}`}
                placeholder="May 2024"
                value={edu.endDate}
                onChange={(e) =>
                  updateEducation(edu.id, "endDate", e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`gpa-${edu.id}`}>GPA (optional)</Label>
              <Input
                id={`gpa-${edu.id}`}
                placeholder="3.8"
                value={edu.gpa}
                onChange={(e) =>
                  updateEducation(edu.id, "gpa", e.target.value)
                }
              />
            </div>

            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor={`description-${edu.id}`}>
                Description (optional)
              </Label>
              <Textarea
                id={`description-${edu.id}`}
                placeholder="Relevant coursework, honors, activities..."
                className="min-h-[80px] resize-y"
                value={edu.description}
                onChange={(e) =>
                  updateEducation(edu.id, "description", e.target.value)
                }
              />
            </div>
          </div>
        </div>
      ))}

      {data.education.length > 0 && (
        <Button
          variant="outline"
          onClick={addEducation}
          className="w-full gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Another Education
        </Button>
      )}
    </div>
  );
}
