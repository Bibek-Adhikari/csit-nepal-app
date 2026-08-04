"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";

export function RouteProgress() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const prevPath = useRef(pathname);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (pathname === prevPath.current) return;
    prevPath.current = pathname;

    timers.current.forEach(clearTimeout);
    timers.current = [];

    setVisible(true);
    setProgress(30);

    timers.current.push(setTimeout(() => setProgress(65), 200));
    timers.current.push(setTimeout(() => setProgress(85), 500));
    timers.current.push(
      setTimeout(() => {
        setProgress(100);
        timers.current.push(setTimeout(() => setVisible(false), 250));
      }, 700)
    );

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      className="route-progress"
      style={{ width: `${progress}%`, pointerEvents: "none" }}
      aria-hidden="true"
    />
  );
}
