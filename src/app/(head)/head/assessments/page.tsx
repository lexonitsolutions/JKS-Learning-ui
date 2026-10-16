"use client";

import { useState } from "react";
import { AiAssessmentTemplates } from "@/components/admin/ai-assessment-templates";

export default function HeadAssessmentsPage() {
  const [toast, setToast] = useState<string | null>(null);
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">Assessments</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Create assessments with AI Studio and assign them to students in the batches you oversee.
        </p>
      </header>
      {toast && (
        <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/20 dark:text-emerald-300">
          {toast}
        </div>
      )}
      <AiAssessmentTemplates aiStudioHref="/head/ai-studio" onToast={(m) => setToast(m)} />
    </div>
  );
}
