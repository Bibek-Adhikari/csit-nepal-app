import { semesters } from "./subjects";
import type { Subject, Unit, Semester } from "./subjects/types";

export type NoteCategory = "pdf" | "handwritten";

type NoteItem = { title: string; href: string; format: "pdf" | "handwritten" };

type AllNotesEntry = {
  semesterKey: Semester["key"];
  semesterLabel: Semester["label"];
  subject: Subject;
  unit: Unit;
  pdf: NoteItem[];
  handwritten: NoteItem[];
};

export function getAllNotes(): AllNotesEntry[] {
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

