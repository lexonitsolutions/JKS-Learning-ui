"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  CheckCircle2,
  Lock,
  Save,
  Award,
  CreditCard,
  BrainCircuit,
  Mail,
  RotateCcw,
  FileCheck,
  ArrowLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

const SETTINGS_STORAGE_KEY = "jks_admin_platform_settings_v1";

interface PlatformSettings {
  // General & Branding
  platformName: string;
  adminEmail: string;
  supportPhone: string;
  currency: string;
  institutionName: string;

  // Video & Anti-Skip
  antiSkipEnforced: boolean;
  maxPlaybackSpeed: string;
  videoWatermarkEnabled: boolean;
  blockExternalRedirects: boolean;

  // Assessments & Grading
  minPassPercentage: number;
  maxAssignmentRetries: string;
  autoGradeMCQ: boolean;
  enablePlagiarismDetection: boolean;

  // AI Interview Engine
  aiScoringStrictness: string;
  maxAiInterviewsPerStudent: string;
  autoGenerateAiReports: boolean;
  enableVoiceInterviews: boolean;

  // Payments & Tax
  paymentGatewayMode: "Live" | "Test/Sandbox";
  gstPercentage: number;
  autoGenerateInvoices: boolean;

  // Certificate Authority
  certAuthorityName: string;
  certSignatory: string;
  enablePublicVerificationLedger: boolean;

  // Notifications
  notifyOnCoursePurchase: boolean;
  notifyOnAssignmentSubmit: boolean;
  weeklyInactivityReminders: boolean;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: "JKS Learning Enterprise Academy",
  adminEmail: "admin@jkslearning.com",
  supportPhone: "+91 98765 43210",
  currency: "INR (₹)",
  institutionName: "JKS Learning Institute of Technology",

  antiSkipEnforced: true,
  maxPlaybackSpeed: "1.5x",
  videoWatermarkEnabled: true,
  blockExternalRedirects: true,

  minPassPercentage: 75,
  maxAssignmentRetries: "3 attempts",
  autoGradeMCQ: true,
  enablePlagiarismDetection: true,

  aiScoringStrictness: "Balanced Enterprise Standard",
  maxAiInterviewsPerStudent: "5 sessions per month",
  autoGenerateAiReports: true,
  enableVoiceInterviews: true,

  paymentGatewayMode: "Live",
  gstPercentage: 18,
  autoGenerateInvoices: true,

  certAuthorityName: "JKS Academic Board of Certification",
  certSignatory: "Dr. K. S. Raman, Academic Director",
  enablePublicVerificationLedger: true,

  notifyOnCoursePurchase: true,
  notifyOnAssignmentSubmit: true,
  weeklyInactivityReminders: true,
};

type SettingCategoryKey =
  | "general"
  | "video"
  | "assessment"
  | "ai"
  | "payments"
  | "certificates"
  | "notifications";

interface SettingCategoryMeta {
  id: SettingCategoryKey;
  title: string;
  description: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
}

const SETTING_CATEGORIES: SettingCategoryMeta[] = [
  {
    id: "general",
    title: "General & Branding",
    description: "Platform name, academy branding, support phone, and platform currency.",
    icon: Settings,
    iconBg: "bg-blue-50",
    iconColor: "text-[#2563EB]",
  },
  {
    id: "video",
    title: "Video Security & Anti-Skip",
    description: "Anti-skip verification, dynamic student watermark, and in-app player locks.",
    icon: Lock,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "assessment",
    title: "Assessments & Pass Marks",
    description: "Minimum pass out threshold, retry limits, MCQ auto-scoring, and code checks.",
    icon: FileCheck,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "ai",
    title: "AI Interview Engine",
    description: "AI scoring strictness, monthly session quotas, voice audio, and PDF reports.",
    icon: BrainCircuit,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "payments",
    title: "Payments & Invoicing",
    description: "Gateway operating mode, GST percentage, and automated invoice dispatch.",
    icon: CreditCard,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "certificates",
    title: "Certificates & Ledger",
    description: "Issuing authority title, signatory designation, and QR verification ledger.",
    icon: Award,
    iconBg: "bg-rose-50",
    iconColor: "text-rose-600",
  },
  {
    id: "notifications",
    title: "Email & Notifications",
    description: "Automated student purchase alerts, project submissions, and streak reminders.",
    icon: Mail,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [selectedCategory, setSelectedCategory] = useState<SettingCategoryKey | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleResetDefaults = () => {
    setSettings(DEFAULT_SETTINGS);
    try {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(DEFAULT_SETTINGS));
    } catch {
      // ignore
    }
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const currentCategoryMeta = SETTING_CATEGORIES.find((c) => c.id === selectedCategory);

  return (
    <>
      <DashboardTopbar
        title="Settings"
        subtitle="Manage platform rules, anti-skip verification, grading criteria, and payment gateways."
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* VIEW 1: MAIN SETTINGS CATEGORIES OVERVIEW GRID */}
        {!selectedCategory ? (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/80 pb-3">
              <div>
                <h2 className="text-sm sm:text-base font-bold text-slate-900">Settings & Governance Categories</h2>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">
                  Select any section below to configure rules, security policies, and parameters.
                </p>
              </div>

              {isSaved && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 self-start sm:self-auto">
                  <CheckCircle2 className="h-3.5 w-3.5" /> All settings active
                </span>
              )}
            </div>

            {/* Responsive Categories Grid */}
            <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5">
              {SETTING_CATEGORIES.map((cat) => {
                const CatIcon = cat.icon;
                return (
                  <TiltCard key={cat.id} className="h-full">
                    <div
                      onClick={() => setSelectedCategory(cat.id)}
                      className="flex h-full flex-col justify-between rounded-2xl border border-white/80 bg-white/90 p-4 sm:p-6 shadow-[0_4px_20px_rgb(20,50,100,0.05)] backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:border-[#2563EB]/40 hover:-translate-y-0.5 cursor-pointer group"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <div className={`flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl ${cat.iconBg} ${cat.iconColor} shadow-2xs group-hover:scale-105 transition-transform`}>
                            <CatIcon className="h-5 w-5 stroke-[2.2]" />
                          </div>
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-50 text-slate-400 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                            <ChevronRight className="h-4 w-4" />
                          </span>
                        </div>

                        <h3 className="mt-3 sm:mt-4 text-sm sm:text-base font-bold text-slate-900 group-hover:text-[#2563EB] transition-colors">
                          {cat.title}
                        </h3>
                        <p className="mt-1 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                          {cat.description}
                        </p>
                      </div>

                      {/* Quick Meta Footer */}
                      <div className="mt-4 border-t border-slate-100 pt-2.5 flex items-center justify-between text-[11px] font-semibold text-slate-600">
                        <span className="text-[#2563EB] group-hover:underline">
                          <span className="hidden sm:inline">Configure </span>
                          <span className="sm:hidden">Open</span>
                        </span>
                        <ChevronRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB] group-hover:translate-x-0.5 transition-all" />
                      </div>
                    </div>
                  </TiltCard>
                );
              })}
            </Reveal>
          </div>
        ) : (
          /* VIEW 2: DEDICATED SECTION CONFIGURATION PAGE */
          <div className="space-y-4">
            {/* Compact Top Navigation - Just Back + Title */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setSelectedCategory(null)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Back to all settings"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                {currentCategoryMeta?.title}
              </h2>
            </div>

            {/* Category Form Container */}
            <form onSubmit={handleSave} className="space-y-4">
              <div className="rounded-2xl border border-white/70 bg-white/85 p-4 sm:p-7 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-5">
                {/* Header with Icon & Description */}
                <div className="flex items-start gap-3 border-b border-slate-100 pb-4">
                  {currentCategoryMeta && (
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl ${currentCategoryMeta.iconBg} ${currentCategoryMeta.iconColor} shadow-2xs`}>
                      {(() => {
                        const CategoryIcon = currentCategoryMeta.icon;
                        return <CategoryIcon className="h-5 w-5 stroke-[2.2]" />;
                      })()}
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{currentCategoryMeta?.title}</h3>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium line-clamp-2">{currentCategoryMeta?.description}</p>
                  </div>
                </div>

                {/* 1. GENERAL & BRANDING FIELDS */}
                {selectedCategory === "general" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Platform Name</label>
                        <input
                          type="text"
                          value={settings.platformName}
                          onChange={(e) => setSettings({ ...settings, platformName: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Institution Name</label>
                        <input
                          type="text"
                          value={settings.institutionName}
                          onChange={(e) => setSettings({ ...settings, institutionName: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Admin Email</label>
                        <input
                          type="email"
                          value={settings.adminEmail}
                          onChange={(e) => setSettings({ ...settings, adminEmail: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Support Phone</label>
                        <input
                          type="text"
                          value={settings.supportPhone}
                          onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Currency</label>
                        <select
                          value={settings.currency}
                          onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                        >
                          <option value="INR (₹)">INR (₹)</option>
                          <option value="USD ($)">USD ($)</option>
                          <option value="EUR (€)">EUR (€)</option>
                          <option value="GBP (£)">GBP (£)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* 2. VIDEO SECURITY & ANTI-SKIP */}
                {selectedCategory === "video" && (
                  <div className="space-y-3">
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Global Anti-Skip Enforcement</div>
                        <div className="text-[11px] text-slate-500">Must watch 100% before assignments unlock.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.antiSkipEnforced}
                        onChange={(e) => setSettings({ ...settings, antiSkipEnforced: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Student Identity Watermark</div>
                        <div className="text-[11px] text-slate-500">Email overlay on video to deter screen captures.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.videoWatermarkEnabled}
                        onChange={(e) => setSettings({ ...settings, videoWatermarkEnabled: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">In-App Only Playback</div>
                        <div className="text-[11px] text-slate-500">Blocks redirecting to external video sites.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.blockExternalRedirects}
                        onChange={(e) => setSettings({ ...settings, blockExternalRedirects: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Max Playback Speed</div>
                        <div className="text-[11px] text-slate-500">Limits acceleration rate</div>
                      </div>
                      <select
                        value={settings.maxPlaybackSpeed}
                        onChange={(e) => setSettings({ ...settings, maxPlaybackSpeed: e.target.value })}
                        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-bold text-slate-800 outline-none w-full sm:w-auto"
                      >
                        <option value="1.0x">1.0x (Normal)</option>
                        <option value="1.25x">1.25x</option>
                        <option value="1.5x">1.5x (Recommended)</option>
                        <option value="2.0x">2.0x</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 3. ASSESSMENTS & PASS MARKS */}
                {selectedCategory === "assessment" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Passing Threshold (%)</label>
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={settings.minPassPercentage}
                          onChange={(e) => setSettings({ ...settings, minPassPercentage: Number(e.target.value) })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Max Retries</label>
                        <select
                          value={settings.maxAssignmentRetries}
                          onChange={(e) => setSettings({ ...settings, maxAssignmentRetries: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                        >
                          <option value="1 attempt">1 attempt (Strict)</option>
                          <option value="3 attempts">3 attempts (Recommended)</option>
                          <option value="5 attempts">5 attempts</option>
                          <option value="Unlimited">Unlimited</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Auto MCQ Scoring</div>
                          <div className="text-[11px] text-slate-500">Instant evaluation on submission.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autoGradeMCQ}
                          onChange={(e) => setSettings({ ...settings, autoGradeMCQ: e.target.checked })}
                          className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                        />
                      </label>
                      <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                        <div>
                          <div className="text-xs font-bold text-slate-900">AI Plagiarism Detection</div>
                          <div className="text-[11px] text-slate-500">Scans code against public repositories.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.enablePlagiarismDetection}
                          onChange={(e) => setSettings({ ...settings, enablePlagiarismDetection: e.target.checked })}
                          className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* 4. AI INTERVIEW ENGINE */}
                {selectedCategory === "ai" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">AI Scoring Model</label>
                        <select
                          value={settings.aiScoringStrictness}
                          onChange={(e) => setSettings({ ...settings, aiScoringStrictness: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                        >
                          <option value="Balanced Enterprise Standard">Balanced Enterprise</option>
                          <option value="Rigorous FAANG-Grade">Rigorous FAANG-Grade</option>
                          <option value="Foundational Learning">Foundational Learning</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Max Sessions / Student</label>
                        <select
                          value={settings.maxAiInterviewsPerStudent}
                          onChange={(e) => setSettings({ ...settings, maxAiInterviewsPerStudent: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                        >
                          <option value="3 sessions per month">3 / month</option>
                          <option value="5 sessions per month">5 / month (Recommended)</option>
                          <option value="10 sessions per month">10 / month</option>
                          <option value="Unlimited">Unlimited</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Auto PDF Reports</div>
                          <div className="text-[11px] text-slate-500">Generates readiness verdict upon completion.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.autoGenerateAiReports}
                          onChange={(e) => setSettings({ ...settings, autoGenerateAiReports: e.target.checked })}
                          className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                        />
                      </label>
                      <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                        <div>
                          <div className="text-xs font-bold text-slate-900">Voice Audio Interviews</div>
                          <div className="text-[11px] text-slate-500">Students speak answers with AI voice feedback.</div>
                        </div>
                        <input
                          type="checkbox"
                          checked={settings.enableVoiceInterviews}
                          onChange={(e) => setSettings({ ...settings, enableVoiceInterviews: e.target.checked })}
                          className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* 5. PAYMENTS & INVOICING */}
                {selectedCategory === "payments" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Gateway Mode</label>
                        <select
                          value={settings.paymentGatewayMode}
                          onChange={(e) => setSettings({ ...settings, paymentGatewayMode: e.target.value as "Live" | "Test/Sandbox" })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                        >
                          <option value="Live">Live Production</option>
                          <option value="Test/Sandbox">Test / Sandbox</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">GST / Tax (%)</label>
                        <input
                          type="number"
                          value={settings.gstPercentage}
                          onChange={(e) => setSettings({ ...settings, gstPercentage: Number(e.target.value) })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Auto Invoice Dispatch</div>
                        <div className="text-[11px] text-slate-500">PDF tax invoice sent to student email on purchase.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.autoGenerateInvoices}
                        onChange={(e) => setSettings({ ...settings, autoGenerateInvoices: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                  </div>
                )}

                {/* 6. CERTIFICATES & LEDGER */}
                {selectedCategory === "certificates" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Authority Name</label>
                        <input
                          type="text"
                          value={settings.certAuthorityName}
                          onChange={(e) => setSettings({ ...settings, certAuthorityName: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Authorized Signatory</label>
                        <input
                          type="text"
                          value={settings.certSignatory}
                          onChange={(e) => setSettings({ ...settings, certSignatory: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Public QR Verification</div>
                        <div className="text-[11px] text-slate-500">Employers can verify credentials via ID lookup.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.enablePublicVerificationLedger}
                        onChange={(e) => setSettings({ ...settings, enablePublicVerificationLedger: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                  </div>
                )}

                {/* 7. NOTIFICATIONS */}
                {selectedCategory === "notifications" && (
                  <div className="space-y-3">
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Notify on Purchases</div>
                        <div className="text-[11px] text-slate-500">Alert when a student enrolls in a paid track.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifyOnCoursePurchase}
                        onChange={(e) => setSettings({ ...settings, notifyOnCoursePurchase: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Notify on Submissions</div>
                        <div className="text-[11px] text-slate-500">Alerts instructors when a capstone needs grading.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.notifyOnAssignmentSubmit}
                        onChange={(e) => setSettings({ ...settings, notifyOnAssignmentSubmit: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                    <label className="flex items-start justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-3.5 sm:p-4 cursor-pointer hover:border-blue-300 transition-colors">
                      <div>
                        <div className="text-xs font-bold text-slate-900">Weekly Inactivity Reminders</div>
                        <div className="text-[11px] text-slate-500">Emails students inactive for 7+ days.</div>
                      </div>
                      <input
                        type="checkbox"
                        checked={settings.weeklyInactivityReminders}
                        onChange={(e) => setSettings({ ...settings, weeklyInactivityReminders: e.target.checked })}
                        className="h-5 w-5 accent-[#2563EB] cursor-pointer mt-0.5 shrink-0"
                      />
                    </label>
                  </div>
                )}
              </div>

              {/* BOTTOM ACTION BUTTONS - Reset & Save */}
              <div className="flex items-center gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={handleResetDefaults}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-600 shadow-xs hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer active:scale-98"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Reset Defaults</span>
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.01] active:scale-98 cursor-pointer"
                >
                  {isSaved ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 animate-bounce" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
