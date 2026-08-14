"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const WELCOME_KEY = "bca-nepal-welcome-seen";

type Notification = {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
  url?: string;
  thumbnail?: string;
};

const defaultNotifications: Notification[] = [
  {
    id: "notes-update",
    icon: "bx-notepad",
    title: "Notes Updated",
    description: "New notes and study materials have been uploaded.",
    time: "1 week ago",
  },
];

type NotificationPanelProps = {
  open: boolean;
  onClose: () => void;
};

export function NotificationPanel({ open, onClose }: NotificationPanelProps) {
  const router = useRouter();
  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  useEffect(() => {
    if (!open) return;

    const scrollY = window.scrollY;
    const html = document.documentElement;
    const body = document.body;
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const preventTouch = (e: TouchEvent) => {
      if (bodyRef.current && !bodyRef.current.contains(e.target as Node)) {
        e.preventDefault();
      }
    };
    document.addEventListener("touchmove", preventTouch, { passive: false });

    return () => {
      html.style.overflow = "";
      body.style.overflow = "";
      document.removeEventListener("touchmove", preventTouch);
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const sheet = sheetRef.current;
    const body = bodyRef.current;
    if (!sheet || !body) return;
    const ro = new ResizeObserver(() => {
      const handle = sheet.querySelector(".sheet-handle") as HTMLElement;
      const header = sheet.querySelector(".sheet-header") as HTMLElement;
      const taken = (handle?.offsetHeight ?? 0) + (header?.offsetHeight ?? 0);
      body.style.maxHeight = `${sheet.offsetHeight - taken}px`;
    });
    ro.observe(sheet);
    return () => ro.disconnect();
  }, [open]);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_KEY);
    if (!seen) {
      localStorage.setItem(WELCOME_KEY, "true");
      setNotifications((prev) => [
        {
          id: "welcome",
          icon: "bx-wink-smile",
          title: "Welcome to CSIT Nepal!",
          description: "We're glad to have you here. Start exploring subjects, lectures, and notes to boost your studies.",
          time: "Just now",
        },
        ...prev,
      ]);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    fetch("/api/lectures")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        if (data?.videos?.length) {
          const v = data.videos[0];
          setNotifications((prev) => {
            if (prev.some((n) => n.id === "latest-video")) return prev;
            return [
              {
                id: "latest-video",
                icon: "bxl-youtube",
                title: v.title,
                description: v.subject ? `${v.subject} · ${v.semester ?? ""}` : "New lecture video uploaded",
                time: v.meta ?? "New",
                url: `/watch/${v.id}`,
                thumbnail: v.thumbnail,
              },
              ...prev,
            ];
          });
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [open]);

  return (
    <>
      <div
        className={`bottom-sheet-backdrop${open ? " open" : ""}`}
        onClick={onClose}
      />
      <div className={`bottom-sheet${open ? " open" : ""}`} ref={sheetRef}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Notifications</h3>
          <button className="sheet-close" onClick={onClose}>
            <i className="bx bx-x" style={{ fontSize: "1.2rem" }}></i>
          </button>
        </div>
        <div className="sheet-body" ref={bodyRef}>
          {notifications.map((n) => {
            const content = (
              <div
                style={{
                  display: "flex",
                  gap: "0.75rem",
                  padding: "0.85rem 0",
                  borderBottom: "1px solid var(--border)",
                  cursor: n.url ? "pointer" : undefined,
                }}
              >
                {n.thumbnail ? (
                  <div
                    style={{
                      width: 60,
                      height: 40,
                      borderRadius: 8,
                      flexShrink: 0,
                      overflow: "hidden",
                      background: "var(--primary-light)",
                      position: "relative",
                    }}
                  >
                    <img
                      src={n.thumbnail}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      loading="lazy"
                    />
                    <i
                      className="bx bx-play"
                      style={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        color: "#fff",
                        fontSize: "1.2rem",
                        textShadow: "0 1px 4px rgba(0,0,0,0.6)",
                      }}
                    ></i>
                  </div>
                ) : (
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "var(--primary-light)",
                      display: "grid",
                      placeItems: "center",
                      flexShrink: 0,
                      color: "var(--primary)",
                      fontSize: "1.25rem",
                    }}
                  >
                    <i className={`bx ${n.icon}`}></i>
                  </div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.9rem" }}>{n.title}</div>
                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: "var(--text-muted)",
                      marginTop: "0.15rem",
                      lineHeight: 1.4,
                    }}
                  >
                    {n.description}
                  </div>
                  <div
                    style={{
                      fontSize: "0.72rem",
                      color: "var(--text-muted)",
                      marginTop: "0.3rem",
                    }}
                  >
                    {n.time}
                  </div>
                </div>
              </div>
            );

            if (n.url) {
              return (
                <div key={n.id} onClick={() => { onClose(); router.push(n.url!); }}>
                  {content}
                </div>
              );
            }
            return <div key={n.id}>{content}</div>;
          })}
          {notifications.length === 0 && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "2rem 0" }}>
              No notifications yet
            </p>
          )}
        </div>
      </div>
    </>
  );
}
