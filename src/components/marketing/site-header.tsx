"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  Menu,
  X,
  LayoutDashboard,
  BookOpen,
  BrainCircuit,
  User,
  LogOut,
  ChevronDown,
  Shield,
  GraduationCap,
} from "lucide-react";
import { useAuth, useUser } from "@clerk/nextjs";
import { useMockSession, logoutMockSession } from "@/lib/auth/use-mock-auth";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { JksLogo } from "@/components/common/jks-logo";

const BASE_NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/ai-mock-interview", label: "AI Mock Interview" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/about", label: "About" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { isSignedIn, isLoaded: isAuthLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const session = useMockSession();

  const isUserAuthenticated = (isAuthLoaded && !!isSignedIn) || !!session;
  const userEmail = clerkUser?.primaryEmailAddress?.emailAddress || session?.email || "";
  const userName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    session?.name ||
    userEmail.split("@")[0] ||
    "Student";
  const userRole = session?.role || "student";
  const userAvatar = clerkUser?.imageUrl;
  const userInitials =
    clerkUser?.firstName && clerkUser?.lastName
      ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`.toUpperCase()
      : userName.slice(0, 2).toUpperCase();

  const dashboardHref =
    userRole === "admin" ? "/admin" : userRole === "instructor" ? "/instructor" : "/dashboard";

  // Dynamic Navigation items
  const navLinks = [
    { href: "/courses", label: "Courses" },
    isUserAuthenticated
      ? { href: dashboardHref, label: "Dashboard", isDashboard: true }
      : { href: "/register-course", label: "Enroll Now", isEnroll: true },
    { href: "/ai-mock-interview", label: "AI Mock Interview" },
    { href: "/success-stories", label: "Success Stories" },
    { href: "/about", label: "About" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation
  useEffect(() => {
    const timer = setTimeout(() => {
      setMenuOpen(false);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      if (signOut) {
        await signOut();
      }
    } catch {}
    logoutMockSession();
    window.location.assign("/");
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 text-text-heading backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-border shadow-[0_4px_20px_rgba(11,31,58,0.06)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-16">
        <JksLogo size="md" className="py-1" />

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href) && link.href !== "/";
            const isEnroll = link.isEnroll;
            const isDashboard = link.isDashboard;

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-semibold transition-colors hover:text-text-heading flex items-center gap-1.5 ${
                  active
                    ? "text-primary-blue"
                    : isEnroll
                    ? "text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 hover:bg-blue-100"
                    : isDashboard
                    ? "text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 hover:bg-indigo-100"
                    : "text-text-heading/70"
                }`}
              >
                {isEnroll && <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-pulse" />}
                {isDashboard && <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-pulse" />}
                {link.label}
                {!isEnroll && !isDashboard && (
                  <span
                    className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary-blue transition-all duration-300 ease-out ${
                      active ? "w-full" : "w-0 group-hover:w-full"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {!isUserAuthenticated ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-text-heading/80 transition-colors hover:text-text-heading sm:block px-3 py-1.5 rounded-lg hover:bg-slate-100"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden text-sm font-semibold text-primary-blue bg-blue-50 border border-blue-200 px-3.5 py-1.5 rounded-lg transition-colors hover:bg-blue-100 sm:block"
              >
                Register
              </Link>
              <Link
                href="/register-course"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-blue px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-blue/25 transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary-blue/30"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              {/* Public Header User Avatar linking directly to Dashboard (No dropdown here) */}
              <Link
                href={dashboardHref}
                className="flex items-center rounded-full p-0.5 transition-transform hover:scale-105 shrink-0 focus:outline-none"
                aria-label="Open My Dashboard"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md ring-2 ring-blue-500/30 overflow-hidden">
                  {userAvatar ? (
                    <img src={userAvatar} alt={userName} className="h-full w-full object-cover" />
                  ) : (
                    userInitials
                  )}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
                </div>
              </Link>

              {/* Dynamic Dashboard CTA Button */}
              <Link
                href={dashboardHref}
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 hover:shadow-lg hover:shadow-blue-500/30 cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4" />
                <span>Dashboard</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          )}

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-heading transition-colors hover:bg-bg-light md:hidden cursor-pointer"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            initial={reducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
            animate={reducedMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
            className="overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {navLinks.map((link, i) => {
                const active = pathname.startsWith(link.href) && link.href !== "/";
                return (
                  <motion.div
                    key={link.href}
                    initial={reducedMotion ? undefined : { opacity: 0, x: -12 }}
                    animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                    transition={{ duration: 0.25, delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      className={`block rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                        active
                          ? "bg-primary-blue/8 text-primary-blue font-bold"
                          : "text-text-heading/80 hover:bg-bg-light hover:text-text-heading"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}

              {!isUserAuthenticated ? (
                <motion.div
                  initial={reducedMotion ? undefined : { opacity: 0, x: -12 }}
                  animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + navLinks.length * 0.05 }}
                  className="mt-2 border-t border-border pt-3 flex flex-col gap-2"
                >
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-text-heading/80 hover:bg-bg-light hover:text-text-heading"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center rounded-xl bg-primary-blue py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={reducedMotion ? undefined : { opacity: 0, x: -12 }}
                  animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + navLinks.length * 0.05 }}
                  className="mt-2 border-t border-border pt-3 flex flex-col gap-1.5"
                >
                  <div className="px-3 py-2 bg-slate-50 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-900 truncate">{userName}</p>
                    <p className="text-[11px] text-slate-500 truncate">{userEmail}</p>
                  </div>
                  <Link
                    href={dashboardHref}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-primary-blue"
                  >
                    <LayoutDashboard className="h-4 w-4" /> Go to Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 text-left"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </motion.div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
