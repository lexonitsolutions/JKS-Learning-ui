"use client";

import React, { useState, useMemo } from "react";
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
} from "@/lib/data/courses-store";

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

export const EXTENDED_CATALOG: CatalogCourse[] = [
  {
    id: "cat-ai",
    slug: "jks-ai-agentic-architecture",
    title: "JKS Generative AI & Agentic Systems",
    tagline: "Master modern AI applications, LLM fine-tuning, RAG pipelines & autonomous AI subagents.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.9,
    reviewsCount: "8K+ Reviews",
    price: 4999,
    originalPrice: 9999,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-purple-950 to-indigo-950",
    bannerTitle: "JKS",
    bannerSubtitle: "AI & AGENTS",
    gradientText: "from-amber-400 via-purple-400 to-cyan-400",
  },
  {
    id: "cat-dsa",
    slug: "jks-dsa-mastery",
    title: "JKS DSA & Algorithms Mastery",
    tagline: "Master Data Structures and Algorithms with hands-on coding and clear interview explanations.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.9,
    reviewsCount: "10K+ Reviews",
    price: 5999,
    originalPrice: 11999,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950",
    bannerTitle: "JKS",
    bannerSubtitle: "DSA",
    gradientText: "from-blue-400 via-cyan-300 to-indigo-300",
  },
  {
    id: "cat-node",
    slug: "jks-nodejs-backend",
    title: "JKS Node.js & Backend Architecture",
    tagline: "From core event loop to distributed microservices, caching, message queues & production APIs.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.8,
    reviewsCount: "10K+ Reviews",
    price: 4499,
    originalPrice: 8999,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-neutral-900 to-indigo-950",
    bannerTitle: "JKS",
    bannerSubtitle: "NODE.JS",
    gradientText: "from-cyan-400 via-blue-400 to-sky-300",
  },
  {
    id: "cat-fsd",
    slug: "jks-frontend-system-design",
    title: "JKS Frontend System Design",
    tagline: "Go from Zero to Hero in Frontend System Design, scalability, micro-frontends and state architecture.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.8,
    reviewsCount: "5K+ Reviews",
    price: 6499,
    originalPrice: 12999,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-900",
    bannerTitle: "JKS FRONTEND",
    bannerSubtitle: "SYSTEM DESIGN",
    gradientText: "from-emerald-400 via-teal-300 to-cyan-300",
  },
  {
    id: "cat-react",
    slug: "modern-frontend-engineering",
    title: "JKS Modern React & Next.js",
    tagline: "Master React 19 architecture, Server Components, TypeScript & high-performance UI engineering.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.7,
    reviewsCount: "40K+ Reviews",
    price: 3999,
    originalPrice: 7999,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900",
    bannerTitle: "JKS",
    bannerSubtitle: "REACT 19",
    gradientText: "from-cyan-400 via-blue-400 to-indigo-300",
  },
  {
    id: "cat-js",
    slug: "jks-javascript-pro",
    title: "JKS Core JavaScript Pro",
    tagline: "In-depth JavaScript foundations, asynchronous execution, closures & prototype chains released for Free.",
    category: "free",
    isPremium: false,
    language: "English",
    rating: 4.8,
    reviewsCount: "50K+ Reviews",
    price: 0,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-amber-950 to-slate-900",
    bannerTitle: "JKS",
    bannerSubtitle: "JAVASCRIPT",
    gradientText: "from-yellow-300 via-amber-300 to-yellow-500",
  },
  {
    id: "cat-interview",
    slug: "crack-frontend-interview",
    title: "Crack Frontend Interview",
    tagline: "Your comprehensive guide to mastering JavaScript, coding puzzles & modern Frontend system interviews.",
    category: "free",
    isPremium: false,
    language: "English",
    rating: 4.8,
    reviewsCount: "50K+ Reviews",
    price: 0,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950",
    bannerTitle: "CRACK THE",
    bannerSubtitle: "FRONTEND INTERVIEW",
    gradientText: "from-blue-400 via-cyan-400 to-sky-300",
  },
  {
    id: "cat-java-enterprise",
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Enterprise Mastery",
    tagline: "Core Java 21, Spring Boot 3, Microservices, React & Production AWS Cloud Capstone.",
    category: "paid",
    isPremium: true,
    language: "English",
    rating: 4.9,
    reviewsCount: "12K+ Reviews",
    price: 24999,
    originalPrice: 49999,
    thumbnailBg: "bg-gradient-to-br from-blue-950 via-slate-950 to-indigo-950",
    bannerTitle: "JAVA 21",
    bannerSubtitle: "FULL STACK MASTERY",
    gradientText: "from-blue-400 via-cyan-300 to-sky-400",
  },
  {
    id: "cat-sap-abap",
    slug: "sap-abap-professional",
    title: "SAP ABAP Professional Track",
    tagline: "ABAP programming, module pool, RICEFW objects, and S/4HANA extensibility.",
    category: "partner",
    isPremium: true,
    language: "English",
    rating: 4.6,
    reviewsCount: "3K+ Reviews",
    price: 28999,
    originalPrice: 45000,
    thumbnailBg: "bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950",
    bannerTitle: "SAP ABAP",
    bannerSubtitle: "PROFESSIONAL",
    gradientText: "from-indigo-300 via-sky-300 to-blue-400",
  },
  {
    id: "cat-bundle-pro",
    slug: "create-own-bundle",
    title: "Create Your Own Bundle",
    tagline: "Create your custom engineering track by choosing exactly what you need with tiered bundle discounts.",
    category: "bundle",
    isPremium: true,
    language: "English",
    rating: 5.0,
    reviewsCount: "Best Value",
    price: 9999,
    thumbnailBg: "bg-gradient-to-br from-slate-950 via-neutral-900 to-blue-950",
    bannerTitle: "Create Own",
    bannerSubtitle: "Bundle",
    gradientText: "from-blue-300 via-cyan-400 to-indigo-400",
    isBundle: true,
  },
];

const CATEGORY_TABS = [
  { id: "all", label: "All Courses" },
  { id: "paid", label: "Paid Courses" },
  { id: "bundle-builder", label: "Create Own Course Bundle" },
  { id: "bundle", label: "Course Bundles" },
  { id: "free", label: "Free Courses" },
  { id: "partner", label: "Our Partners" },
];

export default function StudentAllCoursesPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isBundleModalOpen, setIsBundleModalOpen] = useState(false);
  const [selectedBundleCourses, setSelectedBundleCourses] = useState<string[]>([
    "jks-ai-agentic-architecture",
    "jks-dsa-mastery",
  ]);
  const [enrolledNotification, setEnrolledNotification] = useState<string | null>(null);

  const ownedCourses = useStudentOwnedCourses();
  const ownedSlugs = useMemo(() => ownedCourses.map((c) => c.slug), [ownedCourses]);

  // Filter Catalog based on active category pill and search query
  const filteredCourses = useMemo(() => {
    let list = EXTENDED_CATALOG;

    if (activeTab === "paid") {
      list = list.filter((c) => c.category === "paid");
    } else if (activeTab === "free") {
      list = list.filter((c) => c.category === "free");
    } else if (activeTab === "bundle") {
      list = list.filter((c) => c.category === "bundle" || c.isBundle);
    } else if (activeTab === "partner") {
      list = list.filter((c) => c.category === "partner");
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
  }, [activeTab, searchQuery]);

  const handleEnroll = (course: CatalogCourse) => {
    enrollStudentCourse(course.slug);
    setEnrolledNotification(`Successfully enrolled in ${course.title}!`);
    setTimeout(() => setEnrolledNotification(null), 3500);
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
          <div className="fixed top-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3.5 text-xs font-bold text-emerald-800 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
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
                      : "bg-slate-200/80 text-slate-700 hover:bg-slate-300 hover:text-slate-900"
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
              className="w-full rounded-xl border border-slate-200 bg-white/90 py-2 pl-9 pr-4 text-xs font-medium text-slate-800 placeholder-slate-400 outline-none transition-colors focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Course Cards Grid */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {filteredCourses.map((course) => {
            const isOwned = ownedSlugs.includes(course.slug);

            return (
              <TiltCard key={course.id} className="h-full">
                <div className="flex h-full flex-col justify-between overflow-hidden rounded-[20px] border border-slate-200/80 bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] transition-all duration-300 hover:shadow-xl hover:border-blue-200">
                  {/* Card Thumbnail / Header Banner */}
                  <div
                    className={`relative flex h-48 w-full flex-col items-center justify-center p-4 text-center overflow-hidden ${course.thumbnailBg}`}
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
                      <div className="text-[15px] font-black tracking-widest text-slate-200 uppercase">
                        {course.bannerTitle}
                      </div>
                      <div
                        className={`text-3xl font-black tracking-wider uppercase bg-gradient-to-r ${
                          course.gradientText || "from-blue-400 to-cyan-400"
                        } bg-clip-text text-transparent drop-shadow-sm`}
                      >
                        {course.bannerSubtitle || course.title}
                      </div>
                      <div className="text-[10px] font-bold text-slate-400 tracking-wider">
                        MASTER SKILLS • JKS LEARNING
                      </div>
                    </div>

                    {/* JKS Certified Badge */}
                    <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-md text-[9px] font-medium text-slate-300">
                      <span>JKS Certified</span>
                    </div>

                    {isOwned && (
                      <div className="absolute top-2 left-2 rounded-lg bg-emerald-500 px-2 py-0.5 text-[10px] font-extrabold uppercase text-white shadow-xs">
                        Enrolled
                      </div>
                    )}
                  </div>

                  {/* Card Body */}
                  <div className="flex flex-1 flex-col justify-between p-4 space-y-3">
                    <div>
                      {/* Title */}
                      <h3 className="text-[15px] font-extrabold text-slate-900 leading-snug">
                        {course.title}
                      </h3>

                      {/* Tag Badges Strip */}
                      <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
                        {course.isPremium ? (
                          <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase text-[#2563EB] border border-blue-200">
                            <Crown className="h-3 w-3 fill-[#2563EB] text-[#2563EB]" />
                            PREMIUM
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded bg-cyan-50 px-2 py-0.5 text-[10px] font-black uppercase text-cyan-700 border border-cyan-200">
                            FREE
                          </span>
                        )}

                        <span className="inline-flex items-center gap-1 text-slate-500 font-medium">
                          <Volume2 className="h-3 w-3 text-slate-400" />
                          {course.language}
                        </span>

                        <span className="inline-flex items-center gap-1 text-slate-700 font-bold">
                          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                          {course.rating} ({course.reviewsCount})
                        </span>
                      </div>

                      {/* Summary Tagline */}
                      <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                        {course.tagline}
                      </p>
                    </div>

                    {/* Bottom CTA Button: Using JKS Primary Blue UI Color */}
                    <div className="pt-2">
                      {course.isBundle ? (
                        <button
                          type="button"
                          onClick={() => setIsBundleModalOpen(true)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white py-2.5 px-4 text-xs font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        >
                          <span>Build Your Custom Bundle</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      ) : isOwned ? (
                        <Link
                          href={`/dashboard/my-courses/${course.slug}`}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white py-2.5 px-4 text-xs font-bold shadow-xs transition-all duration-200 hover:scale-[1.02]"
                        >
                          <BookOpen className="h-3.5 w-3.5" />
                          <span>Continue Learning</span>
                        </Link>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEnroll(course)}
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white py-2.5 px-4 text-xs font-bold shadow-md shadow-blue-500/20 transition-all duration-200 hover:scale-[1.02] cursor-pointer"
                        >
                          <span>Enroll Now</span>
                          <ArrowRight className="h-3.5 w-3.5" />
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
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-white p-12 text-center shadow-xs">
            <BookOpen className="h-10 w-10 text-slate-300" />
            <h3 className="mt-3 text-sm font-bold text-slate-900">No courses match your query</h3>
            <p className="mt-1 text-xs text-slate-500">
              Try searching with another keyword or resetting the filter pill.
            </p>
            <button
              type="button"
              onClick={() => {
                setActiveTab("all");
                setSearchQuery("");
              }}
              className="mt-4 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
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
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Create Your Own Custom Bundle
                  </h3>
                  <p className="text-xs text-slate-500">
                    Select 2 or more tracks to unlock progressive bundle discounts
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBundleModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {EXTENDED_CATALOG.filter((c) => !c.isBundle && c.price > 0).map((c) => {
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
                        ? "border-[#2563EB] bg-blue-50/50 shadow-xs"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-white transition-colors ${
                          isSelected
                            ? "border-[#2563EB] bg-[#2563EB]"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="h-4 w-4" />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{c.title}</div>
                        <div className="text-[11px] text-slate-500">
                          ₹{c.price.toLocaleString("en-IN")} · {c.rating} ⭐ ({c.reviewsCount})
                        </div>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-800">
                      ₹{c.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bundle Pricing Summary */}
            <div className="border-t border-slate-100 pt-3 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>Selected Courses: {selectedBundleCourses.length}</span>
                <span className="font-bold text-emerald-600">
                  {selectedBundleCourses.length >= 3
                    ? "35% Bundle Discount Applied"
                    : selectedBundleCourses.length === 2
                    ? "20% Bundle Discount Applied"
                    : "Add 1 more track for 20% discount"}
                </span>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <div className="text-xs text-slate-400">Total Bundle Price</div>
                  <div className="text-lg font-black text-slate-900">
                    {selectedBundleCourses.length >= 2 ? "₹7,999" : "₹4,999"}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBundleModalOpen(false)}
                    className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      selectedBundleCourses.forEach((slug) => enrollStudentCourse(slug));
                      setIsBundleModalOpen(false);
                      setEnrolledNotification("Custom Bundle Enrolled Successfully!");
                      setTimeout(() => setEnrolledNotification(null), 3500);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
                  >
                    <Zap className="h-4 w-4" /> Enroll Custom Bundle
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
