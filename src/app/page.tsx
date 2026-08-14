"use client";

import { useState } from "react";
import Link from "next/link";
import { WelcomeHero } from "@/components/welcome-hero";
import { AdBanner } from "@/components/ad-banner";
import { semesters, type Semester } from "@/content/subjects";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<string>(semesters[0].key);

  const isEntrance = activeTab === "entrance";
  const currentSemester: Semester | undefined = isEntrance
    ? undefined
    : semesters.find((s) => s.key === activeTab);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "CSIT Nepal",
            url: "https://csitnepal.vercel.app",
            description: "Free study companion for TU BSc CSIT students. Browse notes, watch YouTube lectures, track progress.",
            applicationCategory: "EducationalApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />
      <WelcomeHero />

      {/* Semester Scroller */}
      <h3 className="section-headline">Choose Semester</h3>
      <div className="semester-scroller">
        <button
          className={`pill-btn${isEntrance ? " active" : ""}`}
          onClick={() => setActiveTab("entrance")}
        >
          Entrance
        </button>
        {semesters.map((semester) => (
          <button
            key={semester.key}
            className={`pill-btn${activeTab === semester.key ? " active" : ""}`}
            onClick={() => setActiveTab(semester.key)}
          >
            {semester.label}
          </button>
        ))}
      </div>

      {/* Entrance Stack */}
      {isEntrance ? (
        <>
          <h3 className="section-headline">Entrance Preparation</h3>
          <div className="subject-stack">
            <Link href="/mock-test" className="app-card" style={{ alignItems: "center" }}>
              <div className="card-left">
                <span className="card-code">
                  <i className="bx bx-edit-alt" style={{ marginRight: "0.35rem" }}></i>
                  Mock Test
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Timed practice with customizable subjects</span>
              </div>
              <i className="bx bx-chevron-right card-chevron"></i>
            </Link>
            <Link href="/questions" className="app-card" style={{ alignItems: "center" }}>
              <div className="card-left">
                <span className="card-code">
                  <i className="bx bx-book-open" style={{ marginRight: "0.35rem" }}></i>
                  Past Questions
                </span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Study materials & question PDFs</span>
              </div>
              <i className="bx bx-chevron-right card-chevron"></i>
            </Link>
          </div>
        </>
      ) : (
        <>
          {/* Subject Stack */}
          <h3 className="section-headline">Subjects</h3>
          <div className="subject-stack">
            {currentSemester?.subjects.map((subject) => (
              <Link
                key={subject.code}
                href={`/subjects/${activeTab}/${subject.slug}`}
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
        </>
      )}

      {/* YouTube Banner */}
      <AdBanner />
      <a
        href="https://youtube.com/@bcanepall?si=CyehfgQKQg6m8ApG"
        target="_blank"
        rel="noreferrer noopener"
        className="youtube-embedded-banner"
      >
        <div className="yt-banner-left">
          <span>YouTube Channel</span>
          <h4>CSIT Nepal — Lectures &amp; Guides</h4>
          <p>Video walkthroughs for every semester subject</p>
        </div>
        <div className="yt-play-icon">
          <i className="bx bx-play" style={{ color: "#fff", fontSize: "1.6rem" }}></i>
        </div>
      </a>
    </>
  );
}
