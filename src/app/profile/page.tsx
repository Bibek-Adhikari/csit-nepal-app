"use client";

import { useEffect, useMemo, useState } from "react";
import { semesters } from "@/content/subjects";
import { getTotalUnits } from "@/lib/progress";
import { BackNav } from "@/components/back-nav";
import { getStorageUsage, requestPersistentStorage, getAllPDFs, getBookmarkedPDFs } from "@/lib/db";
import Link from "next/link";

const storageKey = "bca-nepal-completed-units";

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

export default function ProfilePage() {
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, quota: 0 });
  const [pdfCount, setPdfCount] = useState(0);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [persistent, setPersistent] = useState(false);
  const [notifPermission, setNotifPermission] = useState<string>("default");
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIos, setShowIos] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    setIsIos(/iphone|ipad|ipod/.test(ua));

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

  useEffect(() => {
    const loadStorage = async () => {
      try {
        const usage = await getStorageUsage();
        setStorageInfo(usage);
        const pdfs = await getAllPDFs();
        setPdfCount(pdfs.length);
        const bookmarks = await getBookmarkedPDFs();
        setBookmarkCount(bookmarks.length);
        if ("storage" in navigator && "persist" in navigator.storage) {
          const persisted = await navigator.storage.persisted();
          setPersistent(persisted);
        }
        if ("Notification" in window) {
          setNotifPermission(Notification.permission);
        }
      } catch {}
    };
    loadStorage();
  }, []);

  const totalUnits = useMemo(() => getTotalUnits(semesters), []);
  const completionRate = Math.round((completedUnits.length / totalUnits) * 100) || 0;
  const storagePercent = storageInfo.quota > 0 ? Math.round((storageInfo.used / storageInfo.quota) * 100) : 0;

  const handlePersist = async () => {
    const result = await requestPersistentStorage();
    setPersistent(result);
  };

  return (
    <>
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h2>Profile</h2>
        <p>Track your study progress and manage preferences.</p>

        <div style={{ marginTop: "1rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "var(--primary)" }}>Progress</span>
            <span style={{ fontSize: "0.78rem", fontWeight: 800 }}>{completionRate}%</span>
          </div>
          <div style={{ height: "10px", borderRadius: "999px", background: "var(--bg-app-2)" }}>
            <div
              style={{
                height: "10px",
                borderRadius: "999px",
                background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
                width: `${completionRate}%`,
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </section>

      <h3 className="section-headline">Study Metrics</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <div className="app-stat-row">
          <div className="stat-bubble">
            <i className="bx bxs-book-alt"></i>
            <div>
              <div className="stat-val">{semesters.length}</div>
              <div className="stat-lbl">Semesters</div>
            </div>
          </div>
          <div className="stat-bubble">
            <i className="bx bxs-notepad"></i>
            <div>
              <div className="stat-val">{totalUnits}</div>
              <div className="stat-lbl">Total Units</div>
            </div>
          </div>
          <div className="stat-bubble">
            <i className="bx bxs-check-circle"></i>
            <div>
              <div className="stat-val">{completedUnits.length}</div>
              <div className="stat-lbl">Completed</div>
            </div>
          </div>
          <div className="stat-bubble">
            <i className="bx bxs-bookmark"></i>
            <div>
              <div className="stat-val">{bookmarkCount}</div>
              <div className="stat-lbl">Bookmarks</div>
            </div>
          </div>
        </div>
      </div>

      <h3 className="section-headline">Community</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <a
          href="https://www.facebook.com/groups/2295735577582143"
          target="_blank"
          rel="noopener noreferrer"
          className="app-card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="card-left">
            <span className="card-code">Facebook</span>
            <span className="card-title">Join BCA Nepal Group</span>
            <span className="card-meta-inline">Discuss, share notes, get help</span>
          </div>
          <i className="bx bx-link-external card-chevron"></i>
        </a>
        <a
          href="https://chat.whatsapp.com/GGTejd8pl941L6JCTGJzxd"
          target="_blank"
          rel="noopener noreferrer"
          className="app-card"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div className="card-left">
            <span className="card-code">WhatsApp</span>
            <span className="card-title">Join WhatsApp Community</span>
            <span className="card-meta-inline">Updates, alerts, and study tips</span>
          </div>
          <i className="bx bx-link-external card-chevron"></i>
        </a>
      </div>

      <h3 className="section-headline">Install App</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        {!isIos && (
          <div className="app-card" style={{ cursor: "pointer" }} onClick={() => setShowAndroid(!showAndroid)}>
            <div className="card-left">
              <span className="card-code">Android</span>
              <span className="card-title">Install on Android</span>
              <span className="card-meta-inline">Add to home screen via Chrome</span>
            </div>
            <i className={`bx bx-chevron-${showAndroid ? "up" : "down"} card-chevron`}></i>
          </div>
        )}
        {showAndroid && (
          <div className="pwa-steps">
            <div className="pwa-step">
              <span className="pwa-step-num">1</span>
              <div className="pwa-step-content">
                <h4>Open in Chrome</h4>
                <p>Open this website in your <strong>Chrome</strong> browser</p>
              </div>
            </div>
            <div className="pwa-step">
              <span className="pwa-step-num">2</span>
              <div className="pwa-step-content">
                <h4>Tap Install</h4>
                <p>Tap the <strong>Install</strong> banner at the bottom, or go to <strong>3-dot menu</strong> then <strong>Install app</strong></p>
              </div>
            </div>
            <div className="pwa-step">
              <span className="pwa-step-num">3</span>
              <div className="pwa-step-content">
                <h4>Done!</h4>
                <p>BCA Nepal is now on your home screen. Open it anytime — even offline.</p>
              </div>
            </div>
          </div>
        )}

        <div className="app-card" style={{ cursor: "pointer" }} onClick={() => setShowIos(!showIos)}>
          <div className="card-left">
            <span className="card-code">iPhone</span>
            <span className="card-title">Install on iPhone / iPad</span>
            <span className="card-meta-inline">Add to home screen via Safari</span>
          </div>
          <i className={`bx bx-chevron-${showIos ? "up" : "down"} card-chevron`}></i>
        </div>
        {showIos && (
          <div className="pwa-steps">
            <div className="pwa-step">
              <span className="pwa-step-num">1</span>
              <div className="pwa-step-content">
                <h4>Open in Safari</h4>
                <p>Open this website in <strong>Safari</strong> (not Chrome)</p>
              </div>
            </div>
            <div className="pwa-step">
              <span className="pwa-step-num">2</span>
              <div className="pwa-step-content">
                <h4>Tap Share</h4>
                <p>Tap the <strong>Share</strong> button (square with arrow) at the bottom</p>
              </div>
            </div>
            <div className="pwa-step">
              <span className="pwa-step-num">3</span>
              <div className="pwa-step-content">
                <h4>Add to Home Screen</h4>
                <p>Scroll down and tap <strong>Add to Home Screen</strong></p>
              </div>
            </div>
            <div className="pwa-step">
              <span className="pwa-step-num">4</span>
              <div className="pwa-step-content">
                <h4>Done!</h4>
                <p>Tap <strong>Add</strong> in the top right. BCA Nepal is now on your home screen.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <h3 className="section-headline">Offline Storage</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <div className="app-card" style={{ flexDirection: "column", alignItems: "stretch", gap: "0.75rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div className="card-left">
              <span className="card-code">PWA</span>
              <span className="card-title">PDFs Saved Offline</span>
              <span className="card-meta-inline">{pdfCount} file{pdfCount !== 1 ? "s" : ""} stored</span>
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "var(--text-muted)" }}>{formatBytes(storageInfo.used)}</span>
          </div>
          {storageInfo.quota > 0 && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.3rem" }}>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>Storage used</span>
                <span style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>{formatBytes(storageInfo.used)} / {formatBytes(storageInfo.quota)}</span>
              </div>
              <div style={{ height: "6px", borderRadius: "999px", background: "var(--bg-app-2)" }}>
                <div style={{ height: "6px", borderRadius: "999px", background: storagePercent > 80 ? "#ef4444" : "var(--primary)", width: `${Math.min(storagePercent, 100)}%`, transition: "width 0.4s ease" }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <h3 className="section-headline">Settings</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <div className="app-card" style={{ cursor: "default" }}>
          <div className="card-left">
            <span className="card-code">Status</span>
            <span className="card-title">{persistent ? "Persistent Storage" : "Standard Storage"}</span>
            <span className="card-meta-inline">{persistent ? "PDFs won't be auto-cleared" : "Browser may clear when storage is low"}</span>
          </div>
          {!persistent && (
            <button className="pill-btn" onClick={handlePersist} style={{ fontSize: "0.72rem", padding: "0.4rem 0.8rem" }}>
              Enable
            </button>
          )}
          {persistent && <i className="bx bx-check-circle" style={{ color: "#22c55e", fontSize: "1.2rem" }}></i>}
        </div>
        <div className="app-card" style={{ cursor: "default" }}>
          <div className="card-left">
            <span className="card-code">Notifications</span>
            <span className="card-title">Push Notifications</span>
            <span className="card-meta-inline">Get notified about new content</span>
          </div>
          <span style={{ fontSize: "0.75rem", fontWeight: 700, color: notifPermission === "granted" ? "#22c55e" : "var(--text-muted)" }}>
            {notifPermission === "granted" ? "Enabled" : notifPermission === "denied" ? "Blocked" : "Off"}
          </span>
        </div>
      </div>

      <h3 className="section-headline">Admin</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <Link href="/upload" className="app-card" style={{ textDecoration: "none" }}>
          <div className="card-left">
            <span className="card-code">Admin</span>
            <span className="card-title">Upload Notes</span>
            <span className="card-meta-inline">Add PDFs to Supabase storage</span>
          </div>
          <i className="bx bx-cloud-upload card-chevron"></i>
        </Link>
      </div>
    </>
  );
}
