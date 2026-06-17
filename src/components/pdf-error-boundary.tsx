"use client";

import { ErrorBoundary } from "react-error-boundary";

function PdfErrorFallback({ resetErrorBoundary }: { error: unknown; resetErrorBoundary: () => void }) {
  return (
    <div className="pdf-viewer-root">
      <button className="pdf-viewer-back" onClick={() => window.history.back()} aria-label="Go back">
        <i className="bx bx-arrow-back"></i>
      </button>
      <div className="empty-state" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem", padding: "2rem" }}>
        <i className="bx bxs-file-pdf" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
        <p style={{ color: "var(--text-muted)" }}>Failed to load PDF viewer.</p>
        <button className="pill-btn" onClick={resetErrorBoundary} style={{ marginTop: "0.5rem" }}>
          <i className="bx bx-refresh" style={{ marginRight: "0.35rem" }}></i>
          Try Again
        </button>
      </div>
    </div>
  );
}

export function PdfErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary
      fallbackRender={PdfErrorFallback}
      onReset={() => window.location.reload()}
    >
      {children}
    </ErrorBoundary>
  );
}