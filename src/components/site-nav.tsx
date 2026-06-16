"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: "bx-home-alt" },
  { href: "/subjects", label: "Subjects", icon: "bx-layer" },
  { href: "/lectures", label: "Lectures", icon: "bx-video" },
  { href: "/notes", label: "Notes", icon: "bx-book-open" },
  { href: "/upload", label: "Upload", icon: "bx-cloud-upload" },
  { href: "/profile", label: "Profile", icon: "bx-user" },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const active =
          pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
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
