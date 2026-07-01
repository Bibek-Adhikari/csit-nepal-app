"use client";

import { useEffect, useState } from "react";
import { entranceTopics } from "@/content/entrance";
import { BackNav } from "@/components/back-nav";

const LOCK_KEY = "bca-entrance-unlock-at";
const COUNTDOWN_HOURS = 48;

function getUnlockTime(): number {
  try {
    const stored = localStorage.getItem(LOCK_KEY);
    if (stored) {
      const parsed = Number(stored);
      if (!isNaN(parsed)) return parsed;
    }
  } catch {}
  const unlock = Date.now() + COUNTDOWN_HOURS * 60 * 60 * 1000;
  try { localStorage.setItem(LOCK_KEY, String(unlock)); } catch {}
  return unlock;
}

function formatTime(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(total / 86400);
  const h = Math.floor((total % 86400) / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return { d, h, m, s };
}

export default function EntrancePage() {
  const [unlocked, setUnlocked] = useState(false);
  const [time, setTime] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const unlockAt = getUnlockTime();

    function tick() {
      const remaining = unlockAt - Date.now();
      if (remaining <= 0) {
        setUnlocked(true);
        return;
      }
      setTime(formatTime(remaining));
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  if (!unlocked) {
    return (
      <>
        <BackNav href="/subjects" label="All Subjects" />
        <section className="welcome-hero" style={{ textAlign: "center", padding: "3rem 1rem" }}>
          <i className="bx bxs-lock-alt" style={{ fontSize: "3rem", color: "var(--primary)" }}></i>
          <h2>Entrance Preparation</h2>
          <p>This content is currently locked. Please check back when the countdown ends.</p>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "1rem",
            marginTop: "1.5rem",
            flexWrap: "wrap",
          }}>
            {[
              { label: "Days", value: time.d },
              { label: "Hours", value: time.h },
              { label: "Minutes", value: time.m },
              { label: "Seconds", value: time.s },
            ].map((unit) => (
              <div key={unit.label} style={{
                background: "var(--card-bg)",
                borderRadius: 12,
                padding: "0.75rem 1rem",
                minWidth: 70,
                textAlign: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{String(unit.value).padStart(2, "0")}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--text-muted)", marginTop: "0.15rem" }}>{unit.label}</div>
              </div>
            ))}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <BackNav href="/subjects" label="All Subjects" />
      <section className="welcome-hero">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="bx bxs-graduation" style={{ fontSize: "1.6rem", color: "var(--primary)" }}></i>
          <h2 style={{ margin: 0 }}>Entrance Preparation</h2>
        </div>
        <p>BCA entrance exam prep — Mathematics, English, Computer & GK.</p>
      </section>

      <div className="subject-stack">
        {entranceTopics.map((topic) => (
          <div key={topic.slug} className="app-card" style={{ alignItems: "center" }}>
            <div className="card-left">
              <span className="card-code">
                <i className={`bx ${topic.icon}`} style={{ marginRight: "0.35rem" }}></i>
                {topic.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-headline" style={{ marginTop: "1rem" }}>Old Questions</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <div className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
              BCA Entrance 2081
            </span>
          </div>
          <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
        </div>
        <div className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
              BCA Entrance 2080
            </span>
          </div>
          <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
        </div>
        <div className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
              BCA Entrance 2079
            </span>
          </div>
          <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
        </div>
      </div>
    </>
  );
}
