import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronDown, Download, PlayCircle, Star, Clock, Users, CheckCircle2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { Reveal } from "@/lib/motion/reveal";
import { COURSES, getCourseBySlug } from "@/lib/data/courses";

export function generateStaticParams() {
  return COURSES.map((c) => ({ slug: c.slug }));
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = getCourseBySlug(slug);
  if (!course) notFound();

  const totalTopics = course.modules.reduce((sum, m) => sum + m.topics.length, 0);

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div>
          <Reveal>
            <Badge variant="primary">{course.track}</Badge>
            <h1 className="text-h1 mt-3 text-text-heading">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-text-body">{course.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-body-sm text-text-body">
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" /> {course.rating} rating
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course.studentsEnrolled.toLocaleString()} enrolled
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.durationWeeks} weeks
              </span>
            </div>
          </Reveal>

          {/* Free demo */}
          <Reveal
            variant="fade-up"
            delay={0.1}
            className="mt-8 flex items-center gap-4 rounded-lg border border-border bg-white p-4"
          >
            <PlayCircle className="h-10 w-10 shrink-0 text-primary-blue" />
            <div>
              <div className="text-sm font-semibold text-text-heading">
                Watch the free demo lesson
              </div>
              <div className="text-body-sm text-text-body">
                {course.modules[0]?.title} — first topic, no sign-in required.
              </div>
            </div>
          </Reveal>

          {/* Curriculum */}
          <div className="mt-12">
            <Reveal>
              <h2 className="text-h2 text-text-heading">Curriculum</h2>
              <p className="mt-1 text-body-sm text-text-body">
                {course.modules.length} modules &middot; {totalTopics} topics
              </p>
            </Reveal>
            <Reveal
              variant="stagger"
              staggerDelay={0.06}
              className="mt-6 divide-y divide-border rounded-lg border border-border bg-white"
            >
              {course.modules.map((module, i) => (
                <details key={module.title} className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4">
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-blue/10 text-body-sm font-semibold text-primary-blue">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-text-heading">{module.title}</span>
                    </span>
                    <ChevronDown className="h-5 w-5 text-text-body transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="space-y-2 px-5 pb-5 pl-15">
                    {module.topics.map((topic) => (
                      <li key={topic} className="flex items-center gap-2 text-sm text-text-body">
                        <PlayCircle className="h-4 w-4 shrink-0 text-text-body/60" />
                        {topic}
                        {i === 0 && (
                          <span className="ml-1 text-body-sm font-medium text-primary-blue">
                            Free
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </Reveal>
          </div>

          {/* What's included */}
          <div className="mt-12">
            <Reveal>
              <h2 className="text-h2 text-text-heading">What&apos;s included</h2>
            </Reveal>
            <Reveal
              as="ul"
              variant="stagger"
              staggerDelay={0.05}
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {[
                "Lifetime access to course videos",
                "Hands-on capstone project",
                "AI mock interview module",
                "Verified certificate on completion",
                "Assessments after every module",
                "Downloadable course brochure",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-body">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> {item}
                </li>
              ))}
            </Reveal>
          </div>
        </div>

        {/* Sticky purchase card */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Reveal variant="scale-in" className="rounded-lg border border-border bg-white p-6 shadow-md">
            <div className="text-h1 text-text-heading">
              &#8377;{course.price.toLocaleString("en-IN")}
            </div>
            <MagneticButton className="mt-5 block w-full">
              <Link
                href={`/register-course?course=${course.slug}`}
                className={buttonVariants({ size: "lg" }) + " w-full"}
              >
                Enroll Now
              </Link>
            </MagneticButton>

            <button className={buttonVariants({ variant: "secondary", size: "md" }) + " mt-3 w-full"}>
              <Download className="h-4 w-4" /> Download Brochure
            </button>
            <ul className="mt-6 space-y-2 border-t border-border pt-6 text-sm text-text-body">
              <li>{course.durationWeeks} weeks &middot; self-paced</li>
              <li>{course.modules.length} modules, {totalTopics} topics</li>
              <li>Certificate on completion</li>
              <li>AI mock interview included</li>
            </ul>
          </Reveal>
        </aside>
      </div>
    </div>
  );
}
