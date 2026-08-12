"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BackNav } from "@/components/back-nav";

const COUNT_OPTIONS = [10, 20, 30, 50, 100];

const SUBJECTS = [
  { key: "english", label: "English", icon: "bx-book" },
  { key: "math", label: "Mathematics", icon: "bx-calculator" },
  { key: "gk", label: "General Knowledge", icon: "bx-globe" },
  { key: "all", label: "All Subjects", icon: "bx-shuffle" },
] as const;

export default function MockTestConfigPage() {
  const router = useRouter();
  const [questionCount, setQuestionCount] = useState(20);
  const [subject, setSubject] = useState("english");

  const totalMinutes = questionCount <= 10 ? 10 : questionCount <= 20 ? 20 : questionCount <= 30 ? 30 : questionCount <= 50 ? 60 : 90;

  const handleStart = () => {
    router.push(`/mock-test/${subject}?count=${questionCount}`);
  };

  return (
    <>
      <BackNav href="/subjects/entrance" label="Entrance" />
      <section className="welcome-hero">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="bx bx-edit-alt" style={{ fontSize: "1.6rem", color: "var(--primary)" }}></i>
          <h2 style={{ margin: 0 }}>Mock Test</h2>
        </div>
        <p>Configure your test and start practicing.</p>
      </section>

      <div className="subject-stack">
        <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "1.25rem", padding: "1.25rem" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <i className="bx bx-question-mark" style={{ marginRight: "0.3rem" }}></i>Questions
            </label>
            <div className="badge-row" style={{ gap: "0.5rem" }}>
              {COUNT_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setQuestionCount(n)}
                  className={`sheet-badge${questionCount === n ? " accent" : ""}`}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.85rem" }}
                >
                  {n} Questions
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>
              <i className="bx bx-library" style={{ marginRight: "0.3rem" }}></i>Subject
            </label>
            <div className="badge-row" style={{ gap: "0.5rem" }}>
              {SUBJECTS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setSubject(s.key)}
                  className={`sheet-badge${subject === s.key ? " accent" : ""}`}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.85rem" }}
                >
                  <i className={`bx ${s.icon}`} style={{ marginRight: "0.3rem", verticalAlign: "middle" }}></i>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", gap: "1rem", fontSize: "0.82rem", color: "var(--text-muted)", paddingTop: "0.25rem" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <i className="bx bx-time"></i> {totalMinutes} min
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <i className="bx bx-question-mark"></i> {questionCount} questions
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <i className="bx bx-library"></i> {SUBJECTS.find((s) => s.key === subject)?.label ?? subject}
            </span>
          </div>
        </div>

        <button
          onClick={handleStart}
          className="upload-btn"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}
        >
          <i className="bx bx-play-circle" style={{ fontSize: "1.2rem" }}></i>
          Start Test
        </button>
      </div>
    </>
  );
}
