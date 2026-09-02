"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { aboutScrollProgress } from "./about-progress";

export interface About3dCoreProps {
  interactive?: boolean;
  /** Couple rotation/scale to the About hero's pinned scroll progress. */
  reactive?: boolean;
  primaryColor?: string;
  secondaryColor?: string;
  goldColor?: string;
}

// A hollow shell rather than a solid ball: solid volumes read as "fog" behind
// text, a shell reads as an object. Bias toward the shell edge keeps the
// centre clear so the headline never fights the particles for contrast.
function generateShell(count: number, radius: number, gold: THREE.Color, blue: THREE.Color, pale: THREE.Color) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = radius * (0.82 + 0.18 * Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta) * 0.72;
    positions[i * 3 + 2] = r * Math.cos(phi);

    const roll = Math.random();
    const col = roll < 0.1 ? gold : roll < 0.45 ? pale : blue;
    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;
  }
  return { positions, colors };
}

function generateRing(count: number, radius: number, wobble = 0.06) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const spread = (Math.random() - 0.5) * wobble;
    positions[i * 3] = Math.cos(angle) * (radius + spread);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.06;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + spread);
  }
  return positions;
}

export function About3dCore({
  interactive = true,
  reactive = true,
  primaryColor = "#1E5EFF",
  secondaryColor = "#7FA8FF",
  goldColor = "#E9B872",
}: About3dCoreProps) {
  const rootRef = useRef<THREE.Group>(null);
  const shellRef = useRef<THREE.Points>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const haloRef = useRef<THREE.Mesh>(null);
  const ringARef = useRef<THREE.Group>(null);
  const ringBRef = useRef<THREE.Group>(null);
  const ringCRef = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0 });
  const smoothed = useRef(0);
  const { size } = useThree();
  const isCompact = size.width < 768;

  const palette = useMemo(
    () => ({
      gold: new THREE.Color(goldColor),
      blue: new THREE.Color(primaryColor),
      pale: new THREE.Color(secondaryColor),
    }),
    [goldColor, primaryColor, secondaryColor]
  );

  const shell = useMemo(
    () => generateShell(isCompact ? 420 : 950, isCompact ? 3.0 : 3.6, palette.gold, palette.blue, palette.pale),
    [isCompact, palette]
  );
  const ringA = useMemo(() => generateRing(isCompact ? 90 : 150, 2.05), [isCompact]);
  const ringB = useMemo(() => generateRing(isCompact ? 110 : 190, 2.75, 0.08), [isCompact]);
  const ringC = useMemo(() => generateRing(isCompact ? 130 : 230, 3.45, 0.1), [isCompact]);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Lerp toward the raw scroll value so a scrubbed jump (anchor link, tab
    // restore) eases in instead of snapping the whole scene a half-turn.
    const target = reactive ? aboutScrollProgress.value : 0;
    smoothed.current += (target - smoothed.current) * Math.min(1, delta * 3);
    const p = smoothed.current;

    if (interactive) {
      pointer.current.x += (state.pointer.x * 0.35 - pointer.current.x) * 0.05;
      pointer.current.y += (state.pointer.y * 0.28 - pointer.current.y) * 0.05;
    }

    if (rootRef.current) {
      rootRef.current.rotation.y = t * 0.055 + p * Math.PI * 0.75 + pointer.current.x;
      rootRef.current.rotation.x = Math.sin(t * 0.06) * 0.07 - pointer.current.y + p * 0.18;
      const s = 1 + p * 0.16;
      rootRef.current.scale.set(s, s, s);
      rootRef.current.position.y = p * 0.35;
    }

    if (shellRef.current) shellRef.current.rotation.y = -t * 0.03;

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.12;
      coreRef.current.rotation.x = -t * 0.08;
      const mat = coreRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.16 + p * 0.16;
    }

    if (haloRef.current) {
      const pulse = 1 + Math.sin(t * 0.9) * 0.03;
      haloRef.current.scale.set(pulse, pulse, pulse);
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.05 + p * 0.07;
    }

    // Rings tilt open as the chapters advance — the scene "unfolds" with the
    // narrative rather than just spinning faster.
    if (ringARef.current) {
      ringARef.current.rotation.x = Math.PI / 2.6 - p * 0.3;
      ringARef.current.rotation.y = t * 0.22;
    }
    if (ringBRef.current) {
      ringBRef.current.rotation.x = -Math.PI / 3.4 + p * 0.4;
      ringBRef.current.rotation.z = -t * 0.16;
    }
    if (ringCRef.current) {
      ringCRef.current.rotation.x = Math.PI / 2.2 + Math.sin(t * 0.12) * 0.1;
      ringCRef.current.rotation.z = t * 0.1 + p * 0.5;
    }
  });

  const dust = isCompact ? 0.026 : 0.021;

  return (
    <group ref={rootRef}>
      {/* Particle shell */}
      <points ref={shellRef} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shell.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[shell.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={dust}
          vertexColors
          transparent
          opacity={0.9}
          sizeAttenuation={false}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Faceted core — wireframe only, so it never becomes a bright blob
          behind the headline. */}
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={primaryColor} wireframe transparent opacity={0.16} depthWrite={false} />
      </mesh>

      <mesh ref={haloRef}>
        <sphereGeometry args={[1.55, 32, 32]} />
        <meshBasicMaterial
          color={goldColor}
          transparent
          opacity={0.05}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      <group ref={ringARef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringA, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.03}
            color={goldColor}
            transparent
            opacity={0.75}
            sizeAttenuation={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <group ref={ringBRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringB, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.026}
            color={secondaryColor}
            transparent
            opacity={0.7}
            sizeAttenuation={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <group ref={ringCRef}>
        <points frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ringC, 3]} />
          </bufferGeometry>
          <pointsMaterial
            size={0.022}
            color={primaryColor}
            transparent
            opacity={0.6}
            sizeAttenuation={false}
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>
    </group>
  );
}
