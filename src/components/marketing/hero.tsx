"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { NetworkBackground } from "@/components/three/network-background";
import { ThreadsBackdrop } from "@/components/three/threads-backdrop";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface HeroCta {
  href: string;
  label: string;
  // A rendered icon element, not a component reference — component
  // references aren't serializable across the Server → Client Component
  // boundary (Hero is a Client Component; its callers are Server Components).
  icon?: React.ReactNode;
}

interface HeroProps {
  eyebrow: string;
  headline: string;
  subtext: string;
  primaryCta: HeroCta;
  secondaryCta?: HeroCta;
  networkVariant?: "hero" | "compact";
  /** Which 3D backdrop to render — "network" (default, procedural node
   * graph) or "threads" (flowing shader lines, see threads-scene.tsx). */
  backdrop?: "network" | "threads";
  showScrollIndicator?: boolean;
}

// Shared premium hero — word-reveal headline + procedural 3D network +
// staggered content entrance. Reused wherever a page deserves the site's
// strongest visual treatment (Home, AI Mock Interview marketing page).
export function Hero({
  eyebrow,
  headline,
  subtext,
  primaryCta,
  secondaryCta,
  networkVariant = "hero",
  backdrop = "network",
  showScrollIndicator = true,
}: HeroProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !rootRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      const words = rootRef.current!.querySelectorAll<HTMLElement>("[data-word]");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.set(words, { yPercent: 130 })
        .set("[data-fade]", { opacity: 0, y: 16 })
        .to(words, { yPercent: 0, duration: 0.9, stagger: 0.035 })
        .to("[data-fade]", { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 }, "-=0.5");
    }, rootRef);

    return () => ctx.revert();
  }, [reducedMotion, headline]);

  return (
    <section ref={rootRef} className="relative overflow-hidden bg-primary-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, rgba(30,94,255,0.35), transparent 40%), radial-gradient(circle at 80% 60%, rgba(30,94,255,0.25), transparent 45%)",
        }}
      />
      {backdrop === "threads" ? <ThreadsBackdrop /> : <NetworkBackground variant={networkVariant} />}

      <div className="relative mx-auto max-w-[1280px] px-6 py-24 lg:px-16 lg:py-32">
        <div className="max-w-2xl">
          <span data-fade className="text-label text-primary-blue">
            {eyebrow}
          </span>

          <h1 className="text-display mt-4 text-white">
            {headline.split(" ").flatMap((word, i, arr) => [
              <span key={`w-${i}`} className="inline-block overflow-hidden pb-1 align-bottom">
                <span data-word className="inline-block">
                  {word}
                </span>
              </span>,
              // A real text-node space between word wrappers, kept outside
              // the clipped span — without it the browser treats each
              // wrapper as one atomic box and the headline never wraps.
              i < arr.length - 1 ? " " : null,
            ])}
          </h1>

          <p data-fade className="mt-6 max-w-xl text-lg text-white/70">
            {subtext}
          </p>

          <div data-fade className="mt-8 flex flex-wrap gap-4">
            <MagneticButton>
              <Link href={primaryCta.href} className={buttonVariants({ size: "lg" })}>
                {primaryCta.label} {primaryCta.icon}
              </Link>
            </MagneticButton>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className={
                  buttonVariants({ variant: "secondary", size: "lg" }) +
                  " border-white text-white hover:bg-white hover:text-primary-dark"
                }
              >
                {secondaryCta.icon} {secondaryCta.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {showScrollIndicator && (
        <div
          data-fade
          className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-white/50 sm:flex"
          aria-hidden
        >
          <span className="text-label">Scroll</span>
          <ChevronDown className="h-4 w-4 motion-safe:animate-bounce" />
        </div>
      )}
    </section>
  );
}
