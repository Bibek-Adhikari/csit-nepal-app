"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import type { LectureVideo } from "@/content/lectures";

const semesterFilters = [
  { key: "all", label: "All" },
  { key: "semester-1", label: "1st Sem" },
  { key: "semester-2", label: "2nd Sem" },
  { key: "semester-3", label: "3rd Sem" },
  { key: "semester-4", label: "4th Sem" },
];

export function LectureGrid() {
  const [videos, setVideos] = useState<LectureVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  useEffect(() => {
    async function fetchLectures() {
      try {
        const res = await fetch("/api/lectures");
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        const data = await res.json();
        setVideos(data.videos ?? []);
      } catch (err) {
        console.error("Failed to fetch lectures:", err);
        setError("Could not load lectures. Using cached data.");
        // Fallback to static data
        const { lectureVideos } = await import("@/content/lectures");
        setVideos(lectureVideos);
      } finally {
        setLoading(false);
      }
    }
    fetchLectures();
  }, []);

  const filteredLectures = useMemo(() => {
    return videos.filter((video) => {
      const semKey = video.semesterKey ?? video.semester.toLowerCase().replace(" ", "-");
      const matchesSemester = selectedSemester === "all" || semKey === selectedSemester;
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
            <a
              key={video.id}
              href={`https://www.youtube.com/watch?v=${video.id}`}
              target="_blank"
              rel="noreferrer noopener"
              className="lecture-card"
            >
              <div className="lecture-thumb">
                <Image
                  src={`https://i.ytimg.com/vi/${video.id}/hqdefault.jpg`}
                  alt={video.title}
                  fill
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
            </a>
          ))}
        </div>
      )}
    </>
  );
}
