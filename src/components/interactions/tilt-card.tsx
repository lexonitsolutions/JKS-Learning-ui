"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";

const MAX_TILT_DEG = 6;

// Gentle 3D tilt toward the cursor — used on course cards. Desktop/mouse
// only; touch devices and prefers-reduced-motion get the plain card.
export function TiltCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const rotateXValue = useMotionValue(0);
  const rotateYValue = useMotionValue(0);
  const rotateX = useSpring(rotateXValue, { stiffness: 300, damping: 25 });
  const rotateY = useSpring(rotateYValue, { stiffness: 300, damping: 25 });
  const scale = useSpring(1, { stiffness: 300, damping: 25 });
  // Sheen follows the cursor across the card for a subtle premium highlight.
  const sheenX = useTransform(rotateY, [-MAX_TILT_DEG, MAX_TILT_DEG], [0, 100]);
  const sheenBackground = useTransform(
    sheenX,
    (v) => `radial-gradient(circle at ${v}% 0%, rgba(255,255,255,0.16), transparent 60%)`
  );

  if (reducedMotion) return <div className={className}>{children}</div>;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    rotateYValue.set(px * MAX_TILT_DEG * 2);
    rotateXValue.set(-py * MAX_TILT_DEG * 2);
    scale.set(1.02);
  };

  const handlePointerLeave = () => {
    rotateXValue.set(0);
    rotateYValue.set(0);
    scale.set(1);
  };

  return (
    <motion.div
      ref={ref}
      className={`relative ${className ?? ""}`}
      style={{ rotateX, rotateY, scale, transformPerspective: 800 }}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-lg opacity-0 hover:opacity-100"
        style={{ background: sheenBackground }}
      />
    </motion.div>
  );
}
