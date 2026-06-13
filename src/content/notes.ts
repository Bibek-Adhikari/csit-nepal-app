import { semesters } from "./subjects";

export type NoteCategory = "pdf" | "handwritten";

export function getAllNotes() {
  return semesters.flatMap((semester) =>
    semester.subjects.flatMap((subject) =>
      subject.units.map((unit) => ({
        semesterKey: semester.key,
        semesterLabel: semester.label,
        subject,
        unit,
        pdf: unit.notes.pdf,
        handwritten: unit.notes.handwritten,
      })),
    ),
  );
}