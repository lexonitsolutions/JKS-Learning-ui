"use client";

import { useCallback, useEffect, useRef } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Subtle pointer-driven depth. Mouse only (touch has no hover), no continuous
 * loop: it writes two CSS variables inside a single rAF per pointer move and
 * the browser composites the transform.
 */
export function Tilt({
  children,
  className = "",
  max = 5,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const reduced = useReducedMotion();

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  const onMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (reduced || e.pointerType !== "mouse") return;
      const el = ref.current;
      if (!el) return;
      const { clientX, clientY } = e;
      cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const px = (clientX - r.left) / r.width - 0.5;
        const py = (clientY - r.top) / r.height - 0.5;
        el.dataset.active = "true";
        el.style.setProperty("--ss-ry", `${(px * max * 2).toFixed(2)}deg`);
        el.style.setProperty("--ss-rx", `${(-py * max * 2).toFixed(2)}deg`);
      });
    },
    [max, reduced],
  );

  const onLeave = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const el = ref.current;
    if (!el) return;
    el.dataset.active = "false";
    el.style.setProperty("--ss-ry", "0deg");
    el.style.setProperty("--ss-rx", "0deg");
  }, []);

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className={`ss-tilt ${className}`}>
      {children}
    </div>
  );
}
