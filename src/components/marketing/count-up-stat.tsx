"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface CountUpStatProps {
  target: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

// Counts from 0 → target once the element scrolls into view. Runs on a
// detached plain object + direct textContent write (not React state) so the
// animation stays at 60fps without re-rendering the component every frame.
export function CountUpStat({ target, prefix = "", suffix = "", duration = 1.6 }: CountUpStatProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!spanRef.current) return;

    const format = (n: number) => `${prefix}${Math.round(n).toLocaleString("en-US")}${suffix}`;

    if (reducedMotion) {
      spanRef.current.textContent = format(target);
      return;
    }

    const { gsap } = getGsap();
    const counter = { value: 0 };

    const ctx = gsap.context(() => {
      gsap.to(counter, {
        value: target,
        duration,
        ease: "power2.out",
        scrollTrigger: { trigger: spanRef.current, start: "top 90%", once: true },
        onUpdate: () => {
          if (spanRef.current) spanRef.current.textContent = format(counter.value);
        },
      });
    }, spanRef);

    return () => ctx.revert();
  }, [target, prefix, suffix, duration, reducedMotion]);

  return (
    <span ref={spanRef}>
      {prefix}0{suffix}
    </span>
  );
}
