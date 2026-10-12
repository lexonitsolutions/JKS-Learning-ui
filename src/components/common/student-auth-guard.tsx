"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";

/**
 * Client-side authentication guard for the Student Dashboard.
 * Ensures that if Clerk or mock session resolves to unauthenticated,
 * the user is immediately redirected to /login with a return URL,
 * preventing any flash of a fake/fallback "Student" profile.
 */
export function StudentAuthGuard() {
  const router = useRouter();
  const pathname = usePathname();
  const { isSignedIn, isLoaded: isClerkLoaded } = useUser();
  const session = useMockSession();

  useEffect(() => {
    // Only evaluate after Clerk has finished initializing
    if (!isClerkLoaded) return;

    const hasMockAuth = !!session;
    const hasClerkAuth = !!isSignedIn;

    if (!hasMockAuth && !hasClerkAuth) {
      // Also double-check localStorage for fast synchronous confirmation
      let localAuthUser = null;
      try {
        const raw = localStorage.getItem("jks_auth_user");
        if (raw) localAuthUser = JSON.parse(raw);
      } catch {}

      if (!localAuthUser) {
        const dest = `/login?from=${encodeURIComponent(pathname || "/dashboard")}`;
        if (typeof window !== "undefined") {
          window.location.replace(dest);
        } else {
          router.replace(dest);
        }
      }
    }
  }, [isClerkLoaded, isSignedIn, session, pathname, router]);

  return null;
}
