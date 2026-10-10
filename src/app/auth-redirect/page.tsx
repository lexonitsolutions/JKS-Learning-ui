"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { performLogout, logoutMockSession } from "@/lib/auth/use-mock-auth";
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

  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [resolvedTargetUrl, setResolvedTargetUrl] = useState("/dashboard");
  const [showFallback, setShowFallback] = useState(false);

  const hasInitiatedSync = useRef(false);

  useEffect(() => {
    const fallbackTimer = setTimeout(() => setShowFallback(true), 800);
    return () => clearTimeout(fallbackTimer);
  }, []);

  /**
   * Store the signed-in identity for the rest of the app.
   *
   * The identity comes ONLY from the live Clerk user (and the API's answer for
   * it). It must never fall back to whatever an earlier visitor left in
   * localStorage or the session cookie: that is how a brand-new Google account
   * ended up inside someone else's (or a placeholder) student workspace.
   */
  const establishRealSession = useCallback((clerkUser: any, backendUser?: any) => {
    const email = (
      clerkUser?.primaryEmailAddress?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();
    if (!email) return null;

    const fullName =
      backendUser?.name ||
      clerkUser?.fullName ||
      [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
      clerkUser?.username ||
      email.split("@")[0] ||
      "Student";

    const initials =
      clerkUser?.firstName && clerkUser?.lastName
        ? `${clerkUser.firstName[0]}${clerkUser.lastName[0]}`.toUpperCase()
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

    document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(userSession)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;

    try {
      // Drop per-account leftovers from any previous user of this browser.
      localStorage.removeItem("jks_mock_session");
      localStorage.setItem(
        "jks_auth_user",
        JSON.stringify({
          email,
          name: userSession.name,
          role,
          status: userSession.status,
          avatar: backendUser?.avatarUrl || clerkUser?.imageUrl,
          phone: backendUser?.phone || null,
        })
      );
      if (backendUser?.avatarUrl || clerkUser?.imageUrl) {
        localStorage.setItem("jks_student_avatar_v2", backendUser?.avatarUrl || clerkUser.imageUrl);
      } else {
        localStorage.removeItem("jks_student_avatar_v2");
      }
    } catch {}

    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
    return { email, role, target: isAdmin ? "/admin" : isInstructor ? "/instructor" : "/dashboard" };
  }, []);

  /**
   * Sign-in finalisation. Runs once the Clerk user is known:
   *   1. exchange the Clerk session for the API's own session (awaited - the
   *      old code fired this and navigated away, which cancelled the request,
   *      so the API never recognised the new account),
   *   2. store that account's identity,
   *   3. go to the right workspace.
   */
  const executeSync = useCallback(async (clerkUser: any) => {
    if (hasInitiatedSync.current) return;
    hasInitiatedSync.current = true;
    setSyncStatus("syncing");
    setErrorMessage(null);

    // Show the right identity immediately; refined below with the API's answer.
    if (!establishRealSession(clerkUser)) {
      setErrorMessage("Your Google account did not return an email address.");
      setSyncStatus("error");
      return;
    }
    const email = (
      clerkUser?.primaryEmailAddress?.emailAddress ||
      clerkUser?.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();

    try {
      const token = await getToken();
      if (!token) throw new Error("No session token from Clerk.");

      const res = await fetch(apiUrl("/auth/clerk-sync"), {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: clerkUser.fullName || clerkUser.firstName || undefined,
          avatarUrl: clerkUser.imageUrl,
          clerkUserId: clerkUser.id,
        }),
        credentials: "include",
        signal: AbortSignal.timeout(15000),
      });

      if (res.status === 403) {
        await performLogout(signOut);
        window.location.replace("/login?blocked=1");
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          body?.message || `The server could not set up your account (${res.status}).`
        );
      }

      const data = await res.json().catch(() => ({}));
      const info = establishRealSession(clerkUser, data?.user) || { target: "/dashboard" };
      setResolvedTargetUrl(info.target);
      setSyncStatus("success");

      try {
        jksAnalytics.login("clerk_oauth");
      } catch {}

      if (data?.needsPhone) {
        setShowPhoneModal(true);
        return;
      }
      window.location.replace(info.target);
    } catch (err: any) {
      console.warn("[AuthRedirect] clerk-sync failed:", err);
      setErrorMessage(
        err?.message || "Unable to finish signing you in. Please try again."
      );
      setSyncStatus("error");
    }
  }, [getToken, signOut, establishRealSession]);

  useEffect(() => {
    // Wait for Clerk. Never guess an identity while it is still loading.
    if (!isLoaded) {
      const timer = setTimeout(() => {
        if (!hasInitiatedSync.current) {
          setErrorMessage("Sign-in is taking longer than expected. Please try again.");
          setSyncStatus("error");
        }
      }, 20000);
      return () => clearTimeout(timer);
    }

    if (!user) {
      // Not signed in with Clerk: clear any stale identity and start over.
      logoutMockSession();
      window.location.replace("/login");
      return;
    }

    void executeSync(user);
  }, [isLoaded, user, executeSync]);

  const handlePhoneSuccess = (_savedPhone: string) => {
    setShowPhoneModal(false);
    window.location.replace(resolvedTargetUrl);
  };

  const handleRetry = () => {
    hasInitiatedSync.current = false;
    if (user) void executeSync(user);
    else window.location.reload();
  };

  const handleContinueDirectly = () => {
    // Only ever continue as the account that is actually signed in.
    if (user && establishRealSession(user)) {
      window.location.replace(resolvedTargetUrl);
    } else {
      window.location.replace("/login");
    }
  };

  const userEmail =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress ||
    "";
  const userName = user?.fullName || user?.firstName || "Student";

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
