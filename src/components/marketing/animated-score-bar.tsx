"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

export function AnimatedScoreBar({
  label,
  score,
  maxScore = 100,
}: {
  label: string;
  score: number;
  maxScore?: number;
}) {
  const fillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const percent = Math.min(100, Math.round((score / maxScore) * 100));

  useEffect(() => {
    if (reducedMotion || !fillRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      gsap.fromTo(
        fillRef.current,
        { width: "0%" },
        {
          width: `${percent}%`,
          duration: 1.0,
          ease: "power2.out",
          scrollTrigger: { trigger: fillRef.current, start: "top 90%", once: true },
        }
      );
    });

    return () => ctx.revert();
  }, [reducedMotion, percent]);

  return (
    <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 hover:bg-white/[0.04] transition-colors">
      <div className="flex items-center justify-between text-xs mb-2">
        <span className="font-semibold text-slate-200">{label}</span>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="font-bold text-cyan-300">{score}</span>
          <span className="text-[10px] text-slate-500">/ 100</span>
        </div>
      </div>
      <div className="relative h-2 w-full rounded-full bg-slate-800/90 overflow-hidden border border-white/5">
        <div
          ref={fillRef}
          className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 shadow-xs shadow-cyan-500/30"
          style={{ width: reducedMotion ? `${percent}%` : undefined }}
        />
      </div>
    </div>
  );
}

