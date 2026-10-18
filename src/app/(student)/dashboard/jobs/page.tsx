"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { JobsAccessGate } from "@/components/jobs/jobs-access-gate";
import {
  EMPLOYMENT_LABEL,
  EXPERIENCE_LABEL,
  EmptyState,
  JobCard,
  JobCardSkeleton,
  WORK_MODE_LABEL,
} from "@/components/jobs/job-ui";
import {
  getMyJobsAccess,
  listJobs,
  requestJobsAccess,
  type JobFilters,
  type JobListResponse,
  type JobsAccessView,
} from "@/lib/data/jobs-api";

const errMsg = (e: unknown) => (e instanceof Error ? e.message : "Something went wrong. Please try again.");

const selectCls =
  "w-full rounded-xl border border-[#E5E7EB] bg-white px-3 py-2.5 text-sm text-[#222222] outline-none transition focus:border-[#1E5EFF] focus:ring-2 focus:ring-[#1E5EFF]/20 dark:border-slate-700 dark:bg-slate-900 dark:text-white";

export default function StudentJobsPage() {
  const [access, setAccess] = useState<JobsAccessView | null>(null);
  const [accessError, setAccessError] = useState<string | null>(null);

  const [filters, setFilters] = useState<JobFilters>({});
  const [search, setSearch] = useState("");
  const [data, setData] = useState<JobListResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const reqId = useRef(0);

  const loadAccess = useCallback(async () => {
    try {
      setAccess(await getMyJobsAccess());
      setAccessError(null);
    } catch (e) {
      setAccessError(errMsg(e));
    }
  }, []);

  useEffect(() => {
    void loadAccess();
  }, [loadAccess]);

  // Debounce the search box into the filters.
  useEffect(() => {
    const t = setTimeout(() => setFilters((f) => (f.q === (search || undefined) ? f : { ...f, q: search || undefined, page: 1 })), 350);
    return () => clearTimeout(t);
  }, [search]);

  const canAccess = access?.canAccess === true;

  useEffect(() => {
    if (!canAccess) return;
    const id = ++reqId.current;
    setLoading(true);
    listJobs(filters)
      .then((res) => {
        if (id !== reqId.current) return;
        setData(res);
        setError(null);
      })
      .catch((e) => {
        if (id !== reqId.current) return;
        // Access can be revoked while the page is open: fall back to the gate.
        if (e?.status === 403) void loadAccess();
        else setError(errMsg(e));
      })
      .finally(() => id === reqId.current && setLoading(false));
  }, [canAccess, filters, loadAccess]);

  const set = <K extends keyof JobFilters>(k: K, v: JobFilters[K]) =>
    setFilters((f) => ({ ...f, [k]: v || undefined, page: 1 }));

  const activeCount = [filters.category, filters.employmentType, filters.experienceLevel, filters.workMode, filters.location, filters.includeExpired].filter(Boolean).length;
  const hasAnyFilter = activeCount > 0 || !!filters.q;
  const clearAll = () => {
    setSearch("");
    setFilters({});
  };

  return (
    <>
      <DashboardTopbar title="Jobs & Internships" subtitle="Verified openings shared with the JKS Learning community." />
      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4">
        {accessError && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">
            {accessError}{" "}
            <button onClick={() => void loadAccess()} className="font-semibold underline">Retry</button>
          </div>
        )}

        {!access && !accessError && (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <JobCardSkeleton key={i} />)}
          </div>
        )}

        {access && !canAccess && (
          <div className="pt-4">
            <JobsAccessGate
              access={access}
              onRequest={async (message) => setAccess(await requestJobsAccess(message || undefined))}
            />
          </div>
        )}

        {canAccess && (
          <>
            <section className="relative overflow-hidden rounded-3xl bg-[#0B1F3A] px-6 py-7 text-white sm:px-8">
              <div aria-hidden className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[#1E5EFF]/30 blur-3xl" />
              <div className="relative flex flex-wrap items-end justify-between gap-4">
                <div className="max-w-xl">
                  <h2 className="text-2xl font-bold tracking-tight">Find your next opportunity</h2>
                  <p className="mt-1.5 text-sm text-blue-100/80">
                    Openings and internships reviewed by the JKS Learning team. Applications happen on each employer&apos;s own site.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/10 px-5 py-3 text-center ring-1 ring-white/15">
                  <div className="text-2xl font-bold tabular-nums">{data ? data.totalOpen : "–"}</div>
                  <div className="text-[11px] font-medium uppercase tracking-wide text-blue-100/80">Open now</div>
                </div>
              </div>
            </section>

            <div className="flex flex-col gap-3">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#696969]" />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by title, company, category or location"
                    aria-label="Search jobs"
                    className={`${selectCls} pl-10`}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters((s) => !s)}
                  aria-expanded={showFilters}
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-[#E5E7EB] bg-white px-4 py-2.5 text-sm font-semibold text-[#222222] transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                  {activeCount > 0 && <span className="rounded-full bg-[#1E5EFF] px-1.5 text-[11px] text-white">{activeCount}</span>}
                </button>
              </div>

              {showFilters && (
                <div className="grid gap-3 rounded-2xl border border-[#E5E7EB] bg-white p-4 dark:border-slate-800 dark:bg-surface-elevated sm:grid-cols-2 lg:grid-cols-5">
                  <label className="text-xs font-semibold text-[#696969]">
                    Category
                    <select className={`${selectCls} mt-1`} value={filters.category ?? ""} onChange={(e) => set("category", e.target.value)}>
                      <option value="">All categories</option>
                      {data?.facets.categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#696969]">
                    Employment type
                    <select className={`${selectCls} mt-1`} value={filters.employmentType ?? ""} onChange={(e) => set("employmentType", e.target.value as JobFilters["employmentType"])}>
                      <option value="">Any type</option>
                      {Object.entries(EMPLOYMENT_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#696969]">
                    Experience
                    <select className={`${selectCls} mt-1`} value={filters.experienceLevel ?? ""} onChange={(e) => set("experienceLevel", e.target.value as JobFilters["experienceLevel"])}>
                      <option value="">Any level</option>
                      {Object.entries(EXPERIENCE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#696969]">
                    Work mode
                    <select className={`${selectCls} mt-1`} value={filters.workMode ?? ""} onChange={(e) => set("workMode", e.target.value as JobFilters["workMode"])}>
                      <option value="">Remote, hybrid or on-site</option>
                      {Object.entries(WORK_MODE_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                    </select>
                  </label>
                  <label className="text-xs font-semibold text-[#696969]">
                    Location
                    <select className={`${selectCls} mt-1`} value={filters.location ?? ""} onChange={(e) => set("location", e.target.value)}>
                      <option value="">Anywhere</option>
                      {data?.facets.locations.map((c) => <option key={c}>{c}</option>)}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#222222] dark:text-slate-200 sm:col-span-2 lg:col-span-5">
                    <input type="checkbox" checked={!!filters.includeExpired} onChange={(e) => set("includeExpired", e.target.checked)} className="h-4 w-4 rounded border-slate-300 accent-[#1E5EFF]" />
                    Also show expired opportunities
                  </label>
                </div>
              )}

              {hasAnyFilter && (
                <button type="button" onClick={clearAll} className="inline-flex w-fit items-center gap-1 text-xs font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">
                  <X className="h-3.5 w-3.5" /> Clear search and filters
                </button>
              )}
            </div>

            {error && (
              <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700 dark:border-rose-900/60 dark:bg-rose-950/30 dark:text-rose-300">{error}</div>
            )}

            {!hasAnyFilter && data && data.featured.length > 0 && (
              <section aria-labelledby="featured-h">
                <h2 id="featured-h" className="mb-3 text-sm font-bold uppercase tracking-wide text-[#0B1F3A] dark:text-white">Featured opportunities</h2>
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {data.featured.map((j) => <JobCard key={j.id} job={j} href={`/dashboard/jobs/${j.id}`} />)}
                </div>
              </section>
            )}

            <section aria-labelledby="latest-h">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 id="latest-h" className="text-sm font-bold uppercase tracking-wide text-[#0B1F3A] dark:text-white">
                  {hasAnyFilter ? "Results" : "Latest opportunities"}
                </h2>
                {data && <span className="text-xs text-[#696969] dark:text-slate-400">{data.total} {data.total === 1 ? "job" : "jobs"}</span>}
              </div>

              {loading && !data ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <JobCardSkeleton key={i} />)}</div>
              ) : data && data.items.length === 0 ? (
                <EmptyState
                  title={hasAnyFilter ? "No jobs match your search" : "No openings right now"}
                  body={hasAnyFilter ? "Try fewer filters or a different keyword." : "New opportunities are added regularly. Check back soon."}
                  action={hasAnyFilter ? <button onClick={clearAll} className="rounded-lg bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC]">Clear filters</button> : undefined}
                />
              ) : (
                <div className={`grid gap-4 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${loading ? "opacity-60" : ""}`} aria-busy={loading}>
                  {data?.items.map((j) => <JobCard key={j.id} job={j} href={`/dashboard/jobs/${j.id}`} />)}
                </div>
              )}

              {data && data.totalPages > 1 && (
                <nav aria-label="Pagination" className="mt-6 flex items-center justify-center gap-3">
                  <button
                    type="button"
                    disabled={data.page <= 1 || loading}
                    onClick={() => setFilters((f) => ({ ...f, page: data.page - 1 }))}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700"
                  >
                    <ChevronLeft className="h-4 w-4" /> Previous
                  </button>
                  <span className="text-sm text-[#696969] dark:text-slate-400">Page {data.page} of {data.totalPages}</span>
                  <button
                    type="button"
                    disabled={data.page >= data.totalPages || loading}
                    onClick={() => setFilters((f) => ({ ...f, page: data.page + 1 }))}
                    className="inline-flex items-center gap-1 rounded-lg border border-[#E5E7EB] px-3 py-2 text-sm font-semibold disabled:opacity-40 dark:border-slate-700"
                  >
                    Next <ChevronRight className="h-4 w-4" />
                  </button>
                </nav>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
