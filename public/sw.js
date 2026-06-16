const CACHE = "bca-nepal-v2";
const STATIC_CACHE = "bca-nepal-static-v2";
const API_CACHE = "bca-nepal-api-v2";
const PDF_CACHE = "bca-nepal-pdf-v2";

const PRECACHE_URLS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/logo.jpg",
  "/favicon.png",
  "/apple-touch-icon.png",
];

const SUPABASE_DOMAIN = "yrahncykruiwkiwtxjlv.supabase.co";
const YT_IMG_DOMAIN = "i.ytimg.com";

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
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
          .filter((k) => k !== CACHE && k !== STATIC_CACHE && k !== API_CACHE && k !== PDF_CACHE)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

function isNavigation(req) {
  return req.mode === "navigate";
}

function isApi(url) {
  return url.pathname.startsWith("/api/");
}

function isPdf(url) {
  return url.pathname.endsWith(".pdf");
}

function isStatic(url) {
  return /\.(js|css|png|jpg|jpeg|svg|ico|woff2?)$/.test(url.pathname);
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

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const req = event.request;

  // Navigation: network-first, fallback to cache, then offline page
  if (isNavigation(req)) {
    event.respondWith(networkFirstWithFallback(req, "/offline.html"));
    return;
  }

  // API: network-first with cache fallback
  if (isApi(url)) {
    event.respondWith(networkFirstCache(req, API_CACHE));
    return;
  }

  // PDFs and Supabase storage: cache-first
  if (isPdf(url) || isSupabase(url)) {
    event.respondWith(cacheFirstWithRefresh(req, PDF_CACHE));
    return;
  }

  // YouTube thumbnails: cache-first
  if (isYt(url)) {
    event.respondWith(cacheFirstWithRefresh(req, STATIC_CACHE));
    return;
  }

  // Static assets (JS, CSS, images): cache-first
  if (isStatic(url)) {
    event.respondWith(cacheFirstWithRefresh(req, STATIC_CACHE));
    return;
  }

  // Same-origin requests (RSC payloads, pages, etc.): cache-first
  if (isSameOrigin(url)) {
    event.respondWith(cacheFirstWithRefresh(req, CACHE));
    return;
  }

  // Cross-origin: network-first with offline fallback
  event.respondWith(networkFirstWithFallback(req, "/offline.html"));
});

async function networkFirstWithFallback(request, fallbackUrl) {
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
    const fallback = await caches.match(fallbackUrl);
    return fallback || new Response("Offline", { status: 503 });
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
    return cached || new Response(JSON.stringify({ error: "Offline" }), {
      status: 503,
      headers: { "Content-Type": "application/json" },
    });
  }
}

async function cacheFirstWithRefresh(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) {
    fetchAndUpdateCache(request, cacheName);
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

async function fetchAndUpdateCache(request, cacheName) {
  try {
    const res = await fetch(request);
    if (res.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, res);
    }
  } catch {}
}
