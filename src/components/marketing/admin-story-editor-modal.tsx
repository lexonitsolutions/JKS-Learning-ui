"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Save, Video, Award, Building, Sparkles, User, Image, CheckCircle2, Trash2 } from "lucide-react";
import type { SuccessStoryItem } from "@/lib/data/success-stories-store";
import type { CareerCategory } from "@/lib/data/testimonials";
import type { Track } from "@/lib/data/courses";

interface AdminStoryEditorModalProps {
  isOpen: boolean;
  story: SuccessStoryItem | null;
  onClose: () => void;
  onSave: (story: Omit<SuccessStoryItem, "id">, id?: string) => void;
  onDelete?: (id: string) => void;
}

const SAMPLE_AVATARS = [
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80",
];

export function AdminStoryEditorModal({
  isOpen,
  story,
  onClose,
  onSave,
  onDelete,
}: AdminStoryEditorModalProps) {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [placedCompany, setPlacedCompany] = useState("");
  const [previousRole, setPreviousRole] = useState("");
  const [salaryPackage, setSalaryPackage] = useState("");
  const [salaryHike, setSalaryHike] = useState("");
  const [track, setTrack] = useState<Track>("Full Stack");
  const [category, setCategory] = useState<CareerCategory>("Tier-1 Placement");
  const [capstone, setCapstone] = useState("");
  const [quote, setQuote] = useState("");
  const [highlightText, setHighlightText] = useState("");
  const [avatar, setAvatar] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [videoDuration, setVideoDuration] = useState("");
  const [verified, setVerified] = useState(true);
  const [hiredYear, setHiredYear] = useState("2026");

  useEffect(() => {
    if (story) {
      setName(story.name || "");
      setRole(story.role || "");
      setPlacedCompany(story.placedCompany || story.company || "");
      setPreviousRole(story.previousRole || "");
      setSalaryPackage(story.salaryPackage || "");
      setSalaryHike(story.salaryHike || "");
      setTrack(story.track || "Full Stack");
      setCategory(story.category || "Tier-1 Placement");
      setCapstone(story.capstone || "");
      setQuote(story.quote || "");
      setHighlightText(story.highlightText || "");
      setAvatar(story.avatar || "");
      setVideoUrl(story.videoUrl || "");
      setVideoDuration(story.videoDuration || "");
      setVerified(story.verified ?? true);
      setHiredYear(story.hiredYear || "2026");
    } else {
      setName("");
      setRole("Full Stack Engineer");
      setPlacedCompany("Google");
      setPreviousRole("College Fresher");
      setSalaryPackage("₹22.5 LPA");
      setSalaryHike("+120% Salary Hike");
      setTrack("Full Stack");
      setCategory("Tier-1 Placement");
      setCapstone("Distributed Real-Time Messaging & Cache Architecture");
      setQuote("The hands-on capstone and rigorous AI mock interviews helped me crack 3 tech rounds without stress.");
      setHighlightText("Placed directly into Tier-1 product firm.");
      setAvatar(SAMPLE_AVATARS[0]);
      setVideoUrl("https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ");
      setVideoDuration("2:15 min");
      setVerified(true);
      setHiredYear("2026");
    }
  }, [story, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(
      {
        name: name.trim(),
        role: role.trim(),
        company: `Placed at ${placedCompany.trim()}`,
        placedCompany: placedCompany.trim(),
        previousRole: previousRole.trim() || "Student",
        salaryPackage: salaryPackage.trim(),
        salaryHike: salaryHike.trim(),
        track,
        category,
        capstone: capstone.trim(),
        quote: quote.trim(),
        highlightText: highlightText.trim(),
        verified,
        hiredYear,
        avatar: avatar.trim(),
        videoUrl: videoUrl.trim() || undefined,
        videoDuration: videoDuration.trim() || undefined,
        scoreDelta: story?.scoreDelta || "65 → 92",
        initialScore: story?.initialScore || 65,
        finalScore: story?.finalScore || 92,
      },
      story?.id,
    );
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative my-auto flex w-full max-w-2xl max-h-[calc(100dvh-2rem)] flex-col rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="shrink-0 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-4.5 bg-white dark:bg-surface-secondary">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-400">
                <Award className="h-5 w-5 stroke-[2.2]" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {story ? "Edit Student Success Story" : "Add Student Success Story"}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update student details, placed company, photo, and video testimonial URL.
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
          <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0 overflow-hidden text-slate-800 dark:text-slate-200">
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-subtle">
              {/* Live Preview Strip */}
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-surface-elevated p-3.5 flex items-center gap-3.5">
                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#2563EB] text-white font-bold text-sm overflow-hidden ring-2 ring-blue-500/20 shadow-xs">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name || "Student"}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <span>{name ? name.slice(0, 2).toUpperCase() : "ST"}</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-900 dark:text-white truncate">
                      {name || "Student Name"}
                    </span>
                    {placedCompany && (
                      <span className="text-xs font-semibold text-[#2563EB] dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-800/40 truncate">
                        {placedCompany}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {role || "Target Role"} {salaryPackage ? `• ${salaryPackage}` : ""}
                  </div>
                </div>
                {videoUrl && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2 py-1 text-[11px] font-bold">
                    <Video className="h-3 w-3" /> Video Story
                  </span>
                )}
              </div>

              {/* Student Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Designation / Role Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Cloud Solutions Architect"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Company & Previous Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Hired Company *
                  </label>
                  <input
                    type="text"
                    required
                    value={placedCompany}
                    onChange={(e) => setPlacedCompany(e.target.value)}
                    placeholder="e.g. Deloitte, Microsoft, Amazon"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Previous Role / Background
                  </label>
                  <input
                    type="text"
                    value={previousRole}
                    onChange={(e) => setPreviousRole(e.target.value)}
                    placeholder="e.g. Mechanical Engineer, Non-IT Fresher"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Package & Salary Hike */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Salary Package (CTC)
                  </label>
                  <input
                    type="text"
                    value={salaryPackage}
                    onChange={(e) => setSalaryPackage(e.target.value)}
                    placeholder="e.g. ₹18.5 LPA"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Salary Hike % (Optional)
                  </label>
                  <input
                    type="text"
                    value={salaryHike}
                    onChange={(e) => setSalaryHike(e.target.value)}
                    placeholder="e.g. +85% Salary Hike"
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Track & Career Transition Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Learning Track
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value as Track)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="SAP">SAP Ecosystem</option>
                    <option value="Frontend">Frontend Engineering</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    Transition Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as CareerCategory)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                  >
                    <option value="Tier-1 Placement">Tier-1 Placement</option>
                    <option value="Career Switch">Career Switch</option>
                    <option value="Promotion">Fast Promotion</option>
                    <option value="Fresher to Pro">Fresher to Pro</option>
                  </select>
                </div>
              </div>

              {/* Profile Photo / Avatar URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Profile Photo URL
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
                {/* Sample Presets */}
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                  <span className="text-[11px] text-slate-400 shrink-0">Sample Presets:</span>
                  {SAMPLE_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`h-7 w-7 shrink-0 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
                        avatar === preset ? "border-blue-600 scale-110" : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                    >
                      <img src={preset} alt="preset" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Video Testimonial Section */}
              <div className="rounded-2xl border border-rose-200/80 dark:border-rose-900/50 bg-rose-50/50 dark:bg-rose-950/20 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-rose-900 dark:text-rose-300">
                  <Video className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                  <span>Student Video Testimonial (YouTube / Bunny Stream / MP4 URL)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="url"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or embed URL"
                      className="w-full rounded-xl border border-rose-200 dark:border-rose-800/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    />
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      When added, an interactive play button will appear on the student card to play their video testimonial.
                    </p>
                  </div>
                  <div>
                    <input
                      type="text"
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="Duration (e.g. 2:15 min)"
                      className="w-full rounded-xl border border-rose-200 dark:border-rose-800/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              </div>

              {/* Capstone Project */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Capstone Project Name
                </label>
                <input
                  type="text"
                  value={capstone}
                  onChange={(e) => setCapstone(e.target.value)}
                  placeholder="e.g. Enterprise Microservices Architecture on Kubernetes"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Student Quote / Review */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Student Review &amp; Quote *
                </label>
                <textarea
                  required
                  rows={3}
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  placeholder="What the student said about their experience, AI interviews, and curriculum..."
                  className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>
            </div>

            {/* Sticky Modal Footer */}
            <div className="shrink-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 px-6 py-3.5 bg-slate-50/70 dark:bg-surface-elevated/40">
              {story && onDelete ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm(`Are you sure you want to delete ${story.name}'s story?`)) {
                      onDelete(story.id);
                      onClose();
                    }
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete Story</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 active:scale-95 transition-all cursor-pointer"
                >
                  <Save className="h-3.5 w-3.5" />
                  <span>{story ? "Update Success Story" : "Save & Publish Story"}</span>
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
