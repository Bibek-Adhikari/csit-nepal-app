import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
};

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center gap-4 py-16">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-primary">Not found</p>
      <h1 className="text-4xl font-black tracking-tight text-text">That page does not exist.</h1>
      <Link href="/" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white">
        Go back home
      </Link>
    </div>
  );
}