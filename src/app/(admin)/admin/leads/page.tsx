"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  Plus,
  Phone,
  Mail,
  Calendar,
  Clock,
  Sparkles,
  TrendingUp,
  Award,
  CheckCircle2,
  AlertCircle,
  Megaphone,
  Bot,
  UserCheck,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  MoreVertical,
  Layers,
  LayoutGrid,
  List,
  Flame,
  ExternalLink,
  ChevronDown,
  X,
  Send,
  Zap,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import {
  getStoredLeads,

  addLead,
  updateLeadStatus,
  assignLeadToCounselor,
  addLeadActivityNote,
  COUNSELORS,
  type Lead,
  type LeadStatus,
  type LeadSource,
  type Counselor,
} from "@/lib/data/leads-store";

const STATUS_COLUMNS: { id: LeadStatus; label: string; color: string; bg: string }[] = [
  { id: "new", label: "New Leads", color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
  { id: "assigned", label: "Assigned", color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
  { id: "follow_up", label: "In Follow-Up", color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
  { id: "demo_scheduled", label: "Demo Scheduled", color: "text-purple-600", bg: "bg-purple-50 border-purple-200" },
  { id: "converted", label: "Converted / Enrolled", color: "text-emerald-600", bg: "bg-emerald-50 border-emerald-200" },
  { id: "lost", label: "Lost / Closed", color: "text-slate-500", bg: "bg-slate-50 border-slate-200" },
];

export default function AdminLeadsCRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedSource, setSelectedSource] = useState<string>("all");
  const [selectedCounselor, setSelectedCounselor] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");

  // Selected Lead for Drawer
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [newNoteText, setNewNoteText] = useState("");
  const [noteType, setNoteType] = useState<"note" | "call" | "whatsapp">("note");

  // Add Lead Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState({
    name: "",
    email: "",
    phone: "",
    interestedCourse: "Java Full Stack Developer Mastery",
    source: "meta_ads" as LeadSource,
    priority: "high" as "high" | "medium" | "low",
    budget: "₹45,000",
    notes: "",
  });

  useEffect(() => {
    setLeads(getStoredLeads());
  }, []);

  const refreshLeads = () => {
    const fresh = getStoredLeads();
    setLeads(fresh);
    if (activeLead) {
      const updated = fresh.find((l) => l.id === activeLead.id);
      if (updated) setActiveLead(updated);
    }
  };

  const handleStatusChange = (leadId: string, newStatus: LeadStatus) => {
    updateLeadStatus(leadId, newStatus);
    refreshLeads();
  };

  const handleAssignCounselor = (leadId: string, counselorId: string) => {
    assignLeadToCounselor(leadId, counselorId);
    refreshLeads();
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeLead || !newNoteText.trim()) return;
    addLeadActivityNote(activeLead.id, newNoteText.trim(), noteType);
    setNewNoteText("");
    refreshLeads();
  };

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name || !newLeadForm.phone) return;

    addLead({
      name: newLeadForm.name,
      email: newLeadForm.email || `${newLeadForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      phone: newLeadForm.phone,
      interestedCourse: newLeadForm.interestedCourse,
      source: newLeadForm.source,
      priority: newLeadForm.priority,
      budget: newLeadForm.budget,
      status: "new",
      notes: newLeadForm.notes,
    });

    setShowAddModal(false);
    setNewLeadForm({
      name: "",
      email: "",
      phone: "",
      interestedCourse: "Java Full Stack Developer Mastery",
      source: "meta_ads",
      priority: "high",
      budget: "₹45,000",
      notes: "",
    });
    refreshLeads();
  };

  const handleSimulateWebhook = () => {
    const sampleNames = ["Vikrant Sharma", "Deepika Joshi", "Harish Varma", "Pooja Hegde"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomCourse = ["Java Full Stack Developer Mastery", "Modern Frontend Engineering (React 19 & Next.js)", "SAP S/4HANA Enterprise Systems"][
      Math.floor(Math.random() * 3)
    ];

    addLead({
      name: randomName,
      email: `${randomName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      phone: `+91 ${Math.floor(9000000000 + Math.random() * 999999999)}`,
      interestedCourse: randomCourse,
      source: "meta_ads",
      campaignName: "Meta_InstantForm_Aug30_Live",
      status: "new",
      priority: "high",
      budget: "₹45,000",
      notes: "Real-time Ad Webhook Lead Captured from Facebook / Instagram Ads Campaign",
    });

    refreshLeads();
  };

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.interestedCourse.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = selectedStatus === "all" || lead.status === selectedStatus;
    const matchesSource = selectedSource === "all" || lead.source === selectedSource;
    const matchesCounselor =
      selectedCounselor === "all" || (lead.assignedTo && lead.assignedTo.id === selectedCounselor);

    return matchesSearch && matchesStatus && matchesSource && matchesCounselor;
  });

  // Calculate Metrics
  const totalCount = leads.length;
  const newCount = leads.filter((l) => l.status === "new").length;
  const convertedCount = leads.filter((l) => l.status === "converted").length;
  const conversionRate = totalCount > 0 ? ((convertedCount / totalCount) * 100).toFixed(1) : "0";

  return (
    <>
      <DashboardTopbar
        title="Leads & CRM"
        subtitle="Automated capture from Meta/Google Ads, Chatbot enquiries & Counselor CRM."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Header & Fast Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">Ad Leads &amp; CRM Pipeline</h1>
              <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-bold text-blue-700">
                {leads.length} Total Leads
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-500">
              Automated capture from Meta/Google Ads, Chatbot enquiries &amp; Counselor CRM management
            </p>
          </div>


        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={handleSimulateWebhook}
            className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3.5 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-100 transition-colors cursor-pointer"
            title="Simulate incoming Facebook/Google Ad Lead Webhook"
          >
            <Zap className="h-4 w-4" /> Simulate Ad Webhook
          </button>

          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
          >
            <Plus className="h-4 w-4" /> Add Walk-In Lead
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Enquiries</span>
            <Megaphone className="h-4 w-4 text-blue-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{totalCount}</div>
          <div className="mt-1 text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" /> Active in Pipeline
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>New Unassigned</span>
            <AlertCircle className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-black text-amber-600">{newCount}</div>
          <div className="mt-1 text-[11px] text-slate-500">Awaiting Counselor Assignment</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Admissions Converted</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-600">{convertedCount}</div>
          <div className="mt-1 text-[11px] text-emerald-700 font-bold">Enrolled in Batches</div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Conversion Rate</span>
            <Award className="h-4 w-4 text-purple-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-purple-600">{conversionRate}%</div>
          <div className="mt-1 text-[11px] text-slate-500">From Ad Click to Enrollment</div>
        </div>
      </div>

      {/* Filter and View Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, mobile, email or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="all">All Sources</option>
            <option value="meta_ads">Meta (FB &amp; Insta Ads)</option>
            <option value="google_ads">Google Ads</option>
            <option value="website_chatbot">Website Chatbot</option>
            <option value="referral">Student Referral</option>
          </select>

          <select
            value={selectedCounselor}
            onChange={(e) => setSelectedCounselor(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
          >
            <option value="all">All Counselors</option>
            {COUNSELORS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                viewMode === "kanban" ? "bg-white text-[#2563EB] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" /> Kanban
            </button>
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                viewMode === "table" ? "bg-white text-[#2563EB] shadow-xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <List className="h-3.5 w-3.5" /> Table
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 1. KANBAN PIPELINE VIEW (HORIZONTAL SIDE-SCROLL)          */}
      {/* ======================================================== */}
      {viewMode === "kanban" ? (
        <div className="space-y-3">
          {/* Quick Stage Filters for Mobile/Tablet */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar lg:hidden">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Stages:</span>
            <button
              type="button"
              onClick={() => setSelectedStatus("all")}
              className={`rounded-xl border px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
                selectedStatus === "all"
                  ? "border-[#2563EB] bg-[#2563EB] text-white shadow-xs"
                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
              }`}
            >
              All Stages ({filteredLeads.length})
            </button>
            {STATUS_COLUMNS.map((col) => {
              const count = leads.filter((l) => l.status === col.id).length;
              const isSelected = selectedStatus === col.id;
              return (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => setSelectedStatus(isSelected ? "all" : col.id)}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-bold shrink-0 transition-all ${
                    isSelected
                      ? "border-[#2563EB] bg-[#2563EB] text-white shadow-xs"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                  }`}
                >
                  <span>{col.label}</span>
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Horizontal Side-Scroll Kanban Columns */}
          <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth min-h-[520px]">
            {STATUS_COLUMNS.filter((col) => selectedStatus === "all" || selectedStatus === col.id).map((col) => {
              const colLeads = filteredLeads.filter((l) => l.status === col.id);

              return (
                <div
                  key={col.id}
                  className="w-[285px] sm:w-[320px] shrink-0 snap-start flex flex-col rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 min-h-[500px] shadow-xs"
                >
                  {/* Column Header */}
                  <div className={`flex items-center justify-between rounded-xl border p-2.5 mb-3 bg-white ${col.bg}`}>
                    <span className={`text-xs font-black ${col.color}`}>{col.label}</span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-900 text-[10px] font-bold text-white">
                      {colLeads.length}
                    </span>
                  </div>

                  {/* Lead Cards List */}
                  <div className="space-y-3 flex-1 overflow-y-auto pr-0.5 max-h-[580px]">
                    {colLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setActiveLead(lead)}
                        className="group rounded-xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-[#2563EB] hover:shadow-md transition-all cursor-pointer space-y-2.5"
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div className="font-bold text-slate-900 text-xs truncate">{lead.name}</div>
                          <span
                            className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                              lead.priority === "high"
                                ? "bg-rose-50 text-rose-600 border border-rose-200"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {lead.priority}
                          </span>
                        </div>

                        <div className="text-[11px] font-medium text-slate-600 line-clamp-1">
                          {lead.interestedCourse}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2">
                          <span className="flex items-center gap-1 font-mono text-[10px] font-semibold text-[#2563EB]">
                            {lead.source === "meta_ads" ? "Meta Ads" : lead.source === "google_ads" ? "Google" : "Chatbot"}
                          </span>
                          <span>{lead.assignedTo ? lead.assignedTo.name.split(" ")[0] : "Unassigned"}</span>
                        </div>
                      </div>
                    ))}

                    {colLeads.length === 0 && (
                      <div className="py-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-xl">
                        No leads in stage
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (

        /* ======================================================== */
        /* 2. DATA TABLE VIEW                                       */
        /* ======================================================== */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Candidate</th>
                  <th className="p-4">Interested Course</th>
                  <th className="p-4">Source &amp; Campaign</th>
                  <th className="p-4">Assigned Counselor</th>
                  <th className="p-4">Stage Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{lead.name}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{lead.phone}</div>
                    </td>
                    <td className="p-4 font-medium text-slate-800">{lead.interestedCourse}</td>
                    <td className="p-4">
                      <span className="inline-flex rounded-lg bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                        {lead.source.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4">
                      {lead.assignedTo ? (
                        <span className="font-semibold text-slate-800">{lead.assignedTo.name}</span>
                      ) : (
                        <span className="text-amber-600 font-bold text-[11px]">Unassigned</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                          lead.status === "converted"
                            ? "bg-emerald-100 text-emerald-800"
                            : lead.status === "new"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-slate-100 text-slate-800"
                        }`}
                      >
                        {lead.status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        type="button"
                        onClick={() => setActiveLead(lead)}
                        className="rounded-lg bg-slate-100 px-3 py-1.5 font-bold text-[#2563EB] hover:bg-blue-50 cursor-pointer"
                      >
                        View Dossier →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. LEAD DETAILS & ACTIVITY DOSSIER DRAWER / MODAL         */}
      {/* ======================================================== */}
      {activeLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-slate-900/50 backdrop-blur-xs">
          <div className="relative flex h-full w-full max-w-xl flex-col bg-white shadow-2xl p-6 overflow-y-auto space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-black text-slate-900">{activeLead.name}</h2>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 uppercase">
                    {activeLead.id}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                  <span>{activeLead.phone}</span>
                  <span>•</span>
                  <span>{activeLead.email}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setActiveLead(null)}
                className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Quick Contact Action Bar */}
            <div className="flex items-center gap-2">
              <a
                href={`tel:${activeLead.phone}`}
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 py-2.5 text-xs font-bold text-[#2563EB] hover:bg-blue-100"
              >
                <PhoneCall className="h-4 w-4" /> Call Candidate
              </a>
              <a
                href={`https://wa.me/${activeLead.phone.replace(/[^0-9]/g, "")}?text=Hi%20${activeLead.name},%20this%20is%20from%20JKS%20Learning%20regarding%20your%20interest%20in%20${encodeURIComponent(activeLead.interestedCourse)}.`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-bold text-white hover:bg-emerald-700"
              >
                <MessageSquare className="h-4 w-4" /> WhatsApp
              </a>
            </div>

            {/* Stage Pipeline Selector */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 space-y-3">
              <label className="text-xs font-bold text-slate-700">Update Pipeline Stage:</label>
              <div className="grid grid-cols-3 gap-2">
                {STATUS_COLUMNS.map((col) => (
                  <button
                    key={col.id}
                    type="button"
                    onClick={() => handleStatusChange(activeLead.id, col.id)}
                    className={`rounded-xl p-2 text-[11px] font-bold transition-all border ${
                      activeLead.status === col.id
                        ? "bg-[#2563EB] text-white border-[#2563EB] shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Assignment & Metadata */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Assigned Counselor</span>
                <select
                  value={activeLead.assignedTo?.id || ""}
                  onChange={(e) => handleAssignCounselor(activeLead.id, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2 text-xs font-semibold text-slate-800 outline-none"
                >
                  <option value="">Unassigned</option>
                  {COUNSELORS.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 font-medium">Source Attribution</span>
                <div className="rounded-xl border border-slate-200 bg-white p-2 font-bold text-slate-800 uppercase">
                  {activeLead.source.replace("_", " ")}
                </div>
              </div>
            </div>

            {/* Log Call / WhatsApp Activity Notes */}
            <form onSubmit={handleAddNote} className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800">Log Interaction / Add Note</span>
                <div className="flex items-center gap-1">
                  {(["note", "call", "whatsapp"] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNoteType(t)}
                      className={`rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase ${
                        noteType === t ? "bg-[#2563EB] text-white" : "bg-white text-slate-600 border"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={3}
                placeholder="Enter discussion summary, candidate requirements, next follow-up..."
                value={newNoteText}
                onChange={(e) => setNewNoteText(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-[#2563EB]"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newNoteText.trim()}
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" /> Save Activity
                </button>
              </div>
            </form>

            {/* Interaction History Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Activity History</h3>
              <div className="space-y-2.5">
                {activeLead.activities.map((act) => (
                  <div key={act.id} className="rounded-xl border border-slate-100 bg-white p-3 text-xs shadow-2xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                      <span className="font-bold text-slate-700">{act.author}</span>
                      <span>{new Date(act.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-800">{act.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. ADD NEW LEAD MODAL                                     */}
      {/* ======================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X className="h-4 w-4" />
            </button>

            <h3 className="text-base font-black text-slate-900">Add New Walk-In / Phone Lead</h3>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Candidate Name"
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Mobile Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={newLeadForm.phone}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Email Address</label>
                <input
                  type="email"
                  placeholder="candidate@gmail.com"
                  value={newLeadForm.email}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Interested Course</label>
                <select
                  value={newLeadForm.interestedCourse}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, interestedCourse: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                >
                  <option>Java Full Stack Developer Mastery</option>
                  <option>Modern Frontend Engineering (React 19 & Next.js)</option>
                  <option>SAP S/4HANA Enterprise Systems</option>
                  <option>.NET 9 Enterprise Microservices & Cloud</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Lead Source</label>
                <select
                  value={newLeadForm.source}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as LeadSource })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                >
                  <option value="walk_in">Walk-in Enquiry</option>
                  <option value="meta_ads">Meta (Facebook/Instagram Ads)</option>
                  <option value="google_ads">Google Search Ads</option>
                  <option value="referral">Student Referral</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-md"
                >
                  Save Lead to CRM
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </>
  );
}


