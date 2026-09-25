"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useUser, useClerk, useAuth } from "@clerk/nextjs";
import { useMockSession, performLogout } from "@/lib/auth/use-mock-auth";
import { JksLogo } from "@/components/common/jks-logo";
import { GooglePhoneModal } from "@/components/common/google-phone-modal";
import { apiUrl } from "@/lib/api/base-url";
import {
  ShieldCheck,
  CheckCircle2,
  Terminal,
  ArrowRight,
  AlertTriangle,
  RefreshCw,
  LogOut,
} from "lucide-react";
import Link from "next/link";

export default function AuthRedirectPage() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { signOut } = useClerk();
  const session = useMockSession();

  const [stepIndex, setStepIndex] = useState(0);
  const [syncStatus, setSyncStatus] = useState<"idle" | "syncing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [resolvedTargetUrl, setResolvedTargetUrl] = useState("/dashboard");
  const [showFallback, setShowFallback] = useState(false);

  const hasInitiatedSync = useRef(false);

  // Progressive steps animation
  useEffect(() => {
    const s1 = setTimeout(() => setStepIndex(1), 500);
    const s2 = setTimeout(() => setStepIndex(2), 1200);
    const fallbackTimer = setTimeout(() => setShowFallback(true), 6000);

    return () => {
      clearTimeout(s1);
      clearTimeout(s2);
      clearTimeout(fallbackTimer);
    };
  }, []);

  const executeSync = useCallback(async () => {
    if (!user) return;

    setSyncStatus("syncing");
    setErrorMessage(null);

    const email = (
      user?.primaryEmailAddress?.emailAddress ||
      user?.emailAddresses?.[0]?.emailAddress ||
      ""
    ).toLowerCase().trim();

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
        // CRITICAL: Do NOT treat database/network errors as a new user.
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

      // Check if user is completely new and does not exist in the database
      if (isNewUser) {
        // Show phone-number input popup ONLY for new users
        setShowPhoneModal(true);
      } else {
        // Existing user: smoothly redirect to dashboard without popup
        setTimeout(() => {
          window.location.replace(target);
        }, 900);
      }
    } catch (err: any) {
      console.error("[AuthRedirect] clerk-sync failed:", err);
      // Under NO circumstances treat a network or DB error as a new user
      setSyncStatus("error");
      setErrorMessage(
        err?.message?.includes("timed out")
          ? "Database connection timed out. Please check your internet connection."
          : "Database or network error encountered while synchronizing account."
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
    // Continue to normal dashboard
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
  const isSuperAdmin = userEmail.toLowerCase() === "lexonitservices@gmail.com";
  const userRole = isSuperAdmin ? "admin" : session?.role || "student";

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
          <div className="flex items-center gap-2">
            <JksLogo
              size="md"
              variant="dark"
              href=""
              imgClassName="h-8 w-auto filter drop-shadow-[0_2px_8px_rgba(37,99,235,0.4)]"
            />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-950/50 px-2.5 py-1 font-mono text-[10px] font-semibold text-emerald-400 backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <span>TLS 1.3 SECURE</span>
          </div>
        </div>

        {/* Center Scanner / Orbital Loader OR Error State */}
        {syncStatus === "error" ? (
          <div className="my-8 flex flex-col items-center justify-center text-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 shadow-lg shadow-rose-500/20">
              <AlertTriangle className="h-8 w-8 text-rose-400" />
            </div>
            <h1 className="mt-4 text-xl font-black tracking-tight text-white">
              Database Sync Failed
            </h1>
            <p className="mt-2 text-xs font-medium text-slate-400 px-2 leading-relaxed">
              {errorMessage || "Unable to connect to the database. Existing user validation could not be completed."}
            </p>

            <div className="mt-6 flex w-full flex-col gap-2">
              <button
                type="button"
                onClick={handleRetry}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-bold text-white transition-all hover:bg-blue-700 cursor-pointer shadow-md shadow-blue-500/20"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Retry Connection</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  void performLogout(signOut);
                  window.location.replace("/login");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 text-xs font-semibold text-slate-300 transition-all hover:bg-slate-700 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
                <span>Return to Sign In</span>
              </button>
            </div>
          </div>
        ) : (
          <>
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
                {syncStatus === "success" ? "Access Granted" : "Verifying Profile"}
              </h1>
              <p className="mt-1 text-center text-xs font-medium text-slate-400">
                {syncStatus === "success"
                  ? "Identity verified against MongoDB Atlas..."
                  : "Checking database credentials & security policies..."}
              </p>
            </div>

            {/* Real-time Verification Checklist */}
            <div className="space-y-2.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 p-4 font-mono text-xs">
              {/* Step 1 */}
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span className="font-medium text-slate-200">Google OAuth Identity</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-semibold uppercase">Verified</span>
              </div>

              {/* Step 2 */}
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  {syncStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-400 animate-ping" />
                    </div>
                  )}
                  <span className="font-medium text-slate-200">Database Account Check</span>
                </div>
                <span className="text-[10px] text-blue-400 font-semibold uppercase">
                  {syncStatus === "success" ? "Synchronized" : "Checking"}
                </span>
              </div>

              {/* Step 3 */}
              <div className="flex items-center justify-between text-slate-300">
                <div className="flex items-center gap-2">
                  {stepIndex >= 2 && syncStatus === "success" ? (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-slate-700 flex items-center justify-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
                    </div>
                  )}
                  <span className="font-medium text-slate-200">Routing Environment</span>
                </div>
                <span className="text-[10px] text-cyan-400 font-semibold uppercase">
                  {syncStatus === "success" ? "Ready" : "Preparing"}
                </span>
              </div>
            </div>

            {/* Animated Progress Bar */}
            <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-indigo-500 transition-all duration-700 ease-out shadow-[0_0_10px_rgba(34,211,238,0.5)]"
                style={{
                  width:
                    syncStatus === "success"
                      ? "100%"
                      : stepIndex === 0
                        ? "35%"
                        : "75%",
                }}
              />
            </div>

            {/* Terminal Log Snippet */}
            <div className="mt-4 flex items-center justify-between px-1 text-[11px] font-mono text-slate-500">
              <span className="inline-flex items-center gap-1">
                <Terminal className="h-3 w-3 text-slate-400" />
                <span>sys.auth.google()</span>
              </span>
              <span className="text-slate-400">
                status: <span className="text-emerald-400 font-bold">200 OK</span>
              </span>
            </div>

            {/* Fallback Escape Hatch if taking longer */}
            {showFallback && syncStatus === "success" && !showPhoneModal && (
              <div className="mt-6 border-t border-slate-800/80 pt-4 text-center">
                <p className="text-xs text-slate-400">Taking longer than usual?</p>
                <div className="mt-2.5 flex justify-center gap-3">
                  <Link
                    href={resolvedTargetUrl}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-700 hover:to-indigo-700 cursor-pointer"
                  >
                    <span>Enter Dashboard</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Google User Phone Modal */}
      <GooglePhoneModal
        isOpen={showPhoneModal}
        userEmail={userEmail}
        userName={userName}
        accessToken={accessToken || undefined}
        onSuccess={handlePhoneSuccess}
      />
    </div>
  );
}
