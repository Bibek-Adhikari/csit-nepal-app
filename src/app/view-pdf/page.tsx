"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

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

function PdfViewer() {
  const searchParams = useSearchParams();
  const url = searchParams.get("url");
  const [numPages, setNumPages] = useState<number>(0);
  const [loadError, setLoadError] = useState(false);
  const [pageWidth, setPageWidth] = useState(800);

  useEffect(() => {
    setPageWidth(Math.min(window.innerWidth - 16, 800));
  }, []);

  const onLoadSuccess = useCallback(({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setLoadError(false);
  }, []);

  const onLoadError = useCallback(() => {
    setLoadError(true);
  }, []);

  if (!url) {
    return (
      <div className="empty-state">
        <p>No PDF URL provided.</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="pdf-viewer-root">
        <button
          className="pdf-viewer-back"
          onClick={() => window.history.back()}
          aria-label="Go back"
        >
          <i className="bx bx-arrow-back"></i>
        </button>
        <div className="empty-state" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
          <i className="bx bxs-file-pdf" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
          <p>Could not load PDF.</p>
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="pill-btn active"
            style={{ textDecoration: "none" }}
          >
            Open PDF directly
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="pdf-viewer-root">
      <div className="pdf-viewer-top-bar">
        <button
          className="pdf-viewer-back"
          onClick={() => window.history.back()}
          aria-label="Go back"
        >
          <i className="bx bx-arrow-back"></i>
        </button>
        {numPages > 0 && (
          <span className="pdf-viewer-page-info">1 / {numPages}</span>
        )}
        <a
          href={url}
          target="_blank"
          rel="noreferrer noopener"
          className="pdf-viewer-open-btn"
          aria-label="Open PDF"
        >
          <i className="bx bx-show"></i>
        </a>
      </div>
      <div className="pdf-viewer-scroll">
        <Document
          file={url}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={
            <div className="pdf-viewer-loading">
              <i className="bx bx-loader-alt bx-spin" style={{ fontSize: "2rem" }}></i>
              <p>Loading PDF…</p>
            </div>
          }
        >
          {Array.from(new Array(numPages), (_, index) => (
            <LazyPage key={`page_${index + 1}`} pageNumber={index + 1} pageWidth={pageWidth} />
          ))}
        </Document>
      </div>
    </div>
  );
}

export default function ViewPdfPage() {
  return (
    <Suspense fallback={
      <div className="empty-state">
        <p>Loading PDF viewer…</p>
      </div>
    }>
      <PdfViewer />
    </Suspense>
  );
}
