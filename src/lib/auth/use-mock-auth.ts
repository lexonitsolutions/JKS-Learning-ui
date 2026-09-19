"use client";

import { useSyncExternalStore } from "react";
import type { MockRole } from "./mock-users";
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

/**
 * Lecturer accounts.
 *
 * These lived in localStorage under `jks_admin_instructors_v1`, with the
 * lecturer's password in clear text, and nothing ever reached the database. Two
 * consequences: the account the admin "created" did not exist as far as the API
 * was concerned (so signing in with it fell through to the old auto-provisioning
 * login and produced a STUDENT), and the browser-local list was itself the
 * authorization check for the lecturer workspace — editable from devtools.
 *
 * They are real INSTRUCTOR users now, behind /admin/instructors.
 */
export interface StoredInstructor {
  id: string;
  name: string;
  email: string;
  initials: string;
  role: string;
  assignedCourses?: number;
  students?: number;
  status?: "Active" | "Inactive";
}

interface ApiInstructor {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  createdAt: string;
  assignedCourseIds?: string[];
}

function toStoredInstructor(row: ApiInstructor): StoredInstructor {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    initials: initialsFor(row.name, "LE"),
    role: "Lecturer",
    assignedCourses: row.assignedCourseIds?.length ?? 0,
    students: 0,
    status: "Active",
  };
}

export async function fetchInstructors(): Promise<StoredInstructor[]> {
  try {
    const res = await apiFetch("/admin/instructors", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.map(toStoredInstructor) : [];
  } catch {
    return [];
  }
}

export type InstructorMutationResult =
  | { ok: true; instructor: StoredInstructor }
  | { ok: false; error: string };

export async function createInstructor(input: {
  name: string;
  email: string;
  password: string;
  title?: string;
  phone?: string;
}): Promise<InstructorMutationResult> {
  try {
    const res = await apiFetch("/admin/instructors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: input.name.trim(),
        email: input.email.trim().toLowerCase(),
        password: input.password,
        title: input.title?.trim() || undefined,
        phone: input.phone?.trim() || undefined,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const msg =
        data?.message ||
        (res.status === 403
          ? "Only an administrator can add lecturers."
          : "Could not create the lecturer account.");
      return { ok: false, error: Array.isArray(msg) ? msg.join(", ") : msg };
    }
    return { ok: true, instructor: toStoredInstructor(data) };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again." };
  }
}

export async function deleteInstructor(
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await apiFetch(`/admin/instructors/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      const msg = data?.message || "Could not revoke lecturer access.";
      return { ok: false, error: Array.isArray(msg) ? msg.join(", ") : msg };
    }
    return { ok: true };
  } catch {
    return { ok: false, error: "Could not reach the server. Please try again." };
  }
}

/** Map the API's Role enum onto the workspace this session may open. */
export function roleFromApi(apiRole: string | undefined): MockRole {
  if (apiRole === "SUPER_ADMIN" || apiRole === "ADMIN") return "admin";
  if (apiRole === "INSTRUCTOR") return "instructor";
  return "student";
}

function initialsFor(name: string, fallback = "JK"): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return fallback;
  return parts
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function writeSession(session: MockSession) {
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
  try {
    localStorage.setItem(
      "jks_auth_user",
      JSON.stringify({ email: session.email, name: session.name, role: session.role }),
    );
  } catch {}
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

/**
 * Re-read the signed-in user from the API.
 *
 * The `jks_mock_session` cookie is written by this file in plain JavaScript, so
 * anyone can edit it in devtools and hand themselves `role: "admin"`. It is a
 * convenience for rendering (avatar, which nav to draw) and must never be the
 * thing that decides access. `/auth/me` reads the role straight off the user
 * row behind the httpOnly JWT, so that is what authorization checks use.
 */
export async function fetchSessionUser(): Promise<
  { email: string; name: string; role: MockRole } | null
> {
  try {
    const res = await apiFetch("/auth/me", { headers: { "Content-Type": "application/json" } });
    if (!res.ok) return null;
    const data = await res.json();
    const u = data?.user;
    if (!u?.email) return null;
    return { email: u.email, name: u.name, role: roleFromApi(u.role) };
  } catch {
    return null;
  }
}

/**
 * Sign in against the API. There is no client-side fallback.
 *
 * Two offline "demo" paths used to sit behind this call and both were ways in
 * without the API agreeing:
 *
 *  - a hardcoded MOCK_USERS list containing an *admin* credential
 *    (lexonitservices@gmail.com / admin123), and
 *  - admin-added lecturers read out of the localStorage key
 *    `jks_admin_instructors_v1`, which accepted the stored plain-text password
 *    or, if none was set, literally any password of six characters or more.
 *
 * Because localStorage is writable from devtools, the second one let anyone
 * mint themselves a lecturer session. If the backend is unreachable we now
 * report that instead of signing someone in.
 */
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
      if (data.accessToken && typeof window !== "undefined") {
        try {
          localStorage.setItem("jks_access_token", data.accessToken);
        } catch {}
      }
      const u = data.user;
      const session: MockSession = {
        email: u.email,
        name: u.name,
        initials: initialsFor(u.name),
        role: roleFromApi(u.role),
      };
      writeSession(session);
      return { ok: true, session };
    }

    const errData = await res.json().catch(() => ({}));
    const msg =
      errData?.message ||
      (res.status === 401
        ? "Invalid email or password."
        : "Login failed. Please check your credentials.");
    return { ok: false, error: Array.isArray(msg) ? msg.join(", ") : msg };
  } catch {
    return {
      ok: false,
      error: "Could not reach the authentication server. Please try again.",
    };
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
      if (data.accessToken && typeof window !== "undefined") {
        try {
          localStorage.setItem("jks_access_token", data.accessToken);
        } catch {}
      }
      const u = data.user;
      const session: MockSession = {
        email: u.email,
        name: u.name,
        initials: initialsFor(u.name, "ST"),
        role: roleFromApi(u.role),
      };
      writeSession(session);
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
    "__clerk_session",
    "jks-session",
    "jks_mock_session",
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
      localStorage.removeItem("jks_access_token");
      localStorage.removeItem("jks_auth_user");
      localStorage.removeItem("jks_student_avatar_v2");
      localStorage.removeItem("jks_mock_session");
      sessionStorage.removeItem("jks_auth_user");
    } catch {}
  }

  void apiFetch("/auth/logout", { method: "POST" }).catch(() => {});

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  }
}

export async function performLogout(clerkSignOut?: () => Promise<unknown>) {
  // Clear local mock session first so that UI immediately drops authenticated state
  logoutMockSession();

  try {
    if (clerkSignOut) {
      // Allow max 2.5s for Clerk remote session invalidation before proceeding
      await Promise.race([
        clerkSignOut(),
        new Promise((resolve) => setTimeout(resolve, 2500)),
      ]);
    }
  } catch (err) {
    console.warn("[Logout] Clerk signOut caught error:", err);
  }

  if (typeof window !== "undefined") {
    window.location.replace("/login");
  }
}



