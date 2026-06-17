import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSemester, semesters, type SemesterKey, type Subject } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";

export function generateStaticParams() {
  return semesters.map((semester) => ({ semester: semester.key }));
}

export async function generateMetadata({ params }: { params: Promise<{ semester: SemesterKey }> }): Promise<Metadata> {
  const { semester } = await params;
  const data = getSemester(semester);
  return {
    title: data?.label || "Semester",
    description: `Browse ${data?.subjects.length || 0} subjects in ${data?.label || "this semester"}. Access notes, PDFs, and lectures.`,
  };
}

export default async function SemesterPage({ params }: { params: Promise<{ semester: SemesterKey }> }) {
  const { semester } = await params;
  const data = getSemester(semester);

  if (!data) {
    notFound();
  }

  return (
    <>
      <BackNav href="/subjects" label="All Subjects" />
      <section className="welcome-hero">
        <h2>{data.label}</h2>
        <p>{data.subjects.length} subjects</p>
      </section>

      <h3 className="section-headline">Subjects</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        {data.subjects.map((subject: Subject) => (
          <Link
            key={subject.code}
            href={`/subjects/${semester}/${subject.slug}`}
            className="app-card"
            style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
          >
            <div className="card-left">
              <span className="card-code">{subject.code}</span>
              <span className="card-title">{subject.title}</span>
            </div>
            <i className="bx bx-chevron-right card-chevron"></i>
          </Link>
        ))}
      </div>
    </>
  );
}
