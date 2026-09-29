"use client";

import { useState, useMemo, useEffect } from "react";
import { CreditCard, CheckCircle2, XCircle, FileText, Download, Printer, Search, X, Layers, Filter } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { getStoredInvoices, type Invoice } from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";
import { CustomDropdown, type DropdownOption } from "@/components/ui/custom-dropdown";

export default function PaymentsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const invoices = getStoredInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, []);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [selectedCourse, setSelectedCourse] = useState<string>("ALL");

  const totalPaid = invoices
    .filter((inv) => inv.paymentStatus === "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  // Extract unique courses from student's invoices
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

  const filtered = invoices.filter((p) => {
    const matchStatus = filterStatus === "All" || p.paymentStatus === filterStatus;
    const courseDesc = p.items[0]?.description || (p as any).courseTitle || "Enrolled Course";
    const matchCourse = selectedCourse === "ALL" || courseDesc === selectedCourse;
    const matchSearch =
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courseDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.paymentMode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchCourse && matchSearch;
  });

  return (
    <>
      <DashboardTopbar
        title="Payment & Invoice History"
        subtitle="Tax receipts and payment records for your course enrollments"
      />
      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Investment</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/40 dark:text-blue-400">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">₹{totalPaid.toLocaleString("en-IN")}</div>
              <div className="mt-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{invoices.length} verified tax invoices</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Billing Support</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900 dark:text-white">GST Compliant</div>
              <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-medium">Original tax invoice downloads available</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200/90 dark:border-slate-800/80 bg-white/90 dark:bg-surface-secondary p-3 shadow-xs">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by invoice #, course name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-input-bg pl-10 pr-8 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#2563EB]"
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
            {/* Course Filter Dropdown */}
            <CustomDropdown
              options={courseOptions}
              value={selectedCourse}
              onChange={(val) => setSelectedCourse(val)}
              placeholder="Filter by Course"
              icon={<Layers className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />}
              searchable={courseOptions.length > 5}
              minWidth="min-w-[190px] max-w-[260px]"
            />

            {/* Status Filter Dropdown */}
            <CustomDropdown
              options={statusOptions}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val)}
              placeholder="Status"
              icon={<Filter className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400" />}
              minWidth="min-w-[130px]"
            />

            {(selectedCourse !== "ALL" || filterStatus !== "All" || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCourse("ALL");
                  setFilterStatus("All");
                  setSearchQuery("");
                }}
                className="flex items-center gap-1 rounded-xl border border-rose-200 bg-rose-50 px-2.5 py-2 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/40 dark:bg-rose-950/40 dark:text-rose-400 cursor-pointer transition-colors"
                title="Reset all filters"
              >
                <X className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Invoices Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl dark:border-slate-800/80 dark:bg-surface-secondary/90 dark:shadow-[0_8px_30px_rgb(0,0,0,0.35)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Invoice #</th>
                  <th className="px-4 pb-3">Course Track</th>
                  <th className="px-4 pb-3">Amount (Incl. GST)</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="px-4 pb-3">Payment Mode</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Tax Invoice</th>
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
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-slate-400">
                      No invoices found matching your filters.
                    </td>
                  </tr>
                ) : (
                  filtered.map((inv) => (
                    <tr key={inv.id} className="transition-all duration-200 ease-out hover:bg-slate-100/70 dark:hover:bg-white/[0.04]">
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
                        ₹{inv.totalAmount.toLocaleString("en-IN")}
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
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-blue-100 dark:bg-blue-950/40 dark:border-blue-800/40 dark:text-blue-400 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" /> View & Download PDF
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

      {/* Invoice Modal for Viewing and Printing */}
      <InvoiceModal
        invoice={selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
      />
    </>
  );
}

