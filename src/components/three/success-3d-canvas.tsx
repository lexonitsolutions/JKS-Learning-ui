"use client";

import { Canvas } from "@react-three/fiber";
import { Success3dCore } from "./success-3d-core";

export interface Success3dCanvasProps {
  interactive?: boolean;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  goldColor?: string;
  accentColor?: string;
}

export default function Success3dCanvas({
  interactive = true,
  intensity = 1,
  primaryColor,
  secondaryColor,
  goldColor,
  accentColor,
}: Success3dCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.0], fov: 45 }}
      dpr={[1, 2]}
      gl={{
        antialias: true,
        alpha: true,
        powerPreference: "high-performance",
        stencil: false,
        depth: true,
      }}
      style={{ width: "100%", height: "100%" }}
    >
      <Success3dCore
        interactive={interactive}
        intensity={intensity}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        goldColor={goldColor}
        accentColor={accentColor}
      />
    </Canvas>
  );
}
