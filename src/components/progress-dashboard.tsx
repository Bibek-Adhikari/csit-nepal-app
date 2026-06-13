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
        } catch (e) {
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
    <div className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
      <section className="rounded-[1.5rem] border border-border/80 bg-surface p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Progress Tracker</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-text">{completionRate}% completed</h2>
        <p className="mt-2 text-sm text-text-muted">Track completed units locally now, then sync to Supabase once you connect your user table.</p>
        <div className="mt-5 h-3 rounded-full bg-muted">
          <div className="h-3 rounded-full bg-gradient-to-r from-primary to-amber-500" style={{ width: `${completionRate}%` }} />
        </div>
      </section>

      <section className="rounded-[1.5rem] border border-border/80 bg-surface p-5 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Study Metrics</p>
        <div className="mt-4 grid grid-cols-2 gap-3">
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
    <div className="rounded-2xl bg-background p-4">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-text-muted">{label}</p>
      <p className="mt-2 text-2xl font-black tracking-tight text-text">{value}</p>
    </div>
  );
}