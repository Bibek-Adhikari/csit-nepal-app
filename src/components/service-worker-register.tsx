"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

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

    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

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
      window.dataLayer?.push({ event: "pwa_beforeinstallprompt" });
    };

    const handleAppInstalled = () => {
      window.dataLayer?.push({ event: "pwa_installed" });
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  if (!updateAvailable) return null;

  return (
    <div className="sw-update-toast" role="alert">
      <span>A new version is available.</span>
      <button onClick={() => window.location.reload()}>Refresh</button>
    </div>
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
