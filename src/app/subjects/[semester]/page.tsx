import Link from "next/link";
import { notFound } from "next/navigation";
import { getSemester, semesters, type SemesterKey, type Subject } from "@/content/subjects";

export function generateStaticParams() {
  return semesters.map((semester) => ({ semester: semester.key }));
}

export default async function SemesterPage({ params }: { params: Promise<{ semester: SemesterKey }> }) {
  const { semester } = await params;
  const data = getSemester(semester);

  if (!data) {
    notFound();
  }

  return (
    <>
      <section className="welcome-hero">
        <h2>{data.overview}</h2>
        <p>{data.label} — {data.subjects.length} subjects available</p>
      </section>

      <h3 className="section-headline">Subjects</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        {data.subjects.map((subject: Subject) => (
          <div key={subject.code} id={subject.slug} className="app-card" style={{ flexDirection: "column", alignItems: "stretch", cursor: "default" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div className="card-left">
                <span className="card-code">{subject.code}</span>
                <span className="card-title">{subject.title}</span>
                <span className="card-meta-inline">{subject.credits} &middot; {subject.units.length} units</span>
              </div>
              <span className="lecture-badge">{subject.credits}</span>
            </div>

            <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
              {subject.overview}
            </p>

            <div style={{ marginTop: "0.85rem", display: "grid", gap: "0.6rem", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))" }}>
              {subject.units.map((unit) => (
                <Link
                  key={unit.slug}
                  href={`/notes/${semester}/${subject.slug}/${unit.slug}`}
                  className="stat-bubble"
                  style={{ textDecoration: "none", color: "inherit", transition: "transform 0.15s ease" }}
                >
                  <i className="bx bx-book-open" style={{ fontSize: "1.2rem", color: "var(--primary)" }}></i>
                  <div>
                    <div className="stat-val" style={{ fontSize: "0.85rem" }}>{unit.title}</div>
                    <div className="stat-lbl">{unit.summary.slice(0, 50)}…</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
