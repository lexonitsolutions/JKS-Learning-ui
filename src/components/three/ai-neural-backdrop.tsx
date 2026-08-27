"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebGLSupport } from "./use-webgl-support";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { AiNeuralCanvasProps } from "./ai-neural-canvas";

const AiNeuralCanvas = dynamic(() => import("./ai-neural-canvas"), { ssr: false });

export interface AiNeuralBackdropProps extends AiNeuralCanvasProps {
  className?: string;
}

export function AiNeuralBackdrop({
  interactive = true,
  intensity = 1,
  primaryColor = "#1E5EFF",
  secondaryColor = "#00F0FF",
  accentColor = "#8B5CF6",
  className = "absolute inset-0",
}: AiNeuralBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const capable = useWebGLSupport();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion || !capable) {
    return (
      <div ref={containerRef} className={className} aria-hidden>
        {/* Subtle CSS pulse fallback for reduced motion or WebGL disabled */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="h-64 w-64 rounded-full bg-primary-blue/20 blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} aria-hidden>
      {inView && (
        <AiNeuralCanvas
          interactive={!isMobile && interactive}
          intensity={intensity}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}
