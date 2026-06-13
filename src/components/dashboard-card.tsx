import Link from "next/link";
import type { Semester } from "@/content/subjects";

export function DashboardCard({ semester }: { semester: Semester }) {
  return (
    <Link
      href={`/subjects/${semester.key}`}
      className="group rounded-[1.6rem] border border-border/80 bg-surface p-5 shadow-soft transition hover:-translate-y-1 hover:shadow-card"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">{semester.label}</p>
          <h3 className="mt-2 text-lg font-black tracking-tight text-text">{semester.overview}</h3>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Open</span>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {semester.subjects.slice(0, 3).map((subject) => (
          <div key={subject.code} className="rounded-2xl bg-background p-4">
            <p className="text-xs font-bold text-primary">{subject.code}</p>
            <p className="mt-1 font-semibold text-text">{subject.title}</p>
            <p className="mt-1 text-xs leading-5 text-text-muted">{subject.overview}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}