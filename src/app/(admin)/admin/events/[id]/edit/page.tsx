"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Video,
  MapPin,
  Sparkles,
  Users,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  User,
  FileText,
} from "lucide-react";
import {
  fetchAdminEventById,
  updateAdminEvent,
  type CreateEventPayload,
  type EventMode,
  type EventStatus,
} from "@/lib/data/events-api";

export default function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [mode, setMode] = useState<EventMode>("ONLINE");
  const [status, setStatus] = useState<EventStatus>("PUBLISHED");
  const [venueOrLink, setVenueOrLink] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [maxCapacity, setMaxCapacity] = useState<string>("");

  // Speaker state
  const [speakerName, setSpeakerName] = useState("");
  const [speakerRole, setSpeakerRole] = useState("");
  const [speakerBio, setSpeakerBio] = useState("");
  const [speakerAvatar, setSpeakerAvatar] = useState("");

  // Agenda / Session breakdown
  const [sessionDetails, setSessionDetails] = useState("");

  useEffect(() => {
    async function loadEvent() {
      setIsLoading(true);
      const event = await fetchAdminEventById(eventId);
      if (!event) {
        setErrorMessage("Event not found.");
        setIsLoading(false);
        return;
      }

      setTitle(event.title || "");
      setSlug(event.slug || "");
      setDescription(event.description || "");
      setBannerUrl(event.bannerUrl || "");
      setMode(event.mode || "ONLINE");
      setStatus(event.status || "PUBLISHED");
      setVenueOrLink(event.venueOrLink || "");

      // Format dates for datetime-local input (YYYY-MM-DDTHH:mm)
      if (event.startDate) {
        const d = new Date(event.startDate);
        const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setStartDate(iso);
      }
      if (event.endDate) {
        const d = new Date(event.endDate);
        const iso = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
        setEndDate(iso);
      }

      setMaxCapacity(event.maxCapacity ? String(event.maxCapacity) : "");
      setSpeakerName(event.speakerName || "");
      setSpeakerRole(event.speakerRole || "");
      setSpeakerBio(event.speakerBio || "");
      setSpeakerAvatar(event.speakerAvatar || "");
      setSessionDetails(event.sessionDetails || "");

      setIsLoading(false);
    }

    loadEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Event title is required.");
      return;
    }
    if (!description.trim()) {
      setErrorMessage("Event description is required.");
      return;
    }
    if (!venueOrLink.trim()) {
      setErrorMessage(
        mode === "ONLINE"
          ? "Meeting link (Zoom/Google Meet) is required."
          : "Venue address is required."
      );
      return;
    }
    if (!startDate) {
      setErrorMessage("Start date and time is required.");
      return;
    }

    setIsSubmitting(true);

    const payload: Partial<CreateEventPayload> = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      bannerUrl: bannerUrl.trim() || undefined,
      mode,
      status,
      venueOrLink: venueOrLink.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: endDate ? new Date(endDate).toISOString() : undefined,
      maxCapacity: maxCapacity ? parseInt(maxCapacity, 10) : undefined,
      speakerName: speakerName.trim() || undefined,
      speakerRole: speakerRole.trim() || undefined,
      speakerBio: speakerBio.trim() || undefined,
      speakerAvatar: speakerAvatar.trim() || undefined,
      sessionDetails: sessionDetails.trim() || undefined,
    };

    const res = await updateAdminEvent(eventId, payload);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin/events");
    } else {
      setErrorMessage(res.error || "Failed to update event. Please check your inputs.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E5EFF]" />
        <p className="mt-3 text-xs font-semibold text-slate-500">Loading event details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-16">
      {/* Back Button & Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/admin/events"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Edit Event</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Modify event schedule, location, speaker info, and capacity
          </p>
        </div>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-4 text-xs font-semibold text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Core Details */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Sparkles className="h-4 w-4 text-[#1E5EFF]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Event Basics</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  URL Slug
                </label>
                <div className="flex items-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3 py-2 text-xs">
                  <span className="text-slate-400 font-mono">/events/</span>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full bg-transparent pl-1 font-mono text-slate-900 dark:text-white focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Publishing Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as EventStatus)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="PUBLISHED">Published (Live on website)</option>
                  <option value="DRAFT">Draft (Admin visible only)</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Event Description & Overview *
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Banner / Poster Image URL
              </label>
              <input
                type="url"
                value={bannerUrl}
                onChange={(e) => setBannerUrl(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Date, Time, Venue & Capacity */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <Clock className="h-4 w-4 text-[#1E5EFF]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Schedule & Location</h2>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Start Date & Time (IST) *
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  End Date & Time (IST) (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  Event Mode *
                </label>
                <select
                  value={mode}
                  onChange={(e) => setMode(e.target.value as EventMode)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                >
                  <option value="ONLINE">Online (Live Stream / Zoom)</option>
                  <option value="OFFLINE">Offline (In-Person Workshop)</option>
                  <option value="HYBRID">Hybrid (Online + In-Person)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                  {mode === "ONLINE" ? "Meeting Link / Platform *" : "Physical Address / Venue *"}
                </label>
                <input
                  type="text"
                  value={venueOrLink}
                  onChange={(e) => setVenueOrLink(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Seat / Capacity Limit (Optional)
              </label>
              <input
                type="number"
                min="1"
                placeholder="e.g. 100 (Leave empty for unlimited seats)"
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
                className="w-full max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Speaker Information */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <User className="h-4 w-4 text-[#1E5EFF]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Speaker & Mentor Details</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Speaker Name
              </label>
              <input
                type="text"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Speaker Designation / Role
              </label>
              <input
                type="text"
                value={speakerRole}
                onChange={(e) => setSpeakerRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Speaker Bio & Background
              </label>
              <textarea
                rows={2}
                value={speakerBio}
                onChange={(e) => setSpeakerBio(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Speaker Headshot / Avatar URL
              </label>
              <input
                type="url"
                value={speakerAvatar}
                onChange={(e) => setSpeakerAvatar(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Session Breakdown & Agenda */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
            <FileText className="h-4 w-4 text-[#1E5EFF]" />
            <h2 className="text-sm font-bold text-slate-900 dark:text-white">Session Agenda & Topics</h2>
          </div>

          <div className="text-xs">
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
              Detailed Agenda (Included in Confirmation Email)
            </label>
            <textarea
              rows={4}
              value={sessionDetails}
              onChange={(e) => setSessionDetails(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated p-3 text-xs text-slate-900 dark:text-white focus:border-blue-500 focus:outline-hidden leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Submission Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/events"
            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-xl bg-[#1E5EFF] hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Update Event</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
