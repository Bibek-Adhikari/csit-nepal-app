"use client";

import { useEffect, useState } from "react";
import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme = theme === "system" ? resolvedTheme : theme;

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-text shadow-soft transition"
        aria-label="Toggle dark mode"
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setTheme(activeTheme === "dark" ? "light" : "dark")}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border/80 bg-surface/90 text-text shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
      aria-label="Toggle dark mode"
    >
      {activeTheme === "dark" ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
}