import Link from "next/link";

export function CourseContentCard() {
  return (
    <Link href="/subjects/course-content" className="app-card" style={{
      background: "linear-gradient(135deg, #0ea5e9, transparent)",
      border: "1px solid #0ea5e9",
    }}>
      <div className="card-left">
        <span className="card-code">
          <i className="bx bx-notepad" style={{ marginRight: "0.35rem" }}></i>
          Course Content
        </span>
        <span className="card-meta-inline" style={{ color: "var(--text-muted)" }}>
          Full syllabus structure — units, topics &amp; sub-topics
        </span>
      </div>
      <i className="bx bx-chevron-right card-chevron"></i>
    </Link>
  );
}
