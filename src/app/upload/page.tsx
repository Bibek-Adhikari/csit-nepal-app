"use client";

import { useState, useRef } from "react";
import { semesters } from "@/content/subjects";

type UploadState = "idle" | "uploading" | "success" | "error";

export default function UploadPage() {
  const [selectedSemester, setSelectedSemester] = useState<string>("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");
  const [selectedUnit, setSelectedUnit] = useState<string>("");
  const [noteType, setNoteType] = useState<"pdf" | "handwritten">("pdf");
  const [file, setFile] = useState<File | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [result, setResult] = useState<{ path: string; url: string; name: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const semester = semesters.find((s) => s.key === selectedSemester);
  const subject = semester?.subjects.find((s) => s.slug === selectedSubject);

  const canSubmit = selectedSemester && selectedSubject && selectedUnit && file;

  const handleUpload = async () => {
    if (!canSubmit) return;
    setUploadState("uploading");
    setErrorMsg("");
    setResult(null);

    const folder = `${selectedSemester}/${selectedSubject}/${selectedUnit}`;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("bucket", "notes");
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/storage/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload failed");
      }

      setResult(data);
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

  return (
    <>
      <section className="welcome-hero">
        <div>
          <h2>Upload Notes</h2>
          <p>
            Upload PDF notes to Supabase storage. Select semester, subject, and
            unit, then pick a file to upload.
          </p>
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
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
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
                <option key={s.slug} value={s.slug}>
                  {s.code} — {s.title}
                </option>
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
                <option key={u.slug} value={u.slug}>
                  {u.title}
                </option>
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
              >
                PDF Notes
              </button>
              <button
                className={`upload-radio-btn${noteType === "handwritten" ? " active" : ""}`}
                onClick={() => setNoteType("handwritten")}
              >
                Handwritten Notes
              </button>
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
              disabled={!canSubmit || uploadState === "uploading"}
            >
              {uploadState === "uploading" ? (
                <>
                  <i className="bx bx-loader-alt bx-spin"></i>
                  Uploading...
                </>
              ) : (
                <>
                  <i className="bx bx-cloud-upload"></i>
                  Upload to Supabase
                </>
              )}
            </button>
            <button className="upload-btn upload-btn-secondary" onClick={resetForm}>
              <i className="bx bx-reset"></i>
              Reset
            </button>
          </div>

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
              <p className="upload-result-hint">
                Add this URL to <code>src/content/subjects/semester-N/index.ts</code> under the
                correct unit&apos;s <code>notes.{noteType}</code> array.
              </p>
            </div>
          )}

          {/* Uploaded path hint */}
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
