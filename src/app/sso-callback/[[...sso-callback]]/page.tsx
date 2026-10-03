"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthenticateWithRedirectCallback, useAuth } from "@clerk/nextjs";
import { Check, ShieldCheck, LoaderCircle, ArrowRight, X } from "lucide-react";

import { JksLogo } from "@/components/common/jks-logo";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

// Landing point for the Clerk OAuth round-trip (Google / GitHub).
//
// <AuthenticateWithRedirectCallback> reads the handshake params off the URL,
// finishes the sign-in (or sign-up), and then navigates.
// We also monitor useAuth() directly so as soon as isSignedIn becomes true,
// we immediately route to /auth-redirect without waiting for Clerk's internal router.
//
// The #clerk-captcha element must remain mounted and visible for Smart CAPTCHA widget.

const STEPS = [
  { label: "Account authorized", detail: "Provider confirmed your identity" },
  { label: "Verifying session", detail: "Establishing a secure session" },
  { label: "Opening your dashboard", detail: "Almost there" },
];

// Paces the checklist against the real handshake.
const STEP_MS = 1000;
// How long before we offer a prominent manual escape hatch.
const SLOW_MS = 3500;

export default function SSOCallbackPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [isSlow, setIsSlow] = useState(false);

  // Instant redirect as soon as Clerk confirms session
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      window.location.replace("/auth-redirect");
    }
  }, [isLoaded, isSignedIn]);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), STEP_MS),
      setTimeout(() => setStep(2), STEP_MS * 2),
      setTimeout(() => setIsSlow(true), SLOW_MS),
      // Fallback redirect after 6.5s in case session exists in cookies
      setTimeout(() => {
        if (typeof window !== "undefined") {
          window.location.replace("/auth-redirect");
        }
      }, 6500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] dark:bg-background p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-2xl">
        {/* Brand header */}
        <div className="relative flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-100/60 dark:from-slate-900/80 dark:via-blue-950/40 dark:to-slate-900/80 px-7 py-5">
          <JksLogo size="md" href="" />
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 dark:border-blue-900/50 bg-white/80 dark:bg-blue-950/60 px-3 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              Secure
            </span>
            <Link
              href="/login"
              title="Cancel and return to login"
              aria-label="Cancel"
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 dark:bg-slate-800/80 dark:hover:bg-slate-700 dark:text-slate-400 dark:hover:text-white transition-all cursor-pointer border border-slate-200/60 dark:border-slate-700/60"
            >
              <X className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        <div className="px-7 py-8">
          {/* Spinner + heading */}
          <div className="flex items-center gap-4">
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center">
              {!reducedMotion && (
                <span className="absolute inset-0 animate-ping rounded-full bg-blue-500/15" />
              )}
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#2563EB] to-indigo-600 shadow-lg shadow-blue-500/25">
                <LoaderCircle
                  className={`h-6 w-6 text-white ${reducedMotion ? "" : "animate-spin"}`}
                />
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
                Completing sign-in
              </h1>
              <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                Hang tight — this usually takes a second.
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] to-indigo-600 transition-[width] duration-700 ease-out"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>

          {/* Step checklist */}
          <ol className="mt-6 space-y-3">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <li key={s.label} className="flex items-start gap-3">
                  <span
                    className={[
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-500",
                      done
                        ? "border-transparent bg-[#16a34a] text-white"
                        : active
                          ? "border-[#2563EB] bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-slate-300 dark:text-slate-600",
                    ].join(" ")}
                  >
                    {done ? (
                      <Check className="h-3 w-3" strokeWidth={3} />
                    ) : (
                      <span
                        className={[
                          "h-1.5 w-1.5 rounded-full",
                          active ? "bg-[#2563EB]" : "bg-slate-300 dark:bg-slate-600",
                          active && !reducedMotion ? "animate-pulse" : "",
                        ].join(" ")}
                      />
                    )}
                  </span>
                  <span className="min-w-0">
                    <span
                      className={[
                        "block text-sm font-bold transition-colors duration-500",
                        done || active ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-400",
                      ].join(" ")}
                    >
                      {s.label}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-400">
                      {s.detail}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>

          {/*
            Bot-protection mount point. Clerk injects the Smart CAPTCHA widget
            here during a sign-in -> sign-up transfer. Kept visible so the
            challenge can actually render when one is required.
          */}
          <div id="clerk-captcha" className="mt-6 empty:mt-0" />

          {/* Escape hatch — visible when handshake is taking more than 3.5 seconds */}
          {isSlow && (
            <div className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-[#fffbeb] dark:bg-amber-950/40 p-4 space-y-3">
              <div>
                <p className="text-xs font-bold text-amber-900 dark:text-amber-300">
                  Opening taking longer than usual?
                </p>
                <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-800/85 dark:text-amber-300/80">
                  Your identity may already be authorized. You can jump directly to your dashboard or re-authenticate:
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 pt-0.5">
                <a
                  href="/auth-redirect"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer text-center"
                >
                  <span>Go to Dashboard</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </a>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors text-center"
                >
                  Try Login Again
                </Link>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated px-7 py-3.5">
          <p className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-400">
            Secured by Clerk · JKS Learning
          </p>
        </div>
      </div>

      <AuthenticateWithRedirectCallback
        signInForceRedirectUrl="/auth-redirect"
        signUpForceRedirectUrl="/auth-redirect"
        signInFallbackRedirectUrl="/auth-redirect"
        signUpFallbackRedirectUrl="/auth-redirect"
        continueSignUpUrl="/sign-up"
      />
    </div>
  );
}
