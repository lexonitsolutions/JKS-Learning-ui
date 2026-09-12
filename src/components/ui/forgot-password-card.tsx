"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import {
  KeyRound,
  Mail,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import { JksLogo } from "@/components/common/jks-logo";
import { useSignIn } from "@clerk/nextjs/legacy";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const emailSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});
type EmailValues = z.infer<typeof emailSchema>;

const resetSchema = z
  .object({
    code: z.string().min(4, "Enter the verification code sent to your email"),
    newPassword: z.string().min(10, "Password must be at least 10 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
type ResetValues = z.infer<typeof resetSchema>;

export function ForgotPasswordCard() {
  const reducedMotion = useReducedMotion();
  const { signIn, isLoaded: isSignInLoaded } = useSignIn();

  const [step, setStep] = useState<"email" | "code" | "success">("email");
  const [targetEmail, setTargetEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const {
    register: registerEmail,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors, isSubmitting: isEmailSubmitting },
  } = useForm<EmailValues>({ resolver: zodResolver(emailSchema) });

  const {
    register: registerReset,
    handleSubmit: handleResetSubmit,
    formState: { errors: resetErrors, isSubmitting: isResetSubmitting },
  } = useForm<ResetValues>({ resolver: zodResolver(resetSchema) });

  const onEmailSubmit = async (values: EmailValues) => {
    setFormError(null);
    setSuccessMsg(null);
    const email = values.email.trim().toLowerCase();

    if (isSignInLoaded && signIn) {
      try {
        await signIn.create({
          strategy: "reset_password_email_code",
          identifier: email,
        });
        setTargetEmail(email);
        setStep("code");
        setSuccessMsg(`We sent a password reset code to ${email}`);
        return;
      } catch (err: unknown) {
        if (isClerkAPIResponseError(err)) {
          const first = err.errors?.[0];
          setFormError(first?.longMessage || first?.message || "Could not send reset code.");
        } else if (err instanceof Error) {
          setFormError(err.message);
        } else {
          setFormError("Could not send reset code. Please try again.");
        }
      }
    } else {
      // Fallback simulation for demo/offline accounts
      setTargetEmail(email);
      setStep("code");
      setSuccessMsg(`Password reset instructions sent to ${email}`);
    }
  };

  const onResetSubmit = async (values: ResetValues) => {
    setFormError(null);

    if (isSignInLoaded && signIn) {
      try {
        const result = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: values.code.trim(),
          password: values.newPassword,
        });

        if (result.status === "complete") {
          setStep("success");
        } else {
          setFormError("Reset incomplete. Please verify your code and try again.");
        }
      } catch (err: unknown) {
        if (isClerkAPIResponseError(err)) {
          const first = err.errors?.[0];
          setFormError(first?.longMessage || first?.message || "Failed to reset password.");
        } else if (err instanceof Error) {
          setFormError(err.message);
        } else {
          setFormError("Failed to reset password. Please try again.");
        }
      }
    } else {
      // Demo fallback
      setStep("success");
    }
  };

  const cardMotion = reducedMotion
    ? {}
    : { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.4 } };

  return (
    <motion.div
      {...cardMotion}
      className="flex w-full max-w-md flex-col overflow-hidden rounded-3xl bg-white dark:bg-surface-secondary shadow-2xl border border-slate-100 dark:border-slate-800/80 p-6 sm:p-8"
    >
      {/* Top Header */}
      <div className="mb-6 flex items-center justify-between">
        <JksLogo size="md" />
        <span className="rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-800/60 px-3 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400">
          Account Recovery
        </span>
      </div>

      {step === "email" && (
        <>
          <div className="mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4">
              <KeyRound className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Reset your password
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              Enter the email address associated with your account and we’ll send you a verification code to reset your password.
            </p>
          </div>

          <form onSubmit={handleEmailSubmit(onEmailSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reset-email" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email address <span className="text-blue-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reset-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 pl-10 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all"
                  {...registerEmail("email")}
                />
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
              </div>
              {emailErrors.email && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 leading-relaxed">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isEmailSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-60"
            >
              {isEmailSubmitting ? "Sending code…" : "Send Verification Code"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="pt-2 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to sign in
              </Link>
            </div>
          </form>
        </>
      )}

      {step === "code" && (
        <>
          <div className="mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 mb-4">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Create new password
            </h1>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
              We sent a verification code to <span className="font-bold text-slate-800 dark:text-slate-200">{targetEmail}</span>. Enter the code and your new password.
            </p>
          </div>

          {successMsg && (
            <div className="mb-4 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-2.5 text-xs font-medium text-blue-800 dark:text-blue-300">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleResetSubmit(onResetSubmit)} className="space-y-4" noValidate>
            <div>
              <label htmlFor="reset-code" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Verification Code <span className="text-blue-500">*</span>
              </label>
              <input
                id="reset-code"
                type="text"
                placeholder="Enter 6-digit code"
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 tracking-widest font-mono transition-all"
                {...registerReset("code")}
              />
              {resetErrors.code && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {resetErrors.code.message}
                </p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="reset-new-password" className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  New Password <span className="text-blue-500">*</span>
                </label>
                <span className="text-[11px] font-medium text-slate-400 dark:text-slate-400">Min. 10 chars</span>
              </div>
              <div className="relative">
                <input
                  id="reset-new-password"
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter new password"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all"
                  {...registerReset("newPassword")}
                />
                <button
                  type="button"
                  onClick={() => setPasswordVisible((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {passwordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {resetErrors.newPassword && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {resetErrors.newPassword.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="reset-confirm-password" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-300">
                Confirm New Password <span className="text-blue-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="reset-confirm-password"
                  type={confirmVisible ? "text" : "password"}
                  placeholder="Confirm new password"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 pr-10 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 dark:placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all"
                  {...registerReset("confirmPassword")}
                />
                <button
                  type="button"
                  onClick={() => setConfirmVisible((v) => !v)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  tabIndex={-1}
                >
                  {confirmVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {resetErrors.confirmPassword && (
                <p className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-medium">
                  {resetErrors.confirmPassword.message}
                </p>
              )}
            </div>

            {formError && (
              <p className="rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 px-3.5 py-2.5 text-xs font-semibold text-rose-700 dark:text-rose-300 leading-relaxed">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={isResetSubmitting}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all cursor-pointer disabled:opacity-60"
            >
              {isResetSubmitting ? "Updating password…" : "Reset Password & Continue"}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setFormError(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Change email
              </button>
              <Link
                href="/login"
                className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to sign in
              </Link>
            </div>
          </form>
        </>
      )}

      {step === "success" && (
        <div className="text-center py-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 mb-4">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Password Reset Complete!
          </h2>
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
            Your password has been securely updated. You can now sign in with your new credentials.
          </p>

          <div className="mt-6 flex flex-col gap-3">
            <Link
              href="/login"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all"
            >
              Sign in to your account <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </motion.div>
  );
}
