import { LectureGrid } from "@/components/lecture-grid";
import { BackNav } from "@/components/back-nav";

export default function LecturesPage() {
  return (
    <>
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h2>Lectures</h2>
        <p>
          All YouTube uploads with thumbnails, details, and direct links. The
          feed is data-driven so you can swap in Supabase later.
        </p>
      </section>

      <div className="lecture-section">
        <div className="lecture-section-head">
          <div>
            <h3>Latest Uploads</h3>
            <p>Tap a card to watch on YouTube</p>
          </div>
        </div>
        <LectureGrid />
      </div>
    </>
  );
}