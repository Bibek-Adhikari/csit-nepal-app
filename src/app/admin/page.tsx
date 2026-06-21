"use client";

import { useState, useEffect } from "react";
import { semesters } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import Link from "next/link";

const ADMIN_KEY_STORAGE = "bca-nepal-admin-key";

type NoteRecord = {
  id: string;
  title: string;
  file_name: string;
  file_path: string;
  semester_key: string;
  subject_slug: string;
  unit_slug: string;
  format: "pdf" | "handwritten";
  public_url: string;
  created_at: string;
};

function getSemesterLabel(key: string) {
  return semesters.find((s) => s.key === key)?.label || key;
}

function getSubjectTitle(semKey: string, subSlug: string) {
  const sem = semesters.find((s) => s.key === semKey);
  return sem?.subjects.find((s) => s.slug === subSlug)?.title || subSlug;
}

function getUnitTitle(semKey: string, subSlug: string, unitSlug: string) {
  const sem = semesters.find((s) => s.key === semKey);
  const sub = sem?.subjects.find((s) => s.slug === subSlug);
  return sub?.units.find((u) => u.slug === unitSlug)?.title || unitSlug;
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    const fetchNotes = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetch("/api/notes?limit=500");
        if (!res.ok) throw new Error("Failed to fetch notes");
        const data = await res.json();
        setNotes(data.notes || []);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, [authenticated]);

  const handleLogin = async () => {
    if (!adminKey.trim()) {
      setAuthError("Enter the admin key");
      return;
    }

    setAuthError("");
    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey.trim(),
        },
        body: JSON.stringify({}),
      });

      if (res.status === 401) {
        setAuthError("Something goes wrong, try again");
        return;
      }

      localStorage.setItem(ADMIN_KEY_STORAGE, adminKey.trim());
      setAuthenticated(true);
    } catch {
      setAuthError("Something goes wrong, try again");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setAuthenticated(false);
    setNotes([]);
  };

  if (!authenticated) {
    return (
      <>
        <BackNav href="/profile" label="Profile" />
        <section className="welcome-hero">
          <h2>Admin Panel</h2>
          <p>Enter the admin key to manage PDFs.</p>
        </section>
        <div style={{ padding: "0 1rem 1.5rem", maxWidth: 400, margin: "0 auto" }}>
          <div className="upload-card">
            <div className="upload-field">
              <label className="upload-label">Admin Key</label>
              <input
                type="password"
                className="upload-select"
                style={{ padding: "0.75rem 0.75rem" }}
                placeholder="Enter admin key..."
                value={adminKey}
                onChange={(e) => setAdminKey(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              />
            </div>
            {authError && (
              <div className="upload-message upload-message-error">
                <i className="bx bx-error-circle"></i>
                <span>{authError}</span>
              </div>
            )}
            <button className="upload-btn" onClick={handleLogin} style={{ marginTop: "0.5rem" }}>
              <i className="bx bx-lock-open"></i>
              Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <section className="welcome-hero">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2>Admin Panel</h2>
            <p>Manage all uploaded PDFs.</p>
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <Link href="/upload" className="upload-btn" style={{ textDecoration: "none", fontSize: "0.78rem", padding: "0.4rem 0.75rem" }}>
              <i className="bx bx-cloud-upload"></i>
              Upload
            </Link>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "1px solid var(--border)",
                borderRadius: 8,
                padding: "0.4rem 0.75rem",
                fontSize: "0.78rem",
                color: "var(--text-muted)",
                cursor: "pointer",
              }}
            >
              <i className="bx bx-log-out"></i>
            </button>
          </div>
        </div>
      </section>

      <div style={{ padding: "0 1rem 1.5rem" }}>
        {loading && (
          <div className="empty-state">
            <i className="bx bx-loader-alt bx-spin" style={{ fontSize: "2rem" }}></i>
            <p>Loading PDFs...</p>
          </div>
        )}

        {error && (
          <div className="upload-message upload-message-error">
            <i className="bx bx-error-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {!loading && !error && notes.length === 0 && (
          <div className="empty-state">
            <i className="bx bxs-file-pdf" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
            <p>No PDFs found.</p>
          </div>
        )}

        {!loading && notes.length > 0 && (
          <div className="upload-card" style={{ padding: "0.75rem" }}>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: "0.75rem" }}>
              {notes.length} PDF{notes.length !== 1 ? "s" : ""} total
            </div>
            <div className="subject-stack" style={{ gap: "0.5rem" }}>
              {notes.map((note) => (
                <div key={note.id} className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.3rem" }}>
                  <div className="card-left" style={{ flex: 1 }}>
                    <span className="card-title" style={{ fontSize: "0.85rem" }}>{note.title}</span>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "0.35rem", marginTop: "0.25rem" }}>
                      <span className="sheet-badge" style={{ fontSize: "0.65rem" }}>{getSemesterLabel(note.semester_key)}</span>
                      <span className="sheet-badge" style={{ fontSize: "0.65rem" }}>{getSubjectTitle(note.semester_key, note.subject_slug)}</span>
                      <span className="sheet-badge" style={{ fontSize: "0.65rem" }}>{getUnitTitle(note.semester_key, note.subject_slug, note.unit_slug)}</span>
                      <span className={`sheet-badge ${note.format === "handwritten" ? "" : ""}`} style={{ fontSize: "0.65rem", background: note.format === "handwritten" ? "var(--bg-app-2)" : "var(--primary-light)", color: note.format === "handwritten" ? "var(--text-muted)" : "var(--primary)" }}>
                        {note.format}
                      </span>
                    </div>
                    <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "0.2rem" }}>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <a href={note.public_url} target="_blank" rel="noopener noreferrer" className="upload-btn" style={{ textDecoration: "none", fontSize: "0.75rem", padding: "0.3rem 0.6rem", alignSelf: "flex-start" }}>
                    <i className="bx bx-show"></i>
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
