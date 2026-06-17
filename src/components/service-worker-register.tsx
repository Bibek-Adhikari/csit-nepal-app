"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
          reg.addEventListener("updatefound", () => {
            const newWorker = reg.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  newWorker.postMessage({ type: "SKIP_WAITING" });
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
    }
  }, []);

  return null;
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
