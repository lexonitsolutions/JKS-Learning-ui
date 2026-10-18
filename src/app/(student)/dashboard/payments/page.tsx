"use client";

import { formatINR, formatINRCompact } from "@/lib/utils/format-money";
import React, { useState, useMemo, useEffect } from "react";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Download,
  Search,
  X,
  Layers,
  Filter,
  Gift,
  Copy,
  Check,
  Share2,
  Calendar,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Receipt,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { getStoredInvoices, type Invoice } from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";
import { CustomDropdown, type DropdownOption } from "@/components/ui/custom-dropdown";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";
import {
  fetchMyFinancialSummary,
  type StudentPersonalSummary,
} from "@/lib/data/payments-api";
import {
  fetchMyReferralStats,
  type StudentReferralStats,
} from "@/lib/data/referrals-api";
import { StudentPayModal } from "@/components/dashboard/student-pay-modal";

export default function StudentPaymentsDashboardPage() {
  const session = useMockSession();
  const { user: clerkUser } = useUser();

  const studentEmail = (
    clerkUser?.primaryEmailAddress?.emailAddress ||
    session?.email ||
    ""
  ).toLowerCase().trim();
  const studentName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    session?.name ||
    "Student";

  const [activeTab, setActiveTab] = useState<"courses" | "installments" | "referrals" | "invoices">("courses");
  const [isLoading, setIsLoading] = useState(true);
  const [financialSummary, setFinancialSummary] = useState<StudentPersonalSummary | null>(null);
  const [referralStats, setReferralStats] = useState<StudentReferralStats | null>(null);

  // Invoices & search
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>("ALL");

  // Payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [selectedPayEnrollment, setSelectedPayEnrollment] = useState<any | null>(null);
  const [selectedInstallmentItem, setSelectedInstallmentItem] = useState<any | null>(null);

  // Referral copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    // Load local stored invoices first
    const stored = getStoredInvoices();
    setInvoices(stored);

    try {
      const [finRes, refRes] = await Promise.allSettled([
        fetchMyFinancialSummary(),
        fetchMyReferralStats(),
      ]);

      if (finRes.status === "fulfilled" && finRes.value) {
        setFinancialSummary(finRes.value);
      }
      if (refRes.status === "fulfilled" && refRes.value) {
        setReferralStats(refRes.value);
      }
    } catch (err) {
      console.warn("Could not load remote financial summary, relying on local records:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    const handleUpdate = () => loadData();
    window.addEventListener("jks_payment_completed", handleUpdate);
    window.addEventListener("jks_enrollment_updated", handleUpdate);
    return () => {
      window.removeEventListener("jks_payment_completed", handleUpdate);
      window.removeEventListener("jks_enrollment_updated", handleUpdate);
    };
  }, []);

  // Aggregated totals across remote data or fallback local invoices
  const totalAgreed = useMemo(() => {
    if (financialSummary && financialSummary.courses.length > 0) {
      return financialSummary.totalAgreedRupees;
    }
    return invoices.reduce((sum, inv) => sum + (inv.subtotal || inv.totalAmount), 0);
  }, [financialSummary, invoices]);

  const totalPaid = useMemo(() => {
    if (financialSummary && financialSummary.courses.length > 0) {
      return financialSummary.totalPaidRupees;
    }
    return invoices
      .filter((inv) => inv.paymentStatus === "Paid")
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
  }, [financialSummary, invoices]);

  const totalOutstanding = useMemo(() => {
    if (financialSummary && financialSummary.courses.length > 0) {
      return financialSummary.outstandingBalanceRupees;
    }
    return Math.max(0, totalAgreed - totalPaid);
  }, [financialSummary, totalAgreed, totalPaid]);

  // Enrolled courses list
  const coursesList = useMemo(() => {
    if (financialSummary && financialSummary.courses.length > 0) {
      return financialSummary.courses;
    }
    // Synthesize from stored invoices if remote backend has no enrollments yet
    const courseMap: Record<string, any> = {};
    invoices.forEach((inv) => {
      const slug = inv.items[0]?.courseSlug || "course-track";
      const title = inv.items[0]?.description || (inv as any).courseTitle || "Enrolled Course";
      if (!courseMap[slug]) {
        courseMap[slug] = {
          enrollmentId: inv.id,
          courseId: slug,
          courseTitle: title,
          courseSlug: slug,
          standardPriceRupees: inv.subtotal || inv.totalAmount,
          agreedFeeRupees: inv.totalAmount,
          discountRupees: inv.discountAmount || 0,
          paidRupees: inv.paymentStatus === "Paid" ? inv.totalAmount : 0,
          outstandingBalanceRupees: inv.paymentStatus === "Paid" ? 0 : inv.totalAmount,
          feeStatus: inv.paymentStatus === "Paid" ? "FULL_PAID" : "PENDING",
          hasInstallmentPlan: false,
          installmentPlan: null,
          payments: [
            {
              id: inv.id,
              amountRupees: inv.totalAmount,
              status: inv.paymentStatus,
              type: "FULL",
              date: inv.issueDate,
              transactionRef: inv.transactionRef,
            },
          ],
        };
      }
    });
    return Object.values(courseMap);
  }, [financialSummary, invoices]);

  // Installments list across all courses
  const allInstallmentPlans = useMemo(() => {
    return coursesList
      .filter((c) => c.installmentPlan && c.installmentPlan.items?.length > 0)
      .map((c) => ({
        courseTitle: c.courseTitle,
        courseSlug: c.courseSlug,
        enrollmentId: c.enrollmentId,
        agreedFeeRupees: c.agreedFeeRupees,
        paidRupees: c.paidRupees,
        outstandingBalanceRupees: c.outstandingBalanceRupees,
        plan: c.installmentPlan!,
      }));
  }, [coursesList]);

  // Referral code details
  const referralCode = referralStats?.code || `REF-${(studentName.split(" ")[0] || "LEARN").toUpperCase()}-2026`;
  const shareableReferralLink = typeof window !== "undefined"
    ? `${window.location.origin}/register-course?ref=${referralCode}`
    : `https://jkslearning.com/register-course?ref=${referralCode}`;

  const copyToClipboard = (text: string, type: "code" | "link") => {
    navigator.clipboard.writeText(text);
    if (type === "code") {
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } else {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Filter options for Invoices Table
  const courseOptions: DropdownOption[] = useMemo(() => {
    const counts: Record<string, number> = {};
    invoices.forEach((inv) => {
      const desc = inv.items[0]?.description || (inv as any).courseTitle || "Enrolled Course";
      counts[desc] = (counts[desc] || 0) + 1;
    });
    const list: DropdownOption[] = [
      { value: "ALL", label: `All Courses (${invoices.length})` },
    ];
    Object.entries(counts).forEach(([title, count]) => {
      list.push({ value: title, label: title, count });
    });
    return list;
  }, [invoices]);

  const statusOptions: DropdownOption[] = useMemo(() => {
    const paidCount = invoices.filter((i) => i.paymentStatus === "Paid").length;
    const pendingCount = invoices.filter((i) => i.paymentStatus === "Pending").length;
    return [
      { value: "All", label: `All Invoices (${invoices.length})` },
      { value: "Paid", label: "Paid", count: paidCount },
      { value: "Pending", label: "Pending", count: pendingCount },
    ];
  }, [invoices]);

  const filteredInvoices = invoices.filter((p) => {
    const matchStatus = filterStatus === "All" || p.paymentStatus === filterStatus;
    const courseDesc = p.items[0]?.description || (p as any).courseTitle || "Enrolled Course";
    const matchCourse = selectedCourseFilter === "ALL" || courseDesc === selectedCourseFilter;
    const matchSearch =
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCourse && matchSearch;
  });

  return (
    <>
      <DashboardTopbar
        title="Student Fee & Payment Center"
        subtitle="Manage your agreed course fees, installment payments, referral rewards, and official invoices"
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top KPI Summary Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TiltCard>
            <div className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Agreed Fees</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#1E5EFF] dark:bg-blue-950/60 dark:text-blue-400">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white font-mono">
                {formatINRCompact(totalAgreed)}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {coursesList.length} enrolled {coursesList.length === 1 ? "track" : "tracks"}
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Amount Paid</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {formatINRCompact(totalPaid)}
              </div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Verified payments
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Outstanding Balance</span>
                <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${
                  totalOutstanding > 0
                    ? "bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400"
                    : "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400"
                }`}>
                  {totalOutstanding > 0 ? <Clock className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                </div>
              </div>
              <div className={`mt-2 text-2xl font-black font-mono ${
                totalOutstanding > 0 ? "text-amber-600 dark:text-amber-400" : "text-emerald-600 dark:text-emerald-400"
              }`}>
                {formatINRCompact(totalOutstanding)}
              </div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                {totalOutstanding > 0 ? "Payable via EMI or direct" : "All fees cleared"}
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[22px] border border-white/70 bg-white/80 p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Referral Rewards</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400">
                  <Gift className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-black text-purple-600 dark:text-purple-400 font-mono">
                {formatINRCompact(referralStats?.totalRewardEarnedRupees || 0)}
              </div>
              <div className="mt-1 text-xs text-purple-600 dark:text-purple-400 font-semibold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>₹1,000 per verified friend</span>
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("courses")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "courses"
                ? "bg-[#0B1F3A] text-white shadow-md dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Course Fees &amp; Balances</span>
            <span className="rounded-full bg-blue-500/20 px-1.5 py-0.2 text-[10px] font-bold">
              {coursesList.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("installments")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "installments"
                ? "bg-[#0B1F3A] text-white shadow-md dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Calendar className="h-3.5 w-3.5" />
            <span>EMI &amp; Installment Schedules</span>
            {allInstallmentPlans.length > 0 && (
              <span className="rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 px-1.5 py-0.2 text-[10px] font-bold">
                {allInstallmentPlans.length} active
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("referrals")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "referrals"
                ? "bg-[#0B1F3A] text-white shadow-md dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Gift className="h-3.5 w-3.5" />
            <span>Refer &amp; Earn Rewards</span>
            <span className="rounded-full bg-purple-500/20 text-purple-600 dark:text-purple-400 px-1.5 py-0.2 text-[10px] font-bold">
              Earn ₹1,000
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === "invoices"
                ? "bg-[#0B1F3A] text-white shadow-md dark:bg-white dark:text-slate-900"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
            }`}
          >
            <Receipt className="h-3.5 w-3.5" />
            <span>Official Invoices &amp; Receipts</span>
            <span className="rounded-full bg-slate-200 dark:bg-slate-700 px-1.5 py-0.2 text-[10px] font-bold">
              {invoices.length}
            </span>
          </button>
        </div>

        {/* ── TAB 1: Enrolled Courses & Fee Breakdown ──────────────── */}
        {activeTab === "courses" && (
          <div className="space-y-4">
            {coursesList.length === 0 ? (
              <div className="rounded-[22px] border border-slate-200/80 bg-white p-12 text-center dark:border-slate-800 dark:bg-surface-secondary">
                <CreditCard className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Active Enrollments Found</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  You are not yet enrolled in any paid course tracks. Browse our career tracks to begin your learning journey.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5">
                {coursesList.map((course) => {
                  const percentPaid = course.agreedFeeRupees > 0
                    ? Math.min(100, Math.round((course.paidRupees / course.agreedFeeRupees) * 100))
                    : 100;
                  const isFullyPaid = course.outstandingBalanceRupees <= 0 || course.feeStatus === "FULL_PAID";

                  return (
                    <div
                      key={course.enrollmentId || course.courseSlug}
                      className="rounded-[22px] border border-white/80 bg-white/90 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90"
                    >
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                              {course.courseTitle}
                            </h3>
                            <span
                              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                                isFullyPaid
                                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                  : course.feeStatus === "OVERDUE"
                                  ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200 dark:border-rose-800"
                                  : "bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                              }`}
                            >
                              {isFullyPaid ? "Fully Paid" : course.feeStatus === "OVERDUE" ? "Overdue Installment" : "Partially Paid"}
                            </span>
                            {course.hasInstallmentPlan && (
                              <span className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-2 py-0.5 text-[10px] font-bold">
                                EMI Plan Active
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Course Track: <span className="font-medium text-slate-700 dark:text-slate-300">{course.courseSlug}</span>
                          </p>
                        </div>

                        {/* Action CTA */}
                        {!isFullyPaid && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPayEnrollment(course);
                                setSelectedInstallmentItem(null);
                                setPayModalOpen(true);
                              }}
                              className="flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-600 transition-all cursor-pointer"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              <span>Pay Outstanding ({formatINR(course.outstandingBalanceRupees)})</span>
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Financial Figures Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 pt-4 text-xs">
                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-surface-elevated">
                          <span className="text-[11px] text-slate-400 font-semibold block">Standard Course Fee</span>
                          <span className="font-mono font-bold text-sm text-slate-700 dark:text-slate-300 mt-0.5 block">
                            {formatINR(course.standardPriceRupees)}
                          </span>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-3 dark:bg-surface-elevated">
                          <span className="text-[11px] text-slate-400 font-semibold block">Discounts / Scholarship</span>
                          <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            - {formatINR(course.discountRupees)}
                          </span>
                        </div>

                        <div className="rounded-xl bg-blue-50/70 p-3 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/40">
                          <span className="text-[11px] text-blue-700 dark:text-blue-300 font-bold block">Final Agreed Fee</span>
                          <span className="font-mono font-extrabold text-sm text-blue-900 dark:text-blue-200 mt-0.5 block">
                            {formatINR(course.agreedFeeRupees)}
                          </span>
                        </div>

                        <div className={`rounded-xl p-3 border ${
                          isFullyPaid
                            ? "bg-emerald-50/70 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800/40"
                            : "bg-amber-50/70 border-amber-200 dark:bg-amber-950/30 dark:border-amber-800/40"
                        }`}>
                          <span className={`text-[11px] font-bold block ${isFullyPaid ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}`}>
                            {isFullyPaid ? "Balance Cleared" : "Outstanding Balance"}
                          </span>
                          <span className={`font-mono font-extrabold text-sm mt-0.5 block ${isFullyPaid ? "text-emerald-700 dark:text-emerald-300" : "text-amber-800 dark:text-amber-200"}`}>
                            {formatINR(course.outstandingBalanceRupees)}
                          </span>
                        </div>
                      </div>

                      {/* Payment Progress Bar */}
                      <div className="pt-4 space-y-1.5">
                        <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400">
                          <span>Paid: <strong className="font-mono text-slate-900 dark:text-white">{formatINR(course.paidRupees)}</strong></span>
                          <span>Progress: <strong className="font-mono text-slate-900 dark:text-white">{percentPaid}%</strong></span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 rounded-full ${
                              isFullyPaid
                                ? "bg-emerald-500"
                                : percentPaid > 50
                                ? "bg-[#1E5EFF]"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${percentPaid}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── TAB 2: EMI & Installment Schedules ───────────────────── */}
        {activeTab === "installments" && (
          <div className="space-y-6">
            {allInstallmentPlans.length === 0 ? (
              <div className="rounded-[22px] border border-slate-200/80 bg-white p-12 text-center dark:border-slate-800 dark:bg-surface-secondary">
                <Calendar className="h-10 w-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">No Active EMI Schedules</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
                  You are currently not on an installment plan. If you would like to split your tuition into monthly installments, please contact administration.
                </p>
              </div>
            ) : (
              allInstallmentPlans.map((item) => (
                <div
                  key={item.plan.id}
                  className="rounded-[22px] border border-white/80 bg-white/90 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#1E5EFF] dark:text-blue-400">
                          {item.plan.frequency} EMI Plan
                        </span>
                        <span className="rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 text-[10px] font-bold px-2 py-0.5 border border-blue-200 dark:border-blue-800">
                          {item.plan.status}
                        </span>
                      </div>
                      <h4 className="text-base font-extrabold text-slate-900 dark:text-white mt-1">
                        {item.courseTitle}
                      </h4>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-400 font-semibold">Remaining Plan Balance</div>
                      <div className="font-mono font-black text-base text-amber-600 dark:text-amber-400">
                        {formatINR(item.outstandingBalanceRupees)}
                      </div>
                    </div>
                  </div>

                  {/* Installment Items Timeline */}
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                    {item.plan.items.map((inst: any) => {
                      const isInstPaid = inst.status === "PAID";
                      const isOverdue = inst.status === "OVERDUE";
                      const dueDate = new Date(inst.dueDate);
                      const isPast = dueDate.getTime() < Date.now();

                      return (
                        <div
                          key={inst.id}
                          className={`rounded-2xl border p-4 space-y-3 transition-all ${
                            isInstPaid
                              ? "border-emerald-200 bg-emerald-50/40 dark:border-emerald-900/40 dark:bg-emerald-950/20"
                              : isOverdue || isPast
                              ? "border-rose-200 bg-rose-50/40 dark:border-rose-900/40 dark:bg-rose-950/20 ring-1 ring-rose-300/40"
                              : "border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-elevated"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-900 dark:text-white">
                              Installment #{inst.installmentNumber}
                            </span>
                            <span
                              className={`rounded-full px-2 py-0.5 text-[10px] font-extrabold uppercase ${
                                isInstPaid
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300"
                                  : isOverdue || isPast
                                  ? "bg-rose-100 text-rose-800 dark:bg-rose-900/60 dark:text-rose-300"
                                  : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                              }`}
                            >
                              {inst.status}
                            </span>
                          </div>

                          <div className="space-y-1">
                            <div className="font-mono font-black text-lg text-slate-900 dark:text-white">
                              {formatINR(inst.amountRupees)}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              <span>Due: {dueDate.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                            </div>
                          </div>

                          {!isInstPaid ? (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPayEnrollment({
                                  enrollmentId: item.enrollmentId,
                                  courseSlug: item.courseSlug,
                                  courseTitle: item.courseTitle,
                                  agreedFeeRupees: item.agreedFeeRupees,
                                  paidRupees: item.paidRupees,
                                  outstandingBalanceRupees: item.outstandingBalanceRupees,
                                });
                                setSelectedInstallmentItem(inst);
                                setPayModalOpen(true);
                              }}
                              className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#1E5EFF] py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-600 transition-colors cursor-pointer"
                            >
                              <CreditCard className="h-3.5 w-3.5" />
                              <span>Pay Installment ({formatINR(inst.amountRupees)})</span>
                            </button>
                          ) : (
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 pt-1">
                              <CheckCircle2 className="h-4 w-4" />
                              <span>Paid &amp; Verified</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── TAB 3: Refer & Earn Rewards (Referral Hub) ───────────── */}
        {activeTab === "referrals" && (
          <div className="space-y-6">
            {/* Referral Hero Banner */}
            <div className="rounded-[26px] border border-purple-200/90 bg-gradient-to-br from-[#0B1F3A] to-[#1a3a68] p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10 max-w-2xl space-y-3">
                <div className="inline-flex items-center gap-1.5 rounded-full bg-purple-500/30 border border-purple-400/40 px-3.5 py-1 text-xs font-bold text-purple-200">
                  <Gift className="h-3.5 w-3.5 text-purple-300" /> JKS Student Referral Program
                </div>
                <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                  Give ₹1,000 Discount. Earn ₹1,000 Reward.
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Share your unique referral code or link with friends. When they enroll in any JKS Learning professional track and verify their payment, they receive an instant ₹1,000 fee reduction and you earn a ₹1,000 verified monetary reward.
                </p>

                {/* Share Actions Box */}
                <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-white/10 border border-white/20 p-2 sm:px-4 sm:py-2.5 backdrop-blur-md">
                    <span className="text-xs text-slate-300 font-semibold">Your Referral Code:</span>
                    <span className="font-mono font-black text-sm text-yellow-300 tracking-wider">
                      {referralCode}
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(referralCode, "code")}
                      className="ml-auto flex items-center gap-1 rounded-xl bg-white/20 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-white/30 transition-colors cursor-pointer"
                    >
                      {copiedCode ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copiedCode ? "Copied" : "Copy"}</span>
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard(shareableReferralLink, "link")}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-[#1E5EFF] px-5 py-3 text-xs font-bold text-white shadow-lg hover:bg-blue-600 transition-all cursor-pointer"
                  >
                    {copiedLink ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
                    <span>{copiedLink ? "Link Copied!" : "Copy Shareable Link"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Referral Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-surface-secondary shadow-xs">
                <span className="text-[11px] text-slate-400 font-semibold">Friends Invited</span>
                <span className="font-mono font-black text-xl text-slate-900 dark:text-white mt-1 block">
                  {referralStats?.totalReferrals || 0}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 block">Via your referral link</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-surface-secondary shadow-xs">
                <span className="text-[11px] text-slate-400 font-semibold">Enrolled &amp; Verified</span>
                <span className="font-mono font-black text-xl text-emerald-600 dark:text-emerald-400 mt-1 block">
                  {referralStats?.totalSuccessfulEnrollments || 0}
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 block">Eligible for rewards</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-surface-secondary shadow-xs">
                <span className="text-[11px] text-slate-400 font-semibold">Pending Rewards</span>
                <span className="font-mono font-black text-xl text-amber-600 dark:text-amber-400 mt-1 block">
                  {formatINR(referralStats?.pendingRewardsRupees || 0)}
                </span>
                <span className="text-[10px] text-amber-600 dark:text-amber-400 mt-0.5 block">Under admin review</span>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-surface-secondary shadow-xs">
                <span className="text-[11px] text-slate-400 font-semibold">Paid Out / Credited</span>
                <span className="font-mono font-black text-xl text-purple-600 dark:text-purple-400 mt-1 block">
                  {formatINR(referralStats?.paidOutRewardsRupees || 0)}
                </span>
                <span className="text-[10px] text-purple-600 dark:text-purple-400 mt-0.5 block">Received monetary credit</span>
              </div>
            </div>

            {/* Referral History Table */}
            <div className="rounded-[22px] border border-white/80 bg-white/90 p-5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Friend Referral Records
              </h4>

              {(!referralStats?.referralHistory || referralStats.referralHistory.length === 0) ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  No friends have enrolled with your code yet. Share your code to start earning rewards!
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs min-w-[500px]">
                    <thead>
                      <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                        <th className="pb-3">Friend Name</th>
                        <th className="pb-3 px-3">Course Enrolled</th>
                        <th className="pb-3 px-3">Friend Discount</th>
                        <th className="pb-3 px-3">Your Reward</th>
                        <th className="pb-3 px-3 text-center">Reward Status</th>
                        <th className="pb-3 text-right">Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {referralStats.referralHistory.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-surface-elevated">
                          <td className="py-3 font-semibold text-slate-900 dark:text-white">{item.friendName}</td>
                          <td className="py-3 px-3 text-slate-600 dark:text-slate-300">{item.courseTitle}</td>
                          <td className="py-3 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                            ₹{item.refereeDiscount}
                          </td>
                          <td className="py-3 px-3 font-mono text-purple-600 dark:text-purple-400 font-bold">
                            ₹{item.rewardAmount}
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-extrabold ${
                              item.status === "APPROVED"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                                : item.status === "REJECTED"
                                ? "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 text-right text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString("en-IN")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 4: Invoices & Receipts ────────────────────────────── */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary p-3 shadow-xs">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search by invoice #, course name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-input-bg pl-10 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#1E5EFF]"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CustomDropdown
                  options={courseOptions}
                  value={selectedCourseFilter}
                  onChange={(val) => setSelectedCourseFilter(val)}
                  placeholder="Filter by Course"
                  icon={<Layers className="h-3.5 w-3.5 text-[#1E5EFF] dark:text-blue-400" />}
                  searchable={courseOptions.length > 5}
                  minWidth="min-w-[190px] max-w-[260px]"
                />

                <CustomDropdown
                  options={statusOptions}
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val)}
                  placeholder="Status"
                  icon={<Filter className="h-3.5 w-3.5 text-[#1E5EFF] dark:text-blue-400" />}
                  minWidth="min-w-[130px]"
                />

                {(selectedCourseFilter !== "ALL" || filterStatus !== "All" || searchQuery) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCourseFilter("ALL");
                      setFilterStatus("All");
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400 cursor-pointer transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Reset</span>
                  </button>
                )}
              </div>
            </div>

            {/* Invoices Table */}
            <div className="rounded-[22px] border border-white/80 bg-white/90 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                      <th className="pb-3 pr-4 pl-0">Invoice #</th>
                      <th className="px-4 pb-3">Course Track</th>
                      <th className="px-4 pb-3">Amount Paid</th>
                      <th className="px-4 pb-3 text-center">Status</th>
                      <th className="px-4 pb-3">Payment Mode</th>
                      <th className="pr-0 pb-3 pl-4 text-right">Official Receipt</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                    {isLoading ? (
                      [1, 2, 3].map((i) => (
                        <tr key={i} className="animate-pulse">
                          <td className="py-4 pr-4 pl-0">
                            <div className="space-y-1.5">
                              <div className="h-3.5 w-24 rounded bg-slate-200 dark:bg-slate-800" />
                              <div className="h-2.5 w-16 rounded bg-slate-100 dark:bg-slate-800/60" />
                            </div>
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-3.5 w-44 rounded bg-slate-200 dark:bg-slate-800" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-3.5 w-20 rounded bg-slate-200 dark:bg-slate-800" />
                          </td>
                          <td className="px-4 py-4 text-center">
                            <div className="inline-block h-5 w-16 rounded-full bg-emerald-100/70 dark:bg-emerald-950/40" />
                          </td>
                          <td className="px-4 py-4">
                            <div className="h-3.5 w-16 rounded bg-slate-200 dark:bg-slate-800" />
                          </td>
                          <td className="pr-0 py-4 pl-4 text-right">
                            <div className="inline-block h-8 w-24 rounded-xl bg-slate-200 dark:bg-slate-800" />
                          </td>
                        </tr>
                      ))
                    ) : filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                          No invoices found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="transition-all duration-200 ease-out hover:bg-slate-50/70 dark:hover:bg-white/[0.04]">
                          <td className="py-4 pr-4 pl-0 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {inv.invoiceNumber}
                            <div className="text-[10px] text-slate-400 font-normal">
                              {new Date(inv.issueDate).toLocaleDateString("en-IN")}
                            </div>
                          </td>
                          <td className="px-4 py-4 font-medium text-slate-700 dark:text-slate-300">
                            {inv.items[0]?.description || (inv as any).courseTitle || "Enrolled Course"}
                          </td>
                          <td className="px-4 py-4 font-mono font-bold text-slate-900 dark:text-white whitespace-nowrap">
                            {formatINR(inv.totalAmount)}
                          </td>
                          <td className="px-4 py-4 text-center whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                              inv.paymentStatus === "Paid"
                                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border dark:border-emerald-800/40"
                                : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:border dark:border-amber-800/40"
                            }`}>
                              <CheckCircle2 className="h-3 w-3" />
                              {inv.paymentStatus}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                            {inv.paymentMode}
                          </td>
                          <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#1E5EFF] hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                            >
                              <Download className="h-3.5 w-3.5" /> View &amp; PDF
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Modal for Viewing and Printing */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Student Payment Modal */}
      <StudentPayModal
        isOpen={payModalOpen}
        onClose={() => {
          setPayModalOpen(false);
          setSelectedPayEnrollment(null);
          setSelectedInstallmentItem(null);
        }}
        onSuccess={() => {
          setPayModalOpen(false);
          setSelectedPayEnrollment(null);
          setSelectedInstallmentItem(null);
          loadData();
        }}
        enrollment={selectedPayEnrollment}
        installmentItem={selectedInstallmentItem}
        studentName={studentName}
        studentEmail={studentEmail}
      />
    </>
  );
}
