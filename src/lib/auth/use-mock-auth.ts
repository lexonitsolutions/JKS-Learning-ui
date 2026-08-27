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

export function loginWithMockCredentials(email: string, password: string): LoginResult {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password
  );
  if (!user) return { ok: false, error: "Invalid email or password." };

  const session: MockSession = {
    email: user.email,
    name: user.name,
    initials: user.initials,
    role: user.role,
  };
  document.cookie = `${SESSION_COOKIE_NAME}=${encodeSession(session)}; path=/; max-age=${SESSION_MAX_AGE_SECONDS}; SameSite=Lax`;
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
  return { ok: true, session };
}

export function logoutMockSession() {
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; max-age=0`;
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}
