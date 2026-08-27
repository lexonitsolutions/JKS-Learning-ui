"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, BrainCircuit, Users, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

export function InteractiveHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const characterRef = useRef<HTMLDivElement>(null);
  const badgeLeftRef = useRef<HTMLDivElement>(null);
  const badgeRightRef = useRef<HTMLDivElement>(null);
  const badgeBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Initialize smooth scrolling with Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const ticker = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(ticker);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      // 1. Initial Landing entrance: character slides up from bottom
      if (characterRef.current) {
        gsap.fromTo(
          characterRef.current,
          { y: 90, opacity: 0, scale: 0.95 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: "power3.out", delay: 0.2 }
        );
      }

      // Initial badges pop in
      if (badgeLeftRef.current && badgeRightRef.current && badgeBottomRef.current) {
        gsap.fromTo(
          [badgeLeftRef.current, badgeRightRef.current, badgeBottomRef.current],
          { y: 40, opacity: 0, scale: 0.88 },
          { y: 0, opacity: 1, scale: 1, duration: 0.9, stagger: 0.15, ease: "back.out(1.4)", delay: 0.5 }
        );
      }

      // 2. Scroll-linked motion: Character shifts towards the right and downward
      if (containerRef.current && characterRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom 20%",
            scrub: 1.2,
          },
        });

        // Move character to bottom-right smoothly on scroll
        tl.to(
          characterRef.current,
          {
            xPercent: 28,
            yPercent: 36,
            scale: 0.92,
            rotate: 2,
            ease: "power1.inOut",
          },
          0
        );

        // Parallax badges dispersion
        if (badgeLeftRef.current) {
          tl.to(badgeLeftRef.current, { x: -35, y: 50, opacity: 0.4, ease: "none" }, 0);
        }
        if (badgeRightRef.current) {
          tl.to(badgeRightRef.current, { x: 50, y: 70, opacity: 0.4, ease: "none" }, 0);
        }
        if (badgeBottomRef.current) {
          tl.to(badgeBottomRef.current, { x: -20, y: 60, opacity: 0.3, ease: "none" }, 0);
        }
      }
    }, containerRef);

    return () => {
      ctx.revert();
      ScrollTrigger.getAll().forEach((st) => st.kill());
      gsap.ticker.remove(ticker);
      lenis.destroy();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[92vh] sm:min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#FAFBFD] via-[#F4F7FC] to-[#EDF2FA] text-slate-900 flex flex-col justify-between pt-8 sm:pt-14 pb-0"
    >
      {/* Ambient Brand Blue & Cyan Glow Orbs */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 h-[450px] w-[750px] -translate-x-1/2 rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(30, 94, 255, 0.22) 0%, rgba(56, 189, 248, 0.18) 40%, rgba(37, 99, 235, 0.08) 70%, transparent 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute top-40 -left-20 h-72 w-72 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(30, 94, 255, 0.25), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute top-32 -right-20 h-80 w-80 rounded-full opacity-40 blur-2xl"
        style={{ background: "radial-gradient(circle, rgba(6, 182, 212, 0.25), transparent 70%)" }}
      />

      {/* Hero Header Text Content */}
      <div className="relative z-20 mx-auto max-w-5xl px-4 sm:px-6 text-center">
        {/* Eyebrow Pill with JKS Brand Blue */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200/90 bg-white/90 px-4 py-1.5 text-xs font-semibold text-[#1E5EFF] shadow-[0_2px_12px_rgba(30,94,255,0.08)] backdrop-blur-md"
        >
          <Sparkles className="h-3.5 w-3.5 fill-[#1E5EFF] text-[#1E5EFF]" />
          <span>Anti-Skip Enforced · AI Interview Ready · Verified Credentials</span>
        </motion.div>

        {/* Large Editorial Headline using JKS Brand Colors */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="mt-5 text-3xl sm:text-5xl lg:text-[62px] font-extrabold tracking-tight text-slate-900 leading-[1.12]"
        >
          Career-Ready IT Mastery{" "}
          <span className="font-serif italic font-normal bg-gradient-to-r from-[#1E5EFF] via-[#2563EB] to-cyan-500 bg-clip-text text-transparent">
            Trained On Real Projects
          </span>{" "}
          & AI Mocks
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="mx-auto mt-4 sm:mt-5 max-w-2xl text-xs sm:text-base font-normal text-slate-600 leading-relaxed"
        >
          Step-by-step Full Stack (Java, .NET, Frontend), Cloud &amp; SAP engineering. Anti-skip video protection ensures authentic completion, verified project milestones, and adaptive AI mock interviews that lead to tier-1 job offers.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/courses"
            className="group relative inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] px-6 py-3.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_20px_rgba(30,94,255,0.35)] transition-all hover:bg-blue-700 hover:scale-[1.02] hover:shadow-[0_6px_24px_rgba(30,94,255,0.45)]"
          >
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>

          <Link
            href="/ai-mock-interview"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200/90 bg-white/90 px-5 py-3.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-sm backdrop-blur-md transition-all hover:bg-slate-50 hover:text-slate-900"
          >
            <BrainCircuit className="h-4 w-4 text-[#1E5EFF]" />
            <span>Practice AI Mock</span>
          </Link>
        </motion.div>
      </div>

      {/* 3D Perspective Ground Grid Floor & Character Stage */}
      <div className="relative z-10 mx-auto mt-6 sm:mt-8 w-full max-w-5xl flex-1 flex flex-col items-center justify-end px-4 overflow-visible">
        {/* 3D Perspective Grid Plane */}
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 h-[340px] sm:h-[460px] w-[130%] -translate-x-1/2 opacity-70"
          style={{
            transform: "perspective(600px) rotateX(60deg)",
            transformOrigin: "bottom center",
            backgroundImage: `
              linear-gradient(to right, rgba(30, 94, 255, 0.15) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(30, 94, 255, 0.15) 1px, transparent 1px)
            `,
            backgroundSize: "44px 44px",
            maskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, transparent 100%)",
          }}
        />

        {/* Character Stage with Live Floating Badges */}
        <div className="relative z-20 flex w-full max-w-2xl flex-col items-center justify-end">
          {/* Main Floating Character */}
          <div
            ref={characterRef}
            className="relative z-20 flex items-end justify-center will-change-transform"
          >
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Image
                src="/images/hero-developer.png"
                alt="JKS Learning Student Developer"
                width={480}
                height={520}
                priority
                unoptimized
                className="relative z-20 h-auto max-h-[380px] sm:max-h-[460px] w-auto object-contain drop-shadow-[0_20px_35px_rgba(15,23,42,0.18)]"
              />

              {/* Ground Shadow */}
              <div
                className="absolute -bottom-2 left-1/2 h-6 w-3/4 -translate-x-1/2 rounded-full opacity-40 blur-md"
                style={{ background: "radial-gradient(ellipse, rgba(15,23,42,0.6), transparent 70%)" }}
              />
            </motion.div>
          </div>

          {/* Floating Badge 1: Top-Left */}
          <div
            ref={badgeLeftRef}
            className="absolute top-12 sm:top-20 -left-2 sm:left-4 z-30 max-w-[190px] sm:max-w-[220px] rounded-2xl border border-white/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(30,50,90,0.12)] backdrop-blur-xl transition-transform hover:scale-105"
          >
            <div className="flex items-center justify-between text-[11px] font-bold text-slate-800">
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#1E5EFF]" /> 8,140+ Students
              </span>
            </div>
            <p className="mt-0.5 text-[10px] font-medium text-slate-500">Active enrollments this month</p>
            {/* Mini Progress Bar */}
            <div className="mt-2 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
              <div className="h-full w-[88%] rounded-full bg-gradient-to-r from-[#1E5EFF] to-cyan-500" />
            </div>
          </div>

          {/* Floating Badge 2: Right */}
          <div
            ref={badgeRightRef}
            className="absolute top-28 sm:top-36 -right-2 sm:right-2 z-30 max-w-[210px] sm:max-w-[250px] rounded-2xl border border-white/90 bg-white/95 p-3 sm:p-3.5 shadow-[0_12px_32px_rgba(30,50,90,0.12)] backdrop-blur-xl transition-transform hover:scale-105"
          >
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-50 font-bold text-[10px] text-[#1E5EFF]">
                DR
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-800">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Daniel (TCS)
                </div>
                <div className="text-[9px] font-semibold text-[#1E5EFF]">Tier-1 Frontend Placement</div>
              </div>
            </div>
            <p className="mt-1.5 text-[10px] text-slate-600 leading-snug">
              &quot;Cleared Google Tier-1 Mock Interview with 94% score! 🚀&quot;
            </p>
          </div>

          {/* Floating Badge 3: Bottom-Left */}
          <div
            ref={badgeBottomRef}
            className="absolute bottom-16 sm:bottom-24 -left-4 sm:left-0 z-30 rounded-2xl border border-white/90 bg-white/95 px-3.5 py-2.5 shadow-[0_12px_32px_rgba(30,50,90,0.12)] backdrop-blur-xl transition-transform hover:scale-105 hidden sm:block"
          >
            <div className="text-[10px] font-medium text-slate-500 flex items-center gap-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1E5EFF]"></span>
              </span>
              AI Interviews Completed
            </div>
            <div className="text-xs sm:text-sm font-extrabold text-slate-900 flex items-center gap-1 mt-0.5">
              <span>22,000+ Sessions</span>
              <Award className="h-3.5 w-3.5 text-[#1E5EFF]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
