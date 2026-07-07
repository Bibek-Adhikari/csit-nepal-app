"use client";

import { useEffect, useState, useCallback, useRef } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showInstall, setShowInstall] = useState(false);
  const [installDismissed, setInstallDismissed] = useState(false);
  const autoHideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    if ("storage" in navigator && "persist" in navigator.storage) {
      navigator.storage.persist().then(() => {});
    }

    let registration: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register("/sw.js")
      .then((reg) => {
        registration = reg;

        if (reg.waiting) {
          setUpdateAvailable(true);
        }

        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          if (newWorker) {
            newWorker.addEventListener("statechange", () => {
              if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                setUpdateAvailable(true);
              }
            });
          }
        });
      })
      .catch(() => {});

    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data?.type === "SYNC_BOOKMARKS") {
        window.dispatchEvent(new Event("sw-sync-bookmarks"));
      }
      if (event.data?.type === "SYNC_PROGRESS") {
        window.dispatchEvent(new Event("sw-sync-progress"));
      }
      if (event.data?.type === "CONTENT_UPDATED") {
        window.dispatchEvent(new Event("sw-content-updated"));
      }
    });

    const handleControllerChange = () => {
      if (updateAvailable) {
        window.location.reload();
      }
    };
    navigator.serviceWorker.addEventListener("controllerchange", handleControllerChange);

    return () => {
      navigator.serviceWorker.removeEventListener("controllerchange", handleControllerChange);
    };
  }, [updateAvailable]);

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const prompt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(prompt);
      try {
        const dismissed = localStorage.getItem("bca-nepal-install-dismissed");
        if (!dismissed) setShowInstall(true);
      } catch {
        setShowInstall(true);
      }
      window.dataLayer?.push({ event: "pwa_beforeinstallprompt" });
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setShowInstall(false);
      window.dataLayer?.push({ event: "pwa_installed" });
    };

    const handleContextMenu = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("img,canvas,.pdf-viewer,.protect")) {
        e.preventDefault();
      }
    };

    const handleCopy = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest(".pdf-viewer,.protect")) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("copy", handleCopy);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("copy", handleCopy);
    };
  }, []);

  useEffect(() => {
    if (updateAvailable && !dismissed) {
      autoHideTimer.current = setTimeout(() => setDismissed(true), 12000);
      return () => {
        if (autoHideTimer.current) clearTimeout(autoHideTimer.current);
      };
    }
  }, [updateAvailable, dismissed]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowInstall(false);
    }
    setDeferredPrompt(null);
  }, [deferredPrompt]);

  const dismissInstall = useCallback(() => {
    setShowInstall(false);
    setInstallDismissed(true);
    try {
      localStorage.setItem("bca-nepal-install-dismissed", "1");
    } catch {}
  }, []);

  return (
    <>
      {updateAvailable && !dismissed && (
        <div className="sw-update-toast" role="alert">
          <span>A new version is available.</span>
          <button onClick={() => window.location.reload()}>Refresh</button>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
            style={{ padding: "0.25rem", borderRadius: 6, border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", fontSize: "0.9rem", cursor: "pointer", lineHeight: 1 }}
          >
            ×
          </button>
        </div>
      )}

      {showInstall && !installDismissed && (
        <div className="install-banner">
          <div className="install-banner-text">
            <strong>Install BCA Nepal</strong>
            <span>Add to home screen for faster access</span>
          </div>
          <button onClick={handleInstall}>Install</button>
          <button className="install-dismiss" onClick={dismissInstall} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
    </>
  );
}

export async function registerPushSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    return null;
  }

  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: process.env.NEXT_PUBLIC_VAPID_KEY,
    });
    return subscription;
  } catch {
    return null;
  }
}

export async function unregisterPush(): Promise<boolean> {
  if (!("serviceWorker" in navigator)) return false;

  try {
    const reg = await navigator.serviceWorker.ready;
    const subscription = await reg.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch {
    return false;
  }
}
