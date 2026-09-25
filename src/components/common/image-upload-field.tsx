"use client";

import React, { useRef, useState, useCallback } from "react";
import {
  Upload,
  Image as ImageIcon,
  X,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Loader2,
  Cloud,
} from "lucide-react";
import { uploadImage, type ImageContext } from "@/lib/api/upload-api";

export interface ImageUploadFieldProps {
  label?: string;
  context?: ImageContext;
  folder?: string;
  currentUrl?: string | null;
  value?: string | null;
  currentPublicId?: string | null;
  publicId?: string | null;
  onUploadComplete?: (url: string, publicId: string) => void;
  onChange?: (url: string, publicId?: string) => void;
  onRemove?: () => void;
  className?: string;
  previewHeight?: string;
  aspectRatio?: string;
  hint?: string;
  helperText?: string;
}

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export function ImageUploadField({
  label,
  context,
  folder,
  currentUrl,
  value,
  currentPublicId,
  publicId,
  onUploadComplete,
  onChange,
  onRemove,
  className = "",
  previewHeight = "h-48",
  aspectRatio,
  hint,
  helperText,
}: ImageUploadFieldProps) {
  const effectiveContext = ((context || folder || "other") as ImageContext);
  const effectiveUrl = value !== undefined ? value : currentUrl;
  const effectiveHint = helperText || hint;

  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(effectiveUrl || null);

  React.useEffect(() => {
    setUploadedUrl(effectiveUrl || null);
  }, [effectiveUrl]);

  const handleFile = useCallback(
    async (file: File) => {
      setError(null);

      if (!ALLOWED_TYPES.includes(file.type)) {
        setError("Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG.");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError("File exceeds 10 MB limit.");
        return;
      }

      setIsUploading(true);
      try {
        const result = await uploadImage(file, effectiveContext);
        setUploadedUrl(result.url);
        onUploadComplete?.(result.url, result.publicId);
        onChange?.(result.url, result.publicId);
      } catch (err: any) {
        setError(err.message || "Upload failed. Please try again.");
      } finally {
        setIsUploading(false);
      }
    },
    [effectiveContext, onUploadComplete, onChange]
  );

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
    e.target.value = "";
  };

  const handleRemove = () => {
    setUploadedUrl(null);
    setError(null);
    onChange?.("", "");
    onRemove?.();
  };

  const preview = uploadedUrl;

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
          {label}
        </label>
      )}

      {preview ? (
        <div className={`relative w-full ${previewHeight} overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 group`}>
          {/* Preview Image */}
          <img
            src={preview}
            alt="Uploaded image preview"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setError("Failed to load image preview.")}
          />

          {/* Overlay controls */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-1.5 rounded-xl bg-white/90 px-3 py-1.5 text-xs font-bold text-slate-900 hover:bg-white transition-colors cursor-pointer shadow"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Replace
            </button>
            {onRemove && (
              <button
                type="button"
                onClick={handleRemove}
                className="flex items-center gap-1.5 rounded-xl bg-rose-500/90 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-600 transition-colors cursor-pointer shadow"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            )}
          </div>

          {/* Cloudinary badge */}
          <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-blue-600/90 backdrop-blur-sm px-2 py-0.5 text-[10px] font-bold text-white">
            <Cloud className="h-3 w-3" />
            <span>Cloudinary</span>
          </div>

          {/* Checkmark */}
          <div className="absolute top-2 left-2 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow">
            <CheckCircle2 className="h-4 w-4" />
          </div>
        </div>
      ) : (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isUploading && inputRef.current?.click()}
          className={`relative flex ${previewHeight} w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer select-none text-center ${
            isDragging
              ? "border-blue-500 bg-blue-50/80 dark:bg-blue-950/30 scale-[1.01]"
              : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800/60"
          } ${isUploading ? "pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Uploading to Cloudinary...
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 px-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-500">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {isDragging ? "Drop to upload" : "Click or drag & drop"}
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {effectiveHint || "PNG, JPG, WebP, GIF, SVG — max 10 MB"}
              </p>
              <div className="mt-1 inline-flex items-center gap-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400 shadow-xs">
                <ImageIcon className="h-3.5 w-3.5" />
                Browse Files
              </div>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/40 px-3 py-2 text-xs text-rose-700 dark:text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  );
}
