"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { GraduationCap, Layers, Loader2, Users } from "lucide-react";
import { getMyHeadOverview, type HeadOverview } from "@/lib/api/org-api";

const CARD = "rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-surface-secondary sm:p-5";

export default function HeadOverviewPage() {
  const [data, setData] = useState<HeadOverview | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getMyHeadOverview()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : "Could not load your overview."));
  }, []);

  const students = data ? data.batches.reduce((n, b) => n + b.studentCount, 0) : 0;

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 space-y-6 p-4 sm:p-6 lg:p-8">
      <header>
        <h1 className="text-xl font-black text-slate-900 dark:text-white">{data ? `Welcome, ${data.head.name}` : "Head overview"}</h1>
        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
          The instructors you supervise and the batches assigned to you. You can view them here; changes are made by an administrator.
        </p>
      </header>

      {error && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
          {error}
        </p>
      )}

      {!data && !error && (
        <p className="flex items-center gap-2 text-sm text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading…
        </p>
      )}

      {data && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Stat icon={<GraduationCap className="h-4 w-4" />} label="Instructors" value={data.instructors.length} />
            <Stat icon={<Layers className="h-4 w-4" />} label="Batches" value={data.batches.length} />
            <Stat icon={<Users className="h-4 w-4" />} label="Students in your batches" value={students} />
          </div>

          <section className={CARD} aria-labelledby="ins-h">
            <h2 id="ins-h" className="text-sm font-bold text-slate-900 dark:text-white">
              Instructors
            </h2>
            {data.instructors.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">No instructors are assigned to you yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {data.instructors.map((i) => (
                  <li key={i.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-900 dark:text-white">{i.name}</span>
                      <span className="block truncate text-slate-500">{i.email}</span>
                    </span>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${i.supervised ? "bg-blue-100 text-blue-800 dark:bg-blue-400/15 dark:text-blue-200" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                      {i.supervised ? "Supervised" : "Teaches one of your batches"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className={CARD} aria-labelledby="bat-h">
            <div className="flex items-center justify-between">
              <h2 id="bat-h" className="text-sm font-bold text-slate-900 dark:text-white">
                Your batches
              </h2>
              <Link href="/head/batches" className="text-xs font-semibold text-[#2563EB] hover:underline">
                Open batches
              </Link>
            </div>
            {data.batches.length === 0 ? (
              <p className="mt-2 text-xs text-slate-500">No batches are assigned to you yet.</p>
            ) : (
              <ul className="mt-3 divide-y divide-slate-100 dark:divide-slate-800">
                {data.batches.map((b) => (
                  <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5 text-xs">
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-slate-900 dark:text-white">{b.name}</span>
                      <span className="block truncate text-slate-500">{b.courseTitle ?? "No course linked"}</span>
                    </span>
                    <span className="text-slate-500">
                      {b.instructorCount} instructor(s) · {b.studentCount} student(s)
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className={CARD}>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
        <span>{label}</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-400">{icon}</span>
      </div>
      <div className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{value}</div>
    </div>
  );
}
