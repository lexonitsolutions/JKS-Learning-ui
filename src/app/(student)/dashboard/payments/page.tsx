"use client";

import { CreditCard, CheckCircle2, XCircle } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

interface PaymentRow {
  id: string;
  course: string;
  amount: number;
  status: "Success" | "Pending" | "Failed" | "Refunded";
  date: string;
}

const PAYMENTS: PaymentRow[] = [
  { id: "PAY-10293", course: "Java Full Stack Developer Mastery", amount: 24999, status: "Success", date: "2026-06-14" },
  { id: "PAY-10318", course: "Modern Frontend Engineering with React", amount: 15999, status: "Success", date: "2026-07-22" },
  { id: "PAY-10402", course: "SAP ABAP Professional Track", amount: 28999, status: "Failed", date: "2026-08-05" },
];

const STATUS_STYLE: Record<PaymentRow["status"], string> = {
  Success: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
  Failed: "bg-rose-50 text-rose-700",
  Refunded: "bg-slate-100 text-slate-600",
};

export default function PaymentsPage() {
  const totalPaid = PAYMENTS.filter((p) => p.status === "Success").reduce((sum, p) => sum + p.amount, 0);
  const successCount = PAYMENTS.filter((p) => p.status === "Success").length;

  return (
    <>
      <DashboardTopbar title="Payment History" subtitle="Every purchase attempt on your account" userInitials="JD" />
      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <Reveal variant="stagger" className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Total Paid</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB]">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">₹{totalPaid.toLocaleString("en-IN")}</div>
              <div className="mt-1 text-xs text-emerald-600 font-semibold">{successCount} successful payments</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="rounded-[20px] border border-white/70 bg-white/75 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500">Payment Method</span>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-50 text-purple-600">
                  <CreditCard className="h-4 w-4" />
                </div>
              </div>
              <div className="mt-2 text-2xl font-extrabold text-slate-900">UPI / Card</div>
              <div className="mt-1 text-xs text-slate-500 font-medium">Managed securely via Razorpay</div>
            </div>
          </TiltCard>
        </Reveal>

        <div className="rounded-[20px] border border-white/70 bg-white/80 p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[500px]">
              <thead>
                <tr className="border-b border-slate-100 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                  <th className="pb-3 pr-4 pl-0">Payment ID</th>
                  <th className="px-4 pb-3">Course</th>
                  <th className="px-4 pb-3">Amount</th>
                  <th className="px-4 pb-3 text-center">Status</th>
                  <th className="pr-0 pb-3 pl-4 text-right">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {PAYMENTS.map((p) => (
                  <tr key={p.id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4 pr-4 pl-0 font-mono font-bold text-slate-900 whitespace-nowrap">{p.id}</td>
                    <td className="px-4 py-4 font-medium text-slate-600 whitespace-nowrap">{p.course}</td>
                    <td className="px-4 py-4 font-bold text-slate-900 whitespace-nowrap">
                      ₹{p.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-4 py-4 text-center whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${STATUS_STYLE[p.status]}`}>
                        {p.status === "Success" ? (
                          <CheckCircle2 className="h-3 w-3" />
                        ) : p.status === "Failed" ? (
                          <XCircle className="h-3 w-3" />
                        ) : null}
                        {p.status}
                      </span>
                    </td>
                    <td className="pr-0 py-4 pl-4 text-right font-medium text-slate-500 whitespace-nowrap">{p.date}</td>
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
