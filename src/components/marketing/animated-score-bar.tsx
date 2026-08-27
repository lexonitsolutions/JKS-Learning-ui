"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

export function AnimatedScoreBar({ label, score }: { label: string; score: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !fillRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { width: "0%" },
        {
          width: `${score}%`,
          duration: 1.1,
          ease: "power2.out",
          scrollTrigger: { trigger: fillRef.current, start: "top 90%", once: true },
        }
      );
    });

    return () => ctx.revert();
  }, [reducedMotion, score]);

  return (
    <div>
      <div className="flex justify-between text-sm text-white/70">
        <span>{label}</span>
        <span>{score}</span>
      </div>
      <div className="mt-1 h-1 rounded-full bg-white/10">
        <div
          ref={fillRef}
          className="h-full rounded-full bg-primary-blue"
          style={{ width: reducedMotion ? `${score}%` : undefined }}
        />
      </div>
    </div>
  );
}
