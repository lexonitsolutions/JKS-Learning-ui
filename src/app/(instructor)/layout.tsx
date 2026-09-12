"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AmbientPageBackground } from "@/components/ui/ambient-page-background";
import { useMockSession, isEmailApprovedInstructor, logoutMockSession } from "@/lib/auth/use-mock-auth";
import { ShieldAlert, LogOut } from "lucide-react";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  const session = useMockSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    // If no session found yet, wait briefly for cookie hydration
    if (!session) {
      const timeout = setTimeout(() => {
        if (!session) {
          router.replace("/login?from=/instructor");
        }
      }, 250);
      return () => clearTimeout(timeout);
    }

    // Admins always have access to supervise instructor space
    if (session.role === "admin") {
      setIsAuthorized(true);
      return;
    }

    // Instructors must be in the approved list onboarded by Admin
    if (session.role === "instructor") {
      const authorized = isEmailApprovedInstructor(session.email);
      setIsAuthorized(authorized);
      return;
    }

    // Any other role (e.g. students) is unauthorized
    setIsAuthorized(false);
  }, [session, router]);

  const handleLogout = () => {
    logoutMockSession();
    router.replace("/login");
  };

  if (isAuthorized === false) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 text-slate-800 dark:text-slate-100 antialiased">
        <AmbientPageBackground />
        <div className="relative z-10 max-w-md w-full rounded-[24px] border border-rose-200 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-rose-900/50 dark:bg-surface-secondary">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400 mb-5 shadow-xs">
            <ShieldAlert className="h-8 w-8 stroke-[2]" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">
            Access Restricted
          </h2>
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Only lecturers registered and approved by the Administrator (<strong>lexonitservices@gmail.com</strong>) are authorized to access the Lecturer workspace.
          </p>
          {session?.email && (
            <div className="mt-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 p-2.5 text-xs text-slate-600 dark:text-slate-300 font-medium">
              Signed in as: <span className="font-semibold text-slate-900 dark:text-white">{session.email}</span>
            </div>
          )}
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out & Return to Login</span>
            </button>
            <button
              type="button"
              onClick={() => router.replace("/login")}
              className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              Go to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen text-slate-800 dark:text-slate-100 antialiased selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <AmbientPageBackground />
      <DashboardSidebar role="instructor" />
      <main className="relative flex flex-1 flex-col min-w-0">{children}</main>
    </div>
  );
}
