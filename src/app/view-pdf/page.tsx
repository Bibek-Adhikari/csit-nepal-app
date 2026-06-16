"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { BackNav } from "@/components/back-nav";

function PdfViewer() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const title = searchParams.get("title") || "PDF Viewer";

  if (!url) {
    return (
      <div className="watch-container">
        <BackNav href="/notes" label="Notes" />
        <div className="app-card" style={{ justifyContent: "center", textAlign: "center", padding: "3rem 1rem" }}>
          <p style={{ color: "var(--text-muted)" }}>No PDF URL provided.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <BackNav href="/notes" label="Notes" />
      <div className="watch-container">
        <div className="watch-actions" style={{ marginBottom: "0.75rem" }}>
          <span className="pill-btn active" style={{ flex: 1, textAlign: "center", overflow: "hidden", textOverflow: "ellipsis" }}>
            {title}
          </span>
          <Link
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="pill-btn"
            style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
          >
            <i className="bx bx-download"></i>
            Download
          </Link>
        </div>
        <div className="pdf-viewer-wrapper">
          <iframe
            src={url}
            className="pdf-iframe"
            title={title}
            loading="lazy"
          />
        </div>
      </div>
    </>
  );
}

export default function ViewPdfPage() {
  return (
    <Suspense fallback={
      <div className="watch-container">
        <div className="app-card" style={{ justifyContent: "center", textAlign: "center", padding: "3rem 1rem" }}>
          <p style={{ color: "var(--text-muted)" }}>Loading PDF viewer…</p>
        </div>
      </div>
    }>
      <PdfViewer />
    </Suspense>
  );
}
