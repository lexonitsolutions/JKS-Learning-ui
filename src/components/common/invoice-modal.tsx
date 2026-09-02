"use client";

import React, { useRef } from "react";
import { X, Printer, Download, CheckCircle2, ShieldCheck, QrCode, Building, Award } from "lucide-react";
import { type Invoice } from "@/lib/data/invoices-store";
import { JksLogo } from "@/components/common/jks-logo";

interface InvoiceModalProps {
  invoice: Invoice | null;
  onClose: () => void;
}

export function InvoiceModal({ invoice, onClose }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="relative w-full max-w-3xl rounded-3xl border border-slate-700/50 bg-white shadow-2xl overflow-hidden print:border-none print:shadow-none print:max-w-full my-6">
        {/* Modal Action Topbar (Hidden in Print) */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-slate-900 px-6 py-4 text-white print:hidden">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-300">GST Tax Invoice &amp; Official Receipt</span>
            <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
              ● {invoice.paymentStatus.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 transition-colors shadow-md cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5" /> Download / Print A4 PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Printable Official Invoice Sheet */}
        <div
          ref={printRef}
          className="relative p-8 sm:p-12 space-y-8 text-slate-800 bg-white print:p-6 print:space-y-6"
        >
          {/* Subtle Corporate Watermark */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.03] select-none">
            <div className="text-9xl font-black rotate-[-30deg] tracking-widest text-slate-950">
              JKS LEARNING
            </div>
          </div>

          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 border-b-2 border-slate-900 pb-6">
            <div>
              <JksLogo size="md" />
              <div className="mt-3 text-xs text-slate-600 space-y-0.5 leading-relaxed">
                <p className="font-extrabold text-slate-950">JKS Learning Technologies Private Limited</p>
                <p>Tech Park Phase II, Outer Ring Road, Bengaluru, Karnataka - 560103</p>
                <p className="font-mono text-slate-700">
                  <span className="font-bold">GSTIN:</span> 29AAACJ1234F1Z8 • <span className="font-bold">CIN:</span> U72200KA2026PTC099881
                </p>
                <p className="text-slate-500">SAC Code: 999293 (Commercial Training &amp; Education Services)</p>
              </div>
            </div>

            <div className="text-right sm:self-start">
              <div className="text-xl font-black text-slate-900 tracking-tight">ORIGINAL TAX INVOICE</div>
              <div className="mt-1 text-xs font-mono font-bold text-[#2563EB] bg-blue-50 border border-blue-200 rounded-lg px-2.5 py-1 inline-block">
                {invoice.invoiceNumber}
              </div>
              <div className="mt-2.5 text-xs text-slate-600 space-y-0.5">
                <p>Date of Issue: <span className="font-semibold text-slate-900">{new Date(invoice.issueDate).toLocaleDateString("en-IN", { dateStyle: "long" })}</span></p>
                <p>Payment Mode: <span className="font-semibold text-slate-900">{invoice.paymentMode}</span></p>
                <p className="font-mono text-[11px]">Txn Ref: <span className="font-semibold text-slate-900">{invoice.transactionRef}</span></p>
              </div>
            </div>
          </div>

          {/* Billed To / Student Details Dossier */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Billed To (Student)</span>
              <div className="mt-1.5 font-black text-sm text-slate-900">{invoice.studentName}</div>
              <div className="text-slate-600 mt-0.5">{invoice.studentEmail}</div>
              <div className="text-slate-600 font-mono">{invoice.studentPhone}</div>
              {invoice.studentCity && <div className="text-slate-600">{invoice.studentCity}</div>}
            </div>

            <div className="sm:text-right space-y-1">
              <span className="font-bold text-slate-400 uppercase text-[10px] tracking-wider">Enrollment Standing</span>
              <div className="mt-1.5 flex items-center gap-1.5 sm:justify-end text-emerald-700 font-bold">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> 100% Verified Admission
              </div>
              {invoice.batchTiming && (
                <div className="text-slate-600 font-medium">
                  Assigned Cohort: <span className="font-semibold text-slate-900">{invoice.batchTiming}</span>
                </div>
              )}
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-900 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2">SAC</th>
                  <th className="py-3 px-2">Item / Course Description</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-2 text-right">Tuition Fee</th>
                  <th className="py-3 px-2 text-right">Taxable Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {invoice.items.map((item, idx) => (
                  <tr key={idx}>
                    <td className="py-3.5 px-2 font-mono text-slate-500 text-[11px]">999293</td>
                    <td className="py-3.5 px-2">
                      <div className="font-bold text-slate-900 text-xs">{item.description}</div>
                      <div className="text-[11px] text-slate-500">Live Faculty Mentorship + Production Capstones + Placement Support</div>
                    </td>
                    <td className="py-3.5 px-2 text-center font-mono">{item.qty}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-medium">₹{item.unitPrice.toLocaleString("en-IN")}</td>
                    <td className="py-3.5 px-2 text-right font-mono font-black text-slate-900">₹{item.totalPrice.toLocaleString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Tax Breakdown Box */}
          <div className="flex justify-end pt-2 border-t-2 border-slate-900">
            <div className="w-full max-w-sm space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Gross Tuition Fee:</span>
                <span className="font-mono font-medium">₹{invoice.subtotal.toLocaleString("en-IN")}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Scholarship Deduction ({invoice.discountCode || "PROMO"}):</span>
                  <span className="font-mono">- ₹{invoice.discountAmount.toLocaleString("en-IN")}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Taxable Value (Net of Discount):</span>
                <span className="font-mono">₹{invoice.taxableAmount.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Central GST (CGST 9%):</span>
                <span className="font-mono">₹{invoice.cgstAmount.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>State GST (SGST 9%):</span>
                <span className="font-mono">₹{invoice.sgstAmount.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between border-t-2 border-slate-900 pt-2.5 text-sm font-black text-slate-950">
                <span>Total Amount Paid:</span>
                <span className="font-mono text-[#2563EB] text-base">₹{invoice.totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </div>

          {/* Seal, Signature & Digital Verification */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-slate-200 pt-6 text-xs text-slate-500">
            <div className="flex items-center gap-3">
              <ShieldCheck className="h-8 w-8 text-emerald-600 shrink-0" />
              <div>
                <div className="font-bold text-slate-900">Digitally Verified &amp; Reconciled Tax Invoice</div>
                <div className="text-[11px] text-slate-500">This is a system-generated computer invoice under Section 31 of CGST Act.</div>
              </div>
            </div>

            <div className="text-right">
              <div className="font-serif italic font-bold text-slate-900 text-sm">P. Sharma</div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Authorized Finance Officer</div>
              <div className="text-[9px] text-slate-400">JKS Learning Technologies Pvt. Ltd.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
