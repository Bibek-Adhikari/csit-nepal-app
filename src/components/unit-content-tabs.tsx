"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";

declare global {
  interface Window {
    Prism?: { highlightAll: () => void };
  }
}

interface NoteItem {
  href: string;
  title: string;
}

interface UnitContentTabsProps {
  pdfNotes: NoteItem[];
  handwrittenNotes: NoteItem[];
  textContent: string | null;
  semester: string;
  subject: string;
  unit: string;
  quizUrl: string;
  subjectTitle: string;
  pdfSection: ReactNode;
  comingSoonSection: ReactNode;
}

export function UnitContentTabs({
  pdfNotes,
  handwrittenNotes,
  textContent,
  semester,
  subject,
  unit,
  quizUrl,
  subjectTitle,
  pdfSection,
  comingSoonSection,
}: UnitContentTabsProps) {
  const [active, setActive] = useState<"pdfs" | "content">("pdfs");

  const hasPdfs = pdfNotes.length > 0 || handwrittenNotes.length > 0;
  const hasContent = !!textContent;

  useEffect(() => {
    if (active === "content" && hasContent && typeof window !== "undefined" && window.Prism) {
      window.Prism.highlightAll();
    }
  }, [active, hasContent]);

  return (
    <>
      <nav className="unit-subnav">
        <button
          className={`subnav-link${active === "pdfs" ? " active" : ""}`}
          onClick={() => setActive("pdfs")}
        >
          <i className="bx bxs-file-pdf"></i>
          PDFs
        </button>
        {hasContent && (
          <button
            className={`subnav-link${active === "content" ? " active" : ""}`}
            onClick={() => setActive("content")}
          >
            <i className="bx bxs-book-reader"></i>
            Content
          </button>
        )}
        <Link
          href={quizUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="subnav-link subnav-link-quiz"
        >
          <i className="bx bx-question-mark"></i>
          Take Quiz
        </Link>
      </nav>

      {active === "pdfs" && (
        <>
          {pdfSection}
          {!hasPdfs && comingSoonSection}
        </>
      )}

      {active === "content" && hasContent && (
        <section id="unit-text-content" className="text-content-section">
          <h3 className="section-headline">
            <i className="bx bxs-book-reader" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>
            Content
          </h3>
          <div
            className="text-content-body"
            dangerouslySetInnerHTML={{ __html: textContent! }}
          />
        </section>
      )}
    </>
  );
}
