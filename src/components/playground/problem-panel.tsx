"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock } from "lucide-react";
import type { CodeContext } from "@/lib/data/code-api";

interface Props {
  ctx: CodeContext;
  runtimeNote?: string;
}

export function ProblemPanel({ ctx, runtimeNote }: Props) {
  const q = ctx.question;
  const latest = ctx.latestSubmission;
  return (
    <div className="flex h-full flex-col bg-white text-[#1f1f1f]" aria-label="Problem">
      <div className="flex h-9 shrink-0 items-center border-b border-[#d4d4d4] bg-[#f3f3f3] px-3 text-[11px] font-semibold uppercase tracking-wider text-[#616161]">
        Problem
      </div>
      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3 text-[13px] leading-relaxed">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[#6a6a6a]">
            {ctx.task ? ctx.task.title : ctx.course?.title}
            {ctx.task?.courseTitle ? ` · ${ctx.task.courseTitle}` : ""}
          </p>
          <p className="mt-1 whitespace-pre-wrap text-[14px] font-semibold text-[#1f1f1f]">{q.prompt}</p>
        </div>

        {q.instructions && (
          <div className="rounded border border-[#cfe0f7] bg-[#f1f6fd] p-2.5 text-[12.5px] text-[#1c3f73]">
            <strong>What to complete:</strong> {q.instructions}
          </div>
        )}

        <p className="text-[12px] text-[#4a4a4a]">
          Complete the <code className="rounded bg-[#f0f0f0] px-1">TODO</code> sections in the starter code. The file
          marked with a lock is read-only; only your solution file is submitted.
        </p>

        {q.visibleTests.length > 0 && (
          <div>
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#6a6a6a]">Example tests</p>
            <ul className="space-y-1.5">
              {q.visibleTests.map((t, i) => (
                <li key={i} className="rounded border border-[#e0e0e0] bg-[#fafafa] p-2 font-mono text-[11.5px]">
                  <div>
                    <span className="text-[#6a6a6a]">input </span>
                    <span className="whitespace-pre-wrap break-words">{t.input || "(none)"}</span>
                  </div>
                  <div>
                    <span className="text-[#6a6a6a]">expected </span>
                    <span className="whitespace-pre-wrap break-words">{t.expectedOutput}</span>
                  </div>
                </li>
              ))}
            </ul>
            {q.hasHiddenTests && (
              <p className="mt-1 text-[11px] text-[#6a6a6a]">Additional hidden tests are used when you submit.</p>
            )}
          </div>
        )}

        {runtimeNote && <p className="rounded border border-[#f0d9a8] bg-[#fff8e6] p-2 text-[12px] text-[#6a4a00]">{runtimeNote}</p>}

        <div className="rounded border border-[#e0e0e0] p-2.5 text-[12px]">
          <p className="font-semibold text-[#2b2b2b]">Your submission</p>
          {latest ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-[#16825d]">
              <CheckCircle2 className="h-3.5 w-3.5" />
              Attempt {latest.attempt}:{" "}
              {latest.status === "GRADED" && latest.total ? `${latest.passed}/${latest.total} tests passed` : "awaiting manual review"}
            </p>
          ) : (
            <p className="mt-0.5 flex items-center gap-1.5 text-[#6a6a6a]">
              <Clock className="h-3.5 w-3.5" /> Not submitted yet
            </p>
          )}
          {!ctx.canSubmit && (
            <p className="mt-1 text-[#b86e00]">This assessment has been handed in, so it can no longer be changed.</p>
          )}
        </div>

        <Link
          href={ctx.returnUrl}
          className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2563EB] hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to {ctx.task ? "assessment" : "course"}
        </Link>
      </div>
    </div>
  );
}
