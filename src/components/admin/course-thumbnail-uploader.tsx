"use client";

import React, { useRef, useState } from "react";
import {
  Upload,
  Image as ImageIcon,
  X,
  Link2,
  Sparkles,
  Check,
  RotateCcw,
  AlertCircle,
  Eye,
} from "lucide-react";

interface CourseThumbnailUploaderProps {
  thumbnailUrl: string;
  onThumbnailChange: (url: string) => void;
  title?: string;
  track?: string;
  level?: string;
}

// 5 Curated Presets for JKS Learning Tracks
const PRESET_THUMBNAILS = [
  {
    id: "full-stack",
    label: "Full Stack Systems",
    track: "Full Stack",
    previewUrl: "/images/hero-developer.png",
    accent: "from-blue-600 to-indigo-900",
  },
  {
    id: "cloud-devops",
    label: "Cloud & Distributed",
    track: "Full Stack",
    previewUrl: "/images/lecturer-workstation-3d.png",
    accent: "from-indigo-600 to-slate-900",
  },
  {
    id: "frontend-react",
    label: "Frontend & Next.js",
    track: "Frontend",
    previewUrl: "/images/student-3d-developer.webp",
    accent: "from-cyan-600 to-blue-900",
  },
  {
    id: "sap-enterprise",
    label: "SAP ERP Architecture",
    track: "SAP",
    previewUrl: "/images/about-hero-3d.webp",
    accent: "from-amber-600 to-slate-950",
  },
];

export function CourseThumbnailUploader({
  thumbnailUrl,
  onThumbnailChange,
  title,
  track,
  level,
}: CourseThumbnailUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [urlInputMode, setUrlInputMode] = useState(false);
  const [customUrl, setCustomUrl] = useState("");

  // Client-side image processor: compresses large photos into high-res lightweight WebP/JPEG data URLs
  const processImageFile = (file: File) => {
    if (!file) return;

    // Validation
    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!validTypes.includes(file.type)) {
      setErrorMessage("Please select a valid image file (PNG, JPG, WebP, GIF, SVG).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage("Image file exceeds 10MB limit. Please choose a smaller image.");
      return;
    }

    setErrorMessage(null);
    setIsProcessing(true);

    // If SVG or tiny GIF, read directly as data URL
    if (file.type === "image/svg+xml" || file.size < 50 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          onThumbnailChange(result);
        }
        setIsProcessing(false);
      };
      reader.onerror = () => {
        setErrorMessage("Failed to read image file.");
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Canvas optimization to max 1280x720 16:9 WebP/JPEG
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const maxW = 1280;
          const maxH = 720;
          let width = img.width;
          let height = img.height;

          if (width > maxW || height > maxH) {
            const ratio = Math.min(maxW / width, maxH / height);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");

          if (!ctx) {
            onThumbnailChange(e.target?.result as string);
            setIsProcessing(false);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // Try WebP first for optimal compression
          let optimizedDataUrl = canvas.toDataURL("image/webp", 0.85);
          if (!optimizedDataUrl.startsWith("data:image/webp")) {
            optimizedDataUrl = canvas.toDataURL("image/jpeg", 0.85);
          }

          onThumbnailChange(optimizedDataUrl);
        } catch {
          // Fallback to original data URL if canvas fails
          onThumbnailChange(e.target?.result as string);
        } finally {
          setIsProcessing(false);
        }
      };
      img.onerror = () => {
        setErrorMessage("Invalid or corrupted image file.");
        setIsProcessing(false);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = () => {
      setErrorMessage("Failed to read image file.");
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
    // Reset file input so re-selecting same file triggers onChange
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const handleApplyCustomUrl = () => {
    if (!customUrl.trim()) return;
    onThumbnailChange(customUrl.trim());
    setCustomUrl("");
    setUrlInputMode(false);
    setErrorMessage(null);
  };

  return (
    <div className="space-y-3">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Header with Title & Action Links */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
          Course Media Banner & Thumbnail
        </label>
        <div className="flex items-center gap-2">
          {thumbnailUrl && (
            <button
              type="button"
              onClick={() => onThumbnailChange("")}
              className="text-[11px] font-bold text-rose-500 hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
            >
              Remove Thumbnail
            </button>
          )}
          <button
            type="button"
            onClick={() => setUrlInputMode(!urlInputMode)}
            className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
          >
            <Link2 className="h-3 w-3" />
            <span>{urlInputMode ? "Upload File Instead" : "Paste Image URL"}</span>
          </button>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/30 p-2.5 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="ml-auto text-rose-500 hover:text-rose-700"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {/* URL Input Box (When Toggled) */}
      {urlInputMode && (
        <div className="flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/50 dark:bg-blue-950/20 p-2">
          <Link2 className="h-4 w-4 text-blue-500 shrink-0 ml-1" />
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleApplyCustomUrl();
              }
            }}
            placeholder="https://images.unsplash.com/... or /images/..."
            className="flex-1 bg-transparent text-xs text-slate-800 dark:text-slate-200 placeholder-slate-400 outline-none"
          />
          <button
            type="button"
            onClick={handleApplyCustomUrl}
            className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white hover:bg-blue-700 transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}

      {/* ACTIVE PREVIEW OR DRAG-DROP UPLOAD ZONE */}
      {thumbnailUrl ? (
        /* ACTIVE THUMBNAIL 16:9 PREVIEW CARD */
        <div className="group relative overflow-hidden rounded-2xl border-2 border-blue-500/50 dark:border-blue-500/40 bg-slate-950 shadow-md">
          <div className="relative aspect-video w-full overflow-hidden bg-slate-900">
            {/* The Image */}
            <img
              src={thumbnailUrl}
              alt="Course Thumbnail"
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              onError={() => {
                setErrorMessage("Unable to load image from URL. Please check the link or upload a file.");
              }}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent pointer-events-none" />

            {/* Track & Status Badges */}
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
              <span className="rounded-lg bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-xs">
                Active Thumbnail
              </span>
              {track && (
                <span className="rounded-lg bg-blue-600/90 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white shadow-xs">
                  {track}
                </span>
              )}
            </div>

            {/* Overlaid Title & Meta */}
            <div className="absolute bottom-3 left-3 right-3 z-10">
              <div className="text-sm font-black text-white drop-shadow-md line-clamp-1">
                {title || "Course Title Preview"}
              </div>
              <div className="text-[11px] font-medium text-slate-300 mt-0.5">
                {level || "All Levels"} · 16:9 High-Definition Banner
              </div>
            </div>

            {/* Hover Actions Bar */}
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 rounded-xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-white shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer"
                title="Change Image File"
              >
                <Upload className="h-3.5 w-3.5 text-[#2563EB]" />
                <span>Replace</span>
              </button>
              <button
                type="button"
                onClick={() => onThumbnailChange("")}
                className="flex items-center justify-center rounded-xl bg-rose-600/90 backdrop-blur-md p-1.5 text-white shadow-md hover:bg-rose-700 transition-all cursor-pointer"
                title="Remove Image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* INTERACTIVE DRAG-DROP UPLOAD ZONE */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 sm:p-8 text-center transition-all cursor-pointer select-none ${
            isDragging
              ? "border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/40 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 bg-slate-50/70 dark:bg-surface-elevated hover:border-[#2563EB]/70 hover:bg-slate-50 dark:hover:bg-surface-hover"
          }`}
        >
          {isProcessing ? (
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="h-8 w-8 animate-spin rounded-full border-3 border-blue-500 border-t-transparent" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Optimizing & Processing Image...
              </span>
            </div>
          ) : (
            <>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EFF6FF] dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 shadow-xs mb-2">
                <Upload className="h-6 w-6" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">
                {isDragging ? "Drop image to upload" : "Click to upload or drag and drop"}
              </div>
              <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                16:9 banner recommended · PNG, JPG, WebP, SVG up to 10MB
              </p>
              <div className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-2xs hover:bg-blue-50 dark:hover:bg-slate-700 transition-colors">
                <ImageIcon className="h-3.5 w-3.5" />
                <span>Browse Files</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* CURATED PRESET THUMBNAILS ROW */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-amber-500" />
            <span>Or Choose a Curated JKS Preset:</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {PRESET_THUMBNAILS.map((preset) => {
            const isSelected = thumbnailUrl === preset.previewUrl;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  onThumbnailChange(preset.previewUrl);
                  setErrorMessage(null);
                }}
                className={`group relative overflow-hidden rounded-xl border p-2 text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/50 dark:bg-blue-950/30"
                    : "border-slate-200 dark:border-slate-700/80 bg-white dark:bg-surface-elevated hover:border-slate-300 dark:hover:border-slate-600"
                }`}
              >
                <div className="relative h-14 w-full overflow-hidden rounded-lg bg-slate-900">
                  <img
                    src={preset.previewUrl}
                    alt={preset.label}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 to-transparent" />
                  {isSelected && (
                    <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white shadow-xs">
                      <Check className="h-2.5 w-2.5 stroke-[3]" />
                    </div>
                  )}
                </div>
                <div className="mt-1.5 text-[11px] font-bold text-slate-800 dark:text-slate-200 truncate">
                  {preset.label}
                </div>
                <div className="text-[10px] text-slate-400 dark:text-slate-400 truncate">
                  {preset.track}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
