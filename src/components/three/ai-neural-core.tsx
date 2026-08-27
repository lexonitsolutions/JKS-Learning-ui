"use client";

import { useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface AiNeuralCoreProps {
  interactive?: boolean;
  intensity?: number;
  primaryColor?: string;
  secondaryColor?: string;
  accentColor?: string;
}

function generateConstellation(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const color1 = new THREE.Color("#1E5EFF");
  const color2 = new THREE.Color("#00F0FF");
  const color3 = new THREE.Color("#8B5CF6");

  for (let i = 0; i < count; i++) {
    const r = radius * (0.4 + 0.6 * Math.cbrt(Math.random()));
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);

    const mixed = color1.clone().lerp(Math.random() > 0.5 ? color2 : color3, Math.random());
    colors[i * 3] = mixed.r;
    colors[i * 3 + 1] = mixed.g;
    colors[i * 3 + 2] = mixed.b;
  }
  return { positions, colors };
}

function generateRingParticles(count: number, radius: number) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const spread = (Math.random() - 0.5) * 0.15;
    positions[i * 3] = Math.cos(angle) * (radius + spread);
    positions[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
    positions[i * 3 + 2] = Math.sin(angle) * (radius + spread);
  }
  return positions;
}

export function AiNeuralCore({
  interactive = true,
  primaryColor = "#1E5EFF",
  secondaryColor = "#00F0FF",
  accentColor = "#8B5CF6",
}: AiNeuralCoreProps) {
  const coreRef = useRef<THREE.Group>(null);
  const innerIcosaRef = useRef<THREE.Mesh>(null);
  const outerIcosaRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const ring3Ref = useRef<THREE.Group>(null);
  const pulseRingsRef = useRef<THREE.Group>(null);

  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const { size } = useThree();

  const particleData = useMemo(() => generateConstellation(120, 2.6), []);
  const ring1Positions = useMemo(() => generateRingParticles(70, 2.1), []);
  const ring2Positions = useMemo(() => generateRingParticles(90, 2.8), []);
  const ring3Positions = useMemo(() => generateRingParticles(50, 3.4), []);

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (interactive) {
      pointer.current.targetX = state.pointer.x * 0.6;
      pointer.current.targetY = state.pointer.y * 0.6;
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.05;
    }

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.15 + pointer.current.x;
      coreRef.current.rotation.x = Math.sin(t * 0.1) * 0.1 - pointer.current.y * 0.7;
    }

    if (innerIcosaRef.current) {
      innerIcosaRef.current.rotation.y = -t * 0.4;
      innerIcosaRef.current.rotation.z = t * 0.25;
      const s = 1 + Math.sin(t * 2.5) * 0.06;
      innerIcosaRef.current.scale.set(s, s, s);
    }

    if (outerIcosaRef.current) {
      outerIcosaRef.current.rotation.x = t * 0.2;
      outerIcosaRef.current.rotation.y = t * 0.3;
      const s = 1.6 + Math.cos(t * 1.8) * 0.04;
      outerIcosaRef.current.scale.set(s, s, s);
    }

    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.3) * 0.15;
      ring1Ref.current.rotation.y = t * 0.35;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3 + Math.cos(t * 0.25) * 0.2;
      ring2Ref.current.rotation.z = -t * 0.28;
    }

    if (ring3Ref.current) {
      ring3Ref.current.rotation.y = Math.PI / 6;
      ring3Ref.current.rotation.x = t * 0.2;
      ring3Ref.current.rotation.z = t * 0.15;
    }

    if (pulseRingsRef.current) {
      pulseRingsRef.current.children.forEach((child, idx) => {
        const mesh = child as THREE.Mesh;
        const progress = (t * 0.8 + idx * 0.33) % 1;
        const scale = 1.2 + progress * 2.4;
        mesh.scale.set(scale, scale, scale);
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = (1 - progress) * 0.35;
      });
    }
  });

  const dpr = Math.min(2, typeof window !== "undefined" ? window.devicePixelRatio : 1);
  const pointSize = Math.max(3.5, size.width / 320) * (dpr > 1 ? 0.9 : 1);

  return (
    <group ref={coreRef}>
      {/* Central Glowing Core Sphere */}
      <mesh>
        <sphereGeometry args={[0.7, 32, 32]} />
        <meshBasicMaterial color={primaryColor} transparent opacity={0.65} />
      </mesh>

      {/* Inner Rotating Faceted Crystal */}
      <mesh ref={innerIcosaRef}>
        <icosahedronGeometry args={[0.95, 0]} />
        <meshStandardMaterial
          color={secondaryColor}
          emissive={primaryColor}
          emissiveIntensity={0.8}
          roughness={0.1}
          metalness={0.8}
          wireframe
        />
      </mesh>

      {/* Outer Geometric Wireframe Cage */}
      <mesh ref={outerIcosaRef}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={secondaryColor} wireframe transparent opacity={0.35} />
      </mesh>

      {/* Pulsing Audio/Neural Wave Rings */}
      <group ref={pulseRingsRef}>
        {[0, 1, 2].map((i) => (
          <mesh key={i} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.98, 1.02, 64]} />
            <meshBasicMaterial color={secondaryColor} transparent opacity={0.3} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>

      {/* Gyroscopic Orbital Ring 1 */}
      <group ref={ring1Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ring1Positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={secondaryColor}
            size={pointSize * 0.9}
            sizeAttenuation={false}
            transparent
            opacity={0.9}
          />
        </points>
        <mesh>
          <torusGeometry args={[2.1, 0.012, 16, 100]} />
          <meshBasicMaterial color={primaryColor} transparent opacity={0.25} />
        </mesh>
      </group>

      {/* Gyroscopic Orbital Ring 2 */}
      <group ref={ring2Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ring2Positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={accentColor}
            size={pointSize * 0.8}
            sizeAttenuation={false}
            transparent
            opacity={0.85}
          />
        </points>
        <mesh>
          <torusGeometry args={[2.8, 0.01, 16, 100]} />
          <meshBasicMaterial color={accentColor} transparent opacity={0.2} />
        </mesh>
      </group>

      {/* Gyroscopic Orbital Ring 3 */}
      <group ref={ring3Ref}>
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[ring3Positions, 3]} />
          </bufferGeometry>
          <pointsMaterial
            color={primaryColor}
            size={pointSize * 0.75}
            sizeAttenuation={false}
            transparent
            opacity={0.8}
          />
        </points>
      </group>

      {/* Outer Floating Constellation Particles */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[particleData.positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[particleData.colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={pointSize}
          sizeAttenuation={false}
          vertexColors
          transparent
          opacity={0.85}
          depthWrite={false}
        />
      </points>

      {/* Dynamic Lighting inside Scene */}
      <pointLight position={[0, 0, 0]} intensity={3} color={secondaryColor} distance={8} />
      <pointLight position={[3, 3, 3]} intensity={2} color={primaryColor} />
      <pointLight position={[-3, -3, -3]} intensity={1.5} color={accentColor} />
      <ambientLight intensity={0.5} />
    </group>
  );
}
