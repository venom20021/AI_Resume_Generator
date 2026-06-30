"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useResume } from "@/lib/resume-context";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";

export function PersonalInfoStep() {
  const { data, updatePersonalInfo } = useResume();
  const [isImproving, setIsImproving] = useState(false);

  const improveSummary = async () => {
    if (!data.personalInfo.summary.trim()) return;
    setIsImproving(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "summary",
          current: data.personalInfo.summary,
          context: {
            name: data.personalInfo.fullName,
            skills: data.skills.map((s) => s.name).join(", "),
          },
        }),
      });
      const json = await res.json();
      if (json.text) {
        updatePersonalInfo("summary", json.text);
      }
    } catch (error) {
      console.error("Failed to improve summary:", error);
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Personal Information</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about yourself to start building your resume.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            placeholder="Jane Doe"
            value={data.personalInfo.fullName}
            onChange={(e) => updatePersonalInfo("fullName", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="jane@example.com"
            value={data.personalInfo.email}
            onChange={(e) => updatePersonalInfo("email", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            placeholder="+1 (555) 000-0000"
            value={data.personalInfo.phone}
            onChange={(e) => updatePersonalInfo("phone", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            placeholder="San Francisco, CA"
            value={data.personalInfo.location}
            onChange={(e) => updatePersonalInfo("location", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="linkedIn">LinkedIn URL</Label>
          <Input
            id="linkedIn"
            placeholder="linkedin.com/in/janedoe"
            value={data.personalInfo.linkedIn}
            onChange={(e) => updatePersonalInfo("linkedIn", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <Label htmlFor="website">Portfolio / Website</Label>
          <Input
            id="website"
            placeholder="janedoe.dev"
            value={data.personalInfo.website}
            onChange={(e) => updatePersonalInfo("website", e.target.value)}
          />
        </div>

        <div className="sm:col-span-2 space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="summary">Professional Summary</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={improveSummary}
              disabled={isImproving || !data.personalInfo.summary.trim()}
              className="gap-1.5 text-xs"
            >
              {isImproving ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Sparkles className="h-3.5 w-3.5" />
              )}
              Improve with AI
            </Button>
          </div>
          <Textarea
            id="summary"
            placeholder="Write a brief professional summary highlighting your key qualifications and career objectives..."
            className="min-h-[120px] resize-y"
            value={data.personalInfo.summary}
            onChange={(e) => updatePersonalInfo("summary", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
