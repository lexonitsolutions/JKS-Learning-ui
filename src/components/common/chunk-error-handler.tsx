"use client";

import { useEffect } from "react";

const CHUNK_RETRY_KEY = "jks_chunk_load_retry_ts";
const RETRY_THRESHOLD_MS = 10000; // 10 seconds cooldown to prevent reload loops

export function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message =
    typeof error === "string"
      ? error
      : (error as Error)?.message || (error as { reason?: string })?.reason || "";
  const name = (error as Error)?.name || "";

  return (
    name === "ChunkLoadError" ||
    message.includes("ChunkLoadError") ||
    message.includes("Loading chunk") ||
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("missing required chunk") ||
    message.includes("Cannot find module")
  );
}

// A resource `error` event is only ours to act on when it came from a Next.js
// build artifact on this origin. Third-party scripts (Clerk's clerk.browser.js
// and ui.browser.js, analytics, chat widgets) load cross-origin and fail for
// their own reasons — reloading the page on those just restarts their download
// and can trap the app in a reload loop, which is what stops Clerk's UI
// renderer from ever mounting.
function isFirstPartyChunkElement(target: EventTarget | null): boolean {
  if (!target) return false;
  const el = target as HTMLElement;
  if (el.tagName !== "SCRIPT" && el.tagName !== "LINK") return false;

  const src =
    (el as HTMLScriptElement).src || (el as HTMLLinkElement).href || "";
  if (!src) return false;

  try {
    const url = new URL(src, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return url.pathname.startsWith("/_next/");
  } catch {
    return false;
  }
}

export function handleChunkRetry() {
  if (typeof window === "undefined") return false;
  try {
    const lastRetry = sessionStorage.getItem(CHUNK_RETRY_KEY);
    const now = Date.now();
    if (!lastRetry || now - parseInt(lastRetry, 10) > RETRY_THRESHOLD_MS) {
      sessionStorage.setItem(CHUNK_RETRY_KEY, String(now));
      // Force reload from server to get fresh HTML and fresh chunk hashes
      window.location.reload();
      return true;
    }
  } catch {
    window.location.reload();
    return true;
  }
  return false;
}

export function ChunkErrorHandler() {
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        isChunkLoadError(event.error) ||
        isChunkLoadError(event.message) ||
        isFirstPartyChunkElement(event.target)
      ) {
        const handled = handleChunkRetry();
        if (handled) {
          event.preventDefault();
        }
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (isChunkLoadError(event.reason)) {
        const handled = handleChunkRetry();
        if (handled) {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("error", handleError, true);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      window.removeEventListener("error", handleError, true);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
    };
  }, []);

  return null;
}
