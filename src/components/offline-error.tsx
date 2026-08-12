"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function OfflineErrorPage() {
  const pathname = usePathname();
  const [failedUrl, setFailedUrl] = useState(pathname);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    const sync = () => {
      setOffline(!navigator.onLine);
      setFailedUrl(window.location.pathname + window.location.search);
    };
    sync();
    window.addEventListener("online", sync);
    window.addEventListener("offline", sync);
    return () => {
      window.removeEventListener("online", sync);
      window.removeEventListener("offline", sync);
    };
  }, []);

  return (
    <section className="welcome-hero offline-error">
      <div className="offline-error-icon">
        <i className={offline ? "bx bx-wifi-off" : "bx bx-error-circle"}></i>
      </div>
      <h2>{offline ? "You're Offline" : "Page Not Found"}</h2>
      <p className="offline-error-url" title={failedUrl}>{failedUrl}</p>
      <p className="offline-error-message">
        {offline ? (
          <>
            This page isn&apos;t saved for offline use yet. Open it once while you&apos;re
            connected to the internet and it will be available offline.
          </>
        ) : (
          <>
            The page you&apos;re looking for doesn&apos;t exist or has been moved. If it&apos;s a
            real page, open it once while online and it will be saved for offline use.
          </>
        )}
      </p>
      <div className="offline-error-actions">
        <Link href="/" className="upload-btn">
          <i className="bx bx-home"></i>
          Back to Home
        </Link>
        {offline && (
          <button
            type="button"
            className="upload-btn upload-btn-secondary"
            onClick={() => window.location.reload()}
          >
            <i className="bx bx-refresh"></i>
            Try Again
          </button>
        )}
      </div>
    </section>
  );
}
