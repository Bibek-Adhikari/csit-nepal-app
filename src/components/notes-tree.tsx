"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { getAllNotes } from "@/content/notes";

const semesters = [
  { key: "all", label: "All Semesters" },
  { key: "semester-1", label: "1st Sem" },
  { key: "semester-2", label: "2nd Sem" },
  { key: "semester-3", label: "3rd Sem" },
  { key: "semester-4", label: "4th Sem" },
];

export function NotesTree() {
  const allNotes = useMemo(() => getAllNotes(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const filteredNotes = useMemo(() => {
    if (!allNotes) return [];
    const query = searchQuery.toLowerCase().trim();

    return allNotes.filter((entry) => {
      const matchesSemester =
        selectedSemester === "all" || entry.semesterKey === selectedSemester;
      const matchesSearch =
        query === "" ||
        entry.subject.title.toLowerCase().includes(query) ||
        entry.unit.title.toLowerCase().includes(query) ||
        entry.subject.code.toLowerCase().includes(query);
      return matchesSemester && matchesSearch;
    });
  }, [allNotes, searchQuery, selectedSemester]);

  return (
    <>
      {/* Controls */}
      <div className="notes-tree-controls">
        <div className="notes-tree-search-row">
          <div className="app-search">
            <i className="bx bx-search app-search-icon"></i>
            <input
              type="text"
              placeholder="Search subject or unit..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="notes-tree-filters">
            {semesters.map((sem) => (
              <button
                key={sem.key}
                className={`pill-btn${
                  selectedSemester === sem.key ? " active" : ""
                }`}
                style={{ padding: "0.5rem 0.85rem", fontSize: "0.78rem" }}
                onClick={() => setSelectedSemester(sem.key)}
              >
                {sem.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* List */}
      {filteredNotes.length === 0 ? (
        <div className="notes-empty">
          <p>No notes found matching your criteria.</p>
        </div>
      ) : (
        filteredNotes.map((entry) => (
          <section
            key={`${entry.semesterKey}-${entry.subject.slug}-${entry.unit.slug}`}
            className="notes-entry"
          >
            {/* Header */}
            <div className="notes-entry-header">
              <div>
                <p className="notes-entry-sem">{entry.semesterLabel}</p>
                <h3 className="notes-entry-title">{entry.subject.title}</h3>
                <p className="notes-entry-meta">
                  {entry.subject.code} — {entry.unit.title}
                </p>
              </div>
              <Link
                href={`/notes/${entry.semesterKey}/${entry.subject.slug}/${entry.unit.slug}`}
                className="notes-entry-action"
              >
                Open unit notes
                <i className="bx bx-external-link"></i>
              </Link>
            </div>

            {/* Content Grid */}
            <div className="notes-entry-grid">
              {/* PDF Notes */}
              <div className="notes-col">
                <div className="notes-col-head">
                  <i className="bx bxs-file-doc"></i>
                  <span>PDF Notes</span>
                </div>
                <ul>
                  {entry.pdf.length === 0 ? (
                    <li className="notes-item-empty">
                      No PDF notes available
                    </li>
                  ) : (
                    entry.pdf.map((item: { href: string; title: string }) => (
                      <li key={item.href} style={{ marginBottom: "0.4rem" }}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="notes-item"
                        >
                          <span className="notes-item-label">{item.title}</span>
                          <span className="notes-item-tag">PDF</span>
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>

              {/* Handwritten Notes */}
              <div className="notes-col">
                <div className="notes-col-head">
                  <i className="bx bxs-pencil amber"></i>
                  <span>Handwritten Notes</span>
                </div>
                <ul>
                  {entry.handwritten.length === 0 ? (
                    <li className="notes-item-empty">
                      No handwritten notes available
                    </li>
                  ) : (
                    entry.handwritten.map((item) => (
                      <li key={item.href} style={{ marginBottom: "0.4rem" }}>
                        <a
                          href={item.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="notes-item"
                        >
                          <span className="notes-item-label">{item.title}</span>
                          <span className="notes-item-tag amber">Handwritten</span>
                        </a>
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>
          </section>
        ))
      )}
    </>
  );
}