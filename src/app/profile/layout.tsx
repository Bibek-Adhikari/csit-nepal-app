import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
  description: "Track your CSIT study progress, manage preferences, and view statistics.",
  alternates: { canonical: "/profile" },
};

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return children;
}
