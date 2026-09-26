"use client";

import React from "react";
import type {
  TopPageItem,
  TrafficSourceItem,
  DeviceItem,
  GeographyItem,
  EventItem,
} from "@/lib/analytics/types";
import {
  FileText,
  Share2,
  Smartphone,
  Monitor,
  Tablet,
  Globe2,
  Zap,
  CheckCircle2,
} from "lucide-react";

interface TrafficBreakdownProps {
  topPages: TopPageItem[];
  trafficSources: TrafficSourceItem[];
  devices: DeviceItem[];
  geography: GeographyItem[];
  customEvents: EventItem[];
}

export function TrafficBreakdown({
  topPages,
  trafficSources,
  devices,
  geography,
  customEvents,
}: TrafficBreakdownProps) {
  const getDeviceIcon = (device: string) => {
    switch (device.toLowerCase()) {
      case "mobile":
        return <Smartphone className="h-4 w-4 text-emerald-500" />;
      case "tablet":
        return <Tablet className="h-4 w-4 text-purple-500" />;
      default:
        return <Monitor className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      {/* Top Pages — 7 cols */}
      <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none lg:col-span-7">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-primary-blue dark:bg-blue-950/60 dark:text-blue-400">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Top Pages & Content</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Most viewed URLs on JKS Learning</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-400">{topPages.length} routes</span>
        </div>

        {topPages.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No page views recorded for this time range yet.</div>
        ) : (
          <div className="mt-4 divide-y divide-slate-100 dark:divide-slate-800">
            {topPages.map((page, idx) => (
              <div key={page.path + idx} className="flex items-center justify-between py-2.5 text-xs">
                <div className="flex items-center gap-2.5 min-w-0 pr-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-slate-100 font-mono text-[10px] font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    {idx + 1}
                  </span>
                  <div className="truncate">
                    <p className="font-mono text-[11px] font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {page.path}
                    </p>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{page.title}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0 text-right">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white">{page.pageViews}</span>
                    <span className="ml-1 text-[10px] text-slate-400">views</span>
                  </div>
                  <div className="hidden sm:block">
                    <span className="font-medium text-slate-600 dark:text-slate-400">{page.activeUsers}</span>
                    <span className="ml-1 text-[10px] text-slate-400">users</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Traffic Sources — 5 cols */}
      <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none lg:col-span-5">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
              <Share2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Traffic Acquisition</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Visitor channels & referrers</p>
            </div>
          </div>
        </div>

        {trafficSources.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No acquisition sources recorded yet.</div>
        ) : (
          <div className="mt-4 space-y-3.5">
            {trafficSources.map((item, idx) => (
              <div key={item.source + item.medium + idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {item.source} <span className="font-normal text-slate-400">/ {item.medium}</span>
                  </span>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {item.sessions} sessions ({item.percentage}%)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-emerald-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Devices Breakdown — 4 cols */}
      <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none lg:col-span-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
            <Monitor className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Devices</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Platforms used by visitors</p>
          </div>
        </div>

        {devices.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No device data available yet.</div>
        ) : (
          <div className="mt-4 space-y-3">
            {devices.map((item, idx) => (
              <div key={item.device + idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 capitalize font-semibold text-slate-800 dark:text-slate-200">
                    {getDeviceIcon(item.device)}
                    <span>{item.device}</span>
                  </div>
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    {item.percentage}% ({item.activeUsers} users)
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{ width: `${Math.min(100, item.percentage)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Geography — 4 cols */}
      <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none lg:col-span-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
            <Globe2 className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Geography</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">Top visitor countries</p>
          </div>
        </div>

        {geography.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No country data available yet.</div>
        ) : (
          <div className="mt-4 space-y-2.5">
            {geography.map((item, idx) => (
              <div key={item.country + idx} className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200">{item.country}</span>
                <span className="font-medium text-slate-500 dark:text-slate-400">
                  {item.activeUsers} users ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* JKS Custom Business Events — 4 cols */}
      <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none lg:col-span-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-3 dark:border-slate-800">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Zap className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Custom Business Events</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">JKS application interactions</p>
          </div>
        </div>

        {customEvents.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">No events captured in this window yet.</div>
        ) : (
          <div className="mt-4 space-y-2 max-h-60 overflow-y-auto pr-1">
            {customEvents.map((evt, idx) => (
              <div
                key={evt.eventName + idx}
                className="flex items-center justify-between rounded-lg bg-slate-50/80 px-2.5 py-1.5 text-xs dark:bg-slate-800/60"
              >
                <div className="flex items-center gap-1.5 truncate pr-2">
                  {evt.isJksCustom && <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />}
                  <span className="font-mono text-[11px] text-slate-800 dark:text-slate-200 truncate">
                    {evt.eventName}
                  </span>
                </div>
                <div className="shrink-0 text-right">
                  <span className="font-bold text-slate-900 dark:text-white">{evt.eventCount}</span>
                  <span className="text-[10px] text-slate-400 ml-1">hits</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
