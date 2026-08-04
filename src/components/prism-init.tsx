"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    Prism?: { highlightAll: () => void };
  }
}

export function PrismInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Prism) {
      window.Prism.highlightAll();
    }
  }, []);

  return null;
}
