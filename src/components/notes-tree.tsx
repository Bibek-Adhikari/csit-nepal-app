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

type NotesEntry = {
  semesterKey: string;
  semesterLabel: string;
  subject: { slug: string; code: string; title: string };
  unit: { slug: string; title: string; summary: string };
  pdf: { title: string; href: string }[];
  handwritten: { title: string; href: string }[];
};

type SubjectGroup = {
  semesterKey: string;
  semesterLabel: string;
  subject: { slug: string; code: string; title: string };
  units: NotesEntry[];
};

function groupBySubject(entries: NotesEntry[]): SubjectGroup[] {
  const map = new Map<string, SubjectGroup>();
  for (const entry of entries) {
    const key = `${entry.semesterKey}-${entry.subject.slug}`;
    const hasNotes = entry.pdf.length > 0 || entry.handwritten.length > 0;
    if (!hasNotes) continue;
    if (!map.has(key)) {
      map.set(key, {
        semesterKey: entry.semesterKey,
        semesterLabel: entry.semesterLabel,
        subject: entry.subject,
        units: [],
      });
    }
    map.get(key)!.units.push(entry);
  }
  return Array.from(map.values());
}

export function NotesTree() {
  const allNotes = useMemo(() => getAllNotes(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const grouped = useMemo(() => {
    const entries = allNotes as NotesEntry[];
    const query = searchQuery.toLowerCase().trim();

    const filtered = query
      ? entries.filter(
          (e) =>
            e.subject.title.toLowerCase().includes(query) ||
            e.unit.title.toLowerCase().includes(query) ||
            e.subject.code.toLowerCase().includes(query),
        )
      : entries;

    const groups = groupBySubject(filtered);

    if (selectedSemester !== "all") {
      return groups.filter((g) => g.semesterKey === selectedSemester);
    }
    return groups;
  }, [allNotes, searchQuery, selectedSemester]);

  return (
    <>
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

      {grouped.length === 0 ? (
        <div className="notes-empty">
          <p>No notes found matching your criteria.</p>
        </div>
      ) : (
        grouped.map((group) => (
          <section
            key={`${group.semesterKey}-${group.subject.slug}`}
            className="notes-entry"
          >
            <div className="notes-entry-header">
              <div>
                <p className="notes-entry-sem">{group.semesterLabel}</p>
                <h3 className="notes-entry-title">{group.subject.title}</h3>
                <p className="notes-entry-meta">{group.subject.code}</p>
              </div>
            </div>

            <div className="notes-entry-grid">
              {group.units.map((entry) => (
                <div key={entry.unit.slug} className="nt-unit-card">
                  <div className="nt-unit-info">
                    <span className="nt-unit-title">{entry.unit.title}</span>
                    <span className="nt-unit-summary">{entry.unit.summary}</span>
                    <div className="nt-unit-badges">
                      {entry.pdf.length > 0 && (
                        <span className="nt-badge pdf">
                          <i className="bx bxs-file-pdf"></i> PDF
                        </span>
                      )}
                      {entry.handwritten.length > 0 && (
                        <span className="nt-badge hw">
                          <i className="bx bxs-pencil"></i> Handwritten
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/notes/${entry.semesterKey}/${entry.subject.slug}/${entry.unit.slug}`}
                    className="nt-unit-open"
                  >
                    Open
                    <i className="bx bx-chevron-right"></i>
                  </Link>
                </div>
              ))}
            </div>
          </section>
        ))
      )}
    </>
  );
}
