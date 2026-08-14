import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "View PDF",
  description: "View CSIT study material PDFs directly in your browser.",
  alternates: { canonical: "/view-pdf" },
  robots: { index: false },
};

export const dynamic = 'force-dynamic';

export default function ViewPdfLayout({ children }: { children: React.ReactNode }) {
  return children;
}
