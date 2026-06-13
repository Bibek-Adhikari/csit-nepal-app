import type { Semester } from "@/content/subjects";

export type ProgressState = {
  completedUnits: string[];
};

export function getTotalUnits(semesters: Semester[]) {
  return semesters.reduce((count, semester) => count + semester.subjects.reduce((subjectCount, subject) => subjectCount + subject.units.length, 0), 0);
}
