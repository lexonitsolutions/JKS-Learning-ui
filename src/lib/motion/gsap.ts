"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

let registered = false;

// Single registration point — avoids double-registering the plugin across
// every component that imports it (GSAP warns/duplicates work otherwise).
export function getGsap() {
  if (!registered && typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    // Mobile browsers resize the viewport (address bar show/hide) while the
    // user is mid-scroll. ScrollTrigger's default resize handling treats
    // that as a layout change and refreshes, which repins/re-measures
    // whatever is currently pinned (the about-page scroll-hero) mid-gesture
    // and desyncs its start/end from the actual scroll position — the page
    // reads as "stuck" right as the user scrolls into the next section.
    ScrollTrigger.config({ ignoreMobileResize: true });
    registered = true;
  }
  return { gsap, ScrollTrigger };
}
