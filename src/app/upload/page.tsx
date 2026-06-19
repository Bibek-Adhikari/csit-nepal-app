"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { semesters } from "@/content/subjects";
import { lectureVideos } from "@/content/lectures";
import { BackNav } from "@/components/back-nav";

const ADMIN_KEY_STORAGE = "bca-nepal-admin-key";

type UploadState = "idle" | "getting-url" | "uploading" | "success" | "error";
type UploadTarget = "notes" | "lectures";

export default function UploadPage() {
  const [adminKey, setAdminKey] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");

  const [uploadTarget, setUploadTarget] = useState<UploadTarget>("notes");
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [noteType, setNoteType] = useState<"pdf" | "handwritten">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [result, setResult] = useState<{ path: string; url: string; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [isTableMissing, setIsTableMissing] = useState(false);
  const [dbInitState, setDbInitState] = useState<"idle" | "checking" | "done" | "error">("idle");
  const [dbInitSql, setDbInitSql] = useState("");
  const [dbInitUrl, setDbInitUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
    }
  }, []);

  const [apiVideos, setApiVideos] = useState<{ id: string; subject: string; semester: string }[]>([]);

  useEffect(() => {
    fetch("/api/lectures")
      .then((r) => r.json())
      .then((d) => {
        if (d.videos) setApiVideos(d.videos);
      })
      .catch(() => {});
  }, []);

  const allVideos = useMemo(() => {
    const merged = [...lectureVideos];
    const existingIds = new Set(merged.map((v) => v.id));
    for (const v of apiVideos) {
      if (!existingIds.has(v.id)) {
        merged.push({ id: v.id, title: (v as any).title || "", duration: "", meta: "", tag: "", semester: v.semester, subject: v.subject, thumbnail: "", semesterKey: (v as any).semesterKey || "" });
        existingIds.add(v.id);
      }
    }
    return merged;
  }, [apiVideos]);

  const semester = semesters.find((s) => s.key === selectedSemester);
  const subject = semester?.subjects.find((s) => s.slug === selectedSubject);
  const selectedLecture = allVideos.find((v) => v.id === selectedVideo);

  const subjectTitleToSlug: Record<string, string> = {};
  for (const sem of semesters) {
    for (const sub of sem.subjects) {
      subjectTitleToSlug[sub.title.toLowerCase()] = sub.slug;
    }
  }

  const canSubmit = authenticated && file && (uploadTarget === "notes"
    ? selectedSemester && selectedSubject && selectedUnit
    : selectedVideo);

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

    let folder: string;
    let bucket: string;

    if (uploadTarget === "lectures" && selectedLecture) {
      const semesterKey = selectedLecture.semesterKey;
      const subSlug = subjectTitleToSlug[selectedLecture.subject.toLowerCase()] || selectedLecture.subject.toLowerCase().replace(/\s+/g, "-");
      folder = `${semesterKey}/${subSlug}/lecture-${selectedLecture.id}`;
      bucket = "lectures";
    } else {
      folder = `${selectedSemester}/${selectedSubject}/${selectedUnit}`;
      bucket = "notes";
    }

    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-key": adminKey,
        },
        body: JSON.stringify({
          folder,
          bucket,
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
        if (data.code === "TABLE_NOT_FOUND") {
          setIsTableMissing(true);
          setUploadState("idle");
          return;
        }
        throw new Error((data.error as string) || "Failed to get upload URL");
      }

      const signedUrl = data.signedUrl as string;

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
    setSelectedVideo("");
    setNoteType("pdf");
    setFile(null);
    setUploadState("idle");
    setResult(null);
    setErrorMsg("");
    setIsTableMissing(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const runDbInit = async () => {
    setDbInitState("checking");
    try {
      const res = await fetch("/api/db/init", { method: "POST" });
      const data = await res.json();
      if (data.created) {
        setDbInitState("done");
        setIsTableMissing(false);
      } else {
        setDbInitSql(data.sql || "");
        setDbInitUrl(data.sqlEditorUrl || "");
        setDbInitState("error");
      }
    } catch {
      setDbInitState("error");
    }
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
          {/* Target Toggle */}
          <div className="upload-field">
            <label className="upload-label">Upload Target</label>
            <div className="upload-radio-group">
              <button
                className={`upload-radio-btn${uploadTarget === "notes" ? " active" : ""}`}
                onClick={() => setUploadTarget("notes")}
              ><i className="bx bx-book-bookmark"></i> Subject Notes</button>
              <button
                className={`upload-radio-btn${uploadTarget === "lectures" ? " active" : ""}`}
                onClick={() => setUploadTarget("lectures")}
              ><i className="bx bxl-youtube"></i> Lecture Notes</button>
            </div>
          </div>

          {uploadTarget === "notes" ? (
            <>
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
            </>
          ) : (
            <>
              {/* Video Selector */}
              <div className="upload-field">
                <label className="upload-label">Lecture Video</label>
                <select
                  className="upload-select"
                  value={selectedVideo}
                  onChange={(v) => setSelectedVideo(v.target.value)}
                >
                  <option value="">— Select lecture video —</option>
                  {allVideos.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.subject} — {(v as any).title ? (v as any).title.slice(0, 60) : v.id.slice(0, 12)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLecture && (
                <div className="upload-message" style={{ background: "var(--bg-app-2)", border: "none" }}>
                  <i className="bx bx-info-circle"></i>
                  <span>Uploading to <strong>lectures</strong> bucket &mdash; {selectedLecture.subject} ({selectedLecture.semester})</span>
                </div>
              )}
            </>
          )}

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
              <span>Uploading {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB) to <strong>{uploadTarget === "lectures" ? "lectures" : "notes"}</strong> bucket&hellip;</span>
            </div>
          )}

          {/* Error */}
          {uploadState === "error" && !isTableMissing && (
            <div className="upload-message upload-message-error">
              <i className="bx bx-error-circle"></i>
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Table missing — show setup */}
          {isTableMissing && dbInitState === "idle" && (
            <div className="upload-message upload-message-error">
              <i className="bx bx-database"></i>
              <div>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Database table missing</div>
                <p style={{ fontSize: "0.78rem", margin: 0 }}>The <code>notes</code> table has not been created in Supabase.</p>
                <button className="upload-btn" onClick={runDbInit} style={{ marginTop: "0.75rem", fontSize: "0.85rem" }}>
                  <i className="bx bx-wrench"></i>
                  Run Database Setup
                </button>
              </div>
            </div>
          )}

          {dbInitState === "checking" && (
            <div className="upload-message" style={{ background: "var(--bg-app-2)", border: "none" }}>
              <i className="bx bx-loader-alt bx-spin"></i>
              <span>Checking database setup&hellip;</span>
            </div>
          )}

          {dbInitState === "done" && (
            <div className="upload-message upload-message-success">
              <i className="bx bx-check-circle"></i>
              <span>Database ready! Try uploading again.</span>
            </div>
          )}

          {dbInitState === "error" && dbInitSql && (
            <div className="upload-message upload-message-error">
              <i className="bx bx-error-circle"></i>
              <div>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem" }}>Manual setup required</div>
                <p style={{ fontSize: "0.78rem", margin: "0 0 0.5rem" }}>
                  Open the Supabase SQL editor and run the SQL below:
                </p>
                {dbInitUrl && (
                  <a href={dbInitUrl} target="_blank" rel="noreferrer noopener" className="upload-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontSize: "0.85rem", marginBottom: "0.5rem", textDecoration: "none" }}>
                    <i className="bx bx-external-link"></i>
                    Open SQL Editor
                  </a>
                )}
                <pre style={{ fontSize: "0.7rem", background: "var(--bg-app)", padding: "0.75rem", borderRadius: 6, overflowX: "auto", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{dbInitSql}</pre>
                <button className="upload-btn upload-btn-secondary" onClick={() => navigator.clipboard.writeText(dbInitSql)} style={{ fontSize: "0.85rem" }}>
                  <i className="bx bx-copy"></i>
                  Copy SQL
                </button>
              </div>
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
                <div><strong>Bucket:</strong> {uploadTarget === "lectures" ? "lectures" : "notes"}</div>
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
          {uploadTarget === "notes" && selectedSemester && selectedSubject && selectedUnit && (
            <div className="upload-path-preview">
              <span className="upload-label" style={{ fontSize: "0.72rem", marginBottom: "0.25rem" }}>
                Storage path preview
              </span>
              <code>{selectedSemester}/{selectedSubject}/{selectedUnit}/filename.pdf</code>
            </div>
          )}
          {uploadTarget === "lectures" && selectedLecture && (
            <div className="upload-path-preview">
              <span className="upload-label" style={{ fontSize: "0.72rem", marginBottom: "0.25rem" }}>
                Storage path preview
              </span>
              <code>lectures/{selectedLecture.semesterKey}/{subjectTitleToSlug[selectedLecture.subject.toLowerCase()] || selectedLecture.subject.toLowerCase().replace(/\s+/g, "-")}/lecture-{selectedLecture.id}/filename.pdf</code>
            </div>
          )}
        </div>

        <div className="upload-card" style={{ marginTop: "1rem" }}>
          <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem" }}>Sync Storage Files</h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 0.75rem" }}>
            Scan the <strong>lectures</strong> bucket for orphaned files (uploaded via Supabase dashboard) and create database entries so they appear in the app.
          </p>
          <button
            className="upload-btn"
            onClick={async () => {
              try {
                const res = await fetch("/api/storage/sync", {
                  method: "POST",
                  headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                  body: JSON.stringify({ bucket: "lectures" }),
                });
                const data = await res.json();
                if (data.synced > 0) {
                  alert(`Synced ${data.synced} file${data.synced > 1 ? "s" : ""} to the database.`);
                } else if (data.total_orphans === 0) {
                  alert("No orphaned files found. All storage files already have database entries.");
                } else {
                  alert(`Found ${data.total_orphans} orphan(s) but could not sync them. Check server logs.`);
                }
              } catch {
                alert("Failed to sync files");
              }
            }}
          >
            <i className="bx bx-refresh"></i> Sync Lectures Bucket
          </button>
        </div>

        <div className="upload-card" style={{ marginTop: "1rem" }}>
          <h4 style={{ margin: "0 0 0.5rem", fontSize: "0.85rem" }}>YouTube Sync</h4>
          <p style={{ fontSize: "0.78rem", color: "var(--text-muted)", margin: "0 0 0.75rem" }}>
            Subscribe to YouTube PubSubHubbub so new videos appear instantly instead of waiting for the cache to expire.
          </p>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className="upload-btn"
              onClick={async () => {
                try {
                  const res = await fetch("/api/youtube/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                    body: JSON.stringify({ mode: "subscribe" }),
                  });
                  const data = await res.json();
                  alert(data.message || data.error || "Done");
                } catch {
                  alert("Failed to subscribe");
                }
              }}
            >
              <i className="bx bx-rss"></i> Subscribe
            </button>
            <button
              className="upload-btn upload-btn-secondary"
              onClick={async () => {
                try {
                  const res = await fetch("/api/youtube/subscribe", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
                    body: JSON.stringify({ mode: "unsubscribe" }),
                  });
                  const data = await res.json();
                  alert(data.message || data.error || "Done");
                } catch {
                  alert("Failed to unsubscribe");
                }
              }}
            >
              <i className="bx bx-block"></i> Unsubscribe
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
