"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PdfErrorBoundary } from "@/components/pdf-error-boundary";

const PdfViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

function ViewPdfContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const title = searchParams.get("title") || "Untitled";
  const semester = searchParams.get("semester") || "";
  const subject = searchParams.get("subject") || "";
  const unit = searchParams.get("unit") || "";

  if (!url) {
    return (
      <div className="empty-state">
        <p>No PDF URL provided.</p>
      </div>
    );
  }

  return <PdfViewer url={url} title={title} semester={semester} subject={subject} unit={unit} />;
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
