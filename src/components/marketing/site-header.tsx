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
import { useMockSession, logoutMockSession, performLogout } from "@/lib/auth/use-mock-auth";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { JksLogo } from "@/components/common/jks-logo";
import { ThemeToggle } from "@/components/common/theme-toggle";

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
  const [customAvatar, setCustomAvatar] = useState<string | null>(null);

  const { isSignedIn, isLoaded: isAuthLoaded, signOut } = useAuth();
  const { user: clerkUser } = useUser();
  const session = useMockSession();

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

  const isUserAuthenticated = (isAuthLoaded && !!isSignedIn) || !!session;
  const clerkEmail = clerkUser?.primaryEmailAddress?.emailAddress || clerkUser?.emailAddresses?.[0]?.emailAddress;
  const clerkName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    clerkUser?.username;

  const userEmail = clerkEmail || session?.email || "";
  const userName = clerkName || session?.name || userEmail.split("@")[0] || "Student";
  const isSuperAdminEmail = userEmail.toLowerCase() === "lexonitservices@gmail.com";
  const userRole = isSuperAdminEmail ? "admin" : (session?.role || "student");

  const userAvatar =
    customAvatar ||
    clerkUser?.imageUrl ||
    (userEmail
      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || userEmail)}&background=2563eb&color=fff&bold=true&size=128`
      : undefined);

  const userInitials = isSuperAdminEmail
    ? "LX"
    : clerkUser?.firstName && clerkUser?.lastName
      ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`.toUpperCase()
      : userName.slice(0, 2).toUpperCase();

  const dashboardHref =
    userRole === "admin" ? "/admin" : userRole === "instructor" ? "/instructor" : "/dashboard";

  // Dynamic Navigation items
  const navLinks = [
    { href: "/courses", label: "Courses" },
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
    await performLogout(signOut);
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 dark:bg-background/90 text-text-heading dark:text-slate-100 backdrop-blur-xl transition-all duration-300 ${
        scrolled
          ? "border-border dark:border-slate-800/80 shadow-[0_4px_20px_rgba(11,31,58,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-16">
        <JksLogo size="md" className="py-1" />

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => {
            const active = pathname.startsWith(link.href) && link.href !== "/";

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                  active
                    ? "text-primary-blue dark:text-blue-400"
                    : "text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary-fill transition-all duration-300 ease-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {!isUserAuthenticated ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-semibold text-slate-600 dark:text-slate-300 transition-colors hover:text-slate-900 dark:hover:text-white sm:block px-3 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-surface-hover"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="hidden text-sm font-semibold text-primary-blue bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 px-3.5 py-1.5 rounded-lg transition-colors hover:bg-blue-100 dark:hover:bg-blue-900/50 sm:block"
              >
                Register
              </Link>
              <Link
                href="/register-course"
                className="group inline-flex items-center gap-2 rounded-xl bg-primary-fill px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-primary-blue/25 transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary-blue/30"
              >
                Enroll Now
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
              </Link>
            </>
          ) : (
            <>
              {/* Public Header User Avatar linking directly to Dashboard */}
              <Link
                href={dashboardHref}
                className="flex items-center rounded-full p-0.5 transition-transform hover:scale-105 shrink-0 focus:outline-none"
                aria-label="Open My Dashboard"
              >
                <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md ring-2 ring-blue-500/30 overflow-hidden">
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
                  <span className={userAvatar ? "sr-only" : ""}>{userInitials}</span>
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
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border dark:border-slate-800 text-text-heading dark:text-slate-200 transition-colors hover:bg-bg-light dark:hover:bg-surface-hover md:hidden cursor-pointer"
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
            className="overflow-hidden border-t border-border dark:border-slate-800 bg-white/95 dark:bg-background/95 backdrop-blur-xl md:hidden"
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
                          ? "bg-primary-blue/10 dark:bg-blue-950/60 text-primary-blue dark:text-blue-400 font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white"
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
                  className="mt-2 border-t border-slate-200 dark:border-slate-800 pt-3 flex flex-col gap-2"
                >
                  <Link
                    href="/login"
                    className="block rounded-lg px-3 py-2.5 text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-900 dark:hover:text-white"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    className="block text-center rounded-xl bg-primary-fill py-2.5 text-sm font-bold text-white shadow-xs hover:bg-blue-600"
                  >
                    Register
                  </Link>
                </motion.div>
              ) : (
                <motion.div
                  initial={reducedMotion ? undefined : { opacity: 0, x: -12 }}
                  animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: 0.05 + navLinks.length * 0.05 }}
                  className="mt-2 border-t border-border dark:border-slate-800 pt-3 flex flex-col gap-1.5"
                >
                  <div className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl mb-1">
                    <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userEmail}</p>
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
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 text-left cursor-pointer"
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
