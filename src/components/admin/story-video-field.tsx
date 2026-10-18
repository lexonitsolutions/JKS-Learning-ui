"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Loader2, RefreshCw, UploadCloud, X } from "lucide-react";
import { adminCreateUploadTicket, adminVideoStatus } from "@/lib/data/success-stories-api";
import { tusUpload, UploadAbortedError } from "@/lib/api/tus-upload";

export type VideoMode = "none" | "upload" | "link";

export interface VideoFieldValue {
  mode: VideoMode;
  bunnyVideoId: string;
  bunnyLibraryId: string;
  videoUrl: string;
}

const MAX_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB
const EXTENSIONS = /\.(mp4|m4v|mov|webm|mkv)$/i;
const input =
  "w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900";

type Phase = "idle" | "uploading" | "processing" | "ready" | "error";

const mb = (n: number) => `${(n / 1024 / 1024).toFixed(n > 100 * 1024 * 1024 ? 0 : 1)} MB`;

export function StoryVideoField({
  value,
  title,
  onChange,
  onDuration,
  onBusyChange,
}: {
  value: VideoFieldValue;
  title: string;
  onChange: (patch: Partial<VideoFieldValue>) => void;
  onDuration: (seconds: number) => void;
  onBusyChange: (busy: boolean) => void;
}) {
  const [phase, setPhase] = useState<Phase>(value.bunnyVideoId ? "processing" : "idle");
  const [progress, setProgress] = useState(0);
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [retryFile, setRetryFile] = useState<File | null>(null);

  const busy = phase === "uploading";
  useEffect(() => onBusyChange(busy), [busy, onBusyChange]);
  useEffect(() => () => abortRef.current?.abort(), []);

  // Warn before leaving mid-upload.
  useEffect(() => {
    if (!busy) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  // Poll the video host until it finishes encoding (also covers an existing video on edit).
  const videoId = value.bunnyVideoId;
  useEffect(() => {
    if (phase !== "processing" || !videoId) return;
    let cancelled = false;
    let tries = 0;
    const tick = async () => {
      try {
        const s = await adminVideoStatus(videoId);
        if (cancelled) return;
        if (s.ready) {
          if (s.durationSeconds > 0) onDuration(s.durationSeconds);
          setPhase("ready");
          return;
        }
        if (s.status === "error" || s.status === "failed") {
          setError("The video host could not process this file. Try uploading a different export.");
          setPhase("error");
          return;
        }
      } catch {
        /* transient: keep polling */
      }
      if (!cancelled && ++tries < 100) timer = setTimeout(tick, 6000);
    };
    let timer = setTimeout(tick, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [phase, videoId, onDuration]);

  const start = useCallback(
    async (file: File) => {
      if (!EXTENSIONS.test(file.name) || (file.type && !file.type.startsWith("video/"))) {
        setError("Choose a video file (MP4, MOV, M4V, WebM or MKV).");
        setPhase("error");
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(`That file is ${mb(file.size)}. The limit is 2 GB.`);
        setPhase("error");
        return;
      }
      setRetryFile(file);
      setFileInfo({ name: file.name, size: file.size });
      setError(null);
      setProgress(0);
      setPhase("uploading");
      const ctrl = new AbortController();
      abortRef.current = ctrl;
      try {
        const ticket = await adminCreateUploadTicket(title.trim().length >= 2 ? title.trim() : file.name);
        await tusUpload({ file, ticket, signal: ctrl.signal, onProgress: setProgress });
        onChange({ bunnyVideoId: ticket.videoId, bunnyLibraryId: ticket.libraryId, videoUrl: "" });
        setPhase("processing");
      } catch (e) {
        if (e instanceof UploadAbortedError) {
          setPhase("idle");
          return;
        }
        setError(e instanceof Error ? e.message : "Upload failed.");
        setPhase("error");
      }
    },
    [onChange, title],
  );

  const pick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (f) void start(f);
  };

  const modes: [VideoMode, string][] = [
    ["none", "No video"],
    ["upload", "Upload video"],
    ["link", "Paste a link"],
  ];

  return (
    <div className="space-y-3">
      <div role="radiogroup" aria-label="Video source" className="flex flex-wrap gap-2">
        {modes.map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={value.mode === m}
            disabled={busy}
            onClick={() => onChange({ mode: m })}
            className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors disabled:opacity-50 ${
              value.mode === m
                ? "bg-[#1E5EFF] text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-300 dark:ring-slate-700"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {value.mode === "link" && (
        <div>
          <label htmlFor="ss-video-url" className="mb-1 block text-xs font-semibold text-slate-700 dark:text-slate-200">
            Video link
          </label>
          <input
            id="ss-video-url"
            type="url"
            value={value.videoUrl}
            onChange={(e) => onChange({ videoUrl: e.target.value, bunnyVideoId: "" })}
            placeholder="https://youtu.be/… or https://…/video.mp4"
            className={input}
          />
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            YouTube, Vimeo, or a direct .mp4 / .webm link over https. Private links are not supported.
          </p>
        </div>
      )}

      {value.mode === "upload" && (
        <div className="rounded-2xl border border-dashed border-slate-300 p-4 dark:border-slate-700">
          <input ref={fileRef} type="file" accept="video/*,.mkv" onChange={pick} className="sr-only" id="ss-video-file" />

          {phase === "idle" && (
            <div className="flex flex-col items-start gap-2">
              <label
                htmlFor="ss-video-file"
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC] focus-within:ring-2 focus-within:ring-[#1E5EFF]/40"
              >
                <UploadCloud className="h-4 w-4" aria-hidden="true" /> Choose video file
              </label>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                MP4, MOV, WebM or MKV up to 2 GB. Uploads go straight to the video host and can resume if your connection drops.
              </p>
            </div>
          )}

          {phase === "uploading" && (
            <div className="space-y-2" aria-live="polite">
              <div className="flex items-center justify-between gap-3 text-xs">
                <span className="truncate font-semibold text-slate-800 dark:text-slate-100">
                  Uploading {fileInfo?.name} {fileInfo ? `(${mb(fileInfo.size)})` : ""}
                </span>
                <span className="tabular-nums text-slate-600 dark:text-slate-300">{progress}%</span>
              </div>
              <div
                role="progressbar"
                aria-label="Upload progress"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
              >
                <div className="h-full rounded-full bg-[#1E5EFF] transition-[width]" style={{ width: `${progress}%` }} />
              </div>
              <button
                type="button"
                onClick={() => abortRef.current?.abort()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" /> Cancel upload
              </button>
            </div>
          )}

          {phase === "processing" && (
            <p role="status" className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-200">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Uploaded. The video host is preparing it for playback. You can save the story now.
            </p>
          )}

          {phase === "ready" && (
            <p role="status" className="flex items-center gap-2 text-sm font-medium text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Video is ready to play.
            </p>
          )}

          {phase === "error" && (
            <div role="alert" className="space-y-2 text-sm text-rose-700 dark:text-rose-300">
              <p className="flex items-start gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" /> {error}
              </p>
              <div className="flex gap-3">
                {retryFile && (
                  <button
                    type="button"
                    onClick={() => void start(retryFile)}
                    className="inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  >
                    <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Retry
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setPhase(value.bunnyVideoId ? "ready" : "idle");
                    setError(null);
                  }}
                  className="text-xs font-semibold hover:underline"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {(phase === "processing" || phase === "ready") && (
            <label
              htmlFor="ss-video-file"
              className="mt-3 inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-[#1A52E0] hover:underline dark:text-blue-300"
            >
              <RefreshCw className="h-3.5 w-3.5" aria-hidden="true" /> Replace video
            </label>
          )}
        </div>
      )}
    </div>
  );
}
