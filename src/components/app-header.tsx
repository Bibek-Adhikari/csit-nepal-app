import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  return (
    <header className="app-header">
      <Link href="/" style={{ opacity: 0.9 }}>
        <h1>BCA<span>Nepal</span></h1>
      </Link>
      <div className="header-actions">
        <a href="https://youtube.com/@bcanepall?si=CyehfgQKQg6m8ApG" target="_blank" rel="noreferrer noopener" className="channel-badge">
          <i className="bx bxl-youtube"></i> Subscribe
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}