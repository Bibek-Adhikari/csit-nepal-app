import { NextRequest, NextResponse } from "next/server";
import {
  createSignedPdfUrl,
  isAllowedBucket,
  isAuthorizedPdfRequest,
  isValidPdfPath,
  SIGNED_URL_EXPIRES_IN,
} from "@/lib/pdf-access";

export const dynamic = "force-dynamic";

/**
 * GET /api/pdf/signed-url?bucket=notes&path=semester-1/.../file.pdf
 *
 * Returns a fresh, 1-hour signed URL for a private storage object. Used by the
 * PDF viewer's "Refresh" action when a previously issued signed URL expires.
 * Authorization is enforced server-side before the URL is returned.
 */
export async function GET(request: NextRequest) {
  const bucket = request.nextUrl.searchParams.get("bucket") || "";
  const path = request.nextUrl.searchParams.get("path") || "";

  if (!isAllowedBucket(bucket) || !isValidPdfPath(path)) {
    return NextResponse.json({ error: "Invalid storage reference" }, { status: 400 });
  }

  if (
    !isAuthorizedPdfRequest({
      host: request.headers.get("host"),
      origin: request.headers.get("origin"),
      referer: request.headers.get("referer"),
    })
  ) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const result = await createSignedPdfUrl(bucket, path, SIGNED_URL_EXPIRES_IN);

  if (!result) {
    return NextResponse.json({ error: "Failed to generate signed URL" }, { status: 500 });
  }

  return NextResponse.json(result);
}