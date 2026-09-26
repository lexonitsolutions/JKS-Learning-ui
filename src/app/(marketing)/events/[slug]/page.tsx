"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Video,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  Loader2,
  Mail,
  Phone,
  User,
  Share2,
  Bookmark,
  CalendarCheck,
} from "lucide-react";
import {
  fetchPublicEventBySlug,
  registerForEvent,
  type EventItem,
} from "@/lib/data/events-api";
import { jksAnalytics } from "@/lib/analytics/jks-analytics";

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [bannerError, setBannerError] = useState(false);
  const [speakerAvatarError, setSpeakerAvatarError] = useState(false);

  // Registration Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      const data = await fetchPublicEventBySlug(slug);
      if (!data) {
        setErrorMessage("Event not found or has been unpublished.");
      } else {
        setEvent(data);
        jksAnalytics.eventView({
          event_id: data.id,
          event_slug: data.slug,
          event_name: data.title,
          mode: data.mode,
        });
      }
      setIsLoading(false);
    }
    load();
  }, [slug]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!event) return;
    if (!fullName.trim() || !email.trim() || !mobile.trim()) {
      setFormError("Full Name, Email Address, and Mobile Number are required.");
      return;
    }

    setIsSubmitting(true);
    const res = await registerForEvent(event.id, {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      notes: notes.trim() || undefined,
    });
    setIsSubmitting(false);

    if (res.success) {
      setIsSuccess(true);
      jksAnalytics.eventRegistration({
        event_id: event.id,
        event_slug: event.slug,
        event_name: event.title,
        mode: event.mode,
      });
      // Increment registered count visually
      setEvent((prev) =>
        prev
          ? {
              ...prev,
              registeredCount: (prev.registeredCount || 0) + 1,
              availableSpots: prev.availableSpots ? Math.max(0, prev.availableSpots - 1) : null,
            }
          : prev
      );
    } else {
      setFormError(res.error || "Failed to complete registration.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-[#0B1020] transition-colors">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Loading masterclass details...</p>
        </div>
      </div>
    );
  }

  if (!event || errorMessage) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 dark:bg-[#0B1020] px-4 text-center transition-colors">
        <AlertCircle className="h-12 w-12 text-rose-500" />
        <h1 className="mt-3 text-xl font-bold text-slate-900 dark:text-white">Event Not Available</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
          {errorMessage || "The masterclass you are looking for is either past or no longer published."}
        </p>
        <Link
          href="/events"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Browse All Events</span>
        </Link>
      </div>
    );
  }

  const startDate = new Date(event.startDate);
  const dateFormatted = startDate.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeFormatted = startDate.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1020] text-slate-900 dark:text-white pb-24 transition-colors duration-200">
      {/* Top Banner / Breadcrumb Strip */}
      <div className="border-b border-slate-200 dark:border-white/10 bg-white/80 dark:bg-slate-950/60 pt-28 pb-6 backdrop-blur-md">
        <div className="mx-auto max-w-[1280px] px-6 lg:px-16">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to All Events</span>
          </Link>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="mx-auto max-w-[1280px] px-6 lg:px-16 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Event Details */}
          <div className="lg:col-span-7 space-y-8">
            {/* Header Badges */}
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 dark:border-blue-500/30 px-3 py-1 text-xs font-bold text-[#1E5EFF] dark:text-blue-400">
                  {event.mode === "ONLINE" ? (
                    <Video className="h-3.5 w-3.5 text-[#1E5EFF] dark:text-blue-400" />
                  ) : (
                    <MapPin className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                  )}
                  <span>{event.mode} Masterclass</span>
                </span>

                <span className="rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Free Admission
                </span>

                {event.isSoldOut && (
                  <span className="rounded-full bg-rose-500/15 border border-rose-500/30 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400">
                    Sold Out
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white leading-tight">
                {event.title}
              </h1>

              {/* Date & Time Highlights Strip */}
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-600 dark:text-slate-300 border-y border-slate-200 dark:border-white/10 py-3.5">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-[#1E5EFF]" />
                  <span className="font-semibold text-slate-900 dark:text-white">{dateFormatted}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#1E5EFF]" />
                  <span>{timeFormatted} IST</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  <span>{event.registeredCount || 0} Registered</span>
                </div>
              </div>
            </div>

            {/* Poster / Banner */}
            {event.bannerUrl && !bannerError && (
              <div className="relative h-64 sm:h-80 w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-white/10 shadow-lg dark:shadow-xl bg-slate-900">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  className="object-cover"
                  priority
                  unoptimized={Boolean(event.bannerUrl.includes("cloudinary.com"))}
                  onError={() => setBannerError(true)}
                />
              </div>
            )}

            {/* Speaker Spotlight Card */}
            {event.speakerName && (
              <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0F1C3F]/70 p-6 shadow-sm dark:shadow-none backdrop-blur-md">
                <div className="text-[11px] font-bold uppercase tracking-widest text-[#1E5EFF] dark:text-blue-400 mb-4">
                  Session Mentor &amp; Speaker
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white text-xl font-black shadow-md overflow-hidden">
                    {event.speakerAvatar && !speakerAvatarError ? (
                      <Image
                        src={event.speakerAvatar}
                        alt={event.speakerName}
                        width={64}
                        height={64}
                        className="h-full w-full rounded-2xl object-cover"
                        unoptimized={Boolean(event.speakerAvatar.includes("cloudinary.com"))}
                        onError={() => setSpeakerAvatarError(true)}
                      />
                    ) : (
                      event.speakerName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">{event.speakerName}</h3>
                    <p className="text-xs text-[#1E5EFF] dark:text-blue-300 font-semibold">{event.speakerRole || "Industry Specialist"}</p>
                    {event.speakerBio && (
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {event.speakerBio}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* About the Event */}
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 space-y-4 shadow-sm dark:shadow-none">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">About this Masterclass</h2>
              <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {event.description}
              </div>
            </div>

            {/* Session Agenda / Curriculum Details */}
            {event.sessionDetails && (
              <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 space-y-4 shadow-sm dark:shadow-none">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">Session Agenda &amp; Curriculum</h2>
                <div className="rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-slate-950/60 p-4 font-mono text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {event.sessionDetails}
                </div>
              </div>
            )}

            {/* Event Dynamic Sections with Cloudinary Images */}
            {event.sections && Array.isArray(event.sections) && event.sections.length > 0 && (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[#1E5EFF]" />
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                    Program Overview &amp; Key Highlights
                  </h2>
                </div>

                <div className="space-y-6">
                  {event.sections.map((sec, idx) => (
                    <div
                      key={sec.id || idx}
                      className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 shadow-sm dark:shadow-none space-y-4"
                    >
                      {sec.imageUrl && (
                        <div className="relative h-48 sm:h-64 w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-white/10 shadow-xs">
                          <Image
                            src={sec.imageUrl}
                            alt={sec.title || `Section ${idx + 1}`}
                            fill
                            unoptimized={Boolean(sec.imageUrl.includes("cloudinary.com"))}
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">
                          {sec.title}
                        </h3>
                        {sec.description && (
                          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {sec.description}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Venue & Joining Information */}
            <div className="rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 space-y-3 shadow-sm dark:shadow-none">
              <h2 className="text-base font-bold text-slate-900 dark:text-white">Location &amp; Access</h2>
              <div className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                {event.mode === "ONLINE" ? (
                  <Video className="h-4 w-4 shrink-0 text-[#1E5EFF] dark:text-blue-400 mt-0.5" />
                ) : (
                  <MapPin className="h-4 w-4 shrink-0 text-purple-600 dark:text-purple-400 mt-0.5" />
                )}
                <div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {event.mode === "ONLINE" ? "Live Interactive Stream" : "In-Person Classroom"}
                  </div>
                  <div className="text-slate-500 dark:text-slate-400 mt-0.5">{event.venueOrLink}</div>
                  {event.mode === "ONLINE" && (
                    <div className="mt-2 text-[11px] text-[#1E5EFF] dark:text-blue-300 italic">
                      * The direct meeting access link will be emailed to your inbox upon registration.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Registration Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl border border-slate-200/90 dark:border-white/15 bg-white dark:bg-[#0F1C3F] p-6 shadow-xl dark:shadow-2xl shadow-blue-500/5 dark:shadow-blue-500/10 space-y-6">
              {isSuccess ? (
                /* Success State Screen */
                <div className="py-8 text-center space-y-4 animate-in fade-in zoom-in-95">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                    <CheckCircle2 className="h-9 w-9" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Registration Confirmed!</h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Congratulations, <strong className="text-slate-900 dark:text-white">{fullName}</strong>! You have successfully
                    registered for <strong className="text-[#1E5EFF] dark:text-blue-300">{event.title}</strong>.
                  </p>

                  <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 p-3.5 text-xs text-emerald-800 dark:text-emerald-300 text-left space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <Mail className="h-4 w-4" />
                      <span>Confirmation Email Dispatched</span>
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-200/80">
                      We have sent the complete session agenda, calendar invite, and access instructions to{" "}
                      <strong>{email}</strong>.
                    </p>
                  </div>

                  <div className="pt-2">
                    <Link
                      href="/events"
                      className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 py-2.5 text-xs font-bold text-slate-800 dark:text-white transition-colors"
                    >
                      <CalendarCheck className="h-4 w-4 text-[#1E5EFF] dark:text-blue-400" />
                      <span>Browse More Masterclasses</span>
                    </Link>
                  </div>
                </div>
              ) : (
                /* Registration Form */
                <>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#1E5EFF] dark:text-blue-400 uppercase tracking-widest">
                        Reserve Your Seat
                      </span>
                      <span className="rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                        100% Free
                      </span>
                    </div>
                    <h3 className="mt-1 text-lg font-bold text-slate-900 dark:text-white">Register for this Masterclass</h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Fill in your details below. You will receive an instant confirmation email with access details.
                    </p>
                  </div>

                  {/* Seat availability counter */}
                  {event.maxCapacity && (
                    <div className="rounded-xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/5 p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500 dark:text-slate-400">Capacity</span>
                        <span className="font-bold text-slate-900 dark:text-white">
                          {event.registeredCount || 0} / {event.maxCapacity} seats filled
                        </span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-[#1E5EFF]"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((event.registeredCount || 0) / event.maxCapacity) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  )}

                  {formError && (
                    <div className="flex items-center gap-2 rounded-xl bg-rose-500/10 border border-rose-500/30 p-3 text-xs font-semibold text-rose-600 dark:text-rose-300">
                      <AlertCircle className="h-4 w-4 shrink-0 text-rose-500 dark:text-rose-400" />
                      <span>{formError}</span>
                    </div>
                  )}

                  <form onSubmit={handleRegister} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <input
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          disabled={event.isSoldOut || isSubmitting}
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/60 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                        Email Address (For Session Link) *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <input
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          disabled={event.isSoldOut || isSubmitting}
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/60 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                        Mobile Number *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-slate-500" />
                        <input
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value)}
                          required
                          disabled={event.isSoldOut || isSubmitting}
                          className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/60 pl-9 pr-3 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden disabled:opacity-50 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                        Questions for Speaker (Optional)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Any specific architecture topics or doubts you'd like covered..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        disabled={event.isSoldOut || isSubmitting}
                        className="w-full rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50/60 dark:bg-slate-900/60 p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:border-blue-500 focus:outline-hidden disabled:opacity-50 leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={event.isSoldOut || isSubmitting}
                      className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#1E5EFF] hover:bg-blue-600 py-3 text-xs font-bold text-white shadow-lg shadow-blue-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Confirming Registration...</span>
                        </>
                      ) : event.isSoldOut ? (
                        <span>Registrations Closed (Sold Out)</span>
                      ) : (
                        <>
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Register Free for Masterclass</span>
                        </>
                      )}
                    </button>

                    <p className="text-[11px] text-center text-slate-500">
                      By registering, you agree to receive event updates and learning resources from JKS Learning.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
