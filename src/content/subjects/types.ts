export type SemesterKey = "semester-1" | "semester-2";

export type NoteItem = {
  title: string;
  href: string;
  format: "pdf" | "handwritten";
  size?: number;
  storagePath?: string;
  bucket?: string;
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
  labReports: Unit[];
};

export type Semester = {
  key: SemesterKey;
  label: string;
  overview: string;
  subjects: Subject[];
};