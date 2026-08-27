"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebGLSupport } from "./use-webgl-support";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { NetworkCanvasProps } from "./network-canvas";

const NetworkCanvas = dynamic(() => import("./network-canvas"), { ssr: false });

type Variant = "hero" | "compact";

const VARIANTS: Record<Variant, NetworkCanvasProps> = {
  hero: { nodeCount: 90, connectionDistance: 2.6, radius: 6, interactive: true, color: "#1E5EFF" },
  compact: {
    nodeCount: 46,
    connectionDistance: 2.2,
    radius: 5,
    interactive: false,
    color: "#4C7CFF",
  },
};

const MOBILE_NODE_SCALE = 0.5;

/**
 * Public entry point for the network scene. Handles everything the raw R3F
 * Canvas shouldn't own: SSR-free lazy loading, WebGL capability detection,
 * prefers-reduced-motion opt-out, mobile complexity reduction, and pausing
 * the render loop while scrolled off-screen (PHASE 9 performance strategy).
 * Renders nothing on failure — the caller's own background (gradient)
 * shows through as the fallback.
 */
export function NetworkBackground({ variant = "hero" }: { variant?: Variant }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const capable = useWebGLSupport();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        // Mount the canvas once, permanently, on first visibility. The old
        // `inView && <Canvas>` unmounted it on every scroll-out, so each
        // pass over the section destroyed and re-created a WebGL context
        // (plus full shader recompile) — context churn Chrome's GPU
        // process tolerates poorly. Now the context lives for the page and
        // only the render loop is paused while off-screen.
        if (entry.isIntersecting) setHasMounted(true);
      },
      { rootMargin: "200px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (reducedMotion || !capable) {
    return <div ref={containerRef} className="absolute inset-0" aria-hidden />;
  }

  const config = VARIANTS[variant];
  const props: NetworkCanvasProps = isMobile
    ? { ...config, nodeCount: Math.round(config.nodeCount * MOBILE_NODE_SCALE), interactive: false }
    : config;

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden>
      {hasMounted && <NetworkCanvas {...props} paused={!inView} />}
    </div>
  );
}
