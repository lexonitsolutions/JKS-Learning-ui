/**
 * Remember where a visitor was heading when they were sent to sign in / sign up,
 * so they land back there afterwards (e.g. the course they wanted to enroll in).
 *
 * Only same-site paths are accepted - never a full URL - so this cannot be used
 * as an open redirect.
 */
const KEY = "jks_post_login_target";

export function isSafeInternalPath(path: unknown): path is string {
  return (
    typeof path === "string" &&
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("\\") &&
    !path.toLowerCase().startsWith("/login") &&
    !path.toLowerCase().startsWith("/register") &&
    !path.toLowerCase().startsWith("/sign-") &&
    !path.toLowerCase().startsWith("/auth-redirect")
  );
}

export function setPostLoginTarget(path: string) {
  if (!isSafeInternalPath(path)) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {}
}

export function consumePostLoginTarget(): string | null {
  try {
    const v = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    return isSafeInternalPath(v) ? v : null;
  } catch {
    return null;
  }
}
