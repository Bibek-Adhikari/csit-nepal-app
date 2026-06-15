export type StorageBucket = "notes" | "lectures";

function getBaseUrl() {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  return base.replace(/\/$/, "");
}

export function getPublicObjectUrl(args: {
  bucket: StorageBucket;
  path: string;
}) {
  const baseUrl = getBaseUrl();
  const { bucket, path } = args;
  const normalizedPath = path.replace(/^\/+/, "");
  return `${baseUrl}/storage/v1/object/public/${bucket}/${normalizedPath}`;
}

export function getNotesPdfUrl(args: {
  semesterKey: string;
  subjectSlug: string;
  unitSlug: string;
  filename: string;
}) {
  return getPublicObjectUrl({
    bucket: "notes",
    path: `${args.semesterKey}/${args.subjectSlug}/${args.unitSlug}/${args.filename}`,
  });
}

export function getLecturesPdfUrl(args: {
  semesterKey: string;
  subjectSlug: string;
  unitSlug: string;
  filename: string;
}) {
  return getPublicObjectUrl({
    bucket: "lectures",
    path: `${args.semesterKey}/${args.subjectSlug}/${args.unitSlug}/${args.filename}`,
  });
}

