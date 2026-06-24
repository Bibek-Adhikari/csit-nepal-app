import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload",
  description: "Upload BCA study materials to the platform.",
  alternates: { canonical: "/upload" },
  robots: { index: false },
};

export default function UploadLayout({ children }: { children: React.ReactNode }) {
  return children;
}
