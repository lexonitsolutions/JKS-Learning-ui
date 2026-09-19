"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RefreshCw, Home, ArrowLeft } from "lucide-react";
import { JksLogo } from "@/components/common/jks-logo";
import { logoutMockSession } from "@/lib/auth/use-mock-auth";

export default function AuthErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Auth Error]", error);
  }, [error]);

  const handleResetSession = () => {
    logoutMockSession();
    if (typeof window !== "undefined") {
      window.location.replace("/login");
    } else {
      reset();
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center justify-center rounded-3xl bg-white dark:bg-surface-secondary p-8 text-center shadow-2xl border border-slate-100 dark:border-slate-800/80">
      <div className="mb-4">
        <JksLogo size="md" />
      </div>

      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-4">
        <AlertCircle className="h-7 w-7" />
      </div>

      <h2 className="text-xl font-black text-slate-900 dark:text-white">
        Authentication State Recovered
      </h2>

      <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
        Your login session was refreshed or disconnected. Click below to sign in or return to the platform.
      </p>

      <div className="mt-6 flex flex-col gap-3 w-full">
        <button
          type="button"
          onClick={handleResetSession}
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Reload Sign In Page</span>
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated py-2.5 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors"
        >
          <Home className="h-3.5 w-3.5" />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
