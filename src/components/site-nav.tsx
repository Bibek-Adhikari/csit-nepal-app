"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, Home, Layers3, UserRound, Video } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Home", icon: Home },
  { href: "/subjects", label: "Subjects", icon: Layers3 },
  { href: "/lectures", label: "Lectures", icon: Video },
  { href: "/notes", label: "Notes", icon: BookOpenText },
  { href: "/profile", label: "Profile", icon: UserRound },
];

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn("nav-item", active && "active")}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}