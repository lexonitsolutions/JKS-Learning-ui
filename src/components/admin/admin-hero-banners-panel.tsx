"use client";

import React, { useState } from "react";
import {
  ArrowLeft,
  Plus,
  RotateCcw,
  Sparkles,
  Flame,
  Tag,
  Gift,
  Clock,
  ArrowRight,
  Edit2,
  Trash2,
  CheckCircle2,
  Eye,
  ChevronUp,
  ChevronDown,
  Layers,
  Copy,
  ExternalLink,
  Bot,
  FileText,
} from "lucide-react";
import {
  useHeroBanners,
  type HeroBannerSlide,
  DEFAULT_HERO_BANNERS,
} from "@/lib/data/hero-banners-store";

const GRADIENT_PRESETS = [
  {
    name: "Enterprise Blue & Purple",
    bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
    accentColor: "#38BDF8",
  },
  {
    name: "Emerald & Modern Teal",
    bgGradient: "from-emerald-700 via-teal-700 to-cyan-800",
    accentColor: "#6EE7B7",
  },
  {
    name: "Deep Slate & Indigo",
    bgGradient: "from-slate-950 via-slate-900 to-indigo-950",
    accentColor: "#818CF8",
  },
  {
    name: "Royal Purple & Midnight",
    bgGradient: "from-purple-900 via-indigo-900 to-blue-900",
    accentColor: "#C084FC",
  },
  {
    name: "Rose & Crimson Glow",
    bgGradient: "from-rose-800 via-pink-800 to-purple-900",
    accentColor: "#FB7185",
  },
  {
    name: "Amber & Sunset Fire",
    bgGradient: "from-amber-700 via-orange-700 to-rose-800",
    accentColor: "#FCD34D",
  },
];

const QUICK_FEATURE_TEMPLATES: Array<Omit<HeroBannerSlide, "id">> = [
  {
    tag: "AI Practice Suite",
    badge: "Instant Readiness Report",
    title: "Enterprise AI Mock Interview Simulator",
    subtitle:
      "Practice 1-on-1 technical & behavioral interview rounds with real-time AI scoring, 5-axis diagnostics & hiring feedback.",
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
    tag: "Career Booster",
    badge: "ATS 95%+ Pass Rate",
    title: "Smart AI Resume & CV Architect",
    subtitle:
      "Generate recruiter-approved, ATS-compliant technical resumes tailored to top-tier enterprise job descriptions in minutes.",
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
    tag: "Bundle Deal",
    badge: "BUY 1 GET 1",
    title: "JKS Frontend System Design & DSA Pro Bundle",
    subtitle:
      "Crack Tier-1 Tech Interviews with JKS DSA + Enterprise System Design Mastery.",
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
];

export function AdminHeroBannersPanel({ onBack }: { onBack: () => void }) {
  const { banners, saveBanners, resetToDefaults } = useHeroBanners();
  const [editingSlide, setEditingSlide] = useState<HeroBannerSlide | null>(null);
  const [previewSlideId, setPreviewSlideId] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(null), 3000);
  };

  const activePreview =
    banners.find((b) => b.id === previewSlideId) || banners[0] || DEFAULT_HERO_BANNERS[0];

  const handleToggleEnabled = (id: string) => {
    const next = banners.map((b) => (b.id === id ? { ...b, enabled: !b.enabled } : b));
    saveBanners(next);
    showToast("Banner visibility updated!");
  };

  const handleMove = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= banners.length) return;
    const next = [...banners];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    saveBanners(next);
    showToast("Banner order rearranged!");
  };

  const handleDelete = (id: string) => {
    if (banners.length <= 1) {
      alert("At least one banner must remain active on the platform.");
      return;
    }
    if (confirm("Are you sure you want to remove this banner advertisement?")) {
      const next = banners.filter((b) => b.id !== id);
      saveBanners(next);
      showToast("Banner deleted successfully.");
      if (previewSlideId === id) {
        setPreviewSlideId(next[0]?.id || null);
      }
    }
  };

  const handleDuplicate = (slide: HeroBannerSlide) => {
    const dup: HeroBannerSlide = {
      ...slide,
      id: `banner-${Date.now()}`,
      title: `${slide.title} (Copy)`,
    };
    const next = [...banners, dup];
    saveBanners(next);
    showToast("Banner duplicated!");
  };

  const handleSaveSlideForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide) return;

    if (!editingSlide.title.trim()) {
      alert("Please provide a title for the banner.");
      return;
    }

    const isExisting = banners.some((b) => b.id === editingSlide.id);
    let next: HeroBannerSlide[];
    if (isExisting) {
      next = banners.map((b) => (b.id === editingSlide.id ? editingSlide : b));
      showToast("Banner updated successfully!");
    } else {
      next = [editingSlide, ...banners];
      showToast("New banner created!");
    }
    saveBanners(next);
    setPreviewSlideId(editingSlide.id);
    setEditingSlide(null);
  };

  const handleApplyTemplate = (template: Omit<HeroBannerSlide, "id">) => {
    const newSlide: HeroBannerSlide = {
      ...template,
      id: `banner-${Date.now()}`,
    };
    setEditingSlide(newSlide);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {successToast && (
        <div className="fixed top-6 right-6 z-50 flex items-center gap-2 rounded-2xl border border-emerald-300 bg-emerald-50 px-5 py-3 text-xs font-bold text-emerald-800 dark:border-emerald-500/40 dark:bg-emerald-500/20 dark:text-emerald-200 shadow-xl backdrop-blur-md animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successToast}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-200 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Back to settings"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                Dashboard Banners & Ads
              </h2>
              <span className="rounded-full bg-blue-100 dark:bg-blue-950/60 px-2.5 py-0.5 text-[10px] font-extrabold text-[#2563EB] dark:text-blue-400">
                {banners.length} Slides ({banners.filter((b) => b.enabled !== false).length} Active)
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Control the top hero promotional carousel, default feature ads, and special offers on
              the student dashboard.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => {
              if (
                confirm(
                  "Reset banners to default platform configuration? AI Mock Interview and AI Resume Builder will be restored as default slides."
                )
              ) {
                resetToDefaults();
                showToast("Banners reset to default system templates.");
              }
            }}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700/80 dark:bg-surface-elevated dark:text-slate-300 dark:hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden md:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingSlide({
                id: `banner-${Date.now()}`,
                tag: "Platform Feature",
                badge: "Special Launch",
                title: "New AI Powered Capability",
                subtitle:
                  "Discover the next-generation career advancement toolkit built directly into JKS Learning.",
                discountCode: "PROLAUNCH",
                expiresIn: "Available for All Learners",
                ctaText: "Explore Now",
                ctaLink: "/dashboard/courses",
                secondaryCtaText: "Learn More",
                secondaryCtaLink: "/dashboard",
                bgGradient: "from-blue-600 via-indigo-600 to-purple-700",
                accentColor: "#38BDF8",
                enabled: true,
                type: "custom",
              });
            }}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 hover:scale-[1.02] active:scale-98 transition-all cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Banner / Ad</span>
          </button>
        </div>
      </div>

      {/* Quick Add Presets: AI Interview & Resume Maker */}
      <div className="rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 p-4 dark:border-slate-800 dark:bg-surface-secondary/70">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white">
            <Sparkles className="h-4 w-4 text-[#2563EB]" />
            <span>Quick-Insert Recommended Feature Advertisements (Default Promos)</span>
          </div>
          <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
            Click to instantiate
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {QUICK_FEATURE_TEMPLATES.map((tpl, i) => (
            <div
              key={i}
              onClick={() => handleApplyTemplate(tpl)}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200/80 bg-white p-3 hover:border-[#2563EB] hover:shadow-md cursor-pointer transition-all dark:border-slate-800 dark:bg-surface-elevated"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-[#2563EB] dark:text-blue-400">
                  {tpl.type === "feature" ? (
                    <Bot className="h-3 w-3" />
                  ) : (
                    <Gift className="h-3 w-3" />
                  )}
                  <span>{tpl.tag}</span>
                </div>
                <div className="font-bold text-xs text-slate-900 dark:text-white truncate mt-0.5">
                  {tpl.title}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  CTA: {tpl.ctaText} → {tpl.ctaLink}
                </div>
              </div>
              <Plus className="h-4 w-4 text-slate-400 shrink-0 group-hover:text-[#2563EB]" />
            </div>
          ))}
        </div>
      </div>

      {/* Live Preview Box of the Selected Active Banner */}
      {activePreview && (
        <div className="rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs dark:border-slate-800 dark:bg-surface-secondary">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 mb-3">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#2563EB]" />
              <span>Live Student Dashboard Preview:</span>
              <span className="text-slate-900 dark:text-white font-extrabold truncate">
                {activePreview.title}
              </span>
            </div>
            {activePreview.enabled === false && (
              <span className="rounded-md bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                Currently Inactive / Hidden
              </span>
            )}
          </div>

          {/* Mini preview replica */}
          <div className="relative overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white via-white to-blue-50/40 p-5 shadow-sm dark:border-slate-800 dark:bg-surface-elevated">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="max-w-xl space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 border border-amber-500/25 px-2.5 py-0.5 text-[11px] font-extrabold uppercase text-amber-600 dark:text-amber-400">
                    <Flame className="h-3 w-3 fill-amber-500" /> {activePreview.tag}
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#2563EB]/10 border border-[#2563EB]/20 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
                    <Tag className="h-3 w-3" /> {activePreview.badge}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  {activePreview.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                  {activePreview.subtitle}
                </p>

                <div className="flex items-center gap-3 pt-1">
                  <div className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[#2563EB] bg-blue-50/70 px-2.5 py-1 text-xs font-bold text-[#2563EB] dark:border-blue-500/40 dark:bg-blue-950/40 dark:text-blue-400">
                    <span>Coupon:</span>
                    <span className="font-black text-slate-900 dark:text-white bg-white dark:bg-surface-secondary px-1.5 py-0.2 rounded">
                      {activePreview.discountCode}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {activePreview.expiresIn}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <div className="inline-flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-sm">
                  <Gift className="h-3.5 w-3.5" />
                  <span>{activePreview.ctaText}</span>
                </div>
                <div className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:bg-surface-secondary dark:text-slate-200">
                  <span>{activePreview.secondaryCtaText || "Explore All"}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main List of Configured Banners */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Current Banners in Rotation ({banners.length})
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Use arrows to reorder display sequence
          </span>
        </div>

        <div className="space-y-3">
          {banners.map((slide, index) => {
            const isEnabled = slide.enabled !== false;
            const isPreviewing = previewSlideId === slide.id;

            return (
              <div
                key={slide.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                  isPreviewing
                    ? "border-[#2563EB] bg-blue-50/20 shadow-sm dark:border-blue-500 dark:bg-blue-950/20"
                    : "border-slate-200/80 bg-white hover:border-slate-300 dark:border-slate-800 dark:bg-surface-secondary"
                } ${!isEnabled ? "opacity-60" : ""}`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  {/* Sequence Position & Order controls */}
                  <div className="flex flex-col items-center justify-center shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, "up")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-[11px] font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                      {index + 1}
                    </span>
                    <button
                      type="button"
                      disabled={index === banners.length - 1}
                      onClick={() => handleMove(index, "down")}
                      className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Banner Content Meta */}
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                        {slide.tag}
                      </span>
                      <span className="rounded-md bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-[10px] font-bold text-primary-blue dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/40">
                        {slide.badge}
                      </span>
                      {slide.type === "feature" && (
                        <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200/50">
                          Feature Promo
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {slide.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 max-w-xl">
                      {slide.subtitle}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="font-semibold text-[#2563EB] dark:text-blue-400">
                        CTA: {slide.ctaText} ({slide.ctaLink})
                      </span>
                      <span>•</span>
                      <span>Code: {slide.discountCode}</span>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                  <button
                    type="button"
                    onClick={() => setPreviewSlideId(slide.id)}
                    className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold transition-colors cursor-pointer ${
                      isPreviewing
                        ? "border-[#2563EB] bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300"
                        : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleEnabled(slide.id)}
                    className={`flex h-8 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-semibold cursor-pointer transition-colors ${
                      isEnabled
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-slate-200 bg-slate-100 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                    }`}
                  >
                    <div
                      className={`h-2 w-2 rounded-full ${
                        isEnabled ? "bg-emerald-500" : "bg-slate-400"
                      }`}
                    />
                    <span>{isEnabled ? "Active" : "Disabled"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDuplicate(slide)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 transition-colors cursor-pointer"
                    title="Duplicate slide"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setEditingSlide(slide)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-blue-200 bg-blue-50 text-[#2563EB] hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950/50 dark:text-blue-300 transition-colors cursor-pointer"
                    title="Edit banner"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(slide.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/50 dark:text-rose-300 transition-colors cursor-pointer"
                    title="Delete banner"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Slide Editor Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-2xl max-h-[calc(100dvh-2rem)] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-surface-secondary">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4 bg-slate-50/70 dark:bg-surface-elevated shrink-0">
              <div className="flex items-center gap-2">
                <Edit2 className="h-4 w-4 text-[#2563EB]" />
                <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white">
                  {banners.some((b) => b.id === editingSlide.id)
                    ? "Edit Dashboard Banner / Advertisement"
                    : "Create New Dashboard Banner"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSlide(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-800 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSaveSlideForm} className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Category Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.tag}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, tag: e.target.value })
                    }
                    placeholder="e.g. AI Practice Suite, Bundle Deal"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Promo Badge
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.badge}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, badge: e.target.value })
                    }
                    placeholder="e.g. 50% OFF, Instant Readiness Report"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Headline Title
                </label>
                <input
                  type="text"
                  required
                  value={editingSlide.title}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, title: e.target.value })
                  }
                  placeholder="e.g. Enterprise AI Mock Interview Simulator"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                  Subtitle / Value Proposition
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingSlide.subtitle}
                  onChange={(e) =>
                    setEditingSlide({ ...editingSlide, subtitle: e.target.value })
                  }
                  placeholder="Summarize the core benefits and outcome for students..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Coupon Code / Feature Tag
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.discountCode}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, discountCode: e.target.value })
                    }
                    placeholder="e.g. AIMOCKPRO or JKS50"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Expiry / Availability Text
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.expiresIn}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, expiresIn: e.target.value })
                    }
                    placeholder="e.g. Unlimited Practice for Enrolled Learners"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Primary CTA Button Text
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaText}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaText: e.target.value })
                    }
                    placeholder="e.g. Launch AI Interview"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Primary CTA Link
                  </label>
                  <input
                    type="text"
                    required
                    value={editingSlide.ctaLink}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, ctaLink: e.target.value })
                    }
                    placeholder="e.g. /dashboard/ai-interview"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Secondary CTA Text (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaText || ""}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        secondaryCtaText: e.target.value,
                      })
                    }
                    placeholder="e.g. Explore All or View Sample Report"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                    Secondary CTA Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaLink || ""}
                    onChange={(e) =>
                      setEditingSlide({
                        ...editingSlide,
                        secondaryCtaLink: e.target.value,
                      })
                    }
                    placeholder="e.g. /dashboard/courses"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white"
                  />
                </div>
              </div>

              {/* Color Scheme Preset */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">
                  Color Accent & Gradient Preset
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {GRADIENT_PRESETS.map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() =>
                        setEditingSlide({
                          ...editingSlide,
                          bgGradient: p.bgGradient,
                          accentColor: p.accentColor,
                        })
                      }
                      className={`flex items-center gap-2 rounded-xl border p-2 text-left text-xs font-medium cursor-pointer transition-all ${
                        editingSlide.bgGradient === p.bgGradient
                          ? "border-[#2563EB] ring-2 ring-blue-500/20 bg-blue-50/30 dark:bg-blue-950/30"
                          : "border-slate-200 bg-white hover:border-slate-300 dark:border-slate-700 dark:bg-surface-elevated"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full bg-gradient-to-r ${p.bgGradient} shrink-0 shadow-2xs`}
                      />
                      <span className="truncate text-[11px] text-slate-700 dark:text-slate-300 font-semibold">
                        {p.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Switch */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingSlide.enabled !== false}
                    onChange={(e) =>
                      setEditingSlide({ ...editingSlide, enabled: e.target.checked })
                    }
                    className="h-4 w-4 accent-[#2563EB] cursor-pointer"
                  />
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    Enable this slide in dashboard carousel rotation immediately
                  </span>
                </label>
              </div>

              {/* Footer Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingSlide(null)}
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-all cursor-pointer"
                >
                  Save Banner Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
