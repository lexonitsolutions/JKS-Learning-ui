import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/auth/session";

const PROTECTED_STUDENT_PREFIX = "/dashboard";
const PROTECTED_INSTRUCTOR_PREFIX = "/instructor";
const PROTECTED_ADMIN_PREFIX = "/admin";
const PROTECTED_HEAD_PREFIX = "/head";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = decodeSession(sessionCookie);

    if (session?.status === "BLOCKED") {
      const url = new URL("/login?blocked=1", request.url);
      const res = NextResponse.redirect(url);
      res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }

    // Also check for Clerk session cookies if present
    const sessionToken = request.cookies.get("__session")?.value;
    const clientUat = request.cookies.get("__client_uat")?.value;
    const hasClerkSession = !!sessionToken || (!!clientUat && clientUat !== "0");

    const isAuthenticated = !!session || hasClerkSession;

    const isStudentRoute = pathname.startsWith(PROTECTED_STUDENT_PREFIX);
    const isInstructorRoute = pathname.startsWith(PROTECTED_INSTRUCTOR_PREFIX);
    const isAdminRoute = pathname.startsWith(PROTECTED_ADMIN_PREFIX);
    const isHeadRoute = pathname.startsWith(PROTECTED_HEAD_PREFIX);
    const isAuthPage = pathname === "/login" || pathname === "/register" || pathname === "/sign-up";

    const isProtected = isStudentRoute || isInstructorRoute || isAdminRoute || isHeadRoute;

    // 1. Unauthenticated users trying to access protected routes -> redirect to /login
    if (isProtected && !isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // 2. Role-based routing (only if we have an explicit session object with a role)
    if (session) {
      const isSuperAdminEmail = session.email?.toLowerCase() === "lexonitservices@gmail.com";
      const isAdmin = session.role === "admin" || isSuperAdminEmail;

      const home =
        session.role === "instructor" ? "/instructor" : session.role === "head" ? "/head" : "/dashboard";

      if (isAdminRoute && !isAdmin) {
        return NextResponse.redirect(new URL(home, request.url));
      }

      if (
        isInstructorRoute &&
        session.role !== "instructor" &&
        !isAdmin
      ) {
        return NextResponse.redirect(new URL(home, request.url));
      }

      // The head workspace is for heads (admins may look in). This is only a
      // routing convenience: every head API is authorised on the server.
      if (isHeadRoute && session.role !== "head" && !isAdmin) {
        return NextResponse.redirect(new URL(home, request.url));
      }

      // Allow admins and instructors to preview course learning UI
      const isLearningPlayer = pathname.startsWith("/dashboard/my-courses");

      if (isStudentRoute && !isLearningPlayer && isAdmin) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (isStudentRoute && !isLearningPlayer && session.role === "instructor") {
        return NextResponse.redirect(new URL("/instructor", request.url));
      }

      if (isStudentRoute && !isLearningPlayer && session.role === "head") {
        return NextResponse.redirect(new URL("/head", request.url));
      }
    }

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-pathname", pathname);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch (err) {
    // Fail open safely so SSR pages never return 500
    console.error("[Proxy Middleware Error]", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|icon.png|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)).*)",
  ],
};
