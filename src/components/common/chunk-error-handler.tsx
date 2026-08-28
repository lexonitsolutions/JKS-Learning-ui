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
        (event.target && (event.target as HTMLElement).tagName === "SCRIPT")
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
