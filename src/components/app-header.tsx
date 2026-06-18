"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
  };

  useEffect(() => {
    if (!showToast) return;
    const t = setTimeout(() => setShowToast(false), 3500);
    return () => clearTimeout(t);
  }, [showToast]);

  return (
    <header className="app-header">
      {showToast && (
        <div className="app-toast">
          <i className="bx bx-check-circle"></i>
          <span>{toastMsg}</span>
        </div>
      )}
      <Link href="/" className="app-logo-link">
        <Image
          src="/logo.jpg"
          alt="BCA Nepal"
          width={36}
          height={36}
          className="app-logo-img"
        />
        <h1>BCA<span>Nepal</span></h1>
      </Link>
      <div className="header-actions">
        <button
          type="button"
          className="notification-bell"
          aria-label="Notifications"
          onClick={() => showNotification("Welcome to BCA Nepal! New notes are being added for each lecture.")}
        >
          <i className="bx bx-bell"></i>
        </button>
        <a href="https://youtube.com/@bcanepall?si=CyehfgQKQg6m8ApG" target="_blank" rel="noreferrer noopener" className="channel-badge">
          <i className="bx bxl-youtube"></i> Subscribe
        </a>
        <ThemeToggle />
      </div>
    </header>
  );
}