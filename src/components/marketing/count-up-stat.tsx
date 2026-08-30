"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface CountUpStatProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export function CountUpStat({
  target,
  prefix = "",
  suffix = "",
  duration = 1.6,
}: CountUpStatProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;

    if (reducedMotion) {
      el.textContent = format(target);
      return;
    }

    // Use IntersectionObserver for 100% resilient scroll triggering across all route changes
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          observer.disconnect();

          const startTime = performance.now();
          const durationMs = duration * 1000;

          const tick = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / durationMs, 1);
            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const currentVal = target * easeProgress;

            if (spanRef.current) {
              spanRef.current.textContent = format(currentVal);
            }

            if (progress < 1) {
              requestAnimationFrame(tick);
            }
          };

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, [target, prefix, suffix, duration, reducedMotion, hasAnimated]);

  return (
    <span ref={spanRef}>
      {prefix}0{suffix}
    </span>
  );
}
