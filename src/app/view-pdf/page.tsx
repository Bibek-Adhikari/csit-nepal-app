"use client";

import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Suspense } from "react";

const PdfViewer = dynamic(() => import("./pdf-viewer"), { ssr: false });

function ViewPdfContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");

  if (!url) {
    return (
      <div className="empty-state">
        <p>No PDF URL provided.</p>
      </div>
    );
  }

  return <PdfViewer url={url} />;
}

export default function ViewPdfPage() {
  return (
    <Suspense fallback={
      <div className="empty-state">
        <p>Loading PDF viewer…</p>
      </div>
    }>
      <ViewPdfContent />
    </Suspense>
  );
}
