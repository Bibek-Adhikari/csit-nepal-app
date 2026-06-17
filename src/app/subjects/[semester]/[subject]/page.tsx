import Link from "next/link";
import { notFound } from "next/navigation";
import { getSemester, getSubject, semesters, type SemesterKey } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";

export function generateStaticParams() {
  return semesters.flatMap((semester) =>
    semester.subjects.map((subject) => ({
      semester: semester.key,
      subject: subject.slug,
    }))
  );
}

export default async function SubjectPage({
  params,
}: {
  params: Promise<{ semester: SemesterKey; subject: string }>;
}) {
  const { semester, subject } = await params;
  const semesterData = getSemester(semester);
  const subjectData = getSubject(semester, subject);

  if (!semesterData || !subjectData) {
    notFound();
  }

  return (
    <>
      <BackNav href={`/subjects/${semester}`} label={semesterData.label} />
      <section className="welcome-hero">
        <div className="badge-row" style={{ margin: 0 }}>
          <span className="sheet-badge accent">{semesterData.label}</span>
          <span className="sheet-badge">{subjectData.code}</span>
        </div>
        <h2 style={{ marginTop: "0.5rem" }}>{subjectData.title}</h2>
        <p>{subjectData.overview}</p>
        <div style={{ marginTop: "1rem" }}>
          <span className="lecture-badge">{subjectData.credits} Credits</span>
          <span className="lecture-badge" style={{ marginLeft: "0.5rem" }}>
            {subjectData.units.length} Units
          </span>
        </div>
      </section>

      <h3 className="section-headline">Units</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        {subjectData.units.map((unit) => (
          <Link
            key={unit.slug}
            href={`/notes/${semester}/${subject}/${unit.slug}`}
            className="app-card"
            style={{
              textDecoration: "none",
              color: "inherit",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div className="card-left">
              <span className="card-code">UNIT</span>
              <span className="card-title">{unit.title}</span>
            </div>
            <i className="bx bx-chevron-right card-chevron"></i>
          </Link>
        ))}
      </div>
    </>
  );
}
