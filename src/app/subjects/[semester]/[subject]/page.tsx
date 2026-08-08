import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getSemester, getSubject, semesters, type SemesterKey } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import { getSupabaseServer } from "@/lib/supabase";

interface NoteItem {
  title: string;
  href: string;
  unitSlug: string;
}

export function generateStaticParams() {
  return semesters.flatMap((semester) =>
    semester.subjects.map((subject) => ({
      semester: semester.key,
      subject: subject.slug,
    }))
  );
}

export async function generateMetadata({ params }: { params: Promise<{ semester: SemesterKey; subject: string }> }): Promise<Metadata> {
  const { semester, subject } = await params;
  const data = getSubject(semester, subject);
  return {
    title: data?.title || "Subject",
    description: `${data?.title || "Subject"} - ${data?.units.length || 0} units, ${data?.labReports.length || 0} lab reports with notes and lectures.`,
  };
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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bcanepal.vercel.app";

  let solutionNotes: NoteItem[] = [];
  try {
    const supabase = getSupabaseServer();
    const { data: solutions } = await supabase
      .from("notes")
      .select("title, public_url, unit_slug")
      .eq("semester_key", semester)
      .eq("subject_slug", subject)
      .eq("format", "solution");

    if (solutions) {
      solutionNotes = solutions.map((s: { title: string; public_url: string; unit_slug: string }) => ({
        title: s.title || "Exam Solution",
        href: s.public_url,
        unitSlug: s.unit_slug,
      }));
    }
  } catch (err) {
    console.error("Failed to fetch solutions:", err);
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
              { "@type": "ListItem", position: 2, name: semesterData.label, item: `${siteUrl}/subjects/${semester}` },
              { "@type": "ListItem", position: 3, name: subjectData.title, item: `${siteUrl}/subjects/${semester}/${subject}` },
            ],
          }),
        }}
      />
      <BackNav href={`/subjects/${semester}`} label={semesterData.label} />
      <section className="welcome-hero">
        <div className="badge-row" style={{ margin: 0 }}>
          <span className="sheet-badge accent">{semesterData.label}</span>
          <span className="sheet-badge">{subjectData.code}</span>
        </div>
        <h1 style={{ marginTop: "0.5rem" }}>{subjectData.title}</h1>
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

      <h3 className="section-headline">Quiz</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <Link
          href={`/quiz/${semester}/${subject}`}
          className="app-card quiz-card"
          style={{
            textDecoration: "none",
            color: "inherit",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div className="card-left">
            <span className="card-code">QUIZ</span>
            <span className="card-title">Take Quiz</span>
          </div>
          <i className="bx bx-chevron-right card-chevron"></i>
        </Link>
      </div>

      {solutionNotes.length > 0 && (
        <>
          <h3 className="section-headline">Exam Paper Solutions</h3>
          <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
            {solutionNotes.map((item) => (
              <Link
                key={item.href}
                href={`/view-pdf?url=${encodeURIComponent(item.href)}&title=${encodeURIComponent(item.title)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subject)}`}
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
                  <span className="card-code">SOLUTION</span>
                  <span className="card-title">{item.title}</span>
                </div>
                <i className="bx bx-chevron-right card-chevron"></i>
              </Link>
            ))}
          </div>
        </>
      )}

      {subjectData.labReports.length > 0 && (
        <>
          <h3 className="section-headline">Lab Reports</h3>
          <div className="subject-stack" style={{ paddingBottom: "1rem" }}>
            <Link
              href={`/notes/${semester}/${subject}/lab-reports`}
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
                <span className="card-code">LAB</span>
                <span className="card-title">Lab Reports</span>
              </div>
              <i className="bx bx-chevron-right card-chevron"></i>
            </Link>
          </div>
        </>
      )}
    </>
  );
}
