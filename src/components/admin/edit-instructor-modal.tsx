"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  UserCheck,
  Mail,
  GraduationCap,
  BookOpen,
  Briefcase,
  Sparkles,
  CheckCircle2,
  KeyRound,
  Phone,
  Shield,
  Loader2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { updateInstructor, type StoredInstructor } from "@/lib/auth/use-mock-auth";

interface EditInstructorModalProps {
  isOpen: boolean;
  instructor: StoredInstructor | null;
  onClose: () => void;
  onSave: (updated: StoredInstructor) => void;
}

const TRACK_OPTIONS = [
  "Full Stack Development",
  "Frontend Engineering",
  "SAP S/4HANA",
  ".NET Core Architecture",
  "Cloud & DevOps",
  "AI & Data Science",
];

export function EditInstructorModal({
  isOpen,
  instructor,
  onClose,
  onSave,
}: EditInstructorModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive" | "On Leave">("Active");
  const [newPassword, setNewPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (instructor) {
      setName(instructor.name || "");
      setEmail(instructor.email || "");
      setRole(instructor.role || "Lead Technical Faculty");
      setPhone(instructor.phone || "");
      setStatus(instructor.status || "Active");
      setNewPassword("");
      setError(null);
    }
  }, [instructor]);

  if (!isOpen || !instructor) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || isSaving) return;

    if (newPassword.trim() && newPassword.trim().length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    setIsSaving(true);
    setError(null);

    const res = await updateInstructor(instructor.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim() || undefined,
      password: newPassword.trim() || undefined,
      role: role.trim() || "Lead Technical Faculty",
      status,
    });

    setIsSaving(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setIsSuccess(true);
    setTimeout(() => {
      onSave({
        ...instructor,
        ...res.instructor,
        role: role.trim() || res.instructor.role,
        status,
        phone: phone.trim() || undefined,
      });
      setIsSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-black/80 p-3 sm:p-4 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative my-auto flex w-full max-w-xl flex-col rounded-[24px] border border-slate-100 bg-white shadow-2xl overflow-hidden dark:border-slate-800 dark:bg-surface-secondary"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">
                <UserCheck className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Edit Lecturer Profile
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  Update credentials, track responsibilities, and access status.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-surface-hover dark:hover:text-slate-200 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {error && (
              <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-semibold text-rose-700 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-300">
                {error}
              </div>
            )}

            {/* Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                Lecturer Full Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Dr. K. Rajesh Reddy"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 dark:border-slate-700 dark:bg-input-bg dark:text-white"
              />
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-[#2563EB]" /> Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="lecturer@jkslearning.com"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15 dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" /> Contact Phone
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98765 43210 (optional)"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
              </div>
            </div>

            {/* Role & Track */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-slate-400" /> Role / Title
                </label>
                <input
                  type="text"
                  required
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead Trainer, Full Stack"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-500" /> Account Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive" | "On Leave")}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-semibold text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white"
                >
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            {/* Optional Password Reset */}
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-3.5 dark:border-slate-700 dark:bg-surface-elevated/40 space-y-2">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-amber-500" /> Reset Password (Optional)
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Leave blank to keep existing password"
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs text-slate-900 outline-none focus:border-[#2563EB] dark:border-slate-700 dark:bg-input-bg dark:text-white dark:placeholder-slate-400"
              />
              <p className="text-[10px] text-slate-400">
                Only fill this in if the lecturer needs their password reset.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : isSuccess ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 animate-bounce text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="h-3.5 w-3.5" />
                    <span>Update Lecturer</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
