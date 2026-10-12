import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/auth/session";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { AmbientPageBackground } from "@/components/ui/ambient-page-background";
import { StudentPhoneGuard } from "@/components/common/student-phone-guard";
import { StudentAuthGuard } from "@/components/common/student-auth-guard";

export const dynamic = "force-dynamic";

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  const session = decodeSession(sessionCookie);

  const sessionToken = cookieStore.get("__session")?.value;
  const clientUat = cookieStore.get("__client_uat")?.value;
  const hasClerkSession = !!sessionToken || (!!clientUat && clientUat !== "0");

  // 1. Unauthenticated users must log in before accessing the student dashboard
  if (!session && !hasClerkSession) {
    redirect("/login?from=/dashboard");
  }

  // 2. Blocked account redirection
  if (session?.status === "BLOCKED") {
    redirect("/login?blocked=1");
  }

  // 3. Role-based routing
  if (session?.role === "admin" || session?.email?.toLowerCase() === "lexonitservices@gmail.com") {
    redirect("/admin");
  }
  if (session?.role === "instructor") {
    redirect("/instructor");
  }

  return (
    <div className="relative flex min-h-screen text-slate-800 dark:text-slate-100 font-sans font-apple antialiased selection:bg-[#2563EB]/15 selection:text-[#2563EB]">
      <AmbientPageBackground />
      <StudentAuthGuard />
      <DashboardSidebar role="student" />
      <StudentPhoneGuard />
      <main className="relative flex flex-1 flex-col min-w-0">{children}</main>
    </div>
  );
}

