"use client";

import { useId, useRef, useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import type { FacetOption, StoryFacets, StoryFilters } from "@/lib/data/success-stories-api";

type Key = "course" | "technology" | "category";

const chip = (active: boolean) =>
  `inline-flex min-h-10 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue ${
    active
      ? "bg-[#0B1F3A] text-white ring-[#0B1F3A] dark:bg-primary-blue dark:ring-primary-blue"
      : "bg-white text-text-body ring-border hover:bg-bg-light hover:text-text-heading dark:bg-surface-secondary"
  }`;

function Group({
  label,
  options,
  value,
  onPick,
}: {
  label: string;
  options: FacetOption[];
  value?: string;
  onPick: (v: string | undefined) => void;
}) {
  if (options.length < 2) return null; // a single option can't narrow anything
  return (
    <div role="group" aria-label={label}>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-body">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.slice(0, 12).map((o) => {
          const active = value === o.value;
          return (
            <button key={o.value} type="button" aria-pressed={active} onClick={() => onPick(active ? undefined : o.value)} className={chip(active)}>
              {o.value}
              <span className={`text-xs tabular-nums ${active ? "text-white/70" : "text-text-body/70"}`}>{o.count}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * A single "Filters" button keeps the page calm; the panel unfolds on demand and
 * whatever is applied stays visible as removable chips.
 */
export function StoryFiltersBar({
  facets,
  filters,
  onChange,
  resultCount,
}: {
  facets: StoryFacets;
  filters: StoryFilters;
  onChange: (next: StoryFilters) => void;
  resultCount: number | null;
}) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  const set = (patch: Partial<StoryFilters>) => onChange({ ...filters, ...patch });
  const pick = (key: Key) => (v: string | undefined) => set({ [key]: v });

  const applied: { id: string; label: string; clear: () => void }[] = [
    filters.q && { id: "q", label: `“${filters.q}”`, clear: () => set({ q: undefined }) },
    filters.course && { id: "course", label: filters.course, clear: () => set({ course: undefined }) },
    filters.technology && { id: "tech", label: filters.technology, clear: () => set({ technology: undefined }) },
    filters.category && { id: "cat", label: filters.category, clear: () => set({ category: undefined }) },
    filters.type && { id: "type", label: filters.type === "video" ? "Video stories" : "Written stories", clear: () => set({ type: undefined }) },
  ].filter(Boolean) as { id: string; label: string; clear: () => void }[];

  const showType = facets.types.video > 0 && facets.types.written > 0;
  const showSearch = facets.total >= 4;

  return (
    <div
      role="search"
      aria-label="Filter success stories"
      onKeyDown={(e) => {
        if (e.key === "Escape" && open) {
          setOpen(false);
          buttonRef.current?.focus();
        }
      }}
    >
      <div className="flex flex-wrap items-center gap-2.5">
        <button
          ref={buttonRef}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((v) => !v)}
          className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-5 text-sm font-semibold ring-1 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue ${
            open ? "bg-[#0B1F3A] text-white ring-[#0B1F3A]" : "bg-white text-text-heading ring-border hover:bg-bg-light dark:bg-surface-secondary"
          }`}
        >
          <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
          Filters
          {applied.length > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1E5EFF] px-1 text-[11px] font-bold text-white">
              {applied.length}
            </span>
          )}
        </button>

        <ul className="flex flex-wrap items-center gap-2" aria-label="Applied filters">
          {applied.map((a) => (
            <li key={a.id}>
              <button
                type="button"
                onClick={a.clear}
                className="inline-flex min-h-9 cursor-pointer items-center gap-1.5 rounded-full bg-primary-blue/10 px-3 text-sm font-medium text-primary-ink transition hover:bg-primary-blue/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
              >
                {a.label}
                <X className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="sr-only">Remove filter</span>
              </button>
            </li>
          ))}
          {applied.length > 1 && (
            <li>
              <button
                type="button"
                onClick={() => onChange({})}
                className="min-h-9 cursor-pointer px-2 text-sm font-semibold text-text-body underline-offset-4 hover:text-text-heading hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue"
              >
                Clear all
              </button>
            </li>
          )}
        </ul>

        <p role="status" aria-live="polite" className="ml-auto text-sm text-text-body">
          {resultCount === null ? "" : `${resultCount} ${resultCount === 1 ? "story" : "stories"}`}
        </p>
      </div>

      {/* Height animates with grid rows; inert keeps hidden controls out of the tab order. */}
      <div
        id={panelId}
        inert={!open}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-out ${
          open ? "mt-4 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="space-y-6 rounded-3xl border border-border bg-white p-5 shadow-sm dark:bg-surface-secondary sm:p-7">
            {(showSearch || showType) && (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                {showSearch && (
                  <div className="relative w-full sm:max-w-sm">
                    <label htmlFor={`${panelId}-q`} className="mb-2 block text-xs font-semibold uppercase tracking-wider text-text-body">
                      Search
                    </label>
                    <Search className="pointer-events-none absolute bottom-3.5 left-4 h-4 w-4 text-text-body" aria-hidden="true" />
                    <input
                      id={`${panelId}-q`}
                      type="search"
                      value={filters.q ?? ""}
                      onChange={(e) => set({ q: e.target.value || undefined })}
                      placeholder="Name, course or company"
                      maxLength={100}
                      className="h-12 w-full rounded-full border border-border bg-bg-light pl-11 pr-4 text-sm text-text-heading placeholder:text-text-body/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-blue dark:bg-surface"
                    />
                  </div>
                )}
                {showType && (
                  <div role="group" aria-label="Story type">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-text-body">Format</p>
                    <div className="flex gap-2">
                      {(
                        [
                          [undefined, "All"],
                          ["video", `Video (${facets.types.video})`],
                          ["written", `Written (${facets.types.written})`],
                        ] as const
                      ).map(([v, label]) => (
                        <button key={label} type="button" aria-pressed={filters.type === v} onClick={() => set({ type: v })} className={chip(filters.type === v)}>
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <Group label="Course" options={facets.courses} value={filters.course} onPick={pick("course")} />
            <Group label="Technology" options={facets.technologies} value={filters.technology} onPick={pick("technology")} />
            <Group label="Outcome" options={facets.categories} value={filters.category} onPick={pick("category")} />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  buttonRef.current?.focus();
                }}
                className="min-h-10 cursor-pointer rounded-full bg-[#0B1F3A] px-6 text-sm font-semibold text-white hover:bg-[#13305a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-blue/40"
              >
                Show {resultCount ?? ""} {resultCount === 1 ? "story" : "stories"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
