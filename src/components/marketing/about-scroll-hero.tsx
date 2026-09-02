"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { About3dBackdrop } from "@/components/three/about-3d-backdrop";
import { aboutScrollProgress } from "@/components/three/about-progress";
import { ABOUT_CHAPTERS } from "./about-chapters";

// ── Design note ──────────────────────────────────────────────────────────
// This replaces the previous 21st.dev-derived hero (icons flying from a
// bottom strip into inline slots inside the headline). That mechanic had two
// problems the redesign fixes rather than tunes:
//   1. For roughly the first three quarters of a 4x-viewport pin the headline
//      was fully transparent, so the section read as a bare full-bleed photo
//      with a filmstrip taped to the bottom — the exact frame in the client
//      screenshot. There was no premium "state" to land on, only a payoff.
//   2. The reveal order was randomised per load, so the sentence assembled
//      out of order and the section never told the same story twice.
//
// The new mechanic is a pinned chapter sequence: one fixed editorial headline
// that is legible from frame zero, and five chapters that advance beneath it
// as a 3D card deck rotates the next photo forward. Every scroll position
// shows a complete, composed frame. Motion is *stepped with dwell* — each
// chapter holds for ~58% of its window before handing over — so it reads
// deliberate and classic rather than continuously sliding.
//
// Responsive: one mechanic across all sizes, re-laid-out rather than
// re-invented. Desktop is a two-column composition (narrative left, deck
// right); below lg the same three blocks stack into a grid whose middle row
// flexes, so the deck takes whatever height is left over on a short phone
// instead of pushing the rail off-screen. Pin distance is shorter on mobile
// (2.8x vs 4.2x viewport) since a "viewport height" is a much larger physical
// gesture on a phone.
//
// prefers-reduced-motion gets a genuine static composition below — the full
// chapter list, all five visible at once — not a stripped-down stub.
// ─────────────────────────────────────────────────────────────────────────

const HEADLINE_LINES = ["Learning that ends", "in proof — not just", "a progress bar."];

/** Hermite smoothstep, clamped. Used for the per-chapter hand-over easing. */
function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

export function AboutScrollHero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const deckRef = useRef<HTMLDivElement | null>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const narratorsRef = useRef<(HTMLDivElement | null)[]>([]);
  const railFillsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const counterRef = useRef<HTMLSpanElement | null>(null);
  const hintRef = useRef<HTMLDivElement | null>(null);
  const introRef = useRef<HTMLDivElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap, ScrollTrigger } = getGsap();
    const total = ABOUT_CHAPTERS.length;

    const isMobile = () => window.innerWidth < 1024;
    let pinDistance = window.innerHeight * (isMobile() ? 2.8 : 4.2);

    const ctx = gsap.context(() => {
      // ── Entrance (not scroll-linked) ──────────────────────────────────
      // The hero must be composed and readable the instant it lands; the
      // pin then *develops* it. Masked line-rise for the headline, a settle
      // for the deck.
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });
      intro
        .from("[data-hero-eyebrow]", { opacity: 0, y: 14, duration: 0.7 })
        .from(
          "[data-hero-line] > span",
          { yPercent: 115, duration: 1.05, stagger: 0.09 },
          "-=0.45"
        )
        .from(
          deckRef.current,
          { opacity: 0, y: 44, scale: 0.94, rotateY: -12, transformPerspective: 1400, duration: 1.15 },
          "-=0.85"
        )
        .from("[data-hero-narrative]", { opacity: 0, y: 20, duration: 0.8 }, "-=0.8")
        .from("[data-hero-rail]", { opacity: 0, y: 16, duration: 0.7 }, "-=0.55")
        .from("[data-hero-cta]", { opacity: 0, y: 16, duration: 0.7 }, "-=0.55");

      // No per-card transformPerspective: the deck wrapper carries a single
      // CSS `perspective`, so all five cards share one vanishing point and
      // the stack reads as one object rather than five independent planes.

      const render = (progress: number) => {
        aboutScrollProgress.value = progress;

        // seg ∈ [0, total) — the continuous chapter cursor.
        const seg = clamp01(progress) * total;
        const active = Math.min(total - 1, Math.floor(seg));
        const frac = seg - active;

        // Dwell, then hand over: cards hold still for the first 58% of a
        // chapter's window and only then rotate the next one forward. Clamped
        // at the last chapter so the deck settles on card five for the rest
        // of the pin instead of rotating it away into an empty stage.
        const cursor = Math.min(total - 1, active + smoothstep(0.58, 1, frac));

        // ── Deck ──────────────────────────────────────────────────────
        cardsRef.current.forEach((card, i) => {
          if (!card) return;
          const d = i - cursor;

          if (d <= -1) {
            gsap.set(card, { opacity: 0, pointerEvents: "none" });
            return;
          }

          if (d < 0) {
            // Departing: lifts up and rotates away from the viewer.
            const u = -d;
            gsap.set(card, {
              opacity: 1 - Math.pow(u, 1.15),
              xPercent: u * 16,
              yPercent: -u * 18,
              rotateY: -24 * u,
              rotateZ: -3 * u,
              scale: 1 + u * 0.07,
              filter: "brightness(1)",
              zIndex: 60 - i,
              pointerEvents: "none",
            });
            return;
          }

          // Waiting: a shallow, evenly-spaced stack behind the active card.
          const k = Math.min(d, 3);
          gsap.set(card, {
            opacity: k >= 2.9 ? 0 : 1,
            xPercent: k * 3.2,
            yPercent: k * 4.4,
            rotateY: k * 4,
            rotateZ: 0,
            scale: 1 - k * 0.055,
            filter: `brightness(${(1 - k * 0.16).toFixed(3)})`,
            zIndex: 60 - i,
            pointerEvents: "none",
          });
        });

        // ── Narrative copy ────────────────────────────────────────────
        narratorsRef.current.forEach((node, i) => {
          if (!node) return;
          if (i !== active) {
            gsap.set(node, { opacity: 0, y: 0, pointerEvents: "none" });
            return;
          }
          // Chapter one is already composed at progress 0 — without this it
          // would fade in from nothing over the first pixels of scroll and
          // the pinned hero would open on an empty column.
          const enter = i === 0 ? 1 : clamp01((frac - 0.02) / 0.2);
          // The final chapter holds to the end of the pin instead of fading
          // out into an empty column.
          const exit = i === total - 1 ? 0 : clamp01((frac - 0.64) / 0.24);
          gsap.set(node, {
            opacity: enter * (1 - exit),
            y: 20 * (1 - enter) - 16 * exit,
            pointerEvents: "auto",
          });
        });

        // ── Rail + counter ────────────────────────────────────────────
        railFillsRef.current.forEach((fill, i) => {
          if (fill) gsap.set(fill, { scaleX: clamp01(seg - i) });
        });
        if (counterRef.current) {
          counterRef.current.textContent = ABOUT_CHAPTERS[active].index;
        }
        if (hintRef.current) {
          gsap.set(hintRef.current, { opacity: 1 - clamp01(progress / 0.05) });
        }
        // Intro block drifts up very slightly across the whole pin so the
        // composition breathes without the headline ever leaving.
        if (introRef.current) {
          gsap.set(introRef.current, { y: -progress * 18 });
        }
      };

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: () => `+=${pinDistance}`,
        pin: true,
        pinSpacing: true,
        scrub: 0.85,
        invalidateOnRefresh: true,
        onRefreshInit: () => {
          pinDistance = window.innerHeight * (isMobile() ? 2.8 : 4.2);
        },
        onUpdate: (self) => {
          // One bad frame should log, not silently kill the rest of the pin.
          try {
            render(self.progress);
          } catch (err) {
            console.error("AboutScrollHero scroll update failed:", err);
          }
        },
      });

      render(0);
    }, sectionRef.current);

    return () => {
      aboutScrollProgress.value = 0;
      ctx.revert();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="relative overflow-hidden bg-primary-dark text-white">
        <HeroAtmosphere />
        <div className="relative z-10 mx-auto max-w-[1280px] px-6 py-24 lg:px-16">
          <Eyebrow />
          <h1 className="mt-6 max-w-3xl text-[clamp(2rem,5vw,3.75rem)] leading-[1.08] font-bold tracking-[-0.02em]">
            {HEADLINE_LINES.join(" ")}
          </h1>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ABOUT_CHAPTERS.map((chapter) => (
              <article
                key={chapter.index}
                className="rounded-2xl border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs tracking-[0.2em] text-[#E9B872]">
                    {chapter.index}
                  </span>
                  <span className="h-px flex-1 bg-white/15" />
                  <span className="text-[11px] font-semibold tracking-[0.18em] text-white/50 uppercase">
                    {chapter.kicker}
                  </span>
                </div>
                <h2 className="mt-4 text-lg font-semibold">{chapter.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/65">{chapter.body}</p>
                <p className="mt-4 text-xs font-semibold tracking-wide text-white/40">
                  {chapter.metric}
                </p>
              </article>
            ))}
          </div>
          <HeroCta className="mt-12" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-primary-dark text-white"
    >
      <HeroAtmosphere />

      <div className="relative z-10 mx-auto grid h-full max-w-[1280px] grid-cols-1 grid-rows-[auto_minmax(0,1fr)_auto] gap-4 px-6 pt-[4.5rem] pb-6 sm:gap-6 sm:pb-8 lg:grid-cols-[1.02fr_0.98fr] lg:grid-rows-1 lg:items-center lg:gap-16 lg:px-16 lg:pt-16 lg:pb-16">
        {/* `contents` on mobile lets these three blocks sit directly in the
            outer grid (headline · deck · narrative). At lg the wrapper turns
            back into a real column and the row assignments go inert. */}
        <div className="contents lg:col-start-1 lg:flex lg:flex-col">
          <div ref={introRef} className="row-start-1 will-change-transform">
            <Eyebrow />
            <h1 className="mt-3 text-[clamp(1.6rem,5.4vw,3.9rem)] leading-[1.06] font-bold tracking-[-0.025em] sm:mt-6">
              {HEADLINE_LINES.map((line) => (
                <span key={line} data-hero-line className="block overflow-hidden pb-[0.08em]">
                  <span className="block">{line}</span>
                </span>
              ))}
            </h1>
          </div>

          <div className="row-start-3 lg:mt-10">
            {/* Fixed-height stage: chapters cross-fade in place, so the rail
                below never jumps as copy length changes. Heights are sized to
                the longest chapter at each breakpoint; on phones the body is
                clamped to three lines so a short viewport never has to choose
                between the copy and the card deck. */}
            <div
              data-hero-narrative
              className="relative h-[138px] sm:h-[168px] lg:h-[196px]"
            >
              {ABOUT_CHAPTERS.map((chapter, i) => (
                <div
                  key={chapter.index}
                  ref={(el) => {
                    narratorsRef.current[i] = el;
                  }}
                  className="absolute inset-0 opacity-0 will-change-transform"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold tracking-[0.22em] text-[#E9B872] uppercase">
                      {chapter.kicker}
                    </span>
                    <span className="h-px w-10 bg-[#E9B872]/40" />
                    <span className="text-[11px] font-medium tracking-[0.12em] text-white/45">
                      {chapter.metric}
                    </span>
                  </div>
                  <h2 className="mt-2.5 text-lg leading-snug font-semibold tracking-[-0.01em] sm:mt-3 sm:text-2xl lg:text-[28px]">
                    {chapter.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 max-w-lg text-[13px] leading-relaxed text-white/60 sm:mt-2.5 sm:line-clamp-none sm:text-sm lg:text-[15px]">
                    {chapter.body}
                  </p>
                </div>
              ))}
            </div>

            <div data-hero-rail className="mt-5 flex items-center gap-4 lg:mt-7">
              <span className="font-mono text-xs tracking-[0.2em] text-white/70">
                <span ref={counterRef}>01</span>
                <span className="text-white/30"> / 0{ABOUT_CHAPTERS.length}</span>
              </span>
              <div className="flex flex-1 gap-1.5">
                {ABOUT_CHAPTERS.map((chapter, i) => (
                  <span key={chapter.index} className="h-px flex-1 bg-white/15">
                    <span
                      ref={(el) => {
                        railFillsRef.current[i] = el;
                      }}
                      className="block h-px origin-left scale-x-0 bg-[#E9B872]"
                    />
                  </span>
                ))}
              </div>
            </div>

            <HeroCta data-hero-cta className="mt-6 hidden lg:flex" />
          </div>
        </div>

        {/* ── Card deck ── */}
        <div className="row-start-2 flex min-h-0 items-center justify-center lg:col-start-2 lg:row-start-1">
          <div
            ref={deckRef}
            className="relative h-full w-full max-w-[280px] will-change-transform sm:max-w-[320px] lg:aspect-[4/5] lg:h-auto lg:max-w-[430px]"
            style={{ perspective: "1400px" }}
          >
            {/* Ground shadow keeps the stack from floating in the dark. */}
            <div
              aria-hidden
              className="absolute -inset-x-6 -bottom-6 h-16 rounded-[50%] bg-black/45 blur-2xl"
            />
            {ABOUT_CHAPTERS.map((chapter, i) => (
              <div
                key={chapter.index}
                ref={(el) => {
                  cardsRef.current[i] = el;
                }}
                className="absolute inset-0 overflow-hidden rounded-2xl border border-white/12 bg-primary-dark shadow-[0_30px_60px_-18px_rgba(0,0,0,0.75)] will-change-transform"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- hotlinked
                    stock photo; matches the existing About panel exception. */}
                <img
                  src={chapter.photoUrl}
                  alt={chapter.photoAlt}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050c1c] via-[#050c1c]/35 to-transparent" />
                <div className="absolute inset-0 bg-primary-dark/25 mix-blend-multiply" />
                {/* Inner hairline — the "framed print" detail. */}
                <div className="absolute inset-3 rounded-xl border border-white/10" />

                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-semibold tracking-[0.24em] text-[#E9B872] uppercase">
                        {chapter.kicker}
                      </span>
                      <p className="mt-1.5 text-sm leading-snug font-semibold text-white sm:text-base">
                        {chapter.title}
                      </p>
                    </div>
                    <span className="font-mono text-2xl leading-none font-light text-white/25 sm:text-3xl">
                      {chapter.index}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <HeroCta data-hero-cta className="row-start-4 lg:hidden" />
      </div>

      <div
        ref={hintRef}
        className="pointer-events-none absolute inset-x-0 bottom-4 z-10 hidden justify-center lg:flex"
      >
        <span className="flex items-center gap-2 text-[11px] font-medium tracking-[0.22em] text-white/35 uppercase">
          Scroll <ArrowDown className="h-3.5 w-3.5" />
        </span>
      </div>
    </section>
  );
}

function Eyebrow() {
  return (
    <div data-hero-eyebrow className="flex items-center gap-3">
      <span className="h-px w-8 bg-[#E9B872]" />
      <span className="text-[11px] font-semibold tracking-[0.28em] text-[#E9B872] uppercase">
        About JKS Learning
      </span>
    </div>
  );
}

function HeroCta({ className = "", ...rest }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`} {...rest}>
      <Link
        href="/courses"
        className="group inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-[#E9B872]"
      >
        Explore courses
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
      <Link
        href="/ai-mock-interview"
        className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/85 transition-colors hover:border-white/50 hover:text-white"
      >
        Try the AI interview
      </Link>
    </div>
  );
}

/** Layered backdrop: 3D constellation, fine grid, and a vignette. */
function HeroAtmosphere() {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_20%,#12285180_0%,transparent_60%)]"
      />
      <About3dBackdrop className="absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage: "radial-gradient(80% 60% at 50% 40%, #000 0%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(80% 60% at 50% 40%, #000 0%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(110%_75%_at_50%_45%,transparent_35%,rgba(3,8,20,0.7)_100%)]"
      />
    </>
  );
}
