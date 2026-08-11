"use client";

const AD_HTML = `<script async="async" data-cfasync="false" src="https://pl30793782.effectivecpmnetwork.com/68d67d2b1a9e71d87963a7e279546fcd/invoke.js"></script><div id="container-68d67d2b1a9e71d87963a7e279546fcd"></div>`;

export function AdBanner() {
  return (
    <aside className="ad-banner" aria-label="Sponsored content">
      <span className="ad-banner-label">Ad</span>
      <div
        className="ad-banner-slot"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: AD_HTML }}
      />
    </aside>
  );
}
