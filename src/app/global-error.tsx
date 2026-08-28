"use client";

import { useEffect } from "react";
import { isChunkLoadError, handleChunkRetry } from "@/components/common/chunk-error-handler";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // If it's a chunk loading failure after deployment, auto-reload immediately
    if (isChunkLoadError(error)) {
      const retried = handleChunkRetry();
      if (retried) return;
    }
    console.error("Global application error:", error);
  }, [error]);

  const handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    } else {
      reset();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col items-center justify-center bg-slate-950 text-slate-100 p-6 font-sans antialiased">
        <div className="max-w-md w-full text-center space-y-6 bg-slate-900/80 border border-slate-800 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Application Update Available
            </h1>
            <p className="text-sm text-slate-400">
              A newer version of the platform was deployed or the connection was interrupted. Please reload to load the latest changes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              onClick={handleReload}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium text-sm transition-all shadow-lg shadow-blue-500/25 active:scale-95"
            >
              Reload Platform
            </button>
            <button
              onClick={handleGoHome}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm transition-all border border-slate-700 active:scale-95"
            >
              Back to Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
