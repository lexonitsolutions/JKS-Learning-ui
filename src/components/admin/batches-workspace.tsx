"use client";

import { useState } from "react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { BatchesManagerView } from "./batches-manager-view";
import { ManagedBatches } from "./managed-batches";

type Tab = "managed" | "overview";

/**
 * "Batches": the managed batches (create, assign a head, instructors and students)
 * next to the original course-by-course overview, which keeps working unchanged.
 */
export function BatchesWorkspace({ role }: { role: "admin" | "instructor" }) {
  const [tab, setTab] = useState<Tab>("managed");

  const tabs = (
    <div role="tablist" aria-label="Batch views" className="flex items-center gap-1 self-start rounded-xl border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-800 dark:bg-surface-elevated">
      {(
        [
          ["managed", "Managed batches"],
          ["overview", "Course overview"],
        ] as const
      ).map(([id, label]) => (
        <button
          key={id}
          type="button"
          role="tab"
          aria-selected={tab === id}
          onClick={() => setTab(id)}
          className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
            tab === id ? "bg-[#2563EB] text-white shadow-xs" : "text-slate-600 hover:text-slate-900 dark:text-slate-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );

  if (tab === "overview") return <BatchesManagerView role={role} headerSlot={tabs} />;

  return (
    <>
      <DashboardTopbar title="Batches" subtitle="" userInitials={role === "admin" ? "AD" : "IN"} />
      <div className="mx-auto w-full max-w-7xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
        {tabs}
        <ManagedBatches role={role} />
      </div>
    </>
  );
}
