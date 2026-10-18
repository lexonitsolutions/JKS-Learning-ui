"use client";

import { useState, useEffect } from "react";

export interface HeroBannerSlide {
  id: string;
  tag: string;
  badge: string;
  title: string;
  subtitle: string;
  discountCode: string;
  expiresIn: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  bgGradient: string;
  accentColor: string;
  enabled?: boolean;
  type?: "feature" | "offer" | "custom";
}

export const DEFAULT_HERO_BANNERS: HeroBannerSlide[] = [
  {
    id: "ai-interview-feature",
    tag: "AI Practice Suite",
    badge: "Instant Readiness Report",
    title: "Enterprise AI Mock Interview Simulator",
    subtitle: "Practice 1-on-1 technical & behavioral interview rounds with real-time AI scoring, 5-axis diagnostics & hiring feedback.",
    discountCode: "AIMOCKPRO",
    expiresIn: "Unlimited Practice for Enrolled Learners",
    ctaText: "Launch AI Interview",
    ctaLink: "/dashboard/ai-interview",
    secondaryCtaText: "View Sample Report",
    secondaryCtaLink: "/dashboard/ai-interview/report",
    bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
    accentColor: "#38BDF8",
    enabled: true,
    type: "feature",
  },
  {
    id: "resume-maker-feature",
    tag: "Career Booster",
    badge: "ATS 95%+ Pass Rate",
    title: "Smart AI Resume & CV Architect",
    subtitle: "Generate recruiter-approved, ATS-compliant technical resumes tailored to top-tier enterprise job descriptions in minutes.",
    discountCode: "CAREERPRO",
    expiresIn: "Export PDF & Word Format",
    ctaText: "Build Resume Now",
    ctaLink: "/dashboard/resume-builder",
    secondaryCtaText: "Explore Templates",
    secondaryCtaLink: "/dashboard/resume-builder",
    bgGradient: "from-emerald-700 via-teal-700 to-cyan-800",
    accentColor: "#6EE7B7",
    enabled: true,
    type: "feature",
  },
  {
    id: "offer-bundle-dsa",
    tag: "Bundle Deal",
    badge: "BUY 1 GET 1",
    title: "JKS Frontend System Design & DSA Pro Bundle",
    subtitle: "Crack Tier-1 Tech Interviews with JKS DSA + Enterprise System Design Mastery.",
    discountCode: "B1G1TECH",
    expiresIn: "Ends Midnight",
    ctaText: "Grab 1+1 Offer",
    ctaLink: "/dashboard/courses",
    secondaryCtaText: "Explore Courses",
    secondaryCtaLink: "/dashboard/courses",
    bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
    accentColor: "#818CF8",
    enabled: true,
    type: "offer",
  },
  {
    id: "offer-gen-ai",
    tag: "New Launch Special",
    badge: "FLAT 40% OFF",
    title: "JKS Generative AI & Agentic Architecture",
    subtitle: "Build production RAG pipelines, LLM fine-tuning & autonomous AI subagents.",
    discountCode: "GENAI40",
    expiresIn: "Valid for Next 48 Hours",
    ctaText: "Unlock AI Course",
    ctaLink: "/dashboard/courses",
    secondaryCtaText: "Syllabus Details",
    secondaryCtaLink: "/dashboard/courses",
    bgGradient: "from-purple-900 via-indigo-900 to-blue-900",
    accentColor: "#C084FC",
    enabled: true,
    type: "offer",
  },
];

export const HERO_BANNERS_STORAGE_KEY = "jks_dashboard_hero_banners_v2";
export const HERO_BANNERS_EVENT = "jks_hero_banners_updated";

export function getStoredHeroBanners(): HeroBannerSlide[] {
  if (typeof window === "undefined") return DEFAULT_HERO_BANNERS;
  try {
    const raw = localStorage.getItem(HERO_BANNERS_STORAGE_KEY);
    if (!raw) return DEFAULT_HERO_BANNERS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to load hero banners from localStorage:", err);
  }
  return DEFAULT_HERO_BANNERS;
}

export function saveHeroBanners(banners: HeroBannerSlide[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HERO_BANNERS_STORAGE_KEY, JSON.stringify(banners));
    window.dispatchEvent(new Event(HERO_BANNERS_EVENT));
  } catch (err) {
    console.error("Failed to save hero banners to localStorage:", err);
  }
}

export function resetHeroBanners(): HeroBannerSlide[] {
  if (typeof window === "undefined") return DEFAULT_HERO_BANNERS;
  try {
    localStorage.setItem(HERO_BANNERS_STORAGE_KEY, JSON.stringify(DEFAULT_HERO_BANNERS));
    window.dispatchEvent(new Event(HERO_BANNERS_EVENT));
  } catch (err) {
    console.error("Failed to reset hero banners:", err);
  }
  return DEFAULT_HERO_BANNERS;
}

export function useHeroBanners(): {
  banners: HeroBannerSlide[];
  activeBanners: HeroBannerSlide[];
  saveBanners: (next: HeroBannerSlide[]) => void;
  resetToDefaults: () => void;
} {
  const [banners, setBanners] = useState<HeroBannerSlide[]>(DEFAULT_HERO_BANNERS);

  useEffect(() => {
    setBanners(getStoredHeroBanners());

    const syncBanners = () => {
      setBanners(getStoredHeroBanners());
    };

    window.addEventListener(HERO_BANNERS_EVENT, syncBanners);
    window.addEventListener("storage", syncBanners);
    return () => {
      window.removeEventListener(HERO_BANNERS_EVENT, syncBanners);
      window.removeEventListener("storage", syncBanners);
    };
  }, []);

  const activeBanners = banners.filter((b) => b.enabled !== false);

  return {
    banners,
    activeBanners: activeBanners.length > 0 ? activeBanners : DEFAULT_HERO_BANNERS,
    saveBanners: (next: HeroBannerSlide[]) => {
      saveHeroBanners(next);
      setBanners(next);
    },
    resetToDefaults: () => {
      const reset = resetHeroBanners();
      setBanners(reset);
    },
  };
}
