"use client";

import { useState } from "react";
import { CreditCard, CheckCircle2, XCircle, FileText, Download, Printer } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import { getStoredInvoices, type Invoice } from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";

export default function PaymentsPage() {
  const invoices = getStoredInvoices();
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const totalPaid = invoices
    .filter((inv) => inv.paymentStatus === "Paid")
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  return (
    <>
      <DashboardTopbar title="Payment & Invoice History" subtitle="Tax receipts and payment records for your course enrollments" userInitials="JD" />
      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Investment</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">₹{totalPaid.toLocaleString("en-IN")}</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">{invoices.length} verified tax invoices</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Billing Support</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <FileText className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">GST Compliant</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Original tax invoice downloads available</div>
            </div>
          </TiltCard>
        </Reveal>

        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Invoice #</th>
                  <th className="px-4 pb-3">Course Track</th>
                  <th className="px-4 pb-3">Amount (Incl. GST)</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="px-4 pb-3">Payment Mode</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Tax Invoice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {inv.invoiceNumber}
                      <div className="text-[10px] text-slate-400 font-normal">
                        {new Date(inv.issueDate).toLocaleDateString("en-IN")}
                      </div>
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
                    <td className="px-4 py-4 text-slate-600 font-medium whitespace-nowrap">
                      {inv.paymentMode}
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
    </>
  );
}

