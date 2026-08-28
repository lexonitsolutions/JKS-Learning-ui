"use client";

import { useEffect } from "react";
import Link from "next/link";
import { isChunkLoadError, handleChunkRetry } from "@/components/common/chunk-error-handler";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If a chunk load error occurred (e.g. following a deployment), attempt automatic silent reload
    if (isChunkLoadError(error)) {
      const retried = handleChunkRetry();
      if (retried) return;
    }
    console.error("Route error:", error);
  }, [error]);

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      reset();
    }
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full text-center space-y-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-2xl shadow-xl">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400">
          <AlertCircle className="w-7 h-7" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
            Temporary Loading Issue
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            A new version may have been deployed or the network was interrupted. Click reload to refresh with the latest content.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={handleReload}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-all shadow-sm active:scale-95"
          >
            <RefreshCw className="w-4 h-4" />
            Reload Page
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-sm transition-all border border-slate-200 dark:border-slate-700 active:scale-95"
          >
            <Home className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
