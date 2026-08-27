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
        <Card className="h-full transition-shadow hover:shadow-lg">
          <div className="flex h-36 items-center justify-center rounded-t-lg bg-gradient-to-br from-primary-dark to-primary-blue">
            <span className="text-label text-white/70">{course.track}</span>
          </div>
          <div className="p-5">
            <div className="mb-2 flex items-center gap-2">
              <Badge variant="primary">{course.level}</Badge>
            </div>
            <h3 className="text-h3 leading-snug text-text-heading">{course.title}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-text-body">{course.summary}</p>

            <div className="mt-4 flex items-center gap-4 text-body-sm text-text-body">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.durationWeeks}w
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course.studentsEnrolled.toLocaleString()}
              </span>
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-warning text-warning" /> {course.rating}
              </span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-h3 text-primary-blue">
                &#8377;{course.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm font-semibold text-primary-blue">View course &rarr;</span>
            </div>
          </div>
        </Card>
      </Link>
    </TiltCard>
  );
}
