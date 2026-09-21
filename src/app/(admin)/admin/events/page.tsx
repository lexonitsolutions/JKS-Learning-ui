"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Calendar,
  Plus,
  Search,
  Filter,
  Users,
  ExternalLink,
  Edit,
  Trash2,
  Download,
  Video,
  MapPin,
  Sparkles,
  Clock,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  fetchAdminEvents,
  deleteAdminEvent,
  getExportEventRegistrationsUrl,
  type EventItem,
  type EventStatus,
} from "@/lib/data/events-api";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const data = await fetchAdminEvents({
        status: statusFilter,
        search: searchQuery,
      });
      setEvents(data);
    } catch (err: any) {
      setErrorMessage("Failed to load events. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [statusFilter, searchQuery]);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  const handleDelete = async (event: EventItem) => {
    if (!window.confirm(`Are you sure you want to delete the event "${event.title}"? All attendee registrations will also be removed.`)) {
      return;
    }

    setDeletingId(event.id);
    const res = await deleteAdminEvent(event.id);
    setDeletingId(null);

    if (res.success) {
      setEvents((prev) => prev.filter((e) => e.id !== event.id));
      showToast(`Event "${event.title}" deleted successfully.`);
    } else {
      showToast(res.error || "Failed to delete event.");
    }
  };

  // Metric summaries
  const totalEvents = events.length;
  const publishedEvents = events.filter((e) => e.status === "PUBLISHED").length;
  const totalRegistrations = events.reduce((acc, e) => acc + (e.registeredCount || 0), 0);
  const upcomingEvents = events.filter((e) => new Date(e.startDate) > new Date()).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-xs font-semibold text-white shadow-xl border border-slate-700 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
              Event Management
            </h1>
            <span className="rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-bold text-[#1E5EFF] dark:text-blue-400 border border-blue-500/20">
              Live Masterclasses
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Create, schedule, publish events, track student registrations, and export attendance rosters.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/events"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-4 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
            <span>Public Events Directory</span>
          </Link>

          <Link
            href="/admin/events/new"
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] hover:bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" />
            <span>Create New Event</span>
          </Link>
        </div>
      </div>

      {/* KPI Metric Summary Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Events</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#1E5EFF]">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalEvents}</div>
          <p className="mt-0.5 text-[11px] text-slate-400">Scheduled in database</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Published Live</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{publishedEvents}</div>
          <p className="mt-0.5 text-[11px] text-slate-400">Visible on public website</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Registrations</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{totalRegistrations}</div>
          <p className="mt-0.5 text-[11px] text-slate-400">Students registered</p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Upcoming</span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
              <Clock className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{upcomingEvents}</div>
          <p className="mt-0.5 text-[11px] text-slate-400">Future start dates</p>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-3 shadow-xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          {["ALL", "PUBLISHED", "DRAFT", "COMPLETED", "CANCELLED"].map((tab) => {
            const active = statusFilter === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  active
                    ? "bg-[#1E5EFF] text-white shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover"
                }`}
              >
                {tab === "ALL" ? "All Events" : tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search events or speakers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Events Roster / Cards */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1E5EFF] border-t-transparent" />
          <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">Loading events...</p>
        </div>
      ) : errorMessage ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-rose-300 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 py-12 text-center">
          <AlertCircle className="h-8 w-8 text-rose-500" />
          <p className="mt-2 text-xs font-bold text-rose-600 dark:text-rose-400">{errorMessage}</p>
          <button
            type="button"
            onClick={loadEvents}
            className="mt-3 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-700 cursor-pointer"
          >
            Retry
          </button>
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-[#1E5EFF]">
            <Calendar className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-sm font-bold text-slate-900 dark:text-white">No events found</h3>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
            {searchQuery || statusFilter !== "ALL"
              ? "No events matched your search or status filter. Try resetting filters."
              : "Get started by creating your first tech masterclass, webinar, or offline workshop."}
          </p>
          <Link
            href="/admin/events/new"
            className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-600"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Create Event Now</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {events.map((event) => {
            const startDate = new Date(event.startDate);
            const dateStr = startDate.toLocaleDateString("en-IN", {
              weekday: "short",
              day: "numeric",
              month: "short",
              year: "numeric",
            });
            const timeStr = startDate.toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            });

            const capacityDisplay = event.maxCapacity
              ? `${event.registeredCount || 0} / ${event.maxCapacity}`
              : `${event.registeredCount || 0} registered`;

            const percentFilled = event.maxCapacity
              ? Math.min(100, Math.round(((event.registeredCount || 0) / event.maxCapacity) * 100))
              : 0;

            return (
              <div
                key={event.id}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 shadow-xs hover:border-blue-500/40 dark:hover:border-blue-500/40 hover:shadow-md transition-all"
              >
                <div>
                  {/* Top Badges & Status */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${
                          event.status === "PUBLISHED"
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                            : event.status === "DRAFT"
                            ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                            : event.status === "COMPLETED"
                            ? "bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/40"
                            : "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                        }`}
                      >
                        {event.status}
                      </span>

                      <span className="flex items-center gap-1 rounded-full bg-blue-50 dark:bg-blue-950/60 px-2.5 py-0.5 text-[11px] font-bold text-[#1E5EFF] dark:text-blue-400 border border-blue-200 dark:border-blue-800/40">
                        {event.mode === "ONLINE" ? (
                          <Video className="h-3 w-3" />
                        ) : (
                          <MapPin className="h-3 w-3" />
                        )}
                        {event.mode}
                      </span>
                    </div>

                    <div className="text-[11px] font-medium text-slate-400">
                      Slug: <span className="font-mono text-slate-600 dark:text-slate-300">/{event.slug}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="mt-3">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-[#1E5EFF] transition-colors">
                      {event.title}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>

                  {/* Event Schedule & Speaker Meta */}
                  <div className="mt-4 grid grid-cols-2 gap-3 border-y border-slate-100 dark:border-slate-800/80 py-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Time</span>
                      <div className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-blue-500" />
                        <span>{dateStr}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 pl-4">{timeStr} IST</div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Speaker</span>
                      <div className="mt-0.5 font-semibold text-slate-800 dark:text-slate-200">
                        {event.speakerName || "JKS Faculty"}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate">
                        {event.speakerRole || "Industry Mentor"}
                      </div>
                    </div>
                  </div>

                  {/* Registrations Progress Bar */}
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                        <Users className="h-3.5 w-3.5 text-blue-500" />
                        <span>Registrations: {capacityDisplay}</span>
                      </span>
                      {event.maxCapacity && (
                        <span className="text-[11px] text-slate-400">{percentFilled}% filled</span>
                      )}
                    </div>
                    {event.maxCapacity && (
                      <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            percentFilled >= 100
                              ? "bg-rose-500"
                              : percentFilled >= 75
                              ? "bg-amber-500"
                              : "bg-[#1E5EFF]"
                          }`}
                          style={{ width: `${percentFilled}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* View Registrations Roster */}
                    <Link
                      href={`/admin/events/${event.id}/registrations`}
                      className="inline-flex items-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/40 px-3 py-1.5 text-xs font-bold text-[#1E5EFF] dark:text-blue-400 hover:bg-blue-100 transition-colors"
                    >
                      <Users className="h-3.5 w-3.5" />
                      <span>Registrations ({event.registeredCount || 0})</span>
                    </Link>

                    {/* Export DOCX */}
                    <a
                      href={getExportEventRegistrationsUrl(event.id)}
                      download
                      className="inline-flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
                      title="Download attendee list in Microsoft Word (.docx)"
                    >
                      <Download className="h-3.5 w-3.5 text-slate-500" />
                      <span>.DOCX</span>
                    </a>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* View Public Page */}
                    {event.status === "PUBLISHED" && (
                      <Link
                        href={`/events/${event.slug}`}
                        target="_blank"
                        className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    )}

                    {/* Edit Event */}
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-[#1E5EFF] transition-colors"
                      title="Edit Event"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>

                    {/* Delete Event */}
                    <button
                      type="button"
                      onClick={() => handleDelete(event)}
                      disabled={deletingId === event.id}
                      className="rounded-lg p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                      title="Delete Event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
