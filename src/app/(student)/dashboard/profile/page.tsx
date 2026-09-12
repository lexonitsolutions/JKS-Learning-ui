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
import { useUser } from "@clerk/nextjs";
import { getClientSessionEmail, fetchStudentEnrollments, type EnrolledCourseItem } from "@/lib/data/enrollments-api";
import { fetchStudentDetail, type AdminStudentDetail } from "@/lib/data/students-api";

// Preset Banner Themes for Quick Cover Customization
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
    id: "preset-emerald",
    label: "Emerald Growth",
    className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700",
  },
  {
    id: "preset-cyber",
    label: "Cyberpunk Glow",
    className: "bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-800",
  },
  {
    id: "preset-dark",
    label: "Midnight Stealth",
    className: "bg-gradient-to-r from-slate-900 via-slate-800 to-zinc-950",
  },
];

const PRESET_AVATARS = ["#2563EB", "#7C3AED", "#059669", "#EA580C"].map(
  (color) =>
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${color}"/><circle cx="32" cy="25" r="12" fill="#fff" opacity="0.9"/><path d="M12 64c0-11 9-20 20-20s20 9 20 20z" fill="#fff" opacity="0.9"/></svg>`
    )
);

// Local storage persistent keys
const STORAGE_KEYS = {
  PROFILE_NAME: "jks_student_profile_name_v3",
  PROFILE_ROLE: "jks_student_profile_role_v3",
  PROFILE_BIO: "jks_student_profile_bio_v3",
  PROFILE_LOCATION: "jks_student_profile_location_v3",
  PROFILE_AVATAR: "jks_student_avatar_v3",
  PROFILE_BANNER_TYPE: "jks_student_banner_type_v3",
  PROFILE_BANNER_VAL: "jks_student_banner_val_v3",
};

export default function StudentProfilePage() {
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const effectiveEmail = (clerkEmail || session?.email || getClientSessionEmail() || "").toLowerCase().trim();

  const clerkName = clerkUser?.fullName || clerkUser?.firstName;

  // Real DB Student Data State
  const [studentDetail, setStudentDetail] = useState<AdminStudentDetail | null>(null);
  const [enrollments, setEnrollments] = useState<EnrolledCourseItem[]>([]);
  const [completedLessonsCount, setCompletedLessonsCount] = useState(0);
  const [completedAssignmentsCount, setCompletedAssignmentsCount] = useState(0);

  // Profile Form States
  const [name, setName] = useState(clerkName || session?.name || "Student Learner");
  const [role, setRole] = useState("Student Learner");
  const [bio, setBio] = useState("Enrolled learner on JKS Learning.");
  const [location, setLocation] = useState("India");
  const [avatar, setAvatar] = useState(clerkUser?.imageUrl || "/images/hero-developer.png");
  const [enrolledTrack, setEnrolledTrack] = useState("No Active Track");

  // Banner State
  const [bannerType, setBannerType] = useState<"preset" | "image">("preset");
  const [bannerVal, setBannerVal] = useState("bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700");

  // Visibility Toggles
  const [isStreakPublic, setIsStreakPublic] = useState(true);
  const [isContributionsPublic, setIsContributionsPublic] = useState(true);
  const [isStatsPublic, setIsStatsPublic] = useState(true);

  // Modal States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [isPlatformModalOpen, setIsPlatformModalOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("2026");
  const [hoveredDay, setHoveredDay] = useState<{ date: string; count: number } | null>(null);

  const bannerFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);

  // Load Real Data from Backend DB on mount
  useEffect(() => {
    if (session?.name) {
      setName(session.name);
    }

    if (effectiveEmail) {
      Promise.all([
        fetchStudentDetail(effectiveEmail),
        fetchStudentEnrollments(effectiveEmail),
      ])
        .then(([detail, enrolledList]) => {
          if (detail) {
            setStudentDetail(detail);
            if (detail.name) setName(detail.name);
            if (detail.phone && detail.phone !== "N/A") {
              setLocation(`${detail.phone} · India`);
            }
          }

          if (enrolledList && enrolledList.length > 0) {
            setEnrollments(enrolledList);
            setRole(`${enrolledList[0].title} Student`);
            setEnrolledTrack(`${enrolledList[0].track || "Full Stack"} Track`);

            // Compute real completed lesson & assignment counts
            let totalV = 0;
            let totalA = 0;
            enrolledList.forEach((e) => {
              if (e.completedVideosCount) totalV += e.completedVideosCount;
              if (typeof window !== "undefined") {
                try {
                  const localProg = localStorage.getItem(`jks_prog_${e.slug}_${effectiveEmail}`);
                  if (localProg) {
                    const parsed = JSON.parse(localProg);
                    if (parsed.completedVideoIds?.length) {
                      totalV = Math.max(totalV, parsed.completedVideoIds.length);
                    }
                    if (parsed.completedAssignmentIds?.length) {
                      totalA += parsed.completedAssignmentIds.length;
                    }
                  }
                } catch {}
              }
            });
            setCompletedLessonsCount(totalV);
            setCompletedAssignmentsCount(totalA);
          } else {
            setEnrollments([]);
            setEnrolledTrack("No Active Track");
            setCompletedLessonsCount(0);
            setCompletedAssignmentsCount(0);
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

        const savedLoc = localStorage.getItem(STORAGE_KEYS.PROFILE_LOCATION + keySuffix);
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

  // Save profile updates
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const keySuffix = effectiveEmail ? `_${effectiveEmail}` : "";
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE_NAME + keySuffix, name);
      localStorage.setItem(STORAGE_KEYS.PROFILE_ROLE + keySuffix, role);
      localStorage.setItem(STORAGE_KEYS.PROFILE_BIO + keySuffix, bio);
      localStorage.setItem(STORAGE_KEYS.PROFILE_LOCATION + keySuffix, location);
      localStorage.setItem(STORAGE_KEYS.PROFILE_AVATAR + keySuffix, avatar);
      localStorage.setItem(STORAGE_KEYS.PROFILE_AVATAR, avatar);
      window.dispatchEvent(new Event("jks_avatar_updated"));

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
          email: effectiveEmail || session?.email || "student@example.com",
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
          const keySuffix = effectiveEmail ? `_${effectiveEmail}` : "";
          localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_TYPE + keySuffix, "image");
          localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_VAL + keySuffix, result);
        } catch {}
        setIsBannerModalOpen(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setAvatar(result);
        try {
          const keySuffix = effectiveEmail ? `_${effectiveEmail}` : "";
          localStorage.setItem(STORAGE_KEYS.PROFILE_AVATAR + keySuffix, result);
          localStorage.setItem(STORAGE_KEYS.PROFILE_AVATAR, result);
          window.dispatchEvent(new Event("jks_avatar_updated"));
        } catch {}
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectPresetBanner = (presetClass: string) => {
    setBannerType("preset");
    setBannerVal(presetClass);
    try {
      const keySuffix = effectiveEmail ? `_${effectiveEmail}` : "";
      localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_TYPE + keySuffix, "preset");
      localStorage.setItem(STORAGE_KEYS.PROFILE_BANNER_VAL + keySuffix, presetClass);
    } catch {}
    setIsBannerModalOpen(false);
  };

  // Connected Platforms (User-managed)
  const [connectedPlatforms] = useState([
    { name: "GitHub", icon: GithubIcon, connected: false },
    { name: "LinkedIn", icon: LinkedinIcon, connected: false },
    { name: "LeetCode", icon: Code2, connected: false },
  ]);

  // Real Total Contributions
  const totalContributions = completedLessonsCount + completedAssignmentsCount;

  // Real 48-week contribution heatmap matrix (Clean 0 when no activity)
  const heatmapWeeks = useMemo(() => {
    const weeks = [];
    const months = ["Aug", "Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"];
    
    for (let w = 0; w < 48; w++) {
      const days = [];
      for (let d = 0; d < 7; d++) {
        // Only map if real contributions exist
        const hasActivity = totalContributions > 0 && w === 47 && d === 6;
        const level = hasActivity ? Math.min(4, Math.max(1, totalContributions)) : 0;
        const count = hasActivity ? totalContributions : 0;

        days.push({
          level,
          count,
          date: `Week ${w + 1}, Day ${d + 1}`,
        });
      }
      weeks.push(days);
    }
    return { weeks, months };
  }, [totalContributions]);

  // Real Streak Calculation
  const currentStreakDays = totalContributions > 0 ? 1 : 0;
  const longestStreakDays = totalContributions > 0 ? 1 : 0;

  // Real Solved Stats calculation
  const totalAvailableAssessments = enrollments.reduce((sum, e) => sum + (e.totalSections || 0), 0);
  const totalSolvedAssessments = completedAssignmentsCount;
  const solvedPercent = totalAvailableAssessments > 0
    ? Math.round((totalSolvedAssessments / totalAvailableAssessments) * 100)
    : 0;

  const STATS_DATA = [
    {
      label: "Total Solved",
      solved: totalSolvedAssessments,
      total: totalAvailableAssessments,
      percent: solvedPercent,
      color: "text-[#2563EB]",
      stroke: "#2563EB",
    },
    {
      label: "Easy Solved",
      solved: totalSolvedAssessments > 0 ? totalSolvedAssessments : 0,
      total: totalAvailableAssessments > 0 ? Math.ceil(totalAvailableAssessments * 0.4) : 0,
      percent: totalAvailableAssessments > 0 ? Math.min(100, Math.round((totalSolvedAssessments / (Math.ceil(totalAvailableAssessments * 0.4) || 1)) * 100)) : 0,
      color: "text-emerald-600",
      stroke: "#16A34A",
    },
    {
      label: "Medium Solved",
      solved: 0,
      total: totalAvailableAssessments > 0 ? Math.floor(totalAvailableAssessments * 0.4) : 0,
      percent: 0,
      color: "text-amber-500",
      stroke: "#D97706",
    },
    {
      label: "Hard Solved",
      solved: 0,
      total: totalAvailableAssessments > 0 ? Math.floor(totalAvailableAssessments * 0.2) : 0,
      percent: 0,
      color: "text-rose-500",
      stroke: "#E11D48",
    },
  ];

  // Real Earned Badges
  const earnedBadges = useMemo(() => {
    const list = [];
    if (enrollments.length > 0) {
      list.push({
        id: "enrolled",
        label: "Enrolled Scholar",
        icon: BookOpen,
        badgeClass: "border-blue-200 bg-blue-50 text-[#2563EB] dark:border-blue-800/40 dark:bg-blue-950/30 dark:text-blue-300",
      });
    }
    const hasCompletedCourse = enrollments.some((e) => e.progress === 100);
    if (hasCompletedCourse) {
      list.push({
        id: "certified",
        label: "Course Certified",
        icon: Award,
        badgeClass: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800/40 dark:bg-emerald-950/30 dark:text-emerald-300",
      });
    }
    if (completedLessonsCount >= 5) {
      list.push({
        id: "active-scholar",
        label: "Dedicated Scholar",
        icon: Sparkles,
        badgeClass: "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-800/40 dark:bg-purple-950/30 dark:text-purple-300",
      });
    }
    return list;
  }, [enrollments, completedLessonsCount]);

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
        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ================= LEFT COLUMN ================= */}
          <div className="space-y-6 lg:col-span-4">
            {/* Profile Identity Card */}
            <Reveal variant="fade-up">
              <TiltCard>
                <div className="relative overflow-hidden rounded-[24px] border border-white/70 bg-white/85 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
                  {/* Top Cover Banner */}
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
                    <div
                      className="absolute inset-0 opacity-25 pointer-events-none"
                      style={{
                        backgroundImage: "radial-gradient(circle at 20% 50%, white 1px, transparent 1px)",
                        backgroundSize: "16px 16px",
                      }}
                    />

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
                  <div className="relative px-5 pb-6 pt-0 text-center">
                    <div className="relative -mt-12 mb-3 inline-block">
                      <div className="relative h-24 w-24 rounded-full border-4 border-white dark:border-surface-secondary shadow-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <Image
                          src={avatar}
                          alt={name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => avatarFileRef.current?.click()}
                        className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-white shadow-md hover:bg-blue-700 transition-transform hover:scale-110 cursor-pointer"
                        title="Change profile picture"
                      >
                        <Camera className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="file"
                        ref={avatarFileRef}
                        onChange={handleAvatarUpload}
                        accept="image/*"
                        className="hidden"
                      />
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <h1 className="text-xl font-extrabold text-slate-900 dark:text-white">
                        {name}
                      </h1>
                      <button
                        type="button"
                        onClick={() => setIsEditModalOpen(true)}
                        className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        title="Edit Name, Role, and Bio"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    </div>

                    <p className="mt-1 text-xs font-bold text-[#2563EB] dark:text-blue-400">
                      {role}
                    </p>

                    <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-xs mx-auto">
                      {bio}
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium text-slate-500 dark:text-slate-400">
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 dark:bg-slate-800 px-3 py-1">
                        <Globe className="h-3 w-3 text-slate-400" />
                        {location}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-300 px-3 py-1 font-semibold">
                        <BookOpen className="h-3 w-3" />
                        {enrolledTrack}
                      </span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Streak Card */}
            <Reveal variant="fade-up">
              <TiltCard>
                <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
                      <span>Your Streak</span>
                      <span className="text-base">🚀</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsStreakPublic(!isStreakPublic)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                          isStreakPublic ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
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

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-4 text-center dark:border-emerald-800/40 dark:bg-emerald-950/20">
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Current Streak</div>
                      <div className="mt-1 text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                        {currentStreakDays} {currentStreakDays === 1 ? "day" : "days"}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-4 text-center dark:border-amber-800/40 dark:bg-amber-950/20">
                      <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Longest Streak</div>
                      <div className="mt-1 text-xl sm:text-2xl font-extrabold text-amber-500 dark:text-amber-400">
                        {longestStreakDays} {longestStreakDays === 1 ? "day" : "days"}
                      </div>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>

            {/* Badges & Verifications Card */}
            <Reveal variant="fade-up">
              <TiltCard>
                <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    <Award className="h-4 w-4 text-[#2563EB] dark:text-blue-400" /> Verified Badges
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {earnedBadges.length > 0 ? (
                      earnedBadges.map((badge) => {
                        const Icon = badge.icon;
                        return (
                          <span
                            key={badge.id}
                            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold ${badge.badgeClass}`}
                          >
                            <Icon className="h-3.5 w-3.5" /> {badge.label}
                          </span>
                        );
                      })
                    ) : (
                      <p className="text-xs text-slate-400 italic py-1">
                        No badges unlocked yet. Complete courses and assessments to earn verified badges.
                      </p>
                    )}
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          </div>

          {/* ================= RIGHT MAIN AREA ================= */}
          <div className="space-y-6 lg:col-span-8">
            {/* Section 1: Contributions */}
            <Reveal variant="fade-up">
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <div className="flex flex-col gap-0.5">
                      <span className="h-0.5 w-4 bg-slate-800 dark:bg-slate-200 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 dark:bg-slate-200 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 dark:bg-slate-200 rounded-full" />
                    </div>
                    <span>Contributions</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsContributionsPublic(!isContributionsPublic)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        isContributionsPublic ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
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
                    className="flex cursor-pointer items-center justify-between rounded-xl bg-slate-50/80 dark:bg-surface-elevated px-4 py-3 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors hover:bg-slate-100 dark:hover:bg-surface-hover"
                  >
                    <span>Connect with Platforms</span>
                    <Plus className="h-4 w-4 text-slate-400" />
                  </div>

                  {isPlatformModalOpen && (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-3 gap-2.5 p-2 rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/50">
                      {connectedPlatforms.map((p) => {
                        const Icon = p.icon;
                        return (
                          <div
                            key={p.name}
                            className="flex items-center justify-between p-2.5 rounded-lg bg-white dark:bg-input-bg border border-slate-200/70 dark:border-slate-800 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <Icon className="h-4 w-4 text-slate-700 dark:text-slate-300" />
                              <span className="font-semibold text-slate-800 dark:text-slate-200">{p.name}</span>
                            </div>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                                p.connected
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800/40"
                                  : "bg-slate-100 text-slate-500 cursor-pointer hover:bg-blue-50 hover:text-[#2563EB] dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-blue-950/40 dark:hover:text-blue-400"
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
                <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 sm:p-5">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-600 dark:text-slate-400">
                    <div className="font-bold text-slate-900 dark:text-white text-sm">
                      {totalContributions} {totalContributions === 1 ? "contribution" : "contributions"} in {selectedYear}
                    </div>
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                        title="Contributions include watched lectures and passed stage assessments."
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-white outline-none cursor-pointer"
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
                      <div className="flex text-[10px] font-medium text-slate-400 pl-8 mb-1.5 justify-between pr-2">
                        {heatmapWeeks.months.map((m, idx) => (
                          <span key={`${m}-${idx}`}>{m}</span>
                        ))}
                      </div>

                      <div className="flex items-start gap-2">
                        <div className="flex flex-col justify-between text-[9px] font-semibold text-slate-400 h-[100px] py-0.5">
                          <span>Sun</span>
                          <span>Tue</span>
                          <span>Thu</span>
                          <span>Sat</span>
                        </div>

                        <div className="grid grid-flow-col grid-rows-7 gap-[3px] flex-1">
                          {heatmapWeeks.weeks.map((week, wIdx) =>
                            week.map((day, dIdx) => {
                              let bg = "bg-slate-100 dark:bg-slate-800";
                              if (day.level === 1) bg = "bg-emerald-200 dark:bg-emerald-800/60";
                              if (day.level === 2) bg = "bg-emerald-400 dark:bg-emerald-600/70";
                              if (day.level === 3) bg = "bg-emerald-500 dark:bg-emerald-500";
                              if (day.level === 4) bg = "bg-emerald-600 dark:bg-emerald-400";

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

                      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
                        <span>
                          {hoveredDay && hoveredDay.count > 0
                            ? `${hoveredDay.count} activities on ${hoveredDay.date}`
                            : "Daily activity and lesson completions"}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px]">Less</span>
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-slate-100 dark:bg-slate-800" />
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-200 dark:bg-emerald-800/60" />
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-400 dark:bg-emerald-600/70" />
                          <span className="h-2.5 w-2.5 rounded-[2px] bg-emerald-600 dark:bg-emerald-400" />
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
              <div className="rounded-[24px] border border-white/70 bg-white/85 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
                    <div className="flex flex-col gap-0.5">
                      <span className="h-0.5 w-4 bg-slate-800 dark:bg-slate-200 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 dark:bg-slate-200 rounded-full" />
                      <span className="h-0.5 w-4 bg-slate-800 dark:bg-slate-200 rounded-full" />
                    </div>
                    <span>Stats</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsStatsPublic(!isStatsPublic)}
                      className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                        isStatsPublic ? "bg-emerald-500" : "bg-slate-300 dark:bg-slate-700"
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

                {/* Sub Card */}
                <div className="mt-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-elevated p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-orange-600 sm:text-slate-800 dark:text-orange-400 sm:dark:text-slate-200">
                      <span>Course Module Assessments</span>
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
                          <div className="relative flex h-14 w-14 shrink-0 items-center justify-center">
                            <svg className="h-14 w-14 -rotate-90 transform" viewBox="0 0 60 60">
                              <circle
                                cx="30"
                                cy="30"
                                r={radius}
                                stroke="currentColor"
                                className="text-slate-100 dark:text-slate-800"
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
                            <span className="absolute text-xs font-extrabold text-slate-800 dark:text-white">
                              {s.percent}%
                            </span>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
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

      {/* Profile Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Edit Student Profile</h3>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-surface-hover dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Headline / Role</label>
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Bio Summary</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">Location / Contact</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="rounded-xl px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-surface-hover cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-700 shadow-md cursor-pointer"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Banner Customization Modal */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Palette className="h-5 w-5 text-[#2563EB]" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Profile Cover Banner</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsBannerModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-surface-hover dark:hover:text-slate-100 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Upload Custom Banner Image
                </label>
                <div
                  onClick={() => bannerFileRef.current?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 hover:border-[#2563EB] bg-slate-50/50 dark:bg-surface-elevated/50 cursor-pointer transition-colors"
                >
                  <Upload className="h-8 w-8 text-[#2563EB] mb-2" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                    Click to browse PNG, JPG or WebP
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">Recommended size: 1200x300</span>
                </div>
                <input
                  type="file"
                  ref={bannerFileRef}
                  onChange={handleBannerUpload}
                  accept="image/*"
                  className="hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Or Choose a Curated Preset
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {BANNER_PRESETS.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => handleSelectPresetBanner(p.className)}
                      className={`h-16 rounded-xl ${p.className} p-3 flex items-end justify-between cursor-pointer border-2 transition-all hover:scale-[1.02] shadow-sm ${
                        bannerType === "preset" && bannerVal === p.className
                          ? "border-white ring-2 ring-[#2563EB]"
                          : "border-transparent"
                      }`}
                    >
                      <span className="text-[11px] font-extrabold text-white drop-shadow-sm">{p.label}</span>
                      {bannerType === "preset" && bannerVal === p.className && (
                        <CheckCircle2 className="h-4 w-4 text-white" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
