"use client";

import React, { useState, useEffect } from "react";
import { Plus, Users, BookOpen, Star, Search, CheckCircle2 } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ADMIN_INSTRUCTORS, type AdminInstructor } from "@/lib/data/admin";
import { AddInstructorModal } from "@/components/admin/add-instructor-modal";
import { TiltCard } from "@/components/interactions/tilt-card";
import { Reveal } from "@/lib/motion/reveal";

const INSTRUCTORS_STORAGE_KEY = "jks_admin_instructors_v1";

export default function AdminInstructorsPage() {
  const [instructors, setInstructors] = useState<AdminInstructor[]>(ADMIN_INSTRUCTORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Load from localStorage if present
  useEffect(() => {
    try {
      const stored = localStorage.getItem(INSTRUCTORS_STORAGE_KEY);
      if (stored) {
        setInstructors(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAddInstructor = (newInst: AdminInstructor) => {
    const updated = [newInst, ...instructors];
    setInstructors(updated);
    try {
      localStorage.setItem(INSTRUCTORS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const filteredInstructors = instructors.filter((inst) => {
    const query = searchQuery.toLowerCase();
    return inst.name.toLowerCase().includes(query) || inst.role.toLowerCase().includes(query);
  });

  return (
    <>
      <DashboardTopbar
        title="Instructors"
        subtitle={`${instructors.length} enterprise mentors and industry trainers.`}
        userInitials="AD"
      />

      <div className="flex-1 space-y-5 p-3 sm:p-6 lg:p-8 lg:pt-4">
        {/* Top Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div className="flex flex-1 items-center gap-3 max-w-md">
            <div className="relative w-full">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search instructors by name or track…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white py-2 pr-3 pl-9 text-xs font-medium text-slate-800 outline-none shadow-xs transition-colors focus:border-[#2563EB]"
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
              <span>New Instructor</span>
            </button>
          </div>
        </div>

        {/* Instructor Cards Grid */}
        <Reveal variant="stagger" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {filteredInstructors.map((inst) => (
            <TiltCard key={`${inst.name}-${inst.initials}`}>
              <div className="flex h-full flex-col justify-between rounded-[20px] border border-white/70 bg-white/85 p-3.5 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div>
                  <div className="flex items-start justify-between">
                    <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-[#EFF6FF] text-sm sm:text-base font-bold text-[#2563EB] shadow-xs">
                      {inst.initials}
                    </div>
                    <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                      {inst.status}
                    </span>
                  </div>

                  <div className="mt-3 sm:mt-4">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 truncate">
                      {inst.name}
                    </h3>
                    <p className="mt-0.5 text-[11px] sm:text-xs font-medium text-[#2563EB] truncate">
                      {inst.role}
                    </p>
                  </div>
                </div>

                <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 border-t border-slate-100 pt-3 sm:pt-4 text-[11px] sm:text-xs text-slate-600">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <BookOpen className="h-3.5 w-3.5" /> Courses
                    </span>
                    <span className="font-bold text-slate-800">{inst.assignedCourses}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Users className="h-3.5 w-3.5" /> Students
                    </span>
                    <span className="font-bold text-slate-800">
                      {inst.students.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-slate-400">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" /> Rating
                    </span>
                    <span className="font-bold text-amber-600">4.9 / 5.0</span>
                  </div>
                </div>
              </div>
            </TiltCard>
          ))}
        </Reveal>
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
