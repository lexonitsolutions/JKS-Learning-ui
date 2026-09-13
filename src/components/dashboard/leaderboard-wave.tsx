"use client";

import React, { useEffect, useRef } from "react";

export function LeaderboardWaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 240);

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener("resize", handleResize);

    let step = 0;

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, width, height);

      // Draw flowing sine waves
      const waves = [
        {
          color: "rgba(56, 189, 248, 0.28)", // Cyan
          freq: 0.006,
          amp: height * 0.22,
          speed: 1.2,
          yOffset: height * 0.55,
          lineWidth: 1.5,
        },
        {
          color: "rgba(96, 165, 250, 0.35)", // Blue
          freq: 0.008,
          amp: height * 0.26,
          speed: 0.9,
          yOffset: height * 0.5,
          lineWidth: 2,
        },
        {
          color: "rgba(168, 85, 247, 0.25)", // Purple
          freq: 0.005,
          amp: height * 0.18,
          speed: 1.5,
          yOffset: height * 0.45,
          lineWidth: 1.5,
        },
        {
          color: "rgba(255, 255, 255, 0.18)", // White highlight
          freq: 0.01,
          amp: height * 0.15,
          speed: 0.7,
          yOffset: height * 0.6,
          lineWidth: 1,
        },
      ];

      waves.forEach((w, waveIdx) => {
        ctx.beginPath();
        ctx.strokeStyle = w.color;
        ctx.lineWidth = w.lineWidth;

        for (let x = 0; x <= width; x += 4) {
          const y =
            w.yOffset +
            Math.sin(x * w.freq + step * w.speed + waveIdx) * w.amp +
            Math.cos(x * 0.003 - step * 0.5) * (w.amp * 0.4);

          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      });

      // Draw subtle luminous mesh grid lines
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = "rgba(147, 197, 253, 0.08)";
      for (let x = 20; x < width; x += 45) {
        ctx.beginPath();
        const yTop =
          height * 0.3 +
          Math.sin(x * 0.008 + step) * 20;
        const yBottom =
          height * 0.8 +
          Math.sin(x * 0.006 - step) * 25;
        ctx.moveTo(x, yTop);
        ctx.lineTo(x + 20, yBottom);
        ctx.stroke();
      }

      // Draw drifting soft particle nodes
      for (let i = 0; i < 8; i++) {
        const px = ((i * 130 + step * 40) % (width + 60)) - 30;
        const py =
          height * 0.45 +
          Math.sin(px * 0.006 + step + i) * (height * 0.25);
        ctx.beginPath();
        ctx.arc(px, py, i % 2 === 0 ? 2 : 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 2 === 0 ? "rgba(255, 255, 255, 0.65)" : "rgba(56, 189, 248, 0.8)";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full opacity-80"
    />
  );
}
