import type { MockRole } from "./mock-users";

// Shared between the client hook (use-mock-auth.ts) and proxy.ts — must
// stay framework/runtime-agnostic (no `document`, no React) since proxy
// runs outside the browser.
export const SESSION_COOKIE_NAME = "jks_mock_session";

export interface MockSession {
  email: string;
  name: string;
  initials: string;
  role: MockRole;
}

export function encodeSession(session: MockSession): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function decodeSession(raw: string | undefined | null): MockSession | null {
  if (!raw) return null;
  try {
    return JSON.parse(decodeURIComponent(raw)) as MockSession;
  } catch {
    return null;
  }
}
