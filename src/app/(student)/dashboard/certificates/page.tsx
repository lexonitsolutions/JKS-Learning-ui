"use client";

import React, { useState } from "react";
import { Award, Download, ShieldCheck, Eye, X, CheckCircle2, Lock } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";

interface EarnedCertificate {
  id: string;
  course: string;
  issuedOn: string;
  grade: string;
  status: string;
}

const EARNED_CERTIFICATES: EarnedCertificate[] = [
  {
    id: "JKS-CERT-8F21A9",
    course: "Java Full Stack Developer Mastery",
    issuedOn: "2026-07-30",
    grade: "Distinction (94%)",
    status: "Verified",
  },
];

const IN_PROGRESS_COURSES = [
  {
    course: "Modern Frontend Engineering with React",
    stagesCompleted: 2,
    totalStages: 3,
    progress: 66,
  },
  {
    course: "Enterprise Cloud & Microservices Mastery",
    stagesCompleted: 1,
    totalStages: 3,
    progress: 33,
  },
];

export default function StudentCertificatesPage() {
  const [selectedCert, setSelectedCert] = useState<EarnedCertificate | null>(null);

  return (
    <>
      <DashboardTopbar
        title="My Verified Certificates"
        subtitle="Cryptographically verified proof of completed courses and stage assignments."
        userInitials="JD"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Earned Credentials</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                <Award className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">
              {EARNED_CERTIFICATES.length}
            </div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">100% verified authentic</div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Courses In Progress</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600">
                <Lock className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">
              {IN_PROGRESS_COURSES.length}
            </div>
            <div className="mt-1 text-xs text-amber-600 font-semibold">
              Complete stages to unlock certificates
            </div>
          </div>

          <div className="rounded-[20px] border border-slate-100 bg-white p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.04)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Global Recognition</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">Enterprise Grade</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">Shareable on LinkedIn & Resumes</div>
          </div>
        </div>

        {/* Earned Certificates Grid */}
        <div>
          <h2 className="text-sm font-bold text-slate-900">Earned Certificates</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 md:grid-cols-2">
            {EARNED_CERTIFICATES.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-col justify-between rounded-[20px] border border-slate-100 bg-white p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)]"
              >
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                        <CheckCircle2 className="h-3 w-3" /> Fully Verified
                      </span>
                      <h3 className="mt-2 text-base font-bold text-slate-900">{cert.course}</h3>
                      <p className="mt-0.5 text-xs text-slate-500 font-medium">
                        Issued on {cert.issuedOn} · {cert.grade}
                      </p>
                    </div>
                    <div className="flex h-11 w-11 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-white shadow-xs">
                      <Award className="h-6 w-6" />
                    </div>
                  </div>

                  <div className="mt-4 font-mono text-xs font-bold text-[#2563EB]">
                    ID: {cert.id}
                  </div>
                </div>

                <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100 pt-4">
                  <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> Blockchain Authenticated
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                    >
                      <Download className="h-3.5 w-3.5" /> Download
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Locked / In Progress Certificates */}
        <div>
          <h2 className="text-sm font-bold text-slate-900">Certificates in Progress</h2>
          <p className="text-xs text-slate-500 font-medium">
            Complete 100% of all video stages without skipping and pass stage assignments to unlock these certificates.
          </p>

          <div className="mt-4 sm:mt-5 space-y-4">
            {IN_PROGRESS_COURSES.map((item) => (
              <div
                key={item.course}
                className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-4 sm:flex-row sm:items-center"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-200 text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900">{item.course}</div>
                    <div className="text-[11px] text-slate-500">
                      {item.stagesCompleted} of {item.totalStages} Stages Completed
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-full sm:w-32">
                    <div className="flex justify-between text-[11px] font-bold text-slate-700 mb-1">
                      <span>Progress</span>
                      <span>{item.progress}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#2563EB]"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Certificate Preview Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-3 sm:p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-4 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="rounded-2xl border-4 border-double border-amber-300/80 bg-gradient-to-b from-slate-900 via-slate-800 to-blue-950 p-5 sm:p-8 text-center text-white shadow-xl">
              <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-amber-400/20 text-amber-300">
                <Award className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
              <div className="mt-3 sm:mt-4 text-[10px] sm:text-xs font-bold tracking-widest text-amber-400 uppercase">
                JKS Learning Institute of Technology
              </div>
              <h2 className="mt-2 text-lg sm:text-2xl font-bold tracking-tight text-white">
                Official Certificate of Course Mastery
              </h2>
              <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-slate-300">This is proudly awarded to</p>
              <div className="mt-1 text-xl sm:text-2xl font-extrabold text-blue-300">
                Jordan Dsouza
              </div>
              <p className="mt-3 sm:mt-4 text-[11px] sm:text-xs text-slate-300">
                for demonstrating exceptional proficiency and completing all stage requirements for
              </p>
              <div className="mt-1 text-sm sm:text-base font-bold text-white">{selectedCert.course}</div>

              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-white/10 pt-4 text-left text-xs">
                <div>
                  <div className="font-mono text-emerald-400">ID: {selectedCert.id}</div>
                  <div className="text-slate-400">Issued on {selectedCert.issuedOn}</div>
                </div>
                <div className="sm:text-right">
                  <div className="font-semibold text-white">Authorized Verification</div>
                  <div className="text-slate-400">Academic Director, JKS</div>
                </div>
              </div>
            </div>

            <div className="mt-5 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2.5 sm:gap-3">
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="rounded-xl px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 order-2 sm:order-1"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => setSelectedCert(null)}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 order-1 sm:order-2"
              >
                <Download className="h-4 w-4" /> Download PDF Certificate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
