"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebGLSupport } from "./use-webgl-support";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { About3dCanvasProps } from "./about-3d-canvas";

const About3dCanvas = dynamic(() => import("./about-3d-canvas"), { ssr: false });

export interface About3dBackdropProps extends About3dCanvasProps {
  className?: string;
}

// Purely decorative constellation behind the About hero. Mounts only while
// in view, and degrades to a static CSS glow when WebGL is unavailable or
// the visitor has asked for reduced motion.
export function About3dBackdrop({
  className = "absolute inset-0",
  interactive = true,
  reactive = true,
  ...rest
}: About3dBackdropProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const capable = useWebGLSupport();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "300px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion || !capable) {
    return (
      <div ref={containerRef} className={className} aria-hidden>
        <div className="absolute top-1/2 left-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(30,94,255,0.28),transparent_68%)] blur-2xl" />
        <div className="absolute top-[38%] left-[62%] h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(233,184,114,0.16),transparent_70%)] blur-2xl" />
      </div>
    );
  }

  return (
    <div ref={containerRef} className={className} aria-hidden>
      {inView && <About3dCanvas interactive={!isMobile && interactive} reactive={reactive} {...rest} />}
    </div>
  );
}
