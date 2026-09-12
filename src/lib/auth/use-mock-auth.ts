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

export const INSTRUCTORS_STORAGE_KEY = "jks_admin_instructors_v1";

export interface StoredInstructor {
  name: string;
  email: string;
  initials: string;
  role: string;
  assignedCourses?: number;
  students?: number;
  status?: "Active" | "Inactive";
  password?: string;
}

export function getApprovedInstructors(): StoredInstructor[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(INSTRUCTORS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
}

export function saveApprovedInstructors(instructors: StoredInstructor[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(INSTRUCTORS_STORAGE_KEY, JSON.stringify(instructors));
  } catch {
    // ignore
  }
}

export function deleteApprovedInstructor(email: string): StoredInstructor[] {
  const current = getApprovedInstructors();
  const normalized = email.trim().toLowerCase();
  const updated = current.filter((inst) => inst.email.trim().toLowerCase() !== normalized);
  saveApprovedInstructors(updated);
  return updated;
}

export function isEmailApprovedInstructor(email: string): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  const approved = getApprovedInstructors();
  return approved.some((inst) => inst.email?.trim().toLowerCase() === normalized);
}

export function loginWithMockCredentials(email: string, password: string): LoginResult {
  const normalizedEmail = email.trim().toLowerCase();

  // 1. Check static MOCK_USERS (Admin & Students)
  const staticUser = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
  );

  if (staticUser) {
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

  // 2. Check dynamically admin-added lecturers in localStorage
  const dynamicInstructors = getApprovedInstructors();
  const matchedInstructor = dynamicInstructors.find(
    (inst) => inst.email?.toLowerCase() === normalizedEmail
  );

  if (matchedInstructor) {
    // Match instructor password if set, or accept default password 'lecturer123' / 'admin123' or length >= 6
    const validPassword = matchedInstructor.password
      ? password === matchedInstructor.password
      : password === "lecturer123" || password === "instructor123" || password === "admin123" || password.length >= 6;

    if (validPassword) {
      const session: MockSession = {
        email: matchedInstructor.email,
        name: matchedInstructor.name,
        initials: matchedInstructor.initials || "LE",
        role: "instructor",
      };
      document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
      window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
      return { ok: true, session };
    }
    return { ok: false, error: "Incorrect password for this lecturer account." };
  }

  // If user attempted an email that looks like an instructor or unapproved account
  return {
    ok: false,
    error: "Invalid email or password. Note: Only lecturers registered by an Administrator can access the Lecturer workspace.",
  };
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
  cachedRaw = undefined;
  cachedSnapshot = null;

  const cookieNames = [
    SESSION_COOKIE_NAME,
    "__session",
    "__client_uat",
    "__clerk_db_jwt",
    "jks-session",
  ];

  if (typeof document !== "undefined") {
    const hostname = typeof window !== "undefined" ? window.location.hostname : "";
    for (const name of cookieNames) {
      document.cookie = `${name}=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      if (hostname) {
        document.cookie = `${name}=; path=/; domain=${hostname}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
        document.cookie = `${name}=; path=/; domain=.${hostname}; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
      }
    }
  }

  if (typeof window !== "undefined") {
    try {
      localStorage.removeItem("jks_auth_user");
      localStorage.removeItem("jks_student_avatar_v2");
      sessionStorage.removeItem("jks_auth_user");
    } catch {}
  }

  void apiFetch("/auth/logout", { method: "POST" }).catch(() => {});

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  }
}

export async function performLogout(clerkSignOut?: () => Promise<unknown>) {
  try {
    if (clerkSignOut) {
      await clerkSignOut();
    }
  } catch (err) {
    console.warn("[Logout] Clerk signOut caught error:", err);
  }

  logoutMockSession();

  if (typeof window !== "undefined") {
    window.location.replace("/login");
  }
}



