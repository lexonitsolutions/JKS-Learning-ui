"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface NetworkSceneProps {
  nodeCount: number;
  connectionDistance: number;
  radius: number;
  interactive: boolean;
  color?: string;
}

function generateNodes(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Points distributed through a sphere volume (not just the surface) so
    // the network reads as a 3D data structure, not a hollow shell.
    const r = radius * Math.cbrt(Math.random());
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function buildConnections(positions: Float32Array, maxDistance: number) {
  const count = positions.length / 3;
  const linePositions: number[] = [];
  const v = new THREE.Vector3();
  const w = new THREE.Vector3();

  for (let i = 0; i < count; i++) {
    v.set(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
    for (let j = i + 1; j < count; j++) {
      w.set(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
      if (v.distanceTo(w) < maxDistance) {
        linePositions.push(v.x, v.y, v.z, w.x, w.y, w.z);
      }
    }
  }
  return new Float32Array(linePositions);
}

// Procedural node/particle network — DESIGN.md §9: "geometric abstractions
// (nodes, connections, particles) representing learning/AI/technology — no
// heavy imported 3D models." Reused for both the hero (dense, large) and the
// AI Interview section (sparser, calmer) via props.
export function NetworkScene({
  nodeCount,
  connectionDistance,
  radius,
  interactive,
  color = "#1E5EFF",
}: NetworkSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const { size } = useThree();

  const positions = useMemo(() => generateNodes(nodeCount, radius), [nodeCount, radius]);
  const linePositions = useMemo(
    () => buildConnections(positions, connectionDistance),
    [positions, connectionDistance]
  );

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Slow autonomous drift.
    groupRef.current.rotation.y += delta * 0.06;
    groupRef.current.rotation.x += delta * 0.01;

    // Subtle mouse-reactive parallax — lerped so it never feels twitchy.
    if (interactive) {
      pointer.current.x = state.pointer.x;
      pointer.current.y = state.pointer.y;
      groupRef.current.rotation.y += pointer.current.x * 0.0006;
      groupRef.current.rotation.x += -pointer.current.y * 0.0004;
    }
  });

  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1);
  const pointSize = Math.max(3, size.width / 400) * (dpr > 1 ? 0.85 : 1);

  return (
    <group ref={groupRef}>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color={color}
          size={pointSize}
          sizeAttenuation={false}
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color={color} transparent opacity={0.12} depthWrite={false} />
      </lineSegments>
    </group>
  );
}
