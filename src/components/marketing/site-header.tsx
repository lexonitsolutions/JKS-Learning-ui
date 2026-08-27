"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Menu, X } from "lucide-react";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const NAV_LINKS = [
  { href: "/courses", label: "Courses" },
  { href: "/ai-mock-interview", label: "AI Mock Interview" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/about", label: "About" },
];

// Light glass header per the AI-interview hero design spec: white surface,
// dark links, pill "Get Started →" CTA. Mobile gets a real animated menu
// (the old header simply hid the nav below md with no way to open it).
export function SiteHeader() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    const timer = setTimeout(() => setMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/85 text-text-heading backdrop-blur-xl transition-shadow duration-300 ${
        scrolled ? "border-border shadow-[0_4px_20px_rgba(11,31,58,0.06)]" : "border-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6 lg:px-16">
        <Link href="/" className="text-h3 font-bold tracking-tight text-text-heading">
          JKS<span className="text-primary-blue"> Learning</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`group relative text-sm font-medium transition-colors hover:text-text-heading ${
                  active ? "text-primary-blue" : "text-text-heading/70"
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-0.5 rounded-full bg-primary-blue transition-all duration-300 ease-out ${
                    active ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm font-medium text-text-heading/70 transition-colors hover:text-text-heading sm:block"
          >
            Log in
          </Link>
          <Link
            href="/register"
            className="group inline-flex items-center gap-2 rounded-xl bg-primary-blue px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary-blue/25 transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary-blue/30"
          >
            Get Started
            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border text-text-heading transition-colors hover:bg-bg-light md:hidden"
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
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
              {NAV_LINKS.map((link, i) => {
                const active = pathname.startsWith(link.href);
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
                          ? "bg-primary-blue/8 text-primary-blue"
                          : "text-text-heading/80 hover:bg-bg-light hover:text-text-heading"
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
              <motion.div
                initial={reducedMotion ? undefined : { opacity: 0, x: -12 }}
                animate={reducedMotion ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: 0.05 + NAV_LINKS.length * 0.05 }}
                className="mt-2 border-t border-border pt-3 sm:hidden"
              >
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-3 text-base font-medium text-text-heading/80 hover:bg-bg-light hover:text-text-heading"
                >
                  Log in
                </Link>
              </motion.div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
