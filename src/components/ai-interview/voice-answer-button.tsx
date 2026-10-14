"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Mic, Square } from "lucide-react";
import { transcribeInterviewAudio } from "@/lib/data/ai-api";

type RecState = "idle" | "recording" | "transcribing";

const MAX_SECONDS = 120;
const MIN_BYTES = 1500; // anything smaller is effectively silence / an aborted recording

function pickMimeType(): string | undefined {
  if (typeof MediaRecorder === "undefined") return undefined;
  return ["audio/webm;codecs=opus", "audio/webm", "audio/ogg;codecs=opus", "audio/mp4"].find((t) =>
    MediaRecorder.isTypeSupported(t),
  );
}

interface Props {
  /** Receives the recognised text; the caller puts it in the editable answer field. */
  onTranscript: (text: string) => void;
  disabled?: boolean;
}

/**
 * Records the microphone and sends the audio to the server for real
 * speech-to-text. The text is only inserted into the answer box - the student
 * reviews/edits it and submits manually. If transcription is not configured the
 * server says so and we show that message, never a fake result.
 */
export function VoiceAnswerButton({ onTranscript, disabled }: Props) {
  const [state, setState] = useState<RecState>("idle");
  const [seconds, setSeconds] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const recorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const busyRef = useRef(false); // blocks double-clicks / duplicate uploads

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
  }, []);

  useEffect(
    () => () => {
      const rec = recorderRef.current;
      if (rec && rec.state !== "inactive") {
        rec.onstop = null;
        rec.stop();
      }
      cleanup();
    },
    [cleanup],
  );

  const supported = typeof window !== "undefined" && !!navigator.mediaDevices?.getUserMedia && typeof MediaRecorder !== "undefined";

  async function start() {
    if (busyRef.current || disabled) return;
    setMessage(null);

    if (!supported) {
      setMessage("Voice recording is not supported in this browser. Please type your answer.");
      return;
    }

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const name = err instanceof DOMException ? err.name : "";
      setMessage(
        name === "NotAllowedError" || name === "SecurityError"
          ? "Microphone access was blocked. Allow the microphone in your browser's site settings, or type your answer."
          : name === "NotFoundError"
            ? "No microphone was found on this device. Please type your answer."
            : "Could not start the microphone. Please type your answer.",
      );
      return;
    }

    streamRef.current = stream;
    chunksRef.current = [];
    const mimeType = pickMimeType();
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    recorderRef.current = recorder;

    recorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunksRef.current.push(e.data);
    };
    recorder.onerror = () => {
      cleanup();
      setState("idle");
      setMessage("Recording failed. Please try again or type your answer.");
    };
    recorder.onstop = () => void finish(recorder.mimeType || mimeType || "audio/webm");

    recorder.start();
    setSeconds(0);
    setState("recording");
    timerRef.current = setInterval(() => {
      setSeconds((s) => {
        if (s + 1 >= MAX_SECONDS) stop();
        return s + 1;
      });
    }, 1000);
  }

  function stop() {
    const rec = recorderRef.current;
    if (rec && rec.state === "recording") rec.stop();
  }

  async function finish(mime: string) {
    cleanup();
    const blob = new Blob(chunksRef.current, { type: mime });
    chunksRef.current = [];

    if (blob.size < MIN_BYTES) {
      setState("idle");
      setMessage("No speech was recorded. Check your microphone and try again, or type your answer.");
      return;
    }

    busyRef.current = true;
    setState("transcribing");
    try {
      const text = await transcribeInterviewAudio(blob);
      if (!text.trim()) {
        setMessage("We could not hear any words in that recording. Please try again or type your answer.");
      } else {
        onTranscript(text.trim());
        setMessage("Transcribed. Review and edit the text below before submitting.");
      }
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Transcription failed. Please type your answer.");
    } finally {
      busyRef.current = false;
      setState("idle");
    }
  }

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-3">
        {state === "recording" ? (
          <button
            type="button"
            onClick={stop}
            className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-rose-700"
          >
            <Square className="h-3.5 w-3.5 fill-current" /> Stop recording
          </button>
        ) : (
          <button
            type="button"
            onClick={start}
            disabled={disabled || state === "transcribing"}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-surface-elevated dark:text-slate-200 dark:hover:bg-surface-hover"
          >
            {state === "transcribing" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Mic className="h-3.5 w-3.5" />}
            {state === "transcribing" ? "Transcribing…" : "Answer by voice"}
          </button>
        )}

        {state === "recording" && (
          <span role="status" className="inline-flex items-center gap-2 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-rose-600" />
            Recording {mm}:{ss}
          </span>
        )}
      </div>

      {message && (
        <p role="status" className="text-[11px] text-slate-500 dark:text-slate-400">
          {message}
        </p>
      )}
    </div>
  );
}
