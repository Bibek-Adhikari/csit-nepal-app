import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getSubject, type SemesterKey } from "@/content/subjects";
import { subjectContent } from "@/content/generated/oop-in-java";
import { BackNav } from "@/components/back-nav";
import { ContentBody } from "@/components/content-body";

type ContentItem = {
  slug: string;
  heading: string;
  html: string;
};

type SubjectContent = {
  title: string;
  overview: string;
  sections: ContentItem[];
};

export async function generateStaticParams() {
  // Only subjects with generated content get a static page; others fall back
  // to the dynamic route below (returns "coming soon").
  return Object.keys(subjectContent).map((key) => {
    // key shape: /subjects/{semester}/{subject}
    const parts = key.replace(/^\/+|\/+$/g, "").split("/"); // [subjects, semester, subject]
    return {
      semester: parts[1] as SemesterKey,
      subject: parts[2] as string,
      // no unit path param here; content is subject-level
    };
  });
}

export default async function SubjectContentPage({
  params,
}: {
  params: Promise<{ semester: SemesterKey; subject: string }>;
}) {
  const { semester, subject } = await params;
  const subjectData = getSubject(semester, subject);

  if (!subjectData) {
    notFound();
  }

  const key = `/subjects/${semester}/${subject}`;
  const content: SubjectContent | undefined = (subjectContent as Record<string, SubjectContent>)[key];

  if (!content) {
    // Content not yet generated for this subject — graceful fallback so links
    // never 404. (Demo: only oop-in-java has content right now.)
    return (
      <>
        <BackNav href={`/subjects/${semester}/${subject}`} label={subjectData.title} />
        <section className="unit-hero">
          <div className="badge-row">
            <span className="sheet-badge accent">{subjectData.code}</span>
            <span className="sheet-badge">{subjectData.title}</span>
          </div>
          <h1 className="unit-hero-title" style={{ marginTop: "0.5rem" }}>{subjectData.title} Content</h1>
          <p className="unit-hero-desc">Readable, AI-summarized content is being prepared for this subject.</p>
        </section>
        <section className="unit-notes-section">
          <div className="unit-coming-soon">
            <i className="bx bx-book-open"></i>
            <span>Readable content for {subjectData.title} is coming soon.</span>
          </div>
          <Link
            href={`/subjects/${semester}/${subject}`}
            className="upload-btn upload-btn-secondary"
            style={{ marginTop: "1rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
          >
            <i className="bx bx-chevron-left"></i>
            Back to {subjectData.title}
          </Link>
        </section>
      </>
    );
  }

  return (
    <>
      <nav className="back-nav">
        <Link href={`/subjects/${semester}/${subject}`} className="back-nav-link">
          <i className="bx bx-chevron-left"></i>
          <span>{subjectData.title} · Content</span>
        </Link>
      </nav>

      <article className="legal-content">
        <header className="unit-hero">
          <div className="badge-row">
            <span className="sheet-badge accent">{subjectData.code}</span>
            <span className="sheet-badge">{subjectData.title}</span>
          </div>
          <h1 className="unit-hero-title">{subjectData.title}</h1>
          <p className="unit-hero-desc">{content.overview}</p>
        </header>

        <section style={{ marginTop: "1rem" }}>
          {content.sections.map((section) => (
            <ContentBody key={section.slug} section={section} />
          ))}
        </section>
      </article>

      <nav className="back-nav" style={{ paddingBottom: "1.5rem" }}>
        <Link
          href={`/notes/${semester}/${subject}/content`}
          className="back-nav-link"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
        >
          <i className="bx bx-list-ul"></i>
          Contents
        </Link>
        <Link
          href={`/subjects/${semester}/${subject}`}
          className="back-nav-link"
          style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.3rem" }}
        >
          <i className="bx bx-chevron-left"></i>
          Back to subject
        </Link>
      </nav>
    </>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ semester: SemesterKey; subject: string }>;
}): Promise<Metadata> {
  const { semester, subject } = await params;
  const subjectData = getSubject(semester, subject);
  const content = (subjectContent as Record<string, SubjectContent>)[`/subjects/${semester}/${subject}`];
  return {
    title: content?.title
      ? `${content.title} - Readable Content`
      : `${subjectData?.title || "Subject"} Content`,
    description:
      content?.overview ||
      `${subjectData?.title || "Subject"} readable, AI-summarized notes covering all units.`,
  };
}
