"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { lectureVideos } from "@/content/lectures";
import { semesters } from "@/content/subjects";

type NoteItem = {
  id: string;
  title: string;
  file_path: string;
  public_url: string;
  semester_key: string;
  subject_slug: string;
  unit_slug: string;
  format: "pdf" | "handwritten";
  unit_title: string;
};

export function VideoNotes({ videoId }: { videoId: string }) {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const video = lectureVideos.find((v) => v.id === videoId);
    if (!video) {
      setLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        // First try: fetch notes linked to this video
        let params = new URLSearchParams({ video_id: videoId, limit: "50" });
        let res = await fetch(`/api/notes?${params}`);
        if (!res.ok) { setLoading(false); return; }
        let data = await res.json();

        // Fallback: no linked notes, fetch by semester+subject
        if (!data.notes || data.notes.length === 0) {
          const semKey = video.semesterKey;
          const sem = semesters.find((s) => s.key === semKey);
          const subject = sem?.subjects.find(
            (s) => s.title.toLowerCase() === video.subject.toLowerCase()
          );
          if (subject) {
            params = new URLSearchParams({ semester: semKey, subject: subject.slug, limit: "50" });
            res = await fetch(`/api/notes?${params}`);
            if (res.ok) {
              data = await res.json();
              setNotes(data.notes ?? []);
              setLoading(false);
              return;
            }
          }
        }

        setNotes(data.notes ?? []);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [videoId]);

  if (loading) {
    return (
      <section className="video-notes-section">
        <h3 className="section-headline">Notes</h3>
        <p style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>Loading notes…</p>
      </section>
    );
  }

  if (notes.length === 0) return null;

  const grouped: Record<string, NoteItem[]> = {};
  for (const note of notes) {
    const key = note.unit_title || "General";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(note);
  }

  return (
    <section className="video-notes-section">
      <h3 className="section-headline">
        <i className="bx bx-notepad" style={{ marginRight: "0.35rem" }}></i>
        Notes
      </h3>
      <p style={{ color: "var(--text-muted)", fontSize: "0.82rem", marginBottom: "0.75rem" }}>
        Study materials related to this lecture.
      </p>
      {Object.entries(grouped).map(([unitTitle, items]) => (
        <div key={unitTitle} style={{ marginBottom: "0.75rem" }}>
          <h4 style={{ fontSize: "0.82rem", fontWeight: 600, margin: "0 0 0.4rem", color: "var(--text-muted)" }}>
            {unitTitle}
          </h4>
          <div className="unit-notes-list">
            {items.map((note) => (
              <Link
                key={note.id}
                href={`/view-pdf?url=${encodeURIComponent(note.public_url)}&title=${encodeURIComponent(note.title)}&semester=${encodeURIComponent(note.semester_key)}&subject=${encodeURIComponent(note.subject_slug)}&unit=${encodeURIComponent(note.unit_slug)}`}
                className="unit-note-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <i className="bx bxs-file-pdf unit-note-icon" style={{ color: "var(--primary)" }}></i>
                <span className="unit-note-title">{note.title}</span>
                <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                  {note.format === "handwritten" ? "Handwritten" : "PDF"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
