"use client";

import Link from "next/link";
import { LogIn, UserPlus, X, Lock } from "lucide-react";
import { setPostLoginTarget } from "@/lib/auth/post-login";

/**
 * Shown when a visitor tries to use a feature that needs an account (enrolling,
 * for example). After signing in or signing up they come back to `returnTo`.
 */
export function SignInRequiredModal({
  isOpen,
  onClose,
  returnTo,
  reason = "enroll in this course",
}: {
  isOpen: boolean;
  onClose: () => void;
  returnTo: string;
  reason?: string;
}) {
  if (!isOpen) return null;
  const from = encodeURIComponent(returnTo);
  const remember = () => setPostLoginTarget(returnTo);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="Sign in required"
    >
      <div className="fixed inset-0" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-200/70 bg-blue-50 text-[#2563EB] dark:border-blue-800/40 dark:bg-blue-950/50 dark:text-blue-400">
          <Lock className="h-7 w-7" />
        </div>
        <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">Sign in to continue</h3>
        <p className="mt-2 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
          You need a JKS Learning account to {reason}. Sign in, or create a free account in a minute - you will come
          straight back here.
        </p>
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            href={`/login?from=${from}`}
            onClick={remember}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700"
          >
            <LogIn className="h-4 w-4" /> Sign in
          </Link>
          <Link
            href={`/sign-up?from=${from}`}
            onClick={remember}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <UserPlus className="h-4 w-4" /> Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}
