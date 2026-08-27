"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface Success3dCoreProps {
  interactive?: boolean;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
  goldColor?: string;
}

function generateSuccessConstellation(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const scales = new Float32Array(count);

  const c1 = new THREE.Color("#1E5EFF"); // Electric Blue
  const c2 = new THREE.Color("#00F0FF"); // Cyan
  const c3 = new THREE.Color("#F59E0B"); // Golden Amber
  const c4 = new THREE.Color("#10B981"); // Emerald Success

  for (let i = 0; i < count; i++) {
    const r = radius * (0.35 + 0.65 * Math.cbrt(Math.random()));
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const rand = Math.random();
    let col = c1;
    if (rand < 0.35) col = c3;
    else if (rand < 0.65) col = c2;
    else if (rand < 0.85) col = c1;
    else col = c4;

    colors[i * 3] = col.r;
    colors[i * 3 + 1] = col.g;
    colors[i * 3 + 2] = col.b;

    scales[i] = 0.5 + Math.random() * 1.5;
  }
  return { positions, colors, scales };
}

function generateOrbitRing(count: number, radius: number, wobble: number = 0.12) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const spread = (Math.random() - 0.5) * wobble;
    positions[i * 3] = Math.cos(angle) * (radius + spread);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.15;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + spread);
  }
  return positions;
}

export function Success3dCore({
  interactive = true,
  primaryColor = "#1E5EFF",
  secondaryColor = "#00F0FF",
  goldColor = "#F59E0B",
  accentColor = "#10B981",
}: Success3dCoreProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Group>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);
  const outerDodecaRef = useRef<THREE.Mesh>(null);
  const centerOrbRef = useRef<THREE.Mesh>(null);

  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const satellitesRef = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { size } = useThree();

  const isCompact = size.width < 768;
  const particleCount = isCompact ? 75 : 150;

  const constellation = useMemo(() => generateSuccessConstellation(particleCount, isCompact ? 2.4 : 3.0), [particleCount, isCompact]);
  const ring1Pts = useMemo(() => generateOrbitRing(isCompact ? 50 : 80, 1.9, 0.08), [isCompact]);
  const ring2Pts = useMemo(() => generateOrbitRing(isCompact ? 65 : 100, 2.5, 0.1), [isCompact]);
  const ring3Pts = useMemo(() => generateOrbitRing(isCompact ? 45 : 70, 3.1, 0.12), [isCompact]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (interactive) {
      pointer.current.targetX = state.pointer.x * 0.5;
      pointer.current.targetY = state.pointer.y * 0.5;
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.06;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.06;
    }

    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.y = t * 0.1 + pointer.current.x * 0.8;
      rootGroupRef.current.rotation.x = Math.sin(t * 0.08) * 0.08 - pointer.current.y * 0.6;
    }

    if (innerIcosaRef.current) {
      innerIcosaRef.current.rotation.y = -t * 0.35;
      innerIcosaRef.current.rotation.z = t * 0.2;
      const s = 0.95 + Math.sin(t * 2.2) * 0.05;
      innerIcosaRef.current.scale.set(s, s, s);
    }

    if (outerDodecaRef.current) {
      outerDodecaRef.current.rotation.x = t * 0.18;
      outerDodecaRef.current.rotation.y = t * 0.25;
      const s = 1.45 + Math.cos(t * 1.5) * 0.04;
      outerDodecaRef.current.scale.set(s, s, s);
    }

    if (centerOrbRef.current) {
      const pulse = 0.55 + Math.sin(t * 3.0) * 0.04;
      centerOrbRef.current.scale.set(pulse, pulse, pulse);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.25) * 0.1;
      ring1Ref.current.rotation.y = t * 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 4 + Math.cos(t * 0.2) * 0.12;
      ring2Ref.current.rotation.z = -t * 0.32;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.PI / 5;
      ring3Ref.current.rotation.x = t * 0.15;
      ring3Ref.current.rotation.z = t * 0.22;
    }

    if (satellitesRef.current) {
      satellitesRef.current.children.forEach((sat, i) => {
        const speed = 0.5 + i * 0.25;
        const angle = t * speed + (i * Math.PI * 2) / 4;
        const dist = 2.1 + (i % 2) * 0.7;
        sat.position.x = Math.cos(angle) * dist;
        sat.position.z = Math.sin(angle) * dist;
        sat.position.y = Math.sin(t * 1.5 + i * 1.2) * 0.45;
        sat.rotation.x = t * 1.2;
        sat.rotation.y = t * 1.5;
      });
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, 0, 0]}>
      {/* Ambient & Directional Lights */}
      <ambientLight intensity={0.8} />
      <pointLight position={[4, 5, 4]} intensity={2.2} color={goldColor} />
      <pointLight position={[-4, -3, -3]} intensity={2.0} color={secondaryColor} />
      <pointLight position={[0, 4, -4]} intensity={1.8} color={primaryColor} />

      {/* Central Achievement Core */}
      <group ref={coreRef}>
        {/* Core Glowing Orb */}
        <mesh ref={centerOrbRef}>
          <sphereGeometry args={[0.55, 32, 32]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>

        {/* Inner Faceted Icosahedron */}
        <mesh ref={innerIcosaRef}>
          <icosahedronGeometry args={[0.95, 0]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.6}
            wireframe
            roughness={0.3}
            metalness={0.9}
          />
        </mesh>

        {/* Outer Wireframe Polyhedron */}
        <mesh ref={outerDodecaRef}>
          <dodecahedronGeometry args={[1.45, 0]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.3}
            wireframe
            transparent
            opacity={0.65}
          />
        </mesh>
      </group>

      {/* Orbital Golden & Cyan Particle Rings */}
      <group ref={ring1Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[ring1Pts, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.06}
            color={goldColor}
            transparent
            opacity={0.85}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <group ref={ring2Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[ring2Pts, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.05}
            color={secondaryColor}
            transparent
            opacity={0.8}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      <group ref={ring3Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[ring3Pts, 3]}
            />
          </bufferGeometry>
          <pointsMaterial
            size={0.045}
            color={primaryColor}
            transparent
            opacity={0.7}
            blending={THREE.AdditiveBlending}
          />
        </points>
      </group>

      {/* Career Milestone Satellite Nodes */}
      <group ref={satellitesRef}>
        {/* Node 1: Skill Mastered (Cyan Octahedron) */}
        <mesh position={[2.1, 0, 0]}>
          <octahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={secondaryColor}
            emissive={secondaryColor}
            emissiveIntensity={0.9}
            metalness={0.9}
          />
        </mesh>

        {/* Node 2: AI Interview 90+ (Gold Dodecahedron) */}
        <mesh position={[0, 0, 2.7]}>
          <dodecahedronGeometry args={[0.2, 0]} />
          <meshStandardMaterial
            color={goldColor}
            emissive={goldColor}
            emissiveIntensity={0.9}
            metalness={0.9}
          />
        </mesh>

        {/* Node 3: Capstone Defended (Blue Icosahedron) */}
        <mesh position={[-2.1, 0, 0]}>
          <icosahedronGeometry args={[0.18, 0]} />
          <meshStandardMaterial
            color={primaryColor}
            emissive={primaryColor}
            emissiveIntensity={0.85}
            metalness={0.9}
          />
        </mesh>

        {/* Node 4: Hired Offer (Emerald Tetrahedron) */}
        <mesh position={[0, 0, -2.7]}>
          <tetrahedronGeometry args={[0.22, 0]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.95}
            metalness={0.8}
          />
        </mesh>
      </group>

      {/* Floating Constellation Particle Field */}
      <points>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[constellation.positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[constellation.colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={isCompact ? 0.05 : 0.065}
          vertexColors
          transparent
          opacity={0.85}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}
