import Link from "next/link";
import { CourseCard } from "@/components/marketing/course-card";
import { Reveal } from "@/lib/motion/reveal";
import { fetchDbCourses, TRACKS } from "@/lib/data/courses";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const courses = await fetchDbCourses();
  const filtered = track ? courses.filter((c) => c.track === track) : courses;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-16">
      <Reveal>
        <span className="text-label text-primary-blue">Course Marketplace</span>
        <h1 className="text-h1 mt-2 text-text-heading">All Courses</h1>
        <p className="mt-3 max-w-xl text-text-body">
          Structured, project-based tracks across Full Stack, Frontend, and SAP —
          every course includes free demo lessons and an AI mock interview module.
        </p>
      </Reveal>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/courses"
          className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
            !track
              ? "border-primary-blue bg-primary-fill text-white"
              : "border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary text-text-body dark:text-slate-300 hover:border-primary-blue/50 dark:hover:border-blue-500/50"
          }`}
        >
          All
        </Link>
        {TRACKS.map((t) => (
          <Link
            key={t}
            href={`/courses?track=${encodeURIComponent(t)}`}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              track === t
                ? "border-primary-blue bg-primary-fill text-white"
                : "border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary text-text-body dark:text-slate-300 hover:border-primary-blue/50 dark:hover:border-blue-500/50"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
          <p className="text-base font-bold text-slate-800 dark:text-white">No courses currently published</p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Courses published in the database will appear here in real-time.</p>
        </div>
      ) : (
        <Reveal
          key={track ?? "all"}
          variant="stagger"
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
        >
          {filtered.map((course) => (
            <div key={course.slug}>
              <CourseCard course={course} />
            </div>
          ))}
        </Reveal>
      )}
    </div>
  );
}
