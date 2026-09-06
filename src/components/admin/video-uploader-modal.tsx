"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  FileVideo,
  Play,
  Film,
  Sparkles,
  Loader2,
  Lock,
  Eye,
} from "lucide-react";
import {
  requestDirectUploadTicket,
  uploadVideoToCloudflare,
  type VideoMetadata,
} from "@/lib/data/videos-api";

interface VideoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseTitle?: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  onSuccess?: (videoUid: string, title: string) => void;
}

export function VideoUploaderModal({
  isOpen,
  onClose,
  courseTitle = "General Course Track",
  courseId,
  moduleId,
  topicId,
  onSuccess,
}: VideoUploaderModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoTitle, setVideoTitle] = useState("");
  const [isFreeDemo, setIsFreeDemo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadedUid, setUploadedUid] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("video/")) {
        setErrorMessage("Please select a valid video file (.mp4, .mov, .webm, .mkv).");
        return;
      }
      setSelectedFile(file);
      if (!videoTitle) {
        setVideoTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
      setErrorMessage(null);
    }
  };

  const handleStartUpload = async () => {
    if (!selectedFile) {
      setErrorMessage("Please choose a video file to upload.");
      return;
    }
    if (!videoTitle.trim()) {
      setErrorMessage("Please provide a title for the video lesson.");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    try {
      // Step 1: Request Direct Upload Ticket from Railway Backend
      const ticket = await requestDirectUploadTicket({
        title: videoTitle.trim(),
        courseId,
        moduleId,
        topicId,
        isFreeDemo,
      });

      // Step 2: Upload directly to Cloudflare Stream
      await uploadVideoToCloudflare(
        ticket.uploadUrl,
        selectedFile,
        (percent) => {
          setUploadProgress(percent);
        }
      );

      setUploadedUid(ticket.videoUid);
      setUploadProgress(100);
      onSuccess?.(ticket.videoUid, videoTitle.trim());
    } catch (err: any) {
      console.error("Video upload failed:", err);
      setErrorMessage(
        err?.message || "Failed to upload video to Cloudflare Stream. Please check your network and API credentials."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setVideoTitle("");
    setUploadProgress(null);
    setUploadedUid(null);
    setErrorMessage(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[24px] border border-white/80 bg-white p-6 shadow-2xl space-y-5 sm:p-7">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563EB] shadow-xs">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">
                Upload Course Video
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Cloudflare Stream adaptive HLS transcoding • {courseTitle}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* SUCCESS STATE */}
        {uploadedUid && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50/80 p-5 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Video Uploaded Successfully to Cloudflare!
              </h4>
              <p className="text-xs text-slate-600 mt-1">
                Cloudflare Stream is now auto-encoding adaptive bitrates (1080p, 720p, 480p).
              </p>
            </div>
            <div className="rounded-xl bg-white p-2.5 font-mono text-[11px] text-slate-700 border border-emerald-200 select-all">
              Video UID: {uploadedUid}
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Upload Another Video
              </button>
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl bg-[#2563EB] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
              >
                Done
              </button>
            </div>
          </div>
        )}

        {/* UPLOAD FORM (When not finished) */}
        {!uploadedUid && (
          <div className="space-y-4">
            {/* File Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-6 text-center cursor-pointer transition-all ${
                selectedFile
                  ? "border-blue-400 bg-blue-50/40"
                  : "border-slate-300 hover:border-[#2563EB] bg-slate-50/50 hover:bg-blue-50/20"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,video/webm,video/x-matroska"
                onChange={handleFileChange}
                className="hidden"
                disabled={isUploading}
              />

              {selectedFile ? (
                <div className="space-y-1.5">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#2563EB] text-white shadow-md shadow-blue-500/20">
                    <FileVideo className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-bold text-slate-900 truncate max-w-xs">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-slate-500 font-medium">
                    {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB • Click to change file
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#2563EB] hover:underline">
                      Click to choose video
                    </span>{" "}
                    <span className="text-xs text-slate-500">or drag and drop</span>
                  </div>
                  <p className="text-[10px] text-slate-400">
                    Supports MP4, MOV, WEBM, MKV up to 5GB
                  </p>
                </div>
              )}
            </div>

            {/* Video Title Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Lesson Video Title
              </label>
              <input
                type="text"
                placeholder="e.g. 01 — Enterprise Microservices Architecture"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                disabled={isUploading}
                className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-medium text-slate-800 outline-none focus:border-[#2563EB] shadow-xs"
              />
            </div>

            {/* Free Demo Toggle */}
            <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 border border-slate-100">
              <div className="flex items-center gap-2">
                {isFreeDemo ? (
                  <Eye className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Lock className="h-4 w-4 text-slate-400" />
                )}
                <div>
                  <div className="text-xs font-bold text-slate-800">
                    {isFreeDemo ? "Free Public Demo Video" : "Enrollment Protected Video"}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">
                    {isFreeDemo
                      ? "Available for anyone visiting the course page without login."
                      : "Only accessible to authenticated students with active enrollment."}
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsFreeDemo(!isFreeDemo)}
                disabled={isUploading}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                  isFreeDemo ? "bg-[#2563EB]" : "bg-slate-300"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                    isFreeDemo ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-700 flex items-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" />
                    <span>Uploading directly to Cloudflare Stream...</span>
                  </span>
                  <span className="text-[#2563EB]">{uploadProgress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#2563EB] to-cyan-500 transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isUploading}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleStartUpload}
                disabled={isUploading || !selectedFile}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 transition-all cursor-pointer disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Uploading ({uploadProgress}%)</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="h-4 w-4" />
                    <span>Upload to Cloudflare</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
