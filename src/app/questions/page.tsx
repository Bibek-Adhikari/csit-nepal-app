"use client";

import { useEffect, useState } from "react";
import { BackNav } from "@/components/back-nav";

type PDF = {
  id: string;
  title: string;
  public_url: string;
  year: string | null;
  file_name: string;
};

export default function QuestionsPage() {
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/entrance/pdfs").then(async (r) => {
      if (!r.ok) throw new Error(`pdfs HTTP ${r.status}`);
      const data = await r.json();
      if (data.error) throw new Error(data.error);
      setPdfs(data.pdfs ?? []);
    }).catch((e) => {
      setError(e.message);
    }).finally(() => {
      setLoading(false);
    });
  }, []);

  return (
    <>
      <BackNav href="/subjects/entrance" label="Entrance" />
      <section className="welcome-hero">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="bx bx-book-open" style={{ fontSize: "1.6rem", color: "var(--primary)" }}></i>
          <h2 style={{ margin: 0 }}>Questions</h2>
        </div>
        <p>BCA entrance exam questions and study materials.</p>
      </section>

      {loading ? (
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>Loading study materials...</p>
      ) : error ? (
        <div style={{ padding: "0.75rem 1rem", margin: "0 1rem", background: "#fee2e2", color: "#b91c1c", borderRadius: 8, fontSize: "0.85rem" }}>
          <i className="bx bx-error-circle" style={{ marginRight: "0.35rem" }}></i>
          Error loading data: {error}. Check console for details.
        </div>
      ) : pdfs.length === 0 ? (
        <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>No study materials yet.</p>
      ) : (
        <div className="subject-stack">
          {pdfs.map((pdf) => (
            <a
              key={pdf.id}
              href={`/view-pdf?url=${encodeURIComponent(pdf.public_url)}&title=${encodeURIComponent(pdf.title)}`}
              className="app-card"
              style={{ alignItems: "center" }}
            >
              <div className="card-left">
                <span className="card-code">
                  <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
                  {pdf.title}
                </span>
                {pdf.year && (
                  <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{pdf.year}</span>
                )}
              </div>
              <i className="bx bx-chevron-right card-chevron" style={{ fontSize: "1.2rem" }}></i>
            </a>
          ))}
        </div>
      )}
    </>
  );
}
