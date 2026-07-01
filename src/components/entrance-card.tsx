"use client";

import Link from "next/link";

export function EntranceCard() {
  return (
    <div className="app-card" style={{
      background: "linear-gradient(135deg, var(--primary-light), transparent)",
      border: "1px solid var(--primary)",
      opacity: 0.35,
      cursor: "default",
      transition: "opacity 0.3s ease",
    }}>
      <div className="card-left">
        <span className="card-code">
          <i className="bx bxs-graduation" style={{ marginRight: "0.35rem" }}></i>
          Entrance Preparation
        </span>
        <span style={{ fontSize: "0.72rem", fontWeight: 600, color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <i className="bx bxs-lock-alt"></i>
          Coming soon
        </span>
      </div>
    </div>
  );
}
