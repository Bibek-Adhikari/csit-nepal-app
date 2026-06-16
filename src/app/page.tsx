"use client";

import { useState } from "react";
import Link from "next/link";
import { WelcomeHero } from "@/components/welcome-hero";
import { semesters, type Semester } from "@/content/subjects";

export default function HomePage() {
  const [activeSemester, setActiveSemester] = useState<string>(semesters[0].key);

  const currentSemester: Semester | undefined = semesters.find(
    (s) => s.key === activeSemester
  );

  return (
    <>
      <WelcomeHero />

      {/* Semester Scroller */}
      <h3 className="section-headline">Choose Semester</h3>
      <div className="semester-scroller">
        {semesters.map((semester) => (
          <button
            key={semester.key}
            className={`pill-btn${activeSemester === semester.key ? " active" : ""}`}
            onClick={() => setActiveSemester(semester.key)}
          >
            {semester.label}
          </button>
        ))}
      </div>

      {/* Subject Stack */}
      <h3 className="section-headline">Subjects</h3>
      <div className="subject-stack">
        {currentSemester?.subjects.map((subject) => (
          <Link
            key={subject.code}
            href={`/subjects/${activeSemester}/${subject.slug}`}
            className="app-card"
          >
            <div className="card-left">
              <span className="card-code">{subject.code}</span>
              <span className="card-title">{subject.title}</span>
              <span className="card-meta-inline">
                {subject.credits} &middot; {subject.units.length} units
              </span>
            </div>
            <i className="bx bx-chevron-right card-chevron"></i>
          </Link>
        ))}
      </div>

      {/* YouTube Banner */}
      <a
        href="https://youtube.com/@bcanepall?si=CyehfgQKQg6m8ApG"
        target="_blank"
        rel="noreferrer noopener"
        className="youtube-embedded-banner"
      >
        <div className="yt-banner-left">
          <span>YouTube Channel</span>
          <h4>BCA Nepal — Lectures &amp; Guides</h4>
          <p>Video walkthroughs for every semester subject</p>
        </div>
        <div className="yt-play-icon">
          <i className="bx bx-play" style={{ color: "#fff", fontSize: "1.6rem" }}></i>
        </div>
      </a>
    </>
  );
}
