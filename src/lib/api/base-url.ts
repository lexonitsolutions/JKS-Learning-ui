/**
 * Single source of truth for the backend API origin.
 *
 * Every call to the NestJS backend must go through `apiUrl()` rather than a
 * hardcoded host. Before this existed the origin was written out as
 * "http://localhost:4000" in 13 places, which meant the deployed frontend on
 * Vercel called a machine that does not exist from the browser's point of view.
 *
 * NEXT_PUBLIC_API_URL is read at BUILD time — Next.js inlines NEXT_PUBLIC_*
 * into the client bundle. Changing it in Vercel therefore requires a redeploy;
 * editing the value alone will not affect an already-built deployment.
 *
 * The localhost fallback keeps `npm run dev` working with no .env.local entry,
 * matching the previous hardcoded behaviour exactly.
 */
// Production API endpoint target synced with Railway
const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "https://jks-learning-backend-production-c2eb.up.railway.app";

function resolveBaseUrl(): string {
  let raw = process.env.NEXT_PUBLIC_API_URL?.trim() || DEFAULT_API_URL;
  if (!raw) return DEFAULT_API_URL;
  // If the protocol was omitted (e.g. "jks-learning-backend-production-c2eb.up.railway.app"),
  // automatically prepend "https://" so fetch() receives a valid absolute URL.
  if (!/^https?:\/\//i.test(raw)) {
    raw = `https://${raw}`;
  }
  // Tolerate trailing slashes so we never build double-slashed paths like https://api.example.com//auth/login.
  return raw.replace(/\/+$/, "");
}

export const API_BASE_URL = resolveBaseUrl();

/**
 * Build an absolute backend URL from a root-relative path.
 *
 * @example apiUrl("/auth/login") -> "https://api.example.com/auth/login"
 */
export function apiUrl(path: string): string {
  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * How long to wait before giving up on the API.
 *
 * The backend's Mongo driver gives up after ~30s. A browser fetch left hanging
 * too long can be aborted by lifecycle events, but heavy mutations like course
 * saves and cold starts can take 15-25s. 45s allows operations to complete while
 * protecting against infinite hangs.
 */
const API_TIMEOUT_MS = 45_000;

let legacyTokenPurged = false;

/**
 * Earlier builds kept the API access token in localStorage (`jks_access_token`),
 * readable by any script on the page. Remove any copy still sitting in a
 * browser; the httpOnly cookie is the session now.
 */
export function purgeLegacyAccessToken(): void {
  if (legacyTokenPurged || typeof window === "undefined") return;
  legacyTokenPurged = true;
  try {
    localStorage.removeItem("jks_access_token");
  } catch {}
}

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number | null,
    readonly cause?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Single entry point for backend calls.
 *
 * Identity is only ever proven by the httpOnly session cookie or a Clerk
 * session token. This function deliberately does NOT send the user's email or
 * session blob as headers: the server no longer accepts those, because anything
 * the browser can set, an attacker can set too.
 *
 * Always sends cookies: the API authenticates with an httpOnly `accessToken`,
 * so a request without `credentials: "include"` is anonymous. Most call sites
 * here were missing it.
 */
export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});

  // Attach Bearer token or session headers if present
  if (typeof window !== "undefined") {
    try {
      purgeLegacyAccessToken();
      // Our own session is the httpOnly accessToken cookie (sent via
      // credentials: "include" below). Only a live Clerk session token is
      // attached as a Bearer header.
      let token: string | null = null;
      if ((window as any).Clerk?.session) {
        try {
          token = await (window as any).Clerk.session.getToken();
        } catch {}
      }
      if (token && !headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
      }
    } catch {}
  }

  try {
    return await fetch(apiUrl(path), {
      ...init,
      headers,
      credentials: "include",
      signal: init.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      throw new ApiError(
        `The API did not respond within ${API_TIMEOUT_MS / 1000}s. It may be running but unable to reach its database — check ${API_BASE_URL}/health/db.`,
        null,
        err,
      );
    }
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new ApiError("Request cancelled.", null, err);
    }
    throw new ApiError(
      `Could not reach the API at ${API_BASE_URL}. Is the backend running?`,
      null,
      err,
    );
  }
}
