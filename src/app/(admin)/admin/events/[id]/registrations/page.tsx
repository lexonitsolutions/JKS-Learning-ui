"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MapPin,
  Users,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  HelpCircle,
} from "lucide-react";
import {
  fetchAdminEventById,
  fetchAdminEventRegistrations,
  getExportEventRegistrationsUrl,
  type EventItem,
  type EventRegistrationItem,
} from "@/lib/data/events-api";

export default function EventRegistrationsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [registrations, setRegistrations] = useState<EventRegistrationItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const [ev, regData] = await Promise.all([
        fetchAdminEventById(eventId),
        fetchAdminEventRegistrations(eventId),
      ]);

      setEvent(ev);
      if (regData?.registrations) {
        setRegistrations(regData.registrations);
      }
      setIsLoading(false);
    }

    loadData();
  }, [eventId]);

  const filteredRegistrations = registrations.filter((r) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      r.fullName.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.mobile.toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading attendee registrations...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-10 w-10 text-rose-500" />
        <h2 className="mt-2 text-base font-bold text-slate-900 dark:text-white">Event not found</h2>
        <Link
          href="/admin/events"
          className="mt-4 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300"
        >
          Return to Events
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const dateStr = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeStr = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Back Button & Topbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/events"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 dark:text-white">
                Attendee Registrations
              </h1>
              <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs font-bold text-[#1E5EFF] border border-blue-500/20">
                {registrations.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {event.title}
            </p>
          </div>
        </div>

        {/* Action: Export to DOCX */}
        <a
          href={getExportEventRegistrationsUrl(event.id)}
          download
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] hover:bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" />
          <span>Export to Word (.docx)</span>
        </a>
      </div>

      {/* Event Meta Summary Card */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 shadow-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Date & Time</span>
            <div className="mt-1 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-blue-500" />
              <span>{dateStr}</span>
            </div>
            <div className="text-[11px] text-slate-500 pl-5">{timeStr} IST</div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Mode & Venue</span>
            <div className="mt-1 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              {event.mode === "ONLINE" ? (
                <Video className="h-3.5 w-3.5 text-blue-500" />
              ) : (
                <MapPin className="h-3.5 w-3.5 text-blue-500" />
              )}
              <span>{event.mode}</span>
            </div>
            <div className="text-[11px] text-slate-500 truncate pl-5">{event.venueOrLink}</div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Speaker</span>
            <div className="mt-1 font-bold text-slate-800 dark:text-slate-200">
              {event.speakerName || "JKS Faculty"}
            </div>
            <div className="text-[11px] text-slate-500">{event.speakerRole || "Guest Mentor"}</div>
          </div>

          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Seat Capacity</span>
            <div className="mt-1 font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-purple-500" />
              <span>
                {registrations.length}
                {event.maxCapacity ? ` / ${event.maxCapacity} Seats` : " (Unlimited)"}
              </span>
            </div>
            <div className="text-[11px] text-slate-500">
              {event.maxCapacity && event.maxCapacity > registrations.length
                ? `${event.maxCapacity - registrations.length} spots remaining`
                : event.maxCapacity
                ? "Full Capacity Reached"
                : "Open Registration"}
            </div>
          </div>
        </div>
      </div>

      {/* Registrants Table Section */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, email, or mobile..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          <div className="text-xs text-slate-400 font-medium">
            Showing {filteredRegistrations.length} of {registrations.length} attendees
          </div>
        </div>

        {/* Table */}
        {filteredRegistrations.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <Users className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">
              {searchQuery ? "No matching registrants found" : "No attendees registered yet"}
            </p>
            <p className="text-[11px] text-slate-400">
              {searchQuery
                ? "Try clearing your search query."
                : "When users register on the public events page, their details will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-surface-elevated text-slate-500 dark:text-slate-400 uppercase text-[10px] font-black tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4 w-12 text-center">#</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Email Address</th>
                  <th className="py-3 px-4">Mobile Number</th>
                  <th className="py-3 px-4">Registration Date</th>
                  <th className="py-3 px-4 text-center">Email Notice</th>
                  <th className="py-3 px-4">Notes / Questions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredRegistrations.map((reg, index) => {
                  return (
                    <tr
                      key={reg.id}
                      className="hover:bg-slate-50/50 dark:hover:bg-surface-hover/50 transition-colors"
                    >
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400">
                        {index + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {reg.fullName}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 text-slate-600 dark:text-slate-300">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{reg.email}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1 font-mono text-slate-600 dark:text-slate-300">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{reg.mobile}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-700 dark:text-slate-300">
                          {new Date(reg.registeredAt).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {new Date(reg.registeredAt).toLocaleTimeString("en-IN", {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-black ${
                            reg.emailStatus === "SENT"
                              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40"
                              : reg.emailStatus === "FAILED"
                              ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40"
                              : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {reg.emailStatus === "SENT" && <CheckCircle2 className="h-3 w-3" />}
                          {reg.emailStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        {reg.notes ? (
                          <div className="max-w-xs text-[11px] text-slate-600 dark:text-slate-300 italic truncate" title={reg.notes}>
                            "{reg.notes}"
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
