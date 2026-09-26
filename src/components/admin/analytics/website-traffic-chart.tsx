"use client";

import React, { useState, useId, useMemo } from "react";
import { motion } from "framer-motion";
import type { TimeseriesPoint } from "@/lib/analytics/types";
import { Users, Eye, Activity, TrendingUp } from "lucide-react";

interface WebsiteTrafficChartProps {
  data: TimeseriesPoint[];
  isLoading?: boolean;
}

type MetricKey = "activeUsers" | "pageViews" | "sessions";

function getSplinePath(points: { x: number; y: number }[]): string {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`;

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

export function WebsiteTrafficChart({ data, isLoading }: WebsiteTrafficChartProps) {
  const [activeMetric, setActiveMetric] = useState<MetricKey>("activeUsers");
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const gradientId = useId();

  // Ensure there is always a continuous multi-point curve
  const processedData: TimeseriesPoint[] = useMemo(() => {
    if (!data || data.length === 0) {
      // Build a 7-day flat baseline ending today so the chart canvas is never empty
      const now = new Date();
      return Array.from({ length: 7 }).map((_, i) => {
        const d = new Date(now);
        d.setDate(d.getDate() - (6 - i));
        return {
          date: d.toISOString().split("T")[0],
          label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          activeUsers: 0,
          sessions: 0,
          pageViews: 0,
        };
      });
    }

    if (data.length === 1) {
      // Expand single data point into a continuous 7-day curve leading to today's active metric
      const pt = data[0];
      const ptDate = new Date(pt.date.includes("T") ? pt.date : `${pt.date}T00:00:00`);
      const points: TimeseriesPoint[] = [];
      for (let i = 6; i >= 0; i--) {
        const d = new Date(ptDate);
        d.setDate(d.getDate() - i);
        const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        if (i === 0) {
          points.push(pt);
        } else {
          points.push({
            date: d.toISOString().split("T")[0],
            label,
            activeUsers: 0,
            sessions: 0,
            pageViews: 0,
          });
        }
      }
      return points;
    }

    return data;
  }, [data]);

  const width = 760;
  const height = 280;
  const paddingLeft = 44;
  const paddingRight = 24;
  const paddingTop = 26;
  const paddingBottom = 40;

  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;

  const rawValues = processedData.map(d => d[activeMetric] || 0);
  const currentMetricTotal = rawValues.reduce((sum, v) => sum + v, 0);
  const peakValue = Math.max(...rawValues, 0);
  const avgValue = +(currentMetricTotal / Math.max(rawValues.length, 1)).toFixed(1);

  const maxRaw = Math.max(...rawValues, 1);
  const maxVal = Math.max(Math.ceil(maxRaw * 1.25), 4);

  const points = processedData.map((d, index) => {
    const x = paddingLeft + (index / Math.max(processedData.length - 1, 1)) * chartW;
    const val = d[activeMetric] || 0;
    const y = paddingTop + chartH - (val / maxVal) * chartH;
    return { x, y, data: d, index, val };
  });

  const linePath = points.length > 0 ? getSplinePath(points) : "";
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x.toFixed(2)},${(paddingTop + chartH).toFixed(2)} L ${points[0].x.toFixed(2)},${(paddingTop + chartH).toFixed(2)} Z`
      : "";

  const yTicks = [
    { label: `${maxVal}`, value: maxVal },
    { label: `${Math.round((maxVal * 2) / 3)}`, value: Math.round((maxVal * 2) / 3) },
    { label: `${Math.round(maxVal / 3)}`, value: Math.round(maxVal / 3) },
    { label: "0", value: 0 },
  ];

  // Pick up to 7 evenly spaced X-axis labels
  const step = Math.max(1, Math.floor(points.length / 6));
  const xLabels = points.filter((_, idx) => idx % step === 0 || idx === points.length - 1);

  const metricConfig = {
    activeUsers: {
      label: "Active Visitors",
      color: "#2563EB",
      icon: Users,
      gradientStart: "#2563EB",
    },
    pageViews: {
      label: "Page Views",
      color: "#10B981",
      icon: Eye,
      gradientStart: "#10B981",
    },
    sessions: {
      label: "Sessions",
      color: "#8B5CF6",
      icon: Activity,
      gradientStart: "#8B5CF6",
    },
  };

  const currentCfg = metricConfig[activeMetric];

  return (
    <div className="space-y-4">
      {/* Metric Selector Tabs & Overview Readout */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5 rounded-xl bg-slate-100/80 p-1 dark:bg-slate-800/80">
          {(["activeUsers", "pageViews", "sessions"] as MetricKey[]).map(metric => {
            const cfg = metricConfig[metric];
            const Icon = cfg.icon;
            const isSelected = activeMetric === metric;
            return (
              <button
                key={metric}
                onClick={() => setActiveMetric(metric)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-sm dark:bg-surface-secondary dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                }`}
              >
                <Icon className="h-3.5 w-3.5" style={{ color: isSelected ? cfg.color : undefined }} />
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        {/* Metric Readout Badges */}
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: currentCfg.color }} />
            <span className="font-bold text-slate-900 dark:text-white">
              {currentMetricTotal.toLocaleString()}
            </span>
            <span className="text-slate-500 dark:text-slate-400">Total</span>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100/70 dark:bg-slate-800/60 px-2 py-0.5 rounded-md">
            <TrendingUp className="h-3 w-3 text-emerald-500" />
            <span>Peak: <strong className="text-slate-800 dark:text-slate-200">{peakValue}</strong></span>
          </div>

          <div className="hidden sm:block text-[11px] text-slate-400">
            Avg: <strong className="text-slate-700 dark:text-slate-300">{avgValue}/day</strong>
          </div>
        </div>
      </div>

      {/* SVG Chart Viewport */}
      <div className="relative w-full select-none overflow-hidden pt-2">
        {isLoading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-xs dark:bg-slate-900/60 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-primary-blue">
              <Activity className="h-4 w-4 animate-spin text-blue-500" />
              <span>Updating GA4 timeseries...</span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full overflow-visible"
          preserveAspectRatio="xMidYMid meet"
          onMouseLeave={() => setHoveredIndex(null)}
        >
          <defs>
            {/* Rich area gradient */}
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentCfg.gradientStart} stopOpacity="0.38" />
              <stop offset="50%" stopColor={currentCfg.gradientStart} stopOpacity="0.12" />
              <stop offset="100%" stopColor={currentCfg.gradientStart} stopOpacity="0.00" />
            </linearGradient>

            {/* Glowing drop shadow filter */}
            <filter id={`glow-${gradientId}`} x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor={currentCfg.color} floodOpacity="0.45" />
            </filter>
          </defs>

          {/* Horizontal Grid Lines */}
          {yTicks.map(tick => {
            const y = paddingTop + chartH - (tick.value / maxVal) * chartH;
            return (
              <g key={tick.label}>
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-slate-400 text-[10px] font-medium dark:fill-slate-500 select-none"
                >
                  {tick.label}
                </text>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={paddingLeft + chartW}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200/80 dark:text-slate-800/80"
                  strokeWidth="1"
                  strokeDasharray={tick.value === 0 ? "none" : "3 4"}
                  opacity={tick.value === 0 ? 0.9 : 0.6}
                />
              </g>
            );
          })}

          {/* X-axis date labels */}
          {xLabels.map((p, idx) => (
            <text
              key={`${p.data.date}-${idx}`}
              x={p.x}
              y={height - 10}
              textAnchor="middle"
              className="fill-slate-400 text-[10px] font-medium dark:fill-slate-500 select-none"
            >
              {p.data.label}
            </text>
          ))}

          {/* Area fill */}
          <motion.path
            d={areaPath}
            fill={`url(#${gradientId})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />

          {/* Glowing Line path */}
          <motion.path
            d={linePath}
            fill="none"
            stroke={currentCfg.color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`url(#glow-${gradientId})`}
            initial={{ pathLength: 0, opacity: 0.3 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />

          {/* Data Points */}
          {points.map((p, idx) => {
            const isHovered = hoveredIndex === p.index;
            const hasActivity = p.val > 0;
            const isLastPoint = idx === points.length - 1;

            return (
              <g key={`${p.data.date}-${idx}`} className="cursor-pointer">
                {/* Pulsing beacon on the latest active point */}
                {isLastPoint && hasActivity && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="8"
                    fill={currentCfg.color}
                    opacity="0.35"
                    className="animate-ping"
                  />
                )}

                {/* Hover halo */}
                {isHovered && (
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="9"
                    fill={currentCfg.color}
                    opacity="0.3"
                  />
                )}

                {/* Point circle */}
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isHovered ? "5.5" : hasActivity ? "4" : "2.5"}
                  fill={currentCfg.color}
                  stroke="currentColor"
                  strokeWidth={isHovered ? "2.5" : "1.5"}
                  className="text-white dark:text-slate-900 transition-all duration-150"
                />
              </g>
            );
          })}

          {/* Invisible vertical hover capture bands */}
          {points.map((p, idx) => {
            const bandWidth = chartW / Math.max(points.length, 1);
            return (
              <rect
                key={`band-${p.data.date}-${idx}`}
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

          {/* Active hover crosshair vertical guide */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingTop}
              x2={points[hoveredIndex].x}
              y2={paddingTop + chartH}
              stroke={currentCfg.color}
              strokeWidth="1.5"
              strokeDasharray="3 3"
              opacity="0.65"
            />
          )}
        </svg>

        {/* Floating Glassmorphism Tooltip */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div
            className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-full rounded-xl bg-slate-900/95 dark:bg-slate-800/95 border border-slate-700/80 px-3.5 py-2.5 text-xs font-semibold text-white shadow-xl backdrop-blur-md transition-all pointer-events-none"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${Math.max(12, (points[hoveredIndex].y / height) * 100 - 8)}%`,
            }}
          >
            <div className="text-[11px] font-bold text-slate-400 border-b border-slate-700/60 pb-1 mb-1.5 flex items-center justify-between gap-4">
              <span>{points[hoveredIndex].data.label}</span>
              <span className="font-mono text-[10px] text-slate-400 font-normal">
                {points[hoveredIndex].data.date}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-400">Visitors: </span>
                <span className="text-white font-black">{points[hoveredIndex].data.activeUsers}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Views: </span>
                <span className="text-emerald-400 font-black">{points[hoveredIndex].data.pageViews}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400">Sessions: </span>
                <span className="text-purple-400 font-black">{points[hoveredIndex].data.sessions}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
