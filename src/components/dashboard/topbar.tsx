"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  ClipboardCheck,
  BrainCircuit,
  Award,
  CreditCard,
  User,
  Users,
  GraduationCap,
  BarChart3,
  Settings,
  LogOut,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  MonitorPlay,
  UserCheck,
  Trophy,
  Bookmark,
  Code2,
  FileText,
  Shield,
  Sparkles,
  Megaphone,
  type LucideIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMockSession, logoutMockSession, performLogout } from "@/lib/auth/use-mock-auth";
import { useAuth, useUser } from "@clerk/nextjs";
import { ThemeToggle } from "@/components/common/theme-toggle";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const STUDENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/resume-builder", label: "Resume Maker", icon: FileText },
  { href: "/dashboard/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/dashboard/ai-interview", label: "AI Mock Interview", icon: BrainCircuit },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/payments", label: "Invoices & Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/leads", label: "Leads & CRM", icon: Megaphone },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/admin/assessments/questions", label: "Question Bank", icon: ClipboardCheck },
  { href: "/admin/ai-interviews", label: "AI Interviews", icon: BrainCircuit },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/payments", label: "Invoices & Billing", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];


const INSTRUCTOR_NAV: NavItem[] = [
  { href: "/instructor", label: "Overview", icon: LayoutDashboard },
  { href: "/instructor/students", label: "My Students", icon: Users },
  { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
  { href: "/instructor/courses/new", label: "Upload Course", icon: BookOpen },
  { href: "/instructor/assessments", label: "Assessments & Grading", icon: ClipboardCheck },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/instructor/profile", label: "Profile", icon: User },
  { href: "/instructor/settings", label: "Settings", icon: Settings },
];

// Explore Dropdown Items (4 dedicated sections)
const EXPLORE_SECTIONS = [
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

export function DashboardTopbar({
  title = "Welcome back 👋",
  subtitle = "Here's what's happening with your platform today.",
  userInitials,
  badgeNotification = true,
}: {
  title?: string;
  subtitle?: string;
  userInitials?: string;
  badgeNotification?: boolean;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const exploreRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const session = useMockSession();
  const { signOut } = useAuth();
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
  const navItems = isAdmin ? ADMIN_NAV : isInstructor ? INSTRUCTOR_NAV : STUDENT_NAV;
  const rootHref = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/dashboard";

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


  // Close explore and profile dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exploreRef.current && !exploreRef.current.contains(e.target as Node)) {
        setExploreOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile drawer & menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setExploreOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setProfileOpen(false);
    await performLogout(signOut);
  };

  return (
    <>
      <header className="flex items-center justify-between gap-2 sm:gap-4 px-3.5 pt-3.5 pb-2 sm:px-6 sm:pt-6 lg:px-8">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          {/* Mobile Hamburger Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open mobile navigation"
            className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/80 dark:border-slate-800 dark:bg-slate-900/80 text-slate-700 dark:text-slate-200 shadow-xs backdrop-blur-md transition-all hover:bg-white dark:hover:bg-surface-hover md:hidden cursor-pointer active:scale-95"
          >
            <Menu className="h-4 w-4 sm:h-5 sm:w-5 stroke-[2]" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="text-sm sm:text-xl lg:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400 line-clamp-1 hidden sm:block sm:text-sm">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Dark / Light Theme Toggle */}
          <ThemeToggle />

          {/* Explore Dropdown Button */}
          <div ref={exploreRef} className="relative">
            <button
              type="button"
              onClick={() => setExploreOpen(!exploreOpen)}
              className={`flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 sm:px-3.5 sm:py-2 text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                exploreOpen
                  ? "border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 shadow-xs"
                  : "border-slate-200/80 bg-white/90 dark:border-slate-800 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-hover shadow-xs"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Explore</span>
              {exploreOpen ? (
                <ChevronUp className="h-3.5 w-3.5 hidden sm:block" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 hidden sm:block" />
              )}
            </button>

            {/* Explore Dropdown Menu */}
            <AnimatePresence>
              {exploreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-56 sm:w-60 z-50 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-elevated p-2 shadow-[0_12px_35px_rgba(20,50,100,0.12)] dark:shadow-[0_12px_35px_rgba(0,0,0,0.5)] backdrop-blur-xl"
                >
                  <div className="space-y-1">
                    {EXPLORE_SECTIONS.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.label}
                          href={item.href}
                          onClick={() => setExploreOpen(false)}
                          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors hover:bg-slate-50 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white group"
                        >
                          <div className="flex h-6 w-6 items-center justify-center rounded-lg text-amber-500 group-hover:scale-110 transition-transform">
                            <Icon className="h-4 w-4 stroke-[2]" />
                          </div>
                          <span>{item.label}</span>
                        </Link>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notification Button */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border border-white/70 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 text-slate-600 dark:text-slate-300 shadow-[0_4px_12px_rgba(20,50,100,0.06)] dark:shadow-[0_4px_12px_rgba(0,0,0,0.3)] backdrop-blur-xl transition-all hover:bg-white dark:hover:bg-surface-hover hover:shadow-md cursor-pointer"
          >
            <Bell className="h-3.5 w-3.5 sm:h-4 sm:w-4 stroke-[2]" />
            {badgeNotification && (
              <span className="absolute top-1.5 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {/* Custom JKS Learning Profile Popover */}
          <div ref={profileRef} className="relative shrink-0">
            <button
              type="button"
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-1.5 rounded-full p-0.5 transition-transform hover:scale-105 cursor-pointer focus:outline-none"
              aria-label="User profile menu"
              aria-expanded={profileOpen}
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
              <ChevronDown
                className={`h-3.5 w-3.5 text-slate-400 transition-transform duration-200 hidden sm:block ${
                  profileOpen ? "rotate-180 text-primary-blue" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown Menu */}
            <AnimatePresence>
              {profileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.95 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="absolute right-0 top-full mt-2 w-64 sm:w-72 max-w-[calc(100vw-24px)] z-50 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-elevated p-2 shadow-[0_12px_40px_rgba(15,23,42,0.14)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl font-sans"
                >
                  {/* User Profile Header */}
                  <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 p-3 bg-slate-50/70 dark:bg-slate-900/60 rounded-xl mb-1.5">
                    <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white overflow-hidden shadow-xs">
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
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-bold text-slate-900 dark:text-white">{userName}</p>
                      <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400">{userEmail}</p>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100/80 dark:bg-blue-950/60 px-2 py-0.5 text-[9px] font-bold text-blue-700 dark:text-blue-400 capitalize">
                          {isAdmin ? (
                            <>
                              <Shield className="h-2.5 w-2.5" /> Admin
                            </>
                          ) : isInstructor ? (
                            <>
                              <GraduationCap className="h-2.5 w-2.5" /> Instructor
                            </>
                          ) : (
                            <>
                              <GraduationCap className="h-2.5 w-2.5" /> Student
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Action Links */}
                  <div className="space-y-0.5">
                    <Link
                      href={rootHref}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-surface-hover hover:text-primary-blue dark:hover:text-white transition-colors"
                    >
                      <LayoutDashboard className="h-4 w-4 text-primary-blue" />
                      <span>{isAdmin ? "Admin Overview" : isInstructor ? "Instructor Dashboard" : "My Dashboard"}</span>
                    </Link>

                    {!isAdmin && !isInstructor && (
                      <Link
                        href="/dashboard/my-courses"
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-surface-hover hover:text-primary-blue dark:hover:text-white transition-colors"
                      >
                        <BookOpen className="h-4 w-4 text-emerald-600" />
                        <span>My Enrolled Courses</span>
                      </Link>
                    )}

                    <Link
                      href={isAdmin ? "/admin/ai-interviews" : "/dashboard/ai-interview"}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-surface-hover hover:text-primary-blue dark:hover:text-white transition-colors"
                    >
                      <BrainCircuit className="h-4 w-4 text-purple-600" />
                      <span>AI Mock Interview</span>
                    </Link>

                    <Link
                      href={isAdmin ? "/admin/payments" : "/dashboard/payments"}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-surface-hover hover:text-primary-blue dark:hover:text-white transition-colors"
                    >
                      <CreditCard className="h-4 w-4 text-amber-600" />
                      <span>Invoices & Billing</span>
                    </Link>

                    <Link
                      href={isAdmin ? "/admin/settings" : isInstructor ? "/instructor/profile" : "/dashboard/profile"}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-surface-hover hover:text-primary-blue dark:hover:text-white transition-colors"
                    >
                      <User className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                      <span>Profile & Settings</span>
                    </Link>
                  </div>

                  {/* Divider & Sign Out */}
                  <div className="mt-1.5 border-t border-slate-100 dark:border-slate-800 pt-1.5">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                      <span>Sign out</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Slide-out Mobile Navigation Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
              aria-hidden
            />

            {/* Sliding Drawer Container */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className="relative z-10 flex h-full w-[280px] max-w-[85vw] flex-col bg-white dark:bg-surface shadow-2xl border-r border-transparent dark:border-slate-800"
            >
              {/* Header inside drawer */}
              <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100 dark:border-slate-800">
                <Link
                  href={rootHref}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-1 text-lg font-bold tracking-tight text-slate-900 dark:text-white"
                >
                  JKS <span className="text-[#2563EB]">Learning</span>
                </Link>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    aria-label="Close navigation"
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Navigation links */}
              <nav className="flex-1 overflow-y-auto space-y-1 p-3">
                {navItems.map((item) => {
                  const active =
                    item.href === pathname ||
                    (item.href !== rootHref && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`group flex items-center gap-3.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${
                        active
                          ? "bg-[#EFF6FF] dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 font-bold shadow-xs"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          active
                            ? "text-[#2563EB] stroke-[2.2]"
                            : "text-slate-400 group-hover:text-slate-600 dark:text-slate-400 dark:group-hover:text-slate-300"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* User Profile Card at Bottom */}
              <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/60">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white shadow-xs">
                    {resolvedInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-bold text-slate-900 dark:text-white">{userName}</div>
                    <div className="truncate text-[11px] text-slate-400">{userEmail}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-2 text-xs font-bold text-slate-600 dark:text-slate-300 shadow-xs transition-colors hover:text-rose-600 hover:border-rose-200 dark:hover:text-rose-400 dark:hover:border-rose-800"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
