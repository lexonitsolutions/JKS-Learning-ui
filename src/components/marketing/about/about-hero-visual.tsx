"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion as useFramerReducedMotion } from "framer-motion";
import { Sparkles, Activity } from "lucide-react";

import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

/**
 * The About hero's 3D scene.
 *
 * The artwork is a pre-rendered 3D illustration, not a live WebGL scene. That
 * is a deliberate call: the reference render (robot, laptop UI, chat bubble,
 * plants, depth-of-field) would take a heavy GLTF payload and real lighting
 * work to approximate in three.js, and it would still not match. Rendering the
 * render and animating it in the compositor gives an identical picture, ships
 * ~116 KB instead of several MB, costs no GPU on a phone, and cannot drop
 * frames on mid-range Android.
 *
 * The motion is built from four independent layers so it reads as depth rather
 * than a moving picture:
 *   1. a slow vertical float on the whole scene
 *   2. pointer parallax, with the art and the accents moving at different rates
 *   3. a breathing ambient glow behind the art
 *   4. live UI accents (status pill, telemetry chip, orbiting sparks)
 *
 * The accents sit where the baked artwork has empty space, so nothing in the
 * render is duplicated or occluded.
 */

/** Pointer travel in px at the extremes. Small — this is depth, not swagger. */
const PARALLAX_ART = 14;
const PARALLAX_NEAR = 26;
const PARALLAX_FAR = 8;

export function AboutHeroVisual() {
  const reducedMotion = useReducedMotion();
  const framerReduced = useFramerReducedMotion();
  const still = reducedMotion || framerReduced;

  const wrapRef = useRef<HTMLDivElement>(null);
  const frame = useRef<number | null>(null);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });

  // Pointer parallax. Coarse pointers (touch) never fire this, so phones get
  // the float and glow but no jitter from scroll-induced pointer events.
  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (still || event.pointerType !== "mouse") return;
      const el = wrapRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      // -1..1 from the centre of the visual.
      const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

      if (frame.current !== null) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => setPointer({ x, y }));
    },
    [still],
  );

  const resetPointer = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    setPointer({ x: 0, y: 0 });
  }, []);

  useEffect(() => {
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, []);

  const shift = (depth: number) => ({
    x: pointer.x * depth,
    y: pointer.y * depth,
  });

  return (
    <div
      ref={wrapRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      className="relative mx-auto w-full max-w-[560px] lg:max-w-none [perspective:1400px]"
    >
      {/* Ambient glow — breathes behind the art so the scene never sits flat
          on the page background. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[85%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(37,99,235,0.16),rgba(34,211,238,0.08)_45%,transparent_70%)] blur-2xl"
        animate={still ? undefined : { scale: [1, 1.07, 1], opacity: [0.75, 1, 0.75] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* The scene itself: slow float + pointer parallax. */}
      <motion.div
        className="relative"
        animate={still ? undefined : { y: [0, -14, 0] }}
        transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <motion.div
          animate={shift(PARALLAX_ART)}
          transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.6 }}
          /* The render carries its own pale-blue ground. Feathering the outer
             few percent dissolves the rectangle edge into the page instead of
             showing a visible seam against bg-bg-light. */
          style={{
            WebkitMaskImage:
              "radial-gradient(ellipse 78% 78% at 50% 48%, #000 62%, transparent 97%)",
            maskImage:
              "radial-gradient(ellipse 78% 78% at 50% 48%, #000 62%, transparent 97%)",
          }}
        >
          <Image
            src="/images/about-hero-3d.webp"
            alt="JKS Learning AI assistant presenting a student's learning dashboard on a laptop"
            width={1536}
            height={1132}
            priority
            unoptimized
            sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 46vw"
            className="h-auto w-full select-none"
          />
        </motion.div>

        {/* ---- live accents ---------------------------------------------- */}
        {/* Placed over empty regions of the render. Hidden below sm so they
            never crowd the art on a phone. */}

        {/* Top-left: live status. Moves fastest — reads as nearest. */}
        <motion.div
          animate={shift(PARALLAX_NEAR)}
          transition={{ type: "spring", stiffness: 110, damping: 16 }}
          className="absolute left-[1%] top-[26%] hidden sm:block"
        >
          <motion.div
            animate={still ? undefined : { y: [0, -8, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
            className="flex items-center gap-2 rounded-full border border-blue-200/80 dark:border-blue-800/80 bg-white/85 dark:bg-[#111827]/90 px-3 py-1.5 shadow-[0_8px_28px_-10px_rgba(37,99,235,0.45)] dark:shadow-black/40 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              {!still && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
              )}
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-slate-700 dark:text-slate-200">
              AI Tutor Online
            </span>
          </motion.div>
        </motion.div>

        {/* Bottom-right: telemetry. Slowest — reads as furthest. */}
        <motion.div
          animate={shift(PARALLAX_FAR)}
          transition={{ type: "spring", stiffness: 70, damping: 20 }}
          className="absolute bottom-[12%] right-[0%] hidden sm:block"
        >
          <motion.div
            animate={still ? undefined : { y: [0, 9, 0] }}
            transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.1 }}
            className="rounded-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/85 dark:bg-[#111827]/90 px-3.5 py-2.5 shadow-[0_10px_30px_-12px_rgba(15,23,42,0.35)] dark:shadow-black/40 backdrop-blur-md"
          >
            <div className="flex items-center gap-1.5">
              <Activity className="h-3 w-3 text-primary-blue dark:text-blue-400" />
              <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">
                Readiness
              </span>
            </div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-mono text-lg font-black leading-none text-text-heading dark:text-white tabular-nums">
                92
              </span>
              <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">+6</span>
            </div>
            {/* Fills once on mount, then holds — a bar that loops forever reads
                as decoration rather than data. */}
            <div className="mt-1.5 h-1 w-20 overflow-hidden rounded-full bg-slate-200/90 dark:bg-slate-800">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary-blue to-cyan-400"
                initial={still ? { width: "92%" } : { width: 0 }}
                animate={{ width: "92%" }}
                transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Top-right spark, tucked beside the chat bubble. */}
        <motion.div
          animate={shift(PARALLAX_NEAR * 0.7)}
          transition={{ type: "spring", stiffness: 100, damping: 17 }}
          className="absolute right-[6%] top-[6%] hidden md:block"
        >
          <motion.div
            animate={still ? undefined : { y: [0, -10, 0], rotate: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-200 dark:border-cyan-800/80 bg-white/85 dark:bg-[#111827]/90 shadow-[0_8px_24px_-10px_rgba(34,211,238,0.6)] dark:shadow-black/40 backdrop-blur-md"
          >
            <Sparkles className="h-4 w-4 text-cyan-500 dark:text-cyan-400" />
          </motion.div>
        </motion.div>

        {/* Orbiting dots: cheap parallax cue, transform-only so they stay on
            the compositor. */}
        {!still && (
          <>
            <motion.span
              aria-hidden
              className="absolute left-[12%] top-[14%] h-1.5 w-1.5 rounded-full bg-primary-blue/60"
              animate={{ y: [0, -18, 0], opacity: [0.3, 0.9, 0.3] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.span
              aria-hidden
              className="absolute right-[16%] bottom-[30%] h-2 w-2 rounded-full bg-cyan-400/50"
              animate={{ y: [0, 16, 0], opacity: [0.25, 0.8, 0.25] }}
              transition={{ duration: 5.2, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
            />
            <motion.span
              aria-hidden
              className="absolute left-[46%] top-[2%] h-1 w-1 rounded-full bg-indigo-400/60"
              animate={{ y: [0, -12, 0], opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
            />
          </>
        )}
      </motion.div>
    </div>
  );
}
