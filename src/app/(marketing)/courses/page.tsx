import Link from "next/link";
import { CourseCard } from "@/components/marketing/course-card";
import { Reveal } from "@/lib/motion/reveal";
import { COURSES, TRACKS } from "@/lib/data/courses";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>;
}) {
  const { track } = await searchParams;
  const filtered = track ? COURSES.filter((c) => c.track === track) : COURSES;

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
              ? "border-primary-blue bg-primary-blue text-white"
              : "border-border bg-white text-text-body hover:border-primary-blue/50"
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
                ? "border-primary-blue bg-primary-blue text-white"
                : "border-border bg-white text-text-body hover:border-primary-blue/50"
            }`}
          >
            {t}
          </Link>
        ))}
      </div>

      <Reveal
        key={track ?? "all"}
        variant="stagger"
        className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {filtered.map((course) => (
          // Plain wrapper — keeps GSAP's entrance transform off CourseCard's
          // own Framer-Motion-controlled tilt element.
          <div key={course.slug}>
            <CourseCard course={course} />
          </div>
        ))}
      </Reveal>
    </div>
  );
}
