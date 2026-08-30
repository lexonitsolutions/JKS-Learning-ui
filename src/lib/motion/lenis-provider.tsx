"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getGsap } from "./gsap";
import { useReducedMotion } from "./use-reduced-motion";

// Marketing pages only (DESIGN.md §8) — the student/admin app shell keeps
// native scroll, which is preferable for a productivity tool.
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const { gsap, ScrollTrigger } = getGsap();
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      smoothWheel: true,
      touchMultiplier: 1.2,
      // Clicking a link to another page while inertia is still running left
      // Lenis animating toward the OLD page's scroll target: onNativeScroll
      // ignores external jumps while isScrolling === "smooth", so Next.js's
      // scroll-to-top on navigation was overwritten next frame and the new
      // page landed mid-scroll, fighting further input ("stuck" scroll).
      // This makes Lenis kill its inertia the moment a same-host link to a
      // different path is clicked.
      stopInertiaOnNavigate: true,
      // Same-page #hash links: scroll smoothly through Lenis instead of the
      // browser's instant jump (which Lenis would ignore mid-animation).
      anchors: true,
    });
    lenisRef.current = lenis;

    lenis.on("scroll", () => {
      try {
        ScrollTrigger.update();
      } catch {
        // ignore
      }
    });

    const onStRefresh = () => {
      try {
        lenis.resize();
      } catch {
        // ignore
      }
    };
    ScrollTrigger.addEventListener("refresh", onStRefresh);

    const onTick = (time: number) => {
      try {
        lenis.raf(time * 1000);
      } catch {
        // ignore
      }
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      try {
        ScrollTrigger.removeEventListener("refresh", onStRefresh);
        gsap.ticker.remove(onTick);
        lenis.destroy();
      } catch {
        // ignore
      }
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    try {
      lenis.scrollTo(window.scrollY, { immediate: true, force: true });
    } catch {
      // ignore
    }

    const raf = requestAnimationFrame(() => {
      try {
        const { ScrollTrigger } = getGsap();
        ScrollTrigger.refresh();
        lenis.resize();
      } catch {
        // ignore
      }
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);


  return <>{children}</>;
}
