"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { JobDetailView } from "@/components/jobs/job-detail-view";
import { EmptyState } from "@/components/jobs/job-ui";
import { getJob, type Job } from "@/lib/data/jobs-api";

export default function StudentJobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<{ status: number | null; message: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    getJob(id)
      .then((j) => !cancelled && setJob(j))
      .catch((e) => !cancelled && setError({ status: e?.status ?? null, message: e instanceof Error ? e.message : "Could not load this job." }));
    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <>
      <DashboardTopbar title="Job details" subtitle="" />
      <div className="flex-1 space-y-4 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        <Link href="/dashboard/jobs" className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">
          <ArrowLeft className="h-4 w-4" /> All jobs
        </Link>

        {error ? (
          <EmptyState
            title={error.status === 403 ? "Jobs Portal access needed" : error.status === 404 ? "This job isn't available" : "Couldn't load this job"}
            body={
              error.status === 403
                ? "Your access hasn't been approved, or it was removed."
                : error.status === 404
                  ? "It may have been removed or is not published."
                  : error.message
            }
            action={<Link href="/dashboard/jobs" className="rounded-lg bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC]">Back to Jobs</Link>}
          />
        ) : !job ? (
          <div className="grid animate-pulse gap-5 lg:grid-cols-[1fr_340px]" aria-busy>
            <div className="space-y-5">
              <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
              <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
            </div>
            <div className="h-72 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          </div>
        ) : (
          <JobDetailView job={job} />
        )}
      </div>
    </>
  );
}
