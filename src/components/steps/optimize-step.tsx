"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useResume } from "@/lib/resume-context";
import {
  Plus,
  Trash2,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  History,
  RotateCcw,
  Clock,
  Bookmark,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";

export function OptimizeStep() {
  const {
    data,
    updateJobDescription,
    addJobDescription,
    addJobDescriptionWithValue,
    removeJobDescription,
    importData,
    resumeHistory,
    jdHistory,
    saveResumeSnapshot,
    restoreResumeSnapshot,
    deleteResumeSnapshot,
    addToJdHistory,
    removeFromJdHistory,
  } = useResume();
  const [optimizingIndex, setOptimizingIndex] = useState<number | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingRetryIndex = useRef<number | null>(null);

  // Cleanup retry timer on unmount
  useEffect(() => {
    return () => {
      if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
    };
  }, []);

  const hasResumeContent =
    data.personalInfo.fullName ||
    data.experience.length > 0 ||
    data.education.length > 0;

  // ── Retry countdown logic ──────────────────────────────────────

  const startRetryCountdown = (index: number, delaySeconds: number) => {
    pendingRetryIndex.current = index;
    setRetryCountdown(delaySeconds);

    // Use a simple counter that decrements each second
    // (avoids Date.now() entirely to satisfy the strict lint rule)
    let remaining = delaySeconds;

    const tick = () => {
      remaining -= 1;
      if (remaining <= 0) {
        setRetryCountdown(null);
        if (pendingRetryIndex.current !== null) {
          const idx = pendingRetryIndex.current;
          pendingRetryIndex.current = null;
          optimizeForJob(idx);
        }
      } else {
        setRetryCountdown(remaining);
        retryTimerRef.current = setTimeout(tick, 1000);
      }
    };

    retryTimerRef.current = setTimeout(tick, 1000);
  };

  // ── Optimize logic ─────────────────────────────────────────────

  const optimizeForJob = async (index: number) => {
    const jd = data.jobDescriptions[index];
    if (!jd.trim()) {
      toast.error("Please paste a job description first.");
      return;
    }
    if (!hasResumeContent) {
      toast.error("Fill in your resume details before optimizing.");
      return;
    }

    setOptimizingIndex(index);

    // Save a snapshot before making changes
    const snapshotLabel =
      "Before: " + jd.slice(0, 50) + (jd.length > 50 ? "..." : "");
    saveResumeSnapshot(snapshotLabel);

    // Save JD to history
    addToJdHistory(jd);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "optimize",
          current: jd,
          context: { resume: data },
        }),
      });

      // Check if it's a quota/rate-limit error (429) with retry info
      if (res.status === 429) {
        let delay = 30; // default fallback
        try {
          const body = await res.json();
          // Try to extract retry delay from the error body
          const match = body.error?.match(/retry in (\d+(?:\.\d+)?)s/i);
          if (match) {
            delay = Math.ceil(parseFloat(match[1]));
          }
        } catch {
          // ignore parse errors
        }
        toast.info(
          `API rate limit reached. Auto-retrying in ${delay}s...`
        );
        setOptimizingIndex(null);
        startRetryCountdown(index, delay);
        return;
      }

      const json = await res.json();
      if (json.error) {
        toast.error(json.error);
        setOptimizingIndex(null);
        return;
      }
      if (json.resume) {
        const optimized = json.resume;
        // Merge optimized fields into existing data to avoid data loss
        const merged = {
          ...data,
          personalInfo: {
            ...data.personalInfo,
            ...(optimized.personalInfo || {}),
          },
          experience: data.experience.map((exp) => {
            const optExp = optimized.experience?.find(
              (o: { id: string }) => o.id === exp.id
            );
            return optExp
              ? { ...exp, bulletPoints: optExp.bulletPoints || exp.bulletPoints }
              : exp;
          }),
          skills: optimized.skills || data.skills,
        };
        importData(merged);
        toast.success("Resume optimized for this job description!");
      } else {
        toast.error("Failed to optimize resume. Try again.");
      }
    } catch {
      // Network error or other fetch failure
      toast.error("Failed to optimize resume. Check your API key or try again.");
    } finally {
      if (pendingRetryIndex.current === null) {
        setOptimizingIndex(null);
      }
    }
  };

  // ── History: restore a snapshot ────────────────────────────────

  const handleRestoreSnapshot = (id: string) => {
    const snapshot = resumeHistory.find((s) => s.id === id);
    if (!snapshot) return;
    // Save current state first so they can go back
    saveResumeSnapshot("Before restoring: " + snapshot.label);
    restoreResumeSnapshot(id);
    toast.success(`Restored snapshot: ${snapshot.label}`);
  };

  // ── History: load a saved JD ───────────────────────────────────

  const handleLoadJd = (entryId: string) => {
    const entry = jdHistory.find((e) => e.id === entryId);
    if (!entry) return;
    addJobDescriptionWithValue(entry.text);
    toast.success("Loaded saved job description");
  };

  // ── Format timestamp (absolute - no Date.now() during render) ──

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const isOptimizing = optimizingIndex !== null;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Match Resume to Job</h2>
        <p className="text-sm text-muted-foreground">
          Paste job descriptions below and let AI rewrite your resume to match
          each role. Your bullet points and summary will be tailored with
          relevant keywords and achievements.
        </p>
      </div>

      {!hasResumeContent && (
        <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>
            Fill in your personal info, experience, education, and skills first
            so the AI can tailor your resume effectively.
          </span>
        </div>
      )}

      {/* ── History Panel ──────────────────────────────────────── */}
      {(resumeHistory.length > 0 || jdHistory.length > 0) && (
        <div className="rounded-lg border">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span>History &amp; Saved Items</span>
              {(resumeHistory.length > 0 || jdHistory.length > 0) && (
                <span className="text-xs text-muted-foreground">
                  ({resumeHistory.length} snapshots · {jdHistory.length} JDs)
                </span>
              )}
            </div>
            {showHistory ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showHistory && (
            <div className="border-t divide-y">
              {/* Resume Snapshots */}
              {resumeHistory.length > 0 && (
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <RotateCcw className="mr-1.5 inline h-3 w-3" />
                    Resume Snapshots
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto form-scroll">
                    {resumeHistory.map((snap) => (
                      <div
                        key={snap.id}
                        className="flex items-center justify-between gap-2 rounded-md border p-2.5 text-sm group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium text-xs">
                            {snap.label}
                          </p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {formatTime(snap.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleRestoreSnapshot(snap.id)}
                            className="h-7 gap-1 text-xs"
                          >
                            <RotateCcw className="h-3 w-3" />
                            Restore
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => deleteResumeSnapshot(snap.id)}
                            className="h-7 w-7 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Job Descriptions */}
              {jdHistory.length > 0 && (
                <div className="p-4 space-y-3">
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    <Bookmark className="mr-1.5 inline h-3 w-3" />
                    Saved Job Descriptions
                  </h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto form-scroll">
                    {jdHistory.map((entry) => (
                      <div
                        key={entry.id}
                        className="flex items-center justify-between gap-2 rounded-md border p-2.5 text-sm group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs">{entry.label}</p>
                          <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5">
                            <Clock className="h-3 w-3" />
                            {formatTime(entry.timestamp)}
                          </p>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <Button
                            variant="outline"
                            size="xs"
                            onClick={() => handleLoadJd(entry.id)}
                            disabled={isOptimizing}
                            className="h-7 gap-1 text-xs"
                          >
                            <Plus className="h-3 w-3" />
                            Use
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeFromJdHistory(entry.id)}
                            className="h-7 w-7 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── Current Job Descriptions ────────────────────────────── */}
      {data.jobDescriptions.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <Sparkles className="mb-2 h-6 w-6 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Paste a job description and the AI will rewrite your resume to match
            it — optimizing bullet points, summary, and keywords.
          </p>
          <Button
            onClick={addJobDescription}
            size="sm"
            className="mt-4 gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Job Description
          </Button>
        </div>
      )}

      {data.jobDescriptions.map((jd, index) => (
        <div
          key={index}
          className="relative rounded-lg border p-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Job #{index + 1}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => optimizeForJob(index)}
                disabled={optimizingIndex === index || !jd.trim() || !hasResumeContent}
                className="gap-1.5"
              >
                {optimizingIndex === index ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                Optimize Resume
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeJobDescription(index)}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={`jd-${index}`}>Job Description</Label>
            <Textarea
              id={`jd-${index}`}
              placeholder="Paste the full job description here..."
              className="min-h-[200px] resize-y"
              value={jd}
              onChange={(e) => updateJobDescription(index, e.target.value)}
            />
          </div>

          {optimizingIndex === index && retryCountdown === null && (
            <div className="flex items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              <span>
                Analyzing job description and rewriting your resume...
              </span>
            </div>
          )}

          {retryCountdown !== null && optimizingIndex === null && (
            <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 p-3 text-sm text-amber-800 dark:text-amber-300">
              <Clock className="h-4 w-4 shrink-0 animate-pulse" />
              <span>
                API rate limit reached. Auto-retrying in{" "}
                <strong>{retryCountdown}s</strong>...
              </span>
              <Button
                variant="outline"
                size="xs"
                className="ml-auto h-7 text-xs gap-1"
                onClick={() => {
                  if (retryTimerRef.current) clearTimeout(retryTimerRef.current);
                  setRetryCountdown(null);
                  pendingRetryIndex.current = null;
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      ))}

      {data.jobDescriptions.length > 0 && (
        <Button
          variant="outline"
          onClick={addJobDescription}
          className="w-full gap-1.5"
          disabled={isOptimizing}
        >
          <Plus className="h-4 w-4" />
          Add Another Job Description
        </Button>
      )}

      {data.jobDescriptions.length > 0 && hasResumeContent && (
        <div className="rounded-lg border p-4 space-y-2 glass-card">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            How it works
          </div>
          <ul className="space-y-1 text-xs text-muted-foreground list-disc list-inside">
            <li>
              The AI reads the job description and identifies key skills,
              requirements, and keywords.
            </li>
            <li>
              Your summary, bullet points, and skills are rewritten to
              highlight relevant experience.
            </li>
            <li>
              Only your summary, bullet points, and skills are rewritten —
              your personal info, education, and job details are preserved.
            </li>
            <li>
              A snapshot of your resume is saved before each optimization
              so you can always go back.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
