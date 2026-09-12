"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  Crown,
  Volume2,
  Star,
  Layers,
  Sparkles,
  CheckCircle2,
  Search,
  BookOpen,
  ArrowRight,
  Plus,
  ShieldCheck,
  Zap,
  ShoppingBag,
  X,
  MessageCircle,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";
import {
  useAllCourses,
  useStudentOwnedCourses,
  enrollStudentCourse,
  unenrollStudentCourse,
  type FullCourse,
} from "@/lib/data/courses-store";
import { CourseCheckoutModal } from "@/components/dashboard/course-checkout-modal";

// Comprehensive Catalog with official JKS Learning branding
export interface CatalogCourse {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  category: "paid" | "free" | "bundle" | "partner";
  isPremium: boolean;
  language: string;
  rating: number;
  reviewsCount: string;
  price: number;
  originalPrice?: number;
  badge?: string;
  thumbnailBg: string;
  gradientText?: string;
  bannerTitle: string;
  bannerSubtitle?: string;
  isBundle?: boolean;
}

export function mapFullCourseToCatalog(c: FullCourse): CatalogCourse {
  const isJava = c.slug.includes("java");
  const isFrontend = c.slug.includes("frontend");
  const isSap = c.slug.includes("sap");

  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    tagline: c.summary,
    category: "paid",
    isPremium: true,
    language: "English",
    rating: c.rating || 4.9,
    reviewsCount: `${c.studentsEnrolled?.toLocaleString() || "1K"}+ Enrolled`,
    price: c.price,
    originalPrice: Math.round(c.price * 1.5),
    thumbnailBg: isJava
      ? "bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950"
      : isFrontend
      ? "bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900"
      : isSap
      ? "bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950"
      : "bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900",
    bannerTitle: isJava ? "JAVA 21" : isFrontend ? "REACT 19" : isSap ? "SAP S/4HANA" : ".NET 9",
    bannerSubtitle: isJava
      ? "FULL STACK MASTERY"
      : isFrontend
      ? "FRONTEND ARCHITECT"
      : isSap
      ? "ENTERPRISE SYSTEMS"
      : "ENTERPRISE CLOUD",
    gradientText: isJava
      ? "from-blue-400 via-cyan-300 to-sky-400"
      : isFrontend
      ? "from-cyan-400 via-blue-400 to-indigo-300"
      : isSap
      ? "from-indigo-300 via-sky-300 to-blue-400"
      : "from-purple-400 via-pink-400 to-sky-400",
  };
}

export const EXTENDED_CATALOG: CatalogCourse[] = [
  {
    id: "6a9aa673cd787beadcfc3e4e",
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Developer Mastery",
    tagline: "Enterprise Spring Boot 3, Microservices, Kafka, Docker & React 19 architecture built around real enterprise project work.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.9,
    reviewsCount: "2.1K+ Enrolled",
    price: 29999,
    originalPrice: 44999,
    thumbnailBg: "bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950",
    bannerTitle: "JAVA 21",
    bannerSubtitle: "FULL STACK MASTERY",
    gradientText: "from-blue-400 via-cyan-300 to-sky-400",
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Tracks" },
  { id: "fullstack", label: "Full Stack" },
  { id: "frontend", label: "Frontend" },
  { id: "sap", label: "SAP" },
  { id: "bundle-builder", label: "Create Own Bundle" },
];

export default function StudentAllCoursesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [selectedBundleCourses, setSelectedBundleCourses] = useState<string[]>([]);
  const [enrolledNotification, setEnrolledNotification] = useState<string | null>(null);

  const allCourses = useAllCourses();
  const ownedCourses = useStudentOwnedCourses();
  const ownedSlugs = useMemo(() => ownedCourses.map((c) => c.slug), [ownedCourses]);

  const catalogCourses = useMemo(() => {
    const list = allCourses.map(mapFullCourseToCatalog);
    if (list.length >= 2) {
      list.push({
        id: "cat-bundle-pro",
        slug: "create-own-bundle",
        title: "Create Your Own Bundle",
        tagline: "Combine multiple enterprise tracks with special tiered bundle savings.",
        category: "bundle",
        isPremium: true,
        language: "English",
        rating: 5.0,
        reviewsCount: "Best Value",
        price: 39999,
        thumbnailBg: "bg-gradient-to-br from-slate-950 via-neutral-900 to-blue-950",
        bannerTitle: "ENTERPRISE",
        bannerSubtitle: "COMBO BUNDLE",
        gradientText: "from-blue-300 via-cyan-400 to-indigo-400",
        isBundle: true,
      });
    }
    return list;
  }, [allCourses]);

  // Set default bundle courses once catalog is loaded
  useEffect(() => {
    if (selectedBundleCourses.length === 0 && catalogCourses.length > 0) {
      const realCourses = catalogCourses.filter((c) => !c.isBundle);
      if (realCourses.length >= 2) {
        setSelectedBundleCourses([realCourses[0].slug, realCourses[1].slug]);
      } else if (realCourses.length === 1) {
        setSelectedBundleCourses([realCourses[0].slug]);
      }
    }
  }, [catalogCourses, selectedBundleCourses.length]);

  // Filter Catalog based on active category pill and search query
  const filteredCourses = useMemo(() => {
    let list = catalogCourses;

    if (activeTab === "fullstack") {
      list = list.filter((c) => c.slug.includes("java") || c.slug.includes("dotnet"));
    } else if (activeTab === "frontend") {
      list = list.filter((c) => c.slug.includes("frontend"));
    } else if (activeTab === "sap") {
      list = list.filter((c) => c.slug.includes("sap"));
    } else if (activeTab === "bundle-builder") {
      list = list.filter((c) => c.isBundle || c.category === "paid");
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.slug.toLowerCase().includes(q)
      );
    }

    return list;
  }, [catalogCourses, activeTab, searchQuery]);

  const [checkoutCourse, setCheckoutCourse] = useState<CatalogCourse | null>(null);

  const handleEnroll = (course: CatalogCourse) => {
    setCheckoutCourse(course);
  };

  return (
    <>
      <DashboardTopbar
        title="Courses Catalog"
        subtitle="Explore all industry-grade engineering tracks, JKS master series & verified certifications."
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Success Toast Notification */}
        {enrolledNotification && (
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-xs font-bold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{enrolledNotification}</span>
          </div>
        )}

        {/* Top Category Filter Pills */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    if (tab.id === "bundle-builder") {
                      setIsBundleModalOpen(true);
                    }
                    setActiveTab(tab.id);
                  }}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all duration-200 cursor-pointer select-none whitespace-nowrap ${
                    isActive
                      ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                      : "bg-slate-200/80 text-slate-700 hover:bg-slate-300 hover:text-slate-900 dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover dark:hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Quick Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search all courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/90 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-500/30 dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Course Cards Grid - 2 Columns on Mobile, 3 on Tablet, 4 on Desktop */}
        <Reveal variant="stagger" className="grid grid-cols-2 gap-2.5 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-5">
          {filteredCourses.map((course) => {
            const isOwned = ownedSlugs.includes(course.slug);

            return (
              <TiltCard key={course.id} className="h-full">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-2xl sm:rounded-[20px] border border-slate-200/80 bg-white shadow-[0_2px_12px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl hover:border-blue-300 dark:border-slate-800/80 dark:bg-surface-secondary dark:hover:border-blue-500/40">
                  {/* Card Thumbnail / Header Banner */}
                  <div
                    className={`relative flex h-28 sm:h-36 md:h-44 lg:h-48 w-full flex-col items-center justify-center p-2.5 sm:p-4 text-center overflow-hidden ${course.thumbnailBg}`}
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
                    <div className="relative z-10 space-y-0.5 sm:space-y-1">
                      <div className="text-[10px] sm:text-xs md:text-sm font-black tracking-widest text-slate-200 uppercase">
                        {course.bannerTitle}
                      </div>
                      <div
                        className={`text-base sm:text-xl md:text-2xl lg:text-3xl font-black tracking-wider uppercase bg-gradient-to-r ${
                          course.gradientText || "from-blue-400 to-cyan-400"
                        } bg-clip-text text-transparent drop-shadow-xs line-clamp-1`}
                      >
                        {course.bannerSubtitle || course.title}
                      </div>
                      <div className="hidden sm:block text-[9px] sm:text-[10px] font-bold text-slate-400 tracking-wider">
                        MASTER SKILLS • JKS LEARNING
                      </div>
                    </div>

                    {/* JKS Certified Badge */}
                    <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 flex items-center gap-1 rounded-full bg-black/50 px-1.5 py-0.5 sm:px-2 backdrop-blur-md text-[7px] sm:text-[9px] font-medium text-slate-300">
                      <span>JKS Certified</span>
                    </div>

                    {isOwned && (
                      <div className="absolute top-1.5 left-1.5 sm:top-2 sm:left-2 rounded-md sm:rounded-lg bg-emerald-500 px-1.5 py-0.5 sm:px-2 text-[8px] sm:text-[10px] font-extrabold uppercase text-white shadow-xs">
                        Enrolled
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-2.5 sm:p-3.5 md:p-4 space-y-2 sm:space-y-3">
                    <div>
                      {/* Title */}
                      <h3 className="text-xs sm:text-sm md:text-[15px] font-extrabold text-slate-900 leading-snug line-clamp-2 min-h-[2rem] sm:min-h-[2.5rem] dark:text-white">
                        {course.title}
                      </h3>

                      {/* Tag Badges Strip */}
                      <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[11px] font-bold">
                        {course.isPremium ? (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-blue-50 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase text-[#2563EB] border border-blue-200 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-300">
                            <Crown className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-[#2563EB] text-[#2563EB] dark:fill-blue-400 dark:text-blue-400" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 sm:gap-1 rounded bg-cyan-50 px-1.5 py-0.5 text-[8px] sm:text-[10px] font-black uppercase text-cyan-700 border border-cyan-200 dark:bg-cyan-950/40 dark:border-cyan-800/40 dark:text-cyan-300">
                            FREE
                          </span>
                        )}

                        <span className="inline-flex items-center gap-0.5 text-slate-500 font-medium text-[9px] sm:text-[11px] dark:text-slate-400">
                          <Volume2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-slate-400 dark:text-slate-400" />
                          {course.language}
                        </span>

                        <span className="inline-flex items-center gap-0.5 text-slate-700 font-bold text-[9px] sm:text-[11px] dark:text-slate-300">
                          <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-amber-400 text-amber-400" />
                          <span>{course.rating}</span>
                          <span className="hidden sm:inline font-normal text-slate-500 dark:text-slate-400">({course.reviewsCount})</span>
                        </span>
                      </div>

                      {/* Summary Tagline */}
                      <p className="mt-1.5 sm:mt-2 text-[10px] sm:text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal dark:text-slate-400">
                        {course.tagline}
                      </p>
                    </div>

                    {/* Bottom CTA Button */}
                    <div className="pt-1.5 sm:pt-2">
                      {course.isBundle ? (
                        <button
                          type="button"
                          onClick={() => setIsBundleModalOpen(true)}
                          className="w-full flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white py-2 sm:py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        >
                          <span className="truncate">Build Bundle</span>
                          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        </button>
                      ) : isOwned ? (
                        <Link
                          href={`/dashboard/my-courses/${course.slug}`}
                          className="w-full flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2 sm:py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.02] dark:bg-slate-800 dark:hover:bg-slate-700"
                        >
                          <BookOpen className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                          <span className="truncate">Continue</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnroll(course)}
                          className="w-full flex items-center justify-center gap-1 sm:gap-1.5 rounded-lg sm:rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white py-2 sm:py-2.5 px-2 sm:px-4 text-[11px] sm:text-xs font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        >
                          <span className="truncate">Enroll Now</span>
                          <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </TiltCard>
            );
          })}
        </Reveal>

        {/* Empty Search Result Fallback */}
        {filteredCourses.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs dark:border-slate-800 dark:bg-surface-secondary">
            <BookOpen className="h-10 w-10 text-slate-300 dark:text-slate-600" />
            <h3 className="mt-3 text-sm font-bold text-slate-900 dark:text-white">No courses match your query</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Try searching with another keyword or resetting the filter pill.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating WhatsApp Support Button */}
      <a
        href="https://wa.me/?text=Hello%20JKS%20Learning%2C%20I%20have%20a%20question%20about%20courses"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-110"
        title="Chat with Student Advisor on WhatsApp"
      >
        <MessageCircle className="h-6 w-6 fill-white text-[#25D366]" />
      </a>

      {/* CUSTOM BUNDLE BUILDER MODAL */}
      {isBundleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col dark:border-slate-800/80 dark:bg-surface-secondary">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Create Your Own Custom Bundle
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Select 2 or more tracks to unlock progressive bundle discounts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBundleModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {catalogCourses.filter((c) => !c.isBundle && c.price > 0).map((c) => {
                const isSelected = selectedBundleCourses.includes(c.slug);

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedBundleCourses((prev) =>
                        isSelected ? prev.filter((s) => s !== c.slug) : [...prev, c.slug]
                      );
                    }}
                    className={`flex cursor-pointer items-center justify-between gap-3 rounded-2xl border p-3.5 transition-all ${
                      isSelected
                        ? "border-[#2563EB] bg-blue-50/50 shadow-xs dark:border-blue-500 dark:bg-blue-950/30"
                        : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-surface-elevated dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-white transition-colors ${
                          isSelected
                            ? "border-[#2563EB] bg-[#2563EB]"
                            : "border-slate-300 bg-white dark:border-slate-600 dark:bg-slate-800"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          ₹{c.price.toLocaleString("en-IN")} · {c.rating} ⭐ ({c.reviewsCount})
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      ₹{c.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bundle Pricing Summary */}
            <div className="border-t border-slate-100 pt-3 space-y-2 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-400">
                <span>Selected Courses: {selectedBundleCourses.length}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {selectedBundleCourses.length >= 3
                    ? "35% Bundle Discount Applied"
                    : selectedBundleCourses.length === 2
                    ? "20% Bundle Discount Applied"
                    : "Add 1 more track for 20% discount"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs text-slate-400 dark:text-slate-400">Total Bundle Price</div>
                  <div className="text-lg font-black text-slate-900 dark:text-white">
                    {(() => {
                      const sum = catalogCourses
                        .filter((c) => selectedBundleCourses.includes(c.slug))
                        .reduce((acc, c) => acc + c.price, 0);
                      const discount = selectedBundleCourses.length >= 3 ? 0.35 : selectedBundleCourses.length === 2 ? 0.20 : 0;
                      const discounted = Math.round(sum * (1 - discount));
                      return `₹${discounted.toLocaleString("en-IN")}`;
                    })()}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBundleModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer dark:text-slate-400 dark:hover:bg-surface-hover"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const sum = catalogCourses
                        .filter((c) => selectedBundleCourses.includes(c.slug))
                        .reduce((acc, c) => acc + c.price, 0);
                      const discount = selectedBundleCourses.length >= 3 ? 0.35 : selectedBundleCourses.length === 2 ? 0.20 : 0;
                      const discounted = Math.round(sum * (1 - discount));
                      setIsBundleModalOpen(false);
                      setCheckoutCourse({
                        id: "cat-bundle-pro",
                        slug: selectedBundleCourses[0] || "custom-bundle",
                        title: `Custom Career Bundle (${selectedBundleCourses.length} Tracks)`,
                        tagline: "Customized multi-track bundle with progressive tuition savings.",
                        category: "bundle",
                        isPremium: true,
                        language: "English",
                        rating: 5.0,
                        reviewsCount: "Combo Savings",
                        price: discounted,
                        originalPrice: sum,
                        thumbnailBg: "bg-gradient-to-br from-slate-950 via-neutral-900 to-blue-950",
                        bannerTitle: "ENTERPRISE",
                        isBundle: true,
                      });
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 cursor-pointer"
                  >
                    <Zap className="h-4 w-4" /> Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECURE COURSE CHECKOUT & PAYMENT MODAL */}
      <CourseCheckoutModal
        course={checkoutCourse}
        isOpen={!!checkoutCourse}
        onClose={() => setCheckoutCourse(null)}
        onEnrollSuccess={(courseSlug) => {
          if (checkoutCourse?.isBundle) {
            selectedBundleCourses.forEach((s) => enrollStudentCourse(s));
          }
          setEnrolledNotification(`Successfully enrolled in ${checkoutCourse?.title || "course"}!`);
          setTimeout(() => setEnrolledNotification(null), 4000);
        }}
      />
    </>
  );
}
