import { useSyncExternalStore } from "react";

// SSR-safe external-store subscription for a media query — avoids the
// "setState in effect" double-render pattern for something that's really
// just reading external (browser) state.
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (callback) => {
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    () => window.matchMedia(query).matches,
    () => false
  );
}
