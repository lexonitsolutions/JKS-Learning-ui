import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AmbientPageBackground } from "@/components/ui/ambient-page-background";

// See (admin)/layout.tsx — same reasoning: proxy.ts is the only place that
// reads the mock session cookie, so without this Next statically optimizes
// /dashboard/* and the client Router Cache can serve a payload fetched
// under a stale auth state.
export const dynamic = "force-dynamic";

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen text-slate-800">
      <AmbientPageBackground />
      <DashboardSidebar />
      <div className="relative flex flex-1 flex-col min-w-0">{children}</div>
    </div>
  );
}
