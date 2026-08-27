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
  const isStudentRoute = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if ((isAdminRoute || isStudentRoute) && !session) {
    const url = new URL("/login", request.url);
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  if (isAdminRoute && session && session.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isStudentRoute && session && session.role === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(
      new URL(session.role === "admin" ? "/admin" : "/dashboard", request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/register"],
};
