import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AmbientPageBackground } from "@/components/ui/ambient-page-background";

export const dynamic = "force-dynamic";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = decodeSession(sessionCookie);

  if (session?.role === "admin" || session?.email?.toLowerCase() === "lexonitservices@gmail.com") {
    redirect("/admin");
  }
  if (session?.role === "instructor") {
    redirect("/instructor");
  }

  return (
    <div className="relative flex min-h-screen text-slate-800 dark:text-slate-100 dark:bg-background transition-colors duration-200">
      <AmbientPageBackground />
      <DashboardSidebar />
      <div className="relative flex flex-1 flex-col min-w-0 overflow-x-hidden">{children}</div>
    </div>
  );
}

