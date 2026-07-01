"use client";

import { useEffect, useState } from "react";

const WELCOME_KEY = "bca-nepal-welcome-seen";

type Notification = {
  id: string;
  icon: string;
  title: string;
  description: string;
  time: string;
};

const defaultNotifications: Notification[] = [
  {
    id: "new-lectures",
    icon: "bx-video",
    title: "New Lectures Added",
    description: "Check out the latest lecture videos across all semesters.",
    time: "2 days ago",
  },
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
  const [notifications, setNotifications] = useState<Notification[]>(defaultNotifications);

  useEffect(() => {
    const seen = localStorage.getItem(WELCOME_KEY);
    if (!seen) {
      localStorage.setItem(WELCOME_KEY, "true");
      setNotifications((prev) => [
        {
          id: "welcome",
          icon: "bx-wink-smile",
          title: "Welcome to BCA Nepal!",
          description: "We're glad to have you here. Start exploring subjects, lectures, and notes to boost your studies.",
          time: "Just now",
        },
        ...prev,
      ]);
    }
  }, []);

  return (
    <>
      <div
        className={`bottom-sheet-backdrop${open ? " open" : ""}`}
        onClick={onClose}
      />
      <div className={`bottom-sheet${open ? " open" : ""}`}>
        <div className="sheet-handle" />
        <div className="sheet-header">
          <h3 style={{ margin: 0, fontSize: "1.1rem" }}>Notifications</h3>
          <button className="sheet-close" onClick={onClose}>
            <i className="bx bx-x" style={{ fontSize: "1.2rem" }}></i>
          </button>
        </div>
        <div className="sheet-body">
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                display: "flex",
                gap: "0.75rem",
                padding: "0.85rem 0",
                borderBottom: "1px solid var(--border)",
              }}
            >
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
          ))}
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
