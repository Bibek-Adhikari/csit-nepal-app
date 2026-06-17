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



const semesterFilters = [
  { key: "all", label: "All" },
  { key: "semester-1", label: "1st Sem" },
  { key: "semester-2", label: "2nd Sem" },

];

export function LectureGrid() {
  const [videos, setVideos] = useState<LectureVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  useEffect(() => {
    let isMounted = true;
    let timer: ReturnType<typeof setInterval> | null = null;

    async function fetchLectures() {
      try {
        const res = await fetch("/api/lectures", { cache: "no-store" });
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        if (isMounted) setVideos(data.videos ?? []);
        if (isMounted) setError(null);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
        if (isMounted) setError("Could not load lectures.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchLectures();

    timer = setInterval(() => {
      fetchLectures();
    }, 10 * 60 * 1000); // 10 minutes

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, []);


  const filteredLectures = useMemo(() => {
    return videos.filter((video) => {
      // Semester filtering must rely on semesterKey coming from the API.
      // This prevents incorrect "semester" label parsing/mixmatch.
      const semKey = video.semesterKey;
      // If API ever returns missing semesterKey, keep it from matching any specific pill.
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
          {filteredLectures.map((video) => (
            <Link
              key={video.id}
              href={`/watch/${video.id}`}
              className="lecture-card"
            >
              <div className="lecture-thumb">
                <Image
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  fill
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
          ))}
        </div>
      )}
    </>
  );
}
