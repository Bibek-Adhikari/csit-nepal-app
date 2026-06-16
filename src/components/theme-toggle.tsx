"use client";


import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { MoonStar, SunMedium } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handle = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(handle);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "999px",
          border: "1px solid var(--border)",
          background: "var(--surface)",
        }}
      />
    );
  }

  const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-text shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
      aria-label="Toggle dark mode"
    >
      {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}
