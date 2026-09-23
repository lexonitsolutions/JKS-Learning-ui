"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  Download,
  Printer,
  Search,
  CheckCircle2,
  XCircle,
  Share2,
  Copy,
  ExternalLink,
  BookOpen,
  Sparkles,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";
import { apiFetch } from "@/lib/api/base-url";

interface VerificationResult {
  valid: boolean;
  id?: string;
  verificationId?: string;
  studentName?: string;
  courseName?: string;
  courseSlug?: string;
  courseLevel?: string;
  issuedAt?: string;
  grade?: string;
  status?: string;
  institution?: string;
  accreditation?: string;
  directorName?: string;
  directorRole?: string;
}

export default function CertificateVerifyPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Route can provide id via /certificate/verify/[id] or query ?id=...
  const rawIdParam = params?.id;
  const idFromRoute = Array.isArray(rawIdParam) ? rawIdParam.join("/") : rawIdParam || "";
  const initialId = idFromRoute || searchParams.get("id") || "";

  const [searchId, setSearchId] = useState(initialId);
  const [activeCertId, setActiveCertId] = useState(initialId);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (initialId) {
      setSearchId(initialId);
      setActiveCertId(initialId);
      handleVerify(initialId);
    }
  }, [initialId]);

  const handleVerify = async (idToVerify: string) => {
    const clean = idToVerify.trim();
    if (!clean) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await apiFetch(`/certificates/verify/${encodeURIComponent(clean)}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setResult(data);
      } else {
        setResult({ valid: false });
      }
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchId.trim()) return;
    setActiveCertId(searchId.trim());
    router.push(`/certificate/verify/${encodeURIComponent(searchId.trim())}`);
    handleVerify(searchId.trim());
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPNG = () => {
    if (!result || !result.valid) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const student = result.studentName || "Student";
    const course = result.courseName || "Course Mastery";
    const certId = result.verificationId || activeCertId;
    const issueDate = result.issuedAt
      ? new Date(result.issuedAt).toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : new Date().toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });

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
    ctx.beginPath(); ctx.moveTo(70, 70 + cornerSize); ctx.lineTo(70, 70); ctx.lineTo(70 + cornerSize, 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1920 - 70 - cornerSize, 70); ctx.lineTo(1920 - 70, 70); ctx.lineTo(1920 - 70, 70 + cornerSize); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(70, 1080 - 70 - cornerSize); ctx.lineTo(70, 1080 - 70); ctx.lineTo(70 + cornerSize, 1080 - 70); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1920 - 70 - cornerSize, 1080 - 70); ctx.lineTo(1920 - 70, 1080 - 70); ctx.lineTo(1920 - 70, 1080 - 70 - cornerSize); ctx.stroke();

    // Watermark
    ctx.save();
    ctx.translate(960, 540);
    ctx.rotate((-15 * Math.PI) / 180);
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
    ctx.fillText(student, 960, 400);

    // Student Name Underline
    const nameWidth = ctx.measureText(student).width;
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
    const courseWidth = Math.min(ctx.measureText(course).width + 80, 1400);
    ctx.beginPath();
    ctx.roundRect(960 - courseWidth / 2, 555, courseWidth, 64, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = "#0F172A";
    ctx.font = "bold 28px sans-serif";
    ctx.fillText(course, 960, 597);

    // Mastery Badge
    ctx.fillStyle = "#059669";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("✔ Mastery & Stage Completion (100%) · Verified Candidate", 960, 675);

    // Divider
    ctx.strokeStyle = "#CBD5E1";
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(140, 720); ctx.lineTo(1780, 720); ctx.stroke();

    // Left Info
    ctx.textAlign = "left";
    ctx.fillStyle = "#1E40AF";
    ctx.font = "bold 18px monospace";
    ctx.fillText(`ID: ${certId}`, 140, 800);

    ctx.fillStyle = "#64748B";
    ctx.font = "16px sans-serif";
    ctx.fillText(`Issued: ${issueDate}`, 140, 835);
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

    // Download
    const link = document.createElement("a");
    link.download = `JKS_Certificate_${certId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const formattedDate = result?.issuedAt
    ? new Date(result.issuedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "Verified on Record";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Print Styles */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: landscape;
                margin: 0;
              }
              body * {
                visibility: hidden !important;
              }
              #printable-certificate-area,
              #printable-certificate-area * {
                visibility: visible !important;
              }
              #printable-certificate-area {
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100vw !important;
                height: 100vh !important;
                margin: 0 !important;
                padding: 10mm !important;
                background: #ffffff !important;
                z-index: 9999999 !important;
              }
            }
          `,
        }}
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Verification Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/60 bg-blue-50 dark:bg-blue-950/40 px-4 py-1.5 text-xs font-bold text-[#1E5EFF] dark:text-blue-400 shadow-xs">
            <ShieldCheck className="h-4 w-4" />
            <span>Institutional Credential Ledger Verification</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white">
            Verify JKS Learning Certificate
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            Instantly authenticate and view tamper-proof certificates issued by JKS Learning Technologies Institute.
          </p>
        </div>

        {/* Verification Search Form */}
        <div className="max-w-2xl mx-auto">
          <form onSubmit={onSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-0 sm:relative">
            <div className="relative flex-1">
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Certificate Verification ID (e.g. JKS-CERT-...)"
                className="w-full rounded-xl sm:rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-3 sm:py-3.5 pl-10 sm:pl-12 pr-4 sm:pr-32 text-xs sm:text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !searchId.trim()}
              className="sm:absolute sm:right-2 rounded-xl bg-[#1E5EFF] hover:bg-blue-700 disabled:opacity-50 py-2.5 sm:py-2 px-5 text-xs font-bold text-white shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="h-4 w-4 sm:hidden" />
              <span>{loading ? "Verifying..." : "Verify ID"}</span>
            </button>
          </form>
        </div>

        {/* Result Area */}
        {loading && (
          <div className="text-center py-16 space-y-3">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-r-transparent" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              Validating certificate cryptographic record against ledger...
            </p>
          </div>
        )}

        {!loading && hasSearched && result && !result.valid && (
          <div className="max-w-md mx-auto rounded-3xl border border-rose-200 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-100 dark:bg-rose-900/40 text-rose-600 dark:text-rose-400">
              <XCircle className="h-8 w-8" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">Certificate Not Found</h2>
              <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">
                No active certificate matching &quot;{activeCertId}&quot; was found in our ledger. Please verify the ID from your certificate email or dashboard.
              </p>
            </div>
            <div className="pt-2">
              <Link
                href="/dashboard/certificates"
                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 dark:bg-white px-4 py-2 text-xs font-bold text-white dark:text-slate-900 shadow-sm hover:opacity-90 transition-opacity"
              >
                <span>Check My Dashboard Certificates</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        )}

        {!loading && result && result.valid && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/70 dark:bg-emerald-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-3.5 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-sm">
                  <BadgeCheck className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-emerald-950 dark:text-emerald-200">
                      Official Credential Authenticated &amp; Valid
                    </span>
                    <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold text-white shrink-0">
                      ● Active
                    </span>
                  </div>
                  <p className="text-xs text-emerald-800 dark:text-emerald-300/90 font-medium mt-0.5 break-words">
                    Issued to <strong>{result.studentName}</strong> for completing{" "}
                    <strong>{result.courseName}</strong> on {formattedDate}.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Responsive Equal Grid on Mobile, Flex on Desktop */}
              <div className="grid grid-cols-3 sm:flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={handleDownloadPNG}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-bold text-white shadow-xs cursor-pointer transition-colors text-center"
                >
                  <Download className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xs:inline">Download</span>
                  <span>PNG</span>
                </button>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl bg-[#1E5EFF] hover:bg-blue-700 py-2.5 px-2 sm:px-3.5 text-[11px] sm:text-xs font-bold text-white shadow-xs cursor-pointer transition-colors text-center"
                >
                  <Printer className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden xs:inline">Print</span>
                  <span>PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex items-center justify-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-2.5 px-2 sm:px-3 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 shadow-xs cursor-pointer transition-colors text-center"
                  title="Copy verification link"
                >
                  {copied ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" /> : <Copy className="h-3.5 w-3.5 shrink-0" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
              </div>
            </div>

            {/* Privacy & Security Guarantee Banner */}
            <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/20 p-3.5 sm:p-4 flex items-start gap-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600 dark:bg-blue-400/10 dark:text-blue-400 mt-0.5">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex flex-wrap items-center gap-2">
                  <span>Public Credential Ledger · Account Privacy Guaranteed</span>
                  <span className="text-[10px] rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5">
                    100% Isolated
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  This public verification link allows employers, universities, and LinkedIn recruiters to confirm course completion authenticity. <strong>No student account access, passwords, login sessions, or sensitive personal data are exposed.</strong> The student account remains completely isolated, encrypted, and secure.
                </p>
              </div>
            </div>

            {/* Official Document Certificate Card */}
            <div className="rounded-2xl sm:rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 sm:p-4 shadow-xl overflow-hidden">
              <div
                id="printable-certificate-area"
                className="relative rounded-xl sm:rounded-2xl border-2 sm:border-4 border-[#1E40AF] p-4 sm:p-10 text-slate-900 bg-gradient-to-br from-[#FAFCFF] via-[#F3F7FD] to-[#EAF1FC] overflow-hidden select-none"
              >
                {/* Inner Gold Border */}
                <div className="pointer-events-none absolute inset-2 sm:inset-4 rounded-lg sm:rounded-xl border border-amber-500/70" />

                {/* Corner Flourishes */}
                <div className="pointer-events-none absolute top-3 sm:top-5 left-3 sm:left-5 h-4 sm:h-6 w-4 sm:w-6 border-t-2 border-l-2 border-amber-500" />
                <div className="pointer-events-none absolute top-3 sm:top-5 right-3 sm:right-5 h-4 sm:h-6 w-4 sm:w-6 border-t-2 border-r-2 border-amber-500" />
                <div className="pointer-events-none absolute bottom-3 sm:bottom-5 left-3 sm:left-5 h-4 sm:h-6 w-4 sm:w-6 border-b-2 border-l-2 border-amber-500" />
                <div className="pointer-events-none absolute bottom-3 sm:bottom-5 right-3 sm:right-5 h-4 sm:h-6 w-4 sm:w-6 border-b-2 border-r-2 border-amber-500" />

                {/* Subtle Watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.035] select-none">
                  <div className="text-5xl sm:text-8xl md:text-9xl font-black rotate-[-15deg] tracking-widest text-blue-950">
                    JKS LEARNING
                  </div>
                </div>

                <div className="relative z-10 flex flex-col items-center text-center space-y-3 sm:space-y-4 px-1 sm:px-6 py-2">
                  {/* Logo / Header */}
                  <div className="flex items-center justify-center">
                    <img
                      src="/images/jks-logo.png"
                      alt="JKS Learning Technologies Institute"
                      className="h-8 sm:h-12 w-auto max-w-[200px] sm:max-w-[240px] object-contain select-none"
                      style={{ filter: "none", display: "block" }}
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#1E40AF]">
                      JKS Learning Technologies Institute
                    </div>
                    <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-950 tracking-tight font-serif">
                      Certificate of Course Mastery
                    </h2>
                    <div className="h-0.5 w-24 sm:w-36 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-1" />
                  </div>

                  <p className="text-[11px] sm:text-sm text-slate-600 font-medium italic">
                    This is to certify and officially attest that
                  </p>

                  <div className="space-y-1 max-w-full">
                    <div className="text-xl sm:text-3xl md:text-4xl font-black text-[#1E3A8A] font-serif tracking-wide underline decoration-amber-400 decoration-2 underline-offset-6 break-words">
                      {result.studentName}
                    </div>
                  </div>

                  <p className="text-[11px] sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                    has successfully completed 100% of the structured curriculum, practical coding assessments, and enterprise architecture capstones for
                  </p>

                  <div className="rounded-xl border border-blue-200 bg-blue-50/80 px-4 sm:px-6 py-1.5 sm:py-2 shadow-xs max-w-full">
                    <span className="text-sm sm:text-base md:text-lg font-bold text-slate-950 tracking-tight break-words">
                      {result.courseName}
                    </span>
                  </div>

                  <div className="text-[11px] sm:text-xs text-emerald-800 font-semibold flex items-center gap-1.5 justify-center">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    <span>{result.grade || "Mastery & Stage Completion (100%)"} · Verified Candidate</span>
                  </div>

                  {/* Certificate Footer Row — Mobile Fluid & Desktop 3-Column */}
                  <div className="w-full pt-4 sm:pt-8 border-t border-slate-300">
                    {/* Mobile Layout (< sm): Eliminates 4-line squished wrapping */}
                    <div className="sm:hidden space-y-3">
                      {/* Official Seal in Center */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white shadow-md p-0.5 border-2 border-white">
                          <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-amber-100 flex-col">
                            <ShieldCheck className="h-5 w-5 text-white" />
                          </div>
                        </div>
                        <span className="text-[8px] font-bold uppercase tracking-wider text-amber-700 mt-1">
                          Official Seal · Accredited
                        </span>
                      </div>

                      {/* Credentials & Signature Row */}
                      <div className="flex items-end justify-between gap-2 text-xs pt-1">
                        <div className="text-left space-y-0.5 flex-1 min-w-0 pr-2">
                          <div className="font-mono text-[10px] font-bold text-[#1E40AF] break-all leading-snug">
                            ID: {result.verificationId || activeCertId}
                          </div>
                          <div className="text-[10px] text-slate-500 font-medium">
                            Issued: {formattedDate}
                          </div>
                          <div className="text-[8px] text-slate-400 font-mono">
                            SHA-256 Verified Ledger
                          </div>
                        </div>

                        <div className="text-right space-y-0.5 shrink-0 pl-2">
                          <div className="font-serif italic font-black text-slate-900 text-xs sm:text-sm">
                            Dr. J. K. Sundaram
                          </div>
                          <div className="text-[9px] font-bold text-slate-700 uppercase tracking-wider">
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
                        <div className="font-mono text-xs font-bold text-[#1E40AF] break-all">
                          ID: {result.verificationId || activeCertId}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          Issued: {formattedDate}
                        </div>
                        <div className="text-[9px] text-slate-400 font-mono">
                          SHA-256 Verified Ledger
                        </div>
                      </div>

                      {/* Center Column: Golden Certified Seal */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="flex h-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-white shadow-md p-1 border-2 border-white">
                          <div className="flex h-full w-full items-center justify-center rounded-full border border-dashed border-amber-100 flex-col">
                            <ShieldCheck className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-700 mt-1">
                          Official Seal
                        </span>
                      </div>

                      {/* Right Column: Signature of Director */}
                      <div className="text-right space-y-0.5">
                        <div className="font-serif italic font-black text-slate-900 text-sm sm:text-base">
                          Dr. J. K. Sundaram
                        </div>
                        <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
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

            {/* Credential Metadata Box */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-4">
                Credential Verification Ledger Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Recipient</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-white">{result.studentName}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Issuing Entity</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-white">JKS Learning Technologies</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Record Timestamp</div>
                  <div className="mt-1 font-bold text-slate-900 dark:text-white">{formattedDate}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
                  <div className="text-slate-500 dark:text-slate-400 font-medium">Tamper-Proof Status</div>
                  <div className="mt-1 font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Authentic &amp; Active
                  </div>
                </div>
              </div>

              {result.courseSlug && (
                <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    Want to explore the curriculum for this verified track?
                  </span>
                  <Link
                    href={`/courses/${result.courseSlug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E5EFF] dark:text-blue-400 hover:underline"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>View Course Details &amp; Syllabus</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
