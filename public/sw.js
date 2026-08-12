const CACHE = "bca-nepal-v15";
const STATIC_CACHE = "bca-nepal-static-v15";
const API_CACHE = "bca-nepal-api-v15";
const PDF_CACHE = "bca-nepal-pdf-v15";
const LECTURE_CACHE = "bca-nepal-lecture-v15";
const RSC_CACHE = "bca-nepal-rsc-v15";
const SHARE_DB_NAME = "bca-nepal-offline";
const SHARE_DB_VERSION = 5;
const PENDING_SHARES_STORE = "pending-shares";

const PRECACHE_URLS = [
  "/",
  "/subjects",
  "/subjects/semester-1",
  "/subjects/semester-1/computer-fundamentals-and-applications",
  "/subjects/semester-1/programming-in-c",
  "/subjects/semester-1/digital-logic",
  "/subjects/semester-1/mathematics-i",
  "/subjects/semester-1/professional-communication-and-ethics",
  "/subjects/semester-1/hardware-workshop",
  "/subjects/semester-2",
  "/subjects/semester-2/discrete-structure",
  "/subjects/semester-2/microprocessor-architecture",
  "/subjects/semester-2/oop-in-java",
  "/subjects/semester-2/mathematics-ii",
  "/subjects/semester-2/ux-ui-design",
  "/subjects/semester-2/principles-of-management",
  "/notes/semester-1/computer-fundamentals-and-applications/lab-reports",
  "/notes/semester-1/programming-in-c/lab-reports",
  "/notes/semester-1/digital-logic/lab-reports",
  "/notes/semester-1/mathematics-i/lab-reports",
  "/notes/semester-1/professional-communication-and-ethics/lab-reports",
  "/notes/semester-1/hardware-workshop/lab-reports",
  "/notes/semester-2/discrete-structure/lab-reports",
  "/notes/semester-2/microprocessor-architecture/lab-reports",
  "/notes/semester-2/oop-in-java/lab-reports",
  "/notes/semester-2/mathematics-ii/lab-reports",
  "/notes/semester-2/ux-ui-design/lab-reports",
  "/notes/semester-2/principles-of-management/lab-reports",
  "/subjects/entrance",
  "/questions",
  "/mock-test",
  "/bookmark",
  "/profile",
  "/lectures",
  "/admin",
  "/privacy-policy",
  "/terms-and-conditions",
  "/view-pdf",
  "/share",
  "/gallery",
  "/offline",
  "/offline.html",
  "/manifest.json",
  "/logo.jpg",
  "/favicon.png",
  "/apple-touch-icon.png",
  "/icons/fabi.jpg",
  "/icons/icon-192x192.png",
  "/icons/icon-512x512.png",
];

const SUPABASE_DOMAIN = "yrahncykruiwkiwtxjlv.supabase.co";
const YT_IMG_DOMAIN = "i.ytimg.com";
const ANALYTICS_DOMAINS = ["www.googletagmanager.com", "www.google-analytics.com"];

const CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const API_CACHE_MAX_AGE = 10 * 60 * 1000;

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Event Listeners Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data?.type === "CACHE_URLS") {
    event.waitUntil(cacheUrls(event.data.urls));
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {})
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => ![CACHE, STATIC_CACHE, API_CACHE, PDF_CACHE, LECTURE_CACHE, RSC_CACHE].includes(k))
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ URL Matchers Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

function isNavigation(req) {
  return req.mode === "navigate";
}

function isApi(url) {
  return url.pathname.startsWith("/api/");
}

function isPdf(url) {
  return url.pathname.endsWith(".pdf") || url.searchParams.has("pdf");
}

function isStatic(url) {
  return /\.(js|css|png|jpg|jpeg|svg|ico|woff2?|webp)$/.test(url.pathname);
}

function isSupabase(url) {
  return url.hostname === SUPABASE_DOMAIN;
}

function isYt(url) {
  return url.hostname === YT_IMG_DOMAIN;
}

function isSameOrigin(url) {
  return url.origin === self.location.origin;
}

function isNextImage(url) {
  return url.pathname === "/_next/image";
}

function isLecturePage(url) {
  return url.pathname.startsWith("/lectures") || url.pathname.startsWith("/watch/");
}

function isAnalytics(url) {
  return ANALYTICS_DOMAINS.includes(url.hostname);
}

function isRsc(url) {
  return url.searchParams.has("_rsc") || url.searchParams.has("__rsc") || url.pathname.endsWith(".rsc");
}

function isViewPdf(url) {
  return url.pathname === "/view-pdf";
}

function isPdfjsWorker(url) {
  return url.hostname === "unpkg.com" && url.pathname.includes("pdfjs-dist");
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Fetch Strategy Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Fetch Handler Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

// Network- / strategy-agnostic fallback.
//  - Navigations gracefully resolve to the standalone offline page
//    (so a thrown strategy never shows a blank browser error and unknown
//    routes never get rewritten to the home page).
//  - Other requests degrade to an empty Response with a 503 so
//    callers that expect a body (e.g. RSC) get a defined rejection,
//    while the page itself still renders the cached shell.
async function offlineFallback(request, url) {
  if (request.mode === "navigate") {
    return navOfflineFallback(url);
  }
  // Already-cached copy wins if we have it
  const pathCached = url ? await caches.match(url.origin + url.pathname) : null;
  if (pathCached) return pathCached;
  const anyCached = await caches.match(request);
  if (anyCached) return anyCached;
  return new Response("", { status: 503, statusText: "Offline" });
}

// Offline fallback for same-origin page navigations (direct load, refresh,
// PWA standalone launch, back/forward, and the full-page navigation Next.js
// falls back to when an RSC fetch fails).
//  1. A previously cached copy of the exact path wins (visited routes in
//     CACHE/LECTURE_CACHE, or the precached app shell in STATIC_CACHE).
//  2. Otherwise serve the standalone offline page (never the home page, and
//     never a redirect, so the failed URL stays in the address bar).
async function navOfflineFallback(url) {
  const path = url ? url.origin + url.pathname : null;
  for (const name of [CACHE, STATIC_CACHE, LECTURE_CACHE]) {
    if (!path) break;
    const cache = await caches.open(name);
    const hit = await cache.match(path);
    if (hit) return hit;
  }
  const offlinePage = await caches.match("/offline.html");
  if (offlinePage) return offlinePage;
  return new Response(
    "<!doctype html><html><head><meta charset=\"utf-8\"><title>Page Not Found</title></head><body style=\"font-family:system-ui,-apple-system,sans-serif;display:grid;place-items:center;min-height:100vh;margin:0;background:#f8fafc;color:#0f172a;text-align:center;padding:1.5rem\"><h1 style=\"font-size:1.25rem\">Page Not Found</h1><p style=\"color:#64748b\">This page isn&apos;t available offline yet. Open it once while online to save it for offline use.</p><p><a href=\"/\" style=\"display:inline-block;margin-top:0.5rem;background:#2563eb;color:#fff;padding:0.7rem 1.5rem;border-radius:999px;text-decoration:none;font-weight:700\">Back to Home</a></p></body></html>",
    { status: 503, headers: { "Content-Type": "text/html" } }
  );
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const req = event.request;

  // Bypass analytics
  if (isAnalytics(url)) return;

  // Web Share Target: intercept POST to /share, store files in IndexedDB, redirect to GET
  if (url.pathname === "/share" && req.method === "POST") {
    event.respondWith(handleShareTarget(req));
    return;
  }

  // Navigation: stale-while-revalidate (instant from cache, update in background)
  if (isNavigation(req)) {
    if (url.pathname === "/offline") {
      event.respondWith(caches.match("/offline.html"));
      return;
    }
    event.respondWith(staleWhileRevalidateNav(req, url).catch(() => offlineFallback(req, url)));
    return;
  }

  // View-pdf page: network-first (always show latest, with offline fallback)
  if (isViewPdf(url)) {
    event.respondWith(networkFirstWithFallback(req, url));
    return;
  }

  // Next.js optimized images: cache-first with original source lookup
  if (isNextImage(url)) {
    event.respondWith(nextImageStrategy(req, url).catch(() => offlineFallback(req, url)));
    return;
  }

  // RSC payloads: stale-while-revalidate with offline fallback
  if (isRsc(url)) {
    if (url.pathname === "/view-pdf") {
      event.respondWith(networkFirstWithFallback(req, url));
    } else {
      event.respondWith(staleWhileRevalidateRsc(req, url).catch(() => offlineFallback(req, url)));
    }
    return;
  }

  // API: network-first with cache fallback
  if (isApi(url)) {
    event.respondWith(networkFirstCache(req, API_CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // PDFs and Supabase storage: cache-first with refresh
  if (isPdf(url) || isSupabase(url)) {
    event.respondWith(cacheFirstWithRefresh(req, PDF_CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // YouTube thumbnails: cache-first
  if (isYt(url)) {
    event.respondWith(cacheFirstWithRefresh(req, STATIC_CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // Lecture pages: network-first with lecture cache
  if (isLecturePage(url)) {
    event.respondWith(networkFirstCache(req, LECTURE_CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // Static assets (JS, CSS, images): cache-first
  if (isStatic(url)) {
    event.respondWith(cacheFirstWithRefresh(req, STATIC_CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // PDF.js worker from CDN: cache-first (needed for offline PDF viewing)
  if (isPdfjsWorker(url)) {
    event.respondWith(cacheFirstWithRefresh(req, STATIC_CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // Same-origin (pages, RSC payloads, etc.): stale-while-revalidate
  if (isSameOrigin(url)) {
    event.respondWith(staleWhileRevalidate(req, CACHE).catch(() => offlineFallback(req, url)));
    return;
  }

  // Cross-origin: network-first with offline fallback
  event.respondWith(networkFirstWithFallback(req, url));
});

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Cache Strategies Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

async function staleWhileRevalidateNav(request, url) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  const cachedPath = url ? await cache.match(url.origin + url.pathname) : null;

  const fetchPromise = fetch(request).then(async (res) => {
    if (res.ok) {
      cache.put(request, res.clone());
      if (url) cache.put(url.origin + url.pathname, res.clone());
    }
    return res;
  }).catch(() => null);

  if (cached) {
    fetchPromise.catch(() => {});
    return cached;
  }

  if (cachedPath) {
    fetchPromise.catch(() => {});
    return cachedPath;
  }

  const fresh = await fetchPromise;
  if (fresh) return fresh;

  return navOfflineFallback(url);
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(async (res) => {
    if (res.ok) {
      cache.put(request, res.clone());
    }
    return res;
  }).catch(() => null);

  if (cached) {
    fetchPromise.catch(() => {});
    return cached;
  }

  const url = new URL(request.url);
  const pathCached = await cache.match(url.origin + url.pathname);
  if (pathCached) return pathCached;

  const fresh = await fetchPromise;
  if (fresh) return fresh;

  // Offline with nothing cached: navigate -> offline page, else a defined 503.
  if (request.mode === "navigate") {
    return caches.match("/offline.html");
  }
  return new Response("", { status: 503 });
}

async function staleWhileRevalidateRsc(request, url) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);

  const fetchPromise = fetch(request).then(async (res) => {
    if (res.ok) {
      cache.put(request, res.clone());
      // Only full navigation payloads are path-cached (prefetches are partial
      // flight trees and would be unsafe to replay as a navigation).
      if (url && !request.headers.get("next-router-prefetch")) {
        const rscCache = await caches.open(RSC_CACHE);
        rscCache.put(url.origin + url.pathname, res.clone());
      }
    }
    return res;
  }).catch(() => null);

  if (cached) {
    fetchPromise.catch(() => {});
    return cached;
  }

  const fresh = await fetchPromise;
  if (fresh) return fresh;

  // Offline with nothing cached for this exact request: prefer a cached
  // flight payload for the path (smooth SPA navigation), then the cached
  // HTML document (triggers a full-page load of the same cached shell).
  // If neither exists the offline page is a non-flight response, so the
  // Next.js router performs a full-page navigation that the service worker
  // resolves with the offline page again (never a redirect, no loop).
  if (url) {
    const rscCache = await caches.open(RSC_CACHE);
    const rscPathCached = await rscCache.match(url.origin + url.pathname);
    if (rscPathCached) return rscPathCached;
    const pathCached = await cache.match(url.origin + url.pathname);
    if (pathCached) return pathCached;
  }

  return navOfflineFallback(url);
}

async function nextImageStrategy(request, url) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const originalPath = resolveNextImageUrl(url);
  if (originalPath) {
    const originalCached = await caches.match(originalPath);
    if (originalCached) return originalCached;
  }

  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return new Response("", { status: 503 });
  }
}

function resolveNextImageUrl(url) {
  try {
    return url.searchParams.get("url");
  } catch {
    return null;
  }
}

async function networkFirstWithFallback(request, url) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(CACHE);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (url) {
      const pathReq = new Request(url.origin + url.pathname);
      const pathCached = await caches.match(pathReq);
      if (pathCached) return pathCached;
    }
    return navOfflineFallback(url);
  }
}

async function networkFirstCache(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === "navigate") {
      return navOfflineFallback(new URL(request.url));
    }
    return new Response(JSON.stringify({ error: "Offline", offline: true }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function cacheFirstWithRefresh(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    const isStale = await isCacheStale(cached, cacheName);
    if (isStale) fetchAndUpdateCache(request, cacheName);
    return cached;
  }
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res.clone());
    }
    return res;
  } catch {
    return new Response("", { status: 503 });
  }
}

async function isCacheStale(cachedResponse, cacheName) {
  const dateHeader = cachedResponse.headers.get("date");
  if (!dateHeader) return true;
  const cachedTime = new Date(dateHeader).getTime();
  const maxAge = cacheName === API_CACHE || cacheName === LECTURE_CACHE ? API_CACHE_MAX_AGE : CACHE_MAX_AGE;
  return Date.now() - cachedTime > maxAge;
}

async function fetchAndUpdateCache(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res);
    }
  } catch {}
}

async function cacheUrls(urls) {
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(urls);
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Web Share Target Handler Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

async function handleShareTarget(request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("images").filter((f) => f instanceof File && f.type.startsWith("image/"));

    if (files.length > 0) {
      await storePendingShares(files);
    }

    return Response.redirect(new URL("/share?shared=1", self.location.origin).toString(), 303);
  } catch {
    return Response.redirect(new URL("/share?shared=0", self.location.origin).toString(), 303);
  }
}

function storePendingShares(files) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(SHARE_DB_NAME, SHARE_DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PENDING_SHARES_STORE)) {
        db.createObjectStore(PENDING_SHARES_STORE, { keyPath: "id" });
      }
    };
    req.onsuccess = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(PENDING_SHARES_STORE)) {
        db.close();
        resolve();
        return;
      }
      const tx = db.transaction(PENDING_SHARES_STORE, "readwrite");
      const store = tx.objectStore(PENDING_SHARES_STORE);
      store.clear();
      for (let i = 0; i < files.length; i++) {
        store.put({
          id: `pending-${Date.now()}-${i}`,
          name: files[i].name || `image-${i + 1}.jpg`,
          blob: files[i],
          type: files[i].type,
          size: files[i].size,
          sharedAt: Date.now(),
        });
      }
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => {
        db.close();
        reject(tx.error);
      };
    };
    req.onerror = () => reject(req.error);
  });
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Background Sync Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

self.addEventListener("sync", (event) => {
  if (event.tag === "sync-bookmarks") {
    event.waitUntil(syncBookmarks());
  }
  if (event.tag === "sync-progress") {
    event.waitUntil(syncProgress());
  }
});

async function syncBookmarks() {
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) => {
    client.postMessage({ type: "SYNC_BOOKMARKS" });
  });
}

async function syncProgress() {
  const clients = await self.clients.matchAll({ type: "window" });
  clients.forEach((client) => {
    client.postMessage({ type: "SYNC_PROGRESS" });
  });
}

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Push Notifications Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

self.addEventListener("push", (event) => {
  if (!event.data) return;

  const data = event.data.json();
  const options = {
    body: data.body || "New content available",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: {
      url: data.url || "/",
    },
    actions: [
      { action: "open", title: "Open" },
      { action: "close", title: "Dismiss" },
    ],
  };

  event.waitUntil(self.registration.showNotification(data.title || "BCA Nepal", options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  if (event.action === "close") return;

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clients) => {
      const targetUrl = event.notification.data?.url || "/";
      for (const client of clients) {
        if (client.url.includes(targetUrl) && "focus" in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});

// Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬ Periodic Sync Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "check-updates") {
    event.waitUntil(checkForUpdates());
  }
});

async function checkForUpdates() {
  try {
    const res = await fetch("/api/notes", { method: "HEAD" });
    if (res.ok) {
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => {
        client.postMessage({ type: "CONTENT_UPDATED" });
      });
    }
  } catch {}
}
