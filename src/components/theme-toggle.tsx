"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        style={{
          width: "2.75rem",
          height: "2.75rem",
          borderRadius: "999px",
          border: "1px solid var(--border)",
        }}
      />
    );
  }

  const isDark = theme === "dark" || (theme === "system" && resolvedTheme === "dark");

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="theme-toggle-btn"
      aria-label="Toggle dark mode"
    >
      {isDark ? (
        <i className="bx bx-sun"></i>
      ) : (
        <i className="bx bx-moon"></i>
      )}
    </button>
  );
}