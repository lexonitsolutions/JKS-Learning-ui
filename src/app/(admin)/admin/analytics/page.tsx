"use client";

import React, { useState, useEffect, useCallback, useId } from "react";
import {
  Users,
  Eye,
  Activity,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  AlertTriangle,
  Radio,
  SlidersHorizontal,
  Compass,
  Zap,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { apiFetch } from "@/lib/api/base-url";
import type { GA4DashboardPayload, MetricDelta } from "@/lib/analytics/types";
import { WebsiteTrafficChart } from "@/components/admin/analytics/website-traffic-chart";
import { RealtimeCard } from "@/components/admin/analytics/realtime-card";
import { TrafficBreakdown } from "@/components/admin/analytics/traffic-breakdown";

type DateRangeOption = "today" | "7d" | "30d" | "90d";

export default function AdminAnalyticsPage() {
  const [selectedRange, setSelectedRange] = useState<DateRangeOption>("7d");
  const [analyticsData, setAnalyticsData] = useState<GA4DashboardPayload | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchAnalytics = useCallback(async (range: DateRangeOption, bypassCache = false) => {
    try {
      if (bypassCache) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setErrorMsg(null);

      const params = new URLSearchParams({
        range,
        ...(bypassCache ? { refresh: "true" } : {}),
      });

      const res = await apiFetch(`/analytics/admin/website?${params.toString()}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.message || `Analytics query failed with status ${res.status}`);
      }

      const json: GA4DashboardPayload = await res.json();
      setAnalyticsData(json);
    } catch (err: any) {
      console.error("Failed to load GA4 website analytics:", err);
      setErrorMsg(err.message || "Failed to communicate with analytics backend");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Poll realtime metrics every 25 seconds
  const pollRealtime = useCallback(async () => {
    try {
      const res = await apiFetch("/analytics/admin/website/realtime", { cache: "no-store" });
      if (res.ok) {
        const realtimeJson = await res.json();
        setAnalyticsData(prev => {
          if (!prev) return null;
          return {
            ...prev,
            realtime: realtimeJson,
          };
        });
      }
    } catch (e) {
      // Background realtime poll silent fail
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(selectedRange);
  }, [selectedRange, fetchAnalytics]);

  useEffect(() => {
    const timer = setInterval(() => {
      pollRealtime();
    }, 25000);
    return () => clearInterval(timer);
  }, [pollRealtime]);

  const handleRangeChange = (range: DateRangeOption) => {
    setSelectedRange(range);
  };

  const handleManualRefresh = () => {
    fetchAnalytics(selectedRange, true);
  };

  const formatDuration = (seconds: number): string => {
    if (!seconds || seconds <= 0) return "0s";
    const mins = Math.floor(seconds / 60);
    const remSecs = Math.floor(seconds % 60);
    if (mins === 0) return `${remSecs}s`;
    return `${mins}m ${remSecs}s`;
  };

  const renderDelta = (delta?: MetricDelta, isPercentage = false) => {
    if (!delta || delta.changePercent === 0) {
      return (
        <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
          No prior change
        </span>
      );
    }

    const isPositive = delta.changePercent > 0;
    return (
      <div
        className={`flex items-center gap-0.5 text-[10px] sm:text-xs font-semibold ${
          isPositive
            ? "text-emerald-600 dark:text-emerald-400"
            : "text-rose-600 dark:text-rose-400"
        }`}
      >
        {isPositive ? (
          <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        ) : (
          <ArrowDownRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
        )}
        <span>
          {isPositive ? "+" : ""}
          {delta.changePercent}% vs prev
        </span>
      </div>
    );
  };

  // If credentials are completely unconfigured
  if (!isLoading && analyticsData && !analyticsData.configured) {
    return (
      <>
        <DashboardTopbar
          title="Website Analytics"
          subtitle="Real-time website traffic and visitor engagement powered by Google Analytics 4."
          userInitials="AD"
        />
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="rounded-[24px] border border-amber-200 bg-amber-50/80 p-8 text-amber-900 shadow-sm dark:border-amber-900/60 dark:bg-amber-950/20 dark:text-amber-200">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              <h2 className="text-lg font-bold">Google Analytics 4 Data API Unconfigured</h2>
            </div>
            <p className="mt-3 text-sm leading-relaxed">
              The backend requires Google Analytics Data API credentials to query live metrics.
              Please ensure the following environment variables are added to your backend <code className="rounded bg-amber-100 px-1.5 py-0.5 font-mono text-xs dark:bg-amber-900/50">.env</code> or Railway production environment:
            </p>
            <ul className="mt-4 space-y-2 font-mono text-xs">
              <li className="rounded-lg bg-amber-100/70 p-2.5 dark:bg-amber-900/40">GA_PROPERTY_ID="123456789"</li>
              <li className="rounded-lg bg-amber-100/70 p-2.5 dark:bg-amber-900/40">GOOGLE_CLIENT_EMAIL="service-account@project.iam.gserviceaccount.com"</li>
              <li className="rounded-lg bg-amber-100/70 p-2.5 dark:bg-amber-900/40">GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."</li>
            </ul>
          </div>
        </div>
      </>
    );
  }

  const overview = analyticsData?.overview;
  const liveUsers = analyticsData?.realtime?.activeUsersLast30Min ?? 0;

  return (
    <>
      <DashboardTopbar
        title="Website Analytics"
        subtitle="Real-time traffic, visitor paths, and marketing engagement from Google Analytics 4."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Controls Bar: Date Range Filter + Refresh + Live indicator */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl bg-white/80 p-1 shadow-xs border border-white/70 backdrop-blur-xl dark:border-slate-800 dark:bg-surface-secondary">
              {(
                [
                  { id: "today", label: "Today" },
                  { id: "7d", label: "Last 7 Days" },
                  { id: "30d", label: "Last 30 Days" },
                  { id: "90d", label: "Last 90 Days" },
                ] as const
              ).map(opt => (
                <button
                  key={opt.id}
                  onClick={() => handleRangeChange(opt.id)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
                    selectedRange === opt.id
                      ? "bg-primary-blue text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleManualRefresh}
              disabled={isRefreshing || isLoading}
              title="Refresh from GA4 API"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/70 bg-white/80 text-slate-600 shadow-xs hover:bg-slate-50 transition-all dark:border-slate-800 dark:bg-surface-secondary dark:text-slate-300 dark:hover:bg-slate-800"
            >
              <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin text-primary-blue" : ""}`} />
            </button>
          </div>

          {/* Realtime Live Visitor Indicator */}
          <div className="flex items-center gap-2.5 rounded-xl border border-emerald-200/80 bg-emerald-50/80 px-3.5 py-1.5 text-xs font-bold text-emerald-800 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-300 shadow-xs">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            <span>
              {liveUsers} Active {liveUsers === 1 ? "Visitor" : "Visitors"} in Last 30 Min
            </span>
          </div>
        </div>

        {/* GA4 Batching Informative Notice */}
        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 text-xs text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/30 dark:text-blue-200">
          <Radio className="h-4 w-4 shrink-0 text-primary-blue animate-pulse" />
          <p className="leading-relaxed">
            <strong className="font-semibold">GA4 Live Tracking Connected:</strong> Active visitors are logged in real-time. Google Analytics compiles historical daily timeseries every 24 hours.
          </p>
        </div>

        {/* Error notice if API call failed */}
        {errorMsg && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
            {errorMsg}
          </div>
        )}

        {/* Overview KPI Cards */}
        <Reveal variant="stagger" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Card 1: Active Visitors */}
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Active Visitors
                </span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {isLoading ? "..." : (overview?.activeUsers.value ?? 0).toLocaleString()}
              </div>
              <div className="mt-1">{renderDelta(overview?.activeUsers)}</div>
            </div>
          </TiltCard>

          {/* Card 2: Total Sessions */}
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Sessions
                </span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <Activity className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {isLoading ? "..." : (overview?.sessions.value ?? 0).toLocaleString()}
              </div>
              <div className="mt-1">{renderDelta(overview?.sessions)}</div>
            </div>
          </TiltCard>

          {/* Card 3: Page Views */}
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Page Views
                </span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {isLoading ? "..." : (overview?.pageViews.value ?? 0).toLocaleString()}
              </div>
              <div className="mt-1">{renderDelta(overview?.pageViews)}</div>
            </div>
          </TiltCard>

          {/* Card 4: Avg Duration & Bounce Rate */}
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-3.5 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
              <div className="flex items-center justify-between">
                <span className="text-[11px] sm:text-xs font-semibold text-slate-500 dark:text-slate-400 truncate">
                  Avg Duration
                </span>
                <div className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </div>
              </div>
              <div className="mt-2 text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
                {isLoading
                  ? "..."
                  : formatDuration(overview?.averageSessionDurationSeconds.value ?? 0)}
              </div>
              <div className="mt-1 text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
                Bounce rate: {overview?.bounceRate.value ?? 0}%
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* 2-Column Main Section: Spline Traffic Chart (7 cols) + Realtime Card (5 cols) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Timeseries Curve */}
          <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none lg:col-span-8">
            <div className="flex items-center justify-between pb-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Visitor Growth & Traffic Trends
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Continuous session activity across selected date range
                </p>
              </div>
            </div>

            <div className="mt-4">
              <WebsiteTrafficChart
                data={analyticsData?.timeseries || []}
                isLoading={isLoading}
              />
            </div>
          </div>

          {/* Realtime Live Beacon Card */}
          <div className="lg:col-span-4">
            <RealtimeCard
              data={analyticsData?.realtime}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* Detailed Breakdown: Top Pages, Acquisition Sources, Devices, Geography, Custom JKS Events */}
        <TrafficBreakdown
          topPages={analyticsData?.topPages || []}
          trafficSources={analyticsData?.trafficSources || []}
          devices={analyticsData?.devices || []}
          geography={analyticsData?.geography || []}
          customEvents={analyticsData?.customEvents || []}
        />
      </div>
    </>
  );
}
