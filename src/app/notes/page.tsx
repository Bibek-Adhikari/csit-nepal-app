import { NotesTree } from "@/components/notes-tree";

export default function NotesPage() {
  return (
    <>
      <section className="welcome-hero">
        <h2>Notes</h2>
        <p>
          Subject-wise PDF and handwritten notes for every unit. Organized by
          semester, subject, and unit for easy browsing.
        </p>
      </section>
      <div style={{ padding: "0 1rem 1.5rem" }}>
        <NotesTree />
      </div>
    </>
  );
}