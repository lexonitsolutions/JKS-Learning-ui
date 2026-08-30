import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      if (typeof window === "undefined" || !window.matchMedia) {
        return () => {};
      }
      try {
        const mql = window.matchMedia(query);
        mql.addEventListener("change", callback);
        return () => mql.removeEventListener("change", callback);
      } catch {
        return () => {};
      }
    },
    () => {
      if (typeof window === "undefined" || !window.matchMedia) return false;
      try {
        return window.matchMedia(query).matches;
      } catch {
        return false;
      }
    },
    () => false
  );
}
