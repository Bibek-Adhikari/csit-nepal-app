import type { Metadata } from "next";
import Link from "next/link";
import { semesters } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import { getSupabaseServer } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Course Content",
  description: "Complete TU BCA course content — all semesters with units and PDF notes.",
};

interface UnitPdf {
  unitSlug: string;
  title: string;
  href: string;
}

async function fetchSubjectPdfs(semester: string, subject: string): Promise<UnitPdf[]> {
  try {
    const supabase = getSupabaseServer();
    const { data, error } = await supabase
      .from("notes")
      .select("title, public_url, format, unit_slug")
      .eq("semester_key", semester)
      .eq("subject_slug", subject)
      .in("format", ["pdf", "course"]);

    if (error || !data) return [];

    return data
      .filter((n: { format: string }) => n.format === "pdf" || n.format === "course")
      .map((n: { title: string; public_url: string; unit_slug: string }) => ({
        unitSlug: n.unit_slug,
        title: n.title,
        href: n.public_url,
      }));
  } catch {
    return [];
  }
}

async function fetchOverviewPdf(): Promise<{ title: string; href: string } | null> {
  try {
    const supabase = getSupabaseServer();
    const { data: files, error } = await supabase.storage
      .from("notes")
      .list("course-overview", { limit: 100, sortBy: { column: "name", order: "asc" } });

    if (error || !files) return null;

    const pdfFile = files.find((f: { name: string }) => f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return null;

    const { data: urlData } = supabase.storage.from("notes").getPublicUrl(`course-overview/${pdfFile.name}`);
    return { title: pdfFile.name.replace(/\.[^/.]+$/, ""), href: urlData.publicUrl };
  } catch {
    return null;
  }
}

export default async function CourseContentPage() {
  const [overviewPdf, semestersWithPdfs] = await Promise.all([
    fetchOverviewPdf(),
    Promise.all(
      semesters.map(async (semester) => {
      const subjects = await Promise.all(
        semester.subjects.map(async (subject) => {
          const pdfs = await fetchSubjectPdfs(semester.key, subject.slug);
          return { ...subject, pdfs };
        })
      );
      return { ...semester, subjects };
    })
  ),
  ]);

  return (
    <>
      <BackNav href="/subjects" label="All Subjects" />
      <section className="welcome-hero">
        <div className="badge-row" style={{ margin: 0 }}>
          <span className="sheet-badge accent">Course Content</span>
        </div>
        <h1 style={{ marginTop: "0.5rem" }}>Full Course Structure</h1>
        <p>All semesters with units &amp; PDF notes.</p>

        <div className="course-pdf-cta">
          <input type="checkbox" id="course-pdf-toggle" className="course-pdf-toggle" hidden />
          <label htmlFor="course-pdf-toggle" className="csb-minimal-btn">Course PDF</label>
          <div className="course-overview-panel">
            {overviewPdf ? (
              <Link
                href={`/view-pdf?url=${encodeURIComponent(overviewPdf.href)}&title=${encodeURIComponent(overviewPdf.title)}`}
                className="cc-pdf-link"
              >
                {overviewPdf.title}
              </Link>
            ) : (
              <span className="course-overview-coming">PDF coming soon</span>
            )}
          </div>
        </div>
      </section>

      {semestersWithPdfs.map((semester) => (
        <div key={semester.key}>
          <h3 className="section-headline">{semester.label}</h3>
          <div className="cc-units-list" style={{ marginTop: 0 }}>
            {semester.subjects.map((subject) => {
              const pdfsByUnit = subject.pdfs.reduce<Record<string, UnitPdf[]>>((acc, p) => {
                (acc[p.unitSlug] = acc[p.unitSlug] || []).push(p);
                return acc;
              }, {});

              return (
                <div key={subject.slug} className="cc-unit">
                  <div className="cc-unit-header">
                    <span className="cc-unit-num">{subject.code.replace("BCA ", "")}</span>
                    <div className="cc-unit-info">
                      <h3 className="cc-unit-title">{subject.title}</h3>
                      <p className="cc-unit-summary">{subject.credits} credits · {subject.units.length} units</p>
                    </div>
                  </div>
                  <div className="cc-topics">
                    {subject.units.map((unit, uIdx) => {
                      const unitPdfs = pdfsByUnit[unit.slug] || [];
                      return (
                        <div key={unit.slug} className="cc-topic">
                          <div className="cc-topic-header">
                            <i className="bx bx-book-open cc-topic-icon"></i>
                            <span className="cc-topic-title">{uIdx + 1}. {unit.title}</span>
                          </div>
                          {unitPdfs.length > 0 ? (
                            <ul className="cc-subtopics">
                              {unitPdfs.map((pdf) => (
                                <li key={pdf.href} className="cc-subtopic">
                                  <i className="bx bxs-file-pdf cc-subtopic-arrow" style={{ color: "var(--primary)", fontSize: "0.8rem", marginTop: "0.1rem" }}></i>
                                  <Link
                                    href={`/view-pdf?url=${encodeURIComponent(pdf.href)}&title=${encodeURIComponent(pdf.title)}&semester=${encodeURIComponent(semester.key)}&subject=${encodeURIComponent(subject.slug)}&unit=${encodeURIComponent(unit.slug)}`}
                                    className="cc-pdf-link"
                                  >
                                    {pdf.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <ul className="cc-subtopics">
                              <li className="cc-subtopic">
                                <span style={{ color: "var(--text-muted)", fontStyle: "italic" }}>PDFs coming soon</span>
                              </li>
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
