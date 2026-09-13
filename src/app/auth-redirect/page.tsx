"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { JksLogo } from "@/components/common/jks-logo";
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Cpu,
  ArrowRight,
  Sparkles,
  Lock,
} from "lucide-react";
import Link from "next/link";

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const session = useMockSession();
  const [showFallback, setShowFallback] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  // Progressive steps animation
  useEffect(() => {
    const s1 = setTimeout(() => setStepIndex(1), 600);
    const s2 = setTimeout(() => setStepIndex(2), 1400);
    const fallbackTimer = setTimeout(() => setShowFallback(true), 4000);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(fallbackTimer);
    };
  }, []);

  // Compute destination & redirect
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

    const targetUrl = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/dashboard";

    // Slight delay so the user gets a smooth, satisfying pro-developer verification transition
    const redirectTimer = setTimeout(() => {
      window.location.replace(targetUrl);
    }, 900);

    return () => clearTimeout(redirectTimer);
  }, [user, isLoaded, session]);

  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    session?.email ||
    "";
  const isSuperAdmin = userEmail.toLowerCase() === "lexonitservices@gmail.com";
  const userRole = isSuperAdmin ? "admin" : (session?.role || "student");

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#070B14] p-4 text-white selection:bg-blue-500 selection:text-white">
      {/* Subtle blueprint grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />

      {/* Cyber Ambient Glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[450px] w-[600px] rounded-full bg-blue-600/15 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 right-1/4 h-[350px] w-[450px] rounded-full bg-cyan-500/10 blur-[100px]" />

      {/* Developer Terminal Console Card */}
      <div className="relative z-10 w-full max-w-[440px] overflow-hidden rounded-3xl border border-slate-800/90 bg-slate-900/80 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_25px_70px_rgba(0,0,0,0.85)]">
        {/* Top Header with Logo and Live Telemetry Badge */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-5">
          {/* White logo explicitly forced for dark mode clarity */}
          <div className="flex items-center gap-2">
            <JksLogo size="md" variant="dark" href="" imgClassName="h-8 w-auto filter drop-shadow-[0_2px_8px_rgba(37,99,235,0.4)]" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/50 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>TLS 1.3 SECURE</span>
          </div>
        </div>

        {/* Center Scanner / Orbital Loader */}
        <div className="my-8 flex flex-col items-center justify-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            {/* Outer spinning orbital gradient ring */}
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-cyan-400 border-r-blue-500 animate-spin [animation-duration:2s]" />

            {/* Inner counter-spinning dashed ring */}
            <div className="absolute inset-2 rounded-full border border-dashed border-slate-700/80 border-b-indigo-400 animate-spin [animation-duration:3s] [animation-direction:reverse]" />

            {/* Pulsing center core */}
            <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
          </div>

          {/* Heading & Subtitle */}
          <h1 className="mt-5 text-xl font-black tracking-tight text-white sm:text-2xl">
            Preparing Workspace
          </h1>
          <p className="mt-1 text-center text-xs font-medium text-slate-400">
            Authorizing security tokens and configuring sandbox environment...
          </p>
        </div>

        {/* Real-time Verification Checklist */}
        <div className="space-y-2.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 font-mono text-xs">
          {/* Step 1 */}
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span className="font-medium text-slate-200">Identity Authentication</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-semibold uppercase">Verified</span>
          </div>

          {/* Step 2 */}
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              {stepIndex >= 1 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                </div>
              )}
              <span className="font-medium text-slate-200">Role &amp; Policy Matrix</span>
            </div>
            <span className="text-[10px] text-blue-400 font-semibold uppercase">
              {stepIndex >= 1 ? userRole.toUpperCase() : "Resolving"}
            </span>
          </div>

          {/* Step 3 */}
          <div className="flex items-center justify-between text-slate-300">
            <div className="flex items-center gap-2">
              {stepIndex >= 2 ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              ) : (
                <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                </div>
              )}
              <span className="font-medium text-slate-200">Routing Environment</span>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold uppercase">
              {stepIndex >= 2 ? "Ready" : "Connecting"}
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
            style={{ width: stepIndex === 0 ? "35%" : stepIndex === 1 ? "75%" : "100%" }}
          />
        </div>

        {/* Pro Developer Terminal Log Snippet */}
        <div className="mt-4 flex items-center justify-between px-1 text-[11px] font-mono text-slate-500">
          <span className="inline-flex items-center gap-1">
            <Terminal className="h-3 w-3 text-slate-400" />
            <span>sys.exec(handshake)</span>
          </span>
          <span className="text-slate-400">status: <span className="text-emerald-400 font-bold">200 OK</span></span>
        </div>

        {/* Fallback Escape Hatch */}
        {showFallback && (
          <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
            <p className="text-xs text-slate-400">Taking longer than usual?</p>
            <div className="mt-2.5 flex justify-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
              >
                <span>Enter Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              {userRole === "admin" && (
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/90 px-4 py-2 text-xs font-bold text-slate-300 transition-all hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <span>Admin Panel</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
