"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Play, Award, Building, Sparkles, CheckCircle2 } from "lucide-react";
import { normalizeVideoEmbedUrl, type SuccessStoryItem } from "@/lib/data/success-stories-store";

interface VideoStoryModalProps {
  story: SuccessStoryItem | null;
  onClose: () => void;
}

export function VideoStoryModal({ story, onClose }: VideoStoryModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (story) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [story, onClose]);

  if (!story || !story.videoUrl) return null;

  const { isEmbed, url, isVideoFile } = normalizeVideoEmbedUrl(story.videoUrl);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 md:p-8 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
        {/* Backdrop click to dismiss */}
        <div className="absolute inset-0" onClick={onClose} aria-hidden />

        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 10 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl border border-slate-700/60 bg-slate-900 shadow-2xl overflow-hidden"
        >
          {/* Top Bar with Student Info & Close */}
          <div className="flex items-center justify-between border-b border-slate-800 px-5 py-3.5 bg-slate-900/90 backdrop-blur-md">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-400 text-white font-bold text-xs ring-2 ring-blue-500/20 overflow-hidden shadow-xs">
                {story.avatar ? (
                  <img
                    src={story.avatar}
                    alt={story.name}
                    className="h-full w-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span>{story.name.slice(0, 2).toUpperCase()}</span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white truncate">{story.name}</h3>
                  {story.verified && (
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-800/40 px-1.5 py-0.5 rounded-md">
                      <CheckCircle2 className="h-2.5 w-2.5" /> Verified
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                  <span className="text-[#38BDF8] font-semibold">{story.placedCompany || story.company}</span>
                  <span>•</span>
                  <span>{story.role}</span>
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all cursor-pointer ring-1 ring-white/10"
              title="Close video (Esc)"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Video Player Container (16:9 Aspect Ratio) */}
          <div className="relative w-full aspect-video bg-black flex items-center justify-center overflow-hidden">
            {isEmbed ? (
              <iframe
                src={url}
                title={`${story.name} Success Story Testimonial Video`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : isVideoFile ? (
              <video
                src={url}
                controls
                autoPlay
                className="w-full h-full object-contain"
                poster={story.videoThumbnail || story.avatar}
              >
                Your browser does not support HTML5 video.
              </video>
            ) : (
              <div className="p-8 text-center text-slate-400">
                <Play className="h-10 w-10 mx-auto text-blue-500 mb-2 opacity-60" />
                <p className="text-sm font-semibold">Video source could not be played</p>
                <a
                  href={story.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block text-xs text-blue-400 underline"
                >
                  Open video in new tab
                </a>
              </div>
            )}
          </div>

          {/* Bottom Card Summary */}
          <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                {story.salaryPackage && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-300">
                    <Award className="h-3.5 w-3.5" /> Package: {story.salaryPackage}
                  </span>
                )}
                {story.salaryHike && (
                  <span className="inline-flex items-center gap-1 rounded-lg bg-blue-500/15 border border-blue-500/30 px-2.5 py-1 text-xs font-bold text-blue-300">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" /> {story.salaryHike}
                  </span>
                )}
                <span className="rounded-lg bg-slate-800 border border-slate-700 px-2.5 py-1 text-xs font-medium text-slate-300">
                  Track: {story.track}
                </span>
              </div>
              {story.capstone && (
                <div className="text-xs text-slate-400">
                  <span className="text-slate-500">Capstone:</span> <span className="font-medium text-slate-200">{story.capstone}</span>
                </div>
              )}
            </div>
            {story.quote && (
              <blockquote className="mt-3 text-xs sm:text-sm text-slate-300 italic border-l-2 border-blue-500 pl-3 leading-relaxed">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
