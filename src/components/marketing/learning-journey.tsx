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
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !fillRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
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
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="bg-white py-24">
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
        <Reveal className="mb-16 max-w-xl">
          <span className="text-label text-primary-blue">The Learning Journey</span>
          <h2 className="text-h2 mt-2 text-text-heading">
            From first lesson to job-ready, one visible path
          </h2>
        </Reveal>

        <div className="relative">
          <div
            className="absolute top-6 right-0 left-0 hidden h-px bg-border md:block"
            aria-hidden
          >
            <div
              ref={fillRef}
              className="h-full w-full origin-left bg-primary-blue"
              style={{ transform: "scaleX(0)" }}
            />
          </div>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} variant="fade-up" delay={reducedMotion ? 0 : i * 0.08}>
                <div className="relative flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary-blue bg-white">
                    <step.icon className="h-5 w-5 text-primary-blue" />
                  </div>
                  <h3 className="text-h3 mt-4 text-text-heading">{step.title}</h3>
                  <p className="mt-1 text-sm text-text-body">{step.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
