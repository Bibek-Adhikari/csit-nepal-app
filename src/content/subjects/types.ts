export type SemesterKey = "semester-1" | "semester-2" | "semester-3" | "semester-4";

export type NoteItem = {
  title: string;
  href: string;
  format: "pdf" | "handwritten";
};

export type Unit = {
  slug: string;
  title: string;
  summary: string;
  notes: {
    pdf: NoteItem[];
    handwritten: NoteItem[];
  };
};

export type Subject = {
  code: string;
  slug: string;
  title: string;
  credits: string;
  overview: string;
  units: Unit[];
};

export type Semester = {
  key: SemesterKey;
  label: string;
  overview: string;
  subjects: Subject[];
};