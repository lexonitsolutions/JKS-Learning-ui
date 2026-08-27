"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebGLSupport } from "./use-webgl-support";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const Hero3dCanvas = dynamic(() => import("./hero-3d-canvas"), { ssr: false });

export function Hero3dBackdrop({ className = "h-full w-full" }: { className?: string }) {
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
        <div className="flex h-full w-full items-center justify-center">
          <div className="h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} aria-hidden>
      {inView && <Hero3dCanvas interactive={!isMobile} />}
    </div>
  );
}
