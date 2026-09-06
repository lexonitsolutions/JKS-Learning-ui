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

      // Check if user is an admin or instructor in existing mock registry
      const matchedMock = MOCK_USERS.find(
        (u) => u.email.toLowerCase() === email
      );

      const role: "student" | "instructor" | "admin" = matchedMock?.role || "student";

      const session: MockSession = {
        email,
        name: fullName,
        initials,
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
            name: fullName,
            role,
            avatar: user.imageUrl,
          })
        );
        if (user.imageUrl) {
          localStorage.setItem("jks_student_avatar_v2", user.imageUrl);
        }
      } catch {}

      // Exchange the Clerk session for this API's own auth cookies, and create
      // the local user row on first sign-in.
      //
      // This used to POST /auth/register with a synthesised password. That
      // endpoint 409s when the email already exists, so it worked exactly once
      // per account and threw a Conflict on every later Google login -- the
      // errors visible in the network tab. /auth/clerk-sync is idempotent.
      //
      // Only the Clerk token is sent: the backend resolves the email from it
      // server-side, so nothing here can claim to be another user.
      void (async () => {
        try {
          const token = await getToken();
          if (!token) return;

          const res = await fetch(apiUrl("/auth/clerk-sync"), {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
          });

          if (!res.ok) {
            // Allow a retry on the next mount rather than leaving the user
            // with a Clerk session but no API cookies.
            lastSyncedEmail.current = null;
            console.warn("[ClerkSessionSync] /auth/clerk-sync failed:", res.status);
          }
        } catch (err) {
          lastSyncedEmail.current = null;
          console.warn("[ClerkSessionSync] /auth/clerk-sync error:", err);
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
