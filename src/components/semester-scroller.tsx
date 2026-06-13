import React from 'react';
import { cn } from '@/lib/utils';
import { semesters } from '@/content/subjects';

export function SemesterScroller() {
  return (
    <div className="semester-scroller">
      {semesters.map((semester) => (
        <button
          key={semester.key}
          className={cn(
            "pill-btn",
            // Example active logic, could be extended
            semester.key === semesters[0].key && "active"
          )}
        >
          {/* {semester.title} */}
        </button>
      ))}
    </div>
  );
}
