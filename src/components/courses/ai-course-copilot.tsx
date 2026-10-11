"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Bot, Loader2, Send, Sparkles } from "lucide-react";
import { askCourseCopilot } from "@/lib/data/ai-api";

interface Msg {
  role: "user" | "assistant";
  content: string;
  grounded?: boolean;
}

interface Props {
  courseId: string;
  courseTitle: string;
  lessonId?: string;
  lessonTitle?: string;
}

const SUGGESTIONS = [
  "Explain this lesson in simple words",
  "Give me a real-world example",
  "What are common mistakes here?",
];

export function AiCourseCopilot({ courseId, courseTitle, lessonId, lessonTitle }: Props) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const question = text.trim();
    if (!question || busy) return;
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }));
    setMessages((m) => [...m, { role: "user", content: question }]);
    setInput("");
    setBusy(true);
    setError(null);
    try {
      const res = await askCourseCopilot({
        question: lessonTitle ? `${question}\n\n(Current lesson: ${lessonTitle})` : question,
        courseId,
        lessonId,
        conversationHistory: history,
      });
      setMessages((m) => [...m, { role: "assistant", content: res.answer, grounded: res.foundInCourseMaterial }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "The AI tutor could not answer. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-4">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/40 dark:text-violet-300">
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">AI Tutor</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Ask a doubt about {lessonTitle ? `“${lessonTitle}”` : courseTitle}. Answers are AI-generated - verify anything
            important with your instructor.
          </p>
        </div>
      </div>

      <div
        data-lenis-prevent
        className="max-h-[420px] min-h-[160px] space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/60 p-4 dark:border-slate-800 dark:bg-surface-elevated"
      >
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:border-violet-300 hover:text-violet-700 dark:border-slate-700 dark:bg-surface-secondary dark:text-slate-300"
              >
                {s}
              </button>
            ))}
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                m.role === "user"
                  ? "bg-[#2563EB] text-white"
                  : "border border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-surface-secondary dark:text-slate-100"
              }`}
            >
              {m.role === "assistant" && (
                <span className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide text-violet-600 dark:text-violet-300">
                  <Bot className="h-3 w-3" />
                  {m.grounded ? "From course material" : "General explanation"}
                </span>
              )}
              {m.content}
            </div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" /> Thinking…
          </div>
        )}
        <div ref={endRef} />
      </div>

      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300"
        >
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="flex items-end gap-2"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send(input);
            }
          }}
          rows={2}
          maxLength={1500}
          placeholder="Ask your doubt… (Enter to send)"
          className="flex-1 resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-surface-elevated dark:text-white"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
