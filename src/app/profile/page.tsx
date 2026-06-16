"use client";

import { useEffect, useMemo, useState } from "react";
import { semesters } from "@/content/subjects";
import { getTotalUnits } from "@/lib/progress";
import { BackNav } from "@/components/back-nav";

const storageKey = "bca-nepal-completed-units";

export default function ProfilePage() {
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);

  useEffect(() => {
    const loadCompleted = () => {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        try {
          setCompletedUnits(JSON.parse(raw) as string[]);
        } catch {
          setCompletedUnits([]);
        }
      } else {
        setCompletedUnits([]);
      }
    };
    loadCompleted();
    window.addEventListener("local-storage-update", loadCompleted);
    return () => window.removeEventListener("local-storage-update", loadCompleted);
  }, []);

  const totalUnits = useMemo(() => getTotalUnits(semesters), []);
  const completionRate = Math.round((completedUnits.length / totalUnits) * 100) || 0;

  return (
    <>
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h2>Profile</h2>
        <p>
          Track your study progress and manage preferences. Ready for Supabase
          user data later.
        </p>

        {/* Progress bar */}
        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)" }}>
              Progress
            </span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>
              {completionRate}%
            </span>
          </div>
          <div style={{ height: "10px", borderRadius: "999px", background: "var(--bg-app-2)" }}>
            <div
              style={{
                height: "10px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                width: `${completionRate}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </section>

      <h3 className="section-headline">Study Metrics</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <div className="app-stat-row">
          <div className="stat-bubble">
            <i className="bx bxs-book-alt"></i>
            <div>
              <div className="stat-val">{semesters.length}</div>
              <div className="stat-lbl">Semesters</div>
            </div>
          </div>
          <div className="stat-bubble">
            <i className="bx bxs-notepad"></i>
            <div>
              <div className="stat-val">{totalUnits}</div>
              <div className="stat-lbl">Total Units</div>
            </div>
          </div>
          <div className="stat-bubble">
            <i className="bx bxs-check-circle"></i>
            <div>
              <div className="stat-val">{completedUnits.length}</div>
              <div className="stat-lbl">Completed</div>
            </div>
          </div>
          <div className="stat-bubble">
            <i className="bx bxs-data"></i>
            <div>
              <div className="stat-val">Ready</div>
              <div className="stat-lbl">Supabase</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="section-headline">Features</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <div className="app-card" style={{ cursor: "default" }}>
          <div className="card-left">
            <span className="card-code">Theme</span>
            <span className="card-title">Dark / Light Mode</span>
            <span className="card-meta-inline">Toggle via the header icon</span>
          </div>
          <i className="bx bx-palette card-chevron"></i>
        </div>
        <div className="app-card" style={{ cursor: "default" }}>
          <div className="card-left">
            <span className="card-code">Notes</span>
            <span className="card-title">PDF + Handwritten</span>
            <span className="card-meta-inline">Organized by semester & unit</span>
          </div>
          <i className="bx bx-file card-chevron"></i>
        </div>
        <div className="app-card" style={{ cursor: "default" }}>
          <div className="card-left">
            <span className="card-code">Lectures</span>
            <span className="card-title">YouTube Integration</span>
            <span className="card-meta-inline">Direct links to video content</span>
          </div>
          <i className="bx bx-video card-chevron"></i>
        </div>
      </div>
    </>
  );
}