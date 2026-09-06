"use client";

import { useSyncExternalStore } from "react";
import { MOCK_USERS, type MockRole } from "./mock-users";
import { SESSION_COOKIE_NAME, encodeSession, decodeSession, type MockSession } from "./session";
import { apiFetch } from "@/lib/api/base-url";


const SESSION_CHANGE_EVENT = "jks-mock-session-change";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

function readCookie(name: string): string | undefined {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match?.[1];
}

function subscribe(callback: () => void) {
  window.addEventListener(SESSION_CHANGE_EVENT, callback);
  return () => window.removeEventListener(SESSION_CHANGE_EVENT, callback);
}

// useSyncExternalStore requires getSnapshot to return a referentially
// stable value when nothing has changed (it compares with Object.is).
// decodeSession() runs JSON.parse, which allocates a new object every call
// — returning that directly caused "getSnapshot should be cached" to fire
// on every render, since React always saw a "new" value. Cache the decoded
// session and only re-decode when the raw cookie string actually changes.
let cachedRaw: string | undefined;
let cachedSnapshot: MockSession | null = null;

function getSnapshot(): MockSession | null {
  const raw = readCookie(SESSION_COOKIE_NAME);
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedSnapshot = decodeSession(raw);
  }
  return cachedSnapshot;
}

function getServerSnapshot(): MockSession | null {
  return null;
}

// Reactive read of the current mock session — updates in the same tab the
// moment login()/logout() run (cookies don't fire a same-tab `storage`
// event the way localStorage does, so we dispatch a custom event instead).
export function useMockSession(): MockSession | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export type LoginResult = { ok: true; session: MockSession } | { ok: false; error: string };

const INSTRUCTORS_STORAGE_KEY = "jks_admin_instructors_v1";

function getApprovedInstructors(): Array<{ name: string; email: string; initials: string; role: string }> {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(INSTRUCTORS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return [
    { name: "Dr. Rohit Kapoor", email: "instructor@jkslearning.dev", initials: "RK", role: "Lead Trainer, Java Full Stack" },
    { name: "Rohit Kapoor", email: "rohit.kapoor@jkslearning.com", initials: "RK", role: "Lead Trainer, Java Full Stack" },
    { name: "Meera Subramaniam", email: "meera.subramaniam@jkslearning.com", initials: "MS", role: "Lead Trainer, SAP" },
    { name: "Dev Patil", email: "dev.patil@jkslearning.com", initials: "DP", role: "Lead Trainer, Frontend" },
    { name: "Aisha Farooqui", email: "aisha.farooqui@jkslearning.com", initials: "AF", role: "AI Interview Design Lead" },
  ];
}

export function loginWithMockCredentials(email: string, password: string): LoginResult {
  const normalizedEmail = email.trim().toLowerCase();

  // First check static MOCK_USERS
  const staticUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (staticUser) {
    // If it's an instructor account, double-check that they are in the approved instructors list
    if (staticUser.role === "instructor") {
      const approved = getApprovedInstructors();
      const isApproved = approved.some(
        (inst) => inst.email?.toLowerCase() === normalizedEmail || staticUser.email === "instructor@jkslearning.dev"
      );
      if (!isApproved) {
        return {
          ok: false,
          error: "Access Denied: You have not been registered as an instructor by an Administrator.",
        };
      }
    }

    const session: MockSession = {
      email: staticUser.email,
      name: staticUser.name,
      initials: staticUser.initials,
      role: staticUser.role,
    };
    document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
    return { ok: true, session };
  }

  // Check dynamically admin-added instructors in localStorage
  const dynamicInstructors = getApprovedInstructors();
  const matchedInstructor = dynamicInstructors.find(
    (inst) => inst.email?.toLowerCase() === normalizedEmail
  );

  if (matchedInstructor) {
    // Dynamic instructors accept default password 'instructor123' or 'admin123' or their password
    if (password === "instructor123" || password === "admin123" || password.length >= 6) {
      const session: MockSession = {
        email: matchedInstructor.email,
        name: matchedInstructor.name,
        initials: matchedInstructor.initials || "IN",
        role: "instructor",
      };
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
      return { ok: true, session };
    }
  }

  return { ok: false, error: "Invalid email or password." };
}

export async function loginWithApi(email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const res = await apiFetch("/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const u = data.user;
      let role: MockRole = "student";
      if (u.role === "SUPER_ADMIN" || u.role === "ADMIN") {
        role = "admin";
      } else if (u.role === "INSTRUCTOR") {
        role = "instructor";
      }

      const session: MockSession = {
        email: u.email,
        name: u.name,
        initials: u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) || "JK",
        role,
      };
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
      try {
        localStorage.setItem("jks_auth_user", JSON.stringify({ email: u.email, name: u.name, role }));
      } catch {}
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
      return { ok: true, session };
    }

    // If backend returned error, check demo accounts first (for offline/demo support)
    const mockRes = loginWithMockCredentials(email, password);
    if (mockRes.ok) return mockRes;

    const errData = await res.json().catch(() => ({}));
    const msg = errData?.message || (res.status === 401 ? "Invalid email or password." : "Login failed. Please check your credentials.");
    return { ok: false, error: Array.isArray(msg) ? msg.join(", ") : msg };
  } catch {
    // If network or backend unreachable, try demo accounts
    const mockRes = loginWithMockCredentials(email, password);
    if (mockRes.ok) return mockRes;
    return { ok: false, error: "Could not connect to authentication server. Please check your internet connection." };
  }
}

export async function registerWithApi(name: string, email: string, password: string): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email: normalizedEmail, password }),
    });

    if (res.ok) {
      const data = await res.json();
      const u = data.user;
      const session: MockSession = {
        email: u.email,
        name: u.name,
        initials: u.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().substring(0, 2) || "ST",
        role: "student",
      };
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
      try {
        localStorage.setItem("jks_auth_user", JSON.stringify({ email: u.email, name: u.name, role: "student" }));
      } catch {}
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
      return { ok: true, session };
    }

    const errData = await res.json().catch(() => ({}));
    const msg = errData?.message || (res.status === 409 ? "An account with this email address already exists." : "Registration failed. Please try again.");
    return { ok: false, error: Array.isArray(msg) ? msg.join(", ") : msg };
  } catch {
    return { ok: false, error: "Could not reach the authentication server. Please check your internet connection." };
  }
}

export function logoutMockSession() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `__session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  document.cookie = `__client_uat=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  try {
    localStorage.removeItem("jks_auth_user");
    localStorage.removeItem("jks_student_avatar_v2");
  } catch {}
  void apiFetch("/auth/logout", { method: "POST" }).catch(() => {});
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}


