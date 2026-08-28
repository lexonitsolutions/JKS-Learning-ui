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
  type LucideIcon,
} from "lucide-react";
import { useMockSession, logoutMockSession } from "@/lib/auth/use-mock-auth";

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const STUDENT_NAV: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/my-courses", label: "My Courses", icon: BookOpen },
  { href: "/dashboard/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/dashboard/ai-interview", label: "AI Mock Interview", icon: BrainCircuit },
  { href: "/dashboard/certificates", label: "Certificates", icon: Award },
  { href: "/dashboard/payments", label: "Payment History", icon: CreditCard },
  { href: "/dashboard/profile", label: "Profile", icon: User },
];

const ADMIN_NAV: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/students", label: "Students", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: BookOpen },
  { href: "/admin/instructors", label: "Instructors", icon: GraduationCap },
  { href: "/admin/assessments", label: "Assessments", icon: ClipboardCheck },
  { href: "/admin/ai-interviews", label: "AI Interviews", icon: BrainCircuit },
  { href: "/admin/certificates", label: "Certificates", icon: Award },
  { href: "/admin/payments", label: "Payments", icon: CreditCard },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const NAV_BY_ROLE: Record<"student" | "admin", NavItem[]> = {
  student: STUDENT_NAV,
  admin: ADMIN_NAV,
};

const SIDEBAR_STORAGE_KEY = "jks_sidebar_collapsed";

export function DashboardSidebar({ role = "student" }: { role?: "student" | "admin" }) {
  const pathname = usePathname();
  const session = useMockSession();
  const items = NAV_BY_ROLE[role];
  const rootHref = role === "student" ? "/dashboard" : "/admin";

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
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

  const isAdmin = role === "admin";
  const userInitials = isAdmin ? "AD" : (session?.initials ?? "JD");
  const userName = isAdmin
    ? (session?.name && session.name !== "John Doe" ? session.name : "Ava Desai")
    : (session?.name ?? "Student");
  const userEmail = isAdmin
    ? (session?.email && session.email !== "student@jkslearning.com" ? session.email : "admin@jkslearning.com")
    : (session?.email ?? "student@jkslearning.com");

  return (
    <aside
      className={`hidden shrink-0 flex-col p-4 md:flex transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-[88px]" : "w-[260px]"
      }`}
    >
      <div className="flex h-full flex-col rounded-[22px] border border-white/70 bg-white/85 shadow-[0_10px_35px_-5px_rgba(20,50,100,0.08),0_2px_6px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 overflow-hidden">
        {/* Header / Logo / Collapse Button */}
        <div
          className={`flex h-20 items-center transition-all duration-300 ${
            isCollapsed ? "justify-center px-2" : "justify-between px-6"
          }`}
        >
          {!isCollapsed ? (
            <>
              <Link href={rootHref} className="flex items-center gap-1 text-xl font-bold tracking-tight text-slate-900 truncate">
                JKS <span className="text-[#2563EB]">Learning</span>
              </Link>
              <button
                type="button"
                onClick={toggleSidebar}
                aria-label="Collapse sidebar"
                title="Minimize sidebar"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              >
                <PanelLeftClose className="h-5 w-5 stroke-[2]" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={toggleSidebar}
              aria-label="Expand sidebar"
              title="Expand sidebar"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] hover:bg-blue-100 transition-all shadow-xs"
            >
              <PanelLeftOpen className="h-5 w-5 stroke-[2.2]" />
            </button>
          )}
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 space-y-1.5 px-3 py-2 overflow-y-auto overflow-x-hidden">
          {items.map((item) => {
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
                    className={`group flex items-center justify-between rounded-xl px-4 py-2.5 text-[14px] font-medium transition-all duration-200 ${
                      isCoursesActive && pathname === "/admin/courses"
                        ? "bg-[#EFF6FF] text-[#2563EB] font-semibold shadow-xs"
                        : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <item.icon
                        className={`h-4 w-4 shrink-0 transition-colors ${
                          isCoursesActive ? "text-[#2563EB] stroke-[2.2]" : "text-slate-400 group-hover:text-slate-600 stroke-[1.8]"
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>
                  </Link>

                  {/* Sub-menu under Courses */}
                  <div className="pl-6 pr-1 py-0.5 space-y-1">
                    <Link
                      href="/admin/courses"
                      className={`flex items-center gap-2 rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                        pathname === "/admin/courses"
                          ? "bg-blue-100/60 text-[#2563EB] font-bold"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                      <span>All Courses</span>
                    </Link>

                    <Link
                      href="/admin/courses/new"
                      className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-[12px] font-medium transition-colors ${
                        pathname === "/admin/courses/new"
                          ? "bg-blue-100/60 text-[#2563EB] font-bold"
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
              <div key={item.href} className="relative group">
                <Link
                  href={item.href}
                  className={`flex items-center rounded-xl text-[14px] font-medium transition-all duration-200 ${
                    isCollapsed
                      ? "h-11 w-11 mx-auto justify-center"
                      : "gap-3.5 px-4 py-2.5"
                  } ${
                    active
                      ? "bg-[#EFF6FF] text-[#2563EB] font-semibold shadow-xs"
                      : "text-slate-600 hover:bg-slate-50/80 hover:text-slate-900"
                  }`}
                >
                  <item.icon
                    className={`h-[18px] w-[18px] shrink-0 transition-colors ${
                      active
                        ? "text-[#2563EB] stroke-[2.2]"
                        : "text-slate-400 group-hover:text-slate-600 stroke-[1.8]"
                    }`}
                  />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                </Link>

                {/* Tooltip on hover when minimized */}
                {isCollapsed && (
                  <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xl group-hover:block whitespace-nowrap">
                    {item.label}
                    <div className="absolute right-full top-1/2 -mr-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* User Profile Card at Bottom */}
        <div className={`p-3 transition-all duration-300 ${isCollapsed ? "flex flex-col items-center" : ""}`}>
          {!isCollapsed ? (
            <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white shadow-xs">
                  {userInitials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-semibold text-slate-900">{userName}</div>
                  <div className="truncate text-xs text-slate-400">{userEmail}</div>
                </div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-rose-600 hover:shadow-xs"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Log out</span>
              </button>
            </div>
          ) : (
            <div className="relative group">
              <button
                type="button"
                onClick={handleLogout}
                aria-label="Log out"
                className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2563EB] text-sm font-bold text-white shadow-xs hover:ring-4 hover:ring-rose-100 hover:bg-rose-600 transition-all"
              >
                {userInitials}
              </button>
              <div className="pointer-events-none absolute left-full top-1/2 ml-3 -translate-y-1/2 z-50 hidden rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-white shadow-xl group-hover:block whitespace-nowrap">
                <div className="font-semibold">{userName}</div>
                <div className="text-rose-400 text-[11px] flex items-center gap-1 mt-0.5">
                  <LogOut className="h-3 w-3" /> Click to log out
                </div>
                <div className="absolute right-full top-1/2 -mr-1 -translate-y-1/2 border-4 border-transparent border-r-slate-900" />
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
