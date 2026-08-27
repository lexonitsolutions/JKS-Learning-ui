"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebGLSupport } from "./use-webgl-support";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { Success3dCanvasProps } from "./success-3d-canvas";

const Success3dCanvas = dynamic(() => import("./success-3d-canvas"), { ssr: false });

export interface Success3dBackdropProps extends Success3dCanvasProps {
  className?: string;
}

export function Success3dBackdrop({
  interactive = true,
  intensity = 1,
  primaryColor = "#1E5EFF",
  secondaryColor = "#00F0FF",
  goldColor = "#F59E0B",
  accentColor = "#10B981",
  className = "absolute inset-0",
}: Success3dBackdropProps) {
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
        {/* Subtle CSS ambient glow fallback */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="h-72 w-72 rounded-full bg-amber-500/20 blur-3xl" />
          <div className="h-64 w-64 rounded-full bg-primary-blue/25 blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} aria-hidden>
      {inView && (
        <Success3dCanvas
          interactive={!isMobile && interactive}
          intensity={intensity}
          primaryColor={primaryColor}
          secondaryColor={secondaryColor}
          goldColor={goldColor}
          accentColor={accentColor}
        />
      )}
    </div>
  );
}
