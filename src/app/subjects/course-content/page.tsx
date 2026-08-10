import type { Metadata } from "next";
import Link from "next/link";
import { semesters } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import { getSupabaseServer } from "@/lib/supabase";
import { CoursePdfUpload } from "@/components/course-pdf-upload";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Course Content",
  description: "Complete TU BCA course content — all semesters with units and PDF notes.",
};

interface NoteItem {
  title: string;
  href: string;
}

interface SubjectWithPdfs {
  slug: string;
  code: string;
  title: string;
  credits: string;
  units: UnitWithPdfs[];
  coursePdf: NoteItem | null;
}

interface UnitWithPdfs {
  slug: string;
  title: string;
  summary: string;
  pdfs: NoteItem[];
}

function isValidNoteName(name: string): boolean {
  const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
  if (/^\d+$/.test(nameWithoutExt)) return false;
  return true;
}

function formatNoteTitle(name: string): string {
  return name.replace(/\.[^/.]+$/, "");
}

function isPdfFile(name: string): boolean {
  return name.toLowerCase().endsWith(".pdf");
}

async function fetchCoursePdf(semester: string, subject: string): Promise<NoteItem | null> {
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
      isPdfFile(file.name) && isValidNoteName(file.name)
      && !file.name.toLowerCase().includes("solution")
    );
    if (!pdfFile) return null;

    const { data: urlData } = supabase.storage.from("notes").getPublicUrl(`${folderPath}/${pdfFile.name}`);
    return { title: formatNoteTitle(pdfFile.name), href: urlData.publicUrl };
  } catch {
    return null;
  }
}

async function fetchUnitPdfs(semester: string, subject: string, unit: string): Promise<NoteItem[]> {
  try {
    const supabase = getSupabaseServer();
    const folderPath = `${semester}/${subject}/${unit}`;
    const { data: files, error } = await supabase.storage
      .from("notes")
      .list(folderPath, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (error || !files) return [];

    const items: NoteItem[] = [];
    files.forEach((file: { name: string }) => {
      if (file.name === ".emptyFolderPlaceholder" || file.name === "placeholder.txt") return;
      if (!isValidNoteName(file.name)) return;
      const { data: urlData } = supabase.storage.from("notes").getPublicUrl(`${folderPath}/${file.name}`);
      items.push({ title: formatNoteTitle(file.name), href: urlData.publicUrl });
    });
    return items;
  } catch {
    return [];
  }
}

export default async function CourseContentPage() {
  const semestersWithPdfs = await Promise.all(
    semesters.map(async (semester) => {
      const subjects = await Promise.all(
        semester.subjects.map(async (subject) => {
          const [units, coursePdf] = await Promise.all([
            Promise.all(
              subject.units.map(async (unit) => ({
                slug: unit.slug,
                title: unit.title,
                summary: unit.summary,
                pdfs: await fetchUnitPdfs(semester.key, subject.slug, unit.slug),
              }))
            ),
            fetchCoursePdf(semester.key, subject.slug),
          ]);
          return {
            slug: subject.slug,
            code: subject.code,
            title: subject.title,
            credits: subject.credits,
            units,
            coursePdf,
          };
        })
      );
      return { ...semester, subjects };
    })
  );

  return (
    <>
      <BackNav href="/subjects" label="All Subjects" />
      <section className="welcome-hero">
        <div className="badge-row" style={{ margin: 0 }}>
          <span className="sheet-badge accent">Course Content</span>
        </div>
        <h1 style={{ marginTop: "0.5rem" }}>Full Course Structure</h1>
        <p>All semesters with units &amp; PDF notes.</p>
        <CoursePdfUpload />
      </section>

      {semestersWithPdfs.map((semester) => (
        <div key={semester.key}>
          <h3 className="section-headline">{semester.label}</h3>
          <div className="cc-units-list" style={{ marginTop: 0 }}>
            {semester.subjects.map((subject) => (
              <div key={subject.slug} className="cc-unit">
                <div className="cc-unit-header">
                  <span className="cc-unit-num">{subject.code.replace("BCA ", "")}</span>
                  <div className="cc-unit-info">
                    <h3 className="cc-unit-title">{subject.title}</h3>
                    <p className="cc-unit-summary">{subject.credits} credits · {subject.units.length} units</p>
                  </div>
                </div>
                {subject.coursePdf && (
                  <div className="cc-topics" style={{ marginTop: 0 }}>
                    <div className="cc-topic">
                      <div className="cc-topic-header">
                        <i className="bx bx-file cc-topic-icon" style={{ color: "#ef4444" }}></i>
                        <span className="cc-topic-title" style={{ fontWeight: 600 }}>Course Syllabus</span>
                      </div>
                      <ul className="cc-subtopics">
                        <li className="cc-subtopic">
                          <i className="bx bxs-file-pdf cc-subtopic-arrow" style={{ color: "var(--primary)", fontSize: "0.8rem", marginTop: "0.1rem" }}></i>
                          <Link
                            href={`/view-pdf?url=${encodeURIComponent(subject.coursePdf.href)}&title=${encodeURIComponent(subject.coursePdf.title)}&semester=${encodeURIComponent(semester.key)}&subject=${encodeURIComponent(subject.slug)}`}
                            className="cc-pdf-link"
                          >
                            {subject.coursePdf.title}
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                )}
                <div className="cc-topics">
                  {subject.units.map((unit, uIdx) => (
                    <div key={unit.slug} className="cc-topic">
                      <div className="cc-topic-header">
                        <i className="bx bx-book-open cc-topic-icon"></i>
                        <span className="cc-topic-title">{uIdx + 1}. {unit.title}</span>
                      </div>
                      {unit.pdfs.length > 0 ? (
                        <ul className="cc-subtopics">
                          {unit.pdfs.map((pdf) => (
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
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}
