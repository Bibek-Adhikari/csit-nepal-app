"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { savePDF, getPDF, updateBookmark } from "@/lib/db";

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
    <div ref={ref} className="pdf-viewer-page-wrap" data-page={pageNumber}>
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

export default function PdfViewer({ url, signedUrl, bucket, path, title, semester, subject, unit, returnTo }: {
  url: string;
  signedUrl?: string | null;
  bucket?: string;
  path?: string;
  title: string;
  semester: string;
  subject: string;
  unit: string;
  returnTo?: string;
}) {
  const router = useRouter();
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadError, setLoadError] = useState(false);
  const [pageWidth, setPageWidth] = useState(800);
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [dlProgress, setDlProgress] = useState(0);
  const [dlState, setDlState] = useState<"fetching" | "ready" | "error" | "expired" | "none">("none");
  const [bookmarked, setBookmarked] = useState(false);
  const [refreshedSignedUrl, setRefreshedSignedUrl] = useState<string | null>(null);
  const [retryToken, setRetryToken] = useState(0);
  const blobRef = useRef<Blob | null>(null);
  const blobUrlRef = useRef<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef(false);
  const pdfId = url;
  const effectiveUrl = refreshedSignedUrl ?? signedUrl ?? url;

  const goBack = () => {
    if (returnTo) {
      router.replace(returnTo);
      return;
    }
    if (semester && subject && unit) {
      router.replace(`/notes/${semester}/${subject}/${unit}`);
    } else {
      router.back();
    }
  };

  useEffect(() => {
    setPageWidth(Math.min(window.innerWidth - 16, 800));
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || numPages < 2) return;

    trackingRef.current = true;

    const onScroll = () => {
      if (!trackingRef.current) return;
      const { scrollTop, scrollHeight, clientHeight } = container;
      const maxScroll = scrollHeight - clientHeight;
      if (maxScroll <= 0) return;
      const progress = scrollTop / maxScroll;
      const page = Math.round(progress * (numPages - 1)) + 1;
      setCurrentPage(Math.min(page, numPages));
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      trackingRef.current = false;
      container.removeEventListener("scroll", onScroll);
    };
  }, [numPages]);

  useEffect(() => {
    if (!effectiveUrl) return;
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
        setBookmarked(stored.bookmarked);
        return;
      }

      setDlState("fetching");
      setDlProgress(0);
      try {
        const res = await fetch(effectiveUrl);
        if (res.status === 400 || res.status === 401 || res.status === 403) {
          throw new Error(`Link expired (HTTP ${res.status})`);
        }
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

        try {
          await savePDF(pdfId, title, url, semester, subject, unit, blob);
        } catch {
          // offline save failed, PDF is still viewable
        }
        if (!cancelled) setBookmarked(false);
      } catch (err) {
        if (cancelled) return;
        if (err instanceof Error && err.message.startsWith("Link expired")) {
          setDlState("expired");
        } else {
          setDlState("error");
        }
      }
    };

    load();

    return () => {
      cancelled = true;
      if (blobUrlRef.current) URL.revokeObjectURL(blobUrlRef.current);
    };
  }, [effectiveUrl, url, pdfId, title, semester, subject, unit, retryToken]);

  const refreshUrl = async () => {
    if (!bucket || !path) {
      // Non-storage URL (no server-side refresh available): retry the raw URL.
      setDlState("fetching");
      setRetryToken((t) => t + 1);
      return;
    }

    setDlState("fetching");
    setLoadError(false);
    try {
      const params = new URLSearchParams({ bucket, path });
      const res = await fetch(`/api/pdf/signed-url?${params.toString()}`, {
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { signedUrl: string };
      setRefreshedSignedUrl(data.signedUrl);
    } catch {
      setDlState("expired");
    }
  };

  const toggleBookmark = async () => {
    const next = !bookmarked;
    setBookmarked(next);
    const existing = await getPDF(pdfId);
    if (!existing && blobRef.current) {
      await savePDF(pdfId, title, url, semester, subject, unit, blobRef.current);
    }
    await updateBookmark(pdfId, next);
  };

  if (dlState === "expired" || dlState === "error" || (dlState === "none" && loadError)) {
    const isExpired = dlState === "expired" || (dlState === "none" && loadError);
    return (
      <div className="pdf-viewer-root">
        <button className="pdf-viewer-back" onClick={goBack} aria-label="Go back">
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="empty-state" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <i className="bx bxs-file-pdf" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
          <p>{isExpired ? "This PDF link has expired." : "Could not load PDF."}</p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="pill-btn"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", cursor: "pointer" }}
              onClick={refreshUrl}
            >
              <i className="bx bx-refresh"></i>
              Refresh link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-root">
      <div className="pdf-viewer-top-bar">
        <button className="pdf-viewer-back" onClick={goBack} aria-label="Go back">
          <i className="bx bx-arrow-back"></i>
        </button>
        {numPages > 0 && <span className="pdf-viewer-page-info">{currentPage} / {numPages}</span>}
        {dlState === "ready" && (
          <button
            className={`pdf-viewer-save-btn ${bookmarked ? "saved" : ""}`}
            onClick={toggleBookmark}
            aria-label={bookmarked ? "Bookmarked" : "Bookmark"}
          >
            <i className={`bx ${bookmarked ? "bxs-bookmark" : "bx-bookmark"}`}></i>
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

      <div ref={scrollRef} className="pdf-viewer-scroll" onContextMenu={(e) => e.preventDefault()}>
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
