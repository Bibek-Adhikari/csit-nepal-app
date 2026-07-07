"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BackNav } from "@/components/back-nav";
import { rawQuestionBank, toMockQuestion, type MockQuestion, type RawQuestion } from "@/content/entrance/questionBank";

type Answers = Record<number, number>;

const LETTERS = ["A", "B", "C", "D"];

const SUBJECT_MAP_TO_API: Record<string, string | undefined> = {
  english: "english",
  math: "mathematics",
  gk: "computer-gk",
  all: undefined,
};

const SUBJECT_MAP_TO_LOCAL: Record<string, string> = {
  english: "english",
  math: "math",
  gk: "gk",
  all: "mixed",
};

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MockTestQuizPage() {
  const params = useParams<{ subject: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const subject = params.subject;
  const questionCount = Math.min(Math.max(Number(searchParams.get("count")) || 20, 1), 30);

  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [endTime, setEndTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const totalMinutes = questionCount <= 10 ? 10 : questionCount <= 20 ? 20 : 30;
  const totalSeconds = totalMinutes * 60;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  useEffect(() => {
    let cancelled = false;

    async function loadQuestions() {
      setLoading(true);
      setError(null);

      try {
        const apiTopic = SUBJECT_MAP_TO_API[subject];
        const params = new URLSearchParams();
        if (apiTopic) params.set("topic", apiTopic);
        params.set("limit", String(Math.max(questionCount, 50)));

        const res = await fetch(`/api/entrance/questions?${params}`);
        const data = await res.json();

        if (!cancelled) {
          if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
            const shuffled = shuffleArray(data.questions);
            const selected = shuffled.slice(0, questionCount).map((q: any) => ({
              id: q.id,
              topic: q.topic,
              question: q.question,
              options: q.options,
              correct_answer: q.correct_answer,
              explanation: q.explanation ?? null,
            }));
            setQuestions(selected);
            setTimeLeft(totalSeconds);
            setLoading(false);
            return;
          }
        }
      } catch {
        // fall through to local
      }

      if (!cancelled) {
        const localKey = SUBJECT_MAP_TO_LOCAL[subject] ?? "mixed";
        const pool: RawQuestion[] = rawQuestionBank[localKey] ?? [];
        if (pool.length === 0) {
          setError("No questions available for this subject.");
          setLoading(false);
          return;
        }
        const shuffled = shuffleArray(pool);
        const selected = shuffled.slice(0, questionCount).map((r) => toMockQuestion(r, subject));
        setQuestions(selected);
        setTimeLeft(totalSeconds);
        setLoading(false);
      }
    }

    loadQuestions();
    return () => { cancelled = true; };
  }, [subject, questionCount, totalSeconds]);

  const finishTest = useCallback(() => {
    setSubmitted(true);
    setEndTime(Date.now());
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (loading || submitted || questions.length === 0) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); finishTest(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [loading, submitted, questions.length, finishTest]);

  useEffect(() => {
    if (!submitted || !dotsRef.current) return;
    const el = dotsRef.current.querySelector(".dot-current");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index, submitted]);

  const handleBack = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    router.push("/mock-test");
  };

  if (error) {
    return (
      <>
        <BackNav href="/mock-test" label="Mock Test" />
        <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
          <p style={{ color: "var(--danger)" }}>{error}</p>
          <button className="upload-btn" onClick={() => router.push("/mock-test")} style={{ marginTop: "1rem" }}>
            Back to Config
          </button>
        </div>
      </>
    );
  }

  if (loading) {
    return (
      <>
        <BackNav href="/mock-test" label="Mock Test" />
        <div style={{ padding: "3rem 1rem", textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            <i className="bx bx-loader bx-spin" style={{ color: "var(--primary)" }}></i>
          </div>
          <p style={{ color: "var(--text-muted)" }}>Loading questions...</p>
        </div>
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <BackNav href="/mock-test" label="Mock Test" />
        <div style={{ padding: "2rem 1rem", textAlign: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>No questions available.</p>
          <button className="upload-btn" onClick={() => router.push("/mock-test")} style={{ marginTop: "1rem" }}>
            Back to Config
          </button>
        </div>
      </>
    );
  }

  const q = questions[index];
  const fmtTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;
  const progressPct = questions.length ? ((index + 1) / questions.length) * 100 : 0;
  const timerColor = timeLeft < 60 ? "var(--danger)" : timeLeft < 300 ? "var(--warning, #d97706)" : "var(--primary)";
  const timerBg = "var(--primary-light)";

  if (submitted) {
    const timeTaken = endTime - startTime;
    const timeStr = endTime
      ? `${Math.floor(timeTaken / 60000)}:${String(Math.floor((timeTaken % 60000) / 1000)).padStart(2, "0")}`
      : "0:00";
    const total = questions.length;
    const correctCount = questions.filter((q_, i) => q_.options[answers[i] ?? -1] === q_.correct_answer).length;
    const wrongCount = total - correctCount;
    const percent = total ? Math.round((correctCount / total) * 100) : 0;
    const grade = percent >= 80 ? "Excellent" : percent >= 60 ? "Good" : percent >= 40 ? "Average" : "Needs Practice";
    const gradeColor = percent >= 80 ? "var(--success)" : percent >= 60 ? "var(--primary)" : percent >= 40 ? "var(--warning, #d97706)" : "var(--danger)";

    const topicBreakdown = questions.reduce<Record<string, { total: number; correct: number }>>((acc, q_, i) => {
      if (!acc[q_.topic]) acc[q_.topic] = { total: 0, correct: 0 };
      acc[q_.topic].total++;
      if (q_.options[answers[i] ?? -1] === q_.correct_answer) acc[q_.topic].correct++;
      return acc;
    }, {});

    return (
      <>
        <nav className="back-nav">
          <button onClick={handleBack} className="back-nav-link" style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", color: "inherit" }}>
            <i className="bx bx-chevron-left"></i>
            <span>Results</span>
          </button>
        </nav>
        <div className="subject-stack" style={{ padding: "0 1rem 2rem" }}>
          <section className="welcome-hero" style={{ marginBottom: 0, textAlign: "center" }}>
            <div style={{ fontSize: "2.8rem", fontWeight: 800, color: gradeColor, lineHeight: 1 }}>
              {percent}%
            </div>
            <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginTop: "0.25rem" }}>{grade}</div>
          </section>

          <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.75rem", padding: "1.25rem" }}>
            <div style={{ height: 10, background: "var(--slate-200)", borderRadius: 999, overflow: "hidden", marginBottom: "0.5rem" }}>
              <div style={{ height: "100%", width: `${percent}%`, borderRadius: 999, transition: "width 0.8s ease",
                background: percent >= 60 ? "var(--success)" : "var(--danger)" }} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.5rem", textAlign: "center" }}>
              {[
                { num: correctCount, label: "Correct", color: "var(--success)", border: "2px solid var(--success)" },
                { num: wrongCount, label: "Wrong", color: "var(--danger)", border: "2px solid var(--danger)" },
                { num: timeStr, label: "Time", color: "var(--text-main)", border: "2px solid var(--border)" },
                { num: total, label: "Total", color: "var(--primary)", border: "2px solid var(--primary)" },
              ].map((box, i) => (
                <div key={i} style={{ borderRadius: 12, padding: "0.75rem 0.25rem", background: "var(--bg-card)", border: box.border }}>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800, color: box.color, lineHeight: 1.2 }}>{box.num}</div>
                  <div style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "0.2rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>{box.label}</div>
                </div>
              ))}
            </div>
          </div>

          {Object.keys(topicBreakdown).length > 1 && (
            <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.75rem", padding: "1.25rem" }}>
              <h4 style={{ margin: 0, fontSize: "0.78rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Topic Breakdown</h4>
              {Object.entries(topicBreakdown).map(([topic, stats]) => {
                const pct = stats.total ? (stats.correct / stats.total) * 100 : 0;
                return (
                  <div key={topic}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem", marginBottom: "0.3rem" }}>
                      <span style={{ fontWeight: 500 }}>{topic}</span>
                      <span style={{ fontWeight: 700, color: pct >= 50 ? "var(--success)" : "var(--danger)" }}>
                        {stats.correct}/{stats.total}
                      </span>
                    </div>
                    <div style={{ height: 6, background: "var(--slate-200)", borderRadius: 999, overflow: "hidden" }}>
                      <div style={{ height: "100%", width: `${pct}%`, borderRadius: 999, transition: "width 0.5s ease",
                        background: pct >= 60 ? "var(--success)" : pct >= 40 ? "var(--warning, #d97706)" : "var(--danger)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button className="upload-btn" onClick={() => router.push("/mock-test")}
              style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
              <i className="bx bx-refresh"></i>
              New Test
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <nav className="back-nav">
        <button onClick={handleBack} className="back-nav-link" style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", color: "inherit" }}>
          <i className="bx bx-chevron-left"></i>
          <span>Exit Test</span>
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginLeft: "auto" }}>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{answeredCount}/{questions.length}</span>
          <span style={{
            fontFamily: "'SF Mono','Fira Code',monospace", fontWeight: 700, fontSize: "0.88rem",
            color: timerColor, background: timerBg, padding: "0.2rem 0.6rem", borderRadius: 8,
          }}>
            <i className="bx bx-time" style={{ marginRight: "0.2rem", verticalAlign: "middle" }}></i>
            {fmtTime}
          </span>
        </div>
      </nav>

      <div style={{ padding: "0 1rem" }}>
        <div style={{
          background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)",
          backdropFilter: "blur(12px)", overflow: "hidden",
        }}>
          <div style={{ height: 4, background: "var(--slate-200)" }}>
            <div style={{ height: "100%", width: `${progressPct}%`, background: "linear-gradient(90deg, var(--primary), #818cf8)", transition: "width 0.3s" }} />
          </div>
          <div ref={dotsRef} style={{ display: "flex", gap: "5px", padding: "0.7rem 0.85rem", overflowX: "auto", scrollbarWidth: "none" }}>
            {questions.map((_, i) => {
              const isCurrent = i === index;
              const isAns = answers[i] !== undefined;
              return (
                <button key={i} onClick={() => setIndex(i)}
                  className={isCurrent ? "dot-current" : ""}
                  style={{
                    width: 28, height: 28, borderRadius: "50%", border: "none", flexShrink: 0,
                    fontSize: "0.7rem", fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    background: isCurrent ? "var(--primary)" : isAns ? "#dcfce7" : "var(--slate-200)",
                    color: isCurrent ? "white" : isAns ? "#16a34a" : "var(--slate-500)",
                    boxShadow: isCurrent ? "0 0 0 3px rgba(37,99,235,0.2)" : "none",
                    transform: isCurrent ? "scale(1.1)" : "none",
                  }}>
                  {i + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {q && (
        <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "1rem", padding: "1.25rem", margin: "0.75rem 1rem" }}>
          <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{
              width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
              background: "var(--primary-light)", color: "var(--primary)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontWeight: 700, fontSize: "0.85rem",
            }}>
              {index + 1}
            </span>
            <div style={{ fontWeight: 600, fontSize: "0.92rem", lineHeight: 1.6, paddingTop: "0.25rem" }}>{q.question}</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {q.options.map((opt, oi) => {
              const selected = answers[index] === oi;
              return (
                <label key={oi}
                  onClick={() => setAnswers((prev) => ({ ...prev, [index]: oi }))}
                  style={{
                    display: "flex", alignItems: "center", gap: "0.65rem",
                    padding: "0.7rem 0.85rem", borderRadius: 12, cursor: "pointer",
                    border: `1.5px solid ${selected ? "var(--primary)" : "var(--border)"}`,
                    background: selected ? "var(--primary-light)" : "var(--bg-card)",
                    transition: "all 0.15s", userSelect: "none",
                  }}
                  onMouseEnter={(e) => { if (!selected) { e.currentTarget.style.borderColor = "var(--primary)"; e.currentTarget.style.background = "var(--primary-light)"; }}}
                  onMouseLeave={(e) => { if (!selected) { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.background = "var(--bg-card)"; }}}
                >
                  <span style={{
                    width: 28, height: 28, borderRadius: "50%", flexShrink: 0,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontWeight: 700, fontSize: "0.78rem", transition: "all 0.15s",
                    background: selected ? "var(--primary)" : "var(--slate-200)",
                    color: selected ? "white" : "var(--slate-500)",
                  }}>
                    {LETTERS[oi]}
                  </span>
                  <span style={{ fontSize: "0.9rem", lineHeight: 1.4, flex: 1 }}>{opt}</span>
                  {selected && <span style={{ width: 10, height: 10, borderRadius: "50%", background: "var(--primary)", flexShrink: 0 }} />}
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "0.5rem", padding: "0.5rem 1rem 1.5rem", justifyContent: "space-between" }}>
        <button
          className="upload-btn upload-btn-secondary"
          disabled={index === 0}
          onClick={() => setIndex((i) => i - 1)}
          style={{ opacity: index === 0 ? 0.4 : 1, display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.75rem 1.25rem" }}
        >
          <i className="bx bx-chevron-left"></i>
          Previous
        </button>

        {allAnswered ? (
          <button
            onClick={finishTest}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.75rem 1.5rem", borderRadius: 16, border: "none",
              background: "var(--success)", color: "white", fontWeight: 700, fontSize: "0.9rem",
              cursor: "pointer", boxShadow: "0 8px 20px rgba(22,163,74,0.25)",
              transition: "all 0.15s",
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-1px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
          >
            Submit Test
            <i className="bx bx-check-circle" style={{ fontSize: "1.1rem" }}></i>
          </button>
        ) : index < questions.length - 1 ? (
          <button
            className="upload-btn"
            onClick={() => setIndex((i) => i + 1)}
            style={{ display: "flex", alignItems: "center", gap: "0.3rem", padding: "0.75rem 1.25rem" }}
          >
            Next
            <i className="bx bx-chevron-right"></i>
          </button>
        ) : (
          <button
            onClick={() => {
              const firstUnanswered = questions.findIndex((_, i) => answers[i] === undefined);
              setIndex(firstUnanswered >= 0 ? firstUnanswered : 0);
            }}
            style={{
              display: "flex", alignItems: "center", gap: "0.3rem",
              padding: "0.75rem 1.25rem", borderRadius: 16, border: "none",
              background: "var(--warning-light)", color: "#d97706", fontWeight: 700, fontSize: "0.9rem",
              cursor: "pointer", transition: "all 0.15s",
            }}
          >
            <i className="bx bx-message-square-x"></i>
            Unanswered
          </button>
        )}
      </div>
    </>
  );
}
