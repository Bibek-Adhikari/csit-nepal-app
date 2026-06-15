"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface CompletionToggleProps {
  semesterKey: string;
  subjectSlug: string;
  unitSlug: string;
}

const storageKey = "bca-nepal-completed-units";

export function CompletionToggle({ semesterKey, subjectSlug, unitSlug }: CompletionToggleProps) {
  const unitId = `${semesterKey}/${subjectSlug}/${unitSlug}`;
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        const completed = JSON.parse(raw) as string[];
        setIsCompleted(completed.includes(unitId));
      } catch {
        console.error("Failed to parse completed units");
      }
    }
  }, [unitId]);

  const toggleCompletion = () => {
    const raw = window.localStorage.getItem(storageKey);
    let completed: string[] = [];
    if (raw) {
      try {
        completed = JSON.parse(raw) as string[];
      } catch {
        completed = [];
      }
    }

    let updated: string[];
    if (completed.includes(unitId)) {
      updated = completed.filter((id) => id !== unitId);
      setIsCompleted(false);
    } else {
      updated = [...completed, unitId];
      setIsCompleted(true);
    }

    window.localStorage.setItem(storageKey, JSON.stringify(updated));

    window.dispatchEvent(new Event("local-storage-update"));
  };

  return (
    <button
      type="button"
      onClick={toggleCompletion}
      className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-black uppercase tracking-[0.14em] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] ${
        isCompleted
          ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
          : "border border-border/80 bg-surface/90 text-text hover:bg-muted hover:shadow-md"
      }`}
    >
      {isCompleted ? (
        <>
          <CheckCircle2 className="h-4 w-4" />
          <span>Completed!</span>
        </>
      ) : (
        <>
          <Circle className="h-4 w-4 text-text-muted" />
          <span>Mark Completed</span>
        </>
      )}
    </button>
  );
}
