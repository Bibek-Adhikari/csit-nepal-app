import Image from "next/image";
import { semesters } from "@/content/subjects";
import { getTotalUnits } from "@/lib/progress";

export function WelcomeHero() {
  const totalSubjects = semesters.reduce((acc, s) => acc + s.subjects.length, 0);
  const totalUnits = getTotalUnits(semesters);

  return (
    <section className="welcome-hero">
        <Image
          src="/icons/fabi.jpg"
          alt="BCA Nepal"
          width={300}
          height={200}
          className="hero-avatar"
        />
      <div className="hero-top">
        <div>
          <h2>
            BCA<span> Nepal</span> study hub
          </h2>
          <p>
            Browse semester-specific subjects, open YouTube lectures, and study
            notes grouped by subject &amp; unit.
          </p>
        </div>
      </div>
      <div className="app-stat-row">
        <div className="stat-bubble">
          <i className="bx bxs-book-alt"></i>
          <div>
            <div className="stat-val">{semesters.length}</div>
            <div className="stat-lbl">Semesters</div>
          </div>
        </div>
        <div className="stat-bubble">
          <i className="bx bxs-layer"></i>
          <div>
            <div className="stat-val">{totalSubjects}</div>
            <div className="stat-lbl">Subjects</div>
          </div>
        </div>
        <div className="stat-bubble">
          <i className="bx bxs-notepad"></i>
          <div>
            <div className="stat-val">{totalUnits}</div>
            <div className="stat-lbl">Units</div>
          </div>
        </div>
        <div className="stat-bubble">
          <i className="bx bxs-videos"></i>
          <div>
            <div className="stat-val">Live</div>
            <div className="stat-lbl">Lectures</div>
          </div>
        </div>
      </div>
    </section>
  );
}
