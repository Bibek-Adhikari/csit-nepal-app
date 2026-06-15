"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { lectureVideos } from "@/content/lectures";

const semesterFilters = [
  { key: "all", label: "All" },
  { key: "semester-1", label: "1st Sem" },
  { key: "semester-2", label: "2nd Sem" },
  { key: "semester-3", label: "3rd Sem" },
  { key: "semester-4", label: "4th Sem" },
];

export function LectureGrid() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const filteredLectures = useMemo(() => {
    return lectureVideos.filter((video) => {
      const semKey = video.semester.toLowerCase().replace(" ", "-");
      const matchesSemester = selectedSemester === "all" || semKey === selectedSemester;
      const matchesSearch =
        searchQuery === "" ||
        video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        video.tag.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSemester && matchesSearch;
    });
  }, [searchQuery, selectedSemester]);

  return (
    <>
      <div style={{ marginBottom: "1rem" }}>
        <div style={{ position: "relative", marginBottom: "0.75rem" }}>
          <i className="bx bx-search" style={{ position: "absolute", left: "0.85rem", top: "50%", transform: "translateY(-50%)", fontSize: "1.1rem", color: "var(--text-muted)" }}></i>
          <input
            type="text"
            placeholder="Search lectures or subjects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "0.75rem 1rem 0.75rem 2.5rem",
              borderRadius: "14px",
              border: "1px solid var(--border)",
              background: "var(--bg-card)",
              color: "var(--text-main)",
              fontSize: "0.88rem",
              outline: "none",
            }}
          />
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