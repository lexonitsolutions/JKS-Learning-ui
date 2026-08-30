"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Users,
  BookOpen,
  ClipboardList,
  Star,
  ChevronDown,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

/**
 * 3D Interactive Isometric Workstation Animation
 * Utilizing the provided 3D image with smooth pointer-driven 3D perspective tilt and floating animation.
 */
function Isometric3DWorkstation() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [10, -10]), {
    stiffness: 160,
    damping: 22,
    mass: 0.4,
  });
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), {
    stiffness: 160,
    damping: 22,
    mass: 0.4,
  });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handlePointerLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative w-full max-w-[360px] sm:max-w-[420px] lg:max-w-[460px] h-[220px] sm:h-[240px] lg:h-[260px] select-none [perspective:1200px] flex items-center justify-center shrink-0 cursor-pointer"
    >
      {/* Floating 3D Artwork Layer */}
      <motion.div
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-full h-full flex items-center justify-center"
      >
        {/* Soft Ambient Radial Glow Behind Artwork */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 sm:w-72 h-60 sm:h-72 bg-cyan-300/35 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Workstation Image */}
        <div className="relative w-full h-full flex items-center justify-center p-2">
          <Image
            src="/images/lecturer-workstation-3d.png"
            alt="Lecturer Command Center 3D Isometric Workstation"
            width={520}
            height={320}
            priority
            className="w-full h-auto max-h-[240px] object-contain drop-shadow-[0_20px_35px_rgba(15,23,42,0.35)] transition-transform duration-200"
          />
        </div>
      </motion.div>
    </div>
  );
}

/**
 * Interactive Curriculum Velocity & Performance Line/Spline Area Chart
 */
function VelocityPerformanceChart() {
  const [hoveredPoint, setHoveredPoint] = useState<{
    x: number;
    y: number;
    week: string;
    value: number;
  } | null>(null);

  // 5 Data points for Week 1 to Week 5 mapped to SVG viewBox 0 0 600 220
  const points = [
    { week: "Week 1", value: 16, x: 50, y: 185 },
    { week: "Week 2", value: 38, x: 175, y: 145 },
    { week: "Week 3", value: 68, x: 300, y: 85 },
    { week: "Week 4", value: 78, x: 425, y: 65 },
    { week: "Week 5", value: 92, x: 550, y: 35 },
  ];

  const splinePath =
    "M 50 185 C 100 185, 120 165, 175 145 C 230 125, 250 95, 300 85 C 350 75, 380 75, 425 65 C 480 55, 510 40, 550 35";
  const areaPath = `${splinePath} L 550 210 L 50 210 Z`;

  return (
    <div className="relative w-full h-[220px] select-none pt-2">
      <svg
        viewBox="0 0 600 220"
        className="w-full h-full overflow-visible"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563EB" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
        </defs>

        {/* Horizontal Dashed Grid Lines */}
        <line x1="35" y1="25" x2="580" y2="25" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="35" y1="70" x2="580" y2="70" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="35" y1="115" x2="580" y2="115" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="35" y1="160" x2="580" y2="160" stroke="#F1F5F9" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="35" y1="205" x2="580" y2="205" stroke="#F1F5F9" strokeWidth="1.5" />

        {/* Y-Axis Labels */}
        <text x="0" y="28" fill="#94A3B8" fontSize="11" fontWeight="500">100%</text>
        <text x="5" y="73" fill="#94A3B8" fontSize="11" fontWeight="500">75%</text>
        <text x="5" y="118" fill="#94A3B8" fontSize="11" fontWeight="500">50%</text>
        <text x="5" y="163" fill="#94A3B8" fontSize="11" fontWeight="500">25%</text>
        <text x="12" y="208" fill="#94A3B8" fontSize="11" fontWeight="500">0%</text>

        {/* Spline Area Fill */}
        <motion.path
          d={areaPath}
          fill="url(#areaGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Spline Stroke Line */}
        <motion.path
          d={splinePath}
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Waypoint Dots */}
        {points.map((pt, idx) => (
          <g key={idx} className="cursor-pointer">
            <circle
              cx={pt.x}
              cy={pt.y}
              r={hoveredPoint?.week === pt.week ? 7 : 4.5}
              fill="#2563EB"
              stroke="#FFFFFF"
              strokeWidth="2.5"
              className="transition-all duration-150"
              onMouseEnter={() => setHoveredPoint(pt)}
              onMouseLeave={() => setHoveredPoint(null)}
            />
          </g>
        ))}

        {/* X-Axis Labels */}
        <text x="40" y="235" fill="#94A3B8" fontSize="11" fontWeight="500">Week 1</text>
        <text x="160" y="235" fill="#94A3B8" fontSize="11" fontWeight="500">Week 2</text>
        <text x="285" y="235" fill="#94A3B8" fontSize="11" fontWeight="500">Week 3</text>
        <text x="410" y="235" fill="#94A3B8" fontSize="11" fontWeight="500">Week 4</text>
        <text x="535" y="235" fill="#94A3B8" fontSize="11" fontWeight="500">Week 5</text>
      </svg>

      {/* Floating Hover Tooltip */}
      {hoveredPoint && (
        <div
          className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900 px-3 py-1.5 text-xs text-white shadow-xl backdrop-blur-md border border-slate-800 animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: `${(hoveredPoint.x / 600) * 100}%`,
            top: `${(hoveredPoint.y / 220) * 100 - 10}%`,
          }}
        >
          <div className="font-bold text-cyan-300">{hoveredPoint.week}</div>
          <div className="text-[11px] text-slate-200">Velocity: {hoveredPoint.value}%</div>
        </div>
      )}
    </div>
  );
}

export default function InstructorDashboardPage() {
  const [selectedSemester] = useState("This Semester");

  return (
    <>
      <DashboardTopbar
        title="Lecturer Command Center"
        subtitle="Manage curriculum velocity, student assessments, live doubt sessions, and academic excellence."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-[1360px] mx-auto w-full">
        {/* ========================================================================= */}
        {/* 1. ROYAL BLUE HERO BANNER WITH 3D ISOMETRIC WORKSTATION                   */}
        {/* ========================================================================= */}
        <Reveal variant="fade-up">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#2955EE] via-[#3564F5] to-[#4578F8] p-6 sm:p-8 lg:p-9 text-white shadow-[0_16px_40px_-10px_rgba(41,85,238,0.4)]">
            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-center justify-between gap-6">
              {/* Left Column: Greeting & Badges */}
              <div className="space-y-3 max-w-xl w-full">
                <span className="text-xs sm:text-sm font-medium text-blue-100/90 block">
                  Good Morning,
                </span>

                <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-extrabold tracking-tight text-white leading-tight">
                  Dr. Rohit Kapoor 👋
                </h1>

                <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed font-normal pt-1">
                  You are guiding 3,520 active students across 3 curriculum tracks with 14 pending assignments awaiting evaluation today.
                </p>

                {/* Status Badges */}
                <div className="flex flex-wrap items-center gap-3 pt-2 sm:pt-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-xs">
                    <span>🔥</span>
                    <span>24-Day Teaching Streak</span>
                  </div>

                  <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 sm:px-4 py-1.5 sm:py-2 text-[11px] sm:text-xs font-semibold text-white backdrop-blur-md border border-white/20 shadow-xs">
                    <ShieldCheck className="h-4 w-4 text-emerald-300" />
                    <span>100% Anti-Skip Verifications Active</span>
                  </div>
                </div>
              </div>

              {/* Right Column: 3D Interactive Isometric Workstation Artwork */}
              <div className="w-full lg:w-auto flex justify-center lg:justify-end mt-2 lg:mt-0">
                <Isometric3DWorkstation />
              </div>
            </div>
          </div>
        </Reveal>

        {/* ========================================================================= */}
        {/* 2. 4 METRIC / KPI STATS CARDS                                             */}
        {/* ========================================================================= */}
        <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Card 1: Enrolled Students */}
          <TiltCard>
            <div className="flex h-full items-center gap-4 rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#2F54EB]">
                <Users className="h-6 w-6" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-2xl sm:text-[28px] font-black text-slate-900 leading-tight">
                  3,520
                </div>
                <div className="text-xs font-semibold text-slate-600">Enrolled Students</div>
                <div className="text-xs font-bold text-emerald-600 flex items-center gap-0.5 pt-0.5">
                  <span>↗ +18.4% this semester</span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Card 2: Active Courses */}
          <TiltCard>
            <div className="flex h-full items-center gap-4 rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-[#2F54EB]">
                <BookOpen className="h-6 w-6" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-2xl sm:text-[28px] font-black text-slate-900 leading-tight">
                  3
                </div>
                <div className="text-xs font-semibold text-slate-600">Active Courses</div>
                <div className="text-xs font-medium text-slate-400 pt-0.5 truncate">
                  2 Published • 1 In Studio
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Card 3: Pending Reviews */}
          <TiltCard>
            <div className="flex h-full items-center gap-4 rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-600">
                <ClipboardList className="h-6 w-6" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-2xl sm:text-[28px] font-black text-slate-900 leading-tight">
                  14
                </div>
                <div className="text-xs font-semibold text-slate-600">Pending Reviews</div>
                <div className="text-xs font-bold text-amber-600 flex items-center gap-1 pt-0.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  <span>4 Urgent Coding Tests</span>
                </div>
              </div>
            </div>
          </TiltCard>

          {/* Card 4: Faculty Rating */}
          <TiltCard>
            <div className="flex h-full items-center gap-4 rounded-[22px] border border-white/80 bg-white/95 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5">
              <div className="flex h-13 w-13 shrink-0 items-center justify-center rounded-2xl bg-amber-50 text-amber-500">
                <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <div className="text-2xl sm:text-[28px] font-black text-slate-900 leading-tight">
                  4.9 / 5.0
                </div>
                <div className="text-xs font-semibold text-slate-600">Faculty Rating</div>
                <div className="text-xs font-medium text-slate-400 pt-0.5 truncate">
                  98.6% Student Satisfaction
                </div>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* ========================================================================= */}
        {/* 3. BOTTOM SECTION: VELOCITY CHART & LIVE DOUBT CLEARING                   */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Left: Curriculum Velocity & Performance Card (60%) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-[26px] border border-white/80 bg-white/95 p-5 sm:p-6 shadow-[0_10px_35px_rgb(20,50,100,0.04)] backdrop-blur-xl">
            <div className="flex items-center justify-between pb-2">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                Curriculum Velocity & Performance
              </h3>

              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
                >
                  <span>{selectedSemester}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                </button>
              </div>
            </div>

            <VelocityPerformanceChart />
          </div>

          {/* Right: Live Doubt Clearing Card (40%) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-[26px] border border-white/80 bg-white/95 p-5 sm:p-6 shadow-[0_10px_35px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">Live Doubt Clearing</h3>
              <Link
                href="/instructor/profile"
                className="text-xs font-bold text-[#2563EB] hover:underline"
              >
                View All
              </Link>
            </div>

            <div className="space-y-2.5 flex-1 flex flex-col justify-center">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Next Session</span>
                <span className="rounded-md bg-blue-50 px-2.5 py-0.5 text-[10px] font-black text-[#2563EB] tracking-wider uppercase">
                  SCHEDULED
                </span>
              </div>

              <div className="text-xl sm:text-2xl font-black text-[#2563EB]">
                6:00 PM – 7:30 PM IST
              </div>

              <div className="text-sm font-extrabold text-slate-900 leading-snug">
                Microservices Saga Orchestration & Kafka Stream Debugging
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
              <span className="flex items-center gap-1.5 text-slate-500 font-medium">
                <Users className="h-3.5 w-3.5 text-slate-400" />
                <span>42 Students RSVP&apos;d</span>
              </span>

              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Room Ready</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
