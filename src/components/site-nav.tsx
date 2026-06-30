"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: "bx-home-alt" },
  { href: "/subjects", label: "Subjects", icon: "bx-layer" },
  { href: "/lectures", label: "Lectures", icon: "bx-video" },
  { href: "/bookmark", label: "Bookmarks", icon: "bx-bookmark" },
  { href: "/profile", label: "Profile", icon: "bx-user" },
];

const SAVED_PATH_KEY = "bca-nepal-last-subjects-path";
const DEFAULT_SEMESTER_KEY = "bca-nepal-default-semester";

function isSubjectsRoute(path: string) {
  return path.startsWith("/subjects") || path.startsWith("/notes") || path.startsWith("/view-pdf");
}

function getLevel(path: string): number {
  if (path.startsWith("/view-pdf") || path.startsWith("/notes")) return 3;
  if (path.startsWith("/subjects/")) {
    const segs = path.split("/").filter(Boolean);
    if (segs.length >= 3) return 2;
    return 1;
  }
  return 0;
}

export function SiteNav() {
  const pathname = usePathname();
  const router = useRouter();
  const savedPathRef = useRef<string | null>(null);
  const defaultSemesterRef = useRef<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_PATH_KEY);
      if (saved) savedPathRef.current = saved;
    } catch {}
    try {
      const saved = localStorage.getItem(DEFAULT_SEMESTER_KEY);
      if (saved) defaultSemesterRef.current = saved;
    } catch {}
    const handler = () => {
      try {
        const saved = localStorage.getItem(DEFAULT_SEMESTER_KEY);
        defaultSemesterRef.current = saved;
      } catch {}
    };
    window.addEventListener("default-semester-change", handler);
    return () => window.removeEventListener("default-semester-change", handler);
  }, []);

  useEffect(() => {
    if (isSubjectsRoute(pathname)) {
      const fullPath = pathname + location.search;
      try {
        localStorage.setItem(SAVED_PATH_KEY, fullPath);
      } catch {}
      savedPathRef.current = fullPath;
    }
  }, [pathname]);

  const handleSubjectsClick = useCallback(
    (e: React.MouseEvent) => {
      const level = getLevel(pathname);
      if (level > 0) {
        e.preventDefault();
        if (level >= 2) {
          const def = defaultSemesterRef.current;
          router.push(def ? `/subjects/${def}` : "/subjects");
        } else {
          router.push("/subjects");
        }
        return;
      }
      const saved = savedPathRef.current;
      if (saved && getLevel(saved) >= 2) {
        e.preventDefault();
        router.push(saved);
        return;
      }
      const def = defaultSemesterRef.current;
      if (def) {
        e.preventDefault();
        router.push(`/subjects/${def}`);
      }
    },
    [pathname, router]
  );

  const isDimmed = pathname.startsWith("/view-pdf");

  return (
    <nav className={cn("bottom-nav", isDimmed && "bottom-nav--dimmed")}>
      {items.map((item) => {
        const isSubjectsTab = item.href === "/subjects";
        const active = isSubjectsTab
          ? isSubjectsRoute(pathname)
          : pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={isSubjectsTab ? handleSubjectsClick : undefined}
            className={cn("nav-item", active && "active")}
          >
            <i className={`bx ${item.icon}`} style={{ fontSize: "1.4rem" }}></i>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
