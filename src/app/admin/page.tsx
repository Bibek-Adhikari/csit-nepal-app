"use client";

import { useState, useEffect, useMemo } from "react";
import { semesters } from "@/content/subjects";
import { lectureVideos } from "@/content/lectures";
import { BackNav } from "@/components/back-nav";
import Link from "next/link";

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

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [authError, setAuthError] = useState("");
  const [notes, setNotes] = useState<NoteRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterSemester, setFilterSemester] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterFormat, setFilterFormat] = useState("");
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [linkingNoteId, setLinkingNoteId] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [apiVideos, setApiVideos] = useState<{ id: string; subject: string; semester: string; title: string; thumbnail: string; semesterKey: string }[]>([]);

  useEffect(() => {
    fetch("/api/lectures")
      .then((r) => r.json())
      .then((d) => {
        if (d.videos) setApiVideos(d.videos);
      })
      .catch(() => {});
  }, []);

  const allVideos = useMemo(() => {
    const merged: typeof lectureVideos = [];
    const existingIds = new Set<string>();
    for (const v of apiVideos) {
      merged.push({ id: v.id, title: v.title || "", duration: "", meta: "", tag: "", semester: v.semester, subject: v.subject, thumbnail: v.thumbnail || `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`, semesterKey: v.semesterKey || "" });
      existingIds.add(v.id);
    }
    for (const v of lectureVideos) {
      if (!existingIds.has(v.id)) {
        merged.push(v);
        existingIds.add(v.id);
      }
    }
    return merged;
  }, [apiVideos]);

  const filteredSubjects = filterSemester
    ? semesters.find((s) => s.key === filterSemester)?.subjects || []
    : [];

  const handleLinkVideo = async (noteId: string, videoId: string | null) => {
    if (!videoId) return;
    try {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
    let cancelled = false;
    const doFetch = async () => {
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
        if (!cancelled) setNotes(data.notes || []);
      } catch (err) {
        if (!cancelled) setError((err as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    doFetch();
    return () => { cancelled = true; };
  }, [authenticated, filterSemester, filterSubject, filterFormat, refreshKey]);

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      const res = await fetch("/api/storage/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
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
      setRefreshKey(k => k + 1);
    } catch {
      setSyncMsg("Failed to sync files");
    } finally {
      setSyncing(false);
    }
  };

  const handleLogin = async () => {
    setAuthError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        setAuthError("Invalid admin key");
        return;
      }
      setAuthenticated(true);
    } catch {
      setAuthError("Something went wrong, try again");
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setAuthenticated(false);
    setNotes([]);
  };

  if (!authenticated) {
    return (
      <>
        <BackNav href="/profile" label="Profile" />
        <div className="admin-login-page">
          <div className="admin-login-icon">
            <i className="bx bxs-shield-alt-2"></i>
          </div>
          <h1 className="admin-login-title">Admin Panel</h1>
          <p className="admin-login-desc">Enter the admin key to manage PDFs.</p>
          <div className="admin-login-card">
            <div className="admin-login-field">
              <label className="admin-login-label">Admin Key</label>
              <input
                type="password"
                className="admin-login-input"
                placeholder="Enter admin key..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleLogin(); }}
              />
            </div>
            {authError && (
              <div className="admin-login-error">
                <i className="bx bx-error-circle"></i>
                <span>{authError}</span>
              </div>
            )}
            <button className="admin-login-btn" onClick={handleLogin}>
              <i className="bx bx-lock-open"></i> Login
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <BackNav href="/profile" label="Profile" />
      <div className="admin-dashboard">
        <div className="admin-header">
          <div>
            <h1 className="admin-title">Admin Panel</h1>
            <p className="admin-subtitle">Manage all uploaded PDFs</p>
          </div>
          <div className="admin-header-actions">
            <Link href="/upload" className="admin-btn admin-btn-primary">
              <i className="bx bx-cloud-upload"></i> Upload
            </Link>
            <button onClick={handleLogout} className="admin-btn admin-btn-ghost" title="Logout">
              <i className="bx bx-log-out"></i>
            </button>
          </div>
        </div>

        {loading && (
          <div className="admin-loading">
            <i className="bx bx-loader-alt bx-spin"></i>
            <p>Loading PDFs...</p>
          </div>
        )}

        {error && (
          <div className="admin-alert admin-alert-error">
            <i className="bx bx-error-circle"></i>
            <span>{error}</span>
          </div>
        )}

        {!loading && (
          <>
            <div className="admin-toolbar">
              <div className="admin-toolbar-left">
                <span className="admin-count">{notes.length} PDF{notes.length !== 1 ? "s" : ""}</span>
              </div>
              <div className="admin-toolbar-right">
                <button className="admin-btn admin-btn-outline" onClick={handleSync} disabled={syncing}>
                  <i className={`bx ${syncing ? "bx-loader-alt bx-spin" : "bx-refresh"}`}></i>
                  {syncing ? "Syncing..." : "Sync"}
                </button>
              </div>
            </div>

            <div className="admin-filters-bar">
              <div className="admin-filter-group">
                <label className="admin-filter-label">Semester</label>
                <select
                  className="admin-filter-select"
                  value={filterSemester}
                  onChange={(v) => { setFilterSemester(v.target.value); setFilterSubject(""); }}
                >
                  <option value="">All Semesters</option>
                  {semesters.map((s) => (
                    <option key={s.key} value={s.key}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-filter-group">
                <label className="admin-filter-label">Subject</label>
                <select
                  className="admin-filter-select"
                  value={filterSubject}
                  onChange={(v) => setFilterSubject(v.target.value)}
                  disabled={!filterSemester}
                >
                  <option value="">All Subjects</option>
                  {filteredSubjects.map((s) => (
                    <option key={s.slug} value={s.slug}>{s.title}</option>
                  ))}
                </select>
              </div>
              <div className="admin-filter-group">
                <label className="admin-filter-label">Format</label>
                <select
                  className="admin-filter-select"
                  value={filterFormat}
                  onChange={(v) => setFilterFormat(v.target.value)}
                >
                  <option value="">All Formats</option>
                  <option value="pdf">PDF</option>
                  <option value="handwritten">Handwritten</option>
                </select>
              </div>
            </div>

            {syncMsg && (
              <div className="admin-alert admin-alert-info">
                <i className="bx bx-info-circle"></i>
                <span>{syncMsg}</span>
              </div>
            )}

            {notes.length === 0 && (
              <div className="admin-empty">
                <i className="bx bxs-file-pdf"></i>
                <p>No PDFs match the selected filters.</p>
              </div>
            )}

            {notes.length > 0 && (
              <div className="admin-groups">
                {Object.entries(grouped).map(([groupKey, items]) => (
                  <div key={groupKey} className="admin-group">
                    <div className="admin-group-head">
                      <h3 className="admin-group-title">
                        <i className="bx bxs-folder-open"></i> {groupKey}
                      </h3>
                      <span className="admin-group-count">{items.length} file{items.length !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="admin-notes-grid">
                      {items.map((note) => {
                        const currentVid = lectureVideos.find(v => v.id === note.lecture_video_id);
                        return (
                          <div key={note.id} className={`admin-note-card ${note.lecture_video_id ? "admin-note-linked" : ""}`}>
                            <div className="admin-note-top">
                              <div className="admin-note-icon">
                                <i className={`bx ${note.format === "handwritten" ? "bx-pencil" : "bxs-file-pdf"}`}></i>
                              </div>
                              <div className="admin-note-info">
                                <div className="admin-note-name">{note.title}</div>
                                <div className="admin-note-unit">{getUnitTitle(note.semester_key, note.subject_slug, note.unit_slug)}</div>
                              </div>
                            </div>

                            <div className="admin-note-badges">
                              <span className={`admin-badge ${note.format === "handwritten" ? "admin-badge-hw" : "admin-badge-pdf"}`}>
                                {note.format === "handwritten" ? "Handwritten" : "PDF"}
                              </span>
                              <span className="admin-badge admin-badge-date">{formatDate(note.created_at)}</span>
                              {currentVid && (
                                <span className="admin-badge admin-badge-video" title={currentVid.title}>
                                  <i className="bx bx-video"></i> Linked
                                </span>
                              )}
                            </div>

                            <div className="admin-note-actions">
                              <a
                                href={note.public_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="admin-btn admin-btn-sm admin-btn-outline"
                              >
                                <i className="bx bx-show"></i> View
                              </a>
                              <button
                                className={`admin-btn admin-btn-sm ${linkingNoteId === note.id ? "admin-btn-active" : "admin-btn-outline"}`}
                                onClick={() => {
                                  if (linkingNoteId === note.id) { setLinkingNoteId(null); setSelectedVideo(""); }
                                  else { setLinkingNoteId(note.id); setSelectedVideo(note.lecture_video_id || ""); }
                                }}
                              >
                                <i className={`bx ${note.lecture_video_id ? "bx-link-alt" : "bx-link"}`}></i>
                                {note.lecture_video_id ? "Change" : "Link"}
                              </button>
                            </div>

                            {linkingNoteId === note.id && (
                              <div className="admin-link-panel">
                                <div className="admin-link-panel-title">Select a lecture video</div>
                                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, maxHeight: 320, overflowY: "auto", padding: "4px 0" }}>
                                  {allVideos.map((v) => (
                                    <button
                                      key={v.id}
                                      onClick={() => setSelectedVideo(v.id === selectedVideo ? "" : v.id)}
                                      style={{
                                        width: 140,
                                        flexShrink: 0,
                                        border: v.id === selectedVideo ? "2px solid var(--accent)" : "2px solid var(--border)",
                                        borderRadius: 8,
                                        overflow: "hidden",
                                        cursor: "pointer",
                                        background: "var(--bg-card)",
                                        padding: 0,
                                        textAlign: "left",
                                        transition: "border-color .15s",
                                      }}
                                    >
                                      <img
                                        src={v.thumbnail}
                                        alt={v.title}
                                        style={{ width: "100%", height: 78, objectFit: "cover", display: "block" }}
                                      />
                                      <div style={{ padding: "4px 6px", fontSize: "0.65rem", lineHeight: 1.3, color: "var(--text-muted)" }}>
                                        <div style={{ fontWeight: 600, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.subject}</div>
                                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title.slice(0, 40)}</div>
                                      </div>
                                    </button>
                                  ))}
                                </div>
                                <div className="admin-link-btns" style={{ marginTop: 8 }}>
                                  <button
                                    className="admin-btn admin-btn-sm admin-btn-primary"
                                    onClick={() => handleLinkVideo(note.id, selectedVideo)}
                                    disabled={!selectedVideo}
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="admin-btn admin-btn-sm admin-btn-ghost"
                                    onClick={() => { setLinkingNoteId(null); setSelectedVideo(""); }}
                                  >
                                    Cancel
                                  </button>
                                  {note.lecture_video_id && (
                                    <button
                                      className="admin-btn admin-btn-sm admin-btn-danger"
                                      onClick={() => handleRemoveLink(note.id)}
                                    >
                                      Unlink
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
