"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SkeletonLoaderProps {
  isLoading?: boolean;
  minDisplayTimeMs?: number;
  onFinished?: () => void;
}

export function SkullLoader({
  isLoading = true,
  minDisplayTimeMs = 500,
  onFinished,
}: SkeletonLoaderProps) {
  const [visible, setVisible] = useState(isLoading);

  useEffect(() => {
    if (isLoading) {
      setVisible(true);
    } else {
      const timer = setTimeout(() => {
        setVisible(false);
        onFinished?.();
      }, minDisplayTimeMs);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTimeMs, onFinished]);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        key="skeleton-page-loader"
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="fixed inset-0 z-[9999] flex bg-[#F4F7FC]/90 backdrop-blur-md overflow-hidden select-none pointer-events-auto"
      >
        {/* Left Sidebar Skeleton (Desktop only) */}
        <aside className="hidden md:flex flex-col w-[260px] p-3.5 shrink-0">
          <div className="flex h-full flex-col rounded-[24px] border border-white/80 bg-white/85 p-4 shadow-sm backdrop-blur-xl">
            {/* Logo area skeleton */}
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
              <div className="h-9 w-9 rounded-xl skeleton-shimmer shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-4 w-24 rounded-md skeleton-shimmer" />
                <div className="h-2.5 w-16 rounded-md skeleton-shimmer" />
              </div>
            </div>

            {/* Nav items skeletons */}
            <div className="mt-4 space-y-2 flex-1">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-50/60"
                >
                  <div className="h-4 w-4 rounded-md skeleton-shimmer shrink-0" />
                  <div
                    className="h-3.5 rounded-md skeleton-shimmer"
                    style={{ width: `${60 + (i % 3) * 15}%` }}
                  />
                </div>
              ))}
            </div>

            {/* User Profile bottom skeleton */}
            <div className="p-3 rounded-2xl border border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl skeleton-shimmer shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-20 rounded skeleton-shimmer" />
                <div className="h-2.5 w-28 rounded skeleton-shimmer" />
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content Skeleton Viewport */}
        <main className="flex-1 flex flex-col min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-6">
          {/* Topbar Skeleton */}
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="h-7 w-48 sm:w-64 rounded-xl skeleton-shimmer" />
              <div className="h-3.5 w-32 sm:w-44 rounded-lg skeleton-shimmer" />
            </div>

            <div className="flex items-center gap-3">
              <div className="h-9 w-24 rounded-xl skeleton-shimmer hidden sm:block" />
              <div className="h-9 w-9 rounded-full skeleton-shimmer" />
              <div className="h-9 w-9 rounded-full skeleton-shimmer" />
            </div>
          </div>

          {/* Hero Banner Skeleton */}
          <div className="h-36 sm:h-44 w-full rounded-[24px] skeleton-shimmer border border-white/60 shadow-xs" />

          {/* 4 Metric Cards Grid Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-28 rounded-[20px] border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur-xl space-y-3 flex flex-col justify-between"
              >
                <div className="flex justify-between items-center">
                  <div className="h-3 w-20 rounded skeleton-shimmer" />
                  <div className="h-8 w-8 rounded-xl skeleton-shimmer" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-6 w-16 rounded skeleton-shimmer" />
                  <div className="h-2.5 w-24 rounded skeleton-shimmer" />
                </div>
              </div>
            ))}
          </div>

          {/* 2-Column Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 cols */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center">
                <div className="h-5 w-40 rounded skeleton-shimmer" />
                <div className="h-4 w-16 rounded skeleton-shimmer" />
              </div>

              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 rounded-full skeleton-shimmer" />
                    <div className="h-4 w-16 rounded-full skeleton-shimmer" />
                  </div>
                  <div className="h-5 w-3/4 rounded skeleton-shimmer" />
                  <div className="h-3 w-1/2 rounded skeleton-shimmer" />
                  <div className="pt-2 flex justify-between items-center">
                    <div className="h-3 w-32 rounded skeleton-shimmer" />
                    <div className="h-7 w-28 rounded-xl skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>

            {/* Right 1 col */}
            <div className="space-y-6">
              <div className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-sm space-y-4">
                <div className="h-4 w-32 rounded skeleton-shimmer" />
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-50/70 space-y-2">
                    <div className="flex justify-between">
                      <div className="h-3.5 w-24 rounded skeleton-shimmer" />
                      <div className="h-3 w-12 rounded skeleton-shimmer" />
                    </div>
                    <div className="h-3 w-full rounded skeleton-shimmer" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </motion.div>
    </AnimatePresence>
  );
}

export { SkullLoader as SkeletonPageLoader };
