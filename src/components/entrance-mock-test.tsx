"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { rawQuestionBank, toMockQuestion, type MockQuestion } from "@/content/entrance/questionBank";

type Answers = Record<string, number>;

const LETTERS = ["A", "B", "C", "D"];

const SUBJECTS = [
  { key: "english", label: "English", icon: "bx-book" },
  { key: "math", label: "Mathematics", icon: "bx-calculator" },
  { key: "gk", label: "GK", icon: "bx-globe" },
  { key: "mixed", label: "Mixed", icon: "bx-shuffle" },
] as const;

export function EntranceMockTest({ onBack }: { onBack: () => void }) {
  const [questionCount, setQuestionCount] = useState(20);
  const [subject, setSubject] = useState("english");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const dotsRef = useRef<HTMLDivElement>(null);

  const countOptions = [20, 30, 50, 100];
  const totalMinutes = questionCount <= 20 ? 20 : questionCount <= 30 ? 30 : questionCount <= 50 ? 60 : 90;
  const totalSeconds = totalMinutes * 60;
  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === questions.length;

  const startTest = useCallback(() => {
    const pool = rawQuestionBank[subject] ?? rawQuestionBank.english;
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, questionCount).map((r) => toMockQuestion(r, subject));
    setQuestions(selected);
    setAnswers({});
    setIndex(0);
    setSubmitted(false);
    setStartTime(Date.now());
    setEndTime(0);
    setTimeLeft(totalSeconds);
    setStarted(true);
  }, [subject, questionCount, totalSeconds]);

  useEffect(() => {
    if (!started || submitted) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) { clearInterval(timerRef.current!); finishTest(); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, submitted]);

  const finishTest = useCallback(() => {
    setSubmitted(true);
    setEndTime(Date.now());
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (!submitted || !dotsRef.current) return;
    const el = dotsRef.current.querySelector(".dot-current");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [index, submitted]);

  const timeTaken = endTime - startTime;
  const timeStr = endTime
    ? `${Math.floor(timeTaken / 60000)}:${String(Math.floor((timeTaken % 60000) / 1000)).padStart(2, "0")}`
    : "0:00";

  if (!started) {
    return (
      <div className="subject-stack">
        <section className="welcome-hero" style={{ marginBottom: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <i className="bx bx-edit-alt" style={{ fontSize: "1.6rem", color: "var(--primary)" }}></i>
            <h2 style={{ margin: 0 }}>Mock Test</h2>
          </div>
          <p>Configure your test settings and start practicing.</p>
        </section>

        <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "1.25rem", padding: "1.25rem" }}>
          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Questions</label>
            <div className="badge-row" style={{ gap: "0.5rem" }}>
              {countOptions.map((n) => (
                <button key={n} onClick={() => setQuestionCount(n)}
                  className={`sheet-badge${questionCount === n ? " accent" : ""}`}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.85rem" }}>
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 600, fontSize: "0.85rem", display: "block", marginBottom: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.04em" }}>Subject</label>
            <div className="badge-row" style={{ gap: "0.5rem" }}>
              {SUBJECTS.map((s) => (
                <button key={s.key} onClick={() => setSubject(s.key)}
                  className={`sheet-badge${subject === s.key ? " accent" : ""}`}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "0.4rem 0.85rem" }}>
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
              <i className="bx bx-library"></i> {subject === "mixed" ? "All subjects" : subject.charAt(0).toUpperCase() + subject.slice(1)}
            </span>
          </div>
        </div>

        <button className="upload-btn" onClick={startTest} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.4rem" }}>
          <i className="bx bx-play-circle" style={{ fontSize: "1.2rem" }}></i>
          Start Mock Test
        </button>
      </div>
    );
  }

  const q = questions[index];
  const fmtTime = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(timeLeft % 60).padStart(2, "0")}`;
  const progressPct = questions.length ? ((index + 1) / questions.length) * 100 : 0;
  const timerColor = timeLeft < 60 ? "var(--danger)" : timeLeft < 300 ? "var(--warning, #d97706)" : "var(--primary)";

  return (
    <>
      <nav className="back-nav">
        <button onClick={onBack} className="back-nav-link" style={{ background: "none", border: "none", cursor: "pointer", font: "inherit", color: "inherit" }}>
          <i className="bx bx-chevron-left"></i>
          <span>{submitted ? "Results" : "Exit Test"}</span>
        </button>
        {!submitted && (
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginLeft: "auto" }}>
            <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>{answeredCount}/{questions.length}</span>
            <span style={{
              fontFamily: "'SF Mono','Fira Code',monospace", fontWeight: 700, fontSize: "0.88rem",
              color: timerColor, background: "var(--primary-light)", padding: "0.2rem 0.6rem", borderRadius: 8,
            }}>
              <i className="bx bx-time" style={{ marginRight: "0.2rem", verticalAlign: "middle" }}></i>
              {fmtTime}
            </span>
          </div>
        )}
      </nav>

      {submitted ? (
        <ResultsScreen
          questions={questions}
          answers={answers}
          totalMinutes={totalMinutes}
          timeStr={timeStr}
          onNewTest={() => { setStarted(false); setSubmitted(false); }}
        />
      ) : (
        <>
          <div style={{ padding: "0 1rem" }}>
            <div style={{
              background: "var(--bg-card)", borderRadius: 12, border: "1px solid var(--border)",
              backdropFilter: "blur(12px)", overflow: "hidden",
            }}>
              <div style={{ height: 4, background: "var(--slate-200)" }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "var(--primary)", transition: "width 0.3s" }} />
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
                    background: isCurrent ? "var(--primary)" : isAns ? "var(--success-light)" : "var(--slate-200)",
                    color: isCurrent ? "white" : isAns ? "var(--success)" : "var(--slate-500)",
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
                      {selected && <i className="bx bx-check-circle" style={{ color: "var(--primary)", fontSize: "1.1rem" }}></i>}
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
                  cursor: "pointer", boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
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
                  background: "var(--warning-light)", color: "var(--warning, #d97706)", fontWeight: 700, fontSize: "0.9rem",
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <i className="bx bx-message-square-x"></i>
                Unanswered
              </button>
            )}
          </div>
        </>
      )}
    </>
  );
}

function ResultsScreen({
  questions, answers, totalMinutes, timeStr, onNewTest,
}: {
  questions: MockQuestion[];
  answers: Answers;
  totalMinutes: number;
  timeStr: string;
  onNewTest: () => void;
}) {
  const [showAnswers, setShowAnswers] = useState(false);
  const total = questions.length;
  const correctCount = questions.filter((q, i) => q.options[answers[i] ?? -1] === q.correct_answer).length;
  const wrongCount = total - correctCount;
  const percent = total ? Math.round((correctCount / total) * 100) : 0;
  const grade = percent >= 80 ? "Excellent" : percent >= 60 ? "Good" : percent >= 40 ? "Average" : "Needs Practice";
  const gradeColor = percent >= 80 ? "var(--success)" : percent >= 60 ? "var(--primary)" : percent >= 40 ? "var(--warning, #d97706)" : "var(--danger)";

  const topicBreakdown = questions.reduce<Record<string, { total: number; correct: number }>>((acc, q, i) => {
    if (!acc[q.topic]) acc[q.topic] = { total: 0, correct: 0 };
    acc[q.topic].total++;
    if (q.options[answers[i] ?? -1] === q.correct_answer) acc[q.topic].correct++;
    return acc;
  }, {});

  return (
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
            { num: `0:${timeStr}`, label: "Time", color: "var(--text-main)", border: "2px solid var(--border)" },
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
        <button className="upload-btn" onClick={() => setShowAnswers(!showAnswers)}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
          <i className={`bx ${showAnswers ? "bx-hide" : "bx-show"}`}></i>
          {showAnswers ? "Hide Answers" : "See Answers"}
        </button>
        <button className="upload-btn upload-btn-secondary" onClick={onNewTest}
          style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
          <i className="bx bx-refresh"></i>
          New Test
        </button>
      </div>

      {showAnswers && (
        <div style={{ marginTop: "0.5rem" }}>
          {questions.map((q, i) => {
            const userChoice = answers[i];
            const userAnswer = userChoice !== undefined ? q.options[userChoice] : undefined;
            const isCorrect = userAnswer === q.correct_answer;
            const isUnanswered = userChoice === undefined;
            const borderColor = isCorrect ? "var(--success)" : isUnanswered ? "var(--slate-400)" : "var(--danger)";
            return (
              <div key={q.id} className="app-card" style={{
                flexDirection: "column", alignItems: "stretch", gap: "0.6rem", padding: "1rem",
                marginTop: "0.6rem", borderLeft: `4px solid ${borderColor}`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ background: "var(--slate-200)", padding: "0.2rem 0.6rem", borderRadius: 6, fontSize: "0.72rem", fontWeight: 700 }}>
                    Q{i + 1}
                  </span>
                  <span style={{ fontSize: "0.72rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: 6,
                    background: isCorrect ? "var(--success-light)" : isUnanswered ? "var(--slate-200)" : "var(--danger-light)",
                    color: isCorrect ? "var(--success)" : isUnanswered ? "var(--slate-500)" : "var(--danger)" }}>
                    {isCorrect ? "Correct" : isUnanswered ? "Skipped" : "Wrong"}
                  </span>
                </div>

                <div style={{ fontSize: "0.85rem", fontWeight: 600, lineHeight: 1.5 }}>{q.question}</div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  {q.options.map((opt, oi) => {
                    const isSelected = oi === userChoice;
                    const isRightAnswer = opt === q.correct_answer;
                    let bg = "transparent";
                    if (isRightAnswer) bg = "var(--success-light)";
                    else if (isSelected && !isCorrect) bg = "var(--danger-light)";
                    return (
                      <div key={oi} style={{
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        padding: "0.45rem 0.65rem", borderRadius: 8, fontSize: "0.82rem",
                        background: bg, border: `1px solid ${isSelected ? (isCorrect ? "var(--success)" : "var(--danger)") : "var(--border)"}`,
                      }}>
                        <span style={{
                          width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: "0.68rem", fontWeight: 700,
                          background: isRightAnswer ? "var(--success)" : isSelected ? "var(--danger)" : "var(--slate-200)",
                          color: isRightAnswer || isSelected ? "white" : "var(--slate-500)",
                        }}>
                          {LETTERS[oi]}
                        </span>
                        <span style={{ flex: 1 }}>{opt}</span>
                        {isRightAnswer && <i className="bx bx-check" style={{ color: "var(--success)", fontSize: "1rem" }}></i>}
                        {isSelected && !isCorrect && <i className="bx bx-x" style={{ color: "var(--danger)", fontSize: "1rem" }}></i>}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <div style={{
                    fontSize: "0.78rem", color: "var(--text-muted)", lineHeight: 1.6,
                    background: "var(--primary-light)", padding: "0.65rem", borderRadius: 8, marginTop: "0.15rem",
                    border: "1px solid var(--border)",
                  }}>
                    <i className="bx bx-info-circle" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
