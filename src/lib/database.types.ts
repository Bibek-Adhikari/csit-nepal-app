export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: NoteRow;
        Insert: NoteInsert;
        Update: NoteUpdate;
      };
      entrance_questions: {
        Row: EntranceQuestionRow;
        Insert: EntranceQuestionInsert;
        Update: EntranceQuestionUpdate;
      };
      entrance_pdfs: {
        Row: EntrancePDFRow;
        Insert: EntrancePDFInsert;
        Update: EntrancePDFUpdate;
      };
      subject_questions: {
        Row: SubjectQuestionRow;
        Insert: SubjectQuestionInsert;
        Update: SubjectQuestionUpdate;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

export type NoteFormat = "pdf" | "handwritten";

export interface NoteRow {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string;
  format: NoteFormat;
  bucket: string;
  semester_key: string;
  subject_slug: string;
  unit_slug: string;
  public_url: string;
  created_at: string;
  updated_at: string;
}

export type NoteInsert = Omit<NoteRow, "id" | "created_at" | "updated_at"> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type NoteUpdate = Partial<NoteInsert>;

export type EntranceTopicSlug = "mathematics" | "english" | "computer-gk";

export interface EntranceQuestionRow {
  id: string;
  topic: EntranceTopicSlug;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  created_at: string;
}

export type EntranceQuestionInsert = Omit<EntranceQuestionRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type EntranceQuestionUpdate = Partial<EntranceQuestionInsert>;

export interface EntrancePDFRow {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string;
  public_url: string;
  year: string | null;
  created_at: string;
}

export type EntrancePDFInsert = Omit<EntrancePDFRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type EntrancePDFUpdate = Partial<EntrancePDFInsert>;

export interface SubjectQuestionRow {
  id: string;
  semester_key: string;
  subject_slug: string;
  unit_slug: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
  created_at: string;
}

export type SubjectQuestionInsert = Omit<SubjectQuestionRow, "id" | "created_at"> & {
  id?: string;
  created_at?: string;
};

export type SubjectQuestionUpdate = Partial<SubjectQuestionInsert>;
