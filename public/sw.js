const CACHE_NAME = "bca-nepal-v1";
const STATIC_CACHE = "bca-nepal-static-v1";
const API_CACHE = "bca-nepal-api-v1";
const PDF_CACHE = "bca-nepal-pdf-v1";

const STATIC_ASSETS = [
  "/",
  "/offline.html",
  "/manifest.json",
  "/logo.jpg",
  "/favicon.png",
  "/apple-touch-icon.png",
];

const SUPABASE_DOMAIN = "yrahncykruiwkiwtxjlv.supabase.co";
const YT_IMG_DOMAIN = "i.ytimg.com";

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("Precache failed for some assets:", err);
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME && key !== STATIC_CACHE && key !== API_CACHE && key !== PDF_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

function isNavigationRequest(request) {
  return request.mode === "navigate";
}

function isApiRequest(url) {
  return url.pathname.startsWith("/api/");
}

function isPdfRequest(url) {
  return url.pathname.endsWith(".pdf");
}

function isStaticAsset(url) {
  const extensions = [".js", ".css", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".woff", ".woff2"];
  return extensions.some((ext) => url.pathname.endsWith(ext));
}

function isSupabaseRequest(url) {
  return url.hostname === SUPABASE_DOMAIN;
}

function isYtThumbnail(url) {
  return url.hostname === YT_IMG_DOMAIN;
}

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  const request = event.request;

  if (isNavigationRequest(request)) {
    event.respondWith(networkFirstWithFallback(request, "/offline.html"));
    return;
  }

  if (isApiRequest(url)) {
    event.respondWith(networkFirstCache(request, API_CACHE));
    return;
  }

  if (isPdfRequest(url) || isSupabaseRequest(url)) {
    event.respondWith(cacheFirstWithRefresh(request, PDF_CACHE));
    return;
  }

  if (isStaticAsset(url) || isYtThumbnail(url)) {
    event.respondWith(cacheFirstWithRefresh(request, STATIC_CACHE));
    return;
  }

  event.respondWith(networkFirstWithFallback(request, "/offline.html"));
});

async function networkFirstWithFallback(request, fallbackUrl) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;
    const fallback = await caches.match(fallbackUrl);
    if (fallback) return fallback;
    return new Response("Offline", { status: 503 });
  }
}

async function networkFirstCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
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
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (err) {
    return new Response("", { status: 503 });
  }
}

async function fetchAndUpdateCache(request, cacheName) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
  } catch (err) {
    // silently fail
  }
}
