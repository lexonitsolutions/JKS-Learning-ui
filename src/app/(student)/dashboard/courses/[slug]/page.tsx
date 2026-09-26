import React from "react";
import { fetchDbCourseBySlug } from "@/lib/data/courses";
import { CourseDetailResolver } from "@/app/(marketing)/courses/[slug]/course-detail-resolver";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await fetchDbCourseBySlug(slug);

  return (
    <>
      <DashboardTopbar
        title={course?.title ? course.title : "Course Overview"}
        subtitle="Review syllabus, instructor details, and enrollment options."
      />
      <div className="flex-1 p-2 sm:p-4 lg:p-6">
        <CourseDetailResolver slug={slug} initialCourse={course} />
      </div>
    </>
  );
}
