"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Lock,
  Sparkles,
  CheckCircle2,
  Tv,
} from "lucide-react";

interface InAppVideoPlayerProps {
  title: string;
  videoUrl: string;
  videoType: "upload" | "url";
  durationFormatted?: string;
  antiSkip?: boolean;
  onVideoCompleted?: () => void;
  onProgressChange?: (percent: number) => void;
  autoPlay?: boolean;
  className?: string;
}

// Utility to parse YouTube video IDs from various URL formats
function getYouTubeEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = rawUrl.match(regExp);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    // Use youtube-nocookie and clean embed parameters to keep playback in-app
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
  }
  return null;
}

// Utility to parse Vimeo video IDs
function getVimeoEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const match = rawUrl.match(regExp);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;
  }
  return null;
}

export function InAppVideoPlayer({
  title,
  videoUrl,
  videoType,
  durationFormatted = "3:00",
  antiSkip = false,
  onVideoCompleted,
  onProgressChange,
  autoPlay = false,
  className = "",
}: InAppVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [simulationTimerActive, setSimulationTimerActive] = useState(false);

  // Check if URL is an external embed (YouTube / Vimeo)
  const isYouTube = videoType === "url" && (videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"));
  const isVimeo = videoType === "url" && videoUrl.includes("vimeo.com");
  const youTubeEmbedSrc = isYouTube ? getYouTubeEmbedUrl(videoUrl) : null;
  const vimeoEmbedSrc = isVimeo ? getVimeoEmbedUrl(videoUrl) : null;
  const isExternalEmbed = Boolean(youTubeEmbedSrc || vimeoEmbedSrc);

  // Reset when videoUrl or title changes
  useEffect(() => {
    setIsPlaying(autoPlay);
    setProgressPercent(0);
    setCurrentTime(0);
    setIsCompleted(false);
  }, [videoUrl, title, autoPlay]);

  // Simulation progress timer for external embedded frames (since iframes cannot emit cross-origin timeupdate directly without complex postMessage setup)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isExternalEmbed && simulationTimerActive && progressPercent < 100) {
      interval = setInterval(() => {
        setProgressPercent((prev) => {
          const next = Math.min(prev + 2, 100);
          onProgressChange?.(next);
          if (next >= 100) {
            clearInterval(interval);
            setIsCompleted(true);
            setSimulationTimerActive(false);
            onVideoCompleted?.();
          }
          return next;
        });
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isExternalEmbed, simulationTimerActive, progressPercent, onProgressChange, onVideoCompleted]);

  // HTML5 native video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 1;
    setCurrentTime(current);
    setDuration(dur);
    const pct = Math.round((current / dur) * 100);
    setProgressPercent(pct);
    onProgressChange?.(pct);

    if (pct >= 98 && !isCompleted) {
      setIsCompleted(true);
      onVideoCompleted?.();
    }
  };

  const togglePlay = () => {
    if (isExternalEmbed) {
      setSimulationTimerActive((prev) => !prev);
      setIsPlaying((prev) => !prev);
      return;
    }

    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleRestart = () => {
    setProgressPercent(0);
    setCurrentTime(0);
    setIsCompleted(false);
    if (isExternalEmbed) {
      setSimulationTimerActive(true);
      setIsPlaying(true);
    } else if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // When it's an external embed (YouTube / Vimeo), render the native iframe cleanly without duplicate template controls
  if (isExternalEmbed) {
    return (
      <div
        ref={containerRef}
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl ${className}`}
      >
        {youTubeEmbedSrc ? (
          <iframe
            src={youTubeEmbedSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : vimeoEmbedSrc ? (
          <iframe
            src={vimeoEmbedSrc}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : null}
      </div>
    );
  }

  // HTML5 native video player with in-app tracking and custom controls
  return (
    <div
      ref={containerRef}
      className={`group relative flex aspect-video w-full flex-col justify-between overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 text-white shadow-2xl ${className}`}
    >
      {/* Top Header Badge Overlay */}
      <div className="relative z-20 flex items-center justify-between bg-gradient-to-b from-slate-950/90 via-slate-950/40 to-transparent p-2.5 sm:p-4 transition-opacity">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <span className="flex items-center gap-1 rounded-lg bg-blue-600/90 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[10px] sm:text-[11px] font-bold text-white shadow-xs backdrop-blur-md shrink-0">
            <Tv className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            <span>Protected Player</span>
          </span>
          <span className="truncate text-[11px] sm:text-xs font-semibold text-slate-300 max-w-[140px] sm:max-w-md hidden sm:inline-block">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {antiSkip && (
            <span className="flex items-center gap-1 rounded-md bg-amber-500/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-amber-300 border border-amber-500/30">
              <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span className="hidden xs:inline">Anti-Skip</span>
            </span>
          )}
          {isCompleted && (
            <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 px-1.5 sm:px-2 py-0.5 text-[9px] sm:text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              <span>Done</span>
            </span>
          )}
        </div>
      </div>

      {/* Main HTML5 Video Canvas */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-black">
        <video
          ref={videoRef}
          src={
            videoUrl ||
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsCompleted(true);
            setIsPlaying(false);
            onVideoCompleted?.();
          }}
          playsInline
          className="h-full w-full object-contain"
        />

        {/* Central Play/Pause Watermark Button */}
        {!isPlaying && (
          <button
            type="button"
            onClick={togglePlay}
            className="absolute z-10 flex h-16 w-16 items-center justify-center rounded-full bg-[#2563EB]/90 text-white shadow-2xl backdrop-blur-md transition-transform hover:scale-110 active:scale-95 cursor-pointer"
          >
            <Play className="h-7 w-7 fill-white translate-x-0.5" />
          </button>
        )}
      </div>

      {/* Bottom Controls Bar */}
      <div className="relative z-20 bg-gradient-to-t from-slate-950 via-slate-950/85 to-transparent p-3 sm:p-4 space-y-2">
        {/* Progress Scrubber */}
        <div className="relative h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-[#2563EB] transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={togglePlay}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 fill-white" />
              )}
            </button>

            <button
              type="button"
              onClick={handleRestart}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Restart Video"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>

            <span className="font-mono text-[11px] text-slate-400">
              {duration > 0 ? (
                `${formatSeconds(currentTime)} / ${formatSeconds(duration)}`
              ) : (
                <span>{durationFormatted}</span>
              )}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400">
              {progressPercent}% watched
            </span>

            <button
              type="button"
              onClick={toggleMute}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-rose-400" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>

            <button
              type="button"
              onClick={handleFullscreen}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
              title="Fullscreen"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

