"use client";

import { useState, useEffect, useMemo } from "react";
import { semesters } from "@/content/subjects";
import { lectureVideos } from "@/content/lectures";
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
  lecture_video_id: string | null;
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
  const [filterSemester, setFilterSemester] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFormat, setFilterFormat] = useState("");

  const filteredSubjects = filterSemester
    ? semesters.find((s) => s.key === filterSemester)?.subjects || []
    : [];

  useEffect(() => {
    const stored = localStorage.getItem(ADMIN_KEY_STORAGE);
    if (stored) {
      setAdminKey(stored);
      setAuthenticated(true);
    }
  }, []);

  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [linkingNoteId, setLinkingNoteId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  const fetchNotes = async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "500" });
      if (filterSemester) params.set("semester", filterSemester);
      if (filterSubject) params.set("subject", filterSubject);
      if (filterFormat) params.set("format", filterFormat);
      const res = await fetch(`/api/notes?${params}`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data.notes || []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const getLecturesForSemester = (note: NoteRecord) => {
    const semKey = note.semester_key.replace("semester-", "Semester ");
    const subTitle = getSubjectTitle(note.semester_key, note.subject_slug);
    return lectureVideos.filter((v) => v.semester.startsWith(semKey) && v.subject === subTitle);
  };

  const handleLinkVideo = async (noteId: string, videoId: string | null) => {
    if (!videoId) return;
    try {
      const key = localStorage.getItem(ADMIN_KEY_STORAGE);
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": key || "" },
        body: JSON.stringify({ lecture_video_id: videoId }),
      });
      if (!res.ok) throw new Error("Failed to link video");
      setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, lecture_video_id: videoId } : n)));
      setLinkingNoteId(null);
      setSelectedVideo("");
    } catch (err) {
      alert("Failed to link video: " + (err as Error).message);
    }
  };

  const handleRemoveLink = async (noteId: string) => {
    try {
      const key = localStorage.getItem(ADMIN_KEY_STORAGE);
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": key || "" },
        body: JSON.stringify({ lecture_video_id: null }),
      });
      if (!res.ok) throw new Error("Failed to remove link");
      setNotes((prev) => prev.map((n) => (n.id === noteId ? { ...n, lecture_video_id: null } : n)));
    } catch (err) {
      alert("Failed to remove link: " + (err as Error).message);
    }
  };

  const grouped = useMemo(() => {
    const groups: Record<string, NoteRecord[]> = {};
    for (const note of notes) {
      const semLabel = getSemesterLabel(note.semester_key);
      const subTitle = getSubjectTitle(note.semester_key, note.subject_slug);
      const key = `${semLabel} › ${subTitle}`;
      if (!groups[key]) groups[key] = [];
      groups[key].push(note);
    }
    return groups;
  }, [notes]);

  useEffect(() => {
    if (!authenticated) return;
    fetchNotes();
  }, [authenticated, filterSemester, filterSubject, filterFormat]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/storage/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
        body: JSON.stringify({ bucket: "notes" }),
      });
      const data = await res.json();
      if (data.synced > 0) {
        setSyncMsg(`Synced ${data.synced} file${data.synced > 1 ? "s" : ""} to the database.`);
      } else if (data.total_orphans === 0) {
        setSyncMsg("All storage files already have database entries.");
      } else {
        setSyncMsg(`Found ${data.total_orphans} orphan(s) but could not sync them.`);
      }
      await fetchNotes();
    } catch {
      setSyncMsg("Failed to sync files");
    } finally {
      setSyncing(false);
    }
  };

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

        {!loading && (
          <div className="upload-card" style={{ padding: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
              <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                {notes.length} PDF{notes.length !== 1 ? "s" : ""} total
              </span>
              <button
                className="upload-btn"
                onClick={handleSync}
                disabled={syncing}
                style={{ fontSize: "0.72rem", padding: "0.35rem 0.6rem" }}
              >
                <i className={`bx ${syncing ? "bx-loader-alt bx-spin" : "bx-refresh"}`}></i>
                {syncing ? "Syncing..." : "Sync Notes"}
              </button>
            </div>

            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
              <select
                className="upload-select"
                value={filterSemester}
                onChange={(v) => {
                  setFilterSemester(v.target.value);
                  setFilterSubject("");
                }}
                style={{ flex: 1, minWidth: 100, fontSize: "0.75rem", padding: "0.5rem 0.7rem", margin: 0 }}
              >
                <option value="">All Semesters</option>
                {semesters.map((s) => (
                  <option key={s.key} value={s.key}>{s.label}</option>
                ))}
              </select>
              <select
                className="upload-select"
                value={filterSubject}
                onChange={(v) => setFilterSubject(v.target.value)}
                disabled={!filterSemester}
                style={{ flex: 1, minWidth: 100, fontSize: "0.75rem", padding: "0.5rem 0.7rem", margin: 0 }}
              >
                <option value="">All Subjects</option>
                {filteredSubjects.map((s) => (
                  <option key={s.slug} value={s.slug}>{s.title}</option>
                ))}
              </select>
              <select
                className="upload-select"
                value={filterFormat}
                onChange={(v) => setFilterFormat(v.target.value)}
                style={{ flex: 1, minWidth: 80, fontSize: "0.75rem", padding: "0.5rem 0.7rem", margin: 0 }}
              >
                <option value="">All Formats</option>
                <option value="pdf">PDF</option>
                <option value="handwritten">Handwritten</option>
              </select>
            </div>

            {syncMsg && (
              <div className="upload-message" style={{ fontSize: "0.75rem", marginBottom: "0.75rem", background: "var(--bg-app-2)", border: "none" }}>
                <i className="bx bx-info-circle"></i>
                <span>{syncMsg}</span>
              </div>
            )}

            {notes.length > 0 && (
              <div className="subject-stack" style={{ gap: "0.75rem" }}>
                {Object.entries(grouped).map(([groupKey, items]) => (
                  <div key={groupKey}>
                    <h4 style={{ fontSize: "0.82rem", fontWeight: 600, margin: "0 0 0.4rem", color: "var(--text-muted)" }}>
                      {groupKey} ({items.length})
                    </h4>
                    <div className="unit-notes-list">
                      {items.map((note) => (
                        <div key={note.id} style={{ display: "flex", flexDirection: "column", gap: "0.4rem", padding: "0.55rem 0.75rem", borderRadius: 14, background: "var(--bg-card)", border: "1px solid var(--border)", minHeight: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{note.title}</div>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem", marginTop: "0.15rem" }}>
                                <span className="sheet-badge" style={{ fontSize: "0.6rem" }}>{getUnitTitle(note.semester_key, note.subject_slug, note.unit_slug)}</span>
                                <span className="sheet-badge" style={{ fontSize: "0.6rem", background: note.format === "handwritten" ? "var(--bg-app-2)" : "var(--primary-light)", color: note.format === "handwritten" ? "var(--text-muted)" : "var(--primary)" }}>
                                  {note.format}
                                </span>
                                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>
                                  {new Date(note.created_at).toLocaleDateString()}
                                </span>
                              </div>
                              {note.lecture_video_id && (() => {
                                const vid = lectureVideos.find(v => v.id === note.lecture_video_id);
                                return vid ? (
                                  <div style={{ fontSize: "0.65rem", color: "var(--primary)", marginTop: "0.15rem" }}>
                                    <i className="bx bx-video"></i> {vid.title.slice(0, 60)}...
                                  </div>
                                ) : null;
                              })()}
                            </div>
                            <a href={note.public_url} target="_blank" rel="noopener noreferrer" className="upload-btn" style={{ textDecoration: "none", fontSize: "0.7rem", padding: "0.25rem 0.5rem", whiteSpace: "nowrap" }}>
                              <i className="bx bx-show"></i>
                            </a>
                            <button
                              className="upload-btn"
                              onClick={() => {
                                if (linkingNoteId === note.id) {
                                  setLinkingNoteId(null);
                                  setSelectedVideo("");
                                } else {
                                  setLinkingNoteId(note.id);
                                  setSelectedVideo(note.lecture_video_id || "");
                                }
                              }}
                              style={{ fontSize: "0.7rem", padding: "0.25rem 0.5rem", whiteSpace: "nowrap" }}
                            >
                              <i className={`bx ${note.lecture_video_id ? "bx-link-alt" : "bx-plus"}`}></i>
                            </button>
                          </div>
                          {linkingNoteId === note.id && (
                            <div style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                              <select
                                value={selectedVideo}
                                onChange={(e) => setSelectedVideo(e.target.value)}
                                style={{ flex: 1, fontSize: "0.7rem", padding: "0.3rem 0.5rem", borderRadius: 8, background: "var(--bg-app-2)", color: "var(--text)", border: "1px solid var(--border)" }}
                              >
                                <option value="">Select a lecture video...</option>
                                {getLecturesForSemester(note).map((v) => (
                                  <option key={v.id} value={v.id}>{v.subject}: {v.title.slice(0, 50)}</option>
                                ))}
                              </select>
                              <button
                                className="upload-btn"
                                onClick={() => handleLinkVideo(note.id, selectedVideo)}
                                disabled={!selectedVideo}
                                style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", whiteSpace: "nowrap" }}
                              >
                                Save
                              </button>
                              {note.lecture_video_id && (
                                <button
                                  className="upload-btn"
                                  onClick={() => handleRemoveLink(note.id)}
                                  style={{ fontSize: "0.65rem", padding: "0.2rem 0.5rem", whiteSpace: "nowrap", color: "var(--danger)" }}
                                >
                                  Unlink
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {notes.length === 0 && (
              <div className="empty-state">
                <i className="bx bxs-file-pdf" style={{ fontSize: "2.5rem", color: "var(--text-muted)" }}></i>
                <p>No PDFs match the selected filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
