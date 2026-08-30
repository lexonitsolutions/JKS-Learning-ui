import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/auth/session";

// Route protection for the mock auth flow (frontend-only demo — no real
// backend session). Next.js 16 renamed `middleware.ts` to `proxy.ts`; same
// API, runs on every matched request before the route renders.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = decodeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

  const isAdminRoute = pathname.startsWith("/admin");
  const isInstructorRoute = pathname.startsWith("/instructor");
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if ((isAdminRoute || isInstructorRoute || isStudentRoute) && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  // Admin route protection: only admin (and super admin) allowed
  if (isAdminRoute && session && session.role !== "admin") {
    const target = session.role === "instructor" ? "/instructor" : "/dashboard";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // Instructor route protection: only instructor and admin allowed
  if (isInstructorRoute && session && session.role !== "instructor" && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Student dashboard route protection
  if (isStudentRoute && session && session.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (isStudentRoute && session && session.role === "instructor") {
    return NextResponse.redirect(new URL("/instructor", request.url));
  }

  // If already authenticated and visiting /login or /register, redirect to their home workspace
  if (isAuthPage && session) {
    let dest = "/dashboard";
    if (session.role === "admin") dest = "/admin";
    else if (session.role === "instructor") dest = "/instructor";
    return NextResponse.redirect(new URL(dest, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/instructor/:path*", "/login", "/register"],
};

