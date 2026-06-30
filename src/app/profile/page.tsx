"use client";

import { useEffect, useMemo, useState } from "react";
import { semesters } from "@/content/subjects";
import { getTotalUnits } from "@/lib/progress";
import { BackNav } from "@/components/back-nav";
import { getBookmarkedPDFs } from "@/lib/db";
import Link from "next/link";

const storageKey = "bca-nepal-completed-units";
const DEFAULT_SEMESTER_KEY = "bca-nepal-default-semester";

export default function ProfilePage() {
  const [completedUnits, setCompletedUnits] = useState<string[]>([]);
  const [bookmarkCount, setBookmarkCount] = useState(0);
  const [defaultSemester, setDefaultSemester] = useState("");
  const [showAndroid, setShowAndroid] = useState(false);
  const [showIos, setShowIos] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(DEFAULT_SEMESTER_KEY);
      if (saved) setDefaultSemester(saved);
    } catch {}
  }, []);

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
    (async () => {
      try {
        const bookmarks = await getBookmarkedPDFs();
        setBookmarkCount(bookmarks.length);
      } catch {}
    })();
  }, []);

  const totalUnits = useMemo(() => getTotalUnits(semesters), []);
  const completionRate = Math.round((completedUnits.length / totalUnits) * 100) || 0;

  return (
    <>
      <BackNav href="/" label="Home" />
      <section className="welcome-hero">
        <h1>Profile</h1>
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

      <h3 className="section-headline">Preferences</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <div className="app-card">
          <div className="card-left" style={{ width: "100%" }}>
            <span className="card-code">Default Semester</span>
            <span className="card-title" style={{ marginBottom: "0.3rem" }}>Jump directly to a semester when tapping Subjects</span>
            <select
              value={defaultSemester}
              onChange={(e) => {
                const val = e.target.value;
                setDefaultSemester(val);
                try {
                  if (val) localStorage.setItem(DEFAULT_SEMESTER_KEY, val);
                  else localStorage.removeItem(DEFAULT_SEMESTER_KEY);
                  window.dispatchEvent(new Event("default-semester-change"));
                } catch {}
              }}
              style={{
                width: "100%",
                padding: "0.6rem 0.75rem",
                borderRadius: "10px",
                border: "1px solid var(--border)",
                background: "var(--bg-app-2)",
                color: "var(--text)",
                fontSize: "0.9rem",
                marginTop: "0.25rem",
              }}
            >
              <option value="">None (show semester list)</option>
              {semesters.map((s) => (
                <option key={s.key} value={s.key}>{s.label}</option>
              ))}
            </select>
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

      <h3 className="section-headline">Share</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <div className="app-card" style={{ cursor: "pointer" }} onClick={() => setShowShare(!showShare)}>
          <div className="card-left">
            <span className="card-code">Share</span>
            <span className="card-title">Share BCA Nepal</span>
            <span className="card-meta-inline">Scan QR code to share with friends</span>
          </div>
          <i className={`bx bx-chevron-${showShare ? "up" : "down"} card-chevron`}></i>
        </div>
        {showShare && (
          <div className="pwa-steps" style={{ marginTop: "0.5rem" }}>
            <div className="pwa-step" style={{ flexDirection: "column", alignItems: "center", textAlign: "center", gap: "1rem" }}>
              <img src="/qr_bca.png" alt="Share BCA Nepal" className="protect" style={{ width: "100%", maxWidth: 220, height: "auto", borderRadius: 16 }} />
              <div className="pwa-step-content" style={{ textAlign: "center" }}>
                <h4>Scan to Share</h4>
                <p>Share this QR code with friends</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <h3 className="section-headline">Admin</h3>
      <div className="subject-stack" style={{ paddingBottom: "0.5rem" }}>
        <Link href="/admin" className="app-card" style={{ textDecoration: "none" }}>
          <div className="card-left">
            <span className="card-code">Admin</span>
            <span className="card-title">Admin Panel</span>
            <span className="card-meta-inline">Manage all uploaded PDFs</span>
          </div>
          <i className="bx bx-grid-alt card-chevron"></i>
        </Link>
        <Link href="/upload" className="app-card" style={{ textDecoration: "none" }}>
          <div className="card-left">
            <span className="card-code">Admin</span>
            <span className="card-title">Upload Notes</span>
            <span className="card-meta-inline">Add PDFs to Supabase storage</span>
          </div>
          <i className="bx bx-cloud-upload card-chevron"></i>
        </Link>
      </div>

      <h3 className="section-headline">Legal</h3>
      <div className="subject-stack" style={{ paddingBottom: "1.5rem" }}>
        <Link href="/privacy-policy" className="app-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card-left">
            <span className="card-code">Privacy</span>
            <span className="card-title">Privacy Policy</span>
            <span className="card-meta-inline">How we handle your data</span>
          </div>
          <i className="bx bx-chevron-right card-chevron"></i>
        </Link>
        <Link href="/terms-and-conditions" className="app-card" style={{ textDecoration: "none", color: "inherit" }}>
          <div className="card-left">
            <span className="card-code">Terms</span>
            <span className="card-title">Terms and Conditions</span>
            <span className="card-meta-inline">App usage terms</span>
          </div>
          <i className="bx bx-chevron-right card-chevron"></i>
        </Link>
      </div>
    </>
  );
}
