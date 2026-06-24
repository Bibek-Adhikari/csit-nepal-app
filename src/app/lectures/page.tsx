import { LectureGrid } from "@/components/lecture-grid";
import { BackNav } from "@/components/back-nav";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lectures",
  description: "Browse YouTube lectures for BCA with in-app playback. Watch instantly.",
  alternates: { canonical: "/lectures" },
};

export default function LecturesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "BCA Lecture Videos",
            description: "Browse YouTube lectures for BCA with in-app playback.",
          }),
        }}
      />
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h1>Lectures</h1>
        <p>
          Browse YouTube lectures with in-app playback. Tap any card to watch
          instantly.
        </p>
      </section>

      <div className="lecture-section">
        <div className="lecture-section-head">
          <div>
            <h3>Latest Uploads</h3>
            <p>Tap a card to watch in-app</p>
          </div>
        </div>
        <LectureGrid />
      </div>
    </>
  );
}