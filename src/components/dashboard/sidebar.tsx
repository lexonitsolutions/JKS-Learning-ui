"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Megaphone,
  FileText,
  type LucideIcon,
} from "lucide-react";
import { useMockSession, logoutMockSession, performLogout } from "@/lib/auth/use-mock-auth";
import { useClerk, useUser } from "@clerk/nextjs";
import { JksLogo } from "@/components/common/jks-logo";


interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const STUDENT_MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/resume-builder", label: "Resume Maker", icon: FileText, badge: "New" },
  { href: "/dashboard/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/dashboard/ai-interview", label: "AI Mock Interview", icon: BrainCircuit, badge: "Soon" },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
];


const STUDENT_SEC_NAV: NavItem[] = [
  { href: "/dashboard/payments", label: "Invoices & Billing", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const ADMIN_MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/leads", label: "Leads & CRM", icon: Megaphone, badge: "Soon" },
  { href: "/admin/ai-interviews", label: "AI Interviews", icon: BrainCircuit, badge: "Soon" },
];


const ADMIN_SEC_NAV: NavItem[] = [
  { href: "/admin/payments", label: "Invoices & Billing", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];


const INSTRUCTOR_MAIN_NAV: NavItem[] = [
  { href: "/instructor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/instructor/students", label: "Students", icon: Users },
  { href: "/instructor/courses", label: "Courses", icon: BookOpen },
  { href: "/instructor/assessments", label: "Assessments", icon: ClipboardCheck, badge: "New" },
  { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
];


const INSTRUCTOR_SEC_NAV: NavItem[] = [
  { href: "/instructor/profile", label: "Profile & Hours", icon: User },
  { href: "/instructor/settings", label: "Settings", icon: Settings },
];

const SIDEBAR_STORAGE_KEY = "jks_sidebar_collapsed";

export function DashboardSidebar({ role = "student" }: { role?: "student" | "admin" | "instructor" }) {
  const pathname = usePathname();
  const isAdmin = role === "admin";
  const isInstructor = role === "instructor";
  
  const mainItems = isAdmin ? ADMIN_MAIN_NAV : isInstructor ? INSTRUCTOR_MAIN_NAV : STUDENT_MAIN_NAV;
  const secItems = isAdmin ? ADMIN_SEC_NAV : isInstructor ? INSTRUCTOR_SEC_NAV : STUDENT_SEC_NAV;
  const rootHref = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/dashboard";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const session = useMockSession();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage errors
    }

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

  const toggleSidebar = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      } catch {
        // Ignore localStorage errors
      }
      return next;
    });
  };

  const handleLogout = async () => {
    await performLogout(signOut);
  };

  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const clerkName = clerkUser?.fullName || [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || clerkUser?.username;

  const userEmail = isAdmin
    ? (session?.email && session.email !== "admin@jkslearning.dev" ? session.email : "lexonitservices@gmail.com")
    : isInstructor
    ? (session?.email ?? "")
    : (session?.email ?? clerkEmail ?? "");

  const userName = isAdmin
    ? (session?.name && session.name !== "John Doe" && session.name !== "Ava Desai" ? session.name : "Lexon Administrator")
    : isInstructor
    ? (session?.name ?? "Lecturer")
    : (session?.name ?? clerkName ?? "Student");

  const userAvatarUrl =
    customAvatar ||
    clerkUser?.imageUrl ||
    (userEmail
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || userEmail)}&background=2563eb&color=fff&bold=true&size=128`
      : undefined);

  const userInitials = isAdmin
    ? "AD"
    : isInstructor
    ? (session?.initials ?? "RK")
    : (session?.initials ?? (clerkName ? clerkName.slice(0, 2).toUpperCase() : "ST"));

  const userRole = isAdmin ? "Administrator" : isInstructor ? "Faculty / Lecturer" : "Student";


  const renderNavGroup = (items: NavItem[]) => {
    return items.map((item) => {
      const isCoursesNav = (isAdmin && item.href === "/admin/courses") || (isInstructor && item.href === "/instructor/courses");
      const isCoursesActive = pathname.startsWith(item.href);
      const coursesBaseHref = isInstructor ? "/instructor/courses" : "/admin/courses";
      const active =
        item.href === pathname ||
        (item.href !== rootHref && pathname.startsWith(item.href));

      if (isCoursesNav && !isCollapsed) {
        return (
          <div key={item.href} className="space-y-1">
            <Link
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                isCoursesActive && pathname === coursesBaseHref
                  ? "bg-nav-item-active-bg text-nav-item-active-text font-semibold shadow-sm shadow-blue-500/25"
                  : "text-nav-item hover:bg-nav-item-hover-bg hover:text-nav-item-hover-text"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isCoursesActive && pathname === coursesBaseHref
                      ? "text-nav-item-active-text"
                      : "text-nav-item-icon group-hover:text-nav-item-hover-text"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
            </Link>

            {/* Sub-menu under Courses */}
            <div className="pl-6 pr-1 py-0.5 space-y-1 border-l-2 border-border-subtle ml-4">
              <Link
                href={coursesBaseHref}
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  pathname === coursesBaseHref
                    ? "bg-nav-sub-active-bg text-nav-sub-active-text font-bold"
                    : "text-nav-item hover:bg-nav-item-hover-bg hover:text-nav-item-hover-text"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                <span>All Courses</span>
              </Link>

              <Link
                href={`${coursesBaseHref}/new`}
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                  pathname === `${coursesBaseHref}/new`
                    ? "bg-nav-sub-active-bg text-nav-sub-active-text font-bold"
                    : "text-nav-item hover:bg-nav-item-hover-bg hover:text-nav-item-hover-text"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  <span>Upload / New</span>
                </div>
                <span className="rounded bg-nav-item-active-bg px-1.5 py-0.5 text-[10px] font-bold text-nav-item-active-text leading-none">
                  +
                </span>
              </Link>
            </div>
          </div>
        );
      }

      const isSoon = item.badge === "Soon";

      if (isSoon) {
        return (
          <div key={item.href} className="relative group flex items-center justify-center">
            <div
              className={`relative flex items-center select-none cursor-not-allowed opacity-55 transition-all duration-200 ${
                isCollapsed
                  ? "h-10 w-10 justify-center rounded-xl"
                  : "w-full gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px]"
              } text-text-muted hover:bg-nav-item-hover-bg/50`}
              title={`${item.label} (Feature Coming Soon — Disabled)`}
            >
              <item.icon
                className={`shrink-0 text-text-muted ${
                  isCollapsed ? "h-[19px] w-[19px]" : "h-4 w-4"
                }`}
              />
              {!isCollapsed && (
                <>
                  <span className="truncate flex-1 font-medium text-text-muted">{item.label}</span>
                  <span className="rounded-md bg-amber-50 text-amber-700 border border-amber-200/60 dark:bg-amber-400/15 dark:text-amber-200 dark:border-amber-400/30 px-1.5 py-0.5 text-[10px] font-bold leading-none">
                    Soon
                  </span>
                </>
              )}
            </div>

            {/* Premium Floating Tooltip in Minimized Mode */}
            {isCollapsed && (
              <div className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 z-50 hidden rounded-xl bg-slate-950/95 px-3 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md border border-slate-800 group-hover:flex items-center gap-2 whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
                <span>{item.label}</span>
                <span className="rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 text-[10px] font-bold">
                  Coming Soon
                </span>
                <div className="absolute right-full top-1/2 -mr-1 -translate-y-1/2 border-[5px] border-transparent border-r-slate-950" />
              </div>
            )}
          </div>
        );
      }

      return (
        <div key={item.href} className="relative group flex items-center justify-center">
          <Link
            href={item.href}
            className={`relative flex items-center transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
              isCollapsed
                ? "h-10 w-10 justify-center rounded-xl"
                : "w-full gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px]"
            } ${
              active
                ? isCollapsed
                  ? "bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-nav-item-active-bg text-nav-item-active-text font-semibold shadow-sm shadow-blue-500/25"
                : "text-nav-item hover:bg-nav-item-hover-bg hover:text-nav-item-hover-text active:bg-surface-active active:scale-95"
            }`}
          >
            <item.icon
              className={`shrink-0 transition-colors ${
                isCollapsed ? "h-[19px] w-[19px]" : "h-4 w-4"
              } ${
                active
                  ? "text-nav-item-active-text"
                  : "text-nav-item-icon group-hover:text-nav-item-hover-text"
              }`}
            />
            {!isCollapsed && (
              <>
                <span className="truncate flex-1 font-medium">{item.label}</span>
                {item.badge && (
                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold leading-none ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-primary-blue/10 dark:bg-primary-blue/20 text-primary-ink"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>

          {/* Premium Floating Tooltip in Minimized Mode */}
          {isCollapsed && (
            <div className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 z-50 hidden rounded-xl bg-slate-950/95 px-3 py-2 text-xs font-semibold text-white shadow-2xl backdrop-blur-md border border-slate-800 group-hover:flex items-center gap-2 whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
              <span>{item.label}</span>
              {item.badge && (
                <span className="rounded bg-blue-500/30 px-1.5 py-0.5 text-[10px] font-bold text-blue-300">
                  {item.badge}
                </span>
              )}
              <div className="absolute right-full top-1/2 -mr-1 -translate-y-1/2 border-[5px] border-transparent border-r-slate-950" />
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <aside
      className={`hidden shrink-0 flex-col p-3.5 md:flex transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[78px]" : "w-[260px]"
      }`}
    >
      <div className="relative flex h-full flex-col rounded-[24px] border border-[var(--nav-border)] bg-[var(--nav-surface)] shadow-[0_12px_36px_-6px_rgba(20,50,100,0.08),0_2px_10px_rgba(0,0,0,0.02)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 overflow-hidden">
        {/* Header: Logo & Toggle */}
        <div
          className={`flex h-[72px] shrink-0 items-center border-b border-border-subtle transition-all duration-300 ${
            isCollapsed ? "flex-col justify-center gap-1 px-2" : "items-center px-4"
          }`}
        >
          {!isCollapsed ? (
            <div className="flex items-center justify-between w-full gap-2">
              <div className="flex items-center gap-2 min-w-0">
                {/* Minimize/Collapse icon placed on the LEFT */}
                <button
                  type="button"
                  onClick={toggleSidebar}
                  aria-label="Collapse sidebar"
                  title="Collapse sidebar"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-white transition-colors shrink-0 cursor-pointer"
                >
                  <PanelLeftClose className="h-4 w-4 stroke-[2]" />
                </button>

                {/* Logo without long overlapping subtitle */}
                <JksLogo size="sm" href={rootHref} />
              </div>

              {/* Compact Role Badge on the right */}
              <span className="text-[9.5px] font-bold text-slate-500 dark:text-slate-300 uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200/70 dark:border-slate-700 shrink-0">
                {isAdmin ? "Admin" : isInstructor ? "Faculty" : "Student"}
              </span>
            </div>
          ) : (
            <div className="relative group flex items-center justify-center">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] text-white shadow-md shadow-blue-500/25 ring-1 ring-white/40 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <span className="font-extrabold text-xs tracking-tight">JKS</span>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white ring-2 ring-white dark:ring-slate-900">
                  <PanelLeftOpen className="h-2.5 w-2.5 stroke-[2.5]" />
                </span>
              </button>

              {/* Tooltip on Emblem */}
              <div className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 z-50 hidden rounded-xl bg-slate-950/95 px-3 py-1.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-md border border-slate-800 group-hover:flex items-center gap-1.5 whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
                <Sparkles className="h-3 w-3 text-amber-400" />
                <span>Click to Expand Sidebar</span>
                <div className="absolute right-full top-1/2 -mr-1 -translate-y-1/2 border-[5px] border-transparent border-r-slate-950" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Items */}
        <nav
          className={`flex-1 overflow-y-auto overflow-x-hidden transition-all duration-300 ${
            isCollapsed ? "space-y-2 py-3 px-2" : "space-y-1 py-3 px-3"
          }`}
        >
          {/* Main Section */}
          <div className={isCollapsed ? "space-y-2" : "space-y-1"}>
            {renderNavGroup(mainItems)}
          </div>

          {/* Section Divider */}
          <div className={`my-2.5 flex items-center justify-center ${isCollapsed ? "px-1" : "px-2"}`}>
            <div className="h-px w-full bg-slate-100 dark:bg-slate-800" />
          </div>

          {/* Secondary Section */}
          <div className={isCollapsed ? "space-y-2" : "space-y-1"}>
            {renderNavGroup(secItems)}
          </div>
        </nav>

        {/* Footer: User Profile & Quick Actions */}
        <div
          className={`shrink-0 border-t border-slate-100/70 dark:border-slate-800/80 p-2.5 transition-all duration-300 ${
            isCollapsed ? "flex flex-col items-center gap-2" : ""
          }`}
        >
          {!isCollapsed ? (
            <div className="rounded-2xl border border-slate-100/90 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 to-white/90 dark:from-slate-900/80 dark:to-slate-900/40 p-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                {userAvatarUrl ? (
                  <img
                    src={userAvatarUrl}
                    alt={userName}
                    className="h-9 w-9 shrink-0 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : null}
                {!userAvatarUrl && (
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-blue-600 dark:to-indigo-600 text-xs font-bold text-white shadow-xs ring-1 ring-white dark:ring-slate-800">
                    {userInitials}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-slate-900 dark:text-white leading-tight">
                    {userName}
                  </div>
                  <div className="truncate text-[11px] text-text-muted">
                    {isInstructor ? "Faculty ID: JKS.L0047" : userEmail}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100/80 dark:bg-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-all active:scale-95 cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Minimized User Avatar */}
              <div className="relative group">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 dark:from-blue-600 dark:to-indigo-600 text-xs font-bold text-white shadow-sm ring-2 ring-white/90 dark:ring-slate-800 hover:ring-blue-400 cursor-pointer transition-all overflow-hidden">
                  {userAvatarUrl ? (
                    <img
                      src={userAvatarUrl}
                      alt={userName}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : null}
                  <span className={userAvatarUrl ? "sr-only" : ""}>{userInitials}</span>
                </div>

                {/* Profile Tooltip */}
                <div className="pointer-events-none absolute left-full bottom-0 ml-3.5 z-50 hidden rounded-xl bg-slate-950/95 p-3 text-white shadow-2xl backdrop-blur-md border border-slate-800 group-hover:block whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
                  <div className="text-xs font-bold text-white">{userName}</div>
                  <div className="text-[11px] text-slate-400">{userEmail}</div>
                  <div className="mt-1 inline-flex items-center rounded-md bg-blue-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-blue-300">
                    {userRole}
                  </div>
                  <div className="absolute right-full bottom-3 -mr-1 border-[5px] border-transparent border-r-slate-950" />
                </div>
              </div>

              {/* Minimized Logout Button */}
              <div className="relative group">
                <button
                  type="button"
                  onClick={handleLogout}
                  aria-label="Log out"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 dark:text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-all active:scale-90 cursor-pointer"
                >
                  <LogOut className="h-4 w-4 stroke-[2]" />
                </button>

                {/* Logout Tooltip */}
                <div className="pointer-events-none absolute left-full top-1/2 ml-3.5 -translate-y-1/2 z-50 hidden rounded-xl bg-slate-950/95 px-3 py-1.5 text-xs font-semibold text-rose-300 shadow-2xl backdrop-blur-md border border-slate-800 group-hover:flex items-center gap-1.5 whitespace-nowrap animate-in fade-in-50 zoom-in-95 duration-150">
                  <LogOut className="h-3 w-3 text-rose-400" />
                  <span>Log out</span>
                  <div className="absolute right-full top-1/2 -mr-1 -translate-y-1/2 border-[5px] border-transparent border-r-slate-950" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
