"use client";

import React, { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import {
  Phone,
  ShieldCheck,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Award,
  MessageSquareText,
  Lock,
} from "lucide-react";
import { JksLogo } from "./jks-logo";
import { apiFetch } from "@/lib/api/base-url";

interface GooglePhoneModalProps {
  isOpen: boolean;
  userEmail: string;
  userName?: string;
  accessToken?: string;
  onSuccess: (savedPhone: string) => void;
}

const COUNTRY_CODES = [
  { code: "+91", country: "India", flag: "🇮🇳" },
  { code: "+1", country: "United States / Canada", flag: "🇺🇸" },
  { code: "+44", country: "United Kingdom", flag: "🇬🇧" },
  { code: "+971", country: "United Arab Emirates", flag: "🇦🇪" },
  { code: "+65", country: "Singapore", flag: "🇸🇬" },
  { code: "+61", country: "Australia", flag: "🇦🇺" },
  { code: "+49", country: "Germany", flag: "🇩🇪" },
];

export function GooglePhoneModal({
  isOpen,
  userEmail,
  userName,
  accessToken,
  onSuccess,
}: GooglePhoneModalProps) {
  const [countryCode, setCountryCode] = useState("+91");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const { getToken } = useAuth();

  if (!isOpen) return null;

  const validatePhone = (
    rawInput: string,
    prefix: string
  ): { isValid: boolean; fullFormatted: string; error?: string } => {
    const cleanedDigits = rawInput.replace(/[^0-9]/g, "");

    if (!cleanedDigits) {
      return {
        isValid: false,
        fullFormatted: "",
        error: "Please enter your 10-digit mobile number.",
      };
    }

    if (cleanedDigits.length !== 10) {
      return {
        isValid: false,
        fullFormatted: "",
        error: "Please enter exactly 10 digits for your mobile number.",
      };
    }

    return {
      isValid: true,
      fullFormatted: cleanedDigits,
    };
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
    setPhoneNumber(val);
    if (validationError) setValidationError(null);
    if (serverError) setServerError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    setServerError(null);

    const check = validatePhone(phoneNumber, countryCode);
    if (!check.isValid) {
      setValidationError(check.error || "Invalid phone number");
      return;
    }

    setIsSubmitting(true);

    try {
      let token: string | null | undefined = accessToken;
      if (!token) {
        try {
          token = await getToken?.();
        } catch {}
      }
      if (!token && typeof window !== "undefined") {
        token = localStorage.getItem("jks_access_token");
      }

      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const normalizedEmail = (userEmail || "").trim().toLowerCase();
      if (normalizedEmail) {
        headers["x-user-email"] = normalizedEmail;
      }

      const rawUser =
        typeof window !== "undefined" ? localStorage.getItem("jks_auth_user") : null;
      if (rawUser) {
        headers["x-mock-session"] = encodeURIComponent(rawUser);
      }

      // Try updating via /users/profile using apiFetch
      let res = await apiFetch("/users/profile", {
        method: "PATCH",
        headers,
        body: JSON.stringify({ phone: check.fullFormatted }),
      });

      if (!res.ok) {
        // Fallback to /me
        res = await apiFetch("/me", {
          method: "PATCH",
          headers,
          body: JSON.stringify({ phone: check.fullFormatted }),
        });
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(
          errData.message ||
            `Unable to update profile. Server responded with status ${res.status}.`
        );
      }

      setIsSuccess(true);

      // Persist in localStorage and session
      try {
        if (typeof window !== "undefined") {
          localStorage.setItem("jks_student_profile_phone_v3", check.fullFormatted);
          localStorage.setItem(
            `jks_student_profile_phone_v3_${userEmail.toLowerCase().trim()}`,
            check.fullFormatted
          );
          localStorage.setItem("jks_student_phone", check.fullFormatted);

          const rawUser = localStorage.getItem("jks_auth_user");
          if (rawUser) {
            const parsed = JSON.parse(rawUser);
            parsed.phone = check.fullFormatted;
            localStorage.setItem("jks_auth_user", JSON.stringify(parsed));
          }

          // Trigger custom event so any listeners update immediately
          window.dispatchEvent(new Event("jks_profile_updated"));
        }
      } catch {}

      setTimeout(() => {
        onSuccess(check.fullFormatted);
      }, 700);
    } catch (err: any) {
      console.error("[GooglePhoneModal] Save error:", err);
      setServerError(
        err.message || "Failed to update phone number. Please check your connection and retry."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 shadow-2xl transition-all">
        {/* Top Institutional Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/50 px-6 py-4">
          <div className="flex items-center gap-3">
            <JksLogo size="sm" href="" imgClassName="h-7 w-auto" />
          </div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50/80 dark:bg-blue-950/40 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:text-blue-300">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Student Onboarding</span>
          </div>
        </div>

        <div className="p-6 sm:p-7">
          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-7 w-7 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Profile Completed
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                Your contact details have been verified. Launching your student workspace...
              </p>
            </div>
          ) : (
            <>
              {/* Heading & Intro */}
              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  Add Your Contact Number
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                  Welcome to JKS Learning{userName ? `, ${userName}` : ""}! Please enter your active mobile number to link with your student account.
                </p>
              </div>

              {/* Classic Academic Benefit Highlights */}
              <div className="mt-5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/30 p-3.5 space-y-2.5">
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <span>Receive batch schedules, live class links & timetable alerts</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <span>Authorized certificate delivery & ISO accreditation verification</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <MessageSquareText className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
                  <span>Academic counselor & technical mentor assistance</span>
                </div>
              </div>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                <div>
                  <label
                    htmlFor="student-phone-input"
                    className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                  >
                    Mobile / WhatsApp Number <span className="text-rose-500">*</span>
                  </label>

                  <div className="flex rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15 overflow-hidden transition-all shadow-xs">
                    {/* Country Code Select */}
                    <div className="relative border-r border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        disabled={isSubmitting}
                        className="h-full pl-3 pr-2 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-transparent border-0 focus:outline-none cursor-pointer"
                        aria-label="Country Code"
                      >
                        {COUNTRY_CODES.map((c) => (
                          <option
                            key={c.code}
                            value={c.code}
                            className="bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                          >
                            {c.flag} {c.code}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Number input */}
                    <div className="relative flex-1 flex items-center">
                      <input
                        id="student-phone-input"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        value={phoneNumber}
                        onChange={handleInputChange}
                        placeholder="9876543210"
                        disabled={isSubmitting}
                        className="w-full bg-transparent py-2.5 px-3.5 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none disabled:opacity-60"
                        autoFocus
                      />
                    </div>
                  </div>

                  <p className="mt-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                    Enter your 10-digit mobile number (e.g. 9876543210).
                  </p>
                </div>

                {validationError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>{validationError}</span>
                  </div>
                )}

                {serverError && (
                  <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/50 bg-rose-50 dark:bg-rose-950/40 p-3 text-xs text-rose-700 dark:text-rose-300">
                    <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                    <span>{serverError}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting || !phoneNumber.trim()}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Verifying & Saving...</span>
                      </>
                    ) : (
                      <>
                        <span>Continue to Student Workspace</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-center gap-1.5 text-[11px] text-slate-400 dark:text-slate-500">
                  <Lock className="h-3 w-3" />
                  <span>Encrypted & Confidential · Strictly for academic communication</span>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
