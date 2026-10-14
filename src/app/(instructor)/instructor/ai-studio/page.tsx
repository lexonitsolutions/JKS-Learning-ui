"use client";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { AiStudio } from "@/components/admin/ai-studio";

export default function InstructorAiStudioPage() {
  return (
    <>
      <DashboardTopbar
        title="AI Studio"
        subtitle="Generate assessment questions and curriculum outlines for your courses."
      />
      <div className="flex-1 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <AiStudio isAdmin={false} />
      </div>
    </>
  );
}
