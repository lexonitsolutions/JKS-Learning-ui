"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Download, Eye, CheckCircle2, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_CERTIFICATES, type AdminCertificateRow } from "@/lib/data/admin";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { CertificateModal } from "@/components/common/certificate-modal";

export default function AdminCertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<AdminCertificateRow | null>(null);

  return (
    <>
      <DashboardTopbar
        title="Certificates"
        subtitle={`${ADMIN_CERTIFICATES.length} cryptographically verified certificates issued to graduates.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Issued Credentials</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">4,820</div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">100% verified authentic</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Completion Milestone</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Stage-Verified</div>
            <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">All videos + assignments passed</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verification Ledger</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">Public QR & ID</div>
            <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Instant enterprise background check</div>
          </div>
          </TiltCard>
        </Reveal>

        {/* Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 dark:text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Student</th>
                  <th className="px-4 pb-3">Course Completed</th>
                  <th className="px-4 pb-3">Verification ID</th>
                  <th className="px-4 pb-3">Issued Date</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
                {ADMIN_CERTIFICATES.map((c) => (
                  <tr key={c.verificationId} className="transition-colors hover:bg-slate-50/60 dark:hover:bg-surface-hover">
                    <td className="py-4 pr-4 pl-0 font-bold text-slate-900 dark:text-white whitespace-nowrap">
                      {c.student}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 dark:text-slate-300 whitespace-nowrap">
                      {c.course}
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-[#2563EB] dark:text-blue-400 whitespace-nowrap">
                      {c.verificationId}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {c.issuedDate}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                        <ShieldCheck className="h-3 w-3" /> Valid
                      </span>
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(c)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-[#2563EB] shadow-xs hover:bg-[#EFF6FF] dark:border-slate-700/80 dark:bg-surface-elevated dark:text-blue-400 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" /> Preview
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Certificate Preview & Print Modal */}
      <CertificateModal
        certificate={
          selectedCert
            ? {
                id: selectedCert.verificationId,
                studentName: selectedCert.student,
                courseTitle: selectedCert.course,
                issuedDate: selectedCert.issuedDate,
                grade: "Mastery & Stage Completion (100%)",
              }
            : null
        }
        onClose={() => setSelectedCert(null)}
      />
    </>
  );
}
