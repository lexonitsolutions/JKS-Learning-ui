"use client";

import React, { useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Briefcase,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  Award,
  Globe,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default function InstructorProfilePage() {
  const [name, setName] = useState("Dr. Rohit Kapoor");
  const [email, setEmail] = useState("rohit.kapoor@jkslearning.com");
  const [title, setTitle] = useState("Lead Trainer & Principal Enterprise Architect");
  const [track, setTrack] = useState("Java & Full Stack Track");
  const [officeHours, setOfficeHours] = useState("Monday & Thursday: 6:00 PM - 8:00 PM IST");
  const [bio, setBio] = useState(
    "Over 14 years of enterprise software engineering experience across fintech, distributed messaging architectures, and cloud microservices. Passionate about empowering the next generation of full stack software craftsmen."
  );
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <DashboardTopbar
        title="Lecturer Profile & Office Hours"
        subtitle="Manage public faculty biography, track specializations, and mentorship consultation slots."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-4xl mx-auto w-full">
        {/* Profile Card Header */}
        <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 sm:p-8 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center gap-5 border-b border-slate-100 pb-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#2563EB] to-[#38BDF8] text-2xl font-extrabold text-white shadow-lg shadow-blue-500/25 ring-4 ring-white">
              RK
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-slate-900">{name}</h2>
                <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700">
                  Verified Faculty
                </span>
              </div>
              <p className="text-xs font-semibold text-[#2563EB]">{title}</p>
              <p className="text-xs text-slate-400 font-medium">{track}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-medium text-slate-500 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Designation / Role Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Assigned Track
                </label>
                <input
                  type="text"
                  value={track}
                  onChange={(e) => setTrack(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Weekly Office Hours & Doubt Consultation Schedule
              </label>
              <input
                type="text"
                value={officeHours}
                onChange={(e) => setOfficeHours(e.target.value)}
                placeholder="e.g. Tue & Thu: 6:00 PM - 7:30 PM IST"
                className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-medium text-slate-900 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Biography & Industry Experience
              </label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white p-3 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-6 py-2.5 font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all cursor-pointer"
              >
                {saved ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-bounce" /> Profile Saved!
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Save Profile
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
