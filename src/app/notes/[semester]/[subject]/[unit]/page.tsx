import Link from "next/link";
import { notFound } from "next/navigation";
import { getSemester, getSubject, getUnit, semesters, type SemesterKey } from "@/content/subjects";
import { CompletionToggle } from "@/components/completion-toggle";
import { RelatedLectures } from "@/components/related-lectures";
import { getSupabaseServer } from "@/lib/supabase";
import { BackNav } from "@/components/back-nav";

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

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ semester: string; subject: string; unit: string }> }) {
  const { semester, subject, unit } = await params;
  const semesterData = getSemester(semester as SemesterKey);
  const subjectData = getSubject(semester as SemesterKey, subject);
  const unitData = getUnit(semester as SemesterKey, subject, unit);
  const title = unitData ? `${unitData.title} - ${subjectData?.title || subject} Notes` : "Notes";
  const description = unitData
    ? `Download ${unitData.title} notes and handwritten PDFs for ${subjectData?.title || subject} (${semesterData?.label || semester}). BCA study material.`
    : "BCA notes and study materials.";
  return {
    title,
    description,
    alternates: { canonical: `/notes/${semester}/${subject}/${unit}` },
  };
}

function isValidNoteName(name: string): boolean {
  const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
  if (/^\d+$/.test(nameWithoutExt)) return false;
  return true;
}

function formatNoteTitle(name: string): string {
  return name.replace(/\.[^/.]+$/, "");
}

function NoteCard({ item, type, semester, subject, unit }: { item: NoteItem; type: "pdf" | "handwritten"; semester: string; subject: string; unit: string }) {
  const isPdf = type === "pdf";
  const viewUrl = `/view-pdf?url=${encodeURIComponent(item.href)}&title=${encodeURIComponent(item.title)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subject)}&unit=${encodeURIComponent(unit)}`;
  return (
    <Link
      href={viewUrl}
      className="unit-note-card"
    >
      <i className={`bx ${isPdf ? "bxs-file-pdf" : "bxs-pencil"} unit-note-icon`} style={{ color: isPdf ? "var(--primary)" : "var(--text-muted)" }}></i>
      <span className="unit-note-title">{item.title}</span>
      <i className="bx bx-show unit-note-dl"></i>
    </Link>
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

  const supabaseNotes: { pdf: NoteItem[]; handwritten: NoteItem[] } = { pdf: [], handwritten: [] };

  try {
    const supabase = getSupabaseServer();
    const folderPath = `${semester}/${subject}/${unit}`;

    const { data: dbNotes } = await supabase
      .from("notes")
      .select("title, public_url, format, file_path")
      .eq("semester_key", semester)
      .eq("subject_slug", subject)
      .eq("unit_slug", unit);

    const dbByPath: Record<string, { title: string; public_url: string; format: string }> = {};
    if (dbNotes) {
      for (const note of dbNotes) {
        dbByPath[note.file_path] = note;
      }
    }

    const { data: files, error } = await supabase.storage
      .from("notes")
      .list(folderPath, {
        limit: 100,
        sortBy: { column: "name", order: "asc" },
      });

    if (!error && files) {
      files.forEach((file: { name: string }) => {
        if (file.name === ".emptyFolderPlaceholder" || file.name === "placeholder.txt") return;
        if (!isValidNoteName(file.name)) return;

        const fullPath = `${folderPath}/${file.name}`;
        const dbNote = dbByPath[fullPath];

        let title: string;
        let href: string;
        let format: "pdf" | "handwritten";

        if (dbNote) {
          title = dbNote.title || formatNoteTitle(file.name);
          href = dbNote.public_url;
          format = dbNote.format as "pdf" | "handwritten";
        } else {
          const { data: urlData } = supabase.storage.from("notes").getPublicUrl(fullPath);
          title = formatNoteTitle(file.name);
          href = urlData.publicUrl;
          const lowerName = file.name.toLowerCase();
          format = (lowerName.includes("handwritten") || lowerName.includes("hw")) ? "handwritten" : "pdf";
        }

        const noteItem: NoteItem = { title, href };

        if (format === "handwritten") {
          supabaseNotes.handwritten.push(noteItem);
        } else {
          supabaseNotes.pdf.push(noteItem);
        }
      });
    }
  } catch (err) {
    console.error("Failed to dynamically load notes from Supabase:", err);
  }

  const pdfNotes = [...unitData.notes.pdf, ...supabaseNotes.pdf];
  const handwrittenNotes = [...unitData.notes.handwritten, ...supabaseNotes.handwritten];

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bcanepal.vercel.app";

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
              { "@type": "ListItem", position: 4, name: unitData.title, item: `${siteUrl}/notes/${semester}/${subject}/${unit}` },
            ],
          }),
        }}
      />
      <BackNav href={`/subjects/${semester}/${subject}`} label={subjectData.title} />
      <section className="unit-hero">
        <div className="unit-hero-top">
          <div className="badge-row" style={{ margin: 0 }}>
            <span className="sheet-badge accent">{semesterData.label}</span>
            <span className="sheet-badge">{subjectData.code}</span>
          </div>
          <CompletionToggle semesterKey={semester} subjectSlug={subject} unitSlug={unit} />
        </div>
        <h1 className="unit-hero-title">{unitData.title}</h1>
      </section>

      <div className="unit-quiz-cta">
        <Link
          href={`/quiz/${semester}/${subject}`}
          className="pill-btn"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <i className="bx bx-question-mark"></i>
          Take {subjectData.title} Quiz
        </Link>
      </div>

      {pdfNotes.length > 0 && (
        <section className="unit-notes-section">
          <h3 className="section-headline"><i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>PDF &mdash; Course</h3>
          <div className="unit-notes-list">
            {pdfNotes.map((item: NoteItem) => (
              <NoteCard key={item.href} item={item} type="pdf" semester={semester} subject={subject} unit={unit} />
            ))}
          </div>
        </section>
      )}

      {handwrittenNotes.length > 0 && (
        <section className="unit-notes-section">
          <h3 className="section-headline"><i className="bx bxs-pencil" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>Handwritten</h3>
          <div className="unit-notes-list">
            {handwrittenNotes.map((item: NoteItem) => (
              <NoteCard key={item.href} item={item} type="handwritten" semester={semester} subject={subject} unit={unit} />
            ))}
          </div>
        </section>
      )}

      {pdfNotes.length === 0 && handwrittenNotes.length === 0 && (
        <section className="unit-notes-section">
          <div className="unit-coming-soon">
            <i className="bx bx-time-five"></i>
            <span>Notes for this unit are being prepared &mdash; check back soon!</span>
          </div>
        </section>
      )}

      <RelatedLectures semesterKey={semester} subjectSlug={subject} />

      <div className="unit-back-row">
        <Link
          href={`/subjects/${semester}/${subject}`}
          className="pill-btn"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}
        >
          <i className="bx bx-arrow-back"></i>
          Back to {subjectData.title}
        </Link>
      </div>
    </>
  );
}

