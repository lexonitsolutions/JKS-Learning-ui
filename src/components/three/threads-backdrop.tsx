"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useWebGLSupport } from "./use-webgl-support";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { ThreadsSceneProps } from "./threads-scene";

const ThreadsScene = dynamic(() => import("./threads-scene"), { ssr: false });

const JKS_BLUE: [number, number, number] = [30 / 255, 94 / 255, 255 / 255];

/**
 * Public entry point for the "Threads" shader background (see
 * threads-scene.tsx for attribution). Same discipline as
 * NetworkBackground: SSR-free lazy load, WebGL capability check,
 * prefers-reduced-motion opt-out, and mount only while in view so the
 * `ogl` bundle and render loop never load for users who won't see it.
 */
export function ThreadsBackdrop({
  amplitude = 1.6,
  distance = 0,
  enableMouseInteraction = true,
}: Partial<ThreadsSceneProps>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const capable = useWebGLSupport();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    // Mount once on first visibility and keep the scene alive after —
    // ThreadsScene pauses its own rAF work via an internal
    // IntersectionObserver while off-screen, so a persistent mount costs
    // nothing, whereas unmount/remount per scroll pass destroyed and
    // re-created a WebGL context each time (GPU-process context churn).
    const observer = new IntersectionObserver(
      ([entry]) => {
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

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden>
      {hasMounted && (
        <ThreadsScene
          color={JKS_BLUE}
          amplitude={amplitude}
          distance={distance}
          enableMouseInteraction={enableMouseInteraction}
        />
      )}
    </div>
  );
}
