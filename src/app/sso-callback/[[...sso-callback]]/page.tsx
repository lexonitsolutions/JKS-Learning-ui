"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Check, ShieldCheck, LoaderCircle } from "lucide-react";

import { JksLogo } from "@/components/common/jks-logo";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

// Landing point for the Clerk OAuth round-trip (Google / GitHub).
//
// <AuthenticateWithRedirectCallback> is the entire auth implementation: it
// reads the handshake params off the URL, finishes the sign-in (or the sign-up,
// when the social account is new and Clerk transferred the attempt), and then
// navigates. Everything else on this page is presentation.
//
// Two things here are load-bearing and should not be removed:
//
//  1. The #clerk-captcha element. When Clerk transfers a sign-in to a sign-up
//     for a first-time Google/GitHub account, bot protection runs HERE, not on
//     the login form. With no such element clerk-js logs "Cannot initialize
//     Smart CAPTCHA widget because the clerk-captcha DOM element was not found"
//     and downgrades to the invisible widget, which can stall the transfer and
//     leave this page spinning forever. It must be a real, visible box (never
//     display:none) and the only one on the page.
//
//  2. No auto-redirect timer. An earlier version force-navigated to /dashboard
//     after 1.5s, which tore the page down mid-token-exchange. The escape hatch
//     below is deliberately a LINK the user chooses to click, never an
//     automatic navigation that could race the callback.

const STEPS = [
  { label: "Account authorized", detail: "Provider confirmed your identity" },
  { label: "Verifying session", detail: "Establishing a secure session" },
  { label: "Opening your dashboard", detail: "Almost there" },
];

// Paces the checklist against the real handshake. Purely cosmetic — the actual
// navigation is driven by Clerk, not by this timer.
const STEP_MS = 1400;
// How long before we offer a manual way out.
const SLOW_MS = 9000;

export default function SSOCallbackPage() {
  const reducedMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const [isSlow, setIsSlow] = useState(false);

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), STEP_MS),
      setTimeout(() => setStep(2), STEP_MS * 2),
      setTimeout(() => setIsSlow(true), SLOW_MS),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] dark:bg-[#0B1020] p-4 sm:p-6 md:p-10">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl">
        {/* Brand header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-br from-blue-50 via-indigo-50/50 to-blue-100/60 dark:from-slate-900/80 dark:via-blue-950/40 dark:to-slate-900/80 px-7 py-5">
          <JksLogo size="md" href="" />
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-100 dark:border-blue-900/50 bg-white/80 dark:bg-blue-950/60 px-3 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            Secure
          </span>
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
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#151D2E] text-slate-300 dark:text-slate-600",
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
                        done || active ? "text-slate-900 dark:text-white" : "text-slate-400 dark:text-slate-500",
                      ].join(" ")}
                    >
                      {s.label}
                    </span>
                    <span className="block text-[11px] font-medium text-slate-400 dark:text-slate-500">
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

          {/* Escape hatch — a link, never an automatic redirect. */}
          {isSlow && (
            <div className="mt-6 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-[#fffbeb] dark:bg-amber-950/40 px-4 py-3">
              <p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
                This is taking longer than usual.
              </p>
              <p className="mt-1 text-[11px] font-medium leading-relaxed text-amber-800/80 dark:text-amber-400/80">
                If a security check appeared above, complete it to continue. Otherwise you
                can{" "}
                <Link href="/dashboard" className="font-bold underline underline-offset-2">
                  go to your dashboard
                </Link>{" "}
                or{" "}
                <Link href="/login" className="font-bold underline underline-offset-2">
                  try signing in again
                </Link>
                .
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-[#151D2E] px-7 py-3.5">
          <p className="text-center text-[11px] font-medium text-slate-400 dark:text-slate-500">
            Secured by Clerk · JKS Learning
          </p>
        </div>
      </div>

      <AuthenticateWithRedirectCallback
        signInFallbackRedirectUrl="/dashboard"
        signUpFallbackRedirectUrl="/dashboard"
        continueSignUpUrl="/sign-up"
      />
    </div>
  );
}
