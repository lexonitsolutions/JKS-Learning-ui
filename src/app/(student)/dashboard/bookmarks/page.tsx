"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bookmark,
  BookOpen,
  PlayCircle,
  ClipboardCheck,
  ExternalLink,
  Trash2,
  Sparkles,
  ArrowRight,
  Code2,
  Layers,
  FileText,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";

interface BookmarkItem {
  id: string;
  title: string;
  course: string;
  category: "Lectures" | "Assignments" | "Cheat Sheets" | "Interview Questions";
  type: string;
  duration: string;
  url: string;
  savedOn: string;
}

const INITIAL_BOOKMARKS: BookmarkItem[] = [
  {
    id: "bm-1",
    title: "Spring Boot Microservices & Service Discovery (Eureka)",
    course: "Java Full Stack Developer Mastery",
    category: "Lectures",
    type: "Video Lecture",
    duration: "45 mins",
    url: "/dashboard/my-courses/java-full-stack-mastery",
    savedOn: "Aug 24, 2026",
  },
  {
    id: "bm-2",
    title: "React Server Components & Streaming SSR Deep Dive",
    course: "Modern Frontend Engineering with React",
    category: "Lectures",
    type: "Video Lecture",
    duration: "38 mins",
    url: "/dashboard/my-courses/modern-frontend-engineering",
    savedOn: "Aug 22, 2026",
  },
  {
    id: "bm-3",
    title: "Top 50 Java Concurrency & Multithreading Interview Questions",
    course: "Java Full Stack Developer Mastery",
    category: "Interview Questions",
    type: "Interview Guide",
    duration: "15 questions",
    url: "/dashboard/ai-interview",
    savedOn: "Aug 20, 2026",
  },
  {
    id: "bm-4",
    title: ".NET Entity Framework Core Performance Optimization Checklist",
    course: ".NET Full Stack & Azure Cloud Mastery",
    category: "Cheat Sheets",
    type: "Resource",
    duration: "10 mins read",
    url: "/dashboard/my-courses/dotnet-full-stack-developer",
    savedOn: "Aug 18, 2026",
  },
];

const TABS = ["All Bookmarks", "Lectures", "Assignments", "Interview Questions", "Cheat Sheets"];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(INITIAL_BOOKMARKS);
  const [activeTab, setActiveTab] = useState("All Bookmarks");

  const filteredBookmarks =
    activeTab === "All Bookmarks"
      ? bookmarks
      : bookmarks.filter((b) => b.category === activeTab);

  const handleRemoveBookmark = (id: string) => {
    setBookmarks(bookmarks.filter((b) => b.id !== id));
  };

  return (
    <>
      <DashboardTopbar
        title="Bookmarks"
        subtitle="Quick access to your saved lectures, assignments, and interview cheat sheets."
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Header with Title and Filter Tabs */}
        <Reveal variant="fade-up">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-lg font-bold text-slate-900">
              <Bookmark className="h-5 w-5 text-orange-500 fill-orange-500" />
              <span>Saved Bookmarks</span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              {TABS.map((tab) => {
                const isSelected = activeTab === tab;
                return (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      isSelected
                        ? "bg-[#2563EB] text-white shadow-xs"
                        : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>
        </Reveal>

        {/* Bookmarks Grid or Empty State */}
        {filteredBookmarks.length > 0 ? (
          <Reveal variant="stagger" className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {filteredBookmarks.map((bm) => (
              <TiltCard key={bm.id}>
                <div className="flex flex-col justify-between rounded-[20px] border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md">
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-[#2563EB]">
                        {bm.type} · {bm.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveBookmark(bm.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer"
                        title="Remove Bookmark"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <h3 className="mt-3 text-sm sm:text-base font-bold text-slate-900 leading-snug">
                      {bm.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 font-medium">{bm.course}</p>
                  </div>

                  <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                    <span className="text-[11px] text-slate-400 font-medium">Saved on {bm.savedOn}</span>
                    <Link
                      href={bm.url}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all hover:scale-[1.02]"
                    >
                      <span>Open Lesson</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        ) : (
          /* Empty State Matching Reference Image 5 */
          <Reveal variant="fade-up">
            <div className="flex flex-col items-center justify-center rounded-[24px] border border-white/70 bg-white/80 p-12 text-center shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl min-h-[380px]">
              {/* Circular Bookmark Icon Badge */}
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-amber-500 shadow-inner">
                <Bookmark className="h-9 w-9 fill-amber-400 text-amber-500 stroke-[1.8]" />
              </div>

              <h3 className="mt-5 text-xl font-extrabold text-slate-900">No bookmarks yet</h3>
              <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-slate-500 leading-relaxed font-medium">
                Start bookmarking resources from your enrolled courses to save them here for quick access.
              </p>

              <Link
                href="/dashboard/my-courses"
                className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#EA580C] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:bg-orange-600 transition-all hover:scale-105"
              >
                Browse Courses
              </Link>
            </div>
          </Reveal>
        )}
      </div>
    </>
  );
}
