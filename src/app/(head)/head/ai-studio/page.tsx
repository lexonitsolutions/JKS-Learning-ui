"use client";

import { AiStudio } from "@/components/admin/ai-studio";

export default function HeadAiStudioPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 space-y-4 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">AI Studio</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          Generate assessment questions, save them as templates, then assign them from Assessments.
        </p>
      </header>
      <AiStudio isAdmin={false} workspace="head" />
    </div>
  );
}
