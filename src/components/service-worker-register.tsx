"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    const register = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js");
        console.log("SW registered:", reg.scope);

        reg.addEventListener("updatefound", () => {
          const newSW = reg.installing;
          if (!newSW) return;
          newSW.addEventListener("statechange", () => {
            if (newSW.state === "installed" && navigator.serviceWorker.controller) {
              newSW.postMessage({ type: "SKIP_WAITING" });
            }
          });
        });
      } catch (err) {
        console.warn("SW registration failed:", err);
      }
    };

    register();
  }, []);

  return null;
}
