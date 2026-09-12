"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Printer, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
import { JksLogo } from "@/components/common/jks-logo";

export interface CertificateData {
  id: string;
  studentName: string;
  courseTitle: string;
  issuedDate: string;
  grade?: string;
  instructorName?: string;
  verificationUrl?: string;
}

interface CertificateModalProps {
  certificate: CertificateData | null;
  onClose: () => void;
}

export function CertificateModal({ certificate, onClose }: CertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard navigation & body print class handler
  useEffect(() => {
    if (!certificate) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    const handleBeforePrint = () => {
      document.body.classList.add("printing-certificate");
    };

    const handleAfterPrint = () => {
      document.body.classList.remove("printing-certificate");
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      document.body.classList.remove("printing-certificate");
    };
  }, [certificate, onClose]);

  if (!certificate || !mounted) return null;

  const handlePrint = () => {
    document.body.classList.add("printing-certificate");
    window.print();
    setTimeout(() => {
      document.body.classList.remove("printing-certificate");
    }, 1500);
  };

  const modalContent = (
    <div
      id="printable-certificate-portal"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto print:p-0 print:m-0 print:bg-white print:fixed print:inset-0"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Strict 1-Page Landscape Print Rules */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: landscape;
                margin: 0;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                overflow: hidden !important;
                background: #ffffff !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              body.printing-certificate > *:not(#printable-certificate-portal),
              body:has(#printable-certificate-portal) > *:not(#printable-certificate-portal) {
                display: none !important;
              }
              #printable-certificate-portal {
                display: flex !important;
                position: fixed !important;
                inset: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                max-height: 100vh !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                align-items: center !important;
                justify-content: center !important;
                overflow: hidden !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
                page-break-inside: avoid !important;
                break-after: avoid !important;
                break-inside: avoid !important;
                z-index: 9999999 !important;
              }
              #printable-certificate-portal .print\\:hidden {
                display: none !important;
              }
              #printable-certificate-portal .certificate-printable-sheet {
                box-sizing: border-box !important;
                width: 297mm !important;
                height: 210mm !important;
                max-width: 100vw !important;
                max-height: 100vh !important;
                margin: 0 auto !important;
                padding: 8mm 14mm !important;
                box-shadow: none !important;
                border-radius: 0 !important;
                overflow: hidden !important;
                page-break-after: avoid !important;
                page-break-before: avoid !important;
                page-break-inside: avoid !important;
                break-after: avoid !important;
                break-inside: avoid !important;
                display: flex !important;
                flex-direction: column !important;
                justify-content: space-between !important;
              }
            }
          `,
        }}
      />

      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-700/60 bg-slate-900 shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-full my-auto print:my-0">
        {/* Action Header Bar (Hidden in Print) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 bg-slate-950 px-5 py-3.5 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <Award className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
              Verified Digital Certificate
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shrink-0">
              ● 100% AUTHENTIC
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Download / Print Landscape PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Landscape Certificate Sheet */}
        <div
          ref={printRef}
          className="certificate-printable-sheet relative p-6 sm:p-10 md:p-11 text-slate-900 bg-gradient-to-br from-[#FAFCFF] via-[#F3F7FD] to-[#EAF1FC] overflow-hidden select-none"
        >
          {/* Double Gold & Royal Blue Border */}
          <div className="pointer-events-none absolute inset-3 sm:inset-5 rounded-2xl border-4 border-[#1E40AF]/90" />
          <div className="pointer-events-none absolute inset-4 sm:inset-6 rounded-xl border border-amber-500/60" />

          {/* Corner Flourishes */}
          <div className="pointer-events-none absolute top-7 left-7 h-8 w-8 border-t-2 border-l-2 border-amber-500" />
          <div className="pointer-events-none absolute top-7 right-7 h-8 w-8 border-t-2 border-r-2 border-amber-500" />
          <div className="pointer-events-none absolute bottom-7 left-7 h-8 w-8 border-b-2 border-l-2 border-amber-500" />
          <div className="pointer-events-none absolute bottom-7 right-7 h-8 w-8 border-b-2 border-r-2 border-amber-500" />

          {/* Subtle Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
            <div className="text-7xl sm:text-9xl font-black rotate-[-15deg] tracking-widest text-blue-950">
              JKS LEARNING
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-3.5 sm:space-y-4 px-4 sm:px-8 py-1">
            {/* Header / Logo (Crisp Dark Navy & Electric Blue for White Paper — Mode Invariant) */}
            <div className="flex items-center justify-center pt-1">
              <img
                src="/images/jks-logo.png"
                alt="JKS Learning Technologies Institute"
                className="h-10 sm:h-12 w-auto max-w-[240px] sm:max-w-[280px] object-contain select-none"
                style={{ filter: "none", display: "block" }}
                loading="eager"
              />
            </div>

            <div className="space-y-0.5">
              <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.25em] text-[#1E40AF]">
                JKS Learning Technologies Institute
              </div>
              <h1 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-serif">
                Certificate of Course Mastery
              </h1>
              <div className="h-0.5 w-24 sm:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-1.5" />
            </div>

            <p className="text-xs sm:text-sm text-slate-600 font-medium italic pt-0.5">
              This is to certify and officially attest that
            </p>

            <div className="space-y-0.5">
              <div className="text-2xl sm:text-4xl font-extrabold text-[#1E3A8A] font-serif tracking-wide underline decoration-amber-400 decoration-2 underline-offset-8">
                {certificate.studentName}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed pt-0.5">
              has successfully completed 100% of the structured curriculum, practical coding assessments, and enterprise architecture capstones for
            </p>

            <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-6 py-2 shadow-xs">
              <span className="text-sm sm:text-lg font-bold text-slate-950 tracking-tight">
                {certificate.courseTitle}
              </span>
            </div>

            <div className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 justify-center">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              <span>{certificate.grade || "Mastery & Stage Completion (100%)"} · Verified Candidate</span>
            </div>

            {/* Certificate Footer Row: Credentials, Seal, Signatures */}
            <div className="w-full pt-4 sm:pt-6 border-t border-slate-300 grid grid-cols-3 items-end text-xs">
              {/* Left Column: ID & Issue Date */}
              <div className="text-left space-y-0.5">
                <div className="font-mono text-[10px] sm:text-xs font-bold text-[#1E40AF]">
                  ID: {certificate.id}
                </div>
                <div className="text-[10px] sm:text-[11px] text-slate-500 font-medium">
                  Issued: {new Date(certificate.issuedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div className="text-[9px] text-slate-400 font-mono">
                  SHA-256 Verified Ledger
                </div>
              </div>

              {/* Center Column: Golden Certified Seal */}
              <div className="flex flex-col items-center justify-center">
                <div className="flex h-13 w-13 sm:h-15 sm:w-15 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white shadow-md p-1 border-2 border-white">
                  <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-amber-100 flex-col">
                    <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 mt-0.5">
                  Official Seal
                </span>
              </div>

              {/* Right Column: Signature of Director */}
              <div className="text-right space-y-0.5">
                <div className="font-serif italic font-black text-slate-900 text-sm sm:text-base">
                  Dr. J. K. Sundaram
                </div>
                <div className="text-[10px] sm:text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                  Academic Director
                </div>
                <div className="text-[9px] text-slate-500">
                  JKS Learning Technologies
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
