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
  type LucideIcon,
} from "lucide-react";
import { useMockSession, logoutMockSession } from "@/lib/auth/use-mock-auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  badge?: string;
}

const STUDENT_MAIN_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/dashboard/ai-interview", label: "AI Mock Interview", icon: BrainCircuit, badge: "AI" },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
];

const STUDENT_SEC_NAV: NavItem[] = [
  { href: "/dashboard/payments", label: "Payment History", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const ADMIN_MAIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/admin/ai-interviews", label: "AI Interviews", icon: BrainCircuit, badge: "AI" },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
];

const ADMIN_SEC_NAV: NavItem[] = [
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const SIDEBAR_STORAGE_KEY = "jks_sidebar_collapsed";

export function DashboardSidebar({ role = "student" }: { role?: "student" | "admin" }) {
  const pathname = usePathname();
  const session = useMockSession();
  const isAdmin = role === "admin";
  const mainItems = isAdmin ? ADMIN_MAIN_NAV : STUDENT_MAIN_NAV;
  const secItems = isAdmin ? ADMIN_SEC_NAV : STUDENT_SEC_NAV;
  const rootHref = isAdmin ? "/admin" : "/dashboard";

  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      if (saved !== null) {
        setIsCollapsed(saved === "true");
      }
    } catch {
      // Ignore localStorage errors
    }
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

  const handleLogout = () => {
    logoutMockSession();
    window.location.assign("/login");
  };

  const userInitials = isAdmin ? "AD" : (session?.initials ?? "JD");
  const userName = isAdmin
    ? (session?.name && session.name !== "John Doe" ? session.name : "Ava Desai")
    : (session?.name ?? "Student");
  const userEmail = isAdmin
    ? (session?.email && session.email !== "student@jkslearning.com" ? session.email : "admin@jkslearning.com")
    : (session?.email ?? "student@jkslearning.com");
  const userRole = isAdmin ? "Administrator" : "Student";

  const renderNavGroup = (items: NavItem[]) => {
    return items.map((item) => {
      const isCoursesNav = isAdmin && item.href === "/admin/courses";
      const isCoursesActive = pathname.startsWith("/admin/courses");
      const active =
        item.href === pathname ||
        (item.href !== rootHref && pathname.startsWith(item.href));

      if (isCoursesNav && !isCollapsed) {
        return (
          <div key={item.href} className="space-y-1">
            <Link
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-[13.5px] font-medium transition-all duration-200 ${
                isCoursesActive && pathname === "/admin/courses"
                  ? "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/25"
                  : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isCoursesActive && pathname === "/admin/courses"
                      ? "text-white"
                      : "text-slate-400 group-hover:text-slate-700"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </div>
            </Link>

            {/* Sub-menu under Courses */}
            <div className="pl-6 pr-1 py-0.5 space-y-1 border-l-2 border-slate-100 ml-4">
              <Link
                href="/admin/courses"
                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                  pathname === "/admin/courses"
                    ? "bg-blue-50 text-[#2563EB] font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                <span>All Courses</span>
              </Link>

              <Link
                href="/admin/courses/new"
                className={`flex items-center justify-between rounded-lg px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                  pathname === "/admin/courses/new"
                    ? "bg-blue-50 text-[#2563EB] font-bold"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                  <span>New Course</span>
                </div>
                <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[10px] font-bold text-white leading-none">
                  +
                </span>
              </Link>
            </div>
          </div>
        );
      }

      return (
        <div key={item.href} className="relative group flex items-center justify-center">
          <Link
            href={item.href}
            className={`relative flex items-center transition-all duration-200 ${
              isCollapsed
                ? "h-10 w-10 justify-center rounded-xl"
                : "w-full gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px]"
            } ${
              active
                ? isCollapsed
                  ? "bg-gradient-to-tr from-[#2563EB] to-[#3B82F6] text-white shadow-md shadow-blue-500/30 scale-105"
                  : "bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/25"
                : "text-slate-600 hover:bg-slate-100/90 hover:text-slate-900 active:scale-95"
            }`}
          >
            <item.icon
              className={`shrink-0 transition-colors ${
                isCollapsed ? "h-[19px] w-[19px]" : "h-4 w-4"
              } ${
                active
                  ? "text-white"
                  : "text-slate-400 group-hover:text-slate-700"
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
                        : "bg-blue-50 text-blue-600"
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
      <div className="relative flex h-full flex-col rounded-[24px] border border-white/80 bg-white/90 shadow-[0_12px_36px_-6px_rgba(20,50,100,0.08),0_2px_10px_rgba(0,0,0,0.02)] backdrop-blur-2xl transition-all duration-300 overflow-hidden">
        {/* Header: Logo & Toggle */}
        <div
          className={`flex h-[72px] shrink-0 items-center border-b border-slate-100/70 transition-all duration-300 ${
            isCollapsed ? "flex-col justify-center gap-1 px-2" : "justify-between px-5"
          }`}
        >
          {!isCollapsed ? (
            <>
              <Link href={rootHref} className="flex items-center gap-2.5 truncate group">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] text-white font-extrabold text-sm shadow-md shadow-blue-500/25 ring-1 ring-white/30 group-hover:scale-105 transition-transform">
                  JKS
                </div>
                <div className="flex flex-col">
                  <span className="text-[15px] font-bold tracking-tight text-slate-900 leading-tight">
                    JKS <span className="text-[#2563EB]">Learning</span>
                  </span>
                  <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {userRole}
                  </span>
                </div>
              </Link>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                title="Collapse sidebar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <PanelLeftClose className="h-4 w-4 stroke-[2]" />
              </button>
            </>
          ) : (
            <div className="relative group flex items-center justify-center">
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Expand sidebar"
                title="Expand sidebar"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-[#60A5FA] text-white shadow-md shadow-blue-500/25 ring-1 ring-white/40 hover:scale-105 active:scale-95 transition-all"
              >
                <span className="font-extrabold text-xs tracking-tight">JKS</span>
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-slate-900 text-white ring-2 ring-white">
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
            <div className="h-px w-full bg-slate-100" />
          </div>

          {/* Secondary Section */}
          <div className={isCollapsed ? "space-y-2" : "space-y-1"}>
            {renderNavGroup(secItems)}
          </div>
        </nav>

        {/* Footer: User Profile & Quick Actions */}
        <div
          className={`shrink-0 border-t border-slate-100/70 p-2.5 transition-all duration-300 ${
            isCollapsed ? "flex flex-col items-center gap-2" : ""
          }`}
        >
          {!isCollapsed ? (
            <div className="rounded-2xl border border-slate-100/90 bg-gradient-to-b from-slate-50/80 to-white/90 p-3 shadow-xs">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-xs font-bold text-white shadow-xs ring-1 ring-white">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-bold text-slate-900 leading-tight">
                    {userName}
                  </div>
                  <div className="truncate text-[11px] text-slate-400">{userEmail}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100/80 hover:bg-rose-50 hover:text-rose-600 px-2.5 py-1.5 text-xs font-semibold text-slate-600 transition-all active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              {/* Minimized User Avatar */}
              <div className="relative group">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-slate-700 text-xs font-bold text-white shadow-sm ring-2 ring-white/90 hover:ring-blue-400 cursor-pointer transition-all">
                  {userInitials}
                  <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
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
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all active:scale-90"
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
