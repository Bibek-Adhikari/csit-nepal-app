import Link from "next/link";

export function EntranceCard() {
  return (
    <Link href="/subjects/entrance" className="app-card" style={{
      background: "linear-gradient(135deg, var(--primary-light), transparent)",
      border: "1px solid var(--primary)",
    }}>
      <div className="card-left">
        <span className="card-code">
          <i className="bx bxs-graduation" style={{ marginRight: "0.35rem" }}></i>
          Entrance Preparation
        </span>
      </div>
      <i className="bx bx-chevron-right card-chevron"></i>
    </Link>
  );
}
