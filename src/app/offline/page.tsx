"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { getAllPDFs, deletePDF } from "@/lib/db";
import { getSemester, getSubject } from "@/content/subjects";
import type { SemesterKey } from "@/content/subjects";

interface StoredPDF {
  id: string;
  title: string;
  url: string;
  semester: string;
  subject: string;
  unit: string;
  blob: Blob;
  savedAt: number;
}

function formatDate(ts: number) {
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function OfflinePage() {
  const [pdfs, setPdfs] = useState<StoredPDF[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const all = await getAllPDFs();
    all.sort((a, b) => b.savedAt - a.savedAt);
    setPdfs(all);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleDelete = async (id: string) => {
    await deletePDF(id);
    setPdfs((prev) => prev.filter((p) => p.id !== id));
  };

  const grouped: Record<string, Record<string, StoredPDF[]>> = {};
  for (const pdf of pdfs) {
    const sem = pdf.semester || "other";
    const sub = pdf.subject || "other";
    if (!grouped[sem]) grouped[sem] = {};
    if (!grouped[sem][sub]) grouped[sem][sub] = [];
    grouped[sem][sub].push(pdf);
  }

  const semLabels: Record<string, string> = {
    "semester-1": "Semester 1",
    "semester-2": "Semester 2",
    "semester-3": "Semester 3",
    "semester-4": "Semester 4",
  };

  return (
    <>
      <section className="welcome-hero">
        <h2>Offline PDFs</h2>
        <p>PDFs you&apos;ve saved for offline viewing, organized by subject.</p>
      </section>

      {loading ? (
        <div className="empty-state">
          <p>Loading saved PDFs…</p>
        </div>
      ) : pdfs.length === 0 ? (
        <div className="empty-state">
          <i className="bx bxs-file-pdf" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
          <p>No PDFs saved yet. Open a PDF and tap &ldquo;Save Offline&rdquo; to store it here.</p>
        </div>
      ) : (
        <div style={{ padding: "0 1rem 1.5rem" }}>
          {Object.entries(grouped).map(([semKey, subjects]) => (
            <div key={semKey} style={{ marginBottom: "1.5rem" }}>
              <h3 className="section-headline">{semLabels[semKey] || semKey}</h3>
              {Object.entries(subjects).map(([subSlug, items]) => {
                const subData = getSubject(semKey as SemesterKey, subSlug);
                const subTitle = subData?.title || subSlug;
                return (
                  <div key={subSlug} style={{ marginBottom: "1rem" }}>
                    <h4 style={{ fontSize: "0.88rem", fontWeight: 600, margin: "0.5rem 0", color: "var(--text-muted)" }}>
                      {subTitle}
                    </h4>
                    <div className="unit-notes-list">
                      {items.map((pdf) => (
                        <Link
                          key={pdf.id}
                          href={`/view-pdf?url=${encodeURIComponent(pdf.id)}&title=${encodeURIComponent(pdf.title)}&semester=${encodeURIComponent(pdf.semester)}&subject=${encodeURIComponent(pdf.subject)}&unit=${encodeURIComponent(pdf.unit)}`}
                          className="unit-note-card"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          <span className="unit-note-badge pdf">
                            <i className="bx bxs-file-pdf"></i> PDF
                          </span>
                          <span className="unit-note-title">{pdf.title}</span>
                          <span className="offline-saved-date">{formatDate(pdf.savedAt)}</span>
                          <span
                            className="offline-delete-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleDelete(pdf.id);
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Delete"
                          >
                            <i className="bx bx-trash"></i>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
