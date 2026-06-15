import Link from "next/link";
import type { Semester } from "@/content/subjects";

export function DashboardCard({ semester }: { semester: Semester }) {
  return (
    <Link
      href={`/subjects/${semester.key}`}
      className="dashboard-card"
    >
      <div className="dashboard-card-head">
        <div>
          <p className="dashboard-card-sem">{semester.label}</p>
          <h3 className="dashboard-card-title">{semester.overview}</h3>
        </div>
        <span className="dashboard-card-open">Open</span>
      </div>
      <div className="dashboard-card-subjects">
        {semester.subjects.slice(0, 3).map((subject) => (
          <div key={subject.code} className="dashboard-subject-box">
            <p className="dashboard-subject-code">{subject.code}</p>
            <p className="dashboard-subject-name">{subject.title}</p>
            <p className="dashboard-subject-desc">{subject.overview}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}