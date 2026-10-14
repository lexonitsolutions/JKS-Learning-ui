"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { PlaygroundShell } from "@/components/playground/playground-shell";

export default function AdminPlaygroundPage() {
  return (
    <>
      <DashboardTopbar
        title="Code Playground"
        subtitle="The same editor students use. Run code in the languages the platform can execute."
      />
      <div className="flex-1 p-2 sm:p-4 lg:p-6 lg:pt-3">
        <Suspense
          fallback={
            <div className="flex h-[60vh] items-center justify-center gap-2 text-sm text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading…
            </div>
          }
        >
          <PlaygroundShell />
        </Suspense>
      </div>
    </>
  );
}
