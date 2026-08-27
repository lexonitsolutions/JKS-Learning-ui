// Cached module-level probe. Two hard requirements learned from tab
// crashes in the field ("This page couldn't load"):
//
// 1. Compute ONCE. This is called from useSyncExternalStore's getSnapshot,
//    which React invokes on every render of every backdrop — the old
//    version created a fresh probe canvas + WebGL context per call and
//    never released it. Chrome allows ~16 live WebGL contexts and
//    force-loses the oldest beyond that, which can kill the *visible*
//    scene contexts and destabilize the GPU process.
//
// 2. failIfMajorPerformanceCaveat: after a GPU-process hiccup Chrome
//    silently falls back to software WebGL (SwiftShader). Rendering
//    full-screen shader backdrops at 60fps on the CPU balloons tab memory
//    until Chrome kills the tab. If hardware acceleration isn't available
//    we'd rather render the static gradient fallback than crash.
let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  try {
    const canvas = document.createElement("canvas");
    const attrs = { failIfMajorPerformanceCaveat: true } as const;
    const gl =
      (window.WebGL2RenderingContext && canvas.getContext("webgl2", attrs)) ||
      canvas.getContext("webgl", attrs);
    if (gl) {
      // Release the probe context immediately instead of waiting for GC —
      // it counts against the browser's live-context limit until then.
      (gl as WebGLRenderingContext).getExtension("WEBGL_lose_context")?.loseContext();
    }
    cached = !!gl;
  } catch {
    cached = false;
  }
  return cached;
}
