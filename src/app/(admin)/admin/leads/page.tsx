"use client";

import React from "react";
import Link from "next/link";
import { Megaphone, Lock, ArrowRight, ShieldAlert, Sparkles, Clock, CheckCircle2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminLeadsCRMPage() {
  return (
    <>
      <DashboardTopbar
        title="Leads & CRM (Coming Soon)"
        subtitle="Ad campaigns, Meta/Google lead capture, and counselor assignment pipeline."
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <Reveal>
          <div className="relative overflow-hidden rounded-[24px] border border-amber-200/80 dark:border-amber-900/50 bg-gradient-to-br from-amber-50/90 via-white to-orange-50/50 dark:from-surface-elevated dark:via-surface-secondary dark:to-amber-950/20 p-8 sm:p-10 shadow-[0_8px_30px_rgb(245,158,11,0.08)] dark:shadow-none backdrop-blur-xl">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full bg-amber-100/80 dark:bg-amber-950/60 border border-amber-300/60 dark:border-amber-800/60 px-3 py-1 text-xs font-bold text-amber-800 dark:text-amber-300">
                  <Clock className="h-3.5 w-3.5 text-amber-700 dark:text-amber-400" />
                  <span>Feature Temporarily Locked &amp; Under Development</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Ad Leads &amp; CRM Pipeline
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  This section has been temporarily disabled as requested while live Meta/Google Ads webhook ingestion, counselor assignment automation, and database lead pipelines are being connected to backend production services.
                </p>
              </div>

              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-amber-500/10 dark:bg-amber-950/40 border border-amber-500/20 dark:border-amber-800/40 text-amber-600 dark:text-amber-400 shadow-inner">
                <Megaphone className="h-10 w-10" />
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 border-t border-amber-200/60 dark:border-slate-800 pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Meta &amp; Google Ads Webhook</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Automated zero-delay instant lead ingestion from Facebook and Instagram lead forms.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Counselor Round-Robin</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Automated lead routing and WhatsApp notification dispatch.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-xs font-bold text-slate-900 dark:text-white">Direct PostgreSQL CRM Model</h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">Real-time pipeline stages stored directly in the database.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <Link
                href="/admin/students"
                className="inline-flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
              >
                <span>View Registered Students</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href="/admin"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-4 py-2.5 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
