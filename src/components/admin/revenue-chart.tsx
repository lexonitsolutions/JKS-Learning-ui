"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";

export interface DataPoint {
  day: number;
  revenue: number;
}

export const REVENUE_30_DAYS: DataPoint[] = [
  { day: 1, revenue: 5.0 },
  { day: 2, revenue: 5.4 },
  { day: 3, revenue: 6.8 },
  { day: 4, revenue: 8.0 },
  { day: 5, revenue: 8.5 },
  { day: 6, revenue: 7.3 },
  { day: 7, revenue: 6.5 },
  { day: 8, revenue: 7.2 },
  { day: 9, revenue: 7.0 },
  { day: 10, revenue: 7.8 },
  { day: 11, revenue: 7.5 },
  { day: 12, revenue: 9.8 },
  { day: 13, revenue: 9.0 },
  { day: 14, revenue: 7.0 },
  { day: 15, revenue: 6.5 },
  { day: 16, revenue: 6.8 },
  { day: 17, revenue: 7.2 },
  { day: 18, revenue: 10.2 },
  { day: 19, revenue: 10.0 },
  { day: 20, revenue: 10.5 },
  { day: 21, revenue: 10.3 },
  { day: 22, revenue: 11.5 },
  { day: 23, revenue: 12.0 },
  { day: 24, revenue: 14.0 },
  { day: 25, revenue: 15.0 },
  { day: 26, revenue: 14.2 },
  { day: 27, revenue: 13.0 },
  { day: 28, revenue: 12.0 },
  { day: 29, revenue: 13.0 },
  { day: 30, revenue: 14.2 },
];

// Helper to create smooth cubic bezier curve
function getSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x},${points[0].y}`;

  let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? i : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2 < points.length ? i + 2 : i + 1];

    const cp1x = p1.x + (p2.x - p0.x) / 6;
    const cp1y = p1.y + (p2.y - p0.y) / 6;

    const cp2x = p2.x - (p3.x - p1.x) / 6;
    const cp2y = p2.y - (p3.y - p1.y) / 6;

    d += ` C ${cp1x.toFixed(2)},${cp1y.toFixed(2)} ${cp2x.toFixed(2)},${cp2y.toFixed(2)} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`;
  }

  return d;
}

export function RevenueChart({
  data = REVENUE_30_DAYS,
}: {
  data?: DataPoint[];
}) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId();

  // SVG viewBox coordinates
  const width = 600;
  const height = 240;
  const paddingLeft = 46;
  const paddingRight = 16;
  const paddingTop = 16;
  const paddingBottom = 32;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  const maxVal = 15.0; // ₹15L max axis

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / (data.length - 1)) * chartW;
    const y = paddingTop + chartH - (d.revenue / maxVal) * chartH;
    return { x, y, data: d, index };
  });

  const linePath = getSplinePath(points);
  const areaPath = `${linePath} L ${paddingLeft + chartW},${paddingTop + chartH} L ${paddingLeft},${paddingTop + chartH} Z`;

  // Y-axis ticks: 0, 5, 10, 15
  const yTicks = [
    { label: "₹15L", value: 15.0 },
    { label: "₹10L", value: 10.0 },
    { label: "₹5L", value: 5.0 },
    { label: "₹0", value: 0.0 },
  ];

  // X-axis ticks: 1, 5, 10, 15, 20, 25, 30
  const xTicks = [1, 5, 10, 15, 20, 25, 30];

  // Selected points with dots (matching reference image key points)
  const keyDays = new Set([1, 5, 8, 10, 12, 14, 18, 20, 22, 24, 25, 27, 30]);

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
        onMouseLeave={() => setHoveredIndex(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#2563EB" stopOpacity="0.22" />
            <stop offset="60%" stopColor="#3B82F6" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.00" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines & Y labels */}
        {yTicks.map((tick) => {
          const y = paddingTop + chartH - (tick.value / maxVal) * chartH;
          return (
            <g key={tick.label}>
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 text-[11px] font-medium"
              >
                {tick.label}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + chartW}
                y2={y}
                stroke="#E2E8F0"
                strokeWidth="1"
                strokeDasharray={tick.value === 0 ? "none" : "2 3"}
                opacity={tick.value === 0 ? 0.8 : 0.6}
              />
            </g>
          );
        })}

        {/* X-axis labels */}
        {xTicks.map((day) => {
          const index = data.findIndex((d) => d.day === day);
          if (index === -1) return null;
          const x = paddingLeft + (index / (data.length - 1)) * chartW;
          return (
            <text
              key={day}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="fill-slate-400 text-[11px] font-medium"
            >
              {day}
            </text>
          );
        })}

        {/* Area fill under curve */}
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        {/* Main Line with animated stroke */}
        <motion.path
          d={linePath}
          fill="none"
          stroke="#2563EB"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0.3 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Key circular points (matching reference) */}
        {points.map((p) => {
          const isKey = keyDays.has(p.data.day);
          const isHovered = hoveredIndex === p.index;

          if (!isKey && !isHovered) return null;

          return (
            <g key={p.data.day} className="cursor-pointer">
              {/* Outer pulsing ring on hover */}
              {isHovered && (
                <circle
                  cx={p.x}
                  cy={p.y}
                  r="9"
                  fill="#2563EB"
                  opacity="0.2"
                />
              )}
              {/* Point circle */}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? "5.5" : "3.5"}
                fill="#2563EB"
                stroke="#FFFFFF"
                strokeWidth={isHovered ? "2.5" : "1.8"}
                className="transition-all duration-150"
              />
            </g>
          );
        })}

        {/* Invisible vertical hover capture bands for effortless interactive inspection */}
        {points.map((p) => {
          const bandWidth = chartW / data.length;
          return (
            <rect
              key={`band-${p.data.day}`}
              x={p.x - bandWidth / 2}
              y={paddingTop}
              width={bandWidth}
              height={chartH}
              fill="transparent"
              className="cursor-pointer"
              onMouseEnter={() => setHoveredIndex(p.index)}
            />
          );
        })}

        {/* Active hover crosshair and tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <g>
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartH}
              stroke="#2563EB"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.4"
            />
          </g>
        )}
      </svg>

      {/* Floating HTML tooltip */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white shadow-lg transition-all"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
          }}
        >
          <div className="text-[10px] font-normal text-slate-300">Day {points[hoveredIndex].data.day}</div>
          <div>₹{points[hoveredIndex].data.revenue.toFixed(1)}L</div>
        </div>
      )}
    </div>
  );
}
