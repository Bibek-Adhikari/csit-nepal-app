import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const VALID_PATH_PREFIXES = [
  "/",
  "/subjects",
  "/notes",
  "/quiz",
  "/lectures",
  "/watch",
  "/view-pdf",
  "/bookmark",
  "/profile",
  "/admin",
  "/upload",
  "/questions",
  "/mock-test",
  "/share",
  "/privacy-policy",
  "/terms-and-conditions",
  "/api",
  "/offline",
  "/_next",
  "/icons",
  "/images",
];

function isValidPath(pathname: string): boolean {
  if (pathname === "/") return true;

  for (const prefix of VALID_PATH_PREFIXES) {
    if (pathname.startsWith(prefix)) return true;
  }

  if (pathname.match(/^\/subjects\/[^\/]+$/)) return true;
  if (pathname.match(/^\/subjects\/semester-[12]\/[^\/]+$/)) return true;

  return false;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!isValidPath(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );

  return response;
}
