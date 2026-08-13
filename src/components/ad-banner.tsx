"use client";

import { useEffect, useRef } from "react";

const AD_KEY = "0d97ec920d7b023e9af93b5919dda245";
const AD_SRC = `https://www.highperformanceformat.com/${AD_KEY}/invoke.js`;

export function AdBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (document.getElementById("adsterra-invoke")) return;

    const options = document.createElement("script");
    options.id = "adsterra-options";
    options.type = "text/javascript";
    options.innerHTML = `atOptions = { 'key' : '${AD_KEY}', 'format' : 'iframe', 'height' : 50, 'width' : 320, 'params' : {} };`;

    const loader = document.createElement("script");
    loader.id = "adsterra-invoke";
    loader.src = AD_SRC;
    loader.async = true;
    loader.dataset.cfasync = "false";

    const slot = containerRef.current || document.body;
    slot.appendChild(options);
    slot.appendChild(loader);
  }, []);

  return (
    <aside className="ad-banner" aria-label="Sponsored content">
      <span className="ad-banner-label">Ad</span>
      <div ref={containerRef} className="ad-banner-slot" />
    </aside>
  );
}