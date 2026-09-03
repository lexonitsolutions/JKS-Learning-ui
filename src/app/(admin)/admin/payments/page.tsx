"use client";

import React, { useState, useEffect } from "react";
import { CreditCard, IndianRupee, CheckCircle2, Download, Plus, Printer, Search, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { getStoredInvoices, fetchInvoicesFromApi, registerCourseOnline, createInvoice, type Invoice } from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";

export default function AdminPaymentsPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Invoice Form
  const [form, setForm] = useState({
    studentName: "",
    studentEmail: "",
    studentPhone: "",
    studentCity: "Bengaluru, Karnataka",
    courseTitle: "Java Full Stack Developer Mastery",
    courseSlug: "java-full-stack-mastery",
    price: 45000,
    discount: 5000,
    discountCode: "SCHOLARSHIP10",
    paymentMode: "UPI" as Invoice["paymentMode"],
    batchTiming: "Weekday Morning (7:30 AM - 9:30 AM IST)",
  });

  useEffect(() => {
    fetchInvoicesFromApi().then((list) => setInvoices(list));
  }, []);

  const refreshInvoices = async () => {
    const list = await fetchInvoicesFromApi();
    setInvoices(list);
  };


  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.studentPhone) return;

    const newInv = createInvoice({
      studentName: form.studentName,
      studentEmail: form.studentEmail || `${form.studentName.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
      studentPhone: form.studentPhone,
      studentCity: form.studentCity,
      courseTitle: form.courseTitle,
      courseSlug: form.courseSlug,
      price: Number(form.price),
      discount: Number(form.discount),
      discountCode: form.discountCode,
      paymentMode: form.paymentMode,
      batchTiming: form.batchTiming,
    });

    setShowCreateModal(false);
    refreshInvoices();
    setSelectedInvoice(newInv);
  };

  const totalSuccess = invoices
    .filter((p) => p.paymentStatus === "Paid")
    .reduce((sum, p) => sum + p.totalAmount, 0);

  const filtered = invoices.filter((p) => {
    const matchStatus = filterStatus === "All" || p.paymentStatus === filterStatus;
    const matchSearch =
      p.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.studentPhone.includes(searchQuery);
    return matchStatus && matchSearch;
  });

  return (
    <>
      <DashboardTopbar
        title="Billing & Invoices"
        subtitle={`₹${totalSuccess.toLocaleString("en-IN")} total volume settled across ${invoices.length} tax invoices.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Metric Cards */}
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Gross Settled (MTD)</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <IndianRupee className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">
                ₹{(totalSuccess / 100000).toFixed(2)}L
              </div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">+14.5% vs last month</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Payment Success Rate</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">99.2%</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">18% GST Compliant &amp; Reconciled</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Payment Gateways</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">UPI / Cards / EMI</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Instant automated invoice numbering</div>
            </div>
          </TiltCard>
        </Reveal>

        {/* Action Header & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by student name, invoice #, phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 outline-none"
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>

            <button
              type="button"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer shrink-0"
            >
              <Plus className="h-4 w-4" /> Create Invoice
            </button>
          </div>
        </div>

        {/* Invoices Data Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Invoice #</th>
                  <th className="px-4 pb-3">Student Details</th>
                  <th className="px-4 pb-3">Course Track</th>
                  <th className="px-4 pb-3">Total Amount</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(inv.issueDate).toLocaleDateString("en-IN")}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-bold text-slate-900">{inv.studentName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{inv.studentPhone}</div>
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-700">
                      {inv.items[0]?.description || "Enrolled Course"}
                    </td>
                    <td className="px-4 py-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      ₹{inv.totalAmount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 text-emerald-700 px-2.5 py-0.5 text-[11px] font-semibold">
                        <CheckCircle2 className="h-3 w-3" />
                        {inv.paymentStatus}
                      </span>
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedInvoice(inv)}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 border border-blue-200 px-3 py-1.5 text-xs font-bold text-[#2563EB] hover:bg-blue-100 transition-colors cursor-pointer"
                      >
                        <Printer className="h-3.5 w-3.5" /> View / Print PDF
                      </button>
                    </td>
                  </tr>
                ))}
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

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900">Generate New Tax Invoice</h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Student Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Kumar"
                    value={form.studentName}
                    onChange={(e) => setForm({ ...form, studentName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Mobile / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={form.studentPhone}
                    onChange={(e) => setForm({ ...form, studentPhone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700">Course Track</label>
                <select
                  value={form.courseTitle}
                  onChange={(e) => setForm({ ...form, courseTitle: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                >
                  <option>Java Full Stack Developer Mastery</option>
                  <option>Modern Frontend Engineering (React 19 & Next.js)</option>
                  <option>SAP S/4HANA Enterprise Systems</option>
                  <option>.NET 9 Enterprise Microservices & Cloud</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Standard Fee (₹)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700">Discount / Scholarship (₹)</label>
                  <input
                    type="number"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700">Payment Mode</label>
                  <select
                    value={form.paymentMode}
                    onChange={(e) => setForm({ ...form, paymentMode: e.target.value as Invoice["paymentMode"] })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                  >
                    <option value="UPI">UPI</option>
                    <option value="Credit/Debit Card">Credit/Debit Card</option>
                    <option value="Net Banking">Net Banking</option>
                    <option value="No-Cost EMI">No-Cost EMI</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-slate-700">Batch Timing</label>
                  <select
                    value={form.batchTiming}
                    onChange={(e) => setForm({ ...form, batchTiming: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2.5 outline-none focus:border-[#2563EB]"
                  >
                    <option>Weekday Morning (7:30 AM - 9:30 AM)</option>
                    <option>Weekend Intensive (10:00 AM - 2:00 PM)</option>
                    <option>Weekday Evening (7:00 PM - 9:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3 text-[11px] text-blue-900 space-y-0.5">
                <div className="flex justify-between font-bold">
                  <span>Net Payable (Includes 18% GST):</span>
                  <span>₹{Math.max(0, form.price - form.discount).toLocaleString("en-IN")}</span>
                </div>
                <div className="text-[10px] text-blue-700">
                  Auto-calculates CGST (9%) + SGST (9%) and allocates sequential tax invoice number.
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl px-4 py-2 font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white hover:bg-blue-700 shadow-md"
                >
                  Generate &amp; View Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
