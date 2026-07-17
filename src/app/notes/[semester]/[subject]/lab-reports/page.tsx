import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject, semesters, type SemesterKey } from "@/content/subjects";
import { BackNav } from "@/components/back-nav";
import { getSupabaseServer } from "@/lib/supabase";

interface NoteItem {
  href: string;
  title: string;
}

export const dynamic = 'force-dynamic';

function formatNoteTitle(name: string): string {
  return name.replace(/\.[^/.]+$/, "");
}

function isValidNoteName(name: string): boolean {
  const nameWithoutExt = name.replace(/\.[^/.]+$/, "");
  if (/^\d+$/.test(nameWithoutExt)) return false;
  return true;
}

export async function generateMetadata({ params }: { params: Promise<{ semester: SemesterKey; subject: string }> }) {
  const { semester, subject } = await params;
  const data = getSubject(semester, subject);
  return {
    title: `Lab Reports - ${data?.title || "Subject"}`,
    description: `Lab reports for ${data?.title || "Subject"}.`,
  };
}

export default async function LabReportsPage({
  params,
}: {
  params: Promise<{ semester: SemesterKey; subject: string }>;
}) {
  const { semester, subject } = await params;
  const subjectData = getSubject(semester, subject);

  if (!subjectData) {
    notFound();
  }

  const labNotes: NoteItem[] = [];

  try {
    const supabase = getSupabaseServer();
    const folderPath = `${semester}/${subject}/lab-reports`;

    const { data: dbNotes } = await supabase
      .from("notes")
      .select("title, public_url, file_path")
      .eq("semester_key", semester)
      .eq("subject_slug", subject)
      .eq("unit_slug", "lab-reports");

    const dbByPath: Record<string, { title: string; public_url: string }> = {};
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

        if (dbNote) {
          title = dbNote.title || formatNoteTitle(file.name);
          href = dbNote.public_url;
        } else {
          const { data: urlData } = supabase.storage.from("notes").getPublicUrl(fullPath);
          title = formatNoteTitle(file.name);
          href = urlData.publicUrl;
        }

        labNotes.push({ title, href });
      });
    }
  } catch (err) {
    console.error("Failed to load lab reports from Supabase:", err);
  }

  const viewUrl = (item: NoteItem) =>
    `/view-pdf?url=${encodeURIComponent(item.href)}&title=${encodeURIComponent(item.title)}&semester=${encodeURIComponent(semester)}&subject=${encodeURIComponent(subject)}&unit=lab-reports`;

  return (
    <>
      <BackNav href={`/subjects/${semester}/${subject}`} label={subjectData.title} />
      <section className="unit-hero">
        <div className="badge-row" style={{ margin: 0 }}>
          <span className="sheet-badge accent">{semester}</span>
          <span className="sheet-badge">{subjectData.code}</span>
        </div>
        <h1 className="unit-hero-title" style={{ marginTop: "0.5rem" }}>Lab Reports</h1>
      </section>

      {labNotes.length > 0 && (
        <section className="unit-notes-section">
          <h3 className="section-headline"><i className="bx bx-beaker" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>Lab Reports</h3>
          <div className="unit-notes-list">
            {labNotes.map((item) => (
              <Link
                key={item.href}
                href={viewUrl(item)}
                className="unit-note-card"
              >
                <i className="bx bxs-file-pdf unit-note-icon" style={{ color: "var(--primary)" }}></i>
                <span className="unit-note-title">{item.title}</span>
                <i className="bx bx-show unit-note-dl"></i>
              </Link>
            ))}
          </div>
        </section>
      )}

      {labNotes.length === 0 && (
        <section className="unit-notes-section">
          <div className="unit-coming-soon">
            <i className="bx bx-time-five"></i>
            <span>Lab reports are being prepared &mdash; check back soon!</span>
          </div>
        </section>
      )}

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
