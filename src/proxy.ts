import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { SESSION_COOKIE_NAME, decodeSession } from "@/lib/auth/session";

// Next.js 16 renamed `middleware.ts` to `proxy.ts`; same API, runs on every
// matched request before the route renders.
//
// This file has two jobs, in order:
//   1. `clerkMiddleware()` — REQUIRED by @clerk/nextjs. It performs the
//      handshake that turns the `__clerk_db_jwt` / `__clerk_handshake` params
//      Clerk's OAuth redirect comes back with into a real session cookie.
//      Without it the OAuth round-trip can never complete, `auth()` throws on
//      the server, and clerk-js falls back to broken client-only states.
//   2. The role-based routing for the mock/demo session cookie that the rest
//      of the app still uses (student / instructor / admin workspaces).
const isAdminRoute = createRouteMatcher(["/admin(.*)"]);
const isInstructorRoute = createRouteMatcher(["/instructor(.*)"]);
const isStudentRoute = createRouteMatcher(["/dashboard(.*)"]);
const isAuthPage = createRouteMatcher(["/login", "/register"]);
const publishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZWFzeS1jb3VnYXItMzY0MC5jbGVyay5hY2NvdW50cy5kZXYk";

const secretKey =
  process.env.CLERK_SECRET_KEY ||
  "sk_test_AnhmAMsfNmYebHqQx0CfqqA6IpmpjC39Nuevq0efiy";

export default clerkMiddleware(
  async (auth, request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const session = decodeSession(request.cookies.get(SESSION_COOKIE_NAME)?.value);

    // Clerk's own view of the session — authoritative for OAuth sign-ins, which
    // land here before ClerkSessionSync has had a chance to write the mock cookie.
    let userId: string | null = null;
    try {
      const authObj = await auth();
      userId = authObj.userId;
    } catch {
      // Fallback gracefully if auth handshake evaluation fails
      userId = null;
    }
    const isAuthenticated = !!session || !!userId;

    const protectedRoute =
      isAdminRoute(request) || isInstructorRoute(request) || isStudentRoute(request);

    if (protectedRoute && !isAuthenticated) {
      const url = new URL("/login", request.url);
      url.searchParams.set("from", pathname);
      return NextResponse.redirect(url);
    }

    // Role gating only applies once we have a decoded mock session with a role.
    // A Clerk-only session (fresh OAuth sign-in) is treated as a student and is
    // allowed through to /dashboard.
    if (isAdminRoute(request) && session && session.role !== "admin") {
      const target = session.role === "instructor" ? "/instructor" : "/dashboard";
      return NextResponse.redirect(new URL(target, request.url));
    }

    if (
      isInstructorRoute(request) &&
      session &&
      session.role !== "instructor" &&
      session.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (isStudentRoute(request) && session?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    if (isStudentRoute(request) && session?.role === "instructor") {
      return NextResponse.redirect(new URL("/instructor", request.url));
    }

    // Already signed in and visiting /login or /register — send them to their
    // workspace instead of showing the form again.
    if (isAuthPage(request) && isAuthenticated) {
      let dest = "/dashboard";
      if (session?.role === "admin") dest = "/admin";
      else if (session?.role === "instructor") dest = "/instructor";
      return NextResponse.redirect(new URL(dest, request.url));
    }

    return NextResponse.next();
  },
  {
    publishableKey,
    secretKey,
    signInUrl: "/login",
    signUpUrl: "/register",
  }
);

export const config = {
  // Clerk's recommended matcher: everything except Next internals and static
  // files, plus API routes. `/sso-callback` MUST be matched — that is where the
  // OAuth handshake lands.
  matcher: [
    "/((?!_next|[^?]*\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
