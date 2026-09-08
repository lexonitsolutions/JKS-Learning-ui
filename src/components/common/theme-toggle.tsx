"use client";

import React, { useEffect, useState } from "react";
import { Sun, Moon, Laptop } from "lucide-react";
import { useTheme } from "@/lib/theme/theme-context";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
  variant?: "icon" | "pill" | "dropdown";
}

export function ThemeToggle({
  className = "",
  showLabel = false,
  variant = "icon",
}: ThemeToggleProps) {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Avoid hydration mismatch by rendering a placeholder of equal size
    return (
      <div
        className={`h-9 w-9 rounded-xl border border-slate-200 bg-slate-100/80 dark:border-slate-800 dark:bg-slate-900 animate-pulse ${className}`}
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  if (variant === "pill") {
    return (
      <div
        className={`inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-slate-100/80 p-1 dark:border-slate-800 dark:bg-slate-900/90 ${className}`}
        role="group"
        aria-label="Theme selection"
      >
        <button
          type="button"
          onClick={() => setTheme("light")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            theme === "light"
              ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          title="Light Theme"
        >
          <Sun className="h-3.5 w-3.5 text-amber-500" />
          {showLabel && <span>Light</span>}
        </button>

        <button
          type="button"
          onClick={() => setTheme("dark")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            theme === "dark"
              ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          title="Dark Theme"
        >
          <Moon className="h-3.5 w-3.5 text-blue-400" />
          {showLabel && <span>Dark</span>}
        </button>

        <button
          type="button"
          onClick={() => setTheme("system")}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer ${
            theme === "system"
              ? "bg-white text-slate-900 shadow-xs dark:bg-slate-800 dark:text-white"
              : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
          }`}
          title="System Preference"
        >
          <Laptop className="h-3.5 w-3.5 text-slate-400" />
          {showLabel && <span>Auto</span>}
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-700 shadow-xs hover:border-slate-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900/90 dark:text-slate-300 dark:hover:border-slate-700 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${className}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <div className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-amber-500 transition-all duration-300 ${
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-blue-400 transition-all duration-300 ${
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
      </div>
      {showLabel && (
        <span className="ml-2 text-xs font-semibold">
          {isDark ? "Dark Mode" : "Light Mode"}
        </span>
      )}
    </button>
  );
}
