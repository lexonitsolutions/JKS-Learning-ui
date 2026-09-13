"use client";

import React, { useEffect, useRef } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  tilt: number;
  tiltAngle: number;
  tiltAngleIncrement: number;
  shape: "rect" | "ribbon" | "star" | "circle";
  opacity: number;
}

interface SparkPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  decay: number;
  color: string;
}

const PALETTE = [
  "#F59E0B", // Gold
  "#FBBF24", // Light Amber
  "#EF4444", // Crimson Red
  "#EC4899", // Rose Pink
  "#3B82F6", // Electric Blue
  "#8B5CF6", // Royal Purple
  "#10B981", // Emerald Green
  "#06B6D4", // Cyan
  "#FCD34D", // Shimmer Yellow
  "#A855F7", // Bright Violet
];

export function CelebrationAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 900);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    // Initialize 65 fluttering confetti pieces
    const confettiCount = 65;
    const confettiList: ConfettiPiece[] = [];

    for (let i = 0; i < confettiCount; i++) {
      const isRibbon = Math.random() < 0.2;
      const isStar = Math.random() < 0.15;
      const isCircle = Math.random() < 0.2;
      const shape = isRibbon ? "ribbon" : isStar ? "star" : isCircle ? "circle" : "rect";

      confettiList.push({
        x: Math.random() * width,
        y: Math.random() * height - height,
        w: isRibbon ? 4 + Math.random() * 3 : 6 + Math.random() * 6,
        h: isRibbon ? 16 + Math.random() * 16 : 8 + Math.random() * 8,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        vx: (Math.random() - 0.5) * 1.5,
        vy: 1.2 + Math.random() * 2.2,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.08,
        tilt: 0,
        tiltAngle: Math.random() * Math.PI * 2,
        tiltAngleIncrement: 0.05 + Math.random() * 0.08,
        shape,
        opacity: 0.65 + Math.random() * 0.35,
      });
    }

    // Spark particles for celebratory bursts
    const sparks: SparkPiece[] = [];
    let lastBurstTime = 0;

    const spawnBurst = (originX: number, originY: number) => {
      const sparkCount = 28;
      const burstColors = ["#F59E0B", "#FCD34D", "#FFFFFF", "#38BDF8", "#F472B6"];
      for (let i = 0; i < sparkCount; i++) {
        const speed = 2 + Math.random() * 4.5;
        const angle = Math.random() * Math.PI * 2;
        sparks.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 1.5,
          radius: 1.5 + Math.random() * 2.2,
          alpha: 1,
          decay: 0.015 + Math.random() * 0.02,
          color: burstColors[Math.floor(Math.random() * burstColors.length)],
        });
      }
    };

    const drawStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      spikes: number,
      outerRadius: number,
      innerRadius: number,
    ) => {
      let rot = (Math.PI / 2) * 3;
      let x = cx;
      let y = cy;
      const step = Math.PI / spikes;

      context.beginPath();
      context.moveTo(cx, cy - outerRadius);
      for (let i = 0; i < spikes; i++) {
        x = cx + Math.cos(rot) * outerRadius;
        y = cy + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;

        x = cx + Math.cos(rot) * innerRadius;
        y = cy + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
      context.lineTo(cx, cy - outerRadius);
      context.closePath();
      context.fill();
    };

    let tick = 0;

    const render = () => {
      tick++;
      ctx.clearRect(0, 0, width, height);

      // Trigger celebratory spark burst periodically near podium center
      if (tick - lastBurstTime > 140) {
        lastBurstTime = tick;
        const burstX = width * 0.35 + Math.random() * (width * 0.3);
        const burstY = height * 0.25 + Math.random() * (height * 0.35);
        spawnBurst(burstX, burstY);
      }

      // 1. Update and render falling 3D confetti
      for (let i = 0; i < confettiList.length; i++) {
        const p = confettiList[i];

        p.tiltAngle += p.tiltAngleIncrement;
        p.tilt = Math.sin(p.tiltAngle) * 12;
        p.angle += p.angularVelocity;
        p.x += p.vx + Math.sin(p.tiltAngle * 0.5) * 0.8;
        p.y += p.vy;

        // Reset if fell below canvas
        if (p.y > height + 20) {
          p.y = -20;
          p.x = Math.random() * width;
          p.vy = 1.2 + Math.random() * 2.2;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.angle);
        ctx.scale(1, Math.cos(p.tiltAngle)); // 3D flipping ribbon effect
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.shape === "star") {
          drawStar(ctx, 0, 0, 5, p.w * 0.8, p.w * 0.4);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.w * 0.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === "ribbon") {
          // Curved waving streamer
          ctx.beginPath();
          ctx.moveTo(-p.w / 2, -p.h / 2);
          ctx.quadraticCurveTo(p.w * 1.2, 0, -p.w / 2, p.h / 2);
          ctx.lineTo(p.w / 2, p.h / 2);
          ctx.quadraticCurveTo(-p.w * 1.2, 0, p.w / 2, -p.h / 2);
          ctx.closePath();
          ctx.fill();
        } else {
          // Classic rectangular foil confetti
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        }

        ctx.restore();
      }

      // 2. Update and render spark bursts (fireworks)
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx;
        s.y += s.vy;
        s.vy += 0.08; // gravity
        s.alpha -= s.decay;

        if (s.alpha <= 0) {
          sparks.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = s.alpha;
        ctx.fillStyle = s.color;
        ctx.shadowColor = s.color;
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-90 select-none z-0"
    />
  );
}
