"use client";

import React, { useState } from "react";
import { Phone, ShieldCheck, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { JksLogo } from "./jks-logo";
import { apiUrl } from "@/lib/api/base-url";

interface GooglePhoneModalProps {
  isOpen: boolean;
  userEmail: string;
  userName?: string;
  accessToken?: string;
  onSuccess: (savedPhone: string) => void;
}

export function GooglePhoneModal({
  isOpen,
  userEmail,
  userName,
  accessToken,
  onSuccess,
}: GooglePhoneModalProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const validatePhone = (input: string): { isValid: boolean; sanitized: string; error?: string } => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { isValid: false, sanitized: "", error: "Phone number is required." };
    }
    const cleaned = trimmed.replace(/[\s\-()]/g, "");
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(cleaned)) {
      return {
        isValid: false,
        sanitized: cleaned,
        error: "Please enter a valid phone number (10 to 15 digits, e.g. +91 9876543210 or 9876543210).",
      };
    }
    return { isValid: true, sanitized: cleaned };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (/^[0-9+\s\-()]*$/.test(val)) {
      setPhoneNumber(val);
      if (validationError) setValidationError(null);
      if (serverError) setServerError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);

    const check = validatePhone(phoneNumber);
    if (!check.isValid) {
      setValidationError(check.error || "Invalid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      const token =
        accessToken ||
        (typeof window !== "undefined" ? localStorage.getItem("jks_access_token") : null);

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(apiUrl("/users/profile"), {
        method: "PATCH",
        headers,
        credentials: "include",
        body: JSON.stringify({ phone: check.sanitized }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.message || `Failed to save phone number (Status ${res.status})`
        );
      }

      setIsSuccess(true);

      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("jks_student_profile_phone_v3", check.sanitized);
          localStorage.setItem(`jks_student_profile_phone_v3_${userEmail}`, check.sanitized);
          const rawUser = localStorage.getItem("jks_auth_user");
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            parsed.phone = check.sanitized;
            localStorage.setItem("jks_auth_user", JSON.stringify(parsed));
          }
        }
      } catch {}

      setTimeout(() => {
        onSuccess(check.sanitized);
      }, 700);
    } catch (err: any) {
      console.error("[GooglePhoneModal] Save error:", err);
      setServerError(err.message || "Failed to update phone number. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 text-white shadow-2xl shadow-blue-500/10">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-48 w-72 rounded-full bg-blue-600/20 blur-3xl" />

        <div className="relative flex items-center justify-between border-b border-slate-800/80 pb-4">
          <JksLogo size="md" variant="dark" href="" imgClassName="h-7 w-auto" />
          <div className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-950/50 px-2.5 py-0.5 text-[10px] font-semibold text-blue-400">
            <ShieldCheck className="h-3 w-3" />
            <span>New Student Onboarding</span>
          </div>
        </div>

        <div className="relative mt-6">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-in zoom-in-75 duration-300">
                <CheckCircle2 className="h-8 w-8 text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Phone Number Saved!</h2>
              <p className="text-xs text-slate-400">Setting up your dashboard workspace...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight text-white">
                    Enter Your Phone Number
                  </h2>
                  <p className="text-xs text-slate-400">
                    Welcome to JKS Learning{userName ? `, ${userName}` : ""}! Please provide your phone number to complete your profile.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <label htmlFor="phone-input" className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Contact Phone Number <span className="text-rose-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                      <Phone className="h-4 w-4" />
                    </div>
                    <input
                      id="phone-input"
                      type="tel"
                      value={phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+91 9876543210"
                      disabled={isSubmitting}
                      className="w-full rounded-xl border border-slate-700 bg-slate-950/80 py-2.5 pl-10 pr-4 text-sm font-medium text-white placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-60"
                      autoFocus
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] text-slate-400">
                    Format: 10 to 15 digits with optional country code (e.g. +91 9876543210)
                  </p>
                </div>

                {validationError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{validationError}</span>
                  </div>
                )}

                {serverError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-950/40 p-2.5 text-xs text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Saving Phone Number...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Dashboard</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
