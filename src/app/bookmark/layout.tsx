import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookmarks",
  description: "Your bookmarked CSIT PDFs organized by subject. Saved for offline access.",
  alternates: { canonical: "/bookmark" },
};

export default function BookmarkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
