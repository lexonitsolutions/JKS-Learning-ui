"use client";

import { Canvas } from "@react-three/fiber";
import { NetworkScene } from "./network-scene";

export interface NetworkCanvasProps {
  nodeCount: number;
  connectionDistance: number;
  radius: number;
  interactive: boolean;
  color?: string;
  /** Halt the render loop (frameloop="never") while scrolled off-screen —
   * the WebGL context stays alive, avoiding create/destroy churn. */
  paused?: boolean;
}

// Pure Canvas wrapper, loaded only on the client via next/dynamic
// (network-background.tsx) so three.js/R3F never ship in the initial
// server-rendered bundle. Mounted only while in view — see
// network-background.tsx — so there is no separate pause flag to manage
// here; unmounting fully releases the WebGL context and rAF loop.
export default function NetworkCanvas({
  nodeCount,
  connectionDistance,
  radius,
  interactive,
  color,
  paused = false,
}: NetworkCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, radius * 2.1], fov: 45 }}
      dpr={[1, 1.75]}
      frameloop={paused ? "never" : "always"}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
        // Never accept a software-rendered (SwiftShader) context — CPU
        // rendering this at 60fps balloons tab memory until Chrome kills
        // the tab. The gradient behind the canvas is the fallback.
        failIfMajorPerformanceCaveat: true,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <NetworkScene
        nodeCount={nodeCount}
        connectionDistance={connectionDistance}
        radius={radius}
        interactive={interactive}
        color={color}
      />
    </Canvas>
  );
}
