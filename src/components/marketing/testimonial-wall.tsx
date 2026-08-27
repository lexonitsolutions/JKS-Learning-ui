"use client";

import { Quote } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { Badge } from "@/components/ui/badge";
import { useMediaQuery } from "@/lib/motion/use-media-query";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import type { Testimonial } from "@/lib/data/testimonials";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="w-64 shrink-0 rounded-lg border border-border bg-white p-5 shadow-sm">
      <Quote className="h-4 w-4 text-primary-blue/40" />
      <blockquote className="mt-3 line-clamp-4 text-sm text-text-body">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="mt-4 flex items-center gap-3 border-t border-border pt-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-blue text-body-sm font-semibold text-white">
          {initials(testimonial.name)}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-heading">
            {testimonial.name}
          </div>
          <div className="truncate text-body-sm text-text-body">{testimonial.role}</div>
        </div>
        <Badge variant="primary" className="ml-auto shrink-0">
          {testimonial.track}
        </Badge>
      </figcaption>
    </figure>
  );
}

// A "wall of feedback" — continuously scrolling columns of real student
// quotes, viewed through a subtle 3D perspective tilt on desktop. Degrades
// to a single flat horizontal marquee row below md (a fixed-width column
// layout can never fit every phone width; a horizontal row scrolls instead
// of needing to fit, so it's robust at any viewport size down to the
// smallest phones), and to a plain static grid under prefers-reduced-motion
// (PHASE 10/11: intentional mobile + accessibility behavior, not a
// scaled-down copy of the desktop version).
export function TestimonialWall({ testimonials }: { testimonials: Testimonial[] }) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reducedMotion = useReducedMotion();

  const columns = [
    testimonials,
    [...testimonials].reverse(),
    testimonials,
    [...testimonials].reverse(),
  ];

  if (reducedMotion) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {testimonials.slice(0, 6).map((t) => (
          <TestimonialCard key={t.name} testimonial={t} />
        ))}
      </div>
    );
  }

  if (!isDesktop) {
    return (
      <div className="relative overflow-hidden rounded-lg border border-border bg-bg-light py-6">
        <Marquee pauseOnHover repeat={2} className="[--duration:32s]">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} testimonial={t} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-bg-light to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-bg-light to-transparent" />
      </div>
    );
  }

  return (
    <div
      aria-label="Student testimonials"
      className="relative flex h-[420px] w-full items-center justify-center overflow-hidden rounded-lg border border-border bg-bg-light [perspective:300px]"
    >
      <div
        className="flex flex-row items-center gap-4"
        style={{
          transform:
            "translateX(-40px) translateY(0px) translateZ(-100px) rotateX(20deg) rotateY(-10deg) rotateZ(20deg)",
        }}
      >
        {columns.map((columnData, i) => (
          <Marquee
            key={i}
            vertical
            pauseOnHover
            reverse={i % 2 === 1}
            repeat={3}
            className="[--duration:40s]"
          >
            {columnData.map((t) => (
              <TestimonialCard key={`${i}-${t.name}`} testimonial={t} />
            ))}
          </Marquee>
        ))}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-bg-light" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-bg-light" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-bg-light" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-bg-light" />
      </div>
    </div>
  );
}
