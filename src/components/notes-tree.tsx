"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, FileText, Pencil, ExternalLink } from "lucide-react";
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
    if (!allNotes) return [];
    const query = searchQuery.toLowerCase().trim();
    
    return allNotes.filter((entry) => {
      const matchesSemester = selectedSemester === "all" || entry.semesterKey === selectedSemester;
      const matchesSearch =
        query === "" ||
        entry.subject.title.toLowerCase().includes(query) ||
        entry.unit.title.toLowerCase().includes(query) ||
        entry.subject.code.toLowerCase().includes(query);
      return matchesSemester && matchesSearch;
    });
  }, [allNotes, searchQuery, selectedSemester]);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col gap-4 rounded-3xl border border-border/70 bg-surface p-5 shadow-soft sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted pointer-events-none" />
          <input
            type="text"
            placeholder="Search subject or unit..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-border/70 bg-background/50 py-3 pl-11 pr-4 text-sm text-text placeholder-text-muted outline-none transition focus:border-primary/50 focus:bg-background focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {semesters.map((sem) => (
            <button
              key={sem.key}
              onClick={() => setSelectedSemester(sem.key)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 ${
                selectedSemester === sem.key
                  ? "bg-primary text-white shadow-md shadow-primary/20 scale-105"
                  : "border border-border/80 bg-background text-text-muted hover:bg-muted hover:text-text hover:border-primary/30"
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
            <section 
              key={`${entry.semesterKey}-${entry.subject.slug}-${entry.unit.slug}`} 
              className="group rounded-[1.5rem] border border-border/80 bg-surface p-5 shadow-soft transition-all duration-200 hover:shadow-md hover:border-border"
            >
              {/* Header */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary mb-1">
                    {entry.semesterLabel}
                  </p>
                  <h3 className="text-lg font-black text-text leading-tight truncate">
                    {entry.subject.title}
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5 truncate">
                    {entry.subject.code} — {entry.unit.title}
                  </p>
                </div>
                <Link 
                  href={`/notes/${entry.semesterKey}/${entry.subject.slug}/${entry.unit.slug}`} 
                  className="inline-flex items-center gap-2 mt-2 rounded-full bg-primary/10 px-5 py-2.5 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white sm:mt-0 shrink-0"
                >
                  <span>Open unit notes</span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                </Link>
              </div>

              {/* Content Grid */}
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {/* PDF Notes */}
                <div className="rounded-2xl bg-background border border-border/40 p-4 transition-colors hover:border-border/60">
                  <div className="flex items-center gap-2 mb-3">
                    <FileText className="h-4 w-4 text-primary shrink-0" />
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">
                      PDF Notes
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {entry.pdf.length === 0 ? (
                      <li className="text-xs text-text-muted italic px-3 py-2 bg-muted/30 rounded-lg">
                        No PDF notes available
                      </li>
                    ) : (
                      entry.pdf.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group/item flex items-center justify-between gap-3 rounded-xl bg-muted/50 hover:bg-muted px-3 py-2.5 transition-all duration-200 hover:translate-x-1 hover:shadow-sm"
                          >
                            <span className="font-medium text-sm truncate">{item.title}</span>
                            <span className="shrink-0 rounded bg-primary/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-primary">
                              PDF
                            </span>
                          </a>
                        </li>
                      ))
                    )}
                  </ul>
                </div>

                {/* Handwritten Notes */}
                <div className="rounded-2xl bg-background border border-border/40 p-4 transition-colors hover:border-border/60">
                  <div className="flex items-center gap-2 mb-3">
                    <Pencil className="h-4 w-4 text-amber-500 shrink-0" />
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-text-muted">
                      Handwritten Notes
                    </p>
                  </div>
                  <ul className="space-y-2">
                    {entry.handwritten.length === 0 ? (
                      <li className="text-xs text-text-muted italic px-3 py-2 bg-muted/30 rounded-lg">
                        No handwritten notes available
                      </li>
                    ) : (
                      entry.handwritten.map((item) => (
                        <li key={item.href}>
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="group/item flex items-center justify-between gap-3 rounded-xl bg-muted/50 hover:bg-muted px-3 py-2.5 transition-all duration-200 hover:translate-x-1 hover:shadow-sm"
                          >
                            <span className="font-medium text-sm truncate">{item.title}</span>
                            <span className="shrink-0 rounded bg-amber-500/10 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-[0.1em] text-amber-600 dark:text-amber-400">
                              Handwritten
                            </span>
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