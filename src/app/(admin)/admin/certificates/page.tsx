"use client";

import React, { useState } from "react";
import { Award, ShieldCheck, Download, Eye, CheckCircle2, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_CERTIFICATES, type AdminCertificateRow } from "@/lib/data/admin";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

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
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Issued Credentials</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">4,820</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">100% verified authentic</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Completion Milestone</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">Stage-Verified</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">All videos + assignments passed</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Verification Ledger</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">Public QR & ID</div>
            <div className="mt-1 text-xs text-slate-500 font-medium">Instant enterprise background check</div>
          </div>
          </TiltCard>
        </Reveal>

        {/* Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Student</th>
                  <th className="px-4 pb-3">Course Completed</th>
                  <th className="px-4 pb-3">Verification ID</th>
                  <th className="px-4 pb-3">Issued Date</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Certificate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ADMIN_CERTIFICATES.map((c) => (
                  <tr key={c.verificationId} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-bold text-slate-900 whitespace-nowrap">
                      {c.student}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                      {c.course}
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-[#2563EB] whitespace-nowrap">
                      {c.verificationId}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-500 whitespace-nowrap">
                      {c.issuedDate}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <ShieldCheck className="h-3 w-3" /> Valid
                      </span>
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCert(c)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-[#2563EB] shadow-xs hover:bg-[#EFF6FF] transition-colors"
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

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="absolute top-5 right-5 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="rounded-2xl border-4 border-double border-amber-200/60 bg-gradient-to-b from-slate-900 via-slate-800 to-blue-950 p-8 text-center text-white shadow-xl">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                <Award className="h-8 w-8" />
              </div>
              <div className="mt-4 text-xs font-bold tracking-widest text-amber-400 uppercase">
                JKS Learning Institute of Technology
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-white sm:text-2xl">
                Certificate of Mastery & Completion
              </h2>
              <p className="mt-4 text-xs text-slate-300">This is to proudly certify that</p>
              <div className="mt-1 text-xl font-extrabold text-blue-300 underline decoration-blue-500/50 underline-offset-8">
                {selectedCert.student}
              </div>
              <p className="mt-4 text-xs text-slate-300">
                has successfully completed all required video stages and passed all practical assignments for
              </p>
              <div className="mt-1 font-bold text-white">{selectedCert.course}</div>

              <div className="mt-8 flex items-center justify-between border-t border-white/10 pt-4 text-left text-xs">
                <div>
                  <div className="font-mono text-emerald-400">ID: {selectedCert.verificationId}</div>
                  <div className="text-slate-400">Issued on {selectedCert.issuedDate}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-white">Authorized Signature</div>
                  <div className="text-slate-400">Academic Director, JKS</div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                <Download className="h-4 w-4" /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
