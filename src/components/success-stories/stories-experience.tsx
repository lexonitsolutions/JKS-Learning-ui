"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AlertTriangle, Film, Loader2, SearchX } from "lucide-react";
import {
  fetchFeaturedStory,
  fetchStoryFacets,
  queryStories,
  type PublicStory,
  type StoriesPage,
  type StoryFacets,
  type StoryFilters,
} from "@/lib/data/success-stories-api";
import { PlaybackProvider } from "./playback";
import { StoryFiltersBar } from "./story-filters";
import { StoryHero } from "./story-hero";
import { Marquee } from "@/components/ui/marquee";
import { useReducedMotion } from "@/lib/motion/use-reduced-motion";
import { CinematicStory, QuoteStory } from "./story-sections";
import { ProfileCard } from "./profile-card";
import { TransitionRail, VoicesWall } from "./story-rails";
import { StoryVideoModal } from "./story-video-modal";
import { useReveal } from "./use-reveal";

/** How many stories get the full editorial treatment before the compact grid. */
const EDITORIAL_COUNT = 3;

const hasFilters = (f: StoryFilters) => Boolean(f.q || f.course || f.technology || f.category || f.type);

function Skeleton() {
  return (
    <div aria-hidden="true" className="mx-auto grid max-w-[1320px] gap-6 px-5 py-10 sm:px-8 md:grid-cols-2 lg:grid-cols-3 lg:px-12">
      {[0, 1, 2].map((i) => (
        <div key={i} className="overflow-hidden rounded-3xl border border-border bg-white dark:bg-surface-secondary">
          <div className="aspect-video animate-pulse bg-slate-200 dark:bg-slate-800" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-full animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      ))}
    </div>
  );
}

function Notice({
  icon: Icon,
  title,
  body,
  action,
  role,
}: {
  icon: typeof Film;
  title: string;
  body: string;
  action?: React.ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <div role={role} className="mx-auto my-12 max-w-xl rounded-3xl border border-dashed border-border bg-white px-6 py-14 text-center dark:bg-surface-secondary">
      <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-blue/10 text-primary-ink">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </span>
      <h3 className="mt-5 text-xl font-semibold tracking-tight text-text-heading">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-body">{body}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

/** Slow-drifting strip of the technologies learners actually studied (real facet data). */
function TechRibbon({ items }: { items: string[] }) {
  const reduced = useReducedMotion();
  if (items.length < 4) return null;
  const pill = (t: string) => (
    <span
      key={t}
      className="mx-2 inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2 text-sm font-medium text-text-body dark:border-white/15 dark:bg-white/[0.06] dark:text-white/85"
    >
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-primary-blue" />
      {t}
    </span>
  );
  return (
    <div aria-label="Technologies our learners studied" role="group" className="overflow-hidden border-y border-border bg-bg-light py-5 dark:border-white/10 dark:bg-[#0B1F3A]">
      {reduced ? (
        <div className="mx-auto flex max-w-[1320px] flex-wrap justify-center gap-y-2 px-5">{items.slice(0, 12).map(pill)}</div>
      ) : (
        <Marquee pauseOnHover repeat={3} className="[--duration:45s]">
          {items.map(pill)}
        </Marquee>
      )}
    </div>
  );
}

export function StoriesExperience({
  featured: initialFeatured,
  facets: initialFacets,
  initialPage,
}: {
  featured: PublicStory | null;
  facets: StoryFacets | null;
  initialPage: StoriesPage | null;
}) {
  const [filters, setFilters] = useState<StoryFilters>({});
  const [featured, setFeatured] = useState(initialFeatured);
  const [facets, setFacets] = useState(initialFacets);
  const [data, setData] = useState<StoriesPage | null>(initialPage);
  const [loading, setLoading] = useState(!initialPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openStory, setOpenStory] = useState<PublicStory | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Filter key the current data was fetched for; the server-rendered page covers the empty filter.
  const lastKey = useRef(initialPage ? "{}" : "");
  const [headingRef, headingCls] = useReveal<HTMLDivElement>();

  const load = useCallback(async (f: StoryFilters) => {
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    setLoading(true);
    setError(null);
    try {
      setData(await queryStories(f, ctrl.signal));
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
      setError("We could not load the stories. Please check your connection and try again.");
    } finally {
      if (abortRef.current === ctrl) setLoading(false);
    }
  }, []);

  // Refetch on filter change (debounced for typing). The server-rendered first page covers the initial view.
  useEffect(() => {
    const key = JSON.stringify(filters);
    if (key === lastKey.current) return;
    const t = setTimeout(() => {
      lastKey.current = key;
      load(filters);
    }, filters.q ? 300 : 0);
    return () => clearTimeout(t);
  }, [filters, load]);

  useEffect(() => () => abortRef.current?.abort(), []);

  // The server render could not reach the API: recover the hero and filters on the client too.
  useEffect(() => {
    if (initialPage) return;
    let alive = true;
    Promise.all([fetchFeaturedStory(), fetchStoryFacets()]).then(([f, fa]) => {
      if (!alive) return;
      setFeatured(f);
      setFacets(fa);
    });
    return () => {
      alive = false;
    };
  }, [initialPage]);

  const loadMore = async () => {
    if (!data || loadingMore) return;
    setLoadingMore(true);
    try {
      const next = await queryStories({ ...filters, page: data.page + 1 });
      setData({ ...next, items: [...data.items, ...next.items] });
    } catch {
      setError("We could not load more stories. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  // The hero already shows the featured story, so don't repeat it in the unfiltered feed.
  const items = useMemo(() => {
    const all = data?.items ?? [];
    return !hasFilters(filters) && featured ? all.filter((s) => s.id !== featured.id) : all;
  }, [data, filters, featured]);
  const editorial = items.slice(0, EDITORIAL_COUNT);
  const rest = items.slice(EDITORIAL_COUNT);
  const total = facets?.total ?? data?.total ?? 0;
  const hasMore = data ? data.page < data.totalPages : false;
  const filtered = hasFilters(filters);

  return (
    <PlaybackProvider>
      <div className="ss-progress" aria-hidden="true" />
      <StoryHero featured={featured} faces={data?.items ?? []} total={total} onOpen={setOpenStory} />

      <TechRibbon items={facets?.technologies.map((t) => t.value) ?? []} />

      <section id="stories" aria-labelledby="ss-stories-title" className="scroll-mt-20 bg-bg-light">
        <div ref={headingRef} className={`${headingCls} mx-auto max-w-[1320px] px-5 pb-10 pt-16 sm:px-8 lg:px-12 lg:pt-24`}>
          <span className="ss-bar mb-5" aria-hidden="true" />
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-ink">The stories</p>
          <h2
            id="ss-stories-title"
            className="mt-3 max-w-3xl text-balance text-[clamp(1.9rem,4vw,3.25rem)] font-semibold leading-[1.08] tracking-tight text-text-heading"
          >
            In their own words
          </h2>
          {facets && facets.total > 0 && (
            <div className="mt-8">
              <StoryFiltersBar
                facets={facets}
                filters={filters}
                onChange={setFilters}
                resultCount={loading || error ? null : (data?.total ?? null)}
              />
            </div>
          )}
        </div>

        <div aria-busy={loading} aria-live="polite">
          {loading ? (
            <Skeleton />
          ) : error ? (
            <Notice
              role="alert"
              icon={AlertTriangle}
              title="Stories are unavailable"
              body={error}
              action={
                <button
                  type="button"
                  onClick={() => load(filters)}
                  className="min-h-11 cursor-pointer rounded-full bg-[#0B1F3A] px-6 text-sm font-semibold text-white hover:bg-[#13305a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-blue/40"
                >
                  Try again
                </button>
              }
            />
          ) : data && data.total === 0 ? (
            filtered ? (
              <Notice
                role="status"
                icon={SearchX}
                title="No stories match those filters"
                body="Try removing a filter or searching for something broader."
                action={
                  <button
                    type="button"
                    onClick={() => setFilters({})}
                    className="min-h-11 cursor-pointer rounded-full bg-[#0B1F3A] px-6 text-sm font-semibold text-white hover:bg-[#13305a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-blue/40"
                  >
                    Clear filters
                  </button>
                }
              />
            ) : (
              <Notice
                role="status"
                icon={Film}
                title="Stories are coming soon"
                body="We are collecting stories from our learners. Check back shortly to hear how they got where they are."
              />
            )
          ) : (
            <>
              {editorial.map((s, i) =>
                s.video ? (
                  <CinematicStory key={s.id} story={s} onOpen={setOpenStory} flip={i % 2 === 1} first={i === 0} />
                ) : (
                  <QuoteStory key={s.id} story={s} onOpen={setOpenStory} flip={i % 2 === 1} />
                ),
              )}
            </>
          )}
        </div>
      </section>

      {!loading && !error && data && data.total > 0 && (
        <>
          <TransitionRail stories={data.items} />

          {rest.length > 0 && (
            <section aria-labelledby="ss-more-title" className="bg-bg-light py-16 lg:py-24">
              <div className="mx-auto max-w-[1320px] px-5 sm:px-8 lg:px-12">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <span className="ss-bar mb-5" aria-hidden="true" />
                    <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary-ink">More stories</p>
                    <h2
                      id="ss-more-title"
                      className="mt-3 text-balance text-[clamp(1.75rem,3.6vw,2.9rem)] font-semibold leading-[1.08] tracking-tight text-text-heading"
                    >
                      Meet more of our learners
                    </h2>
                  </div>
                  <p className="text-sm text-text-body">
                    <span className="hidden [@media(hover:hover)]:inline">Hover a profile to preview their video.</span>
                    <span className="[@media(hover:hover)]:hidden">Swipe to browse. Videos preview as they come into view.</span>
                  </p>
                </div>

                <div
                  role="list"
                  aria-label="More success stories"
                  className="-mx-5 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain px-5 pb-4 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
                >
                  {rest.map((s, i) => (
                    <div role="listitem" key={s.id} className="contents">
                      <ProfileCard story={s} onOpen={setOpenStory} index={i} />
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {hasMore && (
            <div className="flex justify-center bg-bg-light pb-16 pt-2">
              <button
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
                className="inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full bg-[#0B1F3A] px-8 text-sm font-semibold text-white hover:bg-[#13305a] disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-blue/40"
              >
                {loadingMore && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {loadingMore ? "Loading" : "Show more stories"}
              </button>
            </div>
          )}

          <VoicesWall stories={data.items} />
        </>
      )}

      <StoryVideoModal story={openStory} onClose={() => setOpenStory(null)} />
    </PlaybackProvider>
  );
}
