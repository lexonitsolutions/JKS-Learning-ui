"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  PlayCircle,
  Flame,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  Tag,
  ChevronLeft,
  ChevronRight,
  Gift,
  Clock,
  ExternalLink,
  Crown,
  Volume2,
  Star,
  BookOpen,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  useStudentOwnedCourses,
  enrollStudentCourse,
} from "@/lib/data/courses-store";
import { EXTENDED_CATALOG, type CatalogCourse } from "@/app/(student)/dashboard/courses/page";

// Promotional Offers & Discounts Carousel Data (JKS Official Branding)
const OFFERS = [
  {
    id: "offer-1",
    tag: "Monsoon Flash Sale",
    badge: "50% OFF",
    title: "Enterprise Full Stack & Cloud Mastery",
    subtitle: "Comprehensive Spring Boot 3, Microservices & AWS Cloud Deployment track.",
    discountCode: "JKS50",
    expiresIn: "Limited Time Offer",
    ctaText: "Claim 50% Discount",
    ctaLink: "/dashboard/courses",
    bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
    accentColor: "#38BDF8",
  },
  {
    id: "offer-2",
    tag: "New Launch Special",
    badge: "FLAT 40% OFF",
    title: "JKS Generative AI & Agentic Architecture",
    subtitle: "Build production RAG pipelines, LLM fine-tuning & autonomous AI subagents.",
    discountCode: "GENAI40",
    expiresIn: "Valid for Next 48 Hours",
    ctaText: "Unlock AI Course",
    ctaLink: "/dashboard/courses",
    bgGradient: "from-purple-900 via-indigo-900 to-blue-900",
    accentColor: "#C084FC",
  },
  {
    id: "offer-3",
    tag: "Bundle Deal",
    badge: "BUY 1 GET 1",
    title: "JKS Frontend System Design & DSA Pro Bundle",
    subtitle: "Crack Tier-1 Tech Interviews with JKS DSA + Enterprise System Design Mastery.",
    discountCode: "B1G1TECH",
    expiresIn: "Special Weekend Deal",
    ctaText: "Explore Bundle Deals",
    ctaLink: "/dashboard/courses",
    bgGradient: "from-amber-600 via-orange-600 to-rose-700",
    accentColor: "#FDE047",
  },
  {
    id: "offer-4",
    tag: "Student Referral",
    badge: "₹2,000 CASHBACK",
    title: "Invite Friends & Learn Together",
    subtitle: "Earn ₹2,000 instant wallet credit + 1 Free Pro Certification for every referral.",
    discountCode: "REFER2000",
    expiresIn: "Unlimited Invites",
    ctaText: "Invite & Earn Now",
    ctaLink: "/dashboard/profile",
    bgGradient: "from-emerald-700 via-teal-700 to-cyan-800",
    accentColor: "#6EE7B7",
  },
];

export default function StudentDashboardPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [enrolledToast, setEnrolledToast] = useState<string | null>(null);

  const ownedCourses = useStudentOwnedCourses();
  const ownedSlugs = useMemo(() => ownedCourses.map((c) => c.slug), [ownedCourses]);

  // Latest non-enrolled courses for discovery
  const latestNonEnrolledCourses = useMemo(() => {
    const nonEnrolled = EXTENDED_CATALOG.filter(
      (c) => !c.isBundle && !ownedSlugs.includes(c.slug)
    );
    // Return the latest 4 available non-enrolled courses
    return nonEnrolled.slice(0, 4);
  }, [ownedSlugs]);

  // Auto-play slideshow every 5 seconds (pauses when user hovers)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % OFFERS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const activeOffer = OFFERS[currentSlide];

  const handleQuickEnroll = (course: CatalogCourse) => {
    enrollStudentCourse(course.slug);
    setEnrolledToast(`Enrolled in ${course.title}!`);
    setTimeout(() => setEnrolledToast(null), 3000);
  };

  return (
    <>
      <DashboardTopbar
        title="Welcome back, Jordan 👋"
        subtitle="Let's keep the momentum going."
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Success Toast */}
        {enrolledToast && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-xs font-bold text-emerald-800 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{enrolledToast}</span>
          </div>
        )}

        {/* Top Hero Banner: Interactive Offers & Discounts Slideshow on Left + 3D Illustration on Right */}
        <Reveal variant="fade-up">
          <div
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            className="relative overflow-hidden rounded-[24px] border border-white/80 bg-gradient-to-r from-white via-white to-blue-50/40 p-5 sm:p-7 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl"
          >
            {/* Ambient Background Radial Glow */}
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full opacity-60"
              style={{ background: "radial-gradient(circle, rgba(37,99,235,0.15), transparent 70%)" }}
            />

            <div className="relative grid grid-cols-1 items-center gap-6 sm:gap-8 lg:grid-cols-12">
              {/* Left Column: Advertisement & Offer Slideshow with Slide Animations */}
              <div className="lg:col-span-7 flex flex-col justify-between min-h-[260px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeOffer.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.45, ease: "easeOut" }}
                    className="flex flex-col justify-between flex-1"
                  >
                    <div>
                      {/* Top Badges Row */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-amber-600">
                          <Flame className="h-3 w-3 fill-amber-500" /> {activeOffer.tag}
                        </span>
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 px-2.5 py-0.5 text-xs font-bold text-[#2563EB]">
                          <Tag className="h-3 w-3" /> {activeOffer.badge}
                        </span>
                      </div>

                      {/* Offer Headline */}
                      <h2 className="mt-3 text-xl sm:text-2xl lg:text-[26px] font-black tracking-tight text-slate-900 leading-tight">
                        {activeOffer.title}
                      </h2>

                      {/* Offer Subtitle */}
                      <p className="mt-2 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-lg">
                        {activeOffer.subtitle}
                      </p>

                      {/* Coupon Code Strip */}
                      <div className="mt-3.5 flex items-center gap-2.5">
                        <div className="inline-flex items-center gap-1.5 rounded-xl border border-dashed border-[#2563EB] bg-blue-50/70 px-3 py-1.5 text-xs font-bold text-[#2563EB]">
                          <span>Use Coupon:</span>
                          <span className="font-black text-slate-900 tracking-wider select-all bg-white px-2 py-0.5 rounded shadow-xs">
                            {activeOffer.discountCode}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                          <Clock className="h-3 w-3" /> {activeOffer.expiresIn}
                        </span>
                      </div>
                    </div>

                    {/* CTA Actions and Slide Indicator Controls */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 pt-1">
                      <div className="flex items-center gap-3">
                        <Link
                          href={activeOffer.ctaLink}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_16px_rgba(37,99,235,0.3)] transition-all hover:bg-blue-700 hover:scale-[1.02]"
                        >
                          <Gift className="h-4 w-4" /> {activeOffer.ctaText}
                        </Link>
                        <Link
                          href="/dashboard/courses"
                          className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-700 transition-all hover:bg-slate-50"
                        >
                          <span>Explore All</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      </div>

                      {/* Slideshow Navigation Controls */}
                      <div className="flex items-center gap-2">
                        {/* Dot Indicators */}
                        <div className="flex items-center gap-1.5 mr-1">
                          {OFFERS.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setCurrentSlide(idx)}
                              aria-label={`Slide ${idx + 1}`}
                              className={`h-2 rounded-full transition-all duration-300 ${
                                currentSlide === idx
                                  ? "w-6 bg-[#2563EB]"
                                  : "w-2 bg-slate-200 hover:bg-slate-300"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Prev / Next Buttons */}
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSlide((prev) => (prev === 0 ? OFFERS.length - 1 : prev - 1))
                          }
                          aria-label="Previous Offer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setCurrentSlide((prev) => (prev + 1) % OFFERS.length)
                          }
                          aria-label="Next Offer"
                          className="flex h-7 w-7 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Right Column: 3D Student Developer Side Illustration */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="relative h-56 sm:h-64 w-full max-w-sm flex items-center justify-center">
                  {/* Floating 3D Character */}
                  <motion.div
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                    className="relative z-10 flex h-full w-full items-center justify-center"
                  >
                    <Image
                      src="/images/student-3d-developer.png"
                      alt="3D Student Developer practicing skills"
                      width={380}
                      height={320}
                      unoptimized
                      className="h-auto max-h-full w-auto object-contain select-none"
                      priority
                    />
                    {/* Natural subtle soft grounding shadow under desk */}
                    <div
                      className="pointer-events-none absolute bottom-1 left-1/2 h-3 w-[70%] -translate-x-1/2 rounded-full opacity-30 blur-md"
                      style={{ background: "rgba(11,31,58,0.2)" }}
                    />
                  </motion.div>

                  {/* Floating Glass Badge 1: Progress */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute -top-1 right-0 sm:right-2 z-20 rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 shadow-lg shadow-blue-500/10 backdrop-blur-md text-[11px] font-bold text-slate-800"
                  >
                    <div className="flex items-center gap-1.5 text-[#2563EB]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>62% Mastered</span>
                    </div>
                  </motion.div>

                  {/* Floating Glass Badge 2: Streak */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute bottom-2 left-0 sm:left-2 z-20 rounded-xl border border-white/80 bg-white/90 px-3 py-1.5 shadow-lg shadow-blue-500/10 backdrop-blur-md text-[11px] font-bold text-slate-800"
                  >
                    <div className="flex items-center gap-1.5 text-amber-500">
                      <Flame className="h-3.5 w-3.5 fill-amber-500" />
                      <span>12-Day Streak</span>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Latest Courses Section (Shows New Available Courses Matching Catalog Cards) */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Latest Courses</h3>
              <p className="text-xs text-slate-500">Explore newly added industry tracks and certifications</p>
            </div>
            <Link
              href="/dashboard/courses"
              className="flex items-center gap-1 text-xs font-bold text-[#2563EB] hover:underline"
            >
              <span>View all</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Reveal variant="stagger" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {latestNonEnrolledCourses.map((course) => (
              <TiltCard key={course.id} className="h-full">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                  {/* Card Thumbnail / Header Banner */}
                  <div
                    className={`relative flex h-44 w-full flex-col items-center justify-center p-4 text-center overflow-hidden ${course.thumbnailBg}`}
                  >
                    {/* Background Pattern */}
                    <div
                      className="absolute inset-0 opacity-15"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 50% 50%, white 1px, transparent 1px)",
                        backgroundSize: "14px 14px",
                      }}
                    />

                    {/* Thumbnail Artwork / Text Graphic */}
                    <div className="relative z-10 space-y-1">
                      <div className="text-[14px] font-black tracking-widest text-slate-200 uppercase">
                        {course.bannerTitle}
                      </div>
                      <div
                        className={`text-2xl font-black tracking-wider uppercase bg-gradient-to-r ${
                          course.gradientText || "from-blue-400 to-cyan-400"
                        } bg-clip-text text-transparent drop-shadow-sm`}
                      >
                        {course.bannerSubtitle || course.title}
                      </div>
                      <div className="text-[9px] font-bold text-slate-400 tracking-wider">
                        MASTER SKILLS • JKS LEARNING
                      </div>
                    </div>

                    {/* JKS Certified Badge */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-md text-[9px] font-medium text-slate-300">
                      <span>JKS Certified</span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div>
                      {/* Title */}
                      <h3 className="text-[14px] font-extrabold text-slate-900 leading-snug line-clamp-1">
                        {course.title}
                      </h3>

                      {/* Tag Badges Strip */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px] font-bold">
                        {course.isPremium ? (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 font-black uppercase text-[#2563EB] border border-blue-200">
                            <Crown className="h-3 w-3 fill-[#2563EB] text-[#2563EB]" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-cyan-50 px-2 py-0.5 font-black uppercase text-cyan-700 border border-cyan-200">
                            FREE
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                          <Volume2 className="h-3 w-3 text-slate-400" />
                          {course.language}
                        </span>

                        <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {course.rating}
                        </span>
                      </div>

                      {/* Summary Tagline */}
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {course.tagline}
                      </p>
                    </div>

                    {/* Bottom CTA Button: JKS Brand Blue UI Color */}
                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => handleQuickEnroll(course)}
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white py-2.5 px-4 text-xs font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                      >
                        <span>Enroll Now</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        </div>

        {/* AI Mock Interview CTA Banner with 3D Waveform & Live Readiness Check */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[24px] border border-slate-800 bg-[#0B1F3A] p-6 text-white shadow-xl sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div
              className="pointer-events-none absolute -top-12 right-20 h-48 w-48 rounded-full opacity-40"
              style={{ background: "radial-gradient(circle, rgba(56,189,248,0.3), transparent 70%)" }}
            />
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-cyan-400">
                <Zap className="h-3 w-3" /> AI Mock Interview
              </span>
              <h3 className="mt-1.5 text-xl font-bold text-white tracking-tight">
                Ready for another readiness check?
              </h3>
              <p className="mt-1 text-sm text-slate-300">
                Your last score was <span className="font-bold text-cyan-400">78/100</span> — try a
                scenario-based interview to push higher.
              </p>
            </div>
            <Link
              href="/dashboard/ai-interview"
              className="relative z-10 inline-flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-600 hover:scale-[1.02] sm:shrink-0"
            >
              Start Interview <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </Reveal>
      </div>
    </>
  );
}
