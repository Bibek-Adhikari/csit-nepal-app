"use client";

import { useEffect, useRef } from "react";

const AD_SRC =
  "https://pl30793782.effectivecpmnetwork.com/68d67d2b1a9e71d87963a7e279546fcd/invoke.js";
const AD_CONTAINER_ID = "container-68d67d2b1a9e71d87963a7e279546fcd";

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("effectivecpm-invoke")) return;

    const script = document.createElement("script");
    script.id = "effectivecpm-invoke";
    script.src = AD_SRC;
    script.async = true;
    script.dataset.cfasync = "false";
    document.body.appendChild(script);
  }, []);

  return (
    <aside className="ad-banner" aria-label="Sponsored content">
      <span className="ad-banner-label">Ad</span>
      <div id={AD_CONTAINER_ID} ref={containerRef} className="ad-banner-slot" />
    </aside>
  );
}
