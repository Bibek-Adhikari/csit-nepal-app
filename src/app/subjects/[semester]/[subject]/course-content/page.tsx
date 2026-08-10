import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject, semesters, type SemesterKey } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import { getSupabaseServer } from "@/lib/supabase";

export function generateStaticParams() {
  return semesters.flatMap((semester) =>
    semester.subjects.map((subject) => ({
      semester: semester.key,
      subject: subject.slug,
    }))
  );
}

async function fetchCoursePdf(semester: string, subject: string): Promise<{ title: string; href: string } | null> {
  try {
    const supabase = getSupabaseServer();
    const folderPath = `${semester}/${subject}`;
    const { data: files, error } = await supabase.storage
      .from("notes")
      .list(folderPath, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error || !files) return null;

    const pdfFile = files.find((file: { name: string }) =>
      file.name.toLowerCase().endsWith(".pdf")
      && !file.name.replace(/\.[^/.]+$/, "").match(/^\d+$/)
      && !file.name.toLowerCase().includes("solution")
    );
    if (!pdfFile) return null;

    const { data: urlData } = supabase.storage.from("notes").getPublicUrl(`${folderPath}/${pdfFile.name}`);
    return { title: pdfFile.name.replace(/\.[^/.]+$/, ""), href: urlData.publicUrl };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ semester: SemesterKey; subject: string }> }): Promise<Metadata> {
  const { semester, subject } = await params;
  const data = getSubject(semester, subject);
  return {
    title: `${data?.title || "Subject"} - Course Structure`,
    description: `Complete course structure of ${data?.title || "Subject"} with all units, topics and sub-topics.`,
  };
}

export default async function CourseContentPage({
  params,
}: {
  params: Promise<{ semester: SemesterKey; subject: string }>;
}) {
  const { semester, subject } = await params;
  const subjectData = getSubject(semester, subject);

  if (!subjectData) {
    notFound();
  }

  const coursePdf = await fetchCoursePdf(semester, subject);

  return (
    <>
      <BackNav href={`/subjects/${semester}/${subject}`} label={subjectData.title} />
      <section className="welcome-hero">
        <div className="badge-row" style={{ margin: 0 }}>
          <span className="sheet-badge accent">Course Structure</span>
          <span className="sheet-badge">{subjectData.code}</span>
        </div>
        <h1 style={{ marginTop: "0.5rem" }}>{subjectData.title}</h1>
      </section>

      <div className="cc-units-list">
        {coursePdf && (
          <div className="cc-unit" style={{ marginBottom: "0.5rem" }}>
            <div className="cc-unit-header">
              <span className="cc-unit-num" style={{ background: "#ef4444" }}>
                <i className="bx bx-file" style={{ fontSize: "1rem" }}></i>
              </span>
              <div className="cc-unit-info">
                <h3 className="cc-unit-title">Course Syllabus</h3>
                <p className="cc-unit-summary" style={{ fontStyle: "italic" }}>Download the official syllabus</p>
              </div>
            </div>
            <div className="cc-topics">
              <div className="cc-topic">
                <div className="cc-topic-header">
                  <i className="bx bxs-file-pdf cc-topic-icon" style={{ color: "#ef4444" }}></i>
                  <Link
                    href={`/view-pdf?url=${encodeURIComponent(coursePdf.href)}&title=${encodeURIComponent(coursePdf.title)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subject)}`}
                    className="cc-pdf-link"
                  >
                    {coursePdf.title}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {subjectData.units.map((unit, idx) => (
          <div key={unit.slug} className="cc-unit">
            <div className="cc-unit-header">
              <span className="cc-unit-num">{idx + 1}</span>
              <div className="cc-unit-info">
                <h3 className="cc-unit-title">{unit.title}</h3>
                <p className="cc-unit-summary">{unit.summary}</p>
              </div>
            </div>
            {unit.topics && unit.topics.length > 0 && (
              <div className="cc-topics">
                {unit.topics.map((topic, tIdx) => (
                  <div key={tIdx} className="cc-topic">
                    <div className="cc-topic-header">
                      <i className="bx bx-book-open cc-topic-icon"></i>
                      <span className="cc-topic-title">{topic.title}</span>
                    </div>
                    <ul className="cc-subtopics">
                      {topic.subTopics.map((sub, sIdx) => (
                        <li key={sIdx} className="cc-subtopic">
                          <i className="bx bx-chevron-right cc-subtopic-arrow"></i>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}
