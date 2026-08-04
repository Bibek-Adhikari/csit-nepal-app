"use client";

import { useEffect } from "react";

export function PrismInit() {
  useEffect(() => {
    if (typeof window !== "undefined" && window.Prism) {
      window.Prism.highlightAll();
    }
  }, []);

  return null;
}
