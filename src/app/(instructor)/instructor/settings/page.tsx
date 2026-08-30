"use client";

import React, { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Mail,
  Video,
  Calendar,
  Clock,
  Sliders,
  MessageSquare,
  ShieldAlert,
  GraduationCap,
  Save,
  Radio,
  FileCode,
  Users,
  Smartphone,
  Laptop,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export default function InstructorSettingsPage() {
  // 1. Notification & Alert Settings
  const [notifySubmissions, setNotifySubmissions] = useState(true);
  const [notifyLiveSessions, setNotifyLiveSessions] = useState(true);
  const [notifyForumDoubt, setNotifyForumDoubt] = useState(true);
  const [notifyLowPerformance, setNotifyLowPerformance] = useState(true);

  // 2. Evaluation & Grading Engine
  const [autoApprovePassingQuizzes, setAutoApprovePassingQuizzes] = useState(true);
  const [aiAssistedGrading, setAiAssistedGrading] = useState(true);
  const [passingThreshold, setPassingThreshold] = useState("80");
  const [lateSubmissionPenalty, setLateSubmissionPenalty] = useState("5");
  const [aiPlagiarismSensitivity, setAiPlagiarismSensitivity] = useState("Strict");

  // 3. Office Hours & Doubt Clearing
  const [defaultSlotDuration, setDefaultSlotDuration] = useState("30");
  const [maxDoubtStudents, setMaxDoubtStudents] = useState("10");
  const [autoAcceptBookings, setAutoAcceptBookings] = useState(true);
  const [timeZone, setTimeZone] = useState("Asia/Kolkata (IST)");
  const [bufferTime, setBufferTime] = useState("10");

  // 4. Student Communication & Quiet Hours
  const [allowDirectMessaging, setAllowDirectMessaging] = useState(true);
  const [publicBioVisible, setPublicBioVisible] = useState(true);
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(true);
  const [quietHoursStart, setQuietHoursStart] = useState("22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState("08:00");

  // 5. Video Security & Anti-Piracy
  const [dynamicWatermark, setDynamicWatermark] = useState(true);
  const [maxPlaybackSpeed, setMaxPlaybackSpeed] = useState("1.5x");
  const [enforceAntiSkip, setEnforceAntiSkip] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <>
      <DashboardTopbar
        title="Faculty Workspace Settings"
        subtitle="Manage teaching preferences, AI evaluation rules, office hours booking, and content security."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-4xl mx-auto w-full">
        <form onSubmit={handleSave} className="space-y-6">
          {/* SECTION 1: TEACHING & EVALUATION AUTOMATION */}
          <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Sliders className="h-5 w-5 text-[#2563EB]" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Curriculum Evaluation & Grading Rules
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Automated grading algorithms and assessment passing criteria
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Minimum Section Passing Threshold (%)
                </label>
                <select
                  value={passingThreshold}
                  onChange={(e) => setPassingThreshold(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="70">70% (Standard Pass)</option>
                  <option value="75">75% (Recommended)</option>
                  <option value="80">80% (Enterprise Benchmark)</option>
                  <option value="85">85% (Rigorous Masterclass)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  Late Assignment Submission Penalty
                </label>
                <select
                  value={lateSubmissionPenalty}
                  onChange={(e) => setLateSubmissionPenalty(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="0">0% (Grace Period / No Penalty)</option>
                  <option value="5">5% deduction per 24 hours</option>
                  <option value="10">10% deduction per 24 hours</option>
                  <option value="reject">Reject Submissions After Deadline</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  AI Plagiarism & Authenticity Sensitivity
                </label>
                <select
                  value={aiPlagiarismSensitivity}
                  onChange={(e) => setAiPlagiarismSensitivity(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="Strict">Strict (Flag &gt; 10% AI code generation)</option>
                  <option value="Standard">Standard (Flag &gt; 25% AI code generation)</option>
                  <option value="Permissive">Permissive (Flag &gt; 50% AI code generation)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">
                  AI Auto-Grading Recommendation Engine
                </label>
                <div className="flex items-center gap-3 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={aiAssistedGrading}
                      onChange={(e) => setAiAssistedGrading(e.target.checked)}
                      className="h-4 w-4 rounded text-blue-600"
                    />
                    <span>Suggest draft rubric scores and review notes</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={autoApprovePassingQuizzes}
                  onChange={(e) => setAutoApprovePassingQuizzes(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Auto-Approve Objective MCQ Tests ({passingThreshold}%+)
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Automatically mark multiple-choice section tests as graded if score meets the
                    threshold, eliminating manual review overhead.
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* SECTION 2: LIVE OFFICE HOURS & DOUBT CLEARING */}
          <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-5">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Calendar className="h-5 w-5 text-[#2563EB]" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Office Hours & Live Mentorship Scheduling
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Configure student 1-on-1 and cohort doubt booking windows
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Faculty Time Zone</label>
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="Asia/Kolkata (IST)">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC (Universal Coordinated)</option>
                  <option value="America/New_York (EST)">America/New_York (EST)</option>
                  <option value="America/Los_Angeles (PST)">America/Los_Angeles (PST)</option>
                  <option value="Europe/London (GMT)">Europe/London (GMT)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Default Slot Duration</label>
                <select
                  value={defaultSlotDuration}
                  onChange={(e) => setDefaultSlotDuration(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="15">15 Minutes (Quick Query)</option>
                  <option value="30">30 Minutes (Standard)</option>
                  <option value="45">45 Minutes (Deep Dive)</option>
                  <option value="60">60 Minutes (Capstone Review)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Max Students Per Live Room</label>
                <select
                  value={maxDoubtStudents}
                  onChange={(e) => setMaxDoubtStudents(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/70 p-2.5 font-medium text-slate-800 outline-none focus:border-[#2563EB]"
                >
                  <option value="1">1-on-1 Private Consultation</option>
                  <option value="5">Small Pod (Up to 5)</option>
                  <option value="10">Cohort Group (Up to 10)</option>
                  <option value="50">Open Masterclass (Up to 50)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={autoAcceptBookings}
                  onChange={(e) => setAutoAcceptBookings(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Auto-Confirm Booking Requests</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Automatically book appointments if student selects an open calendar slot.
                  </div>
                </div>
              </label>

              <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-3 space-y-1">
                <label className="font-bold text-slate-900">Buffer Time Between Calls</label>
                <select
                  value={bufferTime}
                  onChange={(e) => setBufferTime(e.target.value)}
                  className="w-full rounded-lg border border-slate-200 bg-white p-1.5 text-xs font-semibold text-slate-700 outline-none"
                >
                  <option value="5">5 Minutes Buffer</option>
                  <option value="10">10 Minutes Buffer (Recommended)</option>
                  <option value="15">15 Minutes Buffer</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 3: VIDEO SECURITY & ANTI-PIRACY PROTECTION */}
          <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <ShieldCheck className="h-5 w-5 text-[#2563EB]" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Video Delivery Security & Piracy Prevention
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Enforce DRM watermarking, playback speed caps, and anti-skip engagement
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={dynamicWatermark}
                  onChange={(e) => setDynamicWatermark(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Dynamic Student ID Overlay Watermark
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Superimposes the viewing student&apos;s verified email and IP address randomly across
                    the video player to prevent screen recording and course leaks.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={enforceAntiSkip}
                  onChange={(e) => setEnforceAntiSkip(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Enforce Anti-Skip & Tab Focus on Graded Lectures
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Requires students to watch minimum 85% of lecture before unlocking the next
                    coding assessment. Pauses playback if the learner switches tabs.
                  </div>
                </div>
              </label>

              <div className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5">
                <div>
                  <div className="font-bold text-slate-900">Maximum Allowed Playback Speed</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Cap playback speed on foundational architecture videos to ensure comprehension.
                  </div>
                </div>
                <select
                  value={maxPlaybackSpeed}
                  onChange={(e) => setMaxPlaybackSpeed(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-bold text-slate-800 outline-none"
                >
                  <option value="1.25x">1.25x (Strict Comprehension)</option>
                  <option value="1.5x">1.5x (Recommended)</option>
                  <option value="2.0x">2.0x (Standard)</option>
                  <option value="unlimited">Unlimited (Up to 3.0x)</option>
                </select>
              </div>
            </div>
          </div>

          {/* SECTION 4: STUDENT COMMUNICATION & NOTIFICATIONS */}
          <div className="rounded-[24px] border border-white/80 bg-white/90 p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl space-y-4">
            <div className="flex items-center gap-2.5 border-b border-slate-100 pb-3">
              <Bell className="h-5 w-5 text-[#2563EB]" />
              <div>
                <h3 className="text-sm font-extrabold text-slate-900">
                  Notification Channels & Communication Boundaries
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Direct student messaging, forum alert triggers, and quiet hours
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={notifySubmissions}
                  onChange={(e) => setNotifySubmissions(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">New Assignment Submission Alerts</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Real-time email and push notification when a student submits code.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={notifyForumDoubt}
                  onChange={(e) => setNotifyForumDoubt(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Course Discussion Forum Questions</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Notify when an enrolled student posts a question under a lecture.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={allowDirectMessaging}
                  onChange={(e) => setAllowDirectMessaging(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">Allow Direct Student Messaging</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Enables registered students to send direct chat inquiries to faculty.
                  </div>
                </div>
              </label>

              <label className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 cursor-pointer hover:bg-slate-50">
                <input
                  type="checkbox"
                  checked={publicBioVisible}
                  onChange={(e) => setPublicBioVisible(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded text-blue-600"
                />
                <div>
                  <div className="font-bold text-slate-900">
                    Public Faculty Directory Visibility
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Display your verified credentials and office hours in student directory.
                  </div>
                </div>
              </label>
            </div>

            {/* Quiet Hours Window */}
            <div className="rounded-xl border border-blue-100 bg-blue-50/60 p-4 space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#2563EB]" />
                  <span className="font-bold text-slate-900">
                    Quiet Hours (Do Not Disturb Window)
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={quietHoursEnabled}
                  onChange={(e) => setQuietHoursEnabled(e.target.checked)}
                  className="h-4 w-4 rounded text-blue-600"
                />
              </div>

              {quietHoursEnabled && (
                <div className="flex flex-wrap items-center gap-3 pt-1 text-slate-700">
                  <span>Mute non-urgent notifications between:</span>
                  <input
                    type="time"
                    value={quietHoursStart}
                    onChange={(e) => setQuietHoursStart(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800"
                  />
                  <span>and</span>
                  <input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(e) => setQuietHoursEnd(e.target.value)}
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-bold text-slate-800"
                  />
                  <span className="text-[11px] text-slate-500">(Faculty Local Time)</span>
                </div>
              )}
            </div>
          </div>

          {/* SAVE BUTTON */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[#2563EB] to-indigo-600 px-8 py-3 text-xs font-extrabold text-white shadow-xl shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 active:scale-95 transition-all cursor-pointer"
            >
              {saved ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce text-cyan-200" /> Faculty Settings
                  Saved!
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Save Workspace Configuration
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
