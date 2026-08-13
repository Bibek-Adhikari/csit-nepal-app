import { headers } from "next/headers";
import { PdfErrorBoundary } from "@/components/pdf-error-boundary";
import {
  createSignedPdfUrl,
  isAuthorizedPdfRequest,
  parseStorageReference,
  SIGNED_URL_EXPIRES_IN,
} from "@/lib/pdf-access";
import { BackNavButton } from "./back-nav-button";
import { PdfViewerLazy } from "./pdf-viewer-loader";

export const dynamic = "force-dynamic";

type ViewPdfSearchParams = {
  [key: string]: string | string[] | undefined;
};

export default async function ViewPdfPage({ searchParams }: { searchParams: Promise<ViewPdfSearchParams> }) {
  const sp = await searchParams;

  const url = typeof sp.url === "string" ? sp.url : "";
  const title = typeof sp.title === "string" ? sp.title : "Untitled";
  const semester = typeof sp.semester === "string" ? sp.semester : "";
  const subject = typeof sp.subject === "string" ? sp.subject : "";
  const unit = typeof sp.unit === "string" ? sp.unit : "";
  const returnTo = typeof sp.returnTo === "string" ? sp.returnTo : "";

  if (!url) {
    return (
      <div className="empty-state">
        <p>No PDF URL provided.</p>
      </div>
    );
  }

  // Resolve the storage reference (bucket + path) from the incoming URL so the
  // signed URL is generated dynamically on every request and never stored.
  const ref = parseStorageReference(url);
  let signedUrl: string | null = null;
  let authError = false;
  let signError = false;

  if (ref) {
    const headerList = await headers();
    if (
      !isAuthorizedPdfRequest({
        host: headerList.get("host"),
        origin: headerList.get("origin"),
        referer: headerList.get("referer"),
      })
    ) {
      authError = true;
    } else {
      const result = await createSignedPdfUrl(ref.bucket, ref.path, SIGNED_URL_EXPIRES_IN);
      if (result) {
        signedUrl = result.signedUrl;
      } else {
        signError = true;
      }
    }
  }

  if (authError) {
    return (
      <PdfErrorBoundary>
        <div className="empty-state">
          <p>You are not authorized to view this PDF.</p>
        </div>
      </PdfErrorBoundary>
    );
  }

  if (signError) {
    return (
      <PdfErrorBoundary>
        <div className="empty-state">
          <p>Could not generate a secure link to this PDF. Please try again later.</p>
        </div>
      </PdfErrorBoundary>
    );
  }

  return (
    <PdfErrorBoundary>
      <nav className="back-nav">
        <BackNavButton returnTo={returnTo} title={title} />
      </nav>
      <PdfViewerLazy
        url={url}
        signedUrl={signedUrl}
        bucket={ref ? ref.bucket : ""}
        path={ref ? ref.path : ""}
        title={title}
        semester={semester}
        subject={subject}
        unit={unit}
        returnTo={returnTo}
      />
    </PdfErrorBoundary>
  );
}