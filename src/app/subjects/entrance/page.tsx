import { entranceTopics } from "@/content/entrance";
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
        <p>BCA entrance exam prep — Mathematics, English, Computer & GK.</p>
      </section>

      <div className="subject-stack">
        {entranceTopics.map((topic) => (
          <div key={topic.slug} className="app-card" style={{ alignItems: "center" }}>
            <div className="card-left">
              <span className="card-code">
                <i className={`bx ${topic.icon}`} style={{ marginRight: "0.35rem" }}></i>
                {topic.title}
              </span>
            </div>
          </div>
        ))}
      </div>

      <h3 className="section-headline" style={{ marginTop: "1rem" }}>Old Questions</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <div className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
              BCA Entrance 2081
            </span>
          </div>
          <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
        </div>
        <div className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
              BCA Entrance 2080
            </span>
          </div>
          <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
        </div>
        <div className="app-card" style={{ alignItems: "center" }}>
          <div className="card-left">
            <span className="card-code">
              <i className="bx bxs-file-pdf" style={{ marginRight: "0.35rem" }}></i>
              BCA Entrance 2079
            </span>
          </div>
          <i className="bx bx-download card-chevron" style={{ fontSize: "1.2rem" }}></i>
        </div>
      </div>
    </>
  );
}
