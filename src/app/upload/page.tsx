"use client";

import { useState, useRef, useEffect } from "react";
import { semesters } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";

const ADMIN_KEY_STORAGE = "bca-nepal-admin-key";

type UploadState = "idle" | "getting-url" | "uploading" | "success" | "error";

export default function UploadPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [noteType, setNoteType] = useState<"pdf" | "handwritten">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [result, setResult] = useState<{ path: string; url: string; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
    }
  }, []);

  const semester = semesters.find((s) => s.key === selectedSemester);
  const subject = semester?.subjects.find((s) => s.slug === selectedSubject);

  const canSubmit = authenticated && selectedSemester && selectedSubject && selectedUnit && file;

  const handleLogin = () => {
    if (!adminKey.trim()) {
      setAuthError("Enter the admin key");
      return;
    }
    localStorage.setItem(ADMIN_KEY_STORAGE, adminKey.trim());
    setAuthenticated(true);
    setAuthError("");
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_KEY_STORAGE);
    setAdminKey("");
    setAuthenticated(false);
    setAuthError("");
    setUploadState("idle");
    setResult(null);
    setErrorMsg("");
  };

  const handleUpload = async () => {
    if (!canSubmit || !file) return;
    setUploadState("getting-url");
    setErrorMsg("");
    setResult(null);

    const folder = `${selectedSemester}/${selectedSubject}/${selectedUnit}`;

    try {
      // 1. Get signed upload URL from API
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          folder,
          bucket: "notes",
          format: noteType,
          title: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type || "application/pdf",
        }),
      });

      let data: Record<string, unknown>;
      try {
        data = await res.json();
      } catch {
        const text = await res.text();
        throw new Error(text || "Server returned a non-JSON response");
      }

      if (!res.ok) {
        throw new Error((data.error as string) || "Failed to get upload URL");
      }

      const signedUrl = data.signedUrl as string;

      // 2. Upload file directly to Supabase via signed URL
      setUploadState("uploading");

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/pdf" },
      });

      if (!uploadRes.ok) {
        const errText = await uploadRes.text().catch(() => "");
        throw new Error(`Upload failed (${uploadRes.status}): ${errText || "Unknown error"}`);
      }

      setResult({
        path: data.path as string,
        url: data.publicUrl as string,
        name: file.name,
      });
      setUploadState("success");
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMsg(error.message || "Something went wrong");
      setUploadState("error");
    }
  };

  const resetForm = () => {
    setSelectedSemester("");
    setSelectedSubject("");
    setSelectedUnit("");
    setNoteType("pdf");
    setFile(null);
    setUploadState("idle");
    setResult(null);
    setErrorMsg("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ─── Auth gate ───────────────────────────────────────────────
  if (!authenticated) {
    return (
      <>
        <BackNav href="/profile" label="Profile" />
        <section className="welcome-hero">
          <div>
            <h2>Admin Upload</h2>
            <p>Enter the admin key to access the upload area.</p>
          </div>
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

  // ─── Upload form ────────────────────────────────────────────
  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <section className="welcome-hero">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <h2>Upload Notes</h2>
            <p>Upload PDF notes to Supabase storage.</p>
          </div>
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
              display: "flex",
              alignItems: "center",
              gap: "0.35rem",
            }}
          >
            <i className="bx bx-log-out"></i>
            Logout
          </button>
        </div>
      </section>

      <div style={{ padding: "0 1rem 1.5rem" }}>
        <div className="upload-card">
          {/* Semester */}
          <div className="upload-field">
            <label className="upload-label">Semester</label>
            <select
              className="upload-select"
              value={selectedSemester}
              onChange={(v) => {
                setSelectedSemester(v.target.value);
                setSelectedSubject("");
                setSelectedUnit("");
              }}
            >
              <option value="">— Select semester —</option>
              {semesters.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="upload-field">
            <label className="upload-label">Subject</label>
            <select
              className="upload-select"
              value={selectedSubject}
              onChange={(v) => {
                setSelectedSubject(v.target.value);
                setSelectedUnit("");
              }}
              disabled={!semester}
            >
              <option value="">— Select subject —</option>
              {semester?.subjects.map((s) => (
                <option key={s.slug} value={s.slug}>{s.code} — {s.title}</option>
              ))}
            </select>
          </div>

          {/* Unit */}
          <div className="upload-field">
            <label className="upload-label">Unit</label>
            <select
              className="upload-select"
              value={selectedUnit}
              onChange={(v) => setSelectedUnit(v.target.value)}
              disabled={!subject}
            >
              <option value="">— Select unit —</option>
              {subject?.units.map((u) => (
                <option key={u.slug} value={u.slug}>{u.title}</option>
              ))}
            </select>
          </div>

          {/* Note Type */}
          <div className="upload-field">
            <label className="upload-label">Note Type</label>
            <div className="upload-radio-group">
              <button
                className={`upload-radio-btn${noteType === "pdf" ? " active" : ""}`}
                onClick={() => setNoteType("pdf")}
              >PDF Notes</button>
              <button
                className={`upload-radio-btn${noteType === "handwritten" ? " active" : ""}`}
                onClick={() => setNoteType("handwritten")}
              >Handwritten Notes</button>
            </div>
          </div>

          {/* File Picker */}
          <div className="upload-field">
            <label className="upload-label">File</label>
            <div className="upload-file-area">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="upload-file-input"
                id="pdf-file-input"
              />
              <label htmlFor="pdf-file-input" className="upload-file-label">
                {file ? (
                  <>
                    <i className="bx bxs-file-pdf" style={{ fontSize: "1.3rem", color: "#ef4444" }}></i>
                    <span>{file.name}</span>
                    <span className="upload-file-size">
                      {file.size > 1024 * 1024
                        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
                        : `${(file.size / 1024).toFixed(0)} KB`}
                    </span>
                  </>
                ) : (
                  <>
                    <i className="bx bx-upload" style={{ fontSize: "1.5rem" }}></i>
                    <span>Click to select a PDF file</span>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="upload-actions">
            <button
              className="upload-btn"
              onClick={handleUpload}
              disabled={!canSubmit || uploadState === "getting-url" || uploadState === "uploading"}
            >
              {uploadState === "getting-url" ? (
                <><i className="bx bx-loader-alt bx-spin"></i> Preparing...</>
              ) : uploadState === "uploading" ? (
                <><i className="bx bx-loader-alt bx-spin"></i> Uploading...</>
              ) : (
                <><i className="bx bx-cloud-upload"></i> Upload to Supabase</>
              )}
            </button>
            <button className="upload-btn upload-btn-secondary" onClick={resetForm}>
              <i className="bx bx-reset"></i> Reset
            </button>
          </div>

          {/* Upload progress hint */}
          {uploadState === "uploading" && file && (
            <div className="upload-message" style={{ background: "var(--bg-app-2)", border: "none" }}>
              <i className="bx bx-time"></i>
              <span>Uploading {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB) directly to Supabase…</span>
            </div>
          )}

          {/* Error */}
          {uploadState === "error" && (
            <div className="upload-message upload-message-error">
              <i className="bx bx-error-circle"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success */}
          {uploadState === "success" && result && (
            <div className="upload-message upload-message-success">
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <i className="bx bx-check-circle"></i>
                <span style={{ fontWeight: 700 }}>File uploaded successfully!</span>
              </div>
              <div className="upload-result-details">
                <div><strong>File:</strong> {result.name}</div>
                <div><strong>Path:</strong> <code>{result.path}</code></div>
                <div>
                  <strong>URL:</strong>{" "}
                  <a href={result.url} target="_blank" rel="noreferrer noopener" className="upload-result-link">
                    {result.url.slice(0, 60)}...
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Path preview */}
          {selectedSemester && selectedSubject && selectedUnit && (
            <div className="upload-path-preview">
              <span className="upload-label" style={{ fontSize: "0.72rem", marginBottom: "0.25rem" }}>
                Storage path preview
              </span>
              <code>{selectedSemester}/{selectedSubject}/{selectedUnit}/filename.pdf</code>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
