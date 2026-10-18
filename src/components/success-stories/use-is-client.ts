import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** False during SSR and hydration, true afterwards (for portals). */
export function useIsClient() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
