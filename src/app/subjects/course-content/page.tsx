import type { Metadata } from "next";
import Link from "next/link";
import { semesters } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import { getSupabaseServer } from "@/lib/supabase";
import type { SupabaseClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Course Content",
  description: "Complete TU BSc CSIT course content — all semesters with units and PDF notes.",
};

interface UnitPdf {
  unitSlug: string;
  title: string;
  href: string;
}

const IGNORED_FILES = new Set([".emptyFolderPlaceholder", "placeholder.txt"]);

function isValidNoteName(name: string): boolean {
  return !/^\d+$/.test(name.replace(/\.[^/.]+$/, ""));
}

function formatNoteTitle(name: string): string {
  return name.replace(/\.[^/.]+$/, "");
}

async function fetchUnitPdfs(
  supabase: SupabaseClient,
  semester: string,
  subject: string,
  unit: string,
): Promise<UnitPdf[]> {
  const folderPath = `${semester}/${subject}/${unit}`;
  const { data: files, error } = await supabase.storage
    .from("notes")
    .list(folderPath, {
      limit: 100,
      sortBy: { column: "name", order: "asc" },
    });

  if (error || !files) return [];

  return files
    .filter((file: { name: string }) => !IGNORED_FILES.has(file.name))
    .filter((file: { name: string }) => isValidNoteName(file.name))
    .map((file: { name: string }) => {
      const { data: urlData } = supabase.storage
        .from("notes")
        .getPublicUrl(`${folderPath}/${file.name}`);
      return { unitSlug: unit, title: formatNoteTitle(file.name), href: urlData.publicUrl };
    });
}

async function fetchUnitsWithFiles(
  supabase: SupabaseClient,
  semester: string,
  subject: string,
): Promise<Set<string>> {
  try {
    const { data, error } = await supabase
      .from("notes")
      .select("unit_slug", { count: "exact" })
      .eq("semester_key", semester)
      .eq("subject_slug", subject)
      .in("format", ["pdf", "course"])
      .gt("unit_slug", "");

    if (error || !data) return new Set();

    return new Set(data.map((n: { unit_slug: string }) => n.unit_slug));
  } catch {
    return new Set();
  }
}

async function fetchOverviewPdf(supabase: SupabaseClient): Promise<{ title: string; href: string } | null> {
  try {
    const { data: files, error } = await supabase.storage
      .from("notes")
      .list("course-overview", { limit: 100, sortBy: { column: "name", order: "asc" } });

    if (error || !files) return null;

    const pdfFile = files.find((f: { name: string }) => f.name.toLowerCase().endsWith(".pdf"));
    if (!pdfFile) return null;

    const { data: urlData } = supabase.storage.from("notes").getPublicUrl(`course-overview/${pdfFile.name}`);
    return { title: formatNoteTitle(pdfFile.name), href: urlData.publicUrl };
  } catch {
    return null;
  }
}

export default async function CourseContentPage() {
  const supabase = getSupabaseServer();

  const [overviewPdf, semestersWithPdfs] = await Promise.all([
    fetchOverviewPdf(supabase),
    Promise.all(
      semesters.map(async (semester) => {
        const subjects = await Promise.all(
          semester.subjects.map(async (subject) => {
            const unitsWithFiles = await fetchUnitsWithFiles(supabase, semester.key, subject.slug);

            const units = await Promise.all(
              subject.units.map(async (unit) => ({
                ...unit,
                pdfs: unitsWithFiles.has(unit.slug)
                  ? await fetchUnitPdfs(supabase, semester.key, subject.slug, unit.slug)
                  : [],
              }))
            );
            return { ...subject, units };
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
          <label htmlFor="course-pdf-toggle" className="csb-minimal-btn">
            Course PDF
          </label>
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
            {semester.subjects.map((subject) => (
              <div key={subject.slug} className="cc-unit">
                <div className="cc-unit-header">
                  <span className="cc-unit-num">{subject.code.replace("CSC ", "")}</span>
                  <div className="cc-unit-info">
                    <h3 className="cc-unit-title">{subject.title}</h3>
                    <p className="cc-unit-summary">{subject.credits} credits · {subject.units.length} units</p>
                  </div>
                </div>
                <div className="cc-topics">
                  {subject.units.map((unit, uIdx) => {
                    const unitPdfs = unit.pdfs || [];
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
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
