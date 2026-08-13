import { getSupabaseServer } from "./supabase";

/** Buckets that may be served through the signed-URL PDF viewer. */
export const PDF_STORAGE_BUCKETS = ["notes", "lectures", "entrance"] as const;
export type PdfStorageBucket = (typeof PDF_STORAGE_BUCKETS)[number];

/** Signed URLs expire after 1 hour (3600 seconds). */
export const SIGNED_URL_EXPIRES_IN = 3600;

export type StorageReference = {
  bucket: string;
  path: string;
};

/**
 * Parse a Supabase Storage object URL (public, signed or legacy format) into
 * `{ bucket, path }`. Returns `null` for anything that is not a storage URL
 * from one of the allowed buckets.
 */
export function parseStorageReference(url: string): StorageReference | null {
  try {
    const parsed = new URL(url);
    const segments = parsed.pathname.split("/").filter(Boolean);
    // /storage/v1/object/public/{bucket}/{path...}
    // /storage/v1/object/sign/{bucket}/{path...}
    // /storage/v1/object/{bucket}/{path...} (legacy)
    if (segments[0] !== "storage" || segments[1] !== "v1" || segments[2] !== "object") {
      return null;
    }

    let bucketIndex = 3;
    if (segments[bucketIndex] === "public" || segments[bucketIndex] === "sign") {
      bucketIndex += 1;
    }

    const bucket = segments[bucketIndex];
    const path = segments
      .slice(bucketIndex + 1)
      .map((segment) => {
        try {
          return decodeURIComponent(segment);
        } catch {
          return segment;
        }
      })
      .join("/");

    if (!bucket || !path || !isAllowedBucket(bucket)) return null;
    return { bucket, path };
  } catch {
    return null;
  }
}

export function isAllowedBucket(bucket: string): bucket is PdfStorageBucket {
  return (PDF_STORAGE_BUCKETS as readonly string[]).includes(bucket);
}

export function isValidPdfPath(path: string): boolean {
  if (!path || path.length > 500) return false;
  if (path.includes("..")) return false;
  if (path.startsWith("/") || path.endsWith("/")) return false;
  if (!path.toLowerCase().endsWith(".pdf")) return false;
  return true;
}

/**
 * Same-origin guard for signed-URL requests.
 *
 * Rejects requests whose `Origin`/`Referer` header points at a different host
 * (e.g. another site hotlinking the signed-URL API). Requests without those
 * headers (direct navigation, deep links) are allowed.
 *
 * The app currently has no user accounts. Once Supabase Auth is enabled,
 * extend this with a real session check, e.g.:
 *   const supabase = await createServerClient(url, anonKey, { cookies });
 *   const { data: { user } } = await supabase.auth.getUser();
 *   if (!user) return false;
 */
export function isAuthorizedPdfRequest(args: {
  host?: string | null;
  origin?: string | null;
  referer?: string | null;
}): boolean {
  const { host, origin, referer } = args;

  for (const value of [origin, referer]) {
    if (!value) continue;
    let valueHost = "";
    try {
      valueHost = new URL(value).host;
    } catch {
      return false;
    }
    if (!valueHost || valueHost === "null") continue;
    if (host && valueHost !== host) return false;
  }

  return true;
}

export type SignedUrlResult = {
  signedUrl: string;
  expiresAt: string;
};

/**
 * Generate a temporary signed URL for a private storage object.
 * Requires storage RLS to allow the requesting role to SELECT the object
 * (see supabase/migrations/00004_private_storage_buckets.sql).
 */
export async function createSignedPdfUrl(
  bucket: string,
  path: string,
  expiresIn: number = SIGNED_URL_EXPIRES_IN
): Promise<SignedUrlResult | null> {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error || !data) {
    console.error("Failed to create signed PDF URL:", error);
    return null;
  }

  return {
    signedUrl: data.signedUrl,
    expiresAt: new Date(Date.now() + expiresIn * 1000).toISOString(),
  };
}