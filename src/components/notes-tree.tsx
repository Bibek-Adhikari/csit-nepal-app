"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { getAllNotes } from "@/content/notes";

export function NotesTree() {
  const allNotes = useMemo(() => getAllNotes(), []);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSemester, setSelectedSemester] = useState<string>("all");

  const semesters = [
    { key: "all", label: "All Semesters" },
    { key: "semester-1", label: "1st Sem" },
    { key: "semester-2", label: "2nd Sem" },
    { key: "semester-3", label: "3rd Sem" },
    { key: "semester-4", label: "4th Sem" },
  ];

  const filteredNotes = useMemo(() => {
    return allNotes.filter((entry) => {
      const matchesSemester = selectedSemester === "all" || entry.semesterKey === selectedSemester;
      const matchesSearch =
        searchQuery === "" ||
        entry.subject.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.unit.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.subject.code.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSemester && matchesSearch;
    });
  }, [allNotes, searchQuery, selectedSemester]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            placeholder="Search subject or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/70 bg-background/50 py-3 pl-11 pr-4 text-sm text-text placeholder-text-muted outline-none transition focus:border-primary/50 focus:bg-background"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {semesters.map((sem) => (
            <button
              key={sem.key}
              onClick={() => setSelectedSemester(sem.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                selectedSemester === sem.key
                  ? "bg-primary text-white shadow-md shadow-primary/20"
                  : "border border-border/80 bg-background text-text-muted hover:bg-muted hover:text-text"
              }`}
            >
              {sem.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="rounded-[1.5rem] border border-border/80 bg-surface p-8 text-center shadow-soft">
            <p className="text-sm text-text-muted">No notes found matching your criteria.</p>
          </div>
        ) : (
          filteredNotes.map((entry) => (
            <section key={`${entry.semesterKey}-${entry.subject.slug}-${entry.unit.slug}`} className="rounded-[1.5rem] border border-border/80 bg-surface p-5 shadow-soft">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{entry.semesterLabel}</p>
                  <h3 className="text-lg font-black text-text">{entry.subject.title}</h3>
                  <p className="text-sm text-text-muted">{entry.unit.title}</p>
                </div>
                <Link href={`/notes/${entry.semesterKey}/${entry.subject.slug}/${entry.unit.slug}`} className="mt-2 rounded-full border border-border/80 px-4 py-2 text-sm font-semibold text-text transition hover:bg-muted sm:mt-0">
                  Open unit notes
                </Link>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">PDF Notes</p>
                  <ul className="mt-3 space-y-2 text-sm text-text">
                    {entry.pdf.length === 0 ? (
                      <li className="text-xs text-text-muted italic px-3 py-2">No PDF notes available</li>
                    ) : (
                      entry.pdf.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 hover:bg-muted px-3 py-2.5 transition duration-200 hover:translate-x-1"
                          >
                            <span className="font-medium">{item.title}</span>
                            <span className="rounded bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-primary">PDF</span>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
                <div className="rounded-2xl bg-background p-4">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">Handwritten Notes</p>
                  <ul className="mt-3 space-y-2 text-sm text-text">
                    {entry.handwritten.length === 0 ? (
                      <li className="text-xs text-text-muted italic px-3 py-2">No handwritten notes available</li>
                    ) : (
                      entry.handwritten.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center justify-between gap-3 rounded-xl bg-muted/70 hover:bg-muted px-3 py-2.5 transition duration-200 hover:translate-x-1"
                          >
                            <span className="font-medium">{item.title}</span>
                            <span className="rounded bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-400">Handwritten</span>
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
      </div>
    </div>
  );
}