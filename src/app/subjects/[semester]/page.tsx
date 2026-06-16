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
          <Link
            key={subject.code}
            href={`/subjects/${semester}/${subject.slug}`}
            className="app-card"
            style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div className="card-left">
                <span className="card-code">{subject.code}</span>
                <span className="card-title">{subject.title}</span>
                <span className="card-meta-inline">{subject.credits} credits &middot; {subject.units.length} units</span>
              </div>
              <i className="bx bx-chevron-right card-chevron" style={{ marginTop: "0.2rem" }}></i>
            </div>

            <p style={{ marginTop: "0.75rem", fontSize: "0.85rem", color: "var(--text-muted)", lineHeight: 1.5, marginBottom: 0 }}>
              {subject.overview}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
