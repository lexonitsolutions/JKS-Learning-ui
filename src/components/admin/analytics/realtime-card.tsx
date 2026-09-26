"use client";

import React from "react";
import type { RealtimeData } from "@/lib/analytics/types";
import { Radio, Globe, Compass, FileText } from "lucide-react";

interface RealtimeCardProps {
  data?: RealtimeData;
  isLoading?: boolean;
}

export function RealtimeCard({ data, isLoading }: RealtimeCardProps) {
  const activeCount = data?.activeUsersLast30Min ?? 0;
  const topPages = data?.topPages ?? [];
  const topCountries = data?.topCountries ?? [];
  const topCities = data?.topCities ?? [];

  return (
    <div className="rounded-[20px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
      {/* Header with Live Beacon */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="relative flex h-3 w-3 items-center justify-center">
            {activeCount > 0 ? (
              <>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </>
            ) : (
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-slate-400" />
            )}
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Live Realtime Visitors
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Users active in last 30 minutes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
          <Radio className="h-3 w-3 animate-pulse" />
          <span>LIVE</span>
        </div>
      </div>

      {/* Main Counter */}
      <div className="my-5 flex items-baseline gap-3">
        <span className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          {activeCount}
        </span>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
          active {activeCount === 1 ? "visitor" : "visitors"} right now
        </span>
      </div>

      {/* Breakdowns */}
      <div className="space-y-4 pt-1">
        {/* Top Active Pages */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <FileText className="h-3.5 w-3.5 text-blue-500" />
            <span>Active Pages</span>
          </div>

          {topPages.length === 0 ? (
            <p className="mt-2 text-[11px] text-slate-400 italic">No active page views right now</p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {topPages.map(page => (
                <div
                  key={page.path}
                  className="flex items-center justify-between rounded-lg bg-slate-50 px-2.5 py-1.5 text-xs dark:bg-slate-800/60"
                >
                  <span className="font-mono text-[11px] text-slate-700 dark:text-slate-300 truncate max-w-[200px]">
                    {page.path}
                  </span>
                  <span className="rounded-md bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                    {page.activeUsers}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Cities & Countries */}
        <div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
            <Compass className="h-3.5 w-3.5 text-emerald-500" />
            <span>Locations</span>
          </div>

          {topCities.length === 0 && topCountries.length === 0 ? (
            <p className="mt-2 text-[11px] text-slate-400 italic">No active locations right now</p>
          ) : (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {topCities.map(city => (
                <span
                  key={city.city}
                  className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <Globe className="h-3 w-3" />
                  <span>{city.city}</span>
                  <span className="font-bold">({city.activeUsers})</span>
                </span>
              ))}
              {topCountries
                .filter(c => !topCities.some(city => city.city === c.country))
                .map(country => (
                  <span
                    key={country.country}
                    className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                  >
                    <span>{country.country}</span>
                    <span className="font-bold">({country.activeUsers})</span>
                  </span>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
