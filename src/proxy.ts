import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/auth/session";

const PROTECTED_STUDENT_PREFIX = "/dashboard";
const PROTECTED_INSTRUCTOR_PREFIX = "/instructor";
const PROTECTED_ADMIN_PREFIX = "/admin";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  try {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = decodeSession(sessionCookie);

    // Also check for Clerk session cookies if present
    const hasClerkSession = !!(
      request.cookies.get("__session")?.value ||
      request.cookies.get("__client_uat")?.value
    );

    const isAuthenticated = !!session || hasClerkSession;

    const isStudentRoute = pathname.startsWith(PROTECTED_STUDENT_PREFIX);
    const isInstructorRoute = pathname.startsWith(PROTECTED_INSTRUCTOR_PREFIX);
    const isAdminRoute = pathname.startsWith(PROTECTED_ADMIN_PREFIX);
    const isAuthPage = pathname === "/login" || pathname === "/register";

    const isProtected = isStudentRoute || isInstructorRoute || isAdminRoute;

    // 1. Unauthenticated users trying to access protected routes -> redirect to /login
    if (isProtected && !isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // 2. Role-based routing (only if we have an explicit session object with a role)
    if (session) {
      if (isAdminRoute && session.role !== "admin") {
        const dest = session.role === "instructor" ? "/instructor" : "/dashboard";
        return NextResponse.redirect(new URL(dest, request.url));
      }

      if (
        isInstructorRoute &&
        session.role !== "instructor" &&
        session.role !== "admin"
      ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      if (isStudentRoute && session.role === "admin") {
        return NextResponse.redirect(new URL("/admin", request.url));
      }

      if (isStudentRoute && session.role === "instructor") {
        return NextResponse.redirect(new URL("/instructor", request.url));
      }

      // Already authenticated users visiting /login or /register -> send to workspace
      if (isAuthPage) {
        let dest = "/dashboard";
        if (session.role === "admin") dest = "/admin";
        else if (session.role === "instructor") dest = "/instructor";
        return NextResponse.redirect(new URL(dest, request.url));
      }
    } else if (hasClerkSession && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
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
