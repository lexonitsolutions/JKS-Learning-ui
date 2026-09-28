"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useMockSession, performLogout } from "@/lib/auth/use-mock-auth";
import { JksLogo } from "@/components/common/jks-logo";
import { GooglePhoneModal } from "@/components/common/google-phone-modal";
import { apiUrl } from "@/lib/api/base-url";
import { jksAnalytics } from "@/lib/analytics/jks-analytics";
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  LogOut,
  Loader2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const session = useMockSession();

  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [resolvedTargetUrl, setResolvedTargetUrl] = useState("/dashboard");
  const [showFallback, setShowFallback] = useState(false);

  const hasInitiatedSync = useRef(false);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => setShowFallback(true), 6000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  const executeSync = useCallback(async () => {
    if (!user) return;

    setSyncStatus("syncing");
    setErrorMessage(null);

    const email = (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""
    )
      .toLowerCase()
      .trim();

    if (!email) {
      setSyncStatus("error");
      setErrorMessage("No primary email found in authentication profile.");
      return;
    }

    try {
      const token = await getToken();
      if (!token) {
        throw new Error("Unable to retrieve authentication token from security session.");
      }

      const res = await fetch(apiUrl("/auth/clerk-sync"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        credentials: "include",
        signal: AbortSignal.timeout(12000),
      });

      if (res.status === 403) {
        // Account blocked by administrator
        await performLogout(signOut);
        window.location.replace("/login?blocked=1");
        return;
      }

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        setSyncStatus("error");
        setErrorMessage(
          errorData.message ||
            "Unable to synchronize your account with the database. Please check your network and retry."
        );
        return;
      }

      const data = await res.json();
      const backendUser = data?.user;
      const isNewUser = Boolean(data?.isNewUser);

      if (data?.accessToken && typeof window !== "undefined") {
        setAccessToken(data.accessToken);
        try {
          localStorage.setItem("jks_access_token", data.accessToken);
        } catch {}
      }

      // Check role and compute target URL
      const isSuperAdmin = email === "lexonitservices@gmail.com";
      const isAdmin =
        isSuperAdmin ||
        backendUser?.role === "SUPER_ADMIN" ||
        backendUser?.role === "ADMIN";
      const isInstructor = backendUser?.role === "INSTRUCTOR";
      const target = isAdmin ? "/admin" : isInstructor ? "/instructor" : "/dashboard";
      setResolvedTargetUrl(target);

      // Save user session
      if (typeof window !== "undefined" && backendUser) {
        try {
          localStorage.setItem(
            "jks_auth_user",
            JSON.stringify({
              email,
              name: backendUser.name,
              role: isAdmin ? "admin" : isInstructor ? "instructor" : "student",
              status: backendUser.status || "ACTIVE",
              avatar: backendUser.avatarUrl || user.imageUrl,
              phone: backendUser.phone || null,
            })
          );
        } catch {}
      }

      setSyncStatus("success");

      // Verify whether student has a valid phone number recorded in their profile
      const rawPhone = String(backendUser?.phone || "").trim();
      const hasPhoneInProfile =
        rawPhone.length >= 10 && rawPhone !== "null" && rawPhone !== "undefined";

      const shouldAskPhone =
        !isAdmin && (!hasPhoneInProfile || Boolean(data?.needsPhone) || isNewUser);

      if (isNewUser) {
        jksAnalytics.signup("clerk_oauth");
      } else {
        jksAnalytics.login("clerk_oauth");
      }

      if (shouldAskPhone) {
        // Halt automatic navigation and display the official phone number completion modal
        setShowPhoneModal(true);
      } else {
        // User already has phone number in profile — proceed smoothly to target
        setTimeout(() => {
          window.location.replace(target);
        }, 800);
      }
    } catch (err: any) {
      console.error("[AuthRedirect] clerk-sync failed:", err);
      setSyncStatus("error");
      setErrorMessage(
        err?.message?.includes("timed out")
          ? "Database connection timed out. Please check your internet connection."
          : "Encountered a connection issue while synchronizing your account."
      );
    }
  }, [user, getToken, signOut]);

  useEffect(() => {
    if (!isLoaded || !user) return;
    if (hasInitiatedSync.current) return;
    hasInitiatedSync.current = true;
    void executeSync();
  }, [isLoaded, user, executeSync]);

  const handlePhoneSuccess = (_savedPhone: string) => {
    setShowPhoneModal(false);
    window.location.replace(resolvedTargetUrl);
  };

  const handleRetry = () => {
    hasInitiatedSync.current = false;
    void executeSync();
  };

  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    session?.email ||
    "";
  const userName = user?.fullName || user?.firstName || session?.name || "Student";

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0B0F19] p-4 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Subtle classic gradient aura */}
      <div className="pointer-events-none absolute inset-0 bg-radial from-blue-500/5 via-transparent to-transparent opacity-80" />

      {/* Main Authentication Card */}
      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-[#111827] p-7 sm:p-8 shadow-xl">
        {/* Card Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
          <JksLogo size="sm" href="" imgClassName="h-7 w-auto" />
          <div className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            <span>Secure Sign-In</span>
          </div>
        </div>

        {/* Content Area */}
        {syncStatus === "error" ? (
          <div className="py-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-white">
              Sync Issue Encountered
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed px-2">
              {errorMessage || "Unable to establish account synchronization. Please try again."}
            </p>

            <div className="pt-3 flex flex-col gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-2.5 text-xs font-semibold text-white transition-all shadow-xs cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Retry Connection</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  void performLogout(signOut);
                  window.location.replace("/login");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/60 py-2.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="relative mx-auto flex h-14 w-14 items-center justify-center">
              {syncStatus === "success" ? (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-900/60">
                  <Loader2 className="h-6 w-6 animate-spin text-blue-600 dark:text-blue-400" />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-white">
                {syncStatus === "success" ? "Authentication Confirmed" : "Signing you in"}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {syncStatus === "success"
                  ? "Setting up your student workspace..."
                  : "Connecting your account securely..."}
              </p>
            </div>

            {/* Subtle Escape Link if connection takes time */}
            {showFallback && syncStatus !== "success" && (
              <div className="pt-2 text-xs text-slate-400 dark:text-slate-500">
                Taking longer than usual?{" "}
                <Link
                  href="/dashboard"
                  className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2"
                >
                  Continue to Dashboard
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Card Footer */}
        <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center">
          <p className="text-[11px] text-slate-400 dark:text-slate-500">
            JKS Learning · Enterprise IT Training & Certification
          </p>
        </div>
      </div>

      {/* Professional Student Phone Onboarding Modal */}
      {showPhoneModal && (
        <GooglePhoneModal
          isOpen={showPhoneModal}
          userEmail={userEmail}
          userName={userName}
          accessToken={accessToken || undefined}
          onSuccess={handlePhoneSuccess}
        />
      )}
    </div>
  );
}
