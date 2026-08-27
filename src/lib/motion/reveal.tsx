"use client";

import { useEffect, useRef } from "react";
import type { gsap } from "gsap";
import { getGsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

type Variant = "fade-up" | "fade" | "stagger" | "scale-in";
type RevealTag = "div" | "ul" | "section";

const FROM_VARS: Record<Variant, gsap.TweenVars> = {
  "fade-up": { opacity: 0, y: 32 },
  fade: { opacity: 0 },
  stagger: { opacity: 0, y: 24 },
  "scale-in": { opacity: 0, scale: 0.94 },
};

interface RevealProps {
  children: React.ReactNode;
  variant?: Variant;
  /** For "stagger": animates direct children instead of the container. */
  staggerDelay?: number;
  duration?: number;
  delay?: number;
  className?: string;
  as?: RevealTag;
}

// Entrance-only scroll reveal — not scroll-linked/pinned. Each section
// keeps its own personality by combining variant + duration + delay rather
// than reusing one "fade-up everything" tween.
export function Reveal({
  children,
  variant = "fade-up",
  staggerDelay = 0.08,
  duration = 0.8,
  delay = 0,
  className,
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !ref.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const targets = variant === "stagger" ? Array.from(ref.current!.children) : ref.current;

      gsap.set(targets, FROM_VARS[variant]);
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration,
        delay,
        ease: "power3.out",
        stagger: variant === "stagger" ? staggerDelay : 0,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      });
    }, ref);

    return () => ctx.revert();
  }, [variant, duration, delay, staggerDelay, reducedMotion]);

  if (Tag === "ul") {
    return (
      <ul ref={ref as React.RefObject<HTMLUListElement>} className={className}>
        {children}
      </ul>
    );
  }
  if (Tag === "section") {
    return (
      <section ref={ref as React.RefObject<HTMLElement>} className={className}>
        {children}
      </section>
    );
  }
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
}
