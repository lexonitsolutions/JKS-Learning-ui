"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { HeadsManager } from "@/components/admin/heads-manager";

export default function AdminHeadsPage() {
  return (
    <>
      <DashboardTopbar title="Heads / HODs" subtitle="Create heads, assign the instructors they supervise, and see their batches." />
      <div className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8 lg:pt-4">
        <HeadsManager />
      </div>
    </>
  );
}
