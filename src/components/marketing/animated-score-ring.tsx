"use client";

import { useEffect, useRef, useState } from "react";
import { ScoreRing } from "@/components/ui/score-ring";

// ScoreRing already CSS-transitions its stroke-dashoffset — this just holds
// it at 0 until scrolled into view, then flips to the real score once, so
// the ring "fills" in sync with the rest of the scroll-triggered content.
export function AnimatedScoreRing({
  score,
  size,
  label,
  variant = "light",
}: {
  score: number;
  size?: number;
  label?: string;
  variant?: "light" | "dark";
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      <ScoreRing score={revealed ? score : 0} size={size} label={label} variant={variant} />
    </div>
  );
}

