"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Mail,
  PhoneCall,
  GraduationCap,
  Clock,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Building2,
} from "lucide-react";
import { motion } from "framer-motion";
import { JksLogo } from "@/components/common/jks-logo";
import { apiFetch } from "@/lib/api/base-url";

const COURSE_OPTIONS = [
  "Full Stack Web Development (MERN / Next.js)",
  "SAP ERP Solutions (ABAP, FICO, MM, SD)",
  ".NET Core & Enterprise Cloud Systems",
  "Cloud Computing & DevOps (AWS / Azure / Docker)",
  "Data Science, Python & Applied AI",
  "UI/UX Design & Frontend Engineering",
  "General Career Counseling & Admissions",
];

const BATCH_TIMING_OPTIONS = [
  "Flexible / Any Timing",
  "Morning Batch (08:00 AM - 11:00 AM IST)",
  "Afternoon Batch (01:00 PM - 04:00 PM IST)",
  "Evening Batch (06:00 PM - 09:00 PM IST)",
  "Weekend Intensive (Saturday & Sunday)",
  "1-on-1 Fast-Track Mentorship",
];

export default function PublicRegistrationPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [interestedCourse, setInterestedCourse] = useState(COURSE_OPTIONS[0]);
  const [batchTiming, setBatchTiming] = useState(BATCH_TIMING_OPTIONS[0]);
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!name.trim() || name.trim().length < 2) {
      nextErrors.name = "Please enter your full name (at least 2 characters)";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address";
    }

    const phoneClean = phone.replace(/[^0-9]/g, "");
    if (!phone.trim() || phoneClean.length < 10) {
      nextErrors.phone = "Please enter a valid mobile / WhatsApp number (min 10 digits)";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch("/notifications/public-registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          interestedCourse,
          batchTiming,
          message: message.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        const msg =
          errData?.message ||
          "Failed to submit your registration. Please verify your details and try again.";
        setSubmitError(Array.isArray(msg) ? msg.join(", ") : msg);
        return;
      }

      setIsSuccess(true);
    } catch {
      setSubmitError(
        "Could not connect to the admissions server. Please check your internet connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setName("");
    setEmail("");
    setPhone("");
    setInterestedCourse(COURSE_OPTIONS[0]);
    setBatchTiming(BATCH_TIMING_OPTIONS[0]);
    setMessage("");
    setErrors({});
    setSubmitError(null);
    setIsSuccess(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-xl"
    >
      <div className="overflow-hidden rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl transition-all">
        {/* Header Branding */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5 mb-6">
          <JksLogo size="md" />
          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 px-3 py-1 text-xs font-bold text-blue-600 dark:text-blue-400 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Public Registration
          </span>
        </div>

        {isSuccess ? (
          /* Success Screen */
          <div className="space-y-6 py-4 animate-in fade-in zoom-in-95 duration-300">
            <div className="text-center space-y-3">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 shadow-lg shadow-emerald-500/10">
                <CheckCircle2 className="h-9 w-9" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                Registration Received!
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you, <strong className="text-slate-900 dark:text-white">{name}</strong>! Your registration details have been dispatched to our Academic Admissions Administration.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-5 space-y-3 text-xs sm:text-sm">
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Program Track:</span>
                <span className="font-bold text-slate-900 dark:text-white text-right">{interestedCourse}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Contact Phone:</span>
                <span className="font-mono font-bold text-blue-600 dark:text-blue-400">{phone}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Contact Email:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{email}</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Preferred Schedule:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 text-right">{batchTiming}</span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-100 dark:border-blue-900/40 bg-blue-50/60 dark:bg-blue-950/20 p-4 text-xs text-blue-900 dark:text-blue-200 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
                <span>What happens next?</span>
              </div>
              <p className="leading-relaxed pl-5 text-slate-600 dark:text-slate-300">
                Our counselor will reach out via call or WhatsApp at <strong className="text-slate-900 dark:text-white">{phone}</strong> within 24 hours to guide your batch scheduling, share the course curriculum, and arrange demo classes.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/courses"
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2.5 text-sm font-bold text-white shadow-md hover:from-blue-700 hover:to-indigo-700 transition-all text-center"
              >
                <span>Browse Course Catalog</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
              >
                Submit Another Inquiry
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <div>
            <div className="mb-6 space-y-2">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
                Student Registration
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                Fill in your details below to register. Our admissions counseling team will reach out to guide your course curriculum and batch timing.
              </p>
            </div>

            {submitError && (
              <div className="mb-5 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 p-3.5 text-xs font-semibold text-rose-700 dark:text-rose-300">
                {submitError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Full Name */}
              <div>
                <label
                  htmlFor="reg-name"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <User className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Full Name</span>
                  <span className="text-blue-500">*</span>
                </label>
                <input
                  id="reg-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all"
                />
                {errors.name && (
                  <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Grid: Email & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="reg-email"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Email Address</span>
                    <span className="text-blue-500">*</span>
                  </label>
                  <input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all"
                  />
                  {errors.email && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="reg-phone"
                    className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                  >
                    <PhoneCall className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                    <span>Mobile / WhatsApp</span>
                    <span className="text-blue-500">*</span>
                  </label>
                  <input
                    id="reg-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs font-medium text-rose-600 dark:text-rose-400">
                      {errors.phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Course Track of Interest */}
              <div>
                <label
                  htmlFor="reg-course"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <GraduationCap className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Program Track of Interest</span>
                </label>
                <select
                  id="reg-course"
                  value={interestedCourse}
                  onChange={(e) => setInterestedCourse(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all cursor-pointer"
                >
                  {COURSE_OPTIONS.map((c) => (
                    <option key={c} value={c} className="dark:bg-slate-900">
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Batch Timing */}
              <div>
                <label
                  htmlFor="reg-timing"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <Clock className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Preferred Batch Timing</span>
                </label>
                <select
                  id="reg-timing"
                  value={batchTiming}
                  onChange={(e) => setBatchTiming(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all cursor-pointer"
                >
                  {BATCH_TIMING_OPTIONS.map((t) => (
                    <option key={t} value={t} className="dark:bg-slate-900">
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Optional Message */}
              <div>
                <label
                  htmlFor="reg-message"
                  className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-700 dark:text-slate-300"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Questions or Academic Background (Optional)</span>
                </label>
                <textarea
                  id="reg-message"
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="e.g. Final year B.Tech student, interested in placement assistance and fast-track schedule..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-input-bg px-3.5 py-2.5 text-sm text-slate-900 dark:text-white outline-none placeholder:text-slate-400 focus:border-blue-500 focus:bg-white dark:focus:bg-surface-elevated focus:ring-4 focus:ring-blue-500/15 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 disabled:pointer-events-none disabled:opacity-60 cursor-pointer"
              >
                <span className="flex items-center justify-center gap-2">
                  {submitting ? "Submitting Registration…" : "Complete Public Registration"}
                  {!submitting && (
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  )}
                </span>
              </button>
            </form>

            {/* Clear Separation Note */}
            <div className="mt-6 border-t border-slate-100 dark:border-slate-800/80 pt-4 text-center space-y-2">
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Already enrolled or looking to access your student portal?
              </p>
              <div className="flex items-center justify-center gap-4 text-xs font-bold">
                <Link
                  href="/login"
                  className="text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
                >
                  <Building2 className="h-3 w-3" />
                  <span>Sign In</span>
                </Link>
                <span className="text-slate-300 dark:text-slate-700">&bull;</span>
                <Link
                  href="/sign-up"
                  className="text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Create Account</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
