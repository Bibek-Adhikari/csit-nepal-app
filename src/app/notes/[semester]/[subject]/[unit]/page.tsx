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

function isValidNoteName(name: string): boolean {
  const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
  if (/^\d+$/.test(nameWithoutExt)) return false;
  if (/^\d{8,}[\s_-]/.test(nameWithoutExt)) return false;
  return true;
}

function formatNoteTitle(name: string): string {
  return name
    .replace(/\.[^/.]+$/, "")
    .replace(/[-_]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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

        const { data: urlData } = supabase.storage
          .from("notes")
          .getPublicUrl(`${folderPath}/${file.name}`);

        const noteItem: NoteItem = {
          title: formatNoteTitle(file.name),
          href: urlData.publicUrl,
        };

        const lowerName = file.name.toLowerCase();
        if (lowerName.includes("handwritten") || lowerName.includes("hw")) {
          supabaseNotes.handwritten.push(noteItem);
        } else {
          supabaseNotes.pdf.push(noteItem);
        }
      });
    }
  } catch (err) {
    console.error("Failed to dynamically load notes from Supabase Storage:", err);
  }

  const pdfNotes = [...unitData.notes.pdf, ...supabaseNotes.pdf];
  const handwrittenNotes = [...unitData.notes.handwritten, ...supabaseNotes.handwritten];

  return (
    <>
      <BackNav href={`/subjects/${semester}/${subject}`} label={subjectData.title} />
      <section className="unit-hero">
        <div className="unit-hero-top">
          <div className="badge-row" style={{ margin: 0 }}>
            <span className="sheet-badge accent">{semesterData.label}</span>
            <span className="sheet-badge">{subjectData.code}</span>
          </div>
          <CompletionToggle semesterKey={semester} subjectSlug={subject} unitSlug={unit} />
        </div>
        <h2 className="unit-hero-title">{unitData.title}</h2>
      </section>

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

