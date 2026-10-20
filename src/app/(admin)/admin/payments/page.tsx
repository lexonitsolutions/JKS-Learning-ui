"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { formatINR, formatINRCompact } from "@/lib/utils/format-money";
import {
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Download,
  Plus,
  Printer,
  Search,
  X,
  Layers,
  Filter,
  RefreshCw,
  Users,
  Calendar,
  AlertTriangle,
  Gift,
  Ticket,
  FileText,
  DollarSign,
  Clock,
  ArrowRight,
  ShieldCheck,
  Check,
  Send,
  Loader2,
  Edit2,
  Receipt,
  HelpCircle,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  fetchInvoicesFromApi,
  createInvoice,
  isFreeInvoice,
  isSettledRevenue,
  isInMonth,
  getInvoiceStatusLabel,
  type Invoice,
} from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";
import { CouponManager } from "@/components/admin/coupon-manager";
import { CustomDropdown, type DropdownOption } from "@/components/ui/custom-dropdown";
import { fetchDbCourses } from "@/lib/data/courses";
import {
  fetchAdminPaymentOverview,
  fetchStudentsWithFinancials,
  recordManualPayment,
  updateStudentFee,
  createOrUpdateInstallmentPlan,
  type AdminFinancialOverview,
  type StudentFinancialRecord,
} from "@/lib/data/payments-api";
import {
  fetchAdminReferralRewards,
  approveReferralReward,
  rejectReferralReward,
  recordReferralPayout,
  type AdminReferralReward,
} from "@/lib/data/referrals-api";
import {
  getPendingPayments,
  approvePendingPayment,
  rejectPendingPayment,
  type PendingPaymentSubmission,
} from "@/lib/data/pending-payments-store";

type TabType = "students" | "referrals" | "coupons" | "invoices";

export default function AdminPaymentsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("students");

  // Overview Metrics from Backend
  const [overview, setOverview] = useState<AdminFinancialOverview | null>(null);
  const [loadingOverview, setLoadingOverview] = useState(true);

  // Pending Installment & Payment Approvals
  const [pendingPayments, setPendingPayments] = useState<PendingPaymentSubmission[]>([]);

  // Student Financial Records from Backend
  const [students, setStudents] = useState<StudentFinancialRecord[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedFeeStatus, setSelectedFeeStatus] = useState("All");
  const [selectedCourseSlug, setSelectedCourseSlug] = useState("ALL");

  // Referral Rewards from Backend
  const [rewards, setRewards] = useState<AdminReferralReward[]>([]);
  const [loadingRewards, setLoadingRewards] = useState(false);
  const [rewardStatusFilter, setRewardStatusFilter] = useState("All");

  // Invoices
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingInvoices, setLoadingInvoices] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [invoiceFilterStatus, setInvoiceFilterStatus] = useState("All");
  const [invoiceCourseFilter, setInvoiceCourseFilter] = useState("ALL");
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState("");

  // Modals for Student Operations
  const [selectedStudentForPayment, setSelectedStudentForPayment] = useState<StudentFinancialRecord | null>(null);
  const [selectedStudentForFee, setSelectedStudentForFee] = useState<StudentFinancialRecord | null>(null);
  const [selectedStudentForEmi, setSelectedStudentForEmi] = useState<StudentFinancialRecord | null>(null);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<StudentFinancialRecord | null>(null);

  // Manual Payment Form State
  const [manualAmount, setManualAmount] = useState<number>(0);
  const [manualMode, setManualMode] = useState("Cash");
  const [manualRef, setManualRef] = useState("");
  const [manualNotes, setManualNotes] = useState("");
  const [manualInstallmentId, setManualInstallmentId] = useState<string>("");
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Edit Fee Form State
  const [newAgreedFee, setNewAgreedFee] = useState<number>(0);
  const [feeChangeReason, setFeeChangeReason] = useState("");
  const [isSubmittingFee, setIsSubmittingFee] = useState(false);

  // Configure EMI Form State
  const [emiDownPayment, setEmiDownPayment] = useState<number>(0);
  const [emiInstallmentsCount, setEmiInstallmentsCount] = useState<number>(3);
  const [emiFrequency, setEmiFrequency] = useState<"MONTHLY" | "BIWEEKLY" | "WEEKLY">("MONTHLY");
  const [isSubmittingEmi, setIsSubmittingEmi] = useState(false);

  // Referral Rejection / Payout Dialog States
  const [rejectingReward, setRejectingReward] = useState<AdminReferralReward | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [payingReward, setPayingReward] = useState<AdminReferralReward | null>(null);
  const [payoutRefInput, setPayoutRefInput] = useState("");
  const [isSubmittingReward, setIsSubmittingReward] = useState(false);

  // Dynamic Course List for Invoices
  const [coursesList, setCoursesList] = useState<{ title: string; slug: string; price: number }[]>([
    { title: "SAP ABAP Masterclass: Reports, ALV, Forms, APIs & More", slug: "sap-abap-masterclass", price: 30000 },
    { title: "Java Full Stack Developer Mastery", slug: "java-full-stack-mastery", price: 45000 },
    { title: "Modern Frontend Engineering (React 19 & Next.js)", slug: "modern-frontend-engineering", price: 38000 },
    { title: "SAP S/4HANA Enterprise Systems", slug: "sap-s4hana-enterprise", price: 42000 },
    { title: ".NET 9 Enterprise Microservices & Cloud", slug: "dotnet-enterprise-microservices", price: 45000 },
  ]);

  // Invoice creation form
  const [invoiceForm, setInvoiceForm] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    studentCity: "Bengaluru, India",
    courseTitle: "SAP ABAP Masterclass: Reports, ALV, Forms, APIs & More",
    courseSlug: "sap-abap-masterclass",
    price: 30000,
    agreedFee: 27000,
    discount: 3000,
    discountCode: "Scholarship Deduction (PROMO)",
    paymentMode: "UPI" as Invoice["paymentMode"],
    batchTiming: "Weekday Live Evening (7:00 PM - 8:30 PM IST)",
  });

  // Load Overview & Students
  const loadOverviewAndStudents = useCallback(async () => {
    // Load local pending submissions
    setPendingPayments(getPendingPayments());

    try {
      setLoadingOverview(true);
      const data = await fetchAdminPaymentOverview();
      setOverview(data);
    } catch (err) {
      console.warn("Could not load financial overview:", err);
    } finally {
      setLoadingOverview(false);
    }

    try {
      setLoadingStudents(true);
      const list = await fetchStudentsWithFinancials({
        courseSlug: selectedCourseSlug !== "ALL" ? selectedCourseSlug : undefined,
        feeStatus: selectedFeeStatus !== "All" ? selectedFeeStatus : undefined,
        search: studentSearch.trim() || undefined,
      });
      setStudents(list);
    } catch (err) {
      console.warn("Could not load student financials:", err);
    } finally {
      setLoadingStudents(false);
    }
  }, [selectedCourseSlug, selectedFeeStatus, studentSearch]);

  const handleApprovePendingPayment = async (paymentId: string) => {
    try {
      await approvePendingPayment(paymentId, "Admin");
      setPendingPayments(getPendingPayments());
      await loadOverviewAndStudents();
      await loadInvoices();
    } catch (err) {
      console.error("Failed to approve pending payment:", err);
    }
  };

  const handleRejectPendingPayment = (paymentId: string) => {
    const reason = window.prompt("Reason for rejecting payment submission (e.g. Invalid UTR, Unverified transaction):");
    if (!reason) return;
    rejectPendingPayment(paymentId, reason, "Admin");
    setPendingPayments(getPendingPayments());
    void loadOverviewAndStudents();
  };

  const loadRewards = useCallback(async () => {
    try {
      setLoadingRewards(true);
      const list = await fetchAdminReferralRewards({
        status: rewardStatusFilter !== "All" ? rewardStatusFilter : undefined,
      });
      setRewards(list);
    } catch (err) {
      console.warn("Could not load referral rewards:", err);
    } finally {
      setLoadingRewards(false);
    }
  }, [rewardStatusFilter]);

  const loadInvoices = useCallback(async () => {
    try {
      setLoadingInvoices(true);
      const list = await fetchInvoicesFromApi();
      setInvoices(list);
    } catch (err) {
      console.warn("Could not load invoices:", err);
    } finally {
      setLoadingInvoices(false);
    }
  }, []);

  useEffect(() => {
    void loadOverviewAndStudents();

    const handleUpdate = () => {
      setPendingPayments(getPendingPayments());
      void loadOverviewAndStudents();
    };
    window.addEventListener("jks_payment_completed", handleUpdate);
    window.addEventListener("jks_enrollment_updated", handleUpdate);
    return () => {
      window.removeEventListener("jks_payment_completed", handleUpdate);
      window.removeEventListener("jks_enrollment_updated", handleUpdate);
    };
  }, [loadOverviewAndStudents]);

  useEffect(() => {
    if (activeTab === "referrals") {
      void loadRewards();
    } else if (activeTab === "invoices") {
      void loadInvoices();
    }
  }, [activeTab, loadRewards, loadInvoices]);

  useEffect(() => {
    fetchDbCourses()
      .then((dbCourses) => {
        if (Array.isArray(dbCourses) && dbCourses.length > 0) {
          const mapped = dbCourses.map((c) => ({
            title: c.title,
            slug: c.slug,
            price: typeof c.price === "number" && c.price > 0 ? c.price : 30000,
          }));
          setCoursesList((prev) => {
            const existingSlugs = new Set(mapped.map((m) => m.slug.toLowerCase()));
            const keepPrev = prev.filter((p) => !existingSlugs.has(p.slug.toLowerCase()));
            return [...mapped, ...keepPrev];
          });
        }
      })
      .catch(() => {});
  }, []);

  // Handle Manual Payment Submission
  const handleRecordManualPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForPayment || manualAmount <= 0) return;
    setIsSubmittingPayment(true);
    try {
      await recordManualPayment({
        enrollmentId: selectedStudentForPayment.enrollmentId,
        amountCents: Math.round(manualAmount * 100),
        paymentMode: manualMode,
        transactionRef: manualRef.trim() || undefined,
        notes: manualNotes.trim() || undefined,
        installmentItemId: manualInstallmentId || undefined,
      });
      setSelectedStudentForPayment(null);
      setManualAmount(0);
      setManualRef("");
      setManualNotes("");
      setManualInstallmentId("");
      await loadOverviewAndStudents();
      await loadInvoices();
    } catch (err: any) {
      alert(err?.message || "Failed to record manual payment.");
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Handle Student Fee Adjustment
  const handleUpdateStudentFee = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForFee || newAgreedFee < 0) return;
    setIsSubmittingFee(true);
    try {
      await updateStudentFee({
        enrollmentId: selectedStudentForFee.enrollmentId,
        agreedFeeCents: Math.round(newAgreedFee * 100),
        reason: feeChangeReason.trim() || "Authorized fee adjustment by administration",
      });
      setSelectedStudentForFee(null);
      setNewAgreedFee(0);
      setFeeChangeReason("");
      await loadOverviewAndStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to update student fee.");
    } finally {
      setIsSubmittingFee(false);
    }
  };

  // Handle EMI Plan Setup
  const handleConfigureEmi = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentForEmi) return;
    setIsSubmittingEmi(true);
    try {
      await createOrUpdateInstallmentPlan({
        enrollmentId: selectedStudentForEmi.enrollmentId,
        numberOfInstallments: Number(emiInstallmentsCount),
        downPaymentCents: Math.round(Number(emiDownPayment) * 100),
        frequency: emiFrequency,
      });
      setSelectedStudentForEmi(null);
      setEmiDownPayment(0);
      setEmiInstallmentsCount(3);
      await loadOverviewAndStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to configure installment plan.");
    } finally {
      setIsSubmittingEmi(false);
    }
  };

  // Handle Referral Approvals
  const handleApproveReward = async (reward: AdminReferralReward) => {
    if (!window.confirm(`Approve referral reward of ₹${+(reward.rewardAmountCents / 100).toFixed(0)} for ${reward.referrerUser.name}?`)) return;
    try {
      await approveReferralReward(reward.id);
      await loadRewards();
      await loadOverviewAndStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to approve reward.");
    }
  };

  const handleRejectReward = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingReward || !rejectReason.trim()) return;
    setIsSubmittingReward(true);
    try {
      await rejectReferralReward(rejectingReward.id, rejectReason.trim());
      setRejectingReward(null);
      setRejectReason("");
      await loadRewards();
      await loadOverviewAndStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to reject reward.");
    } finally {
      setIsSubmittingReward(false);
    }
  };

  const handleRecordPayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payingReward || !payoutRefInput.trim()) return;
    setIsSubmittingReward(true);
    try {
      await recordReferralPayout(payingReward.id, payoutRefInput.trim());
      setPayingReward(null);
      setPayoutRefInput("");
      await loadRewards();
      await loadOverviewAndStudents();
    } catch (err: any) {
      alert(err?.message || "Failed to record payout.");
    } finally {
      setIsSubmittingReward(false);
    }
  };

  // Create Invoice Modal handler
  const handleCreateInvoiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceForm.studentName || !invoiceForm.studentPhone) return;

    const discountAmount = Math.max(0, Number(invoiceForm.price) - Number(invoiceForm.agreedFee));

    const newInv = createInvoice({
      studentName: invoiceForm.studentName.trim(),
      studentEmail: invoiceForm.studentEmail.trim() || `${invoiceForm.studentName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      studentPhone: invoiceForm.studentPhone.trim(),
      studentCity: invoiceForm.studentCity.trim() || "Bengaluru, India",
      courseTitle: invoiceForm.courseTitle,
      courseSlug: invoiceForm.courseSlug,
      price: Number(invoiceForm.price),
      discount: discountAmount,
      discountCode: invoiceForm.discountCode.trim() || "Scholarship Deduction (PROMO)",
      paymentMode: invoiceForm.paymentMode,
      batchTiming: invoiceForm.batchTiming,
    });

    setShowCreateModal(false);
    loadInvoices();
    setSelectedInvoice(newInv);
  };

  // Filter options for Dropdowns
  const courseOptions: DropdownOption[] = useMemo(() => {
    const list: DropdownOption[] = [{ value: "ALL", label: "All Courses" }];
    coursesList.forEach((c) => {
      list.push({ value: c.slug, label: c.title });
    });
    return list;
  }, [coursesList]);

  const feeStatusOptions: DropdownOption[] = [
    { value: "All", label: "All Statuses" },
    { value: "FULL_PAID", label: "Fully Paid" },
    { value: "PARTIAL_PAID", label: "Partially Paid" },
    { value: "PENDING", label: "Pending" },
    { value: "OVERDUE", label: "Overdue Installments" },
  ];

  return (
    <>
      <DashboardTopbar
        title="Student Fee & Payment Management"
        subtitle="Manage dynamic student fees, installments, offline payments, referrals, and coupons with zero GST"
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top KPI Cards from Real Backend Database */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Agreed Fees</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#1E5EFF] dark:bg-blue-950/50 dark:text-blue-400">
                  <IndianRupee className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {overview ? formatINR(overview.totalAgreedFeesRupees) : "₹0"}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-medium">
                {overview?.totalEnrollmentsCount || 0} enrolled students
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Verified Collections</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {overview ? formatINR(overview.totalVerifiedPaymentsRupees) : "₹0"}
              </div>
              <div className="mt-1 text-xs text-slate-500 font-medium">
                {overview?.fullyPaidCount || 0} fully paid · {overview?.partiallyPaidCount || 0} partial
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Outstanding Balance</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400">
                  <Clock className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {overview ? formatINR(overview.totalOutstandingRupees) : "₹0"}
              </div>
              <div className="mt-1 text-xs text-rose-600 dark:text-rose-400 font-semibold">
                {overview?.overdueInstallmentsCount || 0} overdue installments
              </div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Growth Drivers</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400">
                  <Gift className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">
                {overview?.pendingReferralsCount || 0} Pending
              </div>
              <div className="mt-1 text-xs text-slate-500 font-medium">
                {overview?.activeCouponsCount || 0} active promotion coupons
              </div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
          <button
            type="button"
            onClick={() => setActiveTab("students")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "students"
                ? "bg-[#1E5EFF] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Users className="h-4 w-4" /> Student Fees &amp; EMI
            {pendingPayments.filter((p) => p.status === "PENDING_APPROVAL").length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-amber-500 text-[10px] text-white font-extrabold animate-pulse">
                {pendingPayments.filter((p) => p.status === "PENDING_APPROVAL").length} Pending
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("referrals")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "referrals"
                ? "bg-[#1E5EFF] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Gift className="h-4 w-4" /> Referrals &amp; Rewards
            {overview && overview.pendingReferralsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-500 text-[10px] text-white">
                {overview.pendingReferralsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("coupons")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "coupons"
                ? "bg-[#1E5EFF] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Ticket className="h-4 w-4" /> Coupons
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("invoices")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition ${
              activeTab === "invoices"
                ? "bg-[#1E5EFF] text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            }`}
          >
            <Receipt className="h-4 w-4" /> Official Invoices
          </button>
        </div>

        {/* ── TAB 1: STUDENT FEE MANAGEMENT ───────────────────────────────── */}
        {activeTab === "students" && (
          <div className="space-y-4">
            {/* PENDING INSTALLMENT & OFFLINE PAYMENT APPROVALS */}
            {pendingPayments.filter((p) => p.status === "PENDING_APPROVAL").length > 0 && (
              <div className="rounded-[22px] border border-amber-300 bg-gradient-to-r from-amber-50/90 to-yellow-50/70 p-5 shadow-sm dark:border-amber-900/60 dark:from-amber-950/40 dark:to-yellow-950/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300">
                      <Clock className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 dark:text-white">
                        Pending Installment &amp; Payment Submissions ({pendingPayments.filter((p) => p.status === "PENDING_APPROVAL").length})
                      </h3>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Students have submitted UTR / Transaction reference details for installment payments requiring verification.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {pendingPayments
                    .filter((p) => p.status === "PENDING_APPROVAL")
                    .map((p) => (
                      <div
                        key={p.id}
                        className="rounded-2xl border border-amber-200/90 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-surface-elevated space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/60 dark:text-amber-300">
                              {p.installmentNumber ? `Installment #${p.installmentNumber}` : "Fee Payment"}
                            </span>
                            <div className="font-extrabold text-xs text-slate-900 dark:text-white mt-1.5">{p.studentName}</div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[200px]">{p.studentEmail}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-mono font-black text-sm text-emerald-600 dark:text-emerald-400">
                              {formatINR(p.amountRupees)}
                            </div>
                            <div className="text-[10px] text-slate-400 font-semibold">{p.paymentMode}</div>
                          </div>
                        </div>

                        <div className="rounded-xl bg-slate-50 p-2.5 text-[11px] dark:bg-surface-secondary space-y-1 font-mono">
                          <div className="text-slate-500 text-[10px] font-sans">Transaction Ref / UTR:</div>
                          <div className="font-bold text-slate-900 dark:text-white select-all">{p.transactionRef}</div>
                          {p.notes && (
                            <div className="text-[10px] text-slate-500 font-sans italic pt-0.5">Note: &ldquo;{p.notes}&rdquo;</div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleApprovePendingPayment(p.id)}
                            className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white py-1.5 text-xs font-bold shadow-xs transition-colors cursor-pointer"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Approve Payment</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRejectPendingPayment(p.id)}
                            className="px-3 py-1.5 rounded-xl border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-surface-secondary">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search student by name, email, phone, or course..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-8 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
                {studentSearch && (
                  <button
                    type="button"
                    onClick={() => setStudentSearch("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <CustomDropdown
                  options={courseOptions}
                  value={selectedCourseSlug}
                  onChange={(val) => setSelectedCourseSlug(val)}
                  placeholder="Filter Course"
                  icon={<Layers className="h-3.5 w-3.5 text-[#1E5EFF]" />}
                  minWidth="min-w-[180px]"
                />

                <CustomDropdown
                  options={feeStatusOptions}
                  value={selectedFeeStatus}
                  onChange={(val) => setSelectedFeeStatus(val)}
                  placeholder="Payment Status"
                  icon={<Filter className="h-3.5 w-3.5 text-[#1E5EFF]" />}
                  minWidth="min-w-[150px]"
                />

                <button
                  type="button"
                  onClick={loadOverviewAndStudents}
                  className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300"
                  title="Refresh Records"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Students Table */}
            <div className="overflow-x-auto rounded-[20px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-secondary">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/80 text-[11px] font-bold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
                  <tr>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course Enrolled</th>
                    <th className="py-3 px-4">Standard Fee</th>
                    <th className="py-3 px-4">Agreed Fee</th>
                    <th className="py-3 px-4">Amount Paid</th>
                    <th className="py-3 px-4">Balance</th>
                    <th className="py-3 px-4">Status / EMI</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loadingStudents ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        <Loader2 className="inline h-5 w-5 animate-spin mr-2" /> Loading student financial records...
                      </td>
                    </tr>
                  ) : students.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-10 text-center text-slate-400">
                        No student payment records found matching filters.
                      </td>
                    </tr>
                  ) : (
                    students.map((st) => (
                      <tr key={st.enrollmentId} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{st.studentName}</div>
                          <div className="text-[11px] text-slate-500 font-normal">{st.studentEmail}</div>
                          <div className="text-[10px] text-slate-400">{st.studentPhone}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 max-w-[220px]">
                            {st.courseTitle}
                          </div>
                          <div className="text-[10px] text-slate-400">{st.batchTiming}</div>
                        </td>

                        <td className="py-3 px-4 font-semibold text-slate-500 line-through">
                          {formatINR(st.standardFeeRupees)}
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">
                            {formatINR(st.agreedFeeRupees)}
                          </div>
                          {st.discountRupees > 0 && (
                            <span className="text-[10px] text-emerald-600 font-semibold">
                              (Save {formatINR(st.discountRupees)})
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                          {formatINR(st.paidRupees)}
                        </td>

                        <td className="py-3 px-4">
                          <div className={`font-bold ${st.outstandingRupees > 0 ? "text-rose-600 dark:text-rose-400" : "text-slate-400"}`}>
                            {formatINR(st.outstandingRupees)}
                          </div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-col gap-1 items-start">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                st.feeStatus === "FULL_PAID"
                                  ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
                                  : st.feeStatus === "PARTIAL_PAID"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-300"
                                  : "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                              }`}
                            >
                              {st.feeStatus === "FULL_PAID" ? "Fully Paid" : st.feeStatus === "PARTIAL_PAID" ? "Partially Paid" : "Payment Pending"}
                            </span>

                            {st.hasInstallmentPlan && (
                              <span className={`text-[10px] font-semibold ${st.hasOverdueInstallment ? "text-rose-600" : "text-slate-500"}`}>
                                EMI: {st.installmentPlan?.numberOfInstallments} parts {st.hasOverdueInstallment && "⚠️ Overdue"}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {st.outstandingRupees > 0 && (
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedStudentForPayment(st);
                                  setManualAmount(st.outstandingRupees);
                                }}
                                title="Record Manual Payment"
                                className="px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 text-[11px] font-bold transition flex items-center gap-1"
                              >
                                <DollarSign className="h-3 w-3" /> Pay
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentForFee(st);
                                setNewAgreedFee(st.agreedFeeRupees);
                              }}
                              title="Customize Student Fee"
                              className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-[#1E5EFF] hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" /> Edit Fee
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                setSelectedStudentForEmi(st);
                                setEmiDownPayment(Math.min(st.paidRupees, st.agreedFeeRupees));
                              }}
                              title="Configure Installment / EMI Plan"
                              className="px-2.5 py-1.5 rounded-lg bg-purple-50 text-purple-700 hover:bg-purple-100 dark:bg-purple-950/40 dark:text-purple-300 text-[11px] font-bold transition flex items-center gap-1"
                            >
                              <Calendar className="h-3 w-3" /> EMI
                            </button>

                            <button
                              type="button"
                              onClick={() => setSelectedStudentForHistory(st)}
                              title="Payment History & Adjustments"
                              className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
                            >
                              <Receipt className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 2: REFERRALS & REWARDS ──────────────────────────────────── */}
        {activeTab === "referrals" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Referral Rewards Approval Workflow
                </h3>
                <p className="text-xs text-slate-500">
                  Verify genuine enrollments and approve student referral credits or record cash/UPI payouts.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRewardStatusFilter("All")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${rewardStatusFilter === "All" ? "bg-[#1E5EFF] text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setRewardStatusFilter("PENDING_APPROVAL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${rewardStatusFilter === "PENDING_APPROVAL" ? "bg-[#1E5EFF] text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                >
                  Pending Review
                </button>
                <button
                  type="button"
                  onClick={() => setRewardStatusFilter("APPROVED")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${rewardStatusFilter === "APPROVED" ? "bg-[#1E5EFF] text-white" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}
                >
                  Approved
                </button>
              </div>
            </div>

            <div className="overflow-x-auto rounded-[20px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-secondary">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/50">
                  <tr>
                    <th className="py-3 px-4">Referrer Student</th>
                    <th className="py-3 px-4">Referred Learner</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Referrer Reward</th>
                    <th className="py-3 px-4">Friend Discount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {loadingRewards ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        <Loader2 className="inline h-4 w-4 animate-spin mr-2" /> Loading referral rewards...
                      </td>
                    </tr>
                  ) : rewards.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400">
                        No referral rewards found.
                      </td>
                    </tr>
                  ) : (
                    rewards.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-900 dark:text-white">{r.referrerUser?.name}</div>
                          <div className="text-[11px] text-slate-500">{r.referrerUser?.email}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-slate-900 dark:text-white">{r.refereeUser?.name}</div>
                          <div className="text-[11px] text-slate-500">{r.refereeUser?.email}</div>
                        </td>

                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-medium">
                          {r.course?.title}
                        </td>

                        <td className="py-3 px-4 font-bold text-emerald-600 dark:text-emerald-400">
                          ₹{+(r.rewardAmountCents / 100).toFixed(0)}
                        </td>

                        <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">
                          ₹{+(r.refereeDiscountCents / 100).toFixed(0)} OFF
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              r.status === "APPROVED"
                                ? "bg-emerald-100 text-emerald-800"
                                : r.status === "PAID_OUT"
                                ? "bg-purple-100 text-purple-800"
                                : r.status === "REJECTED"
                                ? "bg-rose-100 text-rose-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {r.status === "PENDING_APPROVAL" ? "Pending Review" : r.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {r.status === "PENDING_APPROVAL" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => handleApproveReward(r)}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-bold text-[11px] hover:bg-emerald-700 transition"
                                >
                                  Approve
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRejectingReward(r)}
                                  className="px-2.5 py-1 rounded-lg border border-rose-200 text-rose-600 font-semibold text-[11px] hover:bg-rose-50 transition"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {r.status === "APPROVED" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setPayingReward(r);
                                  setPayoutRefInput(`PAYOUT-UPI-${Date.now().toString().slice(-6)}`);
                                }}
                                className="px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold text-[11px] hover:bg-purple-700 transition"
                              >
                                Record Payout
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: COUPONS ──────────────────────────────────────────────── */}
        {activeTab === "coupons" && <CouponManager />}

        {/* ── TAB 4: OFFICIAL INVOICES ────────────────────────────────────── */}
        {activeTab === "invoices" && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-xs dark:border-slate-800 dark:bg-surface-secondary">
              <div className="relative flex-1 min-w-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search invoices by invoice #, student name, phone..."
                  value={invoiceSearchQuery}
                  onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-8 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
              >
                <Plus className="h-4 w-4" /> Issue Custom Invoice
              </button>
            </div>

            {/* Invoices Table */}
            <div className="overflow-x-auto rounded-[20px] border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-surface-secondary">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/50">
                  <tr>
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">Course</th>
                    <th className="py-3 px-4">Original Fee</th>
                    <th className="py-3 px-4">Discount</th>
                    <th className="py-3 px-4">Total Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {invoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-slate-400">
                        No official invoices available.
                      </td>
                    </tr>
                  ) : (
                    invoices
                      .filter((inv) => {
                        if (!invoiceSearchQuery) return true;
                        const q = invoiceSearchQuery.toLowerCase();
                        return (
                          inv.invoiceNumber.toLowerCase().includes(q) ||
                          inv.studentName.toLowerCase().includes(q) ||
                          inv.studentPhone.includes(q)
                        );
                      })
                      .map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                          <td className="py-3 px-4 font-mono font-bold text-slate-900 dark:text-white">
                            {inv.invoiceNumber}
                          </td>

                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900 dark:text-white">{inv.studentName}</div>
                            <div className="text-[11px] text-slate-500">{inv.studentPhone}</div>
                          </td>

                          <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                            {inv.items[0]?.description || (inv as any).courseTitle}
                          </td>

                          <td className="py-3 px-4 text-slate-500 line-through">
                            {formatINR(inv.subtotal)}
                          </td>

                          <td className="py-3 px-4 text-emerald-600 font-semibold">
                            {inv.discountAmount > 0 ? `-${formatINR(inv.discountAmount)}` : "—"}
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                            {formatINR(inv.totalAmount)}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                inv.paymentStatus === "Paid"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {inv.paymentStatus}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              type="button"
                              onClick={() => setSelectedInvoice(inv)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 transition"
                            >
                              <Printer className="h-3 w-3" /> View
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── MODAL 1: RECORD MANUAL PAYMENT ─────────────────────────────── */}
        {selectedStudentForPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-emerald-600" /> Record Offline Payment
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForPayment(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRecordManualPayment} className="mt-4 space-y-3">
                <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white">{selectedStudentForPayment.studentName}</div>
                  <div className="text-slate-500">{selectedStudentForPayment.courseTitle}</div>
                  <div className="mt-1 flex items-center justify-between pt-1 border-t border-slate-200/60 dark:border-slate-700">
                    <span>Outstanding Balance:</span>
                    <span className="font-bold text-rose-600">
                      {formatINR(selectedStudentForPayment.outstandingRupees)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Payment Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedStudentForPayment.outstandingRupees}
                    value={manualAmount}
                    onChange={(e) => setManualAmount(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Payment Mode
                  </label>
                  <select
                    value={manualMode}
                    onChange={(e) => setManualMode(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  >
                    <option value="Cash">Cash (Office Walk-In)</option>
                    <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS/NEFT)</option>
                    <option value="Direct UPI / QR">Direct UPI / QR</option>
                    <option value="Cheque / DD">Cheque / Demand Draft</option>
                    <option value="POS Machine">POS Card Swipe</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Transaction / Reference Number
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. UTR / Receipt # (Auto if blank)"
                    value={manualRef}
                    onChange={(e) => setManualRef(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-mono text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                {selectedStudentForPayment.hasInstallmentPlan && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Apply to Installment (optional)
                    </label>
                    <select
                      value={manualInstallmentId}
                      onChange={(e) => setManualInstallmentId(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    >
                      <option value="">General Balance Payment</option>
                      {selectedStudentForPayment.installmentPlan?.items.map((it) => (
                        <option key={it.id} value={it.id}>
                          Installment #{it.number} (₹{it.amountRupees} - {it.status})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Notes / Counselor Reference
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Received by Davood at reception desk"
                    value={manualNotes}
                    onChange={(e) => setManualNotes(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForPayment(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingPayment}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-5 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition disabled:opacity-50"
                  >
                    {isSubmittingPayment ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Confirm Payment"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 2: EDIT STUDENT FEE ───────────────────────────────────── */}
        {selectedStudentForFee && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Edit2 className="h-4 w-4 text-[#1E5EFF]" /> Customize Agreed Student Fee
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForFee(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleUpdateStudentFee} className="mt-4 space-y-3">
                <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white">{selectedStudentForFee.studentName}</div>
                  <div className="text-slate-500">{selectedStudentForFee.courseTitle}</div>
                  <div className="mt-2 grid grid-cols-2 gap-2 border-t border-slate-200 pt-2 text-[11px]">
                    <div>Standard Fee: <b>{formatINR(selectedStudentForFee.standardFeeRupees)}</b></div>
                    <div>Paid So Far: <b className="text-emerald-600">{formatINR(selectedStudentForFee.paidRupees)}</b></div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    New Agreed Fee (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={newAgreedFee}
                    onChange={(e) => setNewAgreedFee(Number(e.target.value))}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-bold text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                  <span className="mt-1 block text-[11px] text-slate-500">
                    Discount from standard: {formatINR(Math.max(0, selectedStudentForFee.standardFeeRupees - newAgreedFee))}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Authorization Reason / Counselor Memo
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Special merit scholarship approved by Academic Director"
                    value={feeChangeReason}
                    onChange={(e) => setFeeChangeReason(e.target.value)}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForFee(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingFee}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-5 py-2 text-xs font-bold text-white hover:bg-blue-600 transition disabled:opacity-50"
                  >
                    {isSubmittingFee ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Agreed Fee"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 3: CONFIGURE EMI PLAN ─────────────────────────────────── */}
        {selectedStudentForEmi && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-purple-600" /> Configure Student EMI Plan
                </h3>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForEmi(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleConfigureEmi} className="mt-4 space-y-3">
                <div className="rounded-xl bg-slate-50 p-3 text-xs dark:bg-slate-800/50">
                  <div className="font-bold text-slate-900 dark:text-white">{selectedStudentForEmi.studentName}</div>
                  <div className="text-slate-500">{selectedStudentForEmi.courseTitle}</div>
                  <div className="mt-1 font-semibold text-slate-900 dark:text-white">
                    Total Payable: {formatINR(selectedStudentForEmi.agreedFeeRupees)}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Down Payment / Initial Payment (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={selectedStudentForEmi.agreedFeeRupees}
                    value={emiDownPayment}
                    onChange={(e) => setEmiDownPayment(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Number of Parts
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={emiInstallmentsCount}
                      onChange={(e) => setEmiInstallmentsCount(Number(e.target.value))}
                      required
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Frequency
                    </label>
                    <select
                      value={emiFrequency}
                      onChange={(e) => setEmiFrequency(e.target.value as any)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    >
                      <option value="MONTHLY">Monthly (Every 30d)</option>
                      <option value="BIWEEKLY">Bi-weekly (Every 14d)</option>
                      <option value="WEEKLY">Weekly (Every 7d)</option>
                    </select>
                  </div>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50/50 p-2.5 text-xs text-purple-900 dark:border-purple-900/50 dark:bg-purple-950/20 dark:text-purple-300">
                  Remaining ₹{Math.max(0, selectedStudentForEmi.agreedFeeRupees - emiDownPayment)} will be split into {emiInstallmentsCount} equal scheduled installments of approx. ₹{Math.round(Math.max(0, selectedStudentForEmi.agreedFeeRupees - emiDownPayment) / (emiInstallmentsCount || 1))}.
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedStudentForEmi(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingEmi}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 transition disabled:opacity-50"
                  >
                    {isSubmittingEmi ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save EMI Plan"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 4: STUDENT FINANCIAL HISTORY & AUDIT LOGS ─────────────── */}
        {selectedStudentForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Financial Ledger: {selectedStudentForHistory.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">{selectedStudentForHistory.courseTitle}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedStudentForHistory(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                {/* Fee Adjustments History */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Authorized Fee Adjustments
                  </h4>
                  {selectedStudentForHistory.feeAdjustments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No custom fee adjustments logged.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudentForHistory.feeAdjustments.map((adj) => (
                        <div key={adj.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/40">
                          <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-white">
                            <span>{adj.reason}</span>
                            <span className={adj.adjustmentCents < 0 ? "text-emerald-600" : "text-amber-600"}>
                              {adj.adjustmentCents < 0 ? "-" : "+"}{formatINR(Math.abs(adj.adjustmentCents) / 100)}
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            Previous: {formatINR(adj.previousAgreedCents / 100)} → New: {formatINR(adj.newAgreedCents / 100)} · {new Date(adj.adjustedAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payments Log */}
                <div>
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-2">
                    Verified Payment Receipts
                  </h4>
                  {selectedStudentForHistory.recentPayments.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No payments logged yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedStudentForHistory.recentPayments.map((p) => (
                        <div key={p.id} className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs dark:border-slate-700 dark:bg-slate-800/40 flex items-center justify-between">
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white">
                              {formatINR(p.amountRupees)} ({p.type})
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Ref: {p.transactionRef} · {new Date(p.date).toLocaleDateString()}
                            </div>
                            {p.notes && <div className="text-[10px] text-slate-500 italic">{p.notes}</div>}
                          </div>
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 text-right dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedStudentForHistory(null)}
                  className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white dark:bg-white dark:text-slate-900"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── MODAL 5: REJECT REFERRAL REWARD ─────────────────────────────── */}
        {rejectingReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-surface-secondary">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Reject Referral Reward
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Provide a reason for rejecting the reward claim by {rejectingReward.referrerUser.name}.
              </p>
              <form onSubmit={handleRejectReward} className="mt-3 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="e.g. Duplicate account, or refunded enrollment"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-rose-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setRejectingReward(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReward}
                    className="px-4 py-1.5 rounded-lg bg-rose-600 text-white font-bold text-xs hover:bg-rose-700 disabled:opacity-50"
                  >
                    Confirm Rejection
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 6: RECORD REFERRAL PAYOUT ─────────────────────────────── */}
        {payingReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-2xl dark:bg-surface-secondary">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Record Referral Payout
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Record payout of ₹{+(payingReward.rewardAmountCents / 100).toFixed(0)} to {payingReward.referrerUser.name}.
              </p>
              <form onSubmit={handleRecordPayout} className="mt-3 space-y-3">
                <input
                  type="text"
                  required
                  placeholder="UPI Ref / Bank Transfer UTR #"
                  value={payoutRefInput}
                  onChange={(e) => setPayoutRefInput(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-purple-500 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setPayingReward(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingReward}
                    className="px-4 py-1.5 rounded-lg bg-purple-600 text-white font-bold text-xs hover:bg-purple-700 disabled:opacity-50"
                  >
                    Confirm Payout
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── MODAL 7: CREATE CUSTOM INVOICE ──────────────────────────────── */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
            <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Receipt className="h-4 w-4 text-[#1E5EFF]" /> Issue Custom Student Invoice
                </h3>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateInvoiceSubmit} className="mt-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Student Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.studentName}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, studentName: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Phone Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={invoiceForm.studentPhone}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, studentPhone: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={invoiceForm.studentEmail}
                    onChange={(e) => setInvoiceForm({ ...invoiceForm, studentEmail: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Select Course
                  </label>
                  <select
                    value={invoiceForm.courseTitle}
                    onChange={(e) => {
                      const sel = coursesList.find((c) => c.title === e.target.value);
                      const standard = sel ? sel.price : invoiceForm.price;
                      setInvoiceForm({
                        ...invoiceForm,
                        courseTitle: e.target.value,
                        courseSlug: sel?.slug || "course",
                        price: standard,
                        agreedFee: standard,
                        discount: 0,
                      });
                    }}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  >
                    {coursesList.map((c) => (
                      <option key={c.slug} value={c.title}>
                        {c.title} (₹{c.price})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Standard Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={invoiceForm.price}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, price: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Agreed Student Fee (₹)
                    </label>
                    <input
                      type="number"
                      value={invoiceForm.agreedFee}
                      onChange={(e) => setInvoiceForm({ ...invoiceForm, agreedFee: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-[#1E5EFF] px-5 py-2 text-xs font-bold text-white hover:bg-blue-600 transition"
                  >
                    Generate Official Invoice
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* View/Print Invoice Modal */}
        <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />
      </div>
    </>
  );
}
