"use client";

import { useRouter } from "next/navigation";

export function BackNavButton({ returnTo, title }: { returnTo?: string; title: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => {
        if (returnTo) {
          router.replace(returnTo);
        } else {
          router.back();
        }
      }}
      className="back-nav-link"
      style={{ background: "none", border: "none", cursor: "pointer" }}
    >
      <i className="bx bx-chevron-left"></i>
      <span>{title}</span>
    </button>
  );
}