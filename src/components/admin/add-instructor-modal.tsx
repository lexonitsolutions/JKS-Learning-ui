"use client";

import React, { useState } from "react";
import {
  X,
  UserPlus,
  Mail,
  GraduationCap,
  BookOpen,
  Briefcase,
  Sparkles,
  CheckCircle2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { AdminInstructor } from "@/lib/data/admin";

interface AddInstructorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (instructor: AdminInstructor) => void;
}

export function AddInstructorModal({
  isOpen,
  onClose,
  onSave,
}: AddInstructorModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Lead Trainer, Java Full Stack");
  const [track, setTrack] = useState("Full Stack");
  const [assignedCourses, setAssignedCourses] = useState(1);
  const [bio, setBio] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (fullName.slice(0, 2) || "IN").toUpperCase();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const newInst: AdminInstructor = {
      name: name.trim(),
      initials: getInitials(name),
      role: role.trim() || `${track} Specialist`,
      assignedCourses: Number(assignedCourses) || 1,
      students: 0,
      status: "Active",
    };

    setIsSuccess(true);
    setTimeout(() => {
      onSave(newInst);
      setIsSuccess(false);
      setName("");
      setEmail("");
      setBio("");
      onClose();
    }, 800);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative flex w-full max-w-xl flex-col rounded-[24px] border border-slate-100 bg-white shadow-2xl overflow-hidden"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
                <UserPlus className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Add New Instructor & Industry Mentor
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Onboard expert trainers and assign curriculum tracks
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Modal Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-slate-800">
            {/* Live Avatar Preview Header */}
            <div className="flex items-center gap-3.5 rounded-2xl border border-slate-100 bg-slate-50/70 p-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#2563EB] text-sm font-bold text-white shadow-xs">
                {name ? getInitials(name) : "IN"}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-900 truncate">
                  {name || "Instructor Full Name"}
                </div>
                <div className="text-[11px] text-[#2563EB] font-medium truncate">
                  {role || "Designation & Track"}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Dr. Ananya Sharma"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="instructor@jkslearning.com"
                    className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Track / Specialization
                </label>
                <select
                  value={track}
                  onChange={(e) => {
                    setTrack(e.target.value);
                    setRole(`Lead Trainer, ${e.target.value}`);
                  }}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="Full Stack">Full Stack</option>
                  <option value="Frontend">Frontend</option>
                  <option value="SAP">SAP</option>
                  <option value="Cloud & DevOps">Cloud & DevOps</option>
                  <option value="AI & Data">AI & Data</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assigned Courses
                </label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={assignedCourses}
                  onChange={(e) => setAssignedCourses(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800 outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Designation / Role Title
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g. Principal Architect & Lead Trainer"
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Bio & Industry Background (Optional)
              </label>
              <textarea
                rows={2}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="10+ years enterprise experience in microservices, cloud deployments..."
                className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white p-3 text-xs font-medium text-slate-800 outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-slate-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-bounce" /> Added Successfully!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Save & Invite Instructor
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
