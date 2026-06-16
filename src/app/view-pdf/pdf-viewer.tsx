"use client";

import { useState, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { savePDF, isPDFStored, getPDF } from "@/lib/db";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function LazyPage({ pageNumber, pageWidth }: { pageNumber: number; pageWidth: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="pdf-viewer-page-wrap">
      {visible ? (
        <Page
          pageNumber={pageNumber}
          renderTextLayer
          renderAnnotationLayer
          width={pageWidth}
          loading={
            <div className="pdf-viewer-page-loading">
              <i className="bx bx-loader-alt bx-spin"></i>
            </div>
          }
        />
      ) : (
        <div className="pdf-viewer-page-loading" style={{ width: pageWidth, minHeight: 500 }}>
          <i className="bx bx-loader-alt bx-spin"></i>
        </div>
      )}
    </div>
  );
}

export default function PdfViewer({ url, title, semester, subject, unit }: { url: string; title: string; semester: string; subject: string; unit: string }) {
  const [numPages, setNumPages] = useState<number>(0);
  const [loadError, setLoadError] = useState(false);
  const [pageWidth, setPageWidth] = useState(800);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [dlProgress, setDlProgress] = useState(0);
  const [dlState, setDlState] = useState<"fetching" | "ready" | "error" | "none">("none");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const blobRef = useRef<Blob | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const pdfId = url;

  useEffect(() => {
    setPageWidth(Math.min(window.innerWidth - 16, 800));
    isPDFStored(pdfId).then(setSaved);
  }, [pdfId]);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;

    const load = async () => {
      const stored = await getPDF(url);
      if (stored) {
        if (cancelled) return;
        blobRef.current = stored.blob;
        const blobUrl_ = URL.createObjectURL(stored.blob);
        blobUrlRef.current = blobUrl_;
        setBlobUrl(blobUrl_);
        setDlState("ready");
        setSaved(true);
        return;
      }

      setDlState("fetching");
      setDlProgress(0);
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const total = parseInt(res.headers.get("Content-Length") || "0", 10);
        const reader = res.body!.getReader();
        const chunks: Uint8Array[] = [];
        let received = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          chunks.push(value);
          received += value.length;
          if (total) setDlProgress(Math.round((received / total) * 100));
        }
        if (cancelled) return;
        const blob = new Blob(chunks as BlobPart[], { type: "application/pdf" });
        blobRef.current = blob;
        const blobUrl_ = URL.createObjectURL(blob);
        blobUrlRef.current = blobUrl_;
        setBlobUrl(blobUrl_);
        setDlState("ready");
      } catch {
        if (!cancelled) setDlState("error");
      }
    };

    load();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [url]);

  const handleSave = async () => {
    if (!blobRef.current || saving || saved) return;
    setSaving(true);
    try {
      await savePDF(pdfId, title, url, semester, subject, unit, blobRef.current);
      setSaved(true);
    } catch (err) {
      console.error("Failed to save PDF offline:", err);
    }
    setSaving(false);
  };

  if (dlState === "error" || (dlState === "none" && loadError)) {
    return (
      <div className="pdf-viewer-root">
        <button className="pdf-viewer-back" onClick={() => window.history.back()} aria-label="Go back">
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="empty-state" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <i className="bx bxs-file-pdf" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
          <p>Could not load PDF.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-root">
      <div className="pdf-viewer-top-bar">
        <button className="pdf-viewer-back" onClick={() => window.history.back()} aria-label="Go back">
          <i className="bx bx-arrow-back"></i>
        </button>
        {numPages > 0 && <span className="pdf-viewer-page-info">1 / {numPages}</span>}
        {dlState === "ready" && (
          <button
            className={`pdf-viewer-save-btn ${saved ? "saved" : ""}`}
            onClick={handleSave}
            disabled={saving || saved}
            aria-label={saved ? "Saved offline" : "Save offline"}
          >
            <i className={`bx ${saved ? "bxs-check-circle" : saving ? "bx-loader-alt bx-spin" : "bxs-download"}`}></i>
            <span>{saved ? "Saved" : saving ? "Saving…" : "Save Offline"}</span>
          </button>
        )}
        {dlState === "fetching" && (
          <span className="pdf-viewer-page-info" style={{ fontSize: "0.72rem" }}>
            {dlProgress > 0 ? `${dlProgress}%` : "Loading…"}
          </span>
        )}
      </div>

      {dlState === "fetching" && (
        <div style={{ padding: "1rem 1.5rem 0" }}>
          <div style={{ height: 4, borderRadius: 2, background: "var(--border)", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${dlProgress || 2}%`,
                background: "linear-gradient(90deg, #2563eb, #0ea5e9)",
                borderRadius: 2,
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.4rem" }}>
            {dlProgress > 0 ? `Downloading PDF… ${dlProgress}%` : "Fetching PDF…"}
          </p>
        </div>
      )}

      <div className="pdf-viewer-scroll" onContextMenu={(e) => e.preventDefault()}>
        {blobUrl && (
          <Document
            file={blobUrl}
            onLoadSuccess={({ numPages }) => { setNumPages(numPages); setLoadError(false); }}
            onLoadError={() => setLoadError(true)}
            loading={
              <div className="pdf-viewer-loading">
                <i className="bx bx-loader-alt bx-spin" style={{ fontSize: "2rem" }}></i>
                <p>Rendering PDF…</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <LazyPage key={`page_${index + 1}`} pageNumber={index + 1} pageWidth={pageWidth} />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
