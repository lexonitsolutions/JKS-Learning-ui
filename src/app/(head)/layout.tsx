"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, LogOut } from "lucide-react";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AmbientPageBackground } from "@/components/ui/ambient-page-background";
import { fetchSessionUser, logoutMockSession, useMockSession } from "@/lib/auth/use-mock-auth";

export default function HeadLayout({ children }: { children: React.ReactNode }) {
  const session = useMockSession();
  const router = useRouter();
  const [authorized, setAuthorized] = useState<boolean | null>(null);

  // Authorised from the server (/auth/me reads the role off the account behind the
  // httpOnly session), never from the readable session cookie.
  useEffect(() => {
    let cancelled = false;
    const t = setTimeout(
      () => {
        void fetchSessionUser().then((me) => {
          if (cancelled) return;
          if (!me) {
            router.replace("/login?from=/head");
            return;
          }
          // Admins may look in on the head workspace.
          setAuthorized(me.role === "head" || me.role === "admin");
        });
      },
      session ? 0 : 250,
    );
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [session, router]);

  if (authorized === false) {
    return (
      <div className="relative flex min-h-screen items-center justify-center p-4 text-slate-800 antialiased dark:text-slate-100">
        <AmbientPageBackground />
        <div className="relative z-10 w-full max-w-md rounded-[24px] border border-rose-200 bg-white/95 p-8 text-center shadow-2xl backdrop-blur-xl dark:border-rose-900/50 dark:bg-surface-secondary">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Access restricted</h2>
          <p className="mt-2 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            This workspace is for heads of department appointed by an administrator.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <button
              type="button"
              onClick={() => {
                logoutMockSession();
                router.replace("/login");
              }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-bold text-white hover:bg-blue-700"
            >
              <LogOut className="h-4 w-4" /> Sign out and return to login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen font-sans font-apple text-slate-800 antialiased selection:bg-[#2563EB]/15 selection:text-[#2563EB] dark:text-slate-100">
      <AmbientPageBackground />
      <DashboardSidebar role="head" />
      <main className="relative flex min-w-0 flex-1 flex-col">{authorized === null ? null : children}</main>
    </div>
  );
}
