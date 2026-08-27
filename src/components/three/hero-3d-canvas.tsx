"use client";

import { Canvas } from "@react-three/fiber";
import { Hero3dInterviewer } from "./hero-3d-interviewer";

export interface Hero3dCanvasProps {
  interactive?: boolean;
}

export default function Hero3dCanvas({ interactive = true }: Hero3dCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.2], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <Hero3dInterviewer interactive={interactive} />
    </Canvas>
  );
}
