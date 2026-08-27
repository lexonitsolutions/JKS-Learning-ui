"use client";

import { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { HeroPanel, HERO_PANELS } from "./about-hero-panel";

// Adapted from a 21st.dev "home-hero-landing-scroll-animation" submission,
// restored to the original's full mechanic per client direction (icons fly
// from a bottom strip into inline slots inside the headline, shuffled
// reveal order, background parallax fade) — but with its real bugs fixed
// rather than reproduced:
//  - gsap.context(fn, heroSectionRef) passed the React ref *object* as the
//    scope arg instead of heroSectionRef.current (the DOM element).
//  - Several `ref.current!.getBoundingClientRect()` non-null assertions
//    could throw if a ref was momentarily null, silently breaking the
//    entire per-frame update from that point on.
//  - Text reveal windows were 1.5% of total scroll each — widened to 6%
//    here; the original's width plus scrub smoothing is what most likely
//    read as "text not showing properly."
//  - No prefers-reduced-motion handling — added below.
//  - Fonts (Space Grotesk/Inter via a render-blocking `@import` in a
//    <style> tag) replaced with this project's existing Manrope; colors
//    replaced with design tokens.
//  - Pin distance reduced from 8x to 4x viewport height (3x on narrow
//    screens — same mechanic, shorter total scroll commitment, since a
//    "viewport height" is a smaller absolute scroll gesture on a phone).
//  - Images: DESIGN.md defaults to procedural visuals over photography;
//    this is a deliberate, client-directed exception using real,
//    verified-resolving Pexels photos instead (see about-hero-panel.tsx).
//  - Per-frame update wrapped in try/catch so one bad frame logs instead
//    of silently breaking the scroll interaction for the rest of the page.
//  - Element.remove() instead of parentNode.removeChild(node) everywhere a
//    cloned "flying" icon is detached — removeChild throws NotFoundError if
//    the node isn't (still) an actual child of that parent at call time;
//    remove() is a safe no-op if already detached.
//
// One experience across all screen sizes — the icon-dock sizing
// (headerIconSize) and layout (the `md:` breakpoint classes below) were
// already built responsive from the original component; the only mobile-
// specific tuning here is a shorter total pin distance, not a different
// mechanic. prefers-reduced-motion still gets the plain static fallback
// below, since a long scroll-jack is exactly what that preference opts out
// of regardless of screen size.

interface AnimationOrderItem {
  segment: HTMLElement;
  index: number;
}

const TEXT_SEGMENTS = [
  "Structured courses and real projects",
  "build the technical foundation,",
  "where an AI mock interview",
  "measures what you've actually learned",
];
const FINAL_SEGMENT_LEAD = "and a verified certificate";
const FINAL_SEGMENT_TAIL = "becomes proof of career-ready skill.";

export function AboutScrollHero() {
  const heroSectionRef = useRef<HTMLElement | null>(null);
  const backgroundRef = useRef<HTMLDivElement | null>(null);
  const animatedIconsRef = useRef<HTMLDivElement | null>(null);
  const iconElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const textSegmentsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const placeholdersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const duplicateIconsRef = useRef<HTMLElement[] | null>(null);
  const textOrderRef = useRef<AnimationOrderItem[]>([]);
  const isMobileRef = useRef(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !heroSectionRef.current || !animatedIconsRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();

    const order: AnimationOrderItem[] = [];
    textSegmentsRef.current.forEach((segment, index) => {
      if (segment) order.push({ segment, index });
    });
    for (let i = order.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [order[i], order[j]] = [order[j], order[i]];
    }
    textOrderRef.current = order;

    const updateIsMobile = () => {
      isMobileRef.current = window.innerWidth < 1000;
    };
    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    const currentIconSize = iconElementsRef.current[0]?.getBoundingClientRect().width || 1;
    const pinDistance = window.innerHeight * (isMobileRef.current ? 3 : 4);

    // Element.remove() is a safe no-op if the node is already detached —
    // unlike parentNode.removeChild(node), which throws NotFoundError if
    // the node isn't (still) an actual child of that parent. Reading
    // .parentNode and calling .removeChild() on it looks race-free within
    // one synchronous expression, but GSAP's ScrollTrigger can fire a
    // reconciling onUpdate during pin setup/refresh/kill that reaches this
    // cleanup a second time for the same node — remove() tolerates that.
    const clearDuplicateIcons = () => {
      duplicateIconsRef.current?.forEach((d) => d.remove());
      duplicateIconsRef.current = null;
    };

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: heroSectionRef.current,
        start: "top top",
        end: `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          try {
            const progress = self.progress;
            const headerIconSize = isMobileRef.current ? 35 : 60;
            const exactScale = headerIconSize / currentIconSize;
            const icons = animatedIconsRef.current;

            textSegmentsRef.current.forEach((segment) => {
              if (segment) gsap.set(segment, { opacity: 0 });
            });

            if (progress < 0.3) {
              const moveProgress = progress / 0.3;
              const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

              if (backgroundRef.current) {
                if (progress < 0.15) {
                  const headerProgress = progress / 0.15;
                  gsap.set(backgroundRef.current, { y: -50 * headerProgress, opacity: 1 - headerProgress });
                } else {
                  gsap.set(backgroundRef.current, { y: -50, opacity: 0 });
                }
              }

              if (duplicateIconsRef.current) clearDuplicateIcons();

              if (icons) gsap.set(icons, { x: 0, y: containerMoveY, scale: 1, opacity: 1 });

              iconElementsRef.current.forEach((icon, index) => {
                if (!icon) return;
                const staggerDelay = index * 0.1;
                const iconProgress = gsap.utils.mapRange(staggerDelay, staggerDelay + 0.5, 0, 1, moveProgress);
                const clamped = Math.max(0, Math.min(1, iconProgress));
                gsap.set(icon, { x: 0, y: -containerMoveY * (1 - clamped) });
              });
            } else if (progress < 0.6) {
              const scaleProgress = (progress - 0.3) / 0.3;
              if (backgroundRef.current) gsap.set(backgroundRef.current, { y: -50, opacity: 0 });

              if (duplicateIconsRef.current) clearDuplicateIcons();

              if (!icons) return;
              const containerRect = icons.getBoundingClientRect();
              const deltaX = (window.innerWidth / 2 - (containerRect.left + containerRect.width / 2)) * scaleProgress;
              const deltaY = (window.innerHeight / 2 - (containerRect.top + containerRect.height / 2)) * scaleProgress;

              gsap.set(icons, {
                x: deltaX,
                y: -window.innerHeight * 0.3 + deltaY,
                scale: 1 + (exactScale - 1) * scaleProgress,
                opacity: 1,
              });

              iconElementsRef.current.forEach((icon) => {
                if (icon) gsap.set(icon, { x: 0, y: 0 });
              });
            } else if (progress < 0.75) {
              const moveProgress = (progress - 0.6) / 0.15;
              if (backgroundRef.current) gsap.set(backgroundRef.current, { y: -50, opacity: 0 });

              if (!icons) return;
              const containerRect = icons.getBoundingClientRect();
              const deltaX = window.innerWidth / 2 - (containerRect.left + containerRect.width / 2);
              const deltaY = window.innerHeight / 2 - (containerRect.top + containerRect.height / 2);

              gsap.set(icons, {
                x: deltaX,
                y: -window.innerHeight * 0.3 + deltaY,
                scale: exactScale,
                opacity: 0,
              });

              iconElementsRef.current.forEach((icon) => {
                if (icon) gsap.set(icon, { x: 0, y: 0 });
              });

              if (!duplicateIconsRef.current) {
                duplicateIconsRef.current = [];
                iconElementsRef.current.forEach((icon) => {
                  if (!icon) return;
                  const duplicate = icon.cloneNode(true) as HTMLElement;
                  duplicate.removeAttribute("class");
                  Object.assign(duplicate.style, {
                    position: "absolute",
                    width: headerIconSize + "px",
                    height: headerIconSize + "px",
                    zIndex: "50",
                    borderRadius: "4px",
                    overflow: "hidden",
                    display: "none",
                  });
                  document.body.appendChild(duplicate);
                  duplicateIconsRef.current!.push(duplicate);
                });
              }

              duplicateIconsRef.current?.forEach((duplicate, index) => {
                const iconEl = iconElementsRef.current[index];
                const placeholderEl = placeholdersRef.current[index];
                if (!iconEl || !placeholderEl) return;

                const iconRect = iconEl.getBoundingClientRect();
                const startPageX = iconRect.left + iconRect.width / 2 + window.scrollX;
                const startPageY = iconRect.top + iconRect.height / 2 + window.scrollY;

                const targetRect = placeholderEl.getBoundingClientRect();
                const targetPageX = targetRect.left + targetRect.width / 2 + window.scrollX;
                const targetPageY = targetRect.top + targetRect.height / 2 + window.scrollY;

                const moveX = targetPageX - startPageX;
                const moveY = targetPageY - startPageY;

                let currentX = 0;
                const currentY = moveProgress < 0.5 ? moveY * (moveProgress / 0.5) : moveY;
                if (moveProgress >= 0.5) currentX = moveX * ((moveProgress - 0.5) / 0.5);

                duplicate.style.left = startPageX + currentX - headerIconSize / 2 + "px";
                duplicate.style.top = startPageY + currentY - headerIconSize / 2 + "px";
                duplicate.style.opacity = "1";
                duplicate.style.display = "block";
              });
            } else {
              if (icons) gsap.set(icons, { opacity: 0 });

              duplicateIconsRef.current?.forEach((duplicate, index) => {
                const placeholderEl = placeholdersRef.current[index];
                if (!placeholderEl) return;
                const targetRect = placeholderEl.getBoundingClientRect();
                const targetPageX = targetRect.left + targetRect.width / 2 + window.scrollX;
                const targetPageY = targetRect.top + targetRect.height / 2 + window.scrollY;
                duplicate.style.left = targetPageX - headerIconSize / 2 + "px";
                duplicate.style.top = targetPageY - headerIconSize / 2 + "px";
                duplicate.style.opacity = "1";
                duplicate.style.display = "block";
              });

              // 6%-wide windows (vs. the original's 1.5%) so each segment
              // visibly fades in rather than popping under scrub smoothing.
              textOrderRef.current.forEach((item, i) => {
                const segStart = 0.75 + i * 0.04;
                const segProgress = gsap.utils.mapRange(segStart, segStart + 0.06, 0, 1, progress);
                gsap.set(item.segment, { opacity: Math.max(0, Math.min(1, segProgress)) });
              });
            }
          } catch (err) {
            console.error("AboutScrollHero scroll update failed:", err);
          }
        },
      });
    }, heroSectionRef.current);

    return () => {
      window.removeEventListener("resize", updateIsMobile);
      clearDuplicateIcons();
      ctx.revert();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="relative flex min-h-[70vh] flex-col items-center justify-center overflow-hidden bg-primary-dark px-6 py-24 text-center text-white">
        <HeroPanel variant={2} className="absolute inset-0 opacity-30" />
        <div className="relative max-w-3xl">
          <span className="text-label text-primary-blue">About JKS Learning</span>
          <h1 className="text-display mt-4 text-white">
            Structured courses, real projects, and an AI mock interview that proves you&apos;re
            ready.
          </h1>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={heroSectionRef}
      className="relative h-screen w-full overflow-hidden bg-bg-light px-4 md:px-6"
    >
      <div ref={backgroundRef} className="absolute inset-0 h-full w-full will-change-transform" style={{ zIndex: 0 }}>
        <Swiper
          modules={[Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 3200, disableOnInteraction: false }}
          loop
          speed={1200}
          // Decorative autoplay background — without this, Swiper claims
          // touch drags across the entire pinned full-screen hero, so
          // diagonal swipes on mobile could be eaten instead of scrolling.
          allowTouchMove={false}
          className="about-hero-swiper h-full w-full"
        >
          {HERO_PANELS.map((panel, i) => (
            <SwiperSlide key={panel.label}>
              <HeroPanel variant={i} className="h-full w-full" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(245,248,255,0.5) 0%, rgba(245,248,255,0.25) 45%, rgba(245,248,255,0.85) 100%)",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div
        ref={animatedIconsRef}
        className="fixed bottom-10 left-1/2 z-[2] flex w-[90%] -translate-x-1/2 items-center gap-1.5 will-change-transform md:left-16 md:w-[75%] md:translate-x-0"
      >
        {HERO_PANELS.map((panel, index) => (
          <div
            key={panel.label}
            ref={(el) => {
              iconElementsRef.current[index] = el;
            }}
            className="aspect-square flex-1 overflow-hidden rounded-sm shadow-md will-change-transform"
          >
            <HeroPanel variant={index} className="h-full w-full" />
          </div>
        ))}
      </div>

      <div className="relative z-10 flex h-full items-center justify-center">
        <h1 className="max-w-[90vw] text-center text-[clamp(1.4rem,5vw,4.25rem)] leading-[1.3] font-bold tracking-tight text-text-heading md:max-w-[75vw] md:leading-[1.2]">
          {TEXT_SEGMENTS.map((text, i) => (
            <span key={i}>
              <span
                ref={(el) => {
                  textSegmentsRef.current[i] = el;
                }}
                className="opacity-0"
              >
                {text}
              </span>
              <span
                ref={(el) => {
                  placeholdersRef.current[i] = el;
                }}
                className="mx-1 inline-block h-8 w-8 align-middle will-change-transform invisible md:-mt-1.5 md:h-16 md:w-16"
              />
            </span>
          ))}
          <span
            ref={(el) => {
              textSegmentsRef.current[4] = el;
            }}
            className="opacity-0"
          >
            {FINAL_SEGMENT_LEAD}
            <span
              ref={(el) => {
                placeholdersRef.current[4] = el;
              }}
              className="mx-1 inline-block h-8 w-8 align-middle will-change-transform invisible md:-mt-1.5 md:h-16 md:w-16"
            />
            {FINAL_SEGMENT_TAIL}
          </span>
        </h1>
      </div>
    </section>
  );
}
