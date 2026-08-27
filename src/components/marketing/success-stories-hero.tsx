"use client";

import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Trophy,
  TrendingUp,
  Users,
  UserRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { CountUpStat } from "@/components/marketing/count-up-stat";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const TRUST_METRICS = [
  { icon: Users, target: 8000, suffix: "+", sub: "Learners Trained" },
  { icon: Trophy, target: 94, suffix: "%", sub: "Offer Acceptance" },
  { icon: TrendingUp, target: 68, prefix: "+", suffix: "%", sub: "Avg. Salary Hike" },
  { icon: ShieldCheck, target: 100, suffix: "%", sub: "Verifiable Work" },
];

// Ascending diagnostic bars — height as % of chart area
const GROWTH_BARS = [14, 24, 34, 46, 58, 72, 86, 100];

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] },
  }),
};

/** Decorative isometric staircase rendered as a pure SVG (bottom-right). */
function Staircase({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 520 420"
      fill="none"
      aria-hidden
      className={className}
      preserveAspectRatio="xMaxYMax meet"
    >
      <defs>
        <linearGradient id="stair-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dbe7fd" />
          <stop offset="100%" stopColor="#c3d7fa" />
        </linearGradient>
        <linearGradient id="stair-side" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#b6cdf7" />
          <stop offset="100%" stopColor="#cbdcfa" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4].map((i) => {
        const stepW = 96;
        const stepH = 62;
        const x = 40 + i * stepW;
        const yTop = 420 - (i + 1) * stepH;
        return (
          <g key={i}>
            {/* top face */}
            <polygon
              points={`${x},${yTop} ${x + stepW + 34},${yTop - 26} ${x + stepW * 5},${yTop - 26} ${x + stepW * 5},${yTop} `}
              fill="#eef4ff"
            />
            {/* front face */}
            <rect x={x} y={yTop} width={520 - x} height={stepH} fill="url(#stair-front)" />
            {/* side sliver for depth */}
            <polygon
              points={`${x},${yTop} ${x + 34},${yTop - 26} ${x + 34},${yTop + stepH - 26} ${x},${yTop + stepH}`}
              fill="url(#stair-side)"
              opacity="0.55"
            />
          </g>
        );
      })}
    </svg>
  );
}

export function SuccessStoriesHero() {
  const reducedMotion = useReducedMotion();

  // Pointer-driven subtle 3D tilt for the outcome card
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), {
    stiffness: 120,
    damping: 18,
    mass: 0.4,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), {
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
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-[#eef4ff] to-[#dce9fc] pt-12 pb-16 lg:pt-20 lg:pb-20">
      {/* Soft ambient glows */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 15%, rgba(30,94,255,0.07), transparent 45%), radial-gradient(circle at 85% 60%, rgba(56,189,248,0.12), transparent 50%)",
        }}
      />

      {/* Decorative 3D staircase — bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute bottom-0 right-0 hidden lg:block w-[420px] xl:w-[520px]"
      >
        <motion.div
          animate={reducedMotion ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        >
          <Staircase className="w-full h-auto opacity-80" />
        </motion.div>
      </motion.div>

      <div className="relative z-10 mx-auto max-w-[1360px] px-6 lg:px-12">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-10">
          {/* ===== Left Column ===== */}
          <div className="lg:col-span-6 flex flex-col items-start">
            {/* Pill Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
              className="inline-flex items-center gap-2 rounded-full bg-primary-blue/10 px-4 py-2"
            >
              <BadgeCheck className="h-4 w-4 text-primary-blue" />
              <span className="text-[11px] font-bold tracking-[0.12em] text-primary-blue uppercase">
                Verified Career Outcomes
              </span>
            </motion.div>

            {/* Headline */}
            <h1 className="mt-6 text-[40px] sm:text-[52px] lg:text-[60px] font-extrabold tracking-tight leading-[1.08]">
              {[
                { text: "Real Engineers.", className: "text-slate-900" },
                { text: "Proven Placements.", className: "text-primary-blue" },
                { text: "Unstoppable Growth.", className: "text-slate-900" },
              ].map((line, i) => (
                <motion.span
                  key={line.text}
                  variants={fadeUp}
                  initial="hidden"
                  animate="visible"
                  custom={0.1 + i * 0.12}
                  className={`block ${line.className}`}
                >
                  {line.text}
                </motion.span>
              ))}
            </h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.5}
              className="mt-6 max-w-xl text-base sm:text-lg text-slate-600 leading-relaxed"
            >
              From non-tech backgrounds and support desks to Tier-1 product firms and global SAP
              consultancies. Explore how our curriculum and AI Mock Interview simulator paved the
              way.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0.65}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <MagneticButton>
                <a
                  href="#stories-explorer"
                  className={
                    buttonVariants({ size: "lg" }) +
                    " rounded-xl bg-primary-blue hover:bg-primary-blue/90 text-white font-semibold shadow-lg shadow-primary-blue/25"
                  }
                >
                  Explore Alumni Stories <ArrowRight className="h-4 w-4 ml-1.5" />
                </a>
              </MagneticButton>

              <MagneticButton>
                <Link
                  href="/dashboard/ai-interview"
                  className={
                    buttonVariants({ variant: "secondary", size: "lg" }) +
                    " rounded-xl border-transparent bg-white text-slate-900 font-semibold shadow-md shadow-slate-900/5 hover:bg-white hover:text-primary-blue hover:shadow-lg transition-shadow"
                  }
                >
                  Test Your Interview Readiness
                </Link>
              </MagneticButton>
            </motion.div>
          </div>

          {/* ===== Right Column: Outcome Card ===== */}
          <div className="lg:col-span-6 flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-[560px] [perspective:1200px]"
              onPointerMove={handleTiltMove}
              onPointerLeave={handleTiltLeave}
            >
              <motion.div
                animate={reducedMotion ? undefined : { y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <motion.div
                  style={{
                    rotateX: reducedMotion ? 0 : rotateX,
                    rotateY: reducedMotion ? 0 : rotateY,
                    transformStyle: "preserve-3d",
                  }}
                  className="relative flex flex-col gap-4 rounded-[28px] border border-white/70 bg-white/55 p-5 shadow-[0_24px_60px_-16px_rgba(11,31,58,0.18)] backdrop-blur-xl"
                >
                  {/* Card 1 — Placement profile */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.55 }}
                    style={{ transform: "translateZ(36px)" }}
                    className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary-blue to-cyan-500 text-white font-bold text-sm shadow-md">
                        PN
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[15px] font-bold text-slate-900">Priya Nair</span>
                          <BadgeCheck className="h-4 w-4 text-primary-blue fill-primary-blue/15" />
                        </div>
                        <p className="text-[13px] text-slate-500 font-medium">
                          SAP MM Consultant @ Deloitte
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="rounded-lg bg-primary-blue/10 px-2.5 py-1 text-[13px] font-bold text-primary-blue">
                        ₹16.5 LPA
                      </span>
                      <div className="text-[11px] font-medium text-slate-500 mt-1.5">+75% Hike</div>
                    </div>
                  </motion.div>

                  {/* Card 2 — AI Diagnostic Growth Chart */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    style={{ transform: "translateZ(24px)" }}
                    className="rounded-2xl bg-white p-5 pb-6 shadow-sm ring-1 ring-slate-900/[0.04] transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary-blue">
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                          <path
                            d="M2.5 6.5L5 9L9.5 3.5"
                            stroke="white"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </span>
                      <span className="text-sm font-bold text-slate-900">
                        AI Diagnostic Growth Rate
                      </span>
                    </div>

                    <div className="mt-5 flex items-end justify-between gap-4">
                      {/* Baseline */}
                      <div className="text-center shrink-0 pb-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-slate-800">
                          <CountUpStat target={58} duration={1.4} />
                        </div>
                        <div className="text-xs font-medium text-slate-500 mt-1">Baseline</div>
                      </div>

                      {/* Ascending bars */}
                      <div className="flex h-[120px] sm:h-[140px] flex-1 items-end justify-center gap-2 sm:gap-2.5 border-b border-slate-200 pb-0">
                        {GROWTH_BARS.map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{
                              duration: reducedMotion ? 0 : 0.7,
                              delay: reducedMotion ? 0 : 0.9 + i * 0.09,
                              ease: [0.22, 1, 0.36, 1],
                            }}
                            style={{
                              height: `${h}%`,
                              transformOrigin: "bottom",
                              background: `linear-gradient(to top, ${
                                ["#93c5fd", "#7cbcf9", "#60b6f0", "#4cb8e0", "#3fc2cd", "#38cdb8", "#33d6a6", "#2fdf9d"][i]
                              }, ${
                                ["#a8d1fd", "#8fc7fa", "#72c1f2", "#5cc3e4", "#4fcdd2", "#46d7bd", "#3fe0ab", "#39e8a2"][i]
                              })`,
                            }}
                            className="w-[9%] max-w-[34px] rounded-md"
                          />
                        ))}
                      </div>

                      {/* Interview Ready */}
                      <div className="text-center shrink-0 pb-1">
                        <div className="text-3xl sm:text-4xl font-extrabold text-emerald-500">
                          <CountUpStat target={91} duration={1.8} />
                        </div>
                        <div className="text-xs font-medium text-slate-500 mt-1 leading-tight">
                          Interview
                          <br />
                          Ready
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* Card 3 — Capstone Defense */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.85 }}
                    style={{ transform: "translateZ(42px)" }}
                    className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.04] transition-shadow hover:shadow-md"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-blue/10 text-primary-blue">
                        <UserRound className="h-5 w-5" />
                      </div>
                      <div>
                        <span className="text-sm font-bold text-slate-900 block">
                          Capstone Defense
                        </span>
                        <p className="text-[13px] text-slate-500 font-medium">
                          Distributed Payment Gateway
                        </p>
                      </div>
                    </div>
                    <span className="rounded-lg bg-primary-blue/10 px-3 py-1.5 text-[13px] font-bold text-primary-blue shrink-0">
                      Verified
                    </span>
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* ===== Bottom Trust Metrics Bar ===== */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-y-8 rounded-2xl bg-white/90 px-6 py-8 shadow-[0_12px_40px_-12px_rgba(11,31,58,0.12)] backdrop-blur-md lg:max-w-[920px]"
        >
          {TRUST_METRICS.map((metric, i) => (
            <div
              key={metric.sub}
              className={`flex flex-col items-center text-center ${
                i > 0 ? "lg:border-l lg:border-slate-200" : ""
              }`}
            >
              <div className="flex items-center gap-2.5">
                <metric.icon className="h-6 w-6 text-primary-blue shrink-0" />
                <span className="text-2xl sm:text-[28px] font-extrabold text-slate-900">
                  <CountUpStat target={metric.target} prefix={metric.prefix} suffix={metric.suffix} />
                </span>
              </div>
              <span className="mt-1.5 text-[13px] font-medium text-slate-500">{metric.sub}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
