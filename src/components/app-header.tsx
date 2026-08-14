"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { ThemeToggle } from "./theme-toggle";
import { NotificationPanel } from "./notification-panel";

export function AppHeader() {
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <header className="app-header">
      <Link href="/" className="app-logo-link">
        <Image
          src="/logo.jpg"
          alt="CSIT Nepal"
          width={36}
          height={36}
          className="app-logo-img"
        />
        <h1>CSIT<span>Nepal</span></h1>
      </Link>
      <div className="header-actions">
        <button className="channel-badge" onClick={() => setNotifOpen(true)} style={{ background: "none", border: "none", cursor: "pointer" }}>
          <i className="bx bx-bell"></i>
        </button>
        <a href="https://youtube.com/@bcanepall?si=CyehfgQKQg6m8ApG" target="_blank" rel="noreferrer noopener" className="channel-badge">
          <i className="bx bxl-youtube"></i>
        </a>
        <ThemeToggle />
      </div>
      <NotificationPanel open={notifOpen} onClose={() => setNotifOpen(false)} />
    </header>
  );
}