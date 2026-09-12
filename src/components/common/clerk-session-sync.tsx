"use client";

import { useEffect, useRef } from "react";
import { useAuth, useUser } from "@clerk/nextjs";
import { SESSION_COOKIE_NAME, encodeSession, type MockSession } from "@/lib/auth/session";
import { MOCK_USERS } from "@/lib/auth/mock-users";
import { apiUrl } from "@/lib/api/base-url";

const SESSION_CHANGE_EVENT = "jks-mock-session-change";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function ClerkSessionSync() {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const lastSyncedEmail = useRef<string | null>(null);

  useEffect(() => {
    if (!isLoaded) return;

    if (user) {
      const email = (
        user.primaryEmailAddress?.emailAddress ||
        user.emailAddresses?.[0]?.emailAddress ||
        ""
      ).toLowerCase().trim();

      if (!email) return;

      if (lastSyncedEmail.current === email) return;
      lastSyncedEmail.current = email;

      const fullName =
        user.fullName ||
        [user.firstName, user.lastName].filter(Boolean).join(" ") ||
        user.username ||
        email.split("@")[0] ||
        "Student";

      const initials =
        user.firstName && user.lastName
          ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
          : fullName.slice(0, 2).toUpperCase();

      // Check if user is the Super Admin or exists in mock registry
      const isSuperAdminEmail = email === "lexonitservices@gmail.com";
      const matchedMock = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email
      );

      const role: "student" | "instructor" | "admin" = isSuperAdminEmail
        ? "admin"
        : matchedMock?.role || "student";

      const session: MockSession = {
        email,
        name: isSuperAdminEmail ? "Lexon Administrator" : fullName,
        initials: isSuperAdminEmail ? "LX" : initials,
        role,
      };

      // Set session cookie
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;

      // Store in localStorage for fast synchronous read
      try {
        localStorage.setItem(
          "jks_auth_user",
          JSON.stringify({
            email,
            name: session.name,
            role,
            avatar: user.imageUrl,
          })
        );
        if (user.imageUrl) {
          localStorage.setItem("jks_student_avatar_v2", user.imageUrl);
        }
      } catch {}

      // Exchange the Clerk session for this API's own auth cookies, and create
      // the local user row on first sign-in (non-blocking).
      void (async () => {
        try {
          const token = await getToken();
          if (!token) return;

          const res = await fetch(apiUrl("/auth/clerk-sync"), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
            signal: AbortSignal.timeout(3000),
          });

          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            const backendUser = data?.user;
            if (
              backendUser &&
              (backendUser.role === "SUPER_ADMIN" || backendUser.role === "ADMIN")
            ) {
              const adminSession: MockSession = {
                ...session,
                name: backendUser.name || session.name,
                role: "admin",
              };
              document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(adminSession)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
              try {
                localStorage.setItem(
                  "jks_auth_user",
                  JSON.stringify({
                    email,
                    name: adminSession.name,
                    role: "admin",
                    avatar: user.imageUrl,
                  })
                );
              } catch {}
              window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
            }
          }
        } catch {
          // Backend is offline or booting; frontend continues seamlessly with client-synced session
        }
      })();

      // Dispatch event to notify all components
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
    } else {
      // If user was synced previously with Clerk and is now logged out from Clerk
      if (lastSyncedEmail.current) {
        lastSyncedEmail.current = null;
        document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
        try {
          localStorage.removeItem("jks_auth_user");
        } catch {}
        window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
      }
    }
  }, [user, isLoaded, getToken]);

  // No DOM output. This component used to render a second
  // <div id="clerk-captcha" className="hidden"> here; because it lives in the
  // root layout it collided with the real #clerk-captcha on the sign-in page.
  // Duplicate ids meant Clerk mounted its bot-protection widget into the hidden
  // one, silently breaking sign-up/sign-in challenges.
  return null;
}
