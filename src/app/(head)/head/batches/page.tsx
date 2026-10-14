"use client";

import { ManagedBatches } from "@/components/admin/managed-batches";

export default function HeadBatchesPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Batches</h1>
      </header>
      <ManagedBatches role="head" />
    </div>
  );
}
