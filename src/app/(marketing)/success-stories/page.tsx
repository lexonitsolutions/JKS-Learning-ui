import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import {
  fetchFeaturedStory,
  fetchStoriesPage,
  fetchStoryFacets,
} from "@/lib/data/success-stories-api";
import { StoriesExperience } from "@/components/success-stories/stories-experience";

export const metadata: Metadata = {
  title: "Success Stories | JKS Learning",
  description:
    "Watch and read how JKS Learning students built new skills, changed careers and reached their goals, in their own words.",
  alternates: { canonical: `${SITE_URL}/success-stories` },
  openGraph: {
    title: "Real People. Real Skills. Remarkable Success.",
    description: "Student success stories from JKS Learning.",
    url: `${SITE_URL}/success-stories`,
    type: "website",
  },
};

export default async function SuccessStoriesPage() {
  // Public, published-only data. Any failure resolves to null and the client
  // shows a retryable state instead of an empty or broken page.
  const [featured, facets, initialPage] = await Promise.all([
    fetchFeaturedStory(),
    fetchStoryFacets(),
    fetchStoriesPage({}),
  ]);

  return (
    <>
      <StoriesExperience featured={featured} facets={facets} initialPage={initialPage} />

      <section aria-labelledby="ss-cta-title" className="bg-[#0B1F3A] py-20 text-white lg:py-28">
        <div className="mx-auto max-w-3xl px-5 text-center sm:px-8">
          <h2
            id="ss-cta-title"
            className="text-balance text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-[1.1] tracking-tight"
          >
            Your success story starts here
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pretty text-base leading-relaxed text-white/80">
            Structured courses, hands-on projects and AI mock interviews to help you build skills that employers notice.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/courses"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-semibold text-[#0B1F3A] transition hover:bg-[#EAF1FF] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Explore courses <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/dashboard/ai-interview"
              className="inline-flex min-h-12 items-center rounded-full px-6 text-sm font-semibold text-white ring-1 ring-white/30 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-white/50"
            >
              Try a free AI mock interview
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
