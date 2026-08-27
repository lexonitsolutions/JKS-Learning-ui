"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Quote,
  TrendingUp,
  Award,
  CheckCircle2,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Building,
  GraduationCap,
} from "lucide-react";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Badge } from "@/components/ui/badge";
import { TESTIMONIALS, type Testimonial, type CareerCategory } from "@/lib/data/testimonials";
import type { Track } from "@/lib/data/courses";

const TRACKS: { label: string; value: "All" | Track }[] = [
  { label: "All Tracks", value: "All" },
  { label: "SAP Ecosystem", value: "SAP" },
  { label: "Java Full Stack", value: "Full Stack" },
  { label: "Frontend Engineering", value: "Frontend" },
];

const CATEGORIES: { label: string; value: "All" | CareerCategory }[] = [
  { label: "All Transitions", value: "All" },
  { label: "Career Switchers", value: "Career Switch" },
  { label: "Tier-1 Placements", value: "Tier-1 Placement" },
  { label: "Fast Promotions", value: "Promotion" },
  { label: "Fresher to Pro", value: "Fresher to Pro" },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function getTrackBadgeVariant(track: Track): "primary" | "neutral" | "success" {
  switch (track) {
    case "SAP":
      return "primary";
    case "Full Stack":
      return "success";
    case "Frontend":
      return "neutral";
    default:
      return "primary";
  }
}

export function SuccessStoriesExplorer() {
  const [selectedTrack, setSelectedTrack] = useState<"All" | Track>("All");
  const [selectedCategory, setSelectedCategory] = useState<"All" | CareerCategory>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [spotlightStoryId, setSpotlightStoryId] = useState<string>("priya-nair");

  const filteredStories = useMemo(() => {
    return TESTIMONIALS.filter((story) => {
      const matchTrack = selectedTrack === "All" || story.track === selectedTrack;
      const matchCategory = selectedCategory === "All" || story.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        story.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.placedCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.capstone.toLowerCase().includes(searchQuery.toLowerCase());

      return matchTrack && matchCategory && matchSearch;
    });
  }, [selectedTrack, selectedCategory, searchQuery]);

  const spotlightStory = useMemo(() => {
    return TESTIMONIALS.find((s) => s.id === spotlightStoryId) || TESTIMONIALS[0];
  }, [spotlightStoryId]);

  return (
    <section id="stories-explorer" className="py-20 lg:py-28 bg-bg-light/60">
      <div className="mx-auto max-w-[1320px] px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 pb-12 border-b border-border">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-primary-blue/20 bg-primary-blue/5 px-3 py-1 text-xs font-semibold text-primary-blue">
              <Sparkles className="h-3.5 w-3.5" /> Alumni Directory
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-heading mt-3">
              Explore Verified Alumni Transitions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-text-body max-w-xl">
              Filter by engineering domain, transition type, or target hiring partners to see how
              learners accelerated their careers.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-text-body/60" />
            <input
              type="text"
              placeholder="Search alumni, roles, companies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-border bg-white pl-10 pr-4 py-2.5 text-sm text-text-heading shadow-xs placeholder:text-text-body/50 focus:border-primary-blue focus:outline-none focus:ring-2 focus:ring-primary-blue/10 transition-all"
            />
          </div>
        </div>

        {/* Filter Controls */}
        <div className="mt-8 flex flex-col gap-4">
          {/* Domain Track Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-text-heading mr-2 uppercase tracking-wider">
              Domain:
            </span>
            {TRACKS.map((t) => (
              <button
                key={t.value}
                onClick={() => setSelectedTrack(t.value)}
                className={`rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                  selectedTrack === t.value
                    ? "bg-primary-blue text-white shadow-sm shadow-blue-500/20"
                    : "bg-white border border-border text-text-body hover:bg-slate-50 hover:text-text-heading"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Career Category Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-text-heading mr-2 uppercase tracking-wider">
              Type:
            </span>
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                onClick={() => setSelectedCategory(c.value)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                  selectedCategory === c.value
                    ? "bg-slate-900 text-white"
                    : "bg-white/80 border border-border/80 text-text-body hover:bg-white hover:text-text-heading"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Spotlight Career Deep-Dive */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-blue-200/80 bg-gradient-to-br from-white via-blue-50/40 to-cyan-50/20 p-6 sm:p-8 lg:p-10 shadow-lg shadow-blue-500/5">
          <div className="flex items-center gap-2 text-xs font-bold text-primary-blue uppercase tracking-wider mb-6">
            <Sparkles className="h-4 w-4 text-amber-500" /> Featured Career Transformation Spotlight
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Candidate Info & Journey */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 sm:h-16 sm:w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-blue to-indigo-600 text-xl font-bold text-white shadow-md">
                  {getInitials(spotlightStory.name)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl sm:text-2xl font-bold text-text-heading">
                      {spotlightStory.name}
                    </h3>
                    <Badge variant="success" className="gap-1 font-semibold">
                      <CheckCircle2 className="h-3 w-3" /> Placed {spotlightStory.hiredYear}
                    </Badge>
                  </div>
                  <p className="text-sm font-semibold text-primary-blue mt-0.5">
                    {spotlightStory.role}
                  </p>
                  <p className="text-xs text-text-body flex items-center gap-1.5 mt-1">
                    <Building className="h-3.5 w-3.5 text-text-body/60" /> {spotlightStory.company}
                  </p>
                </div>
              </div>

              {/* Quote */}
              <div className="relative rounded-2xl border border-border/80 bg-white/90 p-5 shadow-xs">
                <Quote className="h-6 w-6 text-primary-blue/30 mb-2" />
                <p className="text-sm sm:text-base text-text-body italic leading-relaxed">
                  &ldquo;{spotlightStory.quote}&rdquo;
                </p>
                {spotlightStory.highlightText && (
                  <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg p-2 border border-emerald-200/60">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                    <span>{spotlightStory.highlightText}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Metrics & Capstone Breakdown */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Transition Before vs After Card */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
                <div className="text-xs uppercase font-bold tracking-wider text-text-body/70 mb-3">
                  Career Trajectory
                </div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-xs text-text-body">Previous</div>
                    <div className="font-semibold text-text-heading mt-0.5">
                      {spotlightStory.previousRole}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-primary-blue shrink-0" />
                  <div className="text-right">
                    <div className="text-xs text-emerald-600 font-semibold">Offer Package</div>
                    <div className="font-bold text-text-heading text-emerald-600 mt-0.5">
                      {spotlightStory.salaryPackage || "Tier-1 Offer"}
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Interview Growth & Capstone Card */}
              <div className="rounded-2xl border border-border bg-white p-5 shadow-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-text-body font-medium">AI Mock Interview Growth</div>
                    <div className="text-lg font-extrabold text-primary-blue mt-0.5 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span>{spotlightStory.scoreDelta}</span>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        +
                        {spotlightStory.finalScore && spotlightStory.initialScore
                          ? spotlightStory.finalScore - spotlightStory.initialScore
                          : 28}{" "}
                        pts
                      </span>
                    </div>
                  </div>
                  {spotlightStory.salaryHike && (
                    <span className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-xs font-bold text-amber-700">
                      {spotlightStory.salaryHike}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-border/70">
                  <div className="text-[11px] font-semibold text-text-body/70 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-primary-blue" /> Verified Capstone
                  </div>
                  <div className="text-xs font-bold text-text-heading mt-1">
                    {spotlightStory.capstone}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stories Grid */}
        <div className="mt-12">
          {filteredStories.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-white p-12 text-center">
              <GraduationCap className="mx-auto h-12 w-12 text-text-body/40" />
              <h3 className="text-base font-bold text-text-heading mt-4">
                No matching alumni stories found
              </h3>
              <p className="text-xs text-text-body mt-1">
                Try loosening your search filters or select &ldquo;All Tracks&rdquo;.
              </p>
              <button
                onClick={() => {
                  setSelectedTrack("All");
                  setSelectedCategory("All");
                  setSearchQuery("");
                }}
                className="mt-4 rounded-lg bg-primary-blue px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-primary-blue/90"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence>
                {filteredStories.map((story) => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96 }}
                    transition={{ duration: 0.4 }}
                  >
                    <TiltCard className="group flex h-full flex-col justify-between rounded-2xl border border-border bg-white p-6 shadow-xs hover:border-primary-blue/40 hover:shadow-xl transition-all duration-300">
                      <div>
                        {/* Top Meta Header */}
                        <div className="flex items-start justify-between gap-3">
                          <Badge variant={getTrackBadgeVariant(story.track)}>
                            {story.track}
                          </Badge>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-semibold text-text-body">
                            {story.category}
                          </span>
                        </div>

                        {/* Candidate Bio Header */}
                        <div className="mt-5 flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary-blue/10 to-blue-600/10 font-bold text-primary-blue border border-primary-blue/20">
                            {getInitials(story.name)}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-bold text-text-heading text-sm truncate">
                                {story.name}
                              </h4>
                              {story.verified && (
                                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                              )}
                            </div>
                            <p className="text-xs font-medium text-text-body truncate">
                              {story.role}
                            </p>
                          </div>
                        </div>

                        {/* Placement Info Banner */}
                        <div className="mt-4 rounded-xl bg-bg-light p-3 border border-border/60">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-semibold text-text-heading truncate">
                              {story.placedCompany}
                            </span>
                            {story.salaryPackage && (
                              <span className="font-bold text-emerald-600 shrink-0">
                                {story.salaryPackage}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 flex items-center justify-between text-[11px] text-text-body">
                            <span>Prev: {story.previousRole}</span>
                            {story.salaryHike && (
                              <span className="font-medium text-amber-700">
                                {story.salaryHike}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quote */}
                        <p className="mt-4 text-xs sm:text-sm text-text-body line-clamp-3 leading-relaxed">
                          &ldquo;{story.quote}&rdquo;
                        </p>
                      </div>

                      {/* Bottom Footer Section */}
                      <div className="mt-6 pt-4 border-t border-border/70 flex flex-col gap-3">
                        {/* Score Delta Indicator */}
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 font-semibold text-emerald-600">
                            <TrendingUp className="h-3.5 w-3.5" />
                            <span>AI Readiness {story.scoreDelta}</span>
                          </div>
                          <button
                            onClick={() => {
                              setSpotlightStoryId(story.id);
                              const el = document.getElementById("stories-explorer");
                              if (el) el.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="text-[11px] font-semibold text-primary-blue hover:underline flex items-center gap-0.5 cursor-pointer"
                          >
                            Deep dive <ChevronRight className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Capstone Tag */}
                        <div className="flex items-center gap-1.5 text-[11px] text-text-body/80 truncate">
                          <Award className="h-3 w-3 text-primary-blue shrink-0" />
                          <span className="truncate">{story.capstone}</span>
                        </div>
                      </div>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
