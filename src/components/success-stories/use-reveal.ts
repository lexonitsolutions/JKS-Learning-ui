"use client";

import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * Viewport-triggered entrance. Content is fully visible by default (SSR, no JS,
 * reduced motion, or already on screen); it is only hidden once we know we can
 * reveal it, so a failed script never leaves a blank page.
 *
 * Returns a callback ref and the className to apply.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(): [(el: T | null) => void, string] {
  const [el, setEl] = useState<T | null>(null);
  const reduced = useReducedMotion();
  const [phase, setPhase] = useState<"idle" | "armed" | "in">("idle");
  const ref = useCallback((node: T | null) => setEl(node), []);

  useEffect(() => {
    if (!el || reduced || typeof IntersectionObserver === "undefined") return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setPhase("in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.06 },
    );
    const arm = requestAnimationFrame(() => setPhase((p) => (p === "idle" ? "armed" : p)));
    io.observe(el);
    return () => {
      cancelAnimationFrame(arm);
      io.disconnect();
    };
  }, [el, reduced]);

  return [ref, phase === "armed" ? "ss-armed" : phase === "in" ? "ss-in" : ""];
}
