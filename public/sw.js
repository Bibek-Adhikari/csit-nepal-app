const CACHE = "bca-nepal-v3";
const STATIC_CACHE = "bca-nepal-static-v3";
const API_CACHE = "bca-nepal-api-v3";
const PDF_CACHE = "bca-nepal-pdf-v3";
const LECTURE_CACHE = "bca-nepal-lecture-v3";

const PRECACHE_URLS = [
  "/",
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

const CACHE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days
const API_CACHE_MAX_AGE = 10 * 60 * 1000; // 10 minutes

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
  if (event.data?.type === "CACHE_URLS") {
    event.waitUntil(cacheUrls(event.data.urls));
  }
});

async function cacheUrls(urls) {
  const cache = await caches.open(STATIC_CACHE);
  await cache.addAll(urls);
}

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
          .filter((k) => ![CACHE, STATIC_CACHE, API_CACHE, PDF_CACHE, LECTURE_CACHE].includes(k))
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

function isNextImage(url) {
  return url.pathname === "/_next/image";
}

function isLecturePage(url) {
  return url.pathname.startsWith("/lectures") || url.pathname.startsWith("/watch/");
}

function resolveNextImageUrl(url) {
  try {
    return url.searchParams.get("url");
  } catch {
    return null;
  }
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const req = event.request;

  // Navigation: network-first, fallback to cache, then offline page
  if (isNavigation(req) && url.pathname !== "/offline") {
    event.respondWith(networkFirstWithFallback(req, "/offline.html"));
    return;
  }

  // Next.js optimized images: try cache with original source URL, then network
  if (isNextImage(url)) {
    event.respondWith(nextImageStrategy(req, url));
    return;
  }

  // API: network-first with cache fallback
  if (isApi(url)) {
    event.respondWith(networkFirstCache(req, API_CACHE));
    return;
  }

  // PDFs and Supabase storage: cache-first with refresh
  if (isPdf(url) || isSupabase(url)) {
    event.respondWith(cacheFirstWithRefresh(req, PDF_CACHE));
    return;
  }

  // YouTube thumbnails: cache-first
  if (isYt(url)) {
    event.respondWith(cacheFirstWithRefresh(req, STATIC_CACHE));
    return;
  }

  // Lecture pages: network-first with lecture cache
  if (isLecturePage(url)) {
    event.respondWith(networkFirstCache(req, LECTURE_CACHE));
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
    return cached || new Response(JSON.stringify({ error: "Offline", offline: true }), {
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