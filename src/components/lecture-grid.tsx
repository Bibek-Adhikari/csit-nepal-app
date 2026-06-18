"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { semesters } from "@/content/subjects";

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

const subjectTitleToSlug: Record<string, Record<string, string>> = {};
for (const sem of semesters) {
  const map: Record<string, string> = {};
  for (const sub of sem.subjects) {
    map[sub.title.toLowerCase()] = sub.slug;
  }
  subjectTitleToSlug[sem.key] = map;
}

export function LectureGrid() {
  const [videos, setVideos] = useState<LectureVideo[]>([]);
  const [allNotes, setAllNotes] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function fetchData() {
      try {
        const [lecturesRes, notesRes] = await Promise.all([
          fetch("/api/lectures", { cache: "no-store" }),
          fetch("/api/notes?limit=200", { cache: "no-store" }),
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

    timer = setInterval(fetchData, 10 * 60 * 1000);

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);

  const notesBySubject: Record<string, NoteItem[]> = {};
  const notesByLecture: Record<string, NoteItem[]> = {};
  for (const note of allNotes) {
    const key = `${note.semester_key}:${note.subject_slug}`;
    if (!notesBySubject[key]) notesBySubject[key] = [];
    notesBySubject[key].push(note);

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
      <div className="app-card" style={{ justifyContent: "center", textAlign: "center", padding: "3rem 1rem" }}>
        <p style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>Loading lectures…</p>
      </div>
    );
  }

  return (
    <>
      {error && (
        <div className="app-card" style={{ justifyContent: "center", textAlign: "center", marginBottom: "1rem" }}>
          <p style={{ color: "var(--warning, #e67e22)", fontSize: "0.82rem" }}>{error}</p>
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
            const slugMap = subjectTitleToSlug[video.semesterKey || ""];
            const subjectSlug = slugMap?.[video.subject.toLowerCase()];
            const noteKey = subjectSlug ? `${video.semesterKey}:${subjectSlug}` : "";
            const relatedNotes = noteKey ? notesBySubject[noteKey] : undefined;

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
                      const lectureNotes = notesByLecture[video.id];
                      const subjectNotes = relatedNotes?.filter(
                        (n) => !lectureNotes?.find((ln) => ln.id === n.id)
                      );
                      const allRelated = [...(lectureNotes || []), ...(subjectNotes || [])];

                      if (allRelated.length > 0) {
                        const maxVisible = 3;
                        const hasMore = allRelated.length > maxVisible;
                        const visible = hasMore ? allRelated.slice(0, maxVisible) : allRelated;

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
                                +{allRelated.length - maxVisible} more
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
