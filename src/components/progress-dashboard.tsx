"use client";

import { useEffect, useMemo, useState } from "react";
import { semesters } from "@/content/subjects";
import { getTotalUnits } from "@/lib/progress";

const storageKey = "bca-nepal-completed-units";

export function ProgressDashboard() {
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);

  useEffect(() => {
    const loadCompleted = () => {
      const raw = window.localStorage.getItem(storageKey);
      if (raw) {
        try {
          setCompletedUnits(JSON.parse(raw) as string[]);
        } catch {
          setCompletedUnits([]);
        }
      } else {
        setCompletedUnits([]);
      }
    };

    loadCompleted();
    window.addEventListener("local-storage-update", loadCompleted);
    return () => window.removeEventListener("local-storage-update", loadCompleted);
  }, []);

  const totalUnits = useMemo(() => getTotalUnits(semesters), []);
  const completionRate = Math.round((completedUnits.length / totalUnits) * 100) || 0;

  return (
    <div className="progress-dashboard">
      <section className="progress-card">
        <p className="progress-label">Progress Tracker</p>
        <h2 className="progress-value">{completionRate}% completed</h2>
        <p className="progress-desc">
          Track completed units locally now, then sync to Supabase once you
          connect your user table.
        </p>
        <div className="progress-bar-track">
          <div
            className="progress-bar-fill"
            style={{ width: `${completionRate}%` }}
          />
        </div>
      </section>

      <section className="progress-card">
        <p className="progress-label">Study Metrics</p>
        <div className="metrics-grid">
          <Metric label="Semesters" value={semesters.length.toString()} />
          <Metric label="Units" value={totalUnits.toString()} />
          <Metric label="Completed" value={completedUnits.length.toString()} />
          <Metric label="Supabase" value="Ready" />
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="metric-box">
      <p className="metric-box-label">{label}</p>
      <p className="metric-box-value">{value}</p>
    </div>
  );
}