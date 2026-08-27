"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  ChevronRight,
  ShieldCheck,
  Zap,
  Lock,
  Mic,
  Flag,
} from "lucide-react";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const TRUST_PILLS = [
  { icon: ShieldCheck, title: "Enterprise", sub: "Calibrated" },
  { icon: Zap, title: "Sub-120ms", sub: "Latency" },
  { icon: Sparkles, title: "100%", sub: "Adaptive Logic" },
  { icon: Lock, title: "Privacy", sub: "First" },
];

export function AiMockHero() {
  const reducedMotion = useReducedMotion();

  // Pointer-driven 3D tilt for the centerpiece. Normalized cursor offsets
  // (-0.5..0.5) feed spring-smoothed rotations; the glass cards sit at
  // higher translateZ inside the same preserve-3d space, so the tilt
  // produces genuine depth parallax rather than a flat rotation.
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), {
    stiffness: 120,
    damping: 18,
    mass: 0.4,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), {
    stiffness: 120,
    damping: 18,
    mass: 0.4,
  });

  const handleTiltMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleTiltLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFF] via-[#FFFFFF] to-[#F1F5FD] pt-12 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle Studio Ambient Background Light & Perspective Floor Grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle at 70% 30%, rgba(56, 189, 248, 0.18), transparent 50%), radial-gradient(circle at 30% 60%, rgba(30, 94, 255, 0.12), transparent 50%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-[1360px] px-6 lg:px-12">
        {/* Main 2-Column Hero Grid */}
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Headline & Controls */}
          <div className="lg:col-span-5 flex flex-col items-start z-10">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3.5 py-1.5 backdrop-blur-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary-blue" />
              <span className="text-[11px] font-bold tracking-wider text-primary-blue uppercase">
                Adaptive AI Interview Suite
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="mt-6 text-4xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight text-slate-900 leading-[1.1]"
            >
              Practice interviews <br className="hidden sm:inline" />
              an{" "}
              <span className="text-primary-blue">AI actually</span>{" "}
              <span className="bg-gradient-to-r from-primary-blue to-indigo-600 bg-clip-text text-transparent">
                evaluates.
              </span>
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg"
            >
              Adaptive questions, real-time voice analysis, 5-dimensional competency scoring, and a
              personalized improvement roadmap generated the instant you finish.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <Link
                  href="/dashboard/ai-interview"
                  className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-primary-blue px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:shadow-blue-500/35 cursor-pointer"
                >
                  <span>Start AI Mock Interview</span>
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                    <ArrowRight className="h-3 w-3 text-white" />
                  </div>
                </Link>
              </MagneticButton>

              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/90 px-6 py-3.5 text-sm font-semibold text-slate-800 shadow-xs backdrop-blur-sm transition-all hover:bg-slate-50 hover:border-slate-300"
              >
                <span>Browse Career Tracks</span>
                <ChevronRight className="h-4 w-4 text-slate-500" />
              </Link>
            </motion.div>

            {/* Trust Pill Strip (4 items) */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full max-w-xl"
            >
              {TRUST_PILLS.map((pill) => {
                const Icon = pill.icon;
                return (
                  <div
                    key={pill.title}
                    className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white/70 p-2.5 shadow-xs backdrop-blur-sm"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-primary-blue">
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="leading-tight">
                      <div className="text-[11px] font-bold text-slate-800">{pill.title}</div>
                      <div className="text-[10px] text-slate-500">{pill.sub}</div>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: 3D Character Centerpiece & Floating Glass Widgets */}
          <div
            className="lg:col-span-7 relative h-[460px] sm:h-[540px] lg:h-[580px] w-full flex items-center justify-center"
            style={{ perspective: 1200 }}
            onPointerMove={reducedMotion ? undefined : handleTiltMove}
            onPointerLeave={reducedMotion ? undefined : handleTiltLeave}
          >
            <motion.div
              className="relative h-full w-full flex items-center justify-center"
              style={
                reducedMotion
                  ? undefined
                  : { rotateX, rotateY, transformStyle: "preserve-3d" }
              }
            >
              {/* Ambient glow behind the character */}
              <div
                className="pointer-events-none absolute left-1/2 top-1/2 h-[75%] w-[85%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
                style={{
                  background:
                    "radial-gradient(ellipse at center, rgba(30,94,255,0.14), rgba(56,189,248,0.08) 45%, transparent 70%)",
                }}
              />

              {/* Floating ambient dots */}
              {!reducedMotion &&
                [
                  { left: "6%", top: "18%", size: 10, delay: 0 },
                  { left: "88%", top: "10%", size: 8, delay: 1.2 },
                  { left: "12%", top: "72%", size: 12, delay: 0.6 },
                  { left: "92%", top: "62%", size: 9, delay: 1.8 },
                ].map((dot, i) => (
                  <motion.span
                    key={i}
                    className="pointer-events-none absolute rounded-full bg-primary-blue/20"
                    style={{ left: dot.left, top: dot.top, width: dot.size, height: dot.size }}
                    animate={{ y: [0, -14, 0], opacity: [0.4, 0.8, 0.4] }}
                    transition={{
                      duration: 5 + i,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: dot.delay,
                    }}
                  />
                ))}

              {/* 3D character illustration */}
              <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="relative z-10 flex h-full w-full items-center justify-center"
              >
                <motion.div
                  animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  className="relative flex h-full items-center justify-center"
                >
                  <Image
                    src="/ai-hero-character.webp"
                    width={660}
                    height={577}
                    unoptimized
                    alt="3D illustration of a JKS Learning candidate practicing an AI mock interview on a laptop"
                    preload
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 70vw, 620px"
                    className="h-auto max-h-[92%] w-auto max-w-full select-none object-contain"
                    draggable={false}
                  />
                  {/* Grounding shadow under the desk */}
                  <div
                    className="pointer-events-none absolute bottom-[4%] left-1/2 h-8 w-[70%] -translate-x-1/2 rounded-full opacity-50 blur-xl"
                    style={{ background: "rgba(11,31,58,0.25)" }}
                  />
                </motion.div>
              </motion.div>

            {/* 1. FLOATING GLASS CARD: TOP-LEFT "Real-time Voice Analysis" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={reducedMotion ? undefined : { z: 60 }}
              className="absolute -top-2 left-0 sm:left-4 z-20 w-48 sm:w-60 rounded-2xl border border-white/80 bg-white/85 p-3.5 sm:p-4 shadow-xl shadow-blue-500/10 backdrop-blur-xl"
            >
              <div className="text-xs font-bold text-slate-800">Real-time Voice Analysis</div>

              {/* Animated Audio Equalizer Waveform */}
              <div className="mt-3 flex h-9 items-center justify-center gap-1 px-1">
                {[12, 22, 16, 28, 34, 18, 26, 32, 14, 28, 20, 30, 24, 16, 26, 18, 10].map(
                  (h, i) => (
                    <motion.div
                      key={i}
                      className="w-1 rounded-full bg-gradient-to-t from-primary-blue to-cyan-400"
                      animate={{
                        height: [
                          h * 0.4,
                          Math.max(6, (h * (1 + Math.sin(i * 0.8))) % 34),
                          h * 0.6,
                          h * 0.4,
                        ],
                      }}
                      transition={{
                        duration: 1.2 + (i % 4) * 0.2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05,
                      }}
                    />
                  )
                )}
              </div>

              {/* Footer */}
              <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>02:45</span>
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-50 text-primary-blue">
                  <Mic className="h-3 w-3" />
                </div>
              </div>
            </motion.div>

            {/* 2. FLOATING GLASS CARD: TOP-RIGHT "Competency Score" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.4 }}
              style={reducedMotion ? undefined : { z: 50 }}
              className="absolute top-2 right-0 sm:right-2 z-20 w-56 sm:w-68 rounded-2xl border border-white/80 bg-white/85 p-3.5 sm:p-4 shadow-xl shadow-blue-500/10 backdrop-blur-xl"
            >
              <div className="text-xs font-bold text-slate-800">Competency Score</div>

              <div className="mt-3 flex items-center gap-4">
                {/* Circular Donut Ring */}
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
                  <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-100"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-primary-blue"
                      strokeDasharray="92, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-sm font-extrabold text-slate-900">92%</span>
                </div>

                {/* Legend List */}
                <div className="flex flex-col gap-1 text-[10px] text-slate-600 font-medium">
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                    <span>Communication</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                    <span>Problem Solving</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                    <span>Leadership</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                    <span>Domain Knowledge</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
                    <span>Adaptability</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3. FLOATING GLASS CARD: BOTTOM-RIGHT "Improvement Roadmap" */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5 }}
              style={reducedMotion ? undefined : { z: 70 }}
              className="absolute bottom-2 right-2 sm:right-6 z-20 w-48 sm:w-60 rounded-2xl border border-white/80 bg-white/85 p-3.5 sm:p-4 shadow-xl shadow-blue-500/10 backdrop-blur-xl"
            >
              <div className="text-xs font-bold text-slate-800">Improvement Roadmap</div>

              {/* Ascending Milestone Chart */}
              <div className="mt-3 relative h-16 w-full flex items-end">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 160 50">
                  {/* Grid Lines */}
                  <line x1="0" y1="45" x2="160" y2="45" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="25" x2="160" y2="25" stroke="#f1f5f9" strokeWidth="1" />

                  {/* Connected Polyline */}
                  <motion.path
                    d="M 10 38 L 45 30 L 80 34 L 115 18 L 145 10"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />

                  {/* Milestone Nodes */}
                  <circle cx="10" cy="38" r="3.5" fill="#3b82f6" />
                  <circle cx="45" cy="30" r="3.5" fill="#3b82f6" />
                  <circle cx="80" cy="34" r="3.5" fill="#3b82f6" />
                  <circle cx="115" cy="18" r="3.5" fill="#3b82f6" />
                  <circle cx="145" cy="10" r="4.5" fill="#2563eb" />
                </svg>

                {/* Goal Flag Pin */}
                <div className="absolute right-0 top-0 flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-primary-blue">
                  <Flag className="h-2.5 w-2.5" />
                </div>
              </div>
            </motion.div>
            </motion.div>
          </div>
        </div>

        {/* BOTTOM BRAND LOGOS STRIP */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="mt-14 sm:mt-18 rounded-2xl border border-slate-200/80 bg-white/90 px-6 py-5 shadow-sm backdrop-blur-md"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">
              Trusted by learners from
            </span>

            <div className="flex flex-wrap items-center justify-center md:justify-end gap-7 sm:gap-10 text-slate-700 font-bold opacity-80">
              <span className="text-base tracking-tight font-sans">Google</span>
              <span className="text-sm font-semibold tracking-normal flex items-center gap-1">
                <span className="grid grid-cols-2 gap-0.5 w-3 h-3">
                  <span className="bg-red-500" />
                  <span className="bg-green-500" />
                  <span className="bg-blue-500" />
                  <span className="bg-amber-500" />
                </span>
                Microsoft
              </span>
              <span className="text-base tracking-tighter lowercase font-serif font-extrabold">
                amazon
              </span>
              <span className="text-sm tracking-normal font-sans font-bold">
                Deloitte<span className="text-green-600">.</span>
              </span>
              <span className="text-sm tracking-tight font-sans font-bold text-blue-600">
                Infosys
              </span>
              <span className="text-sm tracking-widest font-mono font-extrabold">TATA</span>
              <span className="text-sm tracking-tight lowercase font-sans font-bold">
                accenture
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
