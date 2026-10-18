import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { fetchBlogCategories, fetchBlogPage } from "@/lib/data/blog-api";
import { BlogCardView, CategoryLabel, Cover, Meta } from "@/components/blog/blog-ui";

type SearchParams = { q?: string; category?: string; tag?: string; page?: string };

export async function generateMetadata({ searchParams }: { searchParams: Promise<SearchParams> }): Promise<Metadata> {
  const sp = await searchParams;
  const filtered = !!(sp.q || sp.category || sp.tag || (sp.page && sp.page !== "1"));
  return {
    title: "Blog – Tech, Careers & Interview Prep | JKS Learning",
    description:
      "Articles on programming, web development, AI, Java, SAP, interview preparation and career guidance from the JKS Learning team.",
    alternates: { canonical: `${SITE_URL}/blog` },
    // Filtered and paginated views are thin duplicates of the main listing.
    robots: filtered ? { index: false, follow: true } : undefined,
    openGraph: {
      title: "The JKS Learning Blog",
      description: "Practical guides on tech skills, interviews and careers.",
      url: `${SITE_URL}/blog`,
      type: "website",
    },
  };
}

function href(sp: SearchParams, patch: Partial<SearchParams>) {
  const next = { ...sp, ...patch };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) if (v && !(k === "page" && v === "1")) qs.set(k, v);
  const s = qs.toString();
  return s ? `/blog?${s}` : "/blog";
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number.parseInt(sp.page ?? "1", 10) || 1);
  const [result, categories] = await Promise.all([
    fetchBlogPage({ q: sp.q?.slice(0, 100), category: sp.category, tag: sp.tag, page }),
    fetchBlogCategories(),
  ]);

  const filtered = !!(sp.q || sp.category || sp.tag);
  const showFeatured = !filtered && page === 1 && !!result && result.items.length > 0;
  const featured = showFeatured ? result!.items[0] : null;
  const rest = result ? (showFeatured ? result.items.slice(1) : result.items) : [];
  const activeCategory = categories?.find((c) => c.slug === sp.category);

  return (
    <div className="bg-[#F5F8FF] dark:bg-transparent">
      <section className="relative overflow-hidden bg-[#0B1F3A] text-white">
        <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-[#1E5EFF]/30 blur-3xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-200">The JKS Learning Blog</p>
          <h1 className="mt-3 max-w-2xl text-3xl font-bold leading-tight tracking-tight sm:text-5xl">Learn it. Ace the interview. Land the role.</h1>
          <p className="mt-4 max-w-xl text-base text-blue-100/80">Practical guides on programming, AI, SAP and Java, plus interview and career advice from people who teach it every day.</p>
          <form action="/blog" method="get" role="search" className="mt-7 flex max-w-lg gap-2">
            {sp.category && <input type="hidden" name="category" value={sp.category} />}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                name="q"
                defaultValue={sp.q ?? ""}
                maxLength={100}
                placeholder="Search articles"
                aria-label="Search articles"
                className="w-full rounded-xl bg-white py-3 pl-10 pr-3 text-sm text-[#222222] outline-none ring-2 ring-transparent placeholder:text-slate-400 focus:ring-[#1E5EFF]"
              />
            </div>
            <button type="submit" className="rounded-xl bg-[#1E5EFF] px-5 text-sm font-semibold text-white hover:bg-[#2167FF]">Search</button>
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {categories && categories.length > 0 && (
          <nav aria-label="Categories" className="-mx-1 mb-8 flex flex-wrap gap-2">
            <Link href={href({ q: sp.q }, {})} aria-current={!sp.category ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${!sp.category ? "bg-[#0B1F3A] text-white dark:bg-[#1E5EFF]" : "bg-white text-[#222222] ring-1 ring-[#E5E7EB] hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-200 dark:ring-slate-700"}`}>
              All
            </Link>
            {categories.filter((c) => c.count > 0 || c.slug === sp.category).map((c) => (
              <Link key={c.id} href={href({ q: sp.q }, { category: c.slug })} aria-current={sp.category === c.slug ? "page" : undefined} className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${sp.category === c.slug ? "bg-[#0B1F3A] text-white dark:bg-[#1E5EFF]" : "bg-white text-[#222222] ring-1 ring-[#E5E7EB] hover:bg-slate-50 dark:bg-surface-elevated dark:text-slate-200 dark:ring-slate-700"}`}>
                {c.name} <span className="opacity-60">{c.count}</span>
              </Link>
            ))}
          </nav>
        )}

        {(sp.q || sp.tag) && (
          <p className="mb-6 text-sm text-[#696969] dark:text-slate-400">
            {result?.total ?? 0} result{result?.total === 1 ? "" : "s"}
            {sp.q ? <> for “<span className="font-semibold text-[#222222] dark:text-white">{sp.q}</span>”</> : null}
            {sp.tag ? <> tagged <span className="font-semibold text-[#222222] dark:text-white">#{sp.tag}</span></> : null}
            {activeCategory ? <> in {activeCategory.name}</> : null}
            {" · "}
            <Link href="/blog" className="font-semibold text-[#1A52E0] hover:underline dark:text-blue-300">Clear</Link>
          </p>
        )}

        {result === null ? (
          <div role="alert" className="rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center dark:border-slate-800 dark:bg-surface-elevated">
            <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">Articles are temporarily unavailable</h2>
            <p className="mt-1 text-sm text-[#696969] dark:text-slate-400">Please try again in a moment.</p>
          </div>
        ) : result.items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-white/60 p-12 text-center dark:border-slate-700 dark:bg-surface-elevated/60">
            <h2 className="text-lg font-bold text-[#0B1F3A] dark:text-white">{filtered ? "No articles match your search" : "No articles published yet"}</h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-[#696969] dark:text-slate-400">
              {filtered ? "Try a different keyword or browse all categories." : "We're writing the first ones. Check back soon."}
            </p>
            {filtered && <Link href="/blog" className="mt-5 inline-flex rounded-lg bg-[#1E5EFF] px-4 py-2 text-sm font-semibold text-white hover:bg-[#1649CC]">Browse all articles</Link>}
          </div>
        ) : (
          <>
            {featured && (
              <article className="group relative mb-10 grid overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white shadow-[0_20px_50px_-30px_rgba(11,31,58,0.35)] dark:border-slate-800 dark:bg-surface-elevated md:grid-cols-2">
                <div className="aspect-[16/10] overflow-hidden bg-slate-100 dark:bg-slate-800 md:aspect-auto md:min-h-[320px]">
                  <Cover post={featured} priority />
                </div>
                <div className="flex flex-col justify-center p-6 sm:p-9">
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-amber-800 dark:bg-amber-950/40 dark:text-amber-300">Latest</span>
                    <CategoryLabel post={featured} />
                  </div>
                  <h2 className="mt-4 text-2xl font-bold leading-tight text-[#0B1F3A] dark:text-white sm:text-3xl">
                    <Link href={`/blog/${featured.slug}`} className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none">{featured.title}</Link>
                  </h2>
                  {featured.excerpt && <p className="mt-3 line-clamp-4 text-base leading-relaxed text-[#696969] dark:text-slate-400">{featured.excerpt}</p>}
                  <div className="mt-5"><Meta post={featured} /></div>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#1A52E0] dark:text-blue-300">Read article <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </article>
            )}

            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => <BlogCardView key={p.id} post={p} />)}
              </div>
            )}

            {result.totalPages > 1 && (
              <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-3">
                {page > 1 ? (
                  <Link href={href(sp, { page: String(page - 1) })} rel="prev" className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-elevated">Previous</Link>
                ) : <span className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-semibold opacity-40 dark:border-slate-700">Previous</span>}
                <span className="text-sm text-[#696969] dark:text-slate-400">Page {result.page} of {result.totalPages}</span>
                {page < result.totalPages ? (
                  <Link href={href(sp, { page: String(page + 1) })} rel="next" className="rounded-lg border border-[#E5E7EB] bg-white px-4 py-2 text-sm font-semibold hover:bg-slate-50 dark:border-slate-700 dark:bg-surface-elevated">Next</Link>
                ) : <span className="rounded-lg border border-[#E5E7EB] px-4 py-2 text-sm font-semibold opacity-40 dark:border-slate-700">Next</span>}
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  );
}
