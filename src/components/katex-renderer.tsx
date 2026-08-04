"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

type Props = {
  math: string;
  display?: boolean;
};

export function MathInline({ math }: { math: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current && math) {
      katex.render(math, ref.current, {
        throwOnError: false,
        displayMode: false,
      });
    }
  }, [math]);

  return <span ref={ref} />;
}

export function MathBlock({ math, display = true }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && math) {
      katex.render(math, ref.current, {
        throwOnError: false,
        displayMode: display,
      });
    }
  }, [math, display]);

  return <div ref={ref} className="katex-display" />;
}
