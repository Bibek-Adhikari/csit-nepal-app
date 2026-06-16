"use client";

import { useEffect, useState } from "react";

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
    const checkCompletion = () => {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        try {
          const completed = JSON.parse(raw) as string[];
          const completedFlag = completed.includes(unitId);
          setIsCompleted(completedFlag);
        } catch {
          console.error("Failed to parse completed units");
        }
      } else {
        setIsCompleted(false);
      }
    };

    const handle = setTimeout(checkCompletion, 0);
    return () => clearTimeout(handle);
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
      className={`completion-toggle${isCompleted ? " completed" : ""}`}
    >
      {isCompleted ? (
        <>
          <i className="bx bxs-check-circle"></i>
          <span>Completed!</span>
        </>
      ) : (
        <>
          <i className="bx bx-circle"></i>
          <span>Mark Completed</span>
        </>
      )}
    </button>
  );
}