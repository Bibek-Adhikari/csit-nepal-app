"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

type LectureVideo = {
  id: string;
  title: string;
  duration: string;
  meta: string;
  tag: string;
  semester: string;
  subject: string;
  thumbnail: string;
  semesterKey: string;
  storagePath?: string;
  storageBucket?: string;
};

type NoteItem = {
  id: string;
  title: string;
  public_url: string;
  semester_key: string;
  subject_slug: string;
  unit_slug: string;
  format: "pdf" | "handwritten";
  bucket?: string;
};

const semesterFilters = [
  { key: "all", label: "All" },
  { key: "semester-1", label: "1st Sem" },
  { key: "semester-2", label: "2nd Sem" },
];

export function LectureGrid() {
  const [videos, setVideos] = useState<LectureVideo[]>([]);
  const [allNotes, setAllNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      try {
        const ts = Date.now();
        const [lecturesRes, notesRes] = await Promise.all([
          fetch(`/api/lectures?_=${ts}`, { cache: "no-store" }),
          fetch(`/api/notes?limit=200&_=${ts}`, { cache: "no-store" }),
        ]);

        if (isMounted) {
          if (lecturesRes.ok) {
            const data = await lecturesRes.json();
            setVideos(data.videos ?? []);
          } else {
            setError("Could not load lectures.");
          }

          if (notesRes.ok) {
            const data = await notesRes.json();
            setAllNotes(data.notes ?? []);
          }
        }
      } catch {
        if (isMounted) setError("Could not load lectures.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  const notesByLecture: Record<string, NoteItem[]> = {};
  for (const note of allNotes) {
    const lecturePrefix = "lecture-";
    if (note.unit_slug.startsWith(lecturePrefix)) {
      const videoId = note.unit_slug.slice(lecturePrefix.length);
      if (!notesByLecture[videoId]) notesByLecture[videoId] = [];
      notesByLecture[videoId].push(note);
    }
  }

  const filteredLectures = useMemo(() => {
    return videos.filter((video) => {
      const semKey = video.semesterKey;
      const matchesSemester = selectedSemester === "all" || (semKey && semKey === selectedSemester);

      const matchesSearch =
        searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tag.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSemester && matchesSearch;
    });
  }, [searchQuery, selectedSemester, videos]);

  if (loading) {
    return (
      <>
        <div style={{ marginBottom: "1rem" }}>
          <div className="skeleton" style={{ height: 44, borderRadius: 10, marginBottom: "0.75rem" }} />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton" style={{ height: 32, width: 70, borderRadius: 999 }} />
            ))}
          </div>
        </div>
        <div className="lecture-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="lecture-card-wrap">
              <div className="lecture-card">
                <div className="skeleton" style={{ width: "100%", aspectRatio: "16/9", borderRadius: "12px 12px 0 0" }} />
                <div className="lecture-body">
                  <div style={{ display: "flex", gap: "0.35rem", marginBottom: "0.5rem" }}>
                    <div className="skeleton" style={{ height: 18, width: 50, borderRadius: 999 }} />
                    <div className="skeleton" style={{ height: 18, width: 40, borderRadius: 999 }} />
                  </div>
                  <div className="skeleton" style={{ height: 14, width: "90%", marginBottom: "0.35rem" }} />
                  <div className="skeleton" style={{ height: 12, width: "60%" }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {error && (
        <div className="app-card" style={{ justifyContent: "center", textAlign: "center", marginBottom: "1rem", flexDirection: "column", gap: "0.5rem" }}>
          <p style={{ color: "var(--warning, #e67e22)", fontSize: "0.82rem" }}>{error}</p>
          <button
            onClick={() => window.location.reload()}
            style={{ padding: "0.4rem 1rem", borderRadius: 8, border: "1px solid var(--border)", background: "var(--card-bg)", color: "var(--text-muted)", fontSize: "0.78rem", fontWeight: 600, cursor: "pointer" }}
          >
            <i className="bx bx-refresh" style={{ marginRight: "0.25rem" }}></i> Retry
          </button>
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <div style={{ marginBottom: "0.75rem" }}>
          <div className="app-search">
            <i className="bx bx-search app-search-icon"></i>
            <input
              type="text"
              placeholder="Search lectures or subjects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="semester-scroller" style={{ padding: 0 }}>
          {semesterFilters.map((sem) => (
            <button
              key={sem.key}
              className={`pill-btn${selectedSemester === sem.key ? " active" : ""}`}
              onClick={() => setSelectedSemester(sem.key)}
              style={{ padding: "0.5rem 0.85rem", fontSize: "0.78rem" }}
            >
              {sem.label}
            </button>
          ))}
        </div>
      </div>

      {filteredLectures.length === 0 ? (
        <div className="app-card" style={{ justifyContent: "center", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>No lectures found matching your criteria.</p>
        </div>
      ) : (
        <div className="lecture-grid">
          {filteredLectures.map((video, idx) => {
            return (
              <div key={video.id} className="lecture-card-wrap">
                <Link
                  href={`/watch/${video.id}`}
                  className="lecture-card"
                >
                  <div className="lecture-thumb">
                    <Image
                      src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                      alt={video.title}
                      fill
                      priority={idx < 3}
                      sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="lecture-duration">{video.duration}</span>
                  </div>
                  <div className="lecture-body">
                    <div className="lecture-badges">
                      <span className="lecture-badge">{video.tag}</span>
                      <span className="lecture-badge">{video.semester}</span>
                    </div>
                    <h3 className="lecture-title">{video.title}</h3>
                    <p className="lecture-meta">{video.subject} &middot; {video.meta}</p>
                  </div>
                </Link>
                <div className="lecture-notes">
                  <span className="lecture-notes-head">
                    <i className="bx bx-notepad"></i> Notes
                  </span>
                  <div className="lecture-notes-list">
                    {(() => {
                      const notes = notesByLecture[video.id];
                      if (notes && notes.length > 0) {
                        const maxVisible = 3;
                        const hasMore = notes.length > maxVisible;
                        const visible = hasMore ? notes.slice(0, maxVisible) : notes;
                        return (
                          <>
                            {visible.map((note) => (
                              <Link
                                key={note.id}
                                href={`/view-pdf?url=${encodeURIComponent(note.public_url)}&title=${encodeURIComponent(note.title)}&semester=${encodeURIComponent(note.semester_key)}&subject=${encodeURIComponent(note.subject_slug)}&unit=${encodeURIComponent(note.unit_slug)}`}
                                className="lecture-note-link"
                              >
                                <i className="bx bxs-file-pdf"></i>
                                <span>{note.title}</span>
                              </Link>
                            ))}
                            {hasMore && (
                              <span className="lecture-notes-more">
                                +{notes.length - maxVisible} more
                              </span>
                            )}
                          </>
                        );
                      }
                      return (
                        <span className="lecture-notes-placeholder">
                          <i className="bx bx-time"></i>
                          Notes for this lecture are being prepared
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
