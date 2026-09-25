"use client";

import React, { useState } from "react";
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
  Plus,
  Trash2,
  Layers,
} from "lucide-react";
import {
  createAdminEvent,
  type CreateEventPayload,
  type EventMode,
  type EventStatus,
  type EventSectionItem,
} from "@/lib/data/events-api";
import { ImageUploadField } from "@/components/common/image-upload-field";

export default function CreateEventPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [bannerPublicId, setBannerPublicId] = useState("");
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
  const [speakerAvatarPublicId, setSpeakerAvatarPublicId] = useState("");

  // Agenda / Session breakdown
  const [sessionDetails, setSessionDetails] = useState("");

  // Event Sections with Multiple Images
  const [sections, setSections] = useState<EventSectionItem[]>([]);

  const handleAddSection = () => {
    const newSec: EventSectionItem = {
      id: `sec-${Date.now()}`,
      title: "",
      description: "",
      imageUrl: "",
      cloudinaryPublicId: "",
    };
    setSections((prev) => [...prev, newSec]);
  };

  const handleUpdateSection = (index: number, field: keyof EventSectionItem, val: string) => {
    setSections((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleRemoveSection = (index: number) => {
    setSections((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!slug || slug === autoSlug(title)) {
      setSlug(autoSlug(val));
    }
  };

  const autoSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

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

    const payload: CreateEventPayload = {
      title: title.trim(),
      slug: slug.trim() || undefined,
      description: description.trim(),
      bannerUrl: bannerUrl.trim() || undefined,
      bannerPublicId: bannerPublicId.trim() || undefined,
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
      speakerAvatarPublicId: speakerAvatarPublicId.trim() || undefined,
      sessionDetails: sessionDetails.trim() || undefined,
      sections: sections.length > 0 ? sections : undefined,
    };

    const res = await createAdminEvent(payload);
    setIsSubmitting(false);

    if (res.success) {
      router.push("/admin/events");
    } else {
      setErrorMessage(res.error || "Failed to create event. Please check your inputs.");
    }
  };

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
          <h1 className="text-xl font-black text-slate-900 dark:text-white">Create New Event</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish a live masterclass, technical workshop, or webinar
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
                placeholder="e.g. Masterclass: Building Production RAG Pipelines with LangChain & Next.js"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
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
                    placeholder="rag-pipelines-masterclass"
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
                placeholder="Describe what learners will gain from this session, key takeaways, and prerequisites..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <ImageUploadField
              label="Event Banner / Thumbnail Image"
              value={bannerUrl}
              publicId={bannerPublicId}
              onChange={(url, pid) => {
                setBannerUrl(url);
                setBannerPublicId(pid || "");
              }}
              folder="event-thumbnail"
              aspectRatio="16/9"
              helperText="Upload 16:9 banner or poster directly from your device (JPG, PNG, WebP, GIF, SVG up to 10MB)"
            />
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
                  placeholder={
                    mode === "ONLINE"
                      ? "e.g. https://meet.google.com/xyz or Zoom Meeting URL"
                      : "e.g. JKS Learning Campus, Hyderabad, Telangana"
                  }
                  value={venueOrLink}
                  onChange={(e) => setVenueOrLink(e.target.value)}
                  required
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
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
                className="w-full max-w-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
              <p className="mt-1 text-[11px] text-slate-400">
                Registrations will automatically lock with "Sold Out" once capacity is reached.
              </p>
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
                placeholder="e.g. Dr. Rohit Kapoor / Patan Davood"
                value={speakerName}
                onChange={(e) => setSpeakerName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Speaker Designation / Role
              </label>
              <input
                type="text"
                placeholder="e.g. Principal AI Architect / Ex-Google SDE"
                value={speakerRole}
                onChange={(e) => setSpeakerRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated px-3.5 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px] mb-1">
                Speaker Bio & Background
              </label>
              <textarea
                rows={2}
                placeholder="Brief bio highlighting industry background, certifications, and expertise..."
                value={speakerBio}
                onChange={(e) => setSpeakerBio(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden leading-relaxed"
              />
            </div>

            <div className="sm:col-span-2">
              <ImageUploadField
                label="Speaker Headshot / Portrait"
                value={speakerAvatar}
                publicId={speakerAvatarPublicId}
                onChange={(url, pid) => {
                  setSpeakerAvatar(url);
                  setSpeakerAvatarPublicId(pid || "");
                }}
                folder="event-speaker"
                aspectRatio="1/1"
                helperText="Upload speaker photo directly from your device (JPG, PNG, WebP up to 10MB)"
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
              placeholder="e.g.&#10;10:00 AM - 10:45 AM: Introduction & Architecture Setup&#10;10:45 AM - 11:30 AM: Live Coding Demonstration&#10;11:30 AM - 12:00 PM: Interactive Q&A and Career Roadmap"
              value={sessionDetails}
              onChange={(e) => setSessionDetails(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-surface-elevated p-3 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Section 5: Event Sections & Media (Requirement 5) */}
        <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4 text-[#1E5EFF]" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">Event Sections & Media Gallery</h2>
            </div>
            <button
              type="button"
              onClick={handleAddSection}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 px-3 py-1.5 text-xs font-bold text-[#1E5EFF] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Section</span>
            </button>
          </div>

          {sections.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 dark:border-slate-800 p-6 text-center text-xs text-slate-400">
              No custom sections added yet. Click &quot;Add Section&quot; to add detailed curriculum sections, workshop previews, or highlights with Cloudinary uploaded images.
            </div>
          ) : (
            <div className="space-y-4">
              {sections.map((sec, idx) => (
                <div
                  key={sec.id || idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-surface-elevated p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Section #{idx + 1}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSection(idx)}
                      className="text-xs text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 font-semibold inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Remove</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Section Title
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Architecture Blueprint & Hands-on Lab"
                        value={sec.title}
                        onChange={(e) => handleUpdateSection(idx, "title", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary px-3 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Section Description
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Describe the content covered in this section..."
                        value={sec.description}
                        onChange={(e) => handleUpdateSection(idx, "description", e.target.value)}
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-secondary p-2.5 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-blue-500 focus:outline-hidden"
                      />
                    </div>

                    <ImageUploadField
                      label={`Section #${idx + 1} Image`}
                      value={sec.imageUrl}
                      publicId={sec.cloudinaryPublicId}
                      onChange={(url, pid) => {
                        handleUpdateSection(idx, "imageUrl", url);
                        handleUpdateSection(idx, "cloudinaryPublicId", pid || "");
                      }}
                      folder="event-section"
                      aspectRatio="16/9"
                      helperText="Upload section diagram, photo, or visual directly to Cloudinary"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
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
                <span>Creating Event...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                <span>Publish Event</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
