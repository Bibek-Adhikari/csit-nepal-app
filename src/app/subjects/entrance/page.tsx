"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { BackNav } from "@/components/back-nav";
import { entranceTopics } from "@/content/entrance";

type Question = {
  id: string;
  topic: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string | null;
};

type PDF = {
  id: string;
  title: string;
  public_url: string;
  year: string | null;
  file_name: string;
};

const MOCK_TEST_DURATION = 30 * 60;

export default function EntrancePage() {
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [allQuestions, setAllQuestions] = useState<Question[]>([]);
  const [pdfs, setPdfs] = useState<PDF[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [mockActive, setMockActive] = useState(false);
  const [mockIndex, setMockIndex] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<Record<string, string>>({});
  const [mockSubmitted, setMockSubmitted] = useState(false);
  const [mockQuestions, setMockQuestions] = useState<Question[]>([]);
  const [timeLeft, setTimeLeft] = useState(MOCK_TEST_DURATION);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/entrance/questions").then((r) => r.json()),
      fetch("/api/entrance/pdfs").then((r) => r.json()),
    ])
      .then(([qData, pData]) => {
        setAllQuestions(qData.questions ?? []);
        setPdfs(pData.pdfs ?? []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filteredQuestions = activeTopic === "all"
    ? allQuestions
    : allQuestions.filter((q) => q.topic === activeTopic);

  const startMockTest = useCallback(async () => {
    setMockActive(true);
    setMockSubmitted(false);
    setMockAnswers({});
    setMockIndex(0);
    setTimeLeft(MOCK_TEST_DURATION);
    try {
      const res = await fetch("/api/entrance/questions");
      const data = await res.json();
      const shuffled = (data.questions ?? []).sort(() => Math.random() - 0.5);
      setMockQuestions(shuffled);
    } catch {
      setMockQuestions([]);
    }
  }, []);

  useEffect(() => {
    if (!mockActive || mockSubmitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          setMockSubmitted(true);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mockActive, mockSubmitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };

  const correctCount = mockSubmitted
    ? mockQuestions.filter((q) => mockAnswers[q.id] === q.correct_answer).length
    : 0;

  if (mockActive) {
    const q = mockQuestions[mockIndex];
    return (
      <>
        <BackNav href="/subjects" label="All Subjects" />
        <section className="welcome-hero">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2 style={{ margin: 0 }}>Mock Test</h2>
            <span style={{ fontWeight: 700, fontSize: "1.1rem", color: timeLeft < 60 ? "#dc2626" : "var(--primary)" }}>
              {formatTime(timeLeft)}
            </span>
          </div>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)" }}>
            Question {mockIndex + 1} of {mockQuestions.length}
          </p>
        </section>

        {mockSubmitted ? (
          <section style={{ padding: "0 1rem 2rem" }}>
            <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.75rem", padding: "1.25rem" }}>
              <h3 style={{ margin: 0, textAlign: "center" }}>Test Complete</h3>
              <div style={{ textAlign: "center", fontSize: "2rem", fontWeight: 700, color: "var(--primary)" }}>
                {correctCount} / {mockQuestions.length}
              </div>
              <div style={{ height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${(correctCount / mockQuestions.length) * 100}%`, background: "var(--primary)", borderRadius: 999 }} />
              </div>
              <button className="upload-btn" onClick={() => setMockActive(false)} style={{ marginTop: "0.5rem" }}>
                Back to Entrance
              </button>
            </div>
            {mockQuestions.map((mq, i) => {
              const ua = mockAnswers[mq.id];
              const isCorrect = ua === mq.correct_answer;
              return (
                <div key={mq.id} className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.5rem", padding: "1rem", marginTop: "0.5rem" }}>
                  <div style={{ fontSize: "0.82rem", fontWeight: 600 }}>{i + 1}. {mq.question}</div>
                  {mq.options.map((opt) => {
                    let bg = "transparent";
                    if (opt === mq.correct_answer) bg = "#dcfce7";
                    else if (opt === ua && !isCorrect) bg = "#fee2e2";
                    return (
                      <div key={opt} style={{ fontSize: "0.82rem", padding: "0.4rem 0.6rem", borderRadius: 8, background: bg, border: "1px solid #e2e8f0" }}>
                        {opt}
                      </div>
                    );
                  })}
                  {mq.explanation && (
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{mq.explanation}</div>
                  )}
                </div>
              );
            })}
          </section>
        ) : q ? (
          <section style={{ padding: "0 1rem 2rem" }}>
            <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.75rem", padding: "1.25rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.95rem" }}>{q.question}</div>
              {q.options.map((opt) => (
                <label
                  key={opt}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 0.75rem",
                    borderRadius: 10,
                    border: `1px solid ${mockAnswers[q.id] === opt ? "var(--primary)" : "#e2e8f0"}`,
                    background: mockAnswers[q.id] === opt ? "var(--primary-light)" : "transparent",
                    cursor: "pointer",
                    fontSize: "0.88rem",
                  }}
                >
                  <input
                    type="radio"
                    name={`mock-${q.id}`}
                    checked={mockAnswers[q.id] === opt}
                    onChange={() => setMockAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                    style={{ accentColor: "var(--primary)" }}
                  />
                  {opt}
                </label>
              ))}
            </div>
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}>
              <button
                className="upload-btn upload-btn-secondary"
                disabled={mockIndex === 0}
                onClick={() => setMockIndex((i) => i - 1)}
              >
                Previous
              </button>
              {mockIndex < mockQuestions.length - 1 ? (
                <button className="upload-btn" onClick={() => setMockIndex((i) => i + 1)}>
                  Next
                </button>
              ) : (
                <button className="upload-btn" onClick={() => setMockSubmitted(true)}>
                  Submit
                </button>
              )}
            </div>
          </section>
        ) : (
          <section style={{ padding: "0 1rem 2rem" }}>
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>No questions available.</p>
          </section>
        )}
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
        <p>BCA entrance exam prep — Questions, Mock Tests & study materials.</p>
      </section>

      <h3 className="section-headline">Questions</h3>
      <div className="badge-row" style={{ padding: "0 1rem" }}>
        <button
          onClick={() => { setActiveTopic("all"); setShowResults(false); setSelectedAnswers({}); }}
          className={`sheet-badge${activeTopic === "all" ? " accent" : ""}`}
          style={{ background: "none", border: "none", cursor: "pointer" }}
        >
          All
        </button>
        {entranceTopics.map((t) => (
          <button
            key={t.slug}
            onClick={() => { setActiveTopic(t.slug); setShowResults(false); setSelectedAnswers({}); }}
            className={`sheet-badge${activeTopic === t.slug ? " accent" : ""}`}
            style={{ background: "none", border: "none", cursor: "pointer" }}
          >
            <i className={`bx ${t.icon}`} style={{ marginRight: "0.25rem" }}></i>
            {t.title}
          </button>
        ))}
      </div>

      <div className="subject-stack">
        {loading ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>Loading questions...</p>
        ) : filteredQuestions.length === 0 ? (
          <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>No questions yet.</p>
        ) : (
          filteredQuestions.map((q) => (
            <div key={q.id} className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.6rem", padding: "1rem" }}>
              <div style={{ fontWeight: 600, fontSize: "0.88rem" }}>{q.question}</div>
              {q.options.map((opt) => {
                const isCorrect = showResults && opt === q.correct_answer;
                const isWrong = showResults && selectedAnswers[q.id] === opt && opt !== q.correct_answer;
                let bg = "transparent";
                if (isCorrect) bg = "#dcfce7";
                else if (isWrong) bg = "#fee2e2";
                return (
                  <label
                    key={opt}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      padding: "0.5rem 0.65rem",
                      borderRadius: 8,
                      border: `1px solid ${selectedAnswers[q.id] === opt ? "var(--primary)" : "#e2e8f0"}`,
                      background: bg || (selectedAnswers[q.id] === opt ? "var(--primary-light)" : "transparent"),
                      cursor: showResults ? "default" : "pointer",
                      fontSize: "0.85rem",
                    }}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={selectedAnswers[q.id] === opt}
                      onChange={() => !showResults && setSelectedAnswers((prev) => ({ ...prev, [q.id]: opt }))}
                      style={{ accentColor: "var(--primary)" }}
                      disabled={showResults}
                    />
                    {opt}
                  </label>
                );
              })}
              {showResults && q.explanation && (
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>
                  <i className="bx bx-info-circle"></i> {q.explanation}
                </div>
              )}
            </div>
          ))
        )}
        {!loading && filteredQuestions.length > 0 && !showResults && (
          <button className="upload-btn" onClick={() => setShowResults(true)}>
            Check Answers
          </button>
        )}
      </div>

      {pdfs.length > 0 && (
        <>
          <h3 className="section-headline" style={{ marginTop: "1rem" }}>Old Questions</h3>
          <div className="subject-stack">
            {pdfs.map((pdf) => (
              <a
                key={pdf.id}
                href={pdf.public_url}
                target="_blank"
                rel="noreferrer noopener"
                className="app-card"
                style={{ alignItems: "center" }}
              >
                <div className="card-left">
                  <span className="card-code">
                    <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
                    {pdf.title}
                  </span>
                  {pdf.year && (
                    <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{pdf.year}</span>
                  )}
                </div>
                <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
              </a>
            ))}
          </div>
        </>
      )}

      <h3 className="section-headline" style={{ marginTop: "1rem" }}>Mock Test</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <div
          className="app-card"
          style={{ alignItems: "center", cursor: "pointer", border: "1px solid var(--primary)" }}
          onClick={startMockTest}
        >
          <div className="card-left">
            <span className="card-code">
              <i className="bx bx-timer" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>
              Start Mock Test
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              <i className="bx bx-time"></i>
              30 minutes · All topics
            </span>
          </div>
          <i className="bx bx-play-circle card-chevron" style={{ fontSize: "1.3rem", color: "var(--primary)" }}></i>
        </div>
      </div>
    </>
  );
}
