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

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("jks_access_token") || null;
  } catch {
    return null;
  }
}

export function setStoredAccessToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      localStorage.setItem("jks_access_token", token);
    } else {
      localStorage.removeItem("jks_access_token");
      localStorage.removeItem("jks_refresh_token");
    }
  } catch {}
}

/**
 * Cross-site browsers (frontend and API on different sites) drop the httpOnly
 * refresh cookie, which made /auth/refresh 401 and every API call fail once the
 * access token expired. The token is kept as a fallback and sent in the body.
 */
export function getStoredRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem("jks_refresh_token") || null;
  } catch {
    return null;
  }
}

export function setStoredRefreshToken(token: string | null | undefined): void {
  if (typeof window === "undefined" || !token) return;
  try {
    localStorage.setItem("jks_refresh_token", token);
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
 * Identity is proven by:
 * 1. Clerk session token (Bearer header)
 * 2. Local signed accessToken (Bearer header fallback or httpOnly cookie)
 *
 * Always sends credentials: "include" for cookie support.
 */
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * The Clerk session token for the signed-in user, or null.
 */
async function getClerkToken(forceRefresh = false): Promise<string | null> {
  const w = window as any;
  const looksSignedIn =
    /(?:^|; )__client_uat=(?!0(?:;|$))[^;]+/.test(document.cookie) ||
    /(?:^|; )__session=/.test(document.cookie);

  const deadline = Date.now() + 4000;
  while (!w.Clerk?.session && looksSignedIn && Date.now() < deadline) {
    if (w.Clerk?.loaded && !w.Clerk.session) break; // loaded, genuinely signed out
    await sleep(50);
  }

  if (!w.Clerk?.session) return null;
  try {
    return (await w.Clerk.session.getToken(forceRefresh ? { skipCache: true } : undefined)) || null;
  } catch {
    return null;
  }
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAuthSession(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      // 1. Try refreshing Clerk session token if Clerk is active
      const w = typeof window !== "undefined" ? (window as any) : null;
      if (w?.Clerk?.session) {
        try {
          const freshToken = await getClerkToken(true);
          if (freshToken) return true;
        } catch {}
      }

      // 2. Try backend /auth/refresh endpoint using refresh cookie
      const res = await fetch(apiUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ refreshToken: getStoredRefreshToken() ?? undefined }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => null);
        if (data?.accessToken) {
          setStoredAccessToken(data.accessToken);
        }
        setStoredRefreshToken(data?.refreshToken);
        return true;
      }
      // Refresh token is dead: drop stale tokens so we stop sending them.
      if (res.status === 401) setStoredAccessToken(null);
      return false;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

export async function apiFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers || {});

  // Attach Bearer token if not explicitly provided
  if (typeof window !== "undefined" && !headers.has("Authorization")) {
    try {
      // Priority 1: Clerk session token
      const clerkToken = await getClerkToken();
      if (clerkToken) {
        headers.set("Authorization", `Bearer ${clerkToken}`);
      } else {
        // Priority 2: Stored local access token (prevents cross-origin third-party cookie drops)
        const localToken = getStoredAccessToken();
        if (localToken) {
          headers.set("Authorization", `Bearer ${localToken}`);
        }
      }
    } catch {}
  }

  let res: Response;
  try {
    res = await fetch(apiUrl(path), {
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

  // If request failed with 401 and is not an authentication endpoint, attempt transparent auto-refresh once
  // Only credential-submitting/session-ending endpoints are excluded: a 401 there
  // is a real answer, not an expired session. `/auth/me` MUST be refreshable,
  // otherwise an expired access token makes the user look signed out.
  const isAuthPath = /^\/?auth\/(login|register|refresh|logout|send-registration-otp|verify-registration-otp|forgot-password|reset-password|clerk-sync)(\/|\?|$)/.test(
    path,
  );

  if (res.status === 401 && !isAuthPath && typeof window !== "undefined") {
    const refreshed = await refreshAuthSession();
    if (refreshed) {
      const retryHeaders = new Headers(init.headers || {});
      const freshClerkToken = await getClerkToken();
      if (freshClerkToken) {
        retryHeaders.set("Authorization", `Bearer ${freshClerkToken}`);
      } else {
        const freshLocalToken = getStoredAccessToken();
        if (freshLocalToken) {
          retryHeaders.set("Authorization", `Bearer ${freshLocalToken}`);
        }
      }

      try {
        return await fetch(apiUrl(path), {
          ...init,
          headers: retryHeaders,
          credentials: "include",
          signal: init.signal ?? AbortSignal.timeout(API_TIMEOUT_MS),
        });
      } catch {}
    }
  }

  return res;
}
