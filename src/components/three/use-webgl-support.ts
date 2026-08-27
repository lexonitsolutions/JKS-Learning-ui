import { useSyncExternalStore } from "react";
import { hasWebGL } from "./has-webgl";

// WebGL support never changes over a page's lifetime, so subscribe is a
// no-op — this only exists to read the value in an SSR-safe way (the real
// check runs client-side only, via getSnapshot).
export function useWebGLSupport(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => hasWebGL(),
    () => false
  );
}
