"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useMockSession, performLogout, logoutMockSession } from "@/lib/auth/use-mock-auth";
import { SESSION_COOKIE_NAME, encodeSession, type MockSession } from "@/lib/auth/session";
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

const SESSION_CHANGE_EVENT = "jks-mock-session-change";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

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
    const fallbackTimer = setTimeout(() => setShowFallback(true), 5000);
    return () => clearTimeout(fallbackTimer);
  }, []);

  // Helper to establish real session in cookie and localStorage immediately
  const establishRealSession = useCallback((backendUser?: any) => {
    if (!user) return;

    const email = (
      user.primaryEmailAddress?.emailAddress ||
      user.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();

    if (!email) return;

    const fullName =
      backendUser?.name ||
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      email.split("@")[0] ||
      "Student";

    const initials =
      user.firstName && user.lastName
        ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
        : fullName.slice(0, 2).toUpperCase();

    const isSuperAdmin = email === "lexonitservices@gmail.com";
    const isAdmin =
      isSuperAdmin ||
      backendUser?.role === "SUPER_ADMIN" ||
      backendUser?.role === "ADMIN";
    const isInstructor = backendUser?.role === "INSTRUCTOR";
    const role: "student" | "instructor" | "admin" = isAdmin
      ? "admin"
      : isInstructor
      ? "instructor"
      : "student";

    const userSession: MockSession = {
      email,
      name: isSuperAdmin ? "Lexon Administrator" : fullName,
      initials: isSuperAdmin ? "LX" : initials,
      role,
      phone: backendUser?.phone || undefined,
      status: backendUser?.status || "ACTIVE",
    };

    // Write real session cookie so dashboard never loads a fake mock student profile
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(userSession)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;

    try {
      localStorage.setItem(
        "jks_auth_user",
        JSON.stringify({
          email,
          name: userSession.name,
          role,
          status: userSession.status,
          avatar: backendUser?.avatarUrl || user.imageUrl,
          phone: backendUser?.phone || null,
        })
      );
      if (user.imageUrl) {
        localStorage.setItem("jks_student_avatar_v2", user.imageUrl);
      }
    } catch {}

    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
    return { email, fullName, role, target: isAdmin ? "/admin" : isInstructor ? "/instructor" : "/dashboard" };
  }, [user]);

  const executeSync = useCallback(() => {
    if (!user) return;

    // 1. Immediately establish real session from Google user synchronously
    const sessionInfo = establishRealSession();
    const target = sessionInfo?.target || "/dashboard";
    setResolvedTargetUrl(target);
    setSyncStatus("success");

    // Track analytics
    try {
      jksAnalytics.login("clerk_oauth");
    } catch {}

    const email = (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""
    )
      .toLowerCase()
      .trim();

    const fullName =
      user.fullName ||
      [user.firstName, user.lastName].filter(Boolean).join(" ") ||
      user.username ||
      email.split("@")[0] ||
      "Student";

    // 2. Fire backend clerk-sync in the background without blocking page redirect
    void (async () => {
      try {
        const token = await getToken().catch(() => null);
        if (token && email) {
          const res = await fetch(apiUrl("/auth/clerk-sync"), {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
              "x-user-email": email,
            },
            body: JSON.stringify({
              email,
              name: fullName,
              avatarUrl: user.imageUrl,
              clerkUserId: user.id,
            }),
            credentials: "include",
            signal: AbortSignal.timeout(4000),
          });

          if (res.status === 403) {
            await performLogout(signOut);
            window.location.replace("/login?blocked=1");
            return;
          }

          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            if (data?.accessToken && typeof window !== "undefined") {
              try {
                localStorage.setItem("jks_access_token", data.accessToken);
              } catch {}
            }
          }
        }
      } catch (err) {
        console.warn("[AuthRedirect] background clerk-sync:", err);
      }
    })();

    // 3. Immediately redirect to student dashboard (or admin if staff)
    window.location.replace(target);
  }, [user, getToken, signOut, establishRealSession]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      // If loaded but no user found, fallback after brief grace period
      const timer = setTimeout(() => {
        window.location.replace("/login");
      }, 1500);
      return () => clearTimeout(timer);
    }
    if (hasInitiatedSync.current) return;
    hasInitiatedSync.current = true;
    executeSync();
  }, [isLoaded, user, executeSync]);

  const handlePhoneSuccess = (_savedPhone: string) => {
    setShowPhoneModal(false);
    window.location.replace(resolvedTargetUrl);
  };

  const handleRetry = () => {
    hasInitiatedSync.current = false;
    void executeSync();
  };

  const handleContinueDirectly = () => {
    // Ensure real user session is stored before navigating
    establishRealSession();
    window.location.replace(resolvedTargetUrl);
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
                onClick={handleContinueDirectly}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 dark:border-blue-800/60 bg-blue-50/50 dark:bg-blue-950/30 py-2.5 text-xs font-semibold text-blue-700 dark:text-blue-300 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 transition-all cursor-pointer"
              >
                <span>Continue to Dashboard</span>
                <ArrowRight className="h-3.5 w-3.5" />
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

            {/* Escape link if connection takes time — safely sets real session before redirect */}
            {showFallback && syncStatus !== "success" && (
              <div className="pt-2 text-xs text-slate-400 dark:text-slate-500">
                Taking longer than usual?{" "}
                <button
                  type="button"
                  onClick={handleContinueDirectly}
                  className="font-semibold text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                >
                  Continue to Dashboard
                </button>
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
