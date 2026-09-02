"use client";

import { useEffect, useRef } from "react";
import { getGsap } from "@/lib/motion/gsap";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

interface Milestone {
  year: string;
  title: string;
  body: string;
}

const MILESTONES: Milestone[] = [
  {
    year: "2019",
    title: "One cohort, taught by engineers",
    body: "JKS Learning began as a single Java Full Stack cohort run by working engineers on evenings and weekends — people who had shipped the systems they were teaching.",
  },
  {
    year: "2021",
    title: "Structure replaced playlists",
    body: "Ad-hoc recordings gave way to the Course → Module → Topic → Video model. Learners could finally see the whole path, and completion stopped being a coin flip.",
  },
  {
    year: "2023",
    title: "Readiness became measurable",
    body: "The AI mock interview launched. For the first time a learner could find out they were not ready from us, in private, instead of from a hiring panel.",
  },
  {
    year: "2025",
    title: "Three tracks, one standard",
    body: "Full Stack, Frontend and SAP — eight courses, verified certificates, and an evaluation rubric hiring teams could actually read.",
  },
  {
    year: "Today",
    title: "8,000 learners in",
    body: "The standard has not moved: nobody leaves with a certificate they cannot defend in an interview room.",
  },
];

// Scroll-drawn timeline. The rail fills as the section passes, and each
// milestone rises in once — deliberately restrained next to the hero, so the
// page has one showpiece rather than five competing ones.
export function AboutStory() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const railRef = useRef<HTMLSpanElement | null>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return;
    const { gsap } = getGsap();

    const ctx = gsap.context(() => {
      if (railRef.current) {
        gsap.fromTo(
          railRef.current,
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: {
              trigger: "[data-timeline]",
              start: "top 72%",
              end: "bottom 78%",
              scrub: 0.6,
            },
          }
        );
      }

      gsap.utils.toArray<HTMLElement>("[data-milestone]").forEach((item) => {
        gsap.from(item, {
          opacity: 0,
          y: 34,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
        const dot = item.querySelector("[data-milestone-dot]");
        if (dot) {
          gsap.from(dot, {
            scale: 0,
            duration: 0.6,
            ease: "back.out(2)",
            delay: 0.15,
            scrollTrigger: { trigger: item, start: "top 85%", once: true },
          });
        }
      });
    }, sectionRef.current);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    <section ref={sectionRef} className="relative bg-white">
      <div className="mx-auto max-w-[1280px] px-6 py-20 lg:px-16 lg:py-28">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-primary-blue" />
              <span className="text-label text-primary-blue">Our Story</span>
            </div>
            <h2 className="text-h2 mt-4 text-text-heading">
              Seven years of removing everything that wasn&apos;t proof
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-text-body">
              We did not start with a platform. We started with a room full of working
              professionals who needed a career change and had no way to tell whether they were
              close. Everything since has been built to answer that one question earlier.
            </p>
          </div>

          <ol data-timeline className="relative pl-10 sm:pl-12">
            {/* Rail: a static track with a gold fill drawn on scroll. */}
            <span
              aria-hidden
              className="absolute top-2 bottom-2 left-[11px] w-px bg-border sm:left-[15px]"
            />
            <span
              ref={railRef}
              aria-hidden
              className="absolute top-2 bottom-2 left-[11px] w-px origin-top scale-y-0 bg-gradient-to-b from-primary-blue to-[#E9B872] sm:left-[15px]"
            />

            {MILESTONES.map((milestone) => (
              <li
                key={milestone.year}
                data-milestone
                className="relative pb-10 last:pb-0 sm:pb-12"
              >
                <span
                  data-milestone-dot
                  aria-hidden
                  className="absolute top-1.5 -left-10 flex h-[23px] w-[23px] items-center justify-center rounded-full border border-border bg-white shadow-sm sm:-left-12 sm:h-[31px] sm:w-[31px]"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-primary-blue sm:h-2 sm:w-2" />
                </span>
                <span className="font-mono text-xs tracking-[0.18em] text-primary-blue">
                  {milestone.year}
                </span>
                <h3 className="mt-2 text-lg font-semibold text-text-heading sm:text-xl">
                  {milestone.title}
                </h3>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-text-body">
                  {milestone.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
