"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { JksLogo } from "@/components/common/jks-logo";
import { ShieldCheck, LoaderCircle } from "lucide-react";
import Link from "next/link";

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const session = useMockSession();
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowFallback(true), 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isLoaded && !session) return;

    const email = (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      session?.email ||
      ""
    ).toLowerCase().trim();

    if (!email) return;

    const isSuperAdmin = email === "lexonitservices@gmail.com";
    const isAdmin = isSuperAdmin || session?.role === "admin";
    const isInstructor = session?.role === "instructor";

    if (isAdmin) {
      window.location.replace("/admin");
    } else if (isInstructor) {
      window.location.replace("/instructor");
    } else {
      window.location.replace("/dashboard");
    }
  }, [user, isLoaded, session]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0B1020] p-4 text-white">
      <div className="flex w-full max-w-sm flex-col items-center rounded-3xl border border-slate-800 bg-[#111827] p-8 text-center shadow-2xl">
        <div className="mb-6 flex items-center justify-between w-full border-b border-slate-800 pb-4">
          <JksLogo size="md" href="" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-900/50 bg-blue-950/60 px-3 py-1 text-[11px] font-bold text-blue-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Verified
          </span>
        </div>

        <div className="my-6 relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-xl shadow-blue-500/25">
          <LoaderCircle className="h-7 w-7 text-white animate-spin" />
        </div>

        <h1 className="text-lg font-black tracking-tight text-white">
          Preparing your workspace
        </h1>
        <p className="mt-1 text-xs text-slate-400 font-medium">
          Loading credentials and authorizing access...
        </p>

        {showFallback && (
          <div className="mt-6 flex flex-col gap-2 w-full pt-4 border-t border-slate-800 text-xs">
            <p className="text-slate-400">Click below if not redirected automatically:</p>
            <div className="flex justify-center gap-3 mt-1">
              <Link
                href="/admin"
                className="rounded-lg bg-blue-600 px-3 py-1.5 font-bold text-white hover:bg-blue-700"
              >
                Go to Admin
              </Link>
              <Link
                href="/dashboard"
                className="rounded-lg bg-slate-800 px-3 py-1.5 font-bold text-slate-300 hover:bg-slate-700"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
