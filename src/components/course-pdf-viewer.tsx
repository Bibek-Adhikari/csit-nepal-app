"use client";

import { useState } from "react";
import Link from "next/link";

export type CoursePdfRef = {
  code: string;
  semester: string;
  subject: string;
  title: string;
  href: string;
};

interface Props {
  coursePdfs: CoursePdfRef[];
}

export function CoursePdfViewer({ coursePdfs }: Props) {
  const [open, setOpen] = useState(false);

  const buttonLabel = "Course PDF";

  return (
    <div style={{ marginTop: "1rem" }}>
      <button
        className="csb-minimal-btn"
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          background: "#2563eb",
          color: "#fff",
          border: "1px solid #2563eb",
          padding: "0.45rem 0.9rem",
          borderRadius: 6,
          fontSize: "0.85rem",
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          textDecoration: "none",
        }}
      >
        <i
          className={`bx ${open ? "bx-chevron-down" : "bx-chevron-right"}`}
          style={{ marginRight: "0.25rem", fontSize: "1rem" }}
        ></i>
        {buttonLabel}
      </button>

      {open && (
        <div className="cc-units-list" style={{ marginTop: "0.75rem" }}>
          {coursePdfs.length > 0 ? (
            coursePdfs.map((cp) => (
              <div key={`${cp.semester}/${cp.subject}`} className="cc-unit">
                <div className="cc-unit-header">
                  <span className="cc-unit-num">{cp.code.replace("CSC ", "")}</span>
                  <div className="cc-unit-info">
                    <h3 className="cc-unit-title">{cp.title}</h3>
                  </div>
                </div>
                <div className="cc-topics">
                  <div className="cc-topic">
                    <div className="cc-topic-header">
                      <i
                        className="bx bxs-file-pdf cc-topic-icon"
                        style={{ color: "#ef4444" }}
                      ></i>
                      <Link
                        href={`/view-pdf?url=${encodeURIComponent(
                          cp.href
                        )}&title=${encodeURIComponent(
                          cp.title + " - Syllabus"
                        )}&semester=${encodeURIComponent(
                          cp.semester
                        )}&subject=${encodeURIComponent(cp.subject)}&unit=course`}
                        className="cc-pdf-link"
                      >
                        View Course PDF
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="cc-unit">
              <div className="cc-unit-header">
                <span
                  className="cc-unit-num"
                  style={{ background: "#94a3b8" }}
                >
                  <i className="bx bx-info-circle"></i>
                </span>
                <div className="cc-unit-info">
                  <h3 className="cc-unit-title">No course PDFs available</h3>
                  <p
                    className="cc-unit-summary"
                    style={{ fontStyle: "italic" }}
                  >
                    PDF coming soon
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
