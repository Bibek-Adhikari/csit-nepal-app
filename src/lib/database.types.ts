export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      notes: {
        Row: NoteRow;
        Insert: NoteInsert;
        Update: NoteUpdate;
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
