"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, BookOpen, Star, Search, Mail, Trash2, KeyRound, ShieldCheck } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import type { AdminInstructor } from "@/lib/data/admin";
import { AddInstructorModal } from "@/components/admin/add-instructor-modal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";
import {
  getApprovedInstructors,
  saveApprovedInstructors,
  deleteApprovedInstructor,
} from "@/lib/auth/use-mock-auth";

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<AdminInstructor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load dynamic approved instructors from storage
  useEffect(() => {
    const list = getApprovedInstructors();
    setInstructors(list as AdminInstructor[]);
  }, []);

  const handleAddInstructor = (newInst: AdminInstructor) => {
    const updated = [newInst, ...instructors];
    setInstructors(updated);
    saveApprovedInstructors(updated);
  };

  const handleDeleteInstructor = (email: string, name: string) => {
    if (confirm(`Are you sure you want to revoke lecturer access for ${name} (${email})? They will no longer be able to access the Lecturer workspace.`)) {
      const updated = deleteApprovedInstructor(email);
      setInstructors(updated as AdminInstructor[]);
    }
  };

  const filteredInstructors = instructors.filter((inst) => {
    const query = searchQuery.toLowerCase();
    return (
      inst.name.toLowerCase().includes(query) ||
      inst.role.toLowerCase().includes(query) ||
      (inst.email && inst.email.toLowerCase().includes(query))
    );
  });

  return (
    <>
      <DashboardTopbar
        title="Lecturers & Faculty"
        subtitle={`${instructors.length} authorized enterprise lecturers. Only lecturers added here can access the Lecturer workspace.`}
        userInitials="LX"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-3 max-w-md">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search lecturers by name, email, or track…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB] dark:border-slate-700/80 dark:bg-input-bg dark:text-white dark:placeholder-slate-400 dark:focus:border-blue-500"
              />
            </div>
          </div>

          {/* New Instructor Button - Right Corner */}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>Add New Lecturer</span>
            </button>
          </div>
        </div>

        {/* Security / Access Notice Banner */}
        <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 dark:border-blue-900/40 dark:bg-blue-950/20 text-xs text-blue-900 dark:text-blue-200">
          <ShieldCheck className="h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
          <p>
            <strong>Workspace Access Policy:</strong> Only lecturers added in this directory are authorized to sign in to the <strong>Lecturer Command Center</strong>. Use their real working emails to onboard them.
          </p>
        </div>

        {/* Empty State if No Lecturers */}
        {filteredInstructors.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-[24px] border border-dashed border-slate-200 bg-white/60 p-12 text-center dark:border-slate-800 dark:bg-surface-secondary/50">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400 mb-4">
              <Users className="h-7 w-7 stroke-[1.8]" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {searchQuery ? "No matching lecturers found" : "No lecturers onboarded yet"}
            </h3>
            <p className="mt-1.5 max-w-md text-xs text-slate-500 dark:text-slate-400">
              {searchQuery
                ? "Try searching with a different name or email."
                : "Add lecturers with their real emails. Once registered here, they will immediately be granted access to the Lecturer Workspace."}
            </p>
            {!searchQuery && (
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-5 flex items-center gap-2 rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 transition-all cursor-pointer shadow-sm"
              >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Onboard First Lecturer</span>
              </button>
            )}
          </div>
        )}

        {/* Instructor Cards Grid */}
        {filteredInstructors.length > 0 && (
          <Reveal variant="stagger" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredInstructors.map((inst) => (
              <TiltCard key={`${inst.email}-${inst.name}`}>
                <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/85 p-4 sm:p-5 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800/80 dark:bg-surface-secondary dark:shadow-none dark:hover:border-border-strong">
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EFF6FF] text-sm font-bold text-[#2563EB] shadow-xs dark:bg-blue-950/50 dark:text-blue-400">
                        {inst.initials}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400">
                          {inst.status || "Active"}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleDeleteInstructor(inst.email, inst.name)}
                          title="Revoke access"
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="mt-3">
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                        {inst.name}
                      </h3>
                      <p className="text-[11px] font-medium text-[#2563EB] dark:text-blue-400 truncate">
                        {inst.role}
                      </p>
                    </div>

                    {/* Email & Credentials Row */}
                    <div className="mt-3 space-y-1.5 rounded-xl bg-slate-50/80 dark:bg-surface-elevated p-2.5 text-[11px] border border-slate-100 dark:border-slate-800/80">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 truncate">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="font-semibold truncate">{inst.email}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 truncate">
                        <KeyRound className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span>Pass: <code className="font-mono text-slate-700 dark:text-slate-200">{inst.password || "lecturer123"}</code></span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 border-t border-slate-100 dark:border-slate-800 pt-3 text-[11px] text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400">
                        <BookOpen className="h-3.5 w-3.5" /> Courses
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">{inst.assignedCourses ?? 1}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400">
                        <Users className="h-3.5 w-3.5" /> Students
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {(inst.students ?? 0).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-slate-400 dark:text-slate-400">
                        <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> Status
                      </span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">Workspace Access Granted</span>
                    </div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </Reveal>
        )}
      </div>

      {/* Add Instructor Modal */}
      <AddInstructorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddInstructor}
      />
    </>
  );
}
