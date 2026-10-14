"use client";

import { BookOpen, ChevronDown } from "lucide-react";
import type { CourseSyllabus } from "@/lib/data/courses";

interface Props {
  courseTitle: string;
  syllabus: CourseSyllabus | null | undefined;
}

/**
 * The full syllabus an administrator assigned to the course: every module with
 * its description and topics. Shows an honest empty state - never placeholder
 * content - when no syllabus has been assigned.
 */
export function SyllabusPanel({ courseTitle, syllabus }: Props) {
  if (!syllabus || syllabus.modules.length === 0) {
    return (
      <section
        aria-label={`${courseTitle} syllabus`}
        className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-5 text-sm text-slate-600 dark:border-slate-700 dark:bg-surface-elevated/60 dark:text-slate-300"
      >
        <div className="flex items-center gap-2 font-semibold text-slate-800 dark:text-white">
          <BookOpen className="h-4 w-4" /> Syllabus
        </div>
        <p className="mt-1 text-xs">
          The detailed syllabus for this course has not been published yet. Contact our admissions team for the
          full curriculum.
        </p>
      </section>
    );
  }

  const topicCount = syllabus.modules.reduce((n, m) => n + m.topics.length, 0);

  return (
    <section
      aria-label={`${courseTitle} syllabus`}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-surface-elevated"
    >
      <div className="border-b border-slate-100 p-4 dark:border-slate-800">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
          <BookOpen className="h-4 w-4 text-[#2563EB] dark:text-blue-400" /> {syllabus.title}
        </div>
        {syllabus.description && (
          <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{syllabus.description}</p>
        )}
        <p className="mt-1 text-[11px] font-medium text-slate-500 dark:text-slate-400">
          {syllabus.modules.length} {syllabus.modules.length === 1 ? "module" : "modules"} · {topicCount}{" "}
          {topicCount === 1 ? "topic" : "topics"}
        </p>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {syllabus.modules.map((m, i) => (
          <details key={`${i}-${m.title}`} className="group" open={i === 0}>
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-surface-hover">
              <span className="flex min-w-0 items-center gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[11px] font-bold text-[#2563EB] dark:bg-blue-950/60 dark:text-blue-300">
                  {i + 1}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{m.title}</span>
              </span>
              <ChevronDown className="h-4 w-4 shrink-0 text-slate-400 transition-transform group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 pl-[3.25rem]">
              {m.description && (
                <p className="mb-2 text-xs leading-relaxed text-slate-600 dark:text-slate-300">{m.description}</p>
              )}
              {m.topics.length > 0 ? (
                <ul className="list-disc space-y-1 pl-4 text-xs text-slate-700 marker:text-slate-400 dark:text-slate-300">
                  {m.topics.map((t, ti) => (
                    <li key={`${ti}-${t}`}>{t}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-500">No topics listed for this module.</p>
              )}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
