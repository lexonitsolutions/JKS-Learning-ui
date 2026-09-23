"use client";

import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Printer, Download, Award, ShieldCheck, CheckCircle2 } from "lucide-react";
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

  const handleDownloadPNG = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Background Gradient
    const gradient = ctx.createLinearGradient(0, 0, 1920, 1080);
    gradient.addColorStop(0, "#FAFCFF");
    gradient.addColorStop(0.5, "#F3F7FD");
    gradient.addColorStop(1, "#EAF1FC");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 1920, 1080);

    // Outer Royal Blue Border
    ctx.strokeStyle = "#1E40AF";
    ctx.lineWidth = 14;
    ctx.strokeRect(36, 36, 1920 - 72, 1080 - 72);

    // Inner Gold Border
    ctx.strokeStyle = "#D97706";
    ctx.lineWidth = 4;
    ctx.strokeRect(54, 54, 1920 - 108, 1080 - 108);

    // Corner Accents
    const cornerSize = 48;
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 5;
    // Top Left
    ctx.beginPath(); ctx.moveTo(70, 70 + cornerSize); ctx.lineTo(70, 70); ctx.lineTo(70 + cornerSize, 70); ctx.stroke();
    // Top Right
    ctx.beginPath(); ctx.moveTo(1920 - 70 - cornerSize, 70); ctx.lineTo(1920 - 70, 70); ctx.lineTo(1920 - 70, 70 + cornerSize); ctx.stroke();
    // Bottom Left
    ctx.beginPath(); ctx.moveTo(70, 1080 - 70 - cornerSize); ctx.lineTo(70, 1080 - 70); ctx.lineTo(70 + cornerSize, 1080 - 70); ctx.stroke();
    // Bottom Right
    ctx.beginPath(); ctx.moveTo(1920 - 70 - cornerSize, 1080 - 70); ctx.lineTo(1920 - 70, 1080 - 70); ctx.lineTo(1920 - 70, 1080 - 70 - cornerSize); ctx.stroke();

    // Watermark
    ctx.save();
    ctx.translate(960, 540);
    ctx.rotate(-15 * Math.PI / 180);
    ctx.fillStyle = "rgba(30, 58, 138, 0.035)";
    ctx.font = "900 130px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("JKS LEARNING", 0, 0);
    ctx.restore();

    // Institution Title
    ctx.textAlign = "center";
    ctx.fillStyle = "#1E40AF";
    ctx.font = "bold 22px sans-serif";
    ctx.fillText("JKS LEARNING TECHNOLOGIES INSTITUTE", 960, 160);

    // Certificate Title
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 48px serif";
    ctx.fillText("Certificate of Course Mastery", 960, 225);

    // Gold Divider
    ctx.strokeStyle = "#F59E0B";
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.moveTo(820, 250); ctx.lineTo(1100, 250); ctx.stroke();

    // Attestation Subtitle
    ctx.fillStyle = "#475569";
    ctx.font = "italic 24px serif";
    ctx.fillText("This is to certify and officially attest that", 960, 310);

    // Student Name
    ctx.fillStyle = "#1E3A8A";
    ctx.font = "bold 60px serif";
    ctx.fillText(certificate.studentName, 960, 400);

    // Student Name Underline
    const nameWidth = ctx.measureText(certificate.studentName).width;
    ctx.strokeStyle = "#FBBF24";
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(960 - nameWidth / 2, 420); ctx.lineTo(960 + nameWidth / 2, 420); ctx.stroke();

    // Completion Description
    ctx.fillStyle = "#475569";
    ctx.font = "20px sans-serif";
    ctx.fillText("has successfully completed 100% of the structured curriculum, practical coding assessments,", 960, 485);
    ctx.fillText("and enterprise architecture capstones for", 960, 520);

    // Course Title Box
    ctx.fillStyle = "#EFF6FF";
    ctx.strokeStyle = "#BFDBFE";
    ctx.lineWidth = 2;
    const courseText = certificate.courseTitle;
    ctx.font = "bold 32px sans-serif";
    const courseBoxWidth = Math.max(ctx.measureText(courseText).width + 80, 500);
    ctx.beginPath();
    ctx.roundRect(960 - courseBoxWidth / 2, 565, courseBoxWidth, 64, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.fillText(courseText, 960, 608);

    // Grade / Status
    ctx.fillStyle = "#065F46";
    ctx.font = "bold 20px sans-serif";
    ctx.fillText(`● ${certificate.grade || "Mastery & Stage Completion (100%)"} · Verified Candidate`, 960, 680);

    // Footer Divider
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(120, 740); ctx.lineTo(1800, 740); ctx.stroke();

    // Left Footer: ID & Date
    ctx.textAlign = "left";
    ctx.fillStyle = "#1E40AF";
    ctx.font = "bold 20px monospace";
    ctx.fillText(`ID: ${certificate.id}`, 140, 800);

    ctx.fillStyle = "#64748B";
    ctx.font = "18px sans-serif";
    const dateFormatted = new Date(certificate.issuedDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
    ctx.fillText(`Issued: ${dateFormatted}`, 140, 835);

    ctx.fillStyle = "#94A3B8";
    ctx.font = "14px monospace";
    ctx.fillText("SHA-256 Verified Ledger", 140, 865);

    // Center Official Seal
    ctx.textAlign = "center";
    ctx.fillStyle = "#D97706";
    ctx.beginPath(); ctx.arc(960, 835, 48, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "#FFFFFF"; ctx.lineWidth = 4; ctx.stroke();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 13px sans-serif";
    ctx.fillText("OFFICIAL", 960, 830);
    ctx.fillText("SEAL", 960, 850);

    ctx.fillStyle = "#B45309";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("VERIFIED ACCREDITATION", 960, 905);

    // Right Signature
    ctx.textAlign = "right";
    ctx.fillStyle = "#0F172A";
    ctx.font = "bold italic 30px serif";
    ctx.fillText("Dr. J. K. Sundaram", 1780, 800);

    ctx.fillStyle = "#334155";
    ctx.font = "bold 16px sans-serif";
    ctx.fillText("ACADEMIC DIRECTOR", 1780, 835);

    ctx.fillStyle = "#64748B";
    ctx.font = "14px sans-serif";
    ctx.fillText("JKS Learning Technologies", 1780, 865);

    // Trigger Download
    const link = document.createElement("a");
    const cleanTitle = (certificate.courseTitle || "Course").replace(/[^a-zA-Z0-9]/g, "_");
    link.download = `JKS_Certificate_${cleanTitle}_${certificate.id}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
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
                padding: 6mm 10mm !important;
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
        <div className="flex flex-wrap items-center justify-between gap-2.5 border-b border-slate-800 bg-slate-950 px-3 sm:px-5 py-2.5 sm:py-3 text-white print:hidden">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-amber-300">
              Verified Certificate
            </span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-400 shrink-0">
              ● AUTHENTIC
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={handleDownloadPNG}
              className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-emerald-600 px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-emerald-700 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>PNG</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#2563EB] px-2.5 sm:px-3.5 py-1.5 text-[11px] sm:text-xs font-bold text-white hover:bg-blue-600 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Print</span>
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
              aria-label="Close certificate modal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Landscape Certificate Sheet */}
        <div
          ref={printRef}
          className="certificate-printable-sheet relative p-3 sm:p-7 md:p-8 text-slate-900 bg-gradient-to-br from-[#FAFCFF] via-[#F3F7FD] to-[#EAF1FC] overflow-hidden select-none"
        >
          {/* Double Gold & Royal Blue Border */}
          <div className="pointer-events-none absolute inset-2 sm:inset-4 rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#1E40AF]/90" />
          <div className="pointer-events-none absolute inset-3 sm:inset-5 rounded-lg sm:rounded-xl border border-amber-500/60" />

          {/* Corner Flourishes */}
          <div className="pointer-events-none absolute top-4 sm:top-6 left-4 sm:left-6 h-4 sm:h-7 w-4 sm:w-7 border-t-2 border-l-2 border-amber-500" />
          <div className="pointer-events-none absolute top-4 sm:top-6 right-4 sm:right-6 h-4 sm:h-7 w-4 sm:w-7 border-t-2 border-r-2 border-amber-500" />
          <div className="pointer-events-none absolute bottom-4 sm:bottom-6 left-4 sm:left-6 h-4 sm:h-7 w-4 sm:w-7 border-b-2 border-l-2 border-amber-500" />
          <div className="pointer-events-none absolute bottom-4 sm:bottom-6 right-4 sm:right-6 h-4 sm:h-7 w-4 sm:w-7 border-b-2 border-r-2 border-amber-500" />

          {/* Subtle Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
            <div className="text-5xl sm:text-9xl font-black rotate-[-15deg] tracking-widest text-blue-950">
              JKS LEARNING
            </div>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center space-y-2 sm:space-y-3 px-2 sm:px-6 py-1">
            {/* Header / Logo */}
            <div className="flex items-center justify-center pt-0.5">
              <img
                src="/images/jks-logo.png"
                alt="JKS Learning Technologies Institute"
                className="h-8 sm:h-11 w-auto max-w-[200px] sm:max-w-[260px] object-contain select-none"
                style={{ filter: "none", display: "block" }}
                loading="eager"
              />
            </div>

            <div className="space-y-0.5">
              <div className="text-[9px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#1E40AF]">
                JKS Learning Technologies Institute
              </div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight font-serif">
                Certificate of Course Mastery
              </h1>
              <div className="h-0.5 w-20 sm:w-32 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-0.5 sm:mt-1" />
            </div>

            <p className="text-[11px] sm:text-sm text-slate-600 font-medium italic">
              This is to certify and officially attest that
            </p>

            <div className="space-y-0.5 max-w-full">
              <div className="text-xl sm:text-3xl md:text-4xl font-extrabold text-[#1E3A8A] font-serif tracking-wide underline decoration-amber-400 decoration-2 underline-offset-6 break-words">
                {certificate.studentName}
              </div>
            </div>

            <p className="text-[11px] sm:text-sm text-slate-600 max-w-xl leading-relaxed">
              has successfully completed 100% of the structured curriculum, practical coding assessments, and enterprise architecture capstones for
            </p>

            <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 sm:px-5 py-1 sm:py-1.5 shadow-xs max-w-full">
              <span className="text-xs sm:text-base font-bold text-slate-950 tracking-tight break-words">
                {certificate.courseTitle}
              </span>
            </div>

            <div className="text-[11px] sm:text-xs text-emerald-800 font-semibold flex items-center gap-1.5 justify-center">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-600 shrink-0" />
              <span>{certificate.grade || "Mastery & Stage Completion (100%)"} · Verified Candidate</span>
            </div>

            {/* Certificate Footer Row: Mobile-Adaptive & Desktop 3-Column */}
            <div className="w-full pt-3 sm:pt-4 border-t border-slate-300">
              {/* Mobile Layout (< sm): Eliminates 4-line squished wrapping */}
              <div className="sm:hidden space-y-2">
                <div className="flex flex-col items-center justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white shadow-md p-0.5 border-2 border-white">
                    <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-amber-100 flex-col">
                      <ShieldCheck className="h-4 w-4 text-white" />
                    </div>
                  </div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700 mt-0.5">
                    Official Seal · Accredited
                  </span>
                </div>

                <div className="flex items-end justify-between gap-2 text-xs pt-1">
                  <div className="text-left space-y-0.5 flex-1 min-w-0 pr-2">
                    <div className="font-mono text-[9px] font-bold text-[#1E40AF] break-all leading-snug">
                      ID: {certificate.id}
                    </div>
                    <div className="text-[9px] text-slate-500 font-medium">
                      Issued: {new Date(certificate.issuedDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                    <div className="text-[8px] text-slate-400 font-mono">
                      SHA-256 Ledger
                    </div>
                  </div>

                  <div className="text-right space-y-0.5 shrink-0 pl-2">
                    <div className="font-serif italic font-black text-slate-900 text-xs sm:text-sm">
                      Dr. J. K. Sundaram
                    </div>
                    <div className="text-[8px] font-bold text-slate-700 uppercase tracking-wider">
                      Academic Director
                    </div>
                    <div className="text-[8px] text-slate-500">
                      JKS Learning Technologies
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop & Tablet Layout (>= sm) */}
              <div className="hidden sm:grid grid-cols-3 items-end text-xs">
                {/* Left Column: ID & Issue Date */}
                <div className="text-left space-y-0.5">
                  <div className="font-mono text-[10px] sm:text-xs font-bold text-[#1E40AF] break-all">
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
                  <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white shadow-md p-1 border-2 border-white">
                    <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-amber-100 flex-col">
                      <ShieldCheck className="h-5 w-5 text-white" />
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
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}
