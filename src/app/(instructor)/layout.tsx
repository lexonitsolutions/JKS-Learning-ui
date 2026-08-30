import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AmbientPageBackground } from "@/components/ui/ambient-page-background";

export const dynamic = "force-dynamic";

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen text-slate-800 antialiased selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <AmbientPageBackground />
      <DashboardSidebar role="instructor" />
      <main className="relative flex flex-1 flex-col min-w-0">{children}</main>
    </div>
  );
}
