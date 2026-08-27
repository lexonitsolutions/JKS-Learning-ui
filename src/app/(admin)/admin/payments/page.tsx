"use client";

import React, { useState } from "react";
import { CreditCard, IndianRupee, CheckCircle2, Download } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_PAYMENTS } from "@/lib/data/admin";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

export default function AdminPaymentsPage() {
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const totalSuccess = ADMIN_PAYMENTS.filter((p) => p.status === "Success").reduce(
    (sum, p) => sum + p.amount,
    0
  );

  const filtered = ADMIN_PAYMENTS.filter(
    (p) => filterStatus === "All" || p.status === filterStatus
  );

  return (
    <>
      <DashboardTopbar
        title="Payments"
        subtitle={`₹${totalSuccess.toLocaleString("en-IN")} total volume settled across ${ADMIN_PAYMENTS.length} transactions.`}
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
              ₹{(totalSuccess / 100000).toFixed(1)}L
            </div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">+8.2% vs last month</div>
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
            <div className="mt-2 text-2xl font-extrabold text-slate-900">97.8%</div>
            <div className="mt-1 text-xs text-emerald-600 font-semibold">Zero chargebacks</div>
          </div>
          </TiltCard>

          <TiltCard>
          <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Payment Gateway</span>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                <CreditCard className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-2 text-2xl font-extrabold text-slate-900">Razorpay / UPI</div>
            <div className="mt-1 text-xs text-slate-500 font-medium">Instant automated settlement</div>
          </div>
          </TiltCard>
        </Reveal>

        {/* Filter Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1 shadow-xs overflow-x-auto">
            {["All", "Success", "Pending", "Failed", "Refunded"].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-colors whitespace-nowrap ${
                  filterStatus === st
                    ? "bg-[#2563EB] text-white shadow-xs"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 self-end sm:self-auto cursor-pointer"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download Tax Report</span>
          </button>
        </div>

        {/* Table */}
        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Transaction ID</th>
                  <th className="px-4 pb-3">Student Name</th>
                  <th className="px-4 pb-3">Course</th>
                  <th className="px-4 pb-3">Amount</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {p.id}
                    </td>
                    <td className="px-4 py-4 font-semibold text-slate-900 whitespace-nowrap">
                      {p.student}
                    </td>
                    <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">
                      {p.course}
                    </td>
                    <td className="px-4 py-4 font-bold text-slate-900 whitespace-nowrap">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                          p.status === "Success"
                            ? "bg-emerald-50 text-emerald-700"
                            : p.status === "Pending"
                              ? "bg-amber-50 text-amber-700"
                              : p.status === "Failed"
                                ? "bg-rose-50 text-rose-700"
                                : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right font-medium text-slate-500 whitespace-nowrap">
                      {p.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
