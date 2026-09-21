"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Sparkles,
  Users,
  Search,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Trophy,
  Code2,
  MessageSquare,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { motion } from "framer-motion";
import { fetchPublicEvents, type EventItem, type EventMode } from "@/lib/data/events-api";

export default function PublicEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modeFilter, setModeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchPublicEvents();
      setEvents(data);
      setIsLoading(false);
    }
    load();
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter((e) => {
      const matchMode = modeFilter === "ALL" || e.mode === modeFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q) ||
        (e.speakerName && e.speakerName.toLowerCase().includes(q));
      return matchMode && matchSearch;
    });
  }, [events, modeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-white transition-colors duration-200">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28">
        {/* Ambient Glows */}
        <div className="pointer-events-none absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-blue-500/10 dark:bg-blue-600/15 blur-[120px]" />
        <div className="pointer-events-none absolute top-1/3 right-10 h-[350px] w-[350px] rounded-full bg-purple-500/5 dark:bg-purple-600/10 blur-[100px]" />

        <div className="relative mx-auto max-w-[1280px] px-6 lg:px-16 text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 dark:border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 backdrop-blur-md"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Official Masterclasses &amp; Workshops</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-slate-900 dark:text-white"
          >
            Learn Live from{" "}
            <span className="bg-gradient-to-r from-[#1E5EFF] via-indigo-500 to-purple-600 dark:from-blue-400 dark:via-indigo-300 dark:to-purple-400 bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto max-w-2xl text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed"
          >
            Level up your software engineering skills with hands-on live webinars, system design workshops,
            and career strategy sessions hosted by JKS Learning mentors.
          </motion.p>
        </div>
      </section>

      {/* Main Content & Events Grid */}
      <section className="relative mx-auto max-w-[1280px] px-6 lg:px-16 pb-24">
        {/* Filter Controls Strip */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/80 dark:bg-white/5 p-3 shadow-xs dark:shadow-none backdrop-blur-md mb-10">
          {/* Mode Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: "ALL", label: "All Formats" },
              { id: "ONLINE", label: "Online (Live Stream)" },
              { id: "OFFLINE", label: "In-Person Workshops" },
              { id: "HYBRID", label: "Hybrid" },
            ].map((tab) => {
              const active = modeFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setModeFilter(tab.id)}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    active
                      ? "bg-[#1E5EFF] text-white shadow-md shadow-blue-500/25"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search masterclasses or speakers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-900/60 pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>

        {/* Events Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E5EFF] border-t-transparent" />
            <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Loading upcoming masterclasses...</p>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 dark:border-white/10 bg-white dark:bg-white/5 py-20 text-center shadow-xs dark:shadow-none">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-[#1E5EFF] dark:text-blue-400 border border-blue-500/20">
              <Calendar className="h-7 w-7" />
            </div>
            <h3 className="mt-4 text-lg font-bold text-slate-900 dark:text-white">No events scheduled at this moment</h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {searchQuery || modeFilter !== "ALL"
                ? "No masterclasses matched your current filter criteria. Try resetting filters."
                : "New technical sessions are being scheduled. Check back soon or stay tuned via our newsletter."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const startDate = new Date(event.startDate);
              const dateStr = startDate.toLocaleDateString("en-IN", {
                weekday: "short",
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              const timeStr = startDate.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              });

              return (
                <div
                  key={event.id}
                  className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/90 dark:border-white/10 bg-white dark:bg-[#0F1C3F]/60 backdrop-blur-md overflow-hidden hover:border-blue-500/50 hover:shadow-xl dark:hover:shadow-[0_8px_30px_rgba(30,94,255,0.15)] transition-all duration-300 shadow-sm"
                >
                  {/* Event Poster / Banner Top */}
                  <div className="relative h-44 w-full overflow-hidden bg-gradient-to-br from-blue-900 via-indigo-950 to-slate-950 flex items-center justify-center">
                    {event.bannerUrl ? (
                      <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-radial from-blue-600/30 to-transparent flex flex-col items-center justify-center p-6 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/20 border border-blue-400/30 text-blue-300 mb-2">
                          <Code2 className="h-6 w-6" />
                        </div>
                        <span className="text-xs font-bold text-blue-300 uppercase tracking-widest">
                          JKS Live Masterclass
                        </span>
                      </div>
                    )}

                    {/* Mode Tag Badge */}
                    <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-slate-950/80 border border-white/10 px-3 py-1 text-[11px] font-bold text-blue-400 backdrop-blur-md">
                      {event.mode === "ONLINE" ? (
                        <Video className="h-3 w-3 text-blue-400" />
                      ) : (
                        <MapPin className="h-3 w-3 text-purple-400" />
                      )}
                      <span>{event.mode}</span>
                    </div>

                    {/* Seat status badge */}
                    {event.isSoldOut ? (
                      <div className="absolute top-3 right-3 z-10 rounded-full bg-rose-500 px-3 py-1 text-[11px] font-black text-white shadow-md">
                        Sold Out
                      </div>
                    ) : event.availableSpots && event.availableSpots <= 15 ? (
                      <div className="absolute top-3 right-3 z-10 rounded-full bg-amber-500 px-3 py-1 text-[11px] font-black text-slate-950 shadow-md">
                        Only {event.availableSpots} Spots Left!
                      </div>
                    ) : null}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Date & Time Pill */}
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#1E5EFF] dark:text-blue-400 mb-2.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>
                          {dateStr} · {timeStr} IST
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#1E5EFF] dark:group-hover:text-blue-400 transition-colors line-clamp-2 leading-snug">
                        {event.title}
                      </h3>

                      {/* Description */}
                      <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                        {event.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-white/10 space-y-4">
                      {/* Speaker Strip */}
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-500/20 text-[#1E5EFF] dark:text-blue-400 font-bold border border-blue-200 dark:border-blue-500/30 text-xs">
                          {event.speakerName ? event.speakerName.slice(0, 2).toUpperCase() : "JK"}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {event.speakerName || "JKS Principal Faculty"}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {event.speakerRole || "Senior Industry Mentor"}
                          </div>
                        </div>
                      </div>

                      {/* CTA Button */}
                      <Link
                        href={`/events/${event.slug}`}
                        className={`flex items-center justify-center gap-2 w-full rounded-xl py-2.5 text-xs font-bold transition-all shadow-xs ${
                          event.isSoldOut
                            ? "bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700"
                            : "bg-[#1E5EFF] text-white hover:bg-blue-600 shadow-blue-500/20 hover:scale-[1.02]"
                        }`}
                      >
                        <span>{event.isSoldOut ? "View Event Details" : "Register Free Now"}</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Value Props Section */}
      <section className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-slate-950/40 py-20 transition-colors">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
          <div className="text-center max-w-xl mx-auto mb-14">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">Why Attend JKS Masterclasses?</h2>
            <p className="mt-2 text-xs text-slate-600 dark:text-slate-400">
              Interactive, practical, and designed directly around real-world tech hiring standards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/5 p-5 space-y-2 shadow-xs dark:shadow-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#1E5EFF] dark:text-blue-400">
                <Code2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Hands-on Code Labs</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Live building of production microservices, React state architectures, and automated pipelines.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/5 p-5 space-y-2 shadow-xs dark:shadow-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                <MessageSquare className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Live Q&amp;A Mentorship</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Direct access to top developers and architects to get your career and architecture questions answered.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/5 p-5 space-y-2 shadow-xs dark:shadow-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Trophy className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Verified Participation</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Earn JKS credentials and digital attendance badges verifiable on LinkedIn and resumes.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50/70 dark:bg-white/5 p-5 space-y-2 shadow-xs dark:shadow-none">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">100% Free Registration</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Free community upskilling as part of JKS Learning's technical development initiative.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
