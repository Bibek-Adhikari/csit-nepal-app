"use client";

import Link from "next/link";
import { BackNav } from "@/components/back-nav";

export default function EntrancePage() {
  return (
    <>
      <BackNav href="/subjects" label="All Subjects" />
      <section className="welcome-hero">
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <i className="bx bxs-graduation" style={{ fontSize: "1.6rem", color: "var(--primary)" }}></i>
          <h2 style={{ margin: 0 }}>Entrance Preparation</h2>
        </div>
        <p>CSIT entrance exam prep — Questions, Mock Tests & study materials.</p>
      </section>

      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <Link href="/questions" className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bx-book-open" style={{ marginRight: "0.35rem" }}></i>
              Questions
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Study materials & question PDFs</span>
          </div>
          <i className="bx bx-chevron-right card-chevron"></i>
        </Link>

        <Link href="/mock-test" className="app-card" style={{ alignItems: "center", border: "1.5px solid var(--primary)" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bx-edit-alt" style={{ marginRight: "0.35rem", color: "var(--primary)" }}></i>
              Mock Test
            </span>
            <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Timed practice with customizable subjects</span>
          </div>
          <i className="bx bx-chevron-right card-chevron"></i>
        </Link>
      </div>
    </>
  );
}
