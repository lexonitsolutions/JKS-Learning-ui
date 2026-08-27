"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Hero3dInterviewerProps {
  interactive?: boolean;
}

export function Hero3dInterviewer({ interactive = true }: Hero3dInterviewerProps) {
  const rootGroupRef = useRef<THREE.Group>(null);
  const cubeGroupRef = useRef<THREE.Group>(null);
  const ring1Ref = useRef<THREE.Group>(null);
  const ring2Ref = useRef<THREE.Group>(null);
  const sphere1Ref = useRef<THREE.Mesh>(null);
  const sphere2Ref = useRef<THREE.Mesh>(null);
  const sphere3Ref = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    if (interactive) {
      pointer.current.targetX = state.pointer.x * 0.4;
      pointer.current.targetY = state.pointer.y * 0.4;
      pointer.current.x += (pointer.current.targetX - pointer.current.x) * 0.05;
      pointer.current.y += (pointer.current.targetY - pointer.current.y) * 0.05;
    }

    if (rootGroupRef.current) {
      rootGroupRef.current.rotation.y = pointer.current.x * 0.6;
      rootGroupRef.current.rotation.x = -pointer.current.y * 0.4;
    }

    // Floating 3D Cube oscillation and rotation
    if (cubeGroupRef.current) {
      cubeGroupRef.current.position.y = 0.85 + Math.sin(t * 1.8) * 0.12;
      cubeGroupRef.current.rotation.y = t * 0.35;
      cubeGroupRef.current.rotation.x = Math.sin(t * 0.8) * 0.15 + 0.2;
      cubeGroupRef.current.rotation.z = Math.cos(t * 0.7) * 0.1;
    }

    // Orbital Rings
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = Math.PI / 3 + Math.sin(t * 0.5) * 0.1;
      ring1Ref.current.rotation.y = t * 0.4;
    }

    if (ring2Ref.current) {
      ring2Ref.current.rotation.x = -Math.PI / 3.5 + Math.cos(t * 0.4) * 0.1;
      ring2Ref.current.rotation.z = -t * 0.35;
    }

    // Floating Ambient Spheres
    if (sphere1Ref.current) {
      sphere1Ref.current.position.y = 0.4 + Math.sin(t * 2 + 1) * 0.15;
    }
    if (sphere2Ref.current) {
      sphere2Ref.current.position.y = 1.4 + Math.cos(t * 1.5 + 2) * 0.12;
    }
    if (sphere3Ref.current) {
      sphere3Ref.current.position.y = -0.2 + Math.sin(t * 1.7 + 3) * 0.1;
    }
  });

  return (
    <group ref={rootGroupRef} position={[0, -0.4, 0]}>
      {/* Studio Lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.8} color="#ffffff" />
      <directionalLight position={[-5, 5, -5]} intensity={0.6} color="#dbeafe" />
      <pointLight position={[0, 1.2, 0]} intensity={2.5} color="#38bdf8" distance={6} />
      <pointLight position={[0, -0.6, 0]} intensity={3} color="#1d4ed8" distance={4} />

      {/* 1. TIERED CIRCULAR PEDESTAL */}
      <group position={[0, -0.8, 0]}>
        {/* Base Pedestal Bottom Tier */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[2.3, 2.4, 0.22, 64]} />
          <meshStandardMaterial color="#f0f4fc" roughness={0.2} metalness={0.1} />
        </mesh>

        {/* Glowing Blue LED Inset Ring */}
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[2.22, 2.22, 0.05, 64]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.8} />
        </mesh>

        {/* Middle Tier */}
        <mesh position={[0, 0.22, 0]}>
          <cylinderGeometry args={[1.9, 1.95, 0.2, 64]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.15} metalness={0.1} />
        </mesh>

        {/* Top Glow Rim */}
        <mesh position={[0, 0.33, 0]}>
          <cylinderGeometry args={[1.72, 1.72, 0.04, 64]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.9} />
        </mesh>

        {/* Top Pedestal Disc Surface */}
        <mesh position={[0, 0.38, 0]}>
          <cylinderGeometry args={[1.65, 1.68, 0.12, 64]} />
          <meshStandardMaterial color="#ffffff" roughness={0.1} metalness={0.05} />
        </mesh>

        {/* Base Projection Glow Plane */}
        <mesh position={[0, 0.45, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 1.5, 64]} />
          <meshBasicMaterial color="#93c5fd" transparent opacity={0.35} />
        </mesh>
      </group>

      {/* 2. FLOATING 3D GLASS CUBE WITH "AI" CORE */}
      <group ref={cubeGroupRef}>
        {/* Outer Translucent Glass Cube */}
        <mesh>
          <boxGeometry args={[1.25, 1.25, 1.25]} />
          <meshPhysicalMaterial
            color="#93c5fd"
            transmission={0.85}
            opacity={1}
            transparent
            roughness={0.1}
            ior={1.45}
            metalness={0.1}
            thickness={1.2}
            specularIntensity={1}
            specularColor="#ffffff"
          />
        </mesh>

        {/* Inner Glowing Beveled Wireframe Box */}
        <mesh>
          <boxGeometry args={[1.255, 1.255, 1.255]} />
          <meshBasicMaterial color="#60a5fa" wireframe transparent opacity={0.3} />
        </mesh>

        {/* Inner Glowing Energy Crystal */}
        <mesh scale={[0.65, 0.65, 0.65]}>
          <octahedronGeometry args={[0.7, 0]} />
          <meshStandardMaterial
            color="#1e40af"
            emissive="#3b82f6"
            emissiveIntensity={1.2}
            roughness={0.2}
          />
        </mesh>

        {/* 3D "AI" Letters on Cube Faces */}
        {/* Front & Back "AI" Marker */}
        <group position={[0, 0, 0.64]}>
          {/* Letter A */}
          <mesh position={[-0.2, 0, 0]}>
            <boxGeometry args={[0.12, 0.38, 0.04]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#2563eb" emissiveIntensity={0.8} />
          </mesh>
          <mesh position={[-0.1, 0.05, 0]} rotation={[0, 0, -Math.PI / 6]}>
            <boxGeometry args={[0.08, 0.28, 0.04]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#2563eb" emissiveIntensity={0.8} />
          </mesh>
          {/* Letter I */}
          <mesh position={[0.18, 0, 0]}>
            <boxGeometry args={[0.1, 0.38, 0.04]} />
            <meshStandardMaterial color="#1d4ed8" emissive="#2563eb" emissiveIntensity={0.8} />
          </mesh>
        </group>

        {/* Side "AI" Marker */}
        <group position={[0.64, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <mesh position={[-0.15, 0, 0]}>
            <boxGeometry args={[0.1, 0.36, 0.03]} />
            <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.6} />
          </mesh>
          <mesh position={[0.15, 0, 0]}>
            <boxGeometry args={[0.09, 0.36, 0.03]} />
            <meshStandardMaterial color="#2563eb" emissive="#3b82f6" emissiveIntensity={0.6} />
          </mesh>
        </group>
      </group>

      {/* 3. ORBITAL CELESTIAL RINGS */}
      <group ref={ring1Ref} position={[0, 0.85, 0]}>
        <mesh>
          <torusGeometry args={[2.0, 0.015, 16, 120]} />
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.6} />
        </mesh>
        {/* Orbital Node Bead */}
        <mesh position={[2.0, 0, 0]}>
          <sphereGeometry args={[0.06, 16, 16]} />
          <meshBasicMaterial color="#0284c7" />
        </mesh>
      </group>

      <group ref={ring2Ref} position={[0, 0.85, 0]}>
        <mesh>
          <torusGeometry args={[2.4, 0.012, 16, 120]} />
          <meshBasicMaterial color="#60a5fa" transparent opacity={0.45} />
        </mesh>
        {/* Orbital Node Bead 2 */}
        <mesh position={[-2.4, 0, 0]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#2563eb" />
        </mesh>
      </group>

      {/* 4. FLOATING GLOSSY BLUE ACCENT SPHERES */}
      <mesh ref={sphere1Ref} position={[-2.2, 0.4, 0.5]}>
        <sphereGeometry args={[0.14, 32, 32]} />
        <meshStandardMaterial color="#1d4ed8" roughness={0.1} metalness={0.2} />
      </mesh>

      <mesh ref={sphere2Ref} position={[2.2, 1.4, -0.4]}>
        <sphereGeometry args={[0.09, 32, 32]} />
        <meshStandardMaterial color="#0284c7" roughness={0.1} metalness={0.2} />
      </mesh>

      <mesh ref={sphere3Ref} position={[1.8, -0.2, 1.2]}>
        <sphereGeometry args={[0.07, 32, 32]} />
        <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.1} />
      </mesh>
    </group>
  );
}
