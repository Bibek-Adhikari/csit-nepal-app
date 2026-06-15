import Link from "next/link";
import { notFound } from "next/navigation";
import { getSemester, getSubject, getUnit, semesters, type SemesterKey } from "@/content/subjects";
import { CompletionToggle } from "@/components/completion-toggle";

// Type definitions
interface NoteItem {
  href: string;
  title: string;
}

interface UnitNotes {
  pdf: NoteItem[];
  handwritten: NoteItem[];
}

interface Unit {
  slug: string;
  title: string;
  summary: string;
  notes: UnitNotes;
}

interface Subject {
  slug: string;
  units: Unit[];
}

interface Semester {
  key: string;
  subjects: Subject[];
}

export function generateStaticParams() {
  return (semesters as Semester[]).flatMap((semester) =>
    semester.subjects.flatMap((subject: Subject) =>
      subject.units.map((unit: Unit) => ({
        semester: semester.key,
        subject: subject.slug,
        unit: unit.slug,
      })),
    ),
  );
}

export default async function UnitNotesPage({ params }: { params: Promise<{ semester: SemesterKey; subject: string; unit: string }> }) {
  const { semester, subject, unit } = await params;
  const semesterData = getSemester(semester);
  const subjectData = getSubject(semester, subject);
  const unitData = getUnit(semester, subject, unit);

  if (!semesterData || !subjectData || !unitData) {
    notFound();
  }

  return (
    <>
      <section className="welcome-hero">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
          <div>
            <div className="badge-row" style={{ margin: 0 }}>
              <span className="sheet-badge accent">{semesterData.label}</span>
              <span className="sheet-badge">{subjectData.code}</span>
            </div>
            <h2 style={{ marginTop: "0.5rem" }}>{unitData.title}</h2>
            <p style={{ marginBottom: 0 }}>{unitData.summary}</p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <CompletionToggle semesterKey={semester} subjectSlug={subject} unitSlug={unit} />
          </div>
        </div>
      </section>

      <h3 className="section-headline">PDF Notes</h3>
      <div className="subject-stack">
        {unitData.notes.pdf.length === 0 ? (
          <div className="app-card" style={{ cursor: "default", justifyContent: "center" }}>
            <span className="card-meta-inline">No PDF notes available yet</span>
          </div>
        ) : (
          unitData.notes.pdf.map((item: NoteItem) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer noopener" className="app-card">
              <div className="card-left">
                <span className="card-code">PDF</span>
                <span className="card-title">{item.title}</span>
              </div>
              <i className="bx bx-download card-chevron"></i>
            </a>
          ))
        )}
      </div>

      <h3 className="section-headline" style={{ marginTop: "1rem" }}>Handwritten Notes</h3>
      <div className="subject-stack">
        {unitData.notes.handwritten.length === 0 ? (
          <div className="app-card" style={{ cursor: "default", justifyContent: "center" }}>
            <span className="card-meta-inline">No handwritten notes available yet</span>
          </div>
        ) : (
          unitData.notes.handwritten.map((item: NoteItem) => (
            <a key={item.href} href={item.href} target="_blank" rel="noreferrer noopener" className="app-card">
              <div className="card-left">
                <span className="card-code">Handwritten</span>
                <span className="card-title">{item.title}</span>
              </div>
              <i className="bx bx-download card-chevron"></i>
            </a>
          ))
        )}
      </div>

      <div style={{ padding: "1rem" }}>
        <Link
          href={`/subjects/${semester}`}
          className="pill-btn"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <i className="bx bx-arrow-back"></i>
          Back to {semesterData.label}
        </Link>
      </div>
    </>
  );
}

