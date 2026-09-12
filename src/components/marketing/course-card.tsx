import Link from "next/link";
import { Star, Clock, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TiltCard } from "@/components/interactions/tilt-card";
import type { Course } from "@/lib/data/courses";

export function CourseCard({ course }: { course: Course }) {
  return (
    <TiltCard className="h-full">
      <Link href={`/courses/${course.slug}`} className="block h-full">
        <Card className="h-full flex flex-col justify-between transition-shadow hover:shadow-lg rounded-2xl overflow-hidden border border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-surface-secondary dark:hover:border-border-strong">
          <div>
            <div className="relative flex h-28 sm:h-36 items-center justify-center bg-gradient-to-br from-primary-dark to-primary-fill overflow-hidden text-center">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-[11px] sm:text-label font-bold text-white/85 line-clamp-1">{course.track}</span>
              )}
            </div>
            <div className="p-3 sm:p-5">
              <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5">
                <Badge variant="primary" className="text-[9px] sm:text-xs px-1.5 py-0.5">{course.level}</Badge>
              </div>
              <h3 className="text-xs sm:text-base md:text-lg font-bold leading-snug text-text-heading line-clamp-2 min-h-[2rem] sm:min-h-0">{course.title}</h3>
              <p className="mt-1.5 sm:mt-2 line-clamp-2 text-[10px] sm:text-sm text-text-body">{course.summary}</p>

              <div className="mt-2.5 sm:mt-4 flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-body-sm text-text-body">
                <span className="flex items-center gap-0.5 sm:gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-400" /> {course.durationWeeks}w
                </span>
                <span className="flex items-center gap-0.5 sm:gap-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400 dark:text-slate-400" /> {course.studentsEnrolled.toLocaleString()}
                </span>
                <span className="flex items-center gap-0.5 sm:gap-1 font-bold text-slate-700 dark:text-slate-200">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-warning text-warning" /> {course.rating}
                </span>
              </div>
            </div>
          </div>

          <div className="p-3 sm:p-5 pt-0">
            <div className="flex items-center justify-between border-t border-border dark:border-slate-800 pt-2.5 sm:pt-4">
              <span className="text-xs sm:text-base font-black text-primary-blue">
                &#8377;{course.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[11px] sm:text-sm font-semibold text-primary-blue">View &rarr;</span>
            </div>
          </div>
        </Card>
      </Link>
    </TiltCard>
  );
}
