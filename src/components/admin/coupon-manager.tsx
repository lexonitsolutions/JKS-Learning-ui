"use client";

import React, { useCallback, useEffect, useState } from "react";
import {
  Check,
  Copy,
  Loader2,
  Ticket,
  Plus,
  Trash2,
  Power,
  PowerOff,
  Percent,
  IndianRupee,
  Calendar,
  Layers,
  Search,
  X,
  Sparkles,
} from "lucide-react";
import {
  fetchAdminCoupons,
  createAdminCoupon,
  generateCoupon,
  activateCoupon,
  deactivateCoupon,
  deleteCoupon,
  type AdminCoupon,
  type CouponStatus,
  type CreateCouponInput,
} from "@/lib/data/coupons-api";
import { fetchDbCourses } from "@/lib/data/courses";

const STATUS_STYLE: Record<CouponStatus, string> = {
  ACTIVE: "bg-emerald-100 text-emerald-800 dark:bg-emerald-400/15 dark:text-emerald-200",
  RESERVED: "bg-amber-100 text-amber-800 dark:bg-amber-400/15 dark:text-amber-200",
  REDEEMED: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
  EXPIRED: "bg-rose-100 text-rose-800 dark:bg-rose-400/15 dark:text-rose-200",
  INACTIVE: "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400",
};

export function CouponManager() {
  const [coupons, setCoupons] = useState<AdminCoupon[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Available courses for scoping
  const [courseOptions, setCourseOptions] = useState<{ title: string; slug: string }[]>([]);

  // Create Form State
  const [formData, setFormData] = useState<CreateCouponInput>({
    code: "",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minPurchaseCents: 0,
    maxDiscountCents: 0,
    expiresInDays: 30,
    usageLimit: 100,
    perStudentLimit: 1,
    canCombineWithReferral: false,
    singleUse: false,
    description: "",
    courseSlugs: [],
    allowedStudentEmails: [],
  });
  const [emailInput, setEmailInput] = useState("");

  const load = useCallback(async () => {
    try {
      const data = await fetchAdminCoupons();
      setCoupons(data);
    } catch (err) {
      setCoupons([]);
      setError(err instanceof Error ? err.message : "Could not load coupons.");
    }
  }, []);

  useEffect(() => {
    void load();
    fetchDbCourses()
      .then((cList) => {
        if (Array.isArray(cList)) {
          setCourseOptions(cList.map((c) => ({ title: c.title, slug: c.slug })));
        }
      })
      .catch(() => {});
  }, [load]);

  const handleCopy = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(code);
      setTimeout(() => setCopied((c) => (c === code ? null : c)), 2000);
    } catch {
      setError("Failed to copy code to clipboard.");
    }
  };

  const handleCreateCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const minCents = formData.minPurchaseCents ? Math.round(Number(formData.minPurchaseCents) * 100) : 0;
      const maxCents = formData.maxDiscountCents ? Math.round(Number(formData.maxDiscountCents) * 100) : null;

      const emails = emailInput
        .split(/[\n,]+/)
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      await createAdminCoupon({
        ...formData,
        code: formData.code?.trim().toUpperCase() || undefined,
        discountValue: Number(formData.discountValue),
        minPurchaseCents: minCents,
        maxDiscountCents: maxCents,
        usageLimit: Number(formData.usageLimit) || 100,
        perStudentLimit: Number(formData.perStudentLimit) || 1,
        allowedStudentEmails: emails,
      });

      setSuccessMsg("Coupon created successfully!");
      setShowCreateModal(false);
      // Reset form
      setFormData({
        code: "",
        discountType: "PERCENTAGE",
        discountValue: 15,
        minPurchaseCents: 0,
        maxDiscountCents: 0,
        expiresInDays: 30,
        usageLimit: 100,
        perStudentLimit: 1,
        canCombineWithReferral: false,
        singleUse: false,
        description: "",
        courseSlugs: [],
        allowedStudentEmails: [],
      });
      setEmailInput("");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create coupon.");
    } finally {
      setBusy(false);
    }
  };

  const handleToggleActive = async (c: AdminCoupon) => {
    setError(null);
    try {
      if (c.isActive) {
        await deactivateCoupon(c.id);
      } else {
        await activateCoupon(c.id);
      }
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update coupon status.");
    }
  };

  const handleDelete = async (c: AdminCoupon) => {
    if (!window.confirm(`Are you sure you want to delete coupon ${c.code}?`)) return;
    setError(null);
    try {
      await deleteCoupon(c.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete coupon.");
    }
  };

  const filteredCoupons = (coupons ?? []).filter((c) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      c.code.toLowerCase().includes(q) ||
      (c.description && c.description.toLowerCase().includes(q))
    );
  });

  return (
    <div className="rounded-[20px] border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Ticket className="h-5 w-5 text-[#1E5EFF]" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              Dynamic Coupon Management
            </h2>
          </div>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Configure percentage or fixed-amount discounts, minimum purchase thresholds, usage limits, and referral stacking rules.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-600 transition"
        >
          <Plus className="h-4 w-4" /> Create Coupon
        </button>
      </div>

      {error && (
        <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/40 dark:bg-rose-950/20 dark:text-rose-300">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-700 dark:border-emerald-900/40 dark:bg-emerald-950/20 dark:text-emerald-300">
          {successMsg}
        </div>
      )}

      {/* Filter Bar */}
      <div className="mt-4 flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search coupon by code or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-9 pr-8 py-1.5 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        <div className="text-xs text-slate-500 font-medium">
          {filteredCoupons.length} {filteredCoupons.length === 1 ? "coupon" : "coupons"}
        </div>
      </div>

      {/* Coupons List Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200/90 dark:border-slate-800">
        <table className="w-full text-left text-xs">
          <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase tracking-wider dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400">
            <tr>
              <th className="py-2.5 px-3">Code</th>
              <th className="py-2.5 px-3">Discount</th>
              <th className="py-2.5 px-3">Min Purchase</th>
              <th className="py-2.5 px-3">Usage</th>
              <th className="py-2.5 px-3">Combine Referral</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {coupons === null ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  <Loader2 className="inline h-4 w-4 animate-spin mr-2" /> Loading coupons...
                </td>
              </tr>
            ) : filteredCoupons.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400">
                  No coupons found matching your search.
                </td>
              </tr>
            ) : (
              filteredCoupons.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-900 dark:text-white">
                    <div className="flex items-center gap-1.5">
                      <span>{c.code}</span>
                      <button
                        onClick={() => handleCopy(c.code)}
                        title="Copy code"
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                      >
                        {copied === c.code ? (
                          <Check className="h-3 w-3 text-emerald-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                    {c.description && (
                      <p className="font-sans text-[10px] text-slate-400 font-normal truncate max-w-xs">
                        {c.description}
                      </p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                    {c.discountType === "FIXED"
                      ? `₹${c.discountValue || 0}`
                      : `${c.discountPercent}% OFF`}
                    {c.maxDiscountCents && (
                      <span className="block text-[10px] text-slate-400 font-normal">
                        Max ₹{+(c.maxDiscountCents / 100).toFixed(0)}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {c.minPurchaseCents && c.minPurchaseCents > 0
                      ? `₹${+(c.minPurchaseCents / 100).toFixed(0)}`
                      : "No minimum"}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600 dark:text-slate-300">
                    {c.usedCount} / {c.singleUse ? "1" : c.usageLimit || "∞"}
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                        c.canCombineWithReferral
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                          : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                      }`}
                    >
                      {c.canCombineWithReferral ? "Allowed" : "No"}
                    </span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        STATUS_STYLE[c.status] || STATUS_STYLE.INACTIVE
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleToggleActive(c)}
                        title={c.isActive ? "Deactivate" : "Activate"}
                        className={`p-1.5 rounded-lg border transition ${
                          c.isActive
                            ? "border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/50 dark:hover:bg-amber-950/30"
                            : "border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-900/50 dark:hover:bg-emerald-950/30"
                        }`}
                      >
                        {c.isActive ? <PowerOff className="h-3.5 w-3.5" /> : <Power className="h-3.5 w-3.5" />}
                      </button>
                      {c.usedCount === 0 && !c.redeemedAt && (
                        <button
                          onClick={() => handleDelete(c)}
                          title="Delete Coupon"
                          className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-950/30 transition"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
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

      {/* Create Coupon Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-surface-secondary">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Ticket className="h-4 w-4 text-[#1E5EFF]" /> Create New Coupon
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="mt-4 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Coupon Code (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. DIWALI2026 (Auto if blank)"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-mono font-bold text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Discount Type
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value as any })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    {formData.discountType === "PERCENTAGE" ? "Discount (%)" : "Discount Amount (₹)"}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === "PERCENTAGE" ? 100 : 100000}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    required
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-bold text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Min Purchase (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0 = None"
                    value={formData.minPurchaseCents || ""}
                    onChange={(e) => setFormData({ ...formData, minPurchaseCents: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                {formData.discountType === "PERCENTAGE" && (
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Max Cap (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="Optional"
                      value={formData.maxDiscountCents || ""}
                      onChange={(e) => setFormData({ ...formData, maxDiscountCents: Number(e.target.value) })}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                    />
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Validity (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={formData.expiresInDays ?? ""}
                    onChange={(e) => setFormData({ ...formData, expiresInDays: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Total Uses
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.usageLimit ?? ""}
                    onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Per Student Limit
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.perStudentLimit ?? ""}
                    onChange={(e) => setFormData({ ...formData, perStudentLimit: Number(e.target.value) })}
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Note / Campaign Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Festival scholarship for full stack developers"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs text-slate-900 outline-none focus:border-[#1E5EFF] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="combineRef"
                  checked={formData.canCombineWithReferral}
                  onChange={(e) => setFormData({ ...formData, canCombineWithReferral: e.target.checked })}
                  className="rounded border-slate-300 text-[#1E5EFF] focus:ring-[#1E5EFF]"
                />
                <label htmlFor="combineRef" className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  Allow combining this coupon with student referral discounts
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] px-5 py-2 text-xs font-bold text-white hover:bg-blue-600 disabled:opacity-50 transition"
                >
                  {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Save Coupon"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
