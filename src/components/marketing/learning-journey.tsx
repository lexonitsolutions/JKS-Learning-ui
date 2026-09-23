"use client";

import { useEffect, useRef } from "react";
import { BookOpen, Hammer, BrainCircuit, ShieldCheck, TrendingUp } from "lucide-react";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { Reveal } from "@/lib/motion/reveal";

const STEPS = [
  { icon: BookOpen, title: "Structured Courses", body: "Course → Module → Topic → Video." },
  { icon: Hammer, title: "Hands-on Projects", body: "Apply every module to a real build." },
  { icon: BrainCircuit, title: "AI Interview Readiness", body: "Adaptive mock interviews, scored." },
  { icon: ShieldCheck, title: "Verified Certificate", body: "Publicly verifiable on completion." },
  { icon: TrendingUp, title: "Career Outcome", body: "Walk into interviews prepared." },
];

// Distinct scroll personality: a horizontal line scrubs its fill length
// exactly in sync with scroll position through the section (not an
// entrance-only reveal) — visualizes the learner's path (DESIGN.md §1
// "structured mastery").
export function LearningJourney() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const verticalFillRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      // Desktop horizontal line animation
      if (fillRef.current) {
        gsap.set(fillRef.current, { scaleX: 0 });
        gsap.to(fillRef.current, {
          scaleX: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            end: "bottom 55%",
            scrub: 0.6,
          },
        });
      }

      // Mobile vertical connecting line animation
      if (verticalFillRef.current) {
        gsap.set(verticalFillRef.current, { scaleY: 0 });
        gsap.to(verticalFillRef.current, {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 70%",
            end: "bottom 60%",
            scrub: 0.6,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="bg-white dark:bg-background py-16 sm:py-24 transition-colors duration-300">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
        <Reveal className="mb-12 sm:mb-16 max-w-xl text-center md:text-left mx-auto md:mx-0">
          <span className="text-label text-primary-blue font-bold tracking-wider uppercase text-xs">The Learning Journey</span>
          <h2 className="text-h2 mt-2 text-text-heading text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
            From first lesson to job-ready, one visible path
          </h2>
        </Reveal>

        <div className="relative">
          {/* Desktop horizontal connecting track & fill */}
          <div
            className="absolute top-6 right-0 left-0 hidden h-0.5 bg-border dark:bg-slate-800 md:block"
            aria-hidden
          >
            <div
              ref={fillRef}
              className="h-full w-full origin-left bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          {/* Mobile vertical connecting track & animated fill (aligned on icon axis to never cross text) */}
          <div
            className="absolute left-6 -translate-x-1/2 top-6 bottom-10 w-0.5 md:hidden"
            aria-hidden
          >
            {/* Background track line */}
            <div className="relative h-full w-full bg-slate-200 dark:bg-slate-800/90 rounded-full overflow-hidden">
              {/* Animated fill scrubbing in sync with scroll */}
              <div
                ref={verticalFillRef}
                className="h-full w-full origin-top bg-gradient-to-b from-blue-600 via-cyan-400 to-indigo-600 shadow-[0_0_12px_rgba(37,99,235,0.7)]"
                style={{ transform: "scaleY(0)" }}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:gap-10 md:grid-cols-5">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} variant="fade-up" delay={reducedMotion ? 0 : i * 0.08}>
                <div className="relative flex flex-row items-start text-left gap-4 md:flex-col md:items-start group">
                  <div className="relative z-10 shrink-0 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-blue bg-white dark:bg-surface-secondary shadow-md shadow-primary-blue/15 transition-transform duration-300 group-hover:scale-110">
                    <step.icon className="h-5 w-5 text-primary-blue dark:text-blue-400" />
                    {/* Small index badge */}
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-fill text-[9px] font-extrabold text-white">
                      {i + 1}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5 md:pt-0">
                    <h3 className="text-h3 md:mt-4 text-text-heading font-bold text-base sm:text-lg">{step.title}</h3>
                    <p className="mt-1 text-sm text-text-body dark:text-slate-400 max-w-xs">{step.body}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
