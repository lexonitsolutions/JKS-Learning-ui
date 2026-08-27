import * as React from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps extends React.ComponentPropsWithoutRef<"div"> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: React.ReactNode;
  vertical?: boolean;
  repeat?: number;
  ariaLabel?: string;
}

// Continuous scrolling marquee, driven by pure CSS animation (see the
// `animate-marquee(-vertical)` keyframes in globals.css) rather than a
// scroll-linked tween — this one auto-plays and pauses on hover, so it
// reads as a living "wall" rather than a one-time reveal. Disabled under
// prefers-reduced-motion via the `motion-reduce:` variant below.
export function Marquee({
  className,
  reverse = false,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  ariaLabel,
  ...props
}: MarqueeProps) {
  return (
    <div
      {...props}
      data-slot="marquee"
      role="group"
      aria-label={ariaLabel}
      className={cn(
        "group flex overflow-hidden p-2 [--duration:40s] [--gap:1rem] [gap:var(--gap)]",
        vertical ? "flex-col" : "flex-row",
        className
      )}
    >
      {Array.from({ length: repeat }, (_, i) => (
        <div
          key={i}
          aria-hidden={i > 0}
          className={cn(
            "flex shrink-0 justify-around [gap:var(--gap)]",
            vertical ? "animate-marquee-vertical flex-col" : "animate-marquee flex-row",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
            reverse && "[animation-direction:reverse]",
            "motion-reduce:animate-none"
          )}
        >
          {children}
        </div>
      ))}
    </div>
  );
}
