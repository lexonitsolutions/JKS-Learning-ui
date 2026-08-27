"use client";

import { Canvas } from "@react-three/fiber";
import { AiNeuralCore } from "./ai-neural-core";

export interface AiNeuralCanvasProps {
  interactive?: boolean;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

export default function AiNeuralCanvas({
  interactive = true,
  intensity = 1,
  primaryColor = "#1E5EFF",
  secondaryColor = "#00F0FF",
  accentColor = "#8B5CF6",
}: AiNeuralCanvasProps) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5.8], fov: 45 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ width: "100%", height: "100%" }}
    >
      <AiNeuralCore
        interactive={interactive}
        intensity={intensity}
        primaryColor={primaryColor}
        secondaryColor={secondaryColor}
        accentColor={accentColor}
      />
    </Canvas>
  );
}
