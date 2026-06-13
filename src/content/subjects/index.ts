import { semester1 } from "./semester-1";
import { semester2 } from "./semester-2";
import { semester3 } from "./semester-3";
import { semester4 } from "./semester-4";
import type { Semester, SemesterKey, Subject, Unit, NoteItem } from "./types";

export const semesters: Semester[] = [semester1, semester2, semester3, semester4];

export function getSemester(key: SemesterKey) {
  return semesters.find((semester) => semester.key === key);
}

export function getSubject(semesterKey: SemesterKey, subjectSlug: string) {
  return getSemester(semesterKey)?.subjects.find((subject) => subject.slug === subjectSlug);
}

export function getUnit(semesterKey: SemesterKey, subjectSlug: string, unitSlug: string) {
  return getSubject(semesterKey, subjectSlug)?.units.find((unit) => unit.slug === unitSlug);
}

export type { Semester, SemesterKey, Subject, Unit, NoteItem } from "./types";