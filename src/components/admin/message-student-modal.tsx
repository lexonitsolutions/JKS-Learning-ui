"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Mail,
  Send,
  Copy,
  Check,
  Sparkles,
  User,
  BookOpen,
  Calendar,
  AlertCircle,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
} from "lucide-react";

interface MessageStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  student: {
    name: string;
    email: string;
    phone?: string;
    id?: string;
    initials?: string;
    enrolledCourses?: string[];
  } | null;
  onMessageSent?: (summary: string) => void;
}

const TEMPLATES = [
  {
    id: "progress",
    name: "Progress Check-in",
    icon: Sparkles,
    subject: "Academic Progress Review & Mentorship Check-in — JKS Learning",
    body: (name: string, courses: string) =>
      `Hello ${name},\n\nWe have been reviewing your active learning milestones${courses ? ` in ${courses}` : ""} at JKS Learning. Our academic faculty wants to commend your commitment and ensure you have everything needed to succeed.\n\nIf you have any questions regarding your curriculum, video lectures, or need 1-on-1 mentor guidance, please feel free to reply directly to this notice or connect during daily instructor office hours.\n\nKeep up the great work!\n\nWarm regards,\nAcademic Advisory Team\nJKS Learning Technologies`,
  },
  {
    id: "reminder",
    name: "Assignment Due",
    icon: Clock,
    subject: "Important Reminder: Course Assignment Pending — JKS Learning",
    body: (name: string, courses: string) =>
      `Dear ${name},\n\nThis is a quick academic reminder regarding your pending coursework and section assignments${courses ? ` for ${courses}` : ""}.\n\nMaintaining continuous submission of assignments with a passing score (70%+) is required to stay on track for cohort completion and unlock your official JKS verified certificate.\n\nPlease log in to your student dashboard to submit your pending assignments:\nhttps://jkslearning.com/dashboard/assessments\n\nBest regards,\nFaculty Mentorship Office\nJKS Learning Technologies`,
  },
  {
    id: "congrats",
    name: "Honors & Certificate",
    icon: ShieldCheck,
    subject: "Congratulations on Achieving Verified Academic Honors — JKS Learning",
    body: (name: string, courses: string) =>
      `Dear ${name},\n\nCongratulations! You have demonstrated exceptional mastery across your curriculum milestones at JKS Learning.\n\nYour official verified certificate and academic dossier credentials have been issued and are now available for single-page high-resolution download in your student portal. You can proudly share your verified credential on LinkedIn and in your technical resume.\n\nProud of your dedication and achievements!\n\nOffice of Academic Records\nJKS Learning Technologies`,
  },
  {
    id: "custom",
    name: "Custom Note",
    icon: MessageSquare,
    subject: "Academic Notice from JKS Learning Administration",
    body: (name: string) =>
      `Dear ${name},\n\n\n\nBest regards,\nAcademic Operations Team\nJKS Learning Technologies`,
  },
];

export function MessageStudentModal({
  isOpen,
  onClose,
  student,
  onMessageSent,
}: MessageStudentModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState("progress");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [copied, setCopied] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  useEffect(() => {
    if (student) {
      const coursesStr = (student.enrolledCourses || []).slice(0, 2).join(", ");
      const template = TEMPLATES.find((t) => t.id === selectedTemplate) || TEMPLATES[0];
      setSubject(template.subject);
      setBody(template.body(student.name, coursesStr));
      setSentSuccess(false);
      setCopied(false);
    }
  }, [student, selectedTemplate]);

  if (!isOpen || !student) return null;

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const coursesStr = (student.enrolledCourses || []).slice(0, 2).join(", ");
    const template = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
    setSubject(template.subject);
    setBody(template.body(student.name, coursesStr));
  };

  const handleCopyDraft = async () => {
    try {
      const fullText = `To: ${student.email}\nSubject: ${subject}\n\n${body}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  const handleSendEmail = () => {
    const mailtoUrl = `mailto:${encodeURIComponent(student.email)}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoUrl;
    setSentSuccess(true);
    if (onMessageSent) {
      onMessageSent(`Dispatched "${subject}" to ${student.email}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-[24px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-[0_24px_60px_rgba(0,0,0,0.3)] transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Strip */}
        <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 p-5 bg-gradient-to-r from-blue-50/50 via-white to-indigo-50/30 dark:from-surface-elevated dark:via-surface-secondary dark:to-surface-elevated">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">
                Message Student
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Direct academic communication with {student.name}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Student Target Identity Banner */}
        <div className="px-6 py-3.5 bg-slate-50 dark:bg-surface-elevated border-b border-slate-200/80 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white font-black text-xs shadow-xs">
              {student.initials || "ST"}
            </div>
            <div>
              <div className="font-bold text-slate-900 dark:text-white">{student.name}</div>
              <div className="text-slate-500 dark:text-slate-400 text-[11px] font-mono">
                {student.email} {student.phone && `• ${student.phone}`}
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="h-3 w-3" />
            <span>Active Enrolled Student</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Quick Template Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Select Message Template
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {TEMPLATES.map((tmpl) => {
                const Icon = tmpl.icon;
                const isSelected = selectedTemplate === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => handleTemplateChange(tmpl.id)}
                    className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-bold border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-blue-50 dark:bg-blue-950/40 border-[#2563EB] text-[#2563EB] dark:text-blue-400 shadow-xs"
                        : "bg-white dark:bg-surface-elevated border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{tmpl.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Notice subject..."
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg px-3.5 py-2.5 text-xs font-medium text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {/* Body Textarea */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Message Body
              </label>
              <span className="text-[11px] text-slate-400">
                Markdown & plaintext supported
              </span>
            </div>
            <textarea
              rows={8}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-3.5 text-xs font-normal leading-relaxed text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 resize-none font-sans"
            />
          </div>

          {sentSuccess && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-700 dark:text-emerald-300">
              <Check className="h-4 w-4 shrink-0 text-emerald-600" />
              <span>
                Email client dispatched to <b>{student.email}</b>. A communication entry has been prepared.
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/80 dark:border-slate-800 p-4 sm:p-5 bg-slate-50/70 dark:bg-surface-elevated">
          <button
            type="button"
            onClick={handleCopyDraft}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5 text-slate-500" />
                <span>Copy Draft</span>
              </>
            )}
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-all cursor-pointer"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Send Direct Email</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
