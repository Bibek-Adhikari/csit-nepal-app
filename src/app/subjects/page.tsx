import Link from "next/link";
import { semesters } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";

export default function SubjectsPage() {
  return (
    <>
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h2>All Semesters</h2>
      </section>

      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        {semesters.map((semester) => (
          <Link
            key={semester.key}
            href={`/subjects/${semester.key}`}
            className="app-card"
          >
            <div className="card-left">
              <span className="card-code">{semester.label}</span>
            </div>
            <i className="bx bx-chevron-right card-chevron"></i>
          </Link>
        ))}
      </div>
    </>
  );
}
