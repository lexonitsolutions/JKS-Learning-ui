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

    lenis.on("scroll", ScrollTrigger.update);

    // ScrollTrigger.refresh() adds/removes pin spacers (About hero pins for
    // 3–4 viewport heights), changing document height instantly — but
    // Lenis's own ResizeObserver is debounced 250ms. Until it fires, Lenis
    // clamps scrolling to the stale limit, which reads as the page hitting
    // an invisible wall. Recompute the limit synchronously after every
    // refresh instead.
    const onStRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", onStRefresh);

    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      ScrollTrigger.removeEventListener("refresh", onStRefresh);
      gsap.ticker.remove(onTick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reducedMotion]);

  // After every client-side navigation (including programmatic pushes and
  // back/forward, which stopInertiaOnNavigate's click listener can't see):
  // hard-sync Lenis to wherever the browser actually put the window, then
  // refresh ScrollTrigger once the new page has painted so pinned-section
  // coordinates match the new layout.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    lenis.scrollTo(window.scrollY, { immediate: true, force: true });

    const raf = requestAnimationFrame(() => {
      const { ScrollTrigger } = getGsap();
      ScrollTrigger.refresh();
      lenis.resize();
    });
    return () => cancelAnimationFrame(raf);
  }, [pathname]);

  return <>{children}</>;
}
