"use client";

import { Canvas } from "@react-three/fiber";
import { About3dCore, type About3dCoreProps } from "./about-3d-core";

export type About3dCanvasProps = About3dCoreProps;

export default function About3dCanvas(props: About3dCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.1, 6.4], fov: 42 }}
      dpr={[1, 1.75]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: false,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <About3dCore {...props} />
    </Canvas>
  );
}
