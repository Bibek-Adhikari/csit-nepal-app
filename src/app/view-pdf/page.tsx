"use client";

import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PdfErrorBoundary } from "@/components/pdf-error-boundary";

const PdfViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

function ViewPdfContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const url = searchParams.get("url");
  const title = searchParams.get("title") || "Untitled";
  const semester = searchParams.get("semester") || "";
  const subject = searchParams.get("subject") || "";
  const unit = searchParams.get("unit") || "";
  const returnTo = searchParams.get("returnTo") || "";

  const backUrl = returnTo || (semester && subject
    ? unit ? `/notes/${semester}/${subject}/${unit}` : `/notes/${semester}/${subject}`
    : "/subjects");

  if (!url) {
    return (
      <div className="empty-state">
        <p>No PDF URL provided.</p>
      </div>
    );
  }

  return (
    <>
      <nav className="back-nav">
        <button
          onClick={() => router.push(backUrl)}
          className="back-nav-link"
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          <i className="bx bx-chevron-left"></i>
          <span>{title}</span>
        </button>
      </nav>
      <PdfViewer url={url} title={title} semester={semester} subject={subject} unit={unit} />
    </>
  );
}

export default function ViewPdfPage() {
  return (
    <PdfErrorBoundary>
      <Suspense fallback={
        <div className="empty-state">
          <p>Loading PDF viewer…</p>
        </div>
      }>
        <ViewPdfContent />
      </Suspense>
    </PdfErrorBoundary>
  );
}
