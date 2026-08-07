"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  getPendingShares,
  clearPendingShares,
  saveSharedImages,
} from "@/lib/db";
import type { PendingShare, SharedImage } from "@/lib/db";
import { semesters } from "@/content/subjects";
import type { SemesterKey } from "@/content/subjects";

export default function SharePage() {
  const searchParams = useSearchParams();
  const shared = searchParams.get("shared");

  const [pending, setPending] = useState<PendingShare[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<SemesterKey | "">("");
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const loadPending = useCallback(async () => {
    setLoading(true);
    const items = await getPendingShares();
    setPending(items);
    const urls: Record<string, string> = {};
    for (const item of items) {
      urls[item.id] = URL.createObjectURL(item.blob);
    }
    setPreviews(urls);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadPending();
    return () => {
      for (const url of Object.values(previews)) {
        URL.revokeObjectURL(url);
      }
    };
  }, []);

  const subjects = selectedSemester
    ? semesters.find((s) => s.key === selectedSemester)?.subjects || []
    : [];

  const handleConfirm = async () => {
    if (!selectedSemester || !selectedSubject || pending.length === 0) return;
    setSaving(true);
    const images: SharedImage[] = pending.map((p, i) => ({
      id: `shared-${Date.now()}-${i}`,
      name: p.name,
      blob: p.blob,
      semester: selectedSemester,
      subject: selectedSubject,
      savedAt: Date.now(),
    }));
    await saveSharedImages(images);
    await clearPendingShares();
    setSaving(false);
    setSaved(true);
  };

  const handleDiscard = async () => {
    await clearPendingShares();
    setPending([]);
  };

  if (saved) {
    return (
      <>
        <section className="welcome-hero">
          <h1>Images Saved!</h1>
          <p>Your shared images have been saved to the selected subject&apos;s notes.</p>
        </section>
        <div style={{ padding: "0 1rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <Link
            href="/profile"
            className="unit-note-card"
            style={{ textDecoration: "none", color: "inherit", justifyContent: "center" }}
          >
            <i className="bx bx-user" style={{ color: "var(--primary)" }}></i>
            <span className="unit-note-title">View in Profile</span>
          </Link>
          <Link
            href="/"
            className="unit-note-card"
            style={{ textDecoration: "none", color: "inherit", justifyContent: "center" }}
          >
            <i className="bx bx-home-alt" style={{ color: "var(--primary)" }}></i>
            <span className="unit-note-title">Go Home</span>
          </Link>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <section className="welcome-hero">
          <h1>Shared Images</h1>
          <p>Loading shared files...</p>
        </section>
        <div style={{ padding: "0 1rem 1.5rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 14, marginBottom: "0.75rem" }} />
          ))}
        </div>
      </>
    );
  }

  if (pending.length === 0) {
    return (
      <>
        <section className="welcome-hero">
          <h1>Share to BCA Nepal</h1>
          <p>{shared === "1" ? "No images were shared." : "Share images from your gallery to save them here."}</p>
        </section>
        <div className="empty-state">
          <i className="bx bx-image-add" style={{ fontSize: "3rem", color: "var(--text-muted)" }}></i>
          <p>
            {shared === "1"
              ? "The shared files were not images or could not be processed."
              : "Select images from your gallery and choose BCA Nepal to get started."}
          </p>
        </div>
      </>
    );
  }

  return (
    <>
      <section className="welcome-hero">
        <h1>Shared Images</h1>
        <p>{pending.length} image{pending.length > 1 ? "s" : ""} ready to save. Select a subject to categorize them.</p>
      </section>

      <div style={{ padding: "0 1rem 1.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "0.75rem", marginBottom: "1.5rem" }}>
          {pending.map((item) => (
            <div key={item.id} style={{ borderRadius: 12, overflow: "hidden", border: "1px solid var(--border)", aspectRatio: "1", background: "var(--bg-muted)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previews[item.id] || ""} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label htmlFor="semester-select" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem", color: "var(--text-muted)" }}>
            Semester
          </label>
          <select
            id="semester-select"
            value={selectedSemester}
            onChange={(e) => {
              setSelectedSemester(e.target.value as SemesterKey);
              setSelectedSubject("");
            }}
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-app)",
              color: "var(--text)",
              fontSize: "0.95rem",
            }}
          >
            <option value="">Select semester...</option>
            {semesters.map((sem) => (
              <option key={sem.key} value={sem.key}>{sem.label}</option>
            ))}
          </select>
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label htmlFor="subject-select" style={{ display: "block", fontSize: "0.82rem", fontWeight: 600, marginBottom: "0.35rem", color: "var(--text-muted)" }}>
            Subject
          </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedSemester}
            style={{
              width: "100%",
              padding: "0.65rem 0.85rem",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-app)",
              color: "var(--text)",
              fontSize: "0.95rem",
              opacity: selectedSemester ? 1 : 0.5,
            }}
          >
            <option value="">Select subject...</option>
            {subjects.map((sub) => (
              <option key={sub.slug} value={sub.slug}>{sub.title}</option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={handleDiscard}
            style={{
              flex: 1,
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "1px solid var(--border)",
              background: "var(--bg-muted)",
              color: "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Discard
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedSemester || !selectedSubject || saving}
            style={{
              flex: 2,
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "none",
              background: selectedSemester && selectedSubject ? "var(--primary)" : "var(--bg-muted)",
              color: selectedSemester && selectedSubject ? "#fff" : "var(--text-muted)",
              fontSize: "0.9rem",
              fontWeight: 600,
              cursor: selectedSemester && selectedSubject && !saving ? "pointer" : "not-allowed",
            }}
          >
            {saving ? "Saving..." : `Save ${pending.length} Image${pending.length > 1 ? "s" : ""}`}
          </button>
        </div>
      </div>
    </>
  );
}
