import { LectureGrid } from "@/components/lecture-grid";
import { BackNav } from "@/components/back-nav";

export default function LecturesPage() {
  return (
    <>
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h2>Lectures</h2>
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