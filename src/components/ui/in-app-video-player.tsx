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
  ExternalLink,
  AlertTriangle,
  Cloud,
  Film,
  Loader2,
} from "lucide-react";

import type { VideoSourceType } from "@/lib/data/courses-store";
import { checkBunnyEmbedStatus } from "@/lib/data/videos-api";

interface InAppVideoPlayerProps {
  title: string;
  videoUrl: string;
  videoType: VideoSourceType | string;
  durationFormatted?: string;
  antiSkip?: boolean;
  onVideoCompleted?: () => void;
  onVideoEnded?: () => void;
  onProgressChange?: (percent: number) => void;
  autoPlay?: boolean;
  isPaused?: boolean;
  className?: string;
}

// Clean pasted video URL or extract src if user pasted an <iframe> snippet
function cleanVideoUrl(rawUrl: string): string {
  if (!rawUrl) return "";
  const trimmed = rawUrl.trim();
  const iframeMatch = trimmed.match(/<iframe[^>]+src=["']([^"']+)["']/i);
  if (iframeMatch && iframeMatch[1]) {
    return iframeMatch[1];
  }
  return trimmed;
}

// Utility to parse YouTube video IDs from various URL formats
function getYouTubeEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const cleaned = cleanVideoUrl(rawUrl);
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = cleaned.match(regExp);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1&enablejsapi=1&playsinline=1`;
  }
  return null;
}

// Utility to parse Vimeo video IDs
function getVimeoEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const cleaned = cleanVideoUrl(rawUrl);
  const regExp = /(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/;
  const match = cleaned.match(regExp);
  if (match && match[1]) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1&badge=0&autopause=0&player_id=0&app_id=58479`;
  }
  return null;
}

// Utility to parse Google Drive video/file URLs into embed links
function getGoogleDriveEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const cleaned = cleanVideoUrl(rawUrl);
  // Matches /file/d/{fileId} or id={fileId}
  const match = cleaned.match(/(?:\/file\/d\/|id=)([a-zA-Z0-9_-]{15,})/);
  if (match && match[1]) {
    return `https://drive.google.com/file/d/${match[1]}/preview`;
  }
  if (cleaned.includes("drive.google.com") && cleaned.includes("/preview")) {
    return cleaned;
  }
  return null;
}

// Utility to parse OneDrive / SharePoint video URLs into embed links
function getOneDriveEmbedUrl(rawUrl: string): string | null {
  if (!rawUrl) return null;
  const cleaned = cleanVideoUrl(rawUrl);

  // Teams links cannot be framed directly
  if (cleaned.includes("teams.microsoft.com")) {
    return null;
  }

  // 1drv.ms links are standard share redirects and CANNOT be embedded in iframes
  if (cleaned.includes("1drv.ms")) {
    return null;
  }

  if (cleaned.includes("sharepoint.com") || cleaned.includes("onedrive.live.com")) {
    // If it's already an embed link
    if (cleaned.includes("embed") || cleaned.includes("action=embedview") || cleaned.includes("_layouts/15/embed.aspx")) {
      return cleaned;
    }
    // Replace download/view parameters with embed if present
    if (cleaned.includes("onedrive.live.com") && (cleaned.includes("resid=") || cleaned.includes("id="))) {
      return cleaned.replace(/(?:view\.aspx|redir\.aspx)/, "embed.aspx");
    }
    return null;
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
  onVideoEnded,
  onProgressChange,
  autoPlay = false,
  isPaused = false,
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
  // Completion guards: fire the completion workflow once per genuine finish.
  const completionFiredRef = useRef(false);
  // Seconds of naturally-played (non-seeked) content, for anti-skip validation of embeds.
  const watchedSecondsRef = useRef(0);
  const lastEmbedTimeRef = useRef<number | null>(null);
  const embedDurationRef = useRef(0);
  const onVideoCompletedRef = useRef(onVideoCompleted);
  const onVideoEndedRef = useRef(onVideoEnded);
  const onProgressChangeRef = useRef(onProgressChange);
  onVideoCompletedRef.current = onVideoCompleted;
  onVideoEndedRef.current = onVideoEnded;
  onProgressChangeRef.current = onProgressChange;

  const cleanedUrl = cleanVideoUrl(videoUrl);
  const isTeams = cleanedUrl.includes("teams.microsoft.com");
  const onedriveEmbedUrlCandidate = getOneDriveEmbedUrl(cleanedUrl);
  const isOneDriveShareLink =
    !isTeams &&
    !onedriveEmbedUrlCandidate &&
    (videoType === "onedrive" ||
      cleanedUrl.includes("1drv.ms") ||
      cleanedUrl.includes("onedrive.live.com") ||
      cleanedUrl.includes("sharepoint.com"));

  const [bunnyReloadKey, setBunnyReloadKey] = useState(0);

  const [bunnyStatus, setBunnyStatus] = useState<{
    isChecking: boolean;
    isReady: boolean;
    isProcessing: boolean;
    isError: boolean;
    statusText: string;
    countdown: number;
  }>({
    isChecking: false,
    isReady: true,
    isProcessing: false,
    isError: false,
    statusText: "",
    countdown: 7,
  });

  // Check external embeds (YouTube, Vimeo, Bunny Stream, Google Drive, OneDrive)
  const isYouTube = (videoType === "url" || videoType === "upload") && (cleanedUrl.includes("youtube.com") || cleanedUrl.includes("youtu.be"));
  const isVimeo = (videoType === "url" || videoType === "upload") && cleanedUrl.includes("vimeo.com");
  const isBunnyIframe =
    cleanedUrl.includes("iframe.mediadelivery.net") ||
    cleanedUrl.includes("player.mediadelivery.net") ||
    cleanedUrl.includes("video.bunnycdn.com/play");
  const isGoogleDrive = videoType === "gdrive" || cleanedUrl.includes("drive.google.com");
  const isOneDrive = !isTeams && !isOneDriveShareLink && Boolean(onedriveEmbedUrlCandidate);

  // Build clean Bunny embed URL with responsive & preload params, avoiding forced unmuted autoplay lock
  const getCleanBunnySrc = (raw: string, reloadKey: number) => {
    if (!raw) return "";
    try {
      const urlObj = new URL(raw);
      // Modern browsers block autoplay when unmuted, which freezes the player splash screen
      if (urlObj.searchParams.has("autoplay") && !autoPlay) {
        urlObj.searchParams.set("autoplay", "false");
      }
      if (reloadKey > 0) {
        urlObj.searchParams.set("_r", String(reloadKey));
      }
      return urlObj.toString();
    } catch {
      return raw;
    }
  };

  const youTubeEmbedSrc = isYouTube ? getYouTubeEmbedUrl(cleanedUrl) : null;
  const vimeoEmbedSrc = isVimeo ? getVimeoEmbedUrl(cleanedUrl) : null;
  const bunnyEmbedSrc = isBunnyIframe ? getCleanBunnySrc(cleanedUrl, bunnyReloadKey) : null;
  const gdriveEmbedSrc = isGoogleDrive ? (getGoogleDriveEmbedUrl(cleanedUrl) || cleanedUrl) : null;
  const onedriveEmbedSrc = isOneDrive ? onedriveEmbedUrlCandidate : null;

  const isExternalEmbed = Boolean(youTubeEmbedSrc || vimeoEmbedSrc || bunnyEmbedSrc || gdriveEmbedSrc || onedriveEmbedSrc);

  const checkBunnyReadiness = async (srcUrl: string) => {
    if (!srcUrl) return;
    setBunnyStatus((prev) => ({ ...prev, isChecking: true }));
    try {
      const res = await checkBunnyEmbedStatus(srcUrl);
      setBunnyStatus({
        isChecking: false,
        isReady: res.isReady,
        isProcessing: res.isProcessing,
        isError: res.isError,
        statusText: res.statusText,
        countdown: 7,
      });
    } catch {
      setBunnyStatus({
        isChecking: false,
        isReady: true,
        isProcessing: false,
        isError: false,
        statusText: "",
        countdown: 7,
      });
    }
  };

  // Check Bunny video status on mount and when source or reload key changes
  useEffect(() => {
    if (isBunnyIframe && bunnyEmbedSrc) {
      checkBunnyReadiness(bunnyEmbedSrc);
    } else {
      setBunnyStatus({
        isChecking: false,
        isReady: true,
        isProcessing: false,
        isError: false,
        statusText: "",
        countdown: 7,
      });
    }
  }, [bunnyEmbedSrc, bunnyReloadKey, isBunnyIframe]);

  // If Bunny video is processing or errored, auto-poll every 7 seconds
  useEffect(() => {
    if (!isBunnyIframe || !bunnyEmbedSrc || bunnyStatus.isReady) return;

    const interval = setInterval(() => {
      setBunnyStatus((prev) => {
        if (prev.countdown <= 1) {
          checkBunnyReadiness(bunnyEmbedSrc);
          return { ...prev, countdown: 7 };
        }
        return { ...prev, countdown: prev.countdown - 1 };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isBunnyIframe, bunnyEmbedSrc, bunnyStatus.isReady]);

  // Pause playback immediately if isPaused is true (e.g., student opens quiz/assessment)
  useEffect(() => {
    if (isPaused) {
      if (videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
      setIsPlaying(false);

      if (containerRef.current) {
        const iframes = containerRef.current.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
          try {
            iframe.contentWindow?.postMessage(
              JSON.stringify({ event: "command", func: "pauseVideo", args: "" }),
              "*"
            );
            iframe.contentWindow?.postMessage(
              JSON.stringify({ method: "pause" }),
              "*"
            );
          } catch {}
        });
      }
    }
  }, [isPaused]);

  // New lesson / new source: clear completion state exactly once per source.
  useEffect(() => {
    completionFiredRef.current = false;
    watchedSecondsRef.current = 0;
    lastEmbedTimeRef.current = null;
    embedDurationRef.current = 0;
    setProgressPercent(0);
    setCurrentTime(0);
    setIsCompleted(false);
  }, [videoUrl]);

  // Trigger autoPlay for native <video> when the source or autoPlay changes
  useEffect(() => {
    if (!isPaused) {
      setIsPlaying(autoPlay);
      if (autoPlay && !isExternalEmbed && videoRef.current) {
        videoRef.current.play().catch((err) => {
          console.warn("Autoplay was prevented by browser policy:", err);
        });
      }
    }
  }, [videoUrl, title, autoPlay, isPaused, isExternalEmbed]);

  // Single entry point for a genuine completion; idempotent per source.
  const fireCompletion = () => {
    if (completionFiredRef.current) return;
    completionFiredRef.current = true;
    setIsCompleted(true);
    setProgressPercent(100);
    onProgressChangeRef.current?.(100);
    onVideoCompletedRef.current?.();
    onVideoEndedRef.current?.();
  };

  // An embed "ended" counts only when the real duration is known and, with anti-skip,
  // the student actually watched (not seeked past) most of it.
  const handleEmbedEnded = () => {
    const dur = embedDurationRef.current;
    if (!(dur > 0)) return;
    if (antiSkip && watchedSecondsRef.current < dur * 0.9) return;
    fireCompletion();
  };

  // Embed time tracking: seconds/duration from the player; jumps (seeks) are not counted as watched.
  const handleEmbedTime = (seconds: number, dur: number) => {
    if (!Number.isFinite(seconds) || !Number.isFinite(dur) || dur <= 0) return;
    embedDurationRef.current = dur;
    const last = lastEmbedTimeRef.current;
    if (last !== null) {
      const delta = seconds - last;
      if (delta > 0 && delta <= 2) watchedSecondsRef.current += delta;
    }
    lastEmbedTimeRef.current = seconds;
    const pct = Math.min(99, Math.floor((seconds / dur) * 100));
    setCurrentTime(seconds);
    setDuration(dur);
    setProgressPercent(pct);
    onProgressChangeRef.current?.(pct);
  };

  // Subscribe to events of the embedded players once their iframe has loaded.
  const subscribeToEmbed = (e: React.SyntheticEvent<HTMLIFrameElement>, kind: "bunny" | "youtube" | "vimeo") => {
    const win = e.currentTarget.contentWindow;
    if (!win) return;
    if (kind === "bunny") {
      // Bunny Stream uses the player.js protocol
      ["ready", "play", "pause", "ended", "timeupdate"].forEach((ev) =>
        win.postMessage(
          JSON.stringify({ context: "player.js", version: "0.0.11", method: "addEventListener", value: ev }),
          "*"
        )
      );
    } else if (kind === "youtube") {
      win.postMessage(JSON.stringify({ event: "listening", id: 1, channel: "widget" }), "*");
    } else {
      win.postMessage(JSON.stringify({ method: "addEventListener", value: "finish" }), "*");
    }
  };

  // Listen for postMessages from the embedded player iframe (and only from it)
  useEffect(() => {
    const handleWindowMessage = (event: MessageEvent) => {
      const frames = containerRef.current?.querySelectorAll("iframe");
      if (!frames || !Array.from(frames).some((f) => f.contentWindow === event.source)) return;
      try {
        const data = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
        if (!data) return;
        // Bunny Stream (player.js)
        if (data.context === "player.js") {
          if (data.event === "timeupdate") {
            handleEmbedTime(Number(data.value?.seconds), Number(data.value?.duration));
          } else if (data.event === "ended") {
            handleEmbedEnded();
          }
          return;
        }
        // YouTube API infoDelivery: playerState 0 (ENDED); currentTime/duration for tracking
        if (data.event === "infoDelivery" && data.info) {
          if (typeof data.info.currentTime === "number" && typeof data.info.duration === "number") {
            handleEmbedTime(data.info.currentTime, data.info.duration);
          }
          if (data.info.playerState === 0) handleEmbedEnded();
        }
        // Vimeo finish event
        if (data.event === "finish") handleEmbedEnded();
      } catch {}
    };

    window.addEventListener("message", handleWindowMessage);
    return () => window.removeEventListener("message", handleWindowMessage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [antiSkip, videoUrl]);

  // HTML5 native video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const current = videoRef.current.currentTime;
    const dur = videoRef.current.duration;
    setCurrentTime(current);
    if (!Number.isFinite(dur) || dur <= 0) return;
    setDuration(dur);
    const pct = Math.min(99, Math.floor((current / dur) * 100));
    setProgressPercent(pct);
    onProgressChange?.(pct);
  };

  const togglePlay = () => {
    if (isExternalEmbed) return;

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
    completionFiredRef.current = false;
    if (videoRef.current) {
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

  // When a Microsoft Teams link is detected, show a clear explanatory fallback UI
  // rather than a broken browser "teams.microsoft.com refused to connect" frame.
  if (isTeams) {
    return (
      <div
        ref={containerRef}
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-indigo-900/50 bg-gradient-to-br from-slate-950 via-[#111428] to-indigo-950/60 p-6 flex flex-col items-center justify-center text-center shadow-2xl ${className}`}
      >
        <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-[#464EB8]/20 border border-[#464EB8]/40 text-[#7B83EB] shadow-lg mb-2.5">
          <Tv className="h-6 w-6 sm:h-7 sm:w-7 text-[#7B83EB]" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-[#464EB8]/30 px-3 py-0.5 text-[11px] sm:text-xs font-semibold text-[#C5C9FF] border border-[#464EB8]/50 mb-2">
          Microsoft Teams Link Detected
        </span>

        <h4 className="text-sm sm:text-base font-bold text-white max-w-md">
          Teams Blocks Direct In-App Video Playback
        </h4>

        <p className="mt-1.5 max-w-lg text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          Microsoft strictly blocks <code className="text-[#A2A9FF] font-mono bg-black/40 px-1 py-0.5 rounded">teams.microsoft.com</code> links from playing inside embedded web frames (causing the browser <span className="text-rose-400 font-semibold">&ldquo;refused to connect&rdquo;</span> error).
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <a
            href={cleanedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#464EB8] px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-[#5B63D3] transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open in Microsoft Teams</span>
          </a>
        </div>

        <div className="mt-3.5 max-w-lg rounded-xl border border-blue-500/30 bg-blue-950/40 p-2.5 text-left text-[11px] text-slate-300">
          <p className="font-semibold text-blue-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Recommended Solution:
          </p>
          <p className="mt-1 text-slate-300">
            Download the <code className="text-blue-200">.mp4</code> file from Teams and choose <strong>&ldquo;Upload Video File&rdquo;</strong> in the Course Builder. It uploads directly to <strong>Bunny Stream</strong> so all students can watch with full anti-skip controls and zero login requirements.
          </p>
        </div>
      </div>
    );
  }

  // When a standard OneDrive / SharePoint share link (like 1drv.ms) is detected,
  // show a clear explanatory fallback UI rather than a broken browser "refused to connect" iframe.
  if (isOneDriveShareLink) {
    return (
      <div
        ref={containerRef}
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-sky-900/50 bg-gradient-to-br from-slate-950 via-[#0c192c] to-sky-950/60 p-6 flex flex-col items-center justify-center text-center shadow-2xl ${className}`}
      >
        <div className="mx-auto flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-sky-500/20 border border-sky-500/40 text-sky-400 shadow-lg mb-2.5">
          <Cloud className="h-6 w-6 sm:h-7 sm:w-7 text-sky-400" />
        </div>

        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/30 px-3 py-0.5 text-[11px] sm:text-xs font-semibold text-sky-200 border border-sky-500/50 mb-2">
          OneDrive Share Link Detected
        </span>

        <h4 className="text-sm sm:text-base font-bold text-white max-w-md">
          OneDrive Share Links Cannot Be Played in Web Players
        </h4>

        <p className="mt-1.5 max-w-lg text-[11px] sm:text-xs text-slate-300 leading-relaxed">
          Microsoft blocks standard <code className="text-sky-300 font-mono bg-black/40 px-1 py-0.5 rounded">1drv.ms</code> links from playing inside embedded web frames (<span className="text-rose-400 font-semibold">X-Frame-Options: SAMEORIGIN</span>), causing the browser &ldquo;refused to connect&rdquo; error.
        </p>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <a
            href={cleanedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl bg-sky-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md hover:bg-sky-500 transition-all"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Open Video in OneDrive</span>
          </a>
        </div>

        <div className="mt-3.5 max-w-lg rounded-xl border border-blue-500/30 bg-blue-950/40 p-3 text-left text-[11px] text-slate-300">
          <p className="font-semibold text-blue-300 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Easiest Solution for This Video:
          </p>
          <p className="mt-1 text-slate-300">
            You already have this MP4 file on your computer/OneDrive! Switch from <em>&ldquo;OneDrive Link&rdquo;</em> to <strong>&ldquo;Upload Video File&rdquo;</strong>, click <strong>Select MP4 Video</strong>, and select this file. It uploads directly to <strong>Bunny Stream</strong> for smooth in-app playback with anti-skip verification.
          </p>
        </div>
      </div>
    );
  }

  // When it's an external embed (YouTube / Vimeo / Bunny Stream), render clean embedded iframe
  if (isExternalEmbed) {
    return (
      <div
        ref={containerRef}
        className={`relative aspect-video w-full overflow-hidden rounded-2xl border border-slate-800 bg-black shadow-2xl ${className}`}
      >
        {youTubeEmbedSrc ? (
          <iframe
            src={youTubeEmbedSrc}
            onLoad={(e) => subscribeToEmbed(e, "youtube")}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : vimeoEmbedSrc ? (
          <iframe
            src={vimeoEmbedSrc}
            onLoad={(e) => subscribeToEmbed(e, "vimeo")}
            title={title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : bunnyEmbedSrc ? (
          <div className="relative h-full w-full group/bunny bg-slate-950">
            {/* If Bunny video is still processing / transcoding or initializing, display premium LMS loading state */}
            {!bunnyStatus.isReady && (bunnyStatus.isProcessing || bunnyStatus.isError) ? (
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 via-[#031525] to-[#04192c]">
                {/* Animated Pulsing Ring & Film Icon */}
                <div className="relative mb-4 flex items-center justify-center">
                  <div className="absolute h-20 w-20 rounded-full bg-blue-500/15 animate-ping" />
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/40 bg-blue-950/80 shadow-[0_0_30px_rgba(37,99,235,0.35)] backdrop-blur-md">
                    <Film className="h-8 w-8 text-blue-400 animate-pulse" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 px-3 py-1 text-[11px] font-bold text-blue-300">
                  <Loader2 className="h-3 w-3 animate-spin text-blue-400" />
                  <span>
                    {bunnyStatus.isError
                      ? "Stream Cluster Initializing (500)"
                      : "Bunny CDN Video Transcoding in Progress"}
                  </span>
                </div>

                <h3 className="mt-3 text-base sm:text-lg font-black text-white">
                  {title || "Lecture Video is Encoding"}
                </h3>

                <p className="mt-1.5 max-w-md text-xs sm:text-[13px] text-slate-300 leading-relaxed">
                  {bunnyStatus.isError
                    ? "Bunny CDN stream cluster is allocating this video stream. The player is automatically reconnecting."
                    : "This video was recently uploaded and Bunny CDN is encoding multi-resolution HD streams (1080p, 720p, 480p). Playback will begin automatically as soon as encoding finishes."}
                </p>

                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      checkBunnyReadiness(bunnyEmbedSrc);
                      setBunnyReloadKey((k) => k + 1);
                    }}
                    disabled={bunnyStatus.isChecking}
                    className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all cursor-pointer disabled:opacity-60"
                  >
                    <RotateCcw className={`h-3.5 w-3.5 ${bunnyStatus.isChecking ? "animate-spin" : ""}`} />
                    <span>{bunnyStatus.isChecking ? "Checking Status..." : "Check Status Now"}</span>
                  </button>

                  <div className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-2 text-[11px] font-medium text-slate-400">
                    <span>Auto-checking in</span>
                    <span className="font-mono font-bold text-blue-400">{bunnyStatus.countdown}s</span>
                  </div>
                </div>

                <p className="mt-4 text-[10px] text-slate-500">
                  Newly uploaded full-length lectures typically take 1–3 minutes to transcode. You do not need to re-upload.
                </p>
              </div>
            ) : (
              <iframe
                key={`bunny-frame-${bunnyReloadKey}`}
                src={bunnyEmbedSrc}
                onLoad={(e) => subscribeToEmbed(e, "bunny")}
                title={title}
                allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full w-full border-0"
              />
            )}

            {/* Bunny Stream Control Strip with Fast Reload */}
            <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-2 rounded-xl bg-slate-950/85 backdrop-blur-md px-3 py-1 border border-slate-700/60 shadow-lg text-[11px] text-white">
              <span className="flex items-center gap-1 text-[10px] font-extrabold text-blue-400 tracking-wide uppercase">
                <Tv className="h-3 w-3" /> Bunny Stream HD
              </span>
              <span className="text-slate-600">|</span>
              <button
                type="button"
                onClick={() => {
                  checkBunnyReadiness(bunnyEmbedSrc);
                  setBunnyReloadKey((k) => k + 1);
                }}
                className="flex items-center gap-1 text-[10.5px] font-bold text-slate-200 hover:text-white transition-colors cursor-pointer"
                title="If video was recently uploaded or showing 'Processing video', click to refresh"
              >
                <RotateCcw className="h-2.5 w-2.5 text-blue-400" />
                <span>Reload Stream</span>
              </button>
            </div>
          </div>
        ) : gdriveEmbedSrc ? (
          <iframe
            src={gdriveEmbedSrc}
            title={title}
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
            className="h-full w-full border-0"
          />
        ) : onedriveEmbedSrc ? (
          <iframe
            src={onedriveEmbedSrc}
            title={title}
            allow="autoplay; encrypted-media; fullscreen"
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
            <span>Bunny Stream Player</span>
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
            cleanedUrl ||
            "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
          }
          autoPlay={autoPlay}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => {
            setIsPlaying(false);
            fireCompletion();
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
