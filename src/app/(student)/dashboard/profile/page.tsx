"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import {
  Pencil,
  Camera,
  ExternalLink,
  Flame,
  CheckCircle2,
  Info,
  ChevronDown,
  Plus,
  Code2,
  Globe,
  Award,
  BookOpen,
  BrainCircuit,
  Save,
  X,
  Sparkles,
  Link2,
  Upload,
  Image as ImageIcon,
  Palette,
} from "lucide-react";

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

function LinkedinIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
    </svg>
  );
}

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { getClientSessionEmail } from "@/lib/data/enrollments-api";
import { fetchStudentDetail } from "@/lib/data/students-api";

// Preset Banner Themes for Quick LinkedIn-style Cover Customization
const BANNER_PRESETS = [
  {
    id: "preset-orange",
    label: "Sunset Aurora",
    className: "bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600",
  },
  {
    id: "preset-blue",
    label: "Enterprise Blue",
    className: "bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700",
  },
  {
    id: "preset-cyber",
    label: "Cyber Matrix",
    className: "bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-900",
  },
  {
    id: "preset-dark",
    label: "Dark Mesh Tech",
    className: "bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950",
  },
  {
    id: "preset-purple",
    label: "Vibrant Violet",
    className: "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600",
  },
];

const PRESET_AVATARS = [
  "/images/hero-developer.png",
  "/images/student-3d-developer.png",
];

const STORAGE_KEYS = {
  PROFILE_NAME: "jks_student_name_v2",
  PROFILE_ROLE: "jks_student_role_v2",
  PROFILE_BIO: "jks_student_bio_v2",
  PROFILE_LOC: "jks_student_loc_v2",
  PROFILE_AVATAR: "jks_student_avatar_v2",
  PROFILE_BANNER_TYPE: "jks_student_banner_type_v2", // "preset" | "image"
  PROFILE_BANNER_VAL: "jks_student_banner_val_v2",
};

export default function StudentProfilePage() {
  const session = useMockSession();
  const effectiveEmail = session?.email || getClientSessionEmail();

  // Profile State
  const [name, setName] = useState(session?.name || "Student Learner");
  const [role, setRole] = useState("Enterprise Full Stack Developer");
  const [bio, setBio] = useState("Passionate software engineer building resilient enterprise web applications.");
  const [location, setLocation] = useState("Bengaluru, India");
  const [avatar, setAvatar] = useState("/images/hero-developer.png");
  const [enrolledTrack, setEnrolledTrack] = useState("Java Track");

  // Banner State (Custom image URL or preset gradient class)
  const [bannerType, setBannerType] = useState<"preset" | "image">("preset");
  const [bannerVal, setBannerVal] = useState("bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700");

  // Public/Private Visibility Toggles
  const [isStreakPublic, setIsStreakPublic] = useState(true);
  const [isContributionsPublic, setIsContributionsPublic] = useState(true);
  const [isStatsPublic, setIsStatsPublic] = useState(true);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  // File input refs for uploading
  const bannerFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Load from session, API and localStorage on mount
  useEffect(() => {
    if (session?.name) {
      setName(session.name);
    }

    if (effectiveEmail) {
      fetchStudentDetail(effectiveEmail)
        .then((st) => {
          if (st) {
            if (st.name) setName(st.name);
            if (st.phone && st.phone !== "N/A") setLocation(`${st.phone} · India`);
            if (st.enrollments && st.enrollments.length > 0) {
              setRole(`${st.enrollments[0].courseTitle} Cohort`);
              setEnrolledTrack(`${st.enrollments[0].track || "Full Stack"} Track`);
            }
          }
        })
        .catch(() => {});
    }

    if (typeof window !== "undefined") {
      try {
        const keySuffix = effectiveEmail ? `_${effectiveEmail}` : "";
        const savedName = localStorage.getItem(STORAGE_KEYS.PROFILE_NAME + keySuffix);
        if (savedName) setName(savedName);

        const savedRole = localStorage.getItem(STORAGE_KEYS.PROFILE_ROLE + keySuffix);
        if (savedRole) setRole(savedRole);

        const savedBio = localStorage.getItem(STORAGE_KEYS.PROFILE_BIO + keySuffix);
        if (savedBio) setBio(savedBio);

        const savedLoc = localStorage.getItem(STORAGE_KEYS.PROFILE_LOC + keySuffix);
        if (savedLoc) setLocation(savedLoc);

        const savedAvatar = localStorage.getItem(STORAGE_KEYS.PROFILE_AVATAR + keySuffix);
        if (savedAvatar) setAvatar(savedAvatar);

        const savedBannerType = localStorage.getItem(STORAGE_KEYS.PROFILE_BANNER_TYPE + keySuffix) as "preset" | "image" | null;
        const savedBannerVal = localStorage.getItem(STORAGE_KEYS.PROFILE_BANNER_VAL + keySuffix);
        if (savedBannerType && savedBannerVal) {
          setBannerType(savedBannerType);
          setBannerVal(savedBannerVal);
        }
      } catch {}
    }
  }, [session?.name, session?.email, effectiveEmail]);

  // Save profile updates to localStorage & session cookie
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const keySuffix = effectiveEmail ? `_${effectiveEmail}` : "";
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE_NAME + keySuffix, name);
      localStorage.setItem(STORAGE_KEYS.PROFILE_ROLE + keySuffix, role);
      localStorage.setItem(STORAGE_KEYS.PROFILE_BIO + keySuffix, bio);
      localStorage.setItem(STORAGE_KEYS.PROFILE_LOC + keySuffix, location);
      localStorage.setItem(STORAGE_KEYS.PROFILE_AVATAR + keySuffix, avatar);

      // Update active session cookie so sidebar and topbar update immediately
      if (typeof document !== "undefined") {
        const trimmedName = name.trim();
        const initials =
          trimmedName
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .substring(0, 2) || "ST";

        const updatedSession = {
          email: effectiveEmail || "student@jkslearning.dev",
          name: trimmedName,
          initials,
          role: session?.role || "student",
        };

        document.cookie = `jks_mock_session=${encodeURIComponent(JSON.stringify(updatedSession))}; path=/; max-age=604800; SameSite=Lax`;
        window.dispatchEvent(new Event("jks-mock-session-change"));
      }
    } catch {}
    setIsEditModalOpen(false);
  };

  // Handle Banner Image Upload from File
  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setBannerType("image");
        setBannerVal(result);
        try {
          localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_TYPE, "image");
          localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_VAL, result);
        } catch {
          // ignore
        }
        setIsBannerModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle Avatar Image Upload from File
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
        try {
          localStorage.setItem(STORAGE_KEYS.PROFILE_AVATAR, result);
        } catch {
          // ignore
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Select Preset Banner
  const handleSelectPresetBanner = (presetClass: string) => {
    setBannerType("preset");
    setBannerVal(presetClass);
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_TYPE, "preset");
      localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_VAL, presetClass);
    } catch {
      // ignore
    }
    setIsBannerModalOpen(false);
  };

  // Connected Platforms
  const [connectedPlatforms] = useState([
    { name: "GitHub", username: "jordandsouza", icon: GithubIcon, connected: true },
    { name: "LinkedIn", username: "in/jordandsouza", icon: LinkedinIcon, connected: true },
    { name: "LeetCode", username: "jordan_dev", icon: Code2, connected: false },
  ]);

  // Generate realistic 52-week contribution heatmap data
  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    
    for (let w = 0; w < 48; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        const rand = Math.sin(w * 0.4 + d * 0.8) * 10 + Math.cos(w * 0.2) * 5;
        let level = 0;
        let count = 0;
        if (rand > 8) {
          level = 4;
          count = Math.floor(rand - 3);
        } else if (rand > 4) {
          level = 3;
          count = 4;
        } else if (rand > 1) {
          level = 2;
          count = 2;
        } else if (rand > -2) {
          level = 1;
          count = 1;
        }
        days.push({
          level,
          count,
          date: `Week ${w + 1}, Day ${d + 1}`,
        });
      }
      weeks.push(days);
    }
    return { weeks, months };
  }, []);

  const totalContributions = 248;

  // Question / Problem Solving Metrics
  const STATS_DATA = [
    { label: "Total Solved", solved: 142, total: 182, percent: 78, color: "text-[#2563EB]", stroke: "#2563EB" },
    { label: "Easy Solved", solved: 64, total: 68, percent: 94, color: "text-emerald-600", stroke: "#16A34A" },
    { label: "Medium Solved", solved: 58, total: 76, percent: 76, color: "text-amber-500", stroke: "#D97706" },
    { label: "Hard Solved", solved: 20, total: 38, percent: 53, color: "text-rose-500", stroke: "#E11D48" },
  ];

  const initials =
    session?.initials ||
    name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2) ||
    "ST";

  return (
    <>
      <DashboardTopbar
        title="Student Profile"
        subtitle="Manage your public learning profile, achievements, and contributions ledger."
        userInitials={initials}
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Main Grid Layout: Left Column (Profile & Streaks) + Right Column (Contributions & Stats) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-6 lg:col-span-4">
            {/* Profile Identity Card */}
            <Reveal variant="fade-up">
              <TiltCard>
                <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/85 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  {/* Top Cover Banner (LinkedIn Style with Camera Button) */}
                  <div
                    className={`relative h-28 sm:h-32 w-full transition-all duration-500 overflow-hidden ${
                      bannerType === "preset" ? bannerVal : "bg-slate-900"
                    }`}
                    style={
                      bannerType === "image"
                        ? {
                            backgroundImage: `url(${bannerVal})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }
                        : undefined
                    }
                  >
                    {/* Subtle Overlay Pattern */}
                    <div
                      className="absolute inset-0 opacity-25 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                      }}
                    />

                    {/* Camera Button at Top Right to Add/Change Banner like LinkedIn */}
                    <button
                      type="button"
                      onClick={() => setIsBannerModalOpen(true)}
                      className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-xl bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all hover:scale-105 shadow-md cursor-pointer group"
                      title="Add or Edit Profile Cover Banner"
                    >
                      <Camera className="h-4 w-4 group-hover:scale-110 transition-transform" />
                    </button>
                  </div>

                  {/* Profile Avatar & Info */}
                  <div className="relative px-5 pb-6 text-center">
                    {/* Overlapping Avatar */}
                    <div className="relative mx-auto -mt-12 mb-3 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-900 shadow-md overflow-hidden group">
                      <Image
                        src={avatar}
                        alt={name}
                        width={96}
                        height={96}
                        unoptimized
                        className="h-full w-full object-cover object-top"
                      />

                      {/* Camera Button on Avatar to upload/edit profile picture */}
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                        title="Upload/Edit Profile Picture"
                      >
                        <Camera className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Name & Edit Button */}
                    <div className="flex items-center justify-center gap-2">
                      <h2 className="text-lg font-extrabold text-slate-900">{name}</h2>
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 transition-colors cursor-pointer"
                        title="Edit Profile"
                      >
                        <Pencil className="h-3 w-3" />
                      </button>
                    </div>

                    <p className="mt-0.5 text-xs font-semibold text-[#2563EB]">{role}</p>
                    <p className="mt-2 text-xs text-slate-500 leading-relaxed font-normal">{bio}</p>

                    {/* Details Pill Strip */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 pt-4 text-[11px] font-medium text-slate-600">
                      <span className="flex items-center gap-1 rounded-full bg-slate-50 px-2.5 py-1">
                        <Globe className="h-3 w-3 text-slate-400" /> {location}
                      </span>
                      <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 font-semibold text-[#2563EB]">
                        <BookOpen className="h-3 w-3" /> {enrolledTrack}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Your Streak Card */}
            <Reveal variant="fade-up">
              <TiltCard>
                <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  {/* Streak Card Header with Public Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                      <span>Your Streak</span>
                      <span className="text-base">🚀</span>
                    </div>

                    {/* Interactive Public Toggle */}
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsStreakPublic(!isStreakPublic)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                          isStreakPublic ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            isStreakPublic ? "translate-x-4" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-[11px] font-medium text-slate-400">Public</span>
                    </div>
                  </div>

                  {/* 2 Streak Metric Boxes */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {/* Current Streak */}
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-center">
                      <div className="text-[11px] font-semibold text-slate-600">Current Streak</div>
                      <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-600">
                        12 days
                      </div>
                    </div>

                    {/* Longest Streak */}
                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-center">
                      <div className="text-[11px] font-semibold text-slate-600">Longest Streak</div>
                      <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-500">
                        28 days
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Badges & Verifications Card */}
            <Reveal variant="fade-up">
              <TiltCard>
                <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <Award className="h-4 w-4 text-[#2563EB]" /> Verified Badges
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Anti-Skip Certified
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-[#2563EB]">
                      <BrainCircuit className="h-3.5 w-3.5" /> AI Mock Tier-1
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3 py-1.5 text-xs font-bold text-purple-700">
                      <Sparkles className="h-3.5 w-3.5" /> Stage 4 Master
                    </span>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* ================= RIGHT MAIN AREA ================= */}
          <div className="space-y-6 lg:col-span-8">
            {/* Section 1: Contributions */}
            <Reveal variant="fade-up">
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                {/* Section Header with Hamburger Icon and Public Toggle */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <div className="flex flex-col gap-0.5">
                      <span className="h-0.5 w-4 bg-slate-800 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 rounded-full" />
                    </div>
                    <span>Contributions</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsContributionsPublic(!isContributionsPublic)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        isContributionsPublic ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          isContributionsPublic ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-medium text-slate-400">Public</span>
                  </div>
                </div>

                {/* Connect with Platforms Accordion Bar */}
                <div className="mt-4">
                  <div
                    onClick={() => setIsPlatformModalOpen(!isPlatformModalOpen)}
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100"
                  >
                    <span>Connect with Platforms</span>
                    <Plus className="h-4 w-4 text-slate-400" />
                  </div>

                  {/* Connected Platforms Strip */}
                  {isPlatformModalOpen && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2 rounded-xl border border-slate-100 bg-slate-50/50">
                      {connectedPlatforms.map((p) => {
                        const Icon = p.icon;
                        return (
                          <div
                            key={p.name}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-white border border-slate-200/70 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-slate-700" />
                              <span className="font-semibold text-slate-800">{p.name}</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                p.connected
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 cursor-pointer hover:bg-blue-50 hover:text-[#2563EB]"
                              }`}
                            >
                              {p.connected ? "Linked" : "+ Link"}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Contribution Heatmap Container */}
                <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-4 sm:p-5">
                  {/* Heatmap Meta Bar */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600">
                    <div className="font-bold text-slate-900 text-sm">
                      {totalContributions} contributions in - last year
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600"
                        title="Contributions include watched lectures, completed stage assessments, and AI mock sessions."
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 outline-none cursor-pointer"
                        >
                          <option value="2026">2026</option>
                          <option value="2025">2025</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Heatmap Grid */}
                  <div className="mt-5 overflow-x-auto pb-2">
                    <div className="min-w-[650px]">
                      {/* Months Header */}
                      <div className="flex text-[10px] font-medium text-slate-400 pl-8 mb-1.5 justify-between pr-2">
                        {heatmapWeeks.months.map((m, idx) => (
                          <span key={`${m}-${idx}`}>{m}</span>
                        ))}
                      </div>

                      {/* Days + Grid Matrix */}
                      <div className="flex items-start gap-2">
                        {/* Day labels */}
                        <div className="flex flex-col justify-between text-[9px] font-semibold text-slate-400 h-[100px] py-0.5">
                          <span>Sun</span>
                          <span>Tue</span>
                          <span>Thu</span>
                          <span>Sat</span>
                        </div>

                        {/* Squares Grid */}
                        <div className="grid grid-flow-col grid-rows-7 gap-[3px] flex-1">
                          {heatmapWeeks.weeks.map((week, wIdx) =>
                            week.map((day, dIdx) => {
                              let bg = "bg-slate-100";
                              if (day.level === 1) bg = "bg-emerald-200";
                              if (day.level === 2) bg = "bg-emerald-400";
                              if (day.level === 3) bg = "bg-emerald-500";
                              if (day.level === 4) bg = "bg-emerald-600";

                              return (
                                <div
                                  key={`${wIdx}-${dIdx}`}
                                  onMouseEnter={() => setHoveredDay(day)}
                                  onMouseLeave={() => setHoveredDay(null)}
                                  className={`h-[11px] w-[11px] rounded-[2.5px] ${bg} transition-transform hover:scale-125 cursor-pointer`}
                                />
                              );
                            })
                          )}
                        </div>
                      </div>

                      {/* Heatmap Legend */}
                      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {hoveredDay
                            ? `${hoveredDay.count} activities on ${hoveredDay.date}`
                            : "Daily activity and project submissions"}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px]">Less</span>
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-slate-100" />
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-200" />
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400" />
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600" />
                          <span className="text-[10px]">More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Section 2: Stats (Questions & Assessments Solved) */}
            <Reveal variant="fade-up">
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
                {/* Header with Hamburger icon and Public Toggle */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900">
                    <div className="flex flex-col gap-0.5">
                      <span className="h-0.5 w-4 bg-slate-800 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 rounded-full" />
                    </div>
                    <span>Stats</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsStatsPublic(!isStatsPublic)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        isStatsPublic ? "bg-emerald-500" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          isStatsPublic ? "translate-x-4" : "translate-x-1"
                        }`}
                      />
                    </button>
                    <span className="text-[11px] font-medium text-slate-400">Public</span>
                  </div>
                </div>

                {/* Sub Card: Interview Practice & Stage Assessments */}
                <div className="mt-4 rounded-2xl border border-slate-100 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 sm:text-slate-800">
                      <span>Interview Practice &amp; Stage Assessments</span>
                      <ExternalLink className="h-3 w-3 text-slate-400" />
                    </div>

                    <div className="flex items-center gap-1.5">
                      <div className="h-4 w-7 rounded-full bg-emerald-500 p-0.5">
                        <div className="h-3 w-3 rounded-full bg-white translate-x-3" />
                      </div>
                      <span className="text-[10px] text-slate-400">Public</span>
                    </div>
                  </div>

                  {/* 4 Circular Progress Metrics Grid */}
                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {STATS_DATA.map((s) => {
                      const radius = 24;
                      const circumference = 2 * Math.PI * radius;
                      const strokeDashoffset = circumference - (s.percent / 100) * circumference;

                      return (
                        <div key={s.label} className="flex items-center gap-3">
                          {/* Circular SVG Ring */}
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                            <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 60 60">
                              <circle
                                cx="30"
                                cy="30"
                                r={radius}
                                stroke="#F1F5F9"
                                strokeWidth="4.5"
                                fill="transparent"
                              />
                              <circle
                                cx="30"
                                cy="30"
                                r={radius}
                                stroke={s.stroke}
                                strokeWidth="4.5"
                                strokeDasharray={circumference}
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                fill="transparent"
                                className="transition-all duration-700"
                              />
                            </svg>
                            <span className="absolute text-xs font-extrabold text-slate-800">
                              {s.percent}%
                            </span>
                          </div>

                          {/* Labels */}
                          <div>
                            <div className="text-xs font-bold text-slate-900 leading-tight">
                              {s.label}
                            </div>
                            <div className="mt-0.5 text-[11px] font-medium text-slate-400">
                              {s.solved}/{s.total} solved
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* LINKEDIN-STYLE BANNER CUSTOMIZER MODAL */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setIsBannerModalOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB]">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">Custom Profile Banner</h3>
                <p className="text-xs text-slate-500">
                  Upload your LinkedIn-style banner or pick a developer theme
                </p>
              </div>
            </div>

            {/* Live Banner Preview Box */}
            <div className="mt-4">
              <label className="text-xs font-bold text-slate-700">Preview</label>
              <div
                className={`mt-1.5 h-28 w-full rounded-2xl border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center text-white text-xs font-bold ${
                  bannerType === "preset" ? bannerVal : ""
                }`}
                style={
                  bannerType === "image"
                    ? {
                        backgroundImage: `url(${bannerVal})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              >
                <span>Current Cover Banner</span>
              </div>
            </div>

            {/* Option 1: Upload Custom File */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700">Upload Custom Image</label>
              <input
                type="file"
                ref={bannerFileRef}
                onChange={handleBannerUpload}
                accept="image/*"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => bannerFileRef.current?.click()}
                className="mt-1.5 w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#2563EB] bg-blue-50/50 py-3 text-xs font-bold text-[#2563EB] hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <Upload className="h-4 w-4" />
                <span>Upload from Device (PNG, JPG, WebP)</span>
              </button>
            </div>

            {/* Option 2: Choose Presets */}
            <div className="pt-2">
              <label className="text-xs font-bold text-slate-700">Or Select Designer Themes</label>
              <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
                {BANNER_PRESETS.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => handleSelectPresetBanner(preset.className)}
                    className="flex flex-col items-center gap-1.5 p-2 rounded-xl border border-slate-200 hover:border-[#2563EB] transition-colors cursor-pointer group"
                  >
                    <div className={`h-8 w-full rounded-lg ${preset.className}`} />
                    <span className="text-[11px] font-semibold text-slate-700 group-hover:text-[#2563EB]">
                      {preset.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="rounded-xl bg-slate-900 px-5 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PROFILE EDIT MODAL WITH AVATAR UPLOADER */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-bold text-slate-900">Edit Profile</h3>
            <p className="text-xs text-slate-500">Update your public student credentials and profile photo.</p>

            <form onSubmit={handleSaveProfile} className="mt-5 space-y-4">
              {/* Profile Avatar Upload Section */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
                <label className="text-xs font-bold text-slate-700">Profile Picture</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-full border-2 border-white shadow-md overflow-hidden bg-slate-900">
                    <Image
                      src={avatar}
                      alt="Avatar Preview"
                      width={64}
                      height={64}
                      unoptimized
                      className="h-full w-full object-cover object-top"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      ref={avatarFileRef}
                      onChange={handleAvatarUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => avatarFileRef.current?.click()}
                      className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-1.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer"
                    >
                      <Upload className="h-3.5 w-3.5 text-[#2563EB]" />
                      <span>Upload Custom Photo</span>
                    </button>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-400">Or pick preset:</span>
                      {PRESET_AVATARS.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setAvatar(preset)}
                          className="h-6 w-6 rounded-full border overflow-hidden hover:border-[#2563EB] cursor-pointer"
                        >
                          <Image
                            src={preset}
                            alt="Preset"
                            width={24}
                            height={24}
                            unoptimized
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Full Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Professional Role / Headline</label>
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
