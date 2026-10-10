"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  Phone,
  Mail,
  Bot,
  Globe,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  TrendingUp,
  UserCheck,
  ChevronDown,
  X,
  Plus,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import {
  fetchAdminLeads,
  updateLeadStatus,
  addLeadNote,
  type BackendLead,
} from "@/lib/data/leads-api";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.27 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.33C16.32 14.2 15.1 13.6 14.87 13.52C14.64 13.43 14.48 13.39 14.31 13.64C14.15 13.88 13.68 14.44 13.53 14.61C13.39 14.77 13.25 14.8 13 14.67C12.75 14.55 11.94 14.28 10.98 13.43C10.23 12.76 9.73 11.93 9.58 11.68C9.44 11.44 9.57 11.3 9.69 11.18C9.8 11.07 9.94 10.89 10.07 10.74C10.2 10.59 10.24 10.48 10.32 10.31C10.41 10.15 10.36 10.01 10.3 9.89C10.24 9.76 9.74 8.54 9.54 8.04C9.34 7.56 9.14 7.62 8.99 7.62C8.85 7.61 8.68 7.61 8.52 7.61C8.35 7.61 8.08 7.67 7.85 7.92C7.62 8.17 6.98 8.77 6.98 9.99C6.98 11.21 7.87 12.39 8 12.56C8.13 12.72 9.73 15.2 12.18 16.26C12.76 16.51 13.22 16.66 13.57 16.77C14.16 16.96 14.7 16.93 15.12 16.87C15.59 16.8 16.57 16.28 16.78 15.7C16.98 15.11 16.98 14.61 16.92 14.51C16.86 14.41 16.72 14.35 16.57 14.33Z" />
    </svg>
  );
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<BackendLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedLead, setSelectedLead] = useState<BackendLead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [isSubmittingNote, setIsSubmittingNote] = useState(false);
  const [statusUpdatingId, setStatusUpdatingId] = useState<string | null>(null);

  const loadLeads = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAdminLeads();
      setLeads(data);
    } catch (err) {
      console.error("Failed to load leads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const handleStatusChange = async (leadId: string, newStatus: BackendLead["status"]) => {
    setStatusUpdatingId(leadId);
    try {
      const updated = await updateLeadStatus(leadId, newStatus);
      if (updated) {
        setLeads((prev) =>
          prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
        );
        if (selectedLead && selectedLead.id === leadId) {
          setSelectedLead((prev) => (prev ? { ...prev, status: newStatus } : null));
        }
      }
    } finally {
      setStatusUpdatingId(null);
    }
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteText.trim()) return;

    setIsSubmittingNote(true);
    try {
      const note = await addLeadNote(selectedLead.id, newNoteText.trim());
      if (note) {
        const updatedNotes = [note, ...(selectedLead.notes || [])];
        setSelectedLead({ ...selectedLead, notes: updatedNotes });
        setLeads((prev) =>
          prev.map((l) =>
            l.id === selectedLead.id ? { ...l, notes: updatedNotes } : l
          )
        );
        setNewNoteText("");
      }
    } finally {
      setIsSubmittingNote(false);
    }
  };

  // Metrics
  const metrics = useMemo(() => {
    const total = leads.length;
    const newCount = leads.filter((l) => l.status === "NEW").length;
    const chatbotCount = leads.filter((l) => l.source === "CHATBOT").length;
    const enrolledCount = leads.filter((l) => l.status === "ENROLLED").length;
    return { total, newCount, chatbotCount, enrolledCount };
  }, [leads]);

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.phone.includes(searchTerm) ||
        (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        lead.interestedCourse.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSource =
        sourceFilter === "ALL" || lead.source === sourceFilter;

      const matchesStatus =
        statusFilter === "ALL" || lead.status === statusFilter;

      return matchesSearch && matchesSource && matchesStatus;
    });
  }, [leads, searchTerm, sourceFilter, statusFilter]);

  return (
    <>
      <DashboardTopbar
        title="Leads & Admissions CRM"
        subtitle="Enquiries from the chatbot and website forms."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards Banner */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/90 dark:bg-surface-secondary/90 p-4 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Inquiries</span>
              <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
              {loading ? "..." : metrics.total}
            </div>
            <span className="text-[11px] text-slate-400">All captured CRM leads</span>
          </div>

          <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 p-4 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-rose-700 dark:text-rose-400">New / Uncontacted</span>
              <AlertCircle className="h-4 w-4 text-rose-600 dark:text-rose-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-rose-700 dark:text-rose-400">
              {loading ? "..." : metrics.newCount}
            </div>
            <span className="text-[11px] text-rose-600/80 dark:text-rose-400/80">Pending counselor call</span>
          </div>

          <div className="rounded-2xl border border-cyan-200/80 dark:border-cyan-900/50 bg-cyan-50/40 dark:bg-cyan-950/20 p-4 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-400">AI Chatbot Leads</span>
              <Bot className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-cyan-700 dark:text-cyan-400">
              {loading ? "..." : metrics.chatbotCount}
            </div>
            <span className="text-[11px] text-cyan-600/80 dark:text-cyan-400/80">Captured via website bot</span>
          </div>

          <div className="rounded-2xl border border-emerald-200/80 dark:border-emerald-900/50 bg-emerald-50/40 dark:bg-emerald-950/20 p-4 shadow-xs backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Enrolled Students</span>
              <UserCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-black text-emerald-700 dark:text-emerald-400">
              {loading ? "..." : metrics.enrolledCount}
            </div>
            <span className="text-[11px] text-emerald-600/80 dark:text-emerald-400/80">Converted to paid cohorts</span>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-surface-secondary/80 p-3 shadow-xs">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, phone, email, or course..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-600"
            >
              <option value="ALL">All Sources</option>
              <option value="CHATBOT">🤖 AI Chatbot</option>
              <option value="WEBSITE">🌐 Website Form</option>
              <option value="META_ADS">📱 Meta Ads</option>
              <option value="GOOGLE_ADS">🔍 Google Ads</option>
              <option value="WALK_IN">🚶 Walk-In</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:border-blue-600"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">🔴 New (Uncontacted)</option>
              <option value="CONTACTED">🟡 Contacted</option>
              <option value="INTERESTED">🔵 Interested</option>
              <option value="ENROLLED">🟢 Enrolled</option>
              <option value="DROPPED">⚪ Dropped</option>
            </select>

            <button
              onClick={loadLeads}
              disabled={loading}
              title="Refresh Leads"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors shrink-0 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>

        {/* Leads Table Container */}
        <Reveal>
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-surface-elevated/75 font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 text-[10.5px]">
                  <tr>
                    <th className="py-3.5 pl-4 pr-2">Student &amp; Contact</th>
                    <th className="px-3 py-3.5">Interested Course</th>
                    <th className="px-3 py-3.5">Source</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Date &amp; Time</th>
                    <th className="py-3.5 pl-3 pr-4 text-right">Quick Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <RefreshCw className="mx-auto h-6 w-6 animate-spin text-blue-600 mb-2" />
                        Loading incoming leads &amp; CRM pipeline...
                      </td>
                    </tr>
                  ) : filteredLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400">
                        <MessageSquare className="mx-auto h-8 w-8 text-slate-300 dark:text-slate-600 mb-2" />
                        No inquiries found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredLeads.map((lead) => {
                      const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                      return (
                        <tr
                          key={lead.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-surface-elevated/40 transition-colors cursor-pointer"
                          onClick={() => setSelectedLead(lead)}
                        >
                          {/* Student & Contact */}
                          <td className="py-3.5 pl-4 pr-2">
                            <div className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                              {lead.name}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                              <span>{lead.phone}</span>
                              {lead.email && (
                                <>
                                  <span>·</span>
                                  <span className="font-sans truncate max-w-[140px]">{lead.email}</span>
                                </>
                              )}
                            </div>
                          </td>

                          {/* Interested Course */}
                          <td className="px-3 py-3.5">
                            <span className="inline-flex items-center rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/40 px-2.5 py-1 text-[11px] font-bold text-blue-700 dark:text-blue-300 max-w-[220px] truncate">
                              {lead.interestedCourse}
                            </span>
                          </td>

                          {/* Source */}
                          <td className="px-3 py-3.5">
                            {lead.source === "CHATBOT" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 dark:bg-cyan-950/50 border border-cyan-200 dark:border-cyan-800 px-2 py-0.5 text-[10.5px] font-bold text-cyan-700 dark:text-cyan-300">
                                <Bot className="h-3 w-3" />
                                <span>AI Chatbot</span>
                              </span>
                            ) : lead.source === "WEBSITE" ? (
                              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 px-2 py-0.5 text-[10.5px] font-bold text-indigo-700 dark:text-indigo-300">
                                <Globe className="h-3 w-3" />
                                <span>Website Form</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center rounded-full bg-slate-100 dark:bg-surface-elevated px-2 py-0.5 text-[10.5px] font-bold text-slate-700 dark:text-slate-300">
                                {lead.source}
                              </span>
                            )}
                          </td>

                          {/* Status */}
                          <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={lead.status}
                              disabled={statusUpdatingId === lead.id}
                              onChange={(e) =>
                                handleStatusChange(lead.id, e.target.value as BackendLead["status"])
                              }
                              className={`rounded-lg border px-2 py-1 text-[11px] font-bold outline-none cursor-pointer transition-colors ${
                                lead.status === "NEW"
                                  ? "bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/50 dark:border-rose-800 dark:text-rose-300"
                                  : lead.status === "CONTACTED"
                                  ? "bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-950/50 dark:border-amber-800 dark:text-amber-300"
                                  : lead.status === "INTERESTED"
                                  ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/50 dark:border-blue-800 dark:text-blue-300"
                                  : lead.status === "ENROLLED"
                                  ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/50 dark:border-emerald-800 dark:text-emerald-300"
                                  : "bg-slate-100 border-slate-200 text-slate-700 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                              }`}
                            >
                              <option value="NEW">NEW</option>
                              <option value="CONTACTED">CONTACTED</option>
                              <option value="INTERESTED">INTERESTED</option>
                              <option value="ENROLLED">ENROLLED</option>
                              <option value="DROPPED">DROPPED</option>
                            </select>
                          </td>

                          {/* Date & Time */}
                          <td className="px-3 py-3.5 text-[11px] text-slate-500 dark:text-slate-400 whitespace-nowrap">
                            {new Date(lead.createdAt).toLocaleString("en-IN", {
                              timeZone: "Asia/Kolkata",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3.5 pl-3 pr-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {/* WhatsApp Button */}
                              <a
                                href={`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(
                                  `Hi ${lead.name}, this is JKS Learning Admissions team regarding your inquiry for ${lead.interestedCourse}. How may we assist you today?`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Chat on WhatsApp"
                                className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-500/20 transition-all shadow-2xs"
                              >
                                <WhatsAppIcon className="h-3.5 w-3.5" />
                              </a>

                              {/* Call Button */}
                              <a
                                href={`tel:${lead.phone}`}
                                title="Call Student"
                                className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-blue-500/10 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-500/20 transition-all shadow-2xs"
                              >
                                <Phone className="h-3.5 w-3.5" />
                              </a>

                              {/* Email Button */}
                              {lead.email && (
                                <a
                                  href={`mailto:${lead.email}?subject=JKS Learning Admissions - ${encodeURIComponent(
                                    lead.interestedCourse
                                  )}`}
                                  title="Send Email"
                                  className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-slate-500/10 hover:bg-slate-700 text-slate-600 hover:text-white border border-slate-500/20 transition-all shadow-2xs"
                                >
                                  <Mail className="h-3.5 w-3.5" />
                                </a>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </Reveal>

        {/* Lead Detail & Activity Drawer / Modal */}
        {selectedLead && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-slate-900 to-blue-950 p-4 text-white">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white font-bold">
                    {selectedLead.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{selectedLead.name}</h3>
                    <p className="text-[11px] text-blue-200">
                      Inquired for {selectedLead.interestedCourse}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="rounded-lg p-1.5 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Body */}
              <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto text-xs">
                {/* Contact Card */}
                <div className="grid grid-cols-2 gap-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated/70 p-3">
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Mobile Phone</span>
                    <div className="font-mono font-bold text-slate-900 dark:text-white mt-0.5">
                      {selectedLead.phone}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Email</span>
                    <div className="font-semibold text-slate-900 dark:text-white mt-0.5 truncate">
                      {selectedLead.email || "Not provided"}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Lead Source</span>
                    <div className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">
                      {selectedLead.source}
                    </div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-semibold uppercase">Registered On</span>
                    <div className="text-slate-700 dark:text-slate-300 mt-0.5">
                      {new Date(selectedLead.createdAt).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                </div>

                {/* Direct Connect Buttons */}
                <div className="flex gap-2">
                  <a
                    href={`https://wa.me/91${selectedLead.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                      `Hi ${selectedLead.name}, this is JKS Learning Admissions team regarding your inquiry for ${selectedLead.interestedCourse}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-2 font-bold transition-colors shadow-xs"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white py-2 font-bold transition-colors shadow-xs"
                  >
                    <Phone className="h-4 w-4" />
                    <span>Call Now</span>
                  </a>
                </div>

                {/* Notes & Activity Log */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white text-xs">Counselor Notes &amp; History</span>
                    <span className="text-[10px] text-slate-400">
                      {selectedLead.notes?.length || 0} entries
                    </span>
                  </div>

                  {/* Add Note Form */}
                  <form onSubmit={handleAddNote} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal counselor note..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingNote || !newNoteText.trim()}
                      className="rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-3 py-1.5 font-bold hover:opacity-90 disabled:opacity-50 transition-opacity flex items-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>Add</span>
                    </button>
                  </form>

                  {/* Notes List */}
                  <div className="space-y-2 mt-2">
                    {selectedLead.notes && selectedLead.notes.length > 0 ? (
                      selectedLead.notes.map((note) => (
                        <div
                          key={note.id}
                          className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/50 p-2.5 space-y-1"
                        >
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {note.authorName}
                            </span>
                            <span>
                              {new Date(note.createdAt).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                          <div className="whitespace-pre-line text-slate-800 dark:text-slate-200 text-[11px] leading-relaxed">
                            {note.note}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-4 text-center text-slate-400 text-[11px]">
                        No counselor notes added yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
