import Link from "next/link";
import { semesters, type Subject } from "@/content/subjects";

export default function SubjectsPage() {
  return (
    <>
      <section className="welcome-hero">
        <h2>Subjects</h2>
        <p>
          Each semester opens into its subject list and then into individual
          units. Pick a semester below to browse subjects.
        </p>
      </section>

      <h3 className="section-headline">All Semesters</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        {semesters.map((semester) => (
          <Link
            key={semester.key}
            href={`/subjects/${semester.key}`}
            className="app-card"
          >
            <div className="card-left">
              <span className="card-code">{semester.label}</span>
              <span className="card-title">{semester.overview}</span>
              <span className="card-meta-inline">
                {semester.subjects.length} subjects &middot;{" "}
                {semester.subjects.reduce(
                  (count: number, subject: Subject) => count + subject.units.length,
                  0
                )}{" "}
                units
              </span>
            </div>
            <i className="bx bx-chevron-right card-chevron"></i>
          </Link>
        ))}
      </div>
    </>
  );
}
