"use client";

import { useState, useEffect, useCallback, useRef } from "react";

const DISMISSED_KEY = "bca-nepal-offline-dismissed";

export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [dismissed, setDismissed] = useState(false);
  const [showOnline, setShowOnline] = useState(false);
  const [swiping, setSwiping] = useState(false);
  const [offsetX, setOffsetX] = useState(0);
  const startX = useRef(0);
  const onlineTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);

    try {
      const val = sessionStorage.getItem(DISMISSED_KEY);
      if (val === "true") setDismissed(true);
    } catch {}

    const handleOnline = () => {
      setIsOnline(true);
      setDismissed(false);
      setShowOnline(true);
      clearTimeout(onlineTimer.current);
      onlineTimer.current = setTimeout(() => setShowOnline(false), 3000);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setShowOnline(false);
      clearTimeout(onlineTimer.current);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      clearTimeout(onlineTimer.current);
    };
  }, []);

  const dismiss = useCallback(() => {
    setDismissed(true);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "true");
    } catch {}
  }, []);

  const closeOnline = useCallback(() => {
    setShowOnline(false);
    clearTimeout(onlineTimer.current);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX;
    setSwiping(true);
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - startX.current;
    if (dx > 0) setOffsetX(dx);
  }, []);

  const handleTouchEnd = useCallback(() => {
    setSwiping(false);
    if (offsetX > 80) {
      dismiss();
    }
    setOffsetX(0);
  }, [offsetX, dismiss]);

  if (!isOnline && !dismissed) {
    return (
      <div
        className="toast toast--offline"
        role="alert"
        aria-live="polite"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: swiping ? `translateX(${offsetX}px)` : "",
          opacity: swiping ? Math.max(0, 1 - offsetX / 200) : 1,
          transition: swiping ? "none" : "transform 0.3s ease, opacity 0.3s ease",
        }}
      >
        <i className="bx bx-wifi-off"></i>
        <span>You&apos;re offline. Some features may be limited.</span>
        <button onClick={dismiss} className="toast-close" aria-label="Dismiss">
          <i className="bx bx-x"></i>
        </button>
      </div>
    );
  }

  if (showOnline) {
    return (
      <div className="toast toast--online">
        <i className="bx bx-wifi"></i>
        <span>Back online!</span>
        <button onClick={closeOnline} className="toast-close" aria-label="Dismiss">
          <i className="bx bx-x"></i>
        </button>
      </div>
    );
  }

  return null;
}