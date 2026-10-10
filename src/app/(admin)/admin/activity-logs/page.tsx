"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardCheck,
  FileText,
  BrainCircuit,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  Eye,
  X,
  Shield,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import { apiFetch } from "@/lib/api/base-url";

interface ActivityLogItem {
  id: string;
  actorId: string;
  actorRole?: string;
  actorName?: string;
  actorEmail?: string;
  action: string;
  entityType: string;
  entityId?: string;
  entityName?: string;
  description: string;
  courseId?: string;
  courseName?: string;
  batchTiming?: string;
  studentId?: string;
  studentName?: string;
  metadata?: Record<string, any>;
  before?: Record<string, any>;
  after?: Record<string, any>;
  timestamp: string;
}

type CategoryFilter =
  | "ALL"
  | "STUDENTS"
  | "TUTORS"
  | "COURSES"
  | "BATCHES"
  | "ASSIGNMENTS"
  | "ENROLLMENTS"
  | "RESUME"
  | "INTERVIEW";

export default function AdminActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [category, setCategory] = useState<CategoryFilter>("ALL");
  const [search, setSearch] = useState("");
  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null);

  const fetchLogs = useCallback(
    async (pageToFetch = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page: String(pageToFetch),
          limit: "25",
        });

        if (search.trim()) {
          params.set("search", search.trim());
        }

        if (category === "STUDENTS") params.set("role", "STUDENT");
        else if (category === "TUTORS") params.set("role", "INSTRUCTOR");
        else if (category === "COURSES") params.set("entityType", "COURSE");
        else if (category === "ASSIGNMENTS") params.set("entityType", "ASSIGNMENT");
        else if (category === "RESUME") params.set("entityType", "RESUME");
        else if (category === "INTERVIEW") params.set("entityType", "AI_INTERVIEW");
        else if (category === "ENROLLMENTS") params.set("action", "COURSE_ENROLLED");

        const res = await apiFetch(`/activity-logs?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setLogs(data.items || []);
          setTotal(data.total || 0);
          setPage(data.page || 1);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        console.error("Failed to fetch activity logs:", err);
      } finally {
        setLoading(false);
      }
    },
    [category, search]
  );

  useEffect(() => {
    fetchLogs(1);
  }, [fetchLogs]);

  const formatRelativeTime = (isoDate: string) => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));
      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return "Yesterday";
      if (diffDays < 7) return `${diffDays}d ago`;
      return new Date(isoDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Recently";
    }
  };

  const getActionBadgeColor = (action: string) => {
    const upper = action.toUpperCase();
    if (upper.includes("ENROLL") || upper.includes("SIGNUP") || upper.includes("REGISTER")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800";
    }
    if (upper.includes("SUBMIT") || upper.includes("COMPLETED")) {
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800";
    }
    if (upper.includes("REVIEW") || upper.includes("GRADE")) {
      return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800";
    }
    if (upper.includes("RESUME") || upper.includes("INTERVIEW")) {
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800";
    }
    return "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700";
  };

  return (
    <>
      <DashboardTopbar
        title="Activity log"
        subtitle=""
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Filter Tabs */}
        <Reveal>
          <div className="flex flex-col gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
                {[
                  { id: "ALL", label: "All Activity", icon: Activity },
                  { id: "STUDENTS", label: "Students", icon: Users },
                  { id: "TUTORS", label: "Tutors", icon: GraduationCap },
                  { id: "ENROLLMENTS", label: "Enrollments", icon: BookOpen },
                  { id: "ASSIGNMENTS", label: "Assignments", icon: ClipboardCheck },
                  { id: "COURSES", label: "Courses", icon: BookOpen },
                  { id: "RESUME", label: "Resume Maker", icon: FileText },
                  { id: "INTERVIEW", label: "AI Interviews", icon: BrainCircuit },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = category === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setCategory(tab.id as CategoryFilter)}
                      className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                        isActive
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => fetchLogs(page)}
                disabled={loading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin text-blue-600" : ""}`} />
                <span>Refresh</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchLogs(1)}
                placeholder="Search user, action, course or description..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
          </div>
        </Reveal>

        {/* Logs Table / Cards */}
        <Reveal>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated shadow-xs overflow-hidden">
            {loading && logs.length === 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5">Actor / User</th>
                      <th className="px-4 py-3.5">Action</th>
                      <th className="px-4 py-3.5">Event Details</th>
                      <th className="px-4 py-3.5">Course / Batch</th>
                      <th className="px-4 py-3.5">Time</th>
                      <th className="px-4 py-3.5 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-800" />
                            <div className="space-y-1">
                              <div className="h-3 w-28 rounded bg-slate-200 dark:bg-slate-800" />
                              <div className="h-2.5 w-36 rounded bg-slate-100 dark:bg-slate-800/60" />
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="h-5 w-24 rounded-full bg-slate-200 dark:bg-slate-800" />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="h-3.5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
                        </td>
                        <td className="px-4 py-4">
                          <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="h-3 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-block h-6 w-14 rounded-md bg-slate-200 dark:bg-slate-800" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : logs.length === 0 ? (
              <div className="p-12 text-center">
                <Shield className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">No activity logs found</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  No events match the selected filter. As users, tutors, and students interact with the platform, records appear here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50/80 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-4 py-3.5">Actor / User</th>
                      <th className="px-4 py-3.5">Action</th>
                      <th className="px-4 py-3.5">Event Details</th>
                      <th className="px-4 py-3.5">Course / Batch</th>
                      <th className="px-4 py-3.5">Time</th>
                      <th className="px-4 py-3.5 text-right">Inspect</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/70">
                    {logs.map((log) => {
                      const roleBadgeColor =
                        log.actorRole === "ADMIN"
                          ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400"
                          : log.actorRole === "INSTRUCTOR"
                          ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-400"
                          : "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400";

                      return (
                        <tr
                          key={log.id}
                          className="hover:bg-slate-100/70 dark:hover:bg-white/[0.04] transition-all duration-200 ease-out"
                        >
                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-tr from-slate-600 to-slate-800 text-white font-bold text-[10px]">
                                {(log.actorName || log.actorEmail || "U").slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <div className="font-bold text-slate-900 dark:text-white">
                                  {log.actorName || "Unknown User"}
                                </div>
                                <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                                  <span>{log.actorEmail || log.actorId}</span>
                                  <span className={`px-1.5 py-0.2 rounded-md font-bold text-[9px] uppercase ${roleBadgeColor}`}>
                                    {log.actorRole || "USER"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            <span
                              className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold border ${getActionBadgeColor(
                                log.action
                              )}`}
                            >
                              {log.action.replace(/_/g, " ")}
                            </span>
                          </td>

                          <td className="px-4 py-3.5 max-w-xs">
                            <p className="text-slate-800 dark:text-slate-200 font-medium line-clamp-1">
                              {log.description}
                            </p>
                            {log.entityName && (
                              <span className="text-[11px] text-slate-400 block line-clamp-1">
                                Entity: {log.entityName}
                              </span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap">
                            {log.courseName ? (
                              <div className="text-slate-700 dark:text-slate-300 font-medium">
                                {log.courseName}
                                {log.batchTiming && (
                                  <span className="block text-[10px] text-slate-400">
                                    {log.batchTiming}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-400">—</span>
                            )}
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap text-slate-500 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatRelativeTime(log.timestamp)}</span>
                            </div>
                          </td>

                          <td className="px-4 py-3.5 whitespace-nowrap text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedLog(log)}
                              className="rounded-lg p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                              title="Inspect Event Payload"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 px-4 py-3 bg-slate-50/50 dark:bg-slate-900/40">
                <span className="text-xs text-slate-500">
                  Showing Page <strong className="text-slate-800 dark:text-white">{page}</strong> of{" "}
                  <strong>{totalPages}</strong> ({total} total entries)
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={page <= 1 || loading}
                    onClick={() => fetchLogs(page - 1)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    <span>Previous</span>
                  </button>
                  <button
                    type="button"
                    disabled={page >= totalPages || loading}
                    onClick={() => fetchLogs(page + 1)}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </Reveal>
      </div>

      {/* Forensic Audit Inspector Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in-50">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-600" />
                  Audit Event Inspector
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  ID: {selectedLog.id}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Actor</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {selectedLog.actorName || "System"} ({selectedLog.actorRole || "N/A"})
                  </span>
                  <span className="text-slate-400 block text-[11px]">{selectedLog.actorEmail}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Action</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{selectedLog.action}</span>
                  <span className="text-slate-400 block text-[11px]">
                    Entity: {selectedLog.entityType} ({selectedLog.entityId || "N/A"})
                  </span>
                </div>
              </div>

              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                  Description
                </span>
                <p className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  {selectedLog.description}
                </p>
              </div>

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold mb-1">
                    Metadata Payload
                  </span>
                  <pre className="p-3 rounded-lg bg-slate-900 text-slate-200 font-mono text-[11px] overflow-x-auto max-h-48">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              <div className="text-[11px] text-slate-400 pt-2 flex items-center justify-between">
                <span>Recorded: {new Date(selectedLog.timestamp).toLocaleString()}</span>
                <span>Actor ID: {selectedLog.actorId}</span>
              </div>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-3 text-right">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="rounded-xl bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-1.5 text-xs font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
