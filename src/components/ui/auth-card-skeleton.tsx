import React from "react";
import { JksLogo } from "@/components/common/jks-logo";
import { ShieldCheck } from "lucide-react";

export function AuthCardSkeleton({ mode = "login" }: { mode?: "login" | "register" }) {
  return (
    <div className="flex w-full max-w-4xl flex-col md:flex-row overflow-hidden rounded-3xl bg-white dark:bg-surface-secondary shadow-2xl border border-slate-100 dark:border-slate-800/80 animate-pulse">
      {/* Desktop Left side — animated skeleton placeholder */}
      <div className="relative hidden h-[620px] w-1/2 overflow-hidden border-r border-slate-100 dark:border-slate-800/80 md:block bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-blue-100/60 dark:from-background dark:via-surface-secondary dark:to-surface-elevated">
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600/30 mb-6 animate-bounce" />
          <div className="h-8 w-48 rounded-lg bg-slate-200 dark:bg-slate-700 mb-3" />
          <div className="h-4 w-64 rounded-md bg-slate-200/80 dark:bg-slate-700/80" />
        </div>
      </div>

      {/* Right side — Form skeleton */}
      <div className="flex w-full flex-col justify-center bg-white dark:bg-surface-secondary p-6 sm:p-8 md:w-1/2 md:p-10 space-y-5">
        <div className="flex items-center justify-between">
          <JksLogo size="md" />
          <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 px-3 py-1 text-[11px] font-bold text-blue-600 dark:text-blue-400">
            {mode === "login" ? "Secure Login" : "New Account"}
          </span>
        </div>

        <div>
          <div className="h-7 w-40 rounded-lg bg-slate-200 dark:bg-slate-700 mb-2" />
          <div className="h-4 w-56 rounded-md bg-slate-100 dark:bg-slate-800" />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-10 rounded-xl bg-slate-100 dark:bg-surface-elevated" />
          <div className="h-10 rounded-xl bg-slate-100 dark:bg-surface-elevated" />
        </div>

        <div className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-input-bg" />
          </div>

          <div className="space-y-1.5">
            <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-700" />
            <div className="h-10 w-full rounded-xl bg-slate-100 dark:bg-input-bg" />
          </div>

          <div className="h-11 w-full rounded-xl bg-gradient-to-r from-blue-600/50 to-indigo-600/50 mt-2" />
        </div>
      </div>
    </div>
  );
}
