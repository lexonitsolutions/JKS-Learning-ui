"use client";

import { useSyncExternalStore } from "react";
import { MOCK_USERS } from "./mock-users";
import { SESSION_COOKIE_NAME, encodeSession, decodeSession, type MockSession } from "./session";

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

export function logoutMockSession() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

