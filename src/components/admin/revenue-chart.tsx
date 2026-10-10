"use client";

import React, { useState, useId } from "react";
import { motion } from "framer-motion";

export interface DataPoint {
  /** Position in the series (day of month, or month number). */
  day: number;
  /** Revenue in lakhs of rupees. */
  revenue: number;
  /** X-axis / tooltip label, e.g. "5" or "Oct". Defaults to `day`. */
  label?: string;
}

/** Smallest "round" axis maximum (1, 2, 2.5, 5, 10 x 10^n) that fits the data. */
function niceAxisMax(maxValue: number): number {
  if (!Number.isFinite(maxValue) || maxValue <= 0) return 1;
  const exponent = Math.floor(Math.log10(maxValue));
  const base = Math.pow(10, exponent);
  for (const step of [1, 2, 2.5, 5, 10]) {
    if (maxValue <= step * base) return step * base;
  }
  return 10 * base;
}

/** Revenue values are in lakhs; show small amounts in thousands instead of 0.0L. */
function formatLakhs(value: number): string {
  if (value === 0) return "₹0";
  if (value >= 1) return `₹${+value.toFixed(2)}L`;
  return `₹${Math.round(value * 100)}K`;
}

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
  data = [],
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
  // Scale the axis to the data so the line is never clipped at the top.
  const maxVal = niceAxisMax(Math.max(0, ...data.map((d) => d.revenue)));
  const lastIndex = Math.max(1, data.length - 1);

  const points = data.map((d, index) => {
    const x = paddingLeft + (index / lastIndex) * chartW;
    const y = paddingTop + chartH - (d.revenue / maxVal) * chartH;
    return { x, y, data: d, index };
  });

  const linePath = getSplinePath(points);
  const areaPath = `${linePath} L ${paddingLeft + chartW},${paddingTop + chartH} L ${paddingLeft},${paddingTop + chartH} Z`;

  // Y-axis: four evenly spaced ticks from the scaled maximum down to zero.
  const yTicks = [1, 2 / 3, 1 / 3, 0].map((f) => ({
    value: maxVal * f,
    label: formatLakhs(+(maxVal * f).toFixed(4)),
  }));

  // X-axis: at most ~7 evenly spaced labels, always including first and last.
  const tickEvery = Math.max(1, Math.ceil(data.length / 7));
  const xTickIndexes = new Set<number>();
  data.forEach((_, i) => {
    if (i % tickEvery === 0 || i === data.length - 1) xTickIndexes.add(i);
  });
  // Drop the penultimate label if it would collide with the last one.
  if (data.length > 1 && (data.length - 1) % tickEvery !== 0) {
    const prev = Math.floor((data.length - 1) / tickEvery) * tickEvery;
    if (data.length - 1 - prev < tickEvery / 2) xTickIndexes.delete(prev);
  }

  // Dots only where there is revenue (or on hover) so empty ranges stay clean.
  const showDot = (d: DataPoint) => d.revenue > 0 && data.length <= 31;

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
            <g key={tick.value}>
              <text
                x={paddingLeft - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-slate-400 dark:fill-slate-500 text-[11px] font-medium"
              >
                {tick.label}
              </text>
              <line
                x1={paddingLeft}
                y1={y}
                x2={paddingLeft + chartW}
                y2={y}
                stroke="currentColor"
                className="text-slate-200 dark:text-slate-800"
                strokeWidth="1"
                strokeDasharray={tick.value === 0 ? "none" : "2 3"}
                opacity={tick.value === 0 ? 0.8 : 0.6}
              />
            </g>
          );
        })}

        {/* X-axis labels */}
        {Array.from(xTickIndexes).map((index) => {
          const point = data[index];
          const x = paddingLeft + (index / lastIndex) * chartW;
          return (
            <text
              key={`${point.day}-${index}`}
              x={x}
              y={height - 6}
              textAnchor="middle"
              className="fill-slate-400 dark:fill-slate-500 text-[11px] font-medium"
            >
              {point.label ?? point.day}
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
          const isKey = showDot(p.data);
          const isHovered = hoveredIndex === p.index;

          if (!isKey && !isHovered) return null;

          return (
            <g key={`${p.data.day}-${p.index}`} className="cursor-pointer">
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
                stroke="currentColor"
                strokeWidth={isHovered ? "2.5" : "1.8"}
                className="text-white dark:text-slate-900 transition-all duration-150"
              />
            </g>
          );
        })}

        {/* Invisible vertical hover capture bands for effortless interactive inspection */}
        {points.map((p) => {
          const bandWidth = chartW / data.length;
          return (
            <rect
              key={`band-${p.index}`}
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
          className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 dark:bg-surface-hover border border-transparent dark:border-slate-700/80 px-2.5 py-1 text-xs font-semibold text-white shadow-lg transition-all"
          style={{
            left: `${(points[hoveredIndex].x / width) * 100}%`,
            top: `${(points[hoveredIndex].y / height) * 100 - 8}%`,
          }}
        >
          <div className="text-[10px] font-normal text-slate-300 dark:text-slate-400">
            {points[hoveredIndex].data.label ? points[hoveredIndex].data.label : `Day ${points[hoveredIndex].data.day}`}
          </div>
          <div>{formatLakhs(points[hoveredIndex].data.revenue)}</div>
        </div>
      )}
    </div>
  );
}
