"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  Trophy,
  Bookmark,
  Code2,
  Sparkles,
  ClipboardCheck,
  Star,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { useNotifications } from "@/lib/data/notifications-store";



// Explore Dropdown Items for Student Workspace
const STUDENT_EXPLORE_SECTIONS = [
  {
    label: "Leaderboard",
    href: "/dashboard/leaderboard",
    icon: Trophy,
  },
  {
    label: "Quizzes",
    href: "/dashboard/quizzes",
    icon: ClipboardCheck,
  },
  {
    label: "Bookmarks",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
  },
  {
    label: "Playground",
    href: "/dashboard/playground",
    icon: Code2,
  },
];

// Explore Dropdown Items for Admin Workspace
const ADMIN_EXPLORE_SECTIONS = [
  {
    label: "Student Leaderboard",
    href: "/admin/leaderboard",
    icon: Trophy,
  },
  {
    label: "Question Bank",
    href: "/admin/assessments/questions",
    icon: ClipboardCheck,
  },
  {
    label: "Code Playground",
    href: "/admin/playground",
    icon: Code2,
  },
  {
    label: "AI Mock Interviews",
    href: "/admin/ai-interviews",
    icon: Sparkles,
  },
];

export function DashboardTopbar({
  title = "Welcome back 👋",
  subtitle = "Here's what's happening with your platform today.",
  userInitials,
  badgeNotification = true,
  children,
}: {
  title?: string;
  subtitle?: string;
  userInitials?: string;
  badgeNotification?: boolean;
  children?: React.ReactNode;
}) {
  const pathname = usePathname();
  const [exploreOpen, setExploreOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const session = useMockSession();
  const { user: clerkUser } = useUser();

  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  useEffect(() => {
    const readAvatar = () => {
      try {
        const stored = localStorage.getItem("jks_student_avatar_v2");
        setCustomAvatar(stored);
      } catch {}
    };
    readAvatar();
    window.addEventListener("storage", readAvatar);
    window.addEventListener("jks_avatar_updated", readAvatar);
    return () => {
      window.removeEventListener("storage", readAvatar);
      window.removeEventListener("jks_avatar_updated", readAvatar);
    };
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  const isInstructor = pathname.startsWith("/instructor");
  const exploreSections = isAdmin
    ? ADMIN_EXPLORE_SECTIONS
    : isInstructor
    ? [
        { label: "Student Leaderboard", href: "/admin/leaderboard", icon: Trophy },
        { label: "Assessments", href: "/instructor/assessments", icon: ClipboardCheck },
        { label: "Code Playground", href: "/admin/playground", icon: Code2 },
        { label: "Platform Analytics", href: "/instructor/analytics", icon: Sparkles },
      ]
    : STUDENT_EXPLORE_SECTIONS;

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const clerkName = clerkUser?.fullName || [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || clerkUser?.username;

  const resolvedInitials = isAdmin
    ? (session?.initials && session.initials !== "AD" ? session.initials : "LX")
    : isInstructor
    ? (session?.initials ?? userInitials ?? "LE")
    : clerkUser?.firstName && clerkUser?.lastName
    ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`.toUpperCase()
    : (session?.initials ?? userInitials ?? (clerkName ? clerkName.slice(0, 2).toUpperCase() : "ST"));

  const userName = isAdmin
    ? (session?.name && session.name !== "John Doe" && session.name !== "Ava Desai" ? session.name : "Lexon Administrator")
    : isInstructor
    ? (session?.name ?? "Lecturer")
    : (clerkName || session?.name || "Student");

  const userEmail = isAdmin
    ? (session?.email && session.email !== "admin@jkslearning.dev" ? session.email : "lexonitservices@gmail.com")
    : isInstructor
    ? (session?.email ?? "")
    : (clerkEmail || session?.email || "");

  const userAvatar =
    customAvatar ||
    clerkUser?.imageUrl ||
    (userEmail
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || userEmail)}&background=2563eb&color=fff&bold=true&size=128`
      : undefined);

  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(
    isAdmin ? "admin" : "student",
    userEmail
  );

  // Close explore and notification dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setExploreOpen(false);
    setNotificationsOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 sm:h-20 shrink-0 items-center justify-between gap-2 sm:gap-4 px-4 sm:px-6 lg:px-8 border-b border-transparent bg-transparent backdrop-blur-md transition-all print:hidden">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") {
                window.dispatchEvent(new CustomEvent("jks_open_mobile_nav"));
              }
            }}
            aria-label="Open mobile navigation"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-transparent bg-transparent text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-900/[0.06] dark:hover:bg-white/10 md:hidden cursor-pointer active:scale-95"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
          </button>

          <div className="min-w-0 flex-1">
            {children ? (
              children
            ) : (
              <>
                {title && (
                  <h1 className="text-sm sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 hidden sm:block sm:text-sm">
                    {subtitle}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Dark / Light Theme Toggle */}
          <ThemeToggle variant="ghost" />

          {/* Explore Dropdown Button */}
          <div ref={exploreRef} className="relative">
            <button
              type="button"
              onClick={() => setExploreOpen(!exploreOpen)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                exploreOpen
                  ? "border-[#2563EB]/60 bg-blue-50/80 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400"
                  : "border-transparent bg-transparent text-slate-700 dark:text-slate-200 hover:bg-slate-900/[0.06] dark:hover:bg-white/10"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />
              <span className="hidden sm:inline">Explore</span>
              {exploreOpen ? (
                <ChevronUp className="h-3.5 w-3.5 text-slate-400" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              )}
            </button>

            {/* Explore Mega Menu Dropdown */}
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-72 z-50 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-elevated shadow-[0_16px_45px_rgba(15,23,42,0.18)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl p-2.5 font-sans overflow-hidden"
                >
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800/60 mb-1.5">
                    <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      {isAdmin ? "Admin Modules" : "Learning Hub"}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-400">
                      Quick navigation &amp; tools
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-1">
                    {exploreSections.map((sec) => {
                      const Icon = sec.icon;
                      const isActive = pathname === sec.href;
                      return (
                        <Link
                          key={sec.href}
                          href={sec.href}
                          onClick={() => setExploreOpen(false)}
                          className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                            isActive
                              ? "bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400"
                              : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-surface-hover dark:hover:text-white"
                          }`}
                        >
                          <div
                            className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                              isActive
                                ? "bg-blue-600 text-white"
                                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                            }`}
                          >
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          <span>{sec.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Button & Popover */}
          <div ref={notificationsRef} className="relative shrink-0">
            <button
              type="button"
              aria-label="Notifications"
              aria-expanded={notificationsOpen}
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-transparent bg-transparent text-slate-600 dark:text-slate-300 transition-all hover:bg-slate-900/[0.06] dark:hover:bg-white/10 cursor-pointer"
            >
              <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2]" />
              {unreadCount > 0 ? (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-black text-white ring-2 ring-white/80 dark:ring-slate-950 animate-in zoom-in-50">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            {/* Notification Dropdown Popover */}
            <AnimatePresence>
              {notificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-w-[calc(100vw-24px)] z-50 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-elevated shadow-[0_16px_45px_rgba(15,23,42,0.18)] dark:shadow-[0_16px_45px_rgba(0,0,0,0.6)] backdrop-blur-xl font-sans overflow-hidden"
                >
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-4 py-3 bg-slate-50/70 dark:bg-slate-900/60">
                    <div className="flex items-center gap-2">
                      <span className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">Notifications</span>
                      {unreadCount > 0 && (
                        <span className="rounded-full bg-rose-100 dark:bg-rose-950/60 px-2 py-0.5 text-[10px] font-extrabold text-rose-600 dark:text-rose-400">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllAsRead()}
                        className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-400 dark:text-slate-500">
                        No notifications yet. You're all caught up!
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notif) => {
                        return (
                          <div
                            key={notif.id}
                            onClick={() => {
                              markAsRead(notif.id);
                              setNotificationsOpen(false);
                            }}
                            className={`flex items-start gap-3 p-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-surface-hover ${
                              !notif.read ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                            }`}
                          >
                            <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400">
                              {notif.type === "review" ? (
                                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                              ) : notif.type === "qa" ? (
                                <MessageSquare className="h-3.5 w-3.5" />
                              ) : notif.type === "assessment" ? (
                                <Trophy className="h-3.5 w-3.5 text-amber-500" />
                              ) : (
                                <Bell className="h-3.5 w-3.5" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <p className={`text-xs truncate ${!notif.read ? "font-bold text-slate-900 dark:text-white" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                                  {notif.title}
                                </p>
                                {!notif.read && (
                                  <span className="h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                                )}
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                                {notif.body}
                              </p>
                              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                                {notif.formattedDate}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 p-2 bg-slate-50/50 dark:bg-slate-900/40 text-center">
                    <Link
                      href={isAdmin ? "/admin/notifications" : "/dashboard/notifications"}
                      onClick={() => setNotificationsOpen(false)}
                      className="inline-block w-full py-1.5 text-center text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      View All Notifications &rarr;
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Profile Avatar Link (no dropdown menu) */}
          <Link
            href={isAdmin ? "/admin/settings" : isInstructor ? "/instructor/profile" : "/dashboard/profile"}
            className="flex items-center rounded-full p-0.5 transition-transform hover:scale-105 focus:outline-none shrink-0"
            aria-label="User profile"
            title={userName}
          >
            <div className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs sm:text-sm font-bold text-white shadow-[0_4px_12px_rgba(37,99,235,0.25)] overflow-hidden ring-2 ring-blue-500/20">
              {userAvatar ? (
                <img
                  src={userAvatar}
                  alt={userName}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display = "none";
                  }}
                />
              ) : null}
              <span className={userAvatar ? "sr-only" : ""}>{resolvedInitials}</span>
            </div>
          </Link>
        </div>
      </header>
    </>
  );
}
