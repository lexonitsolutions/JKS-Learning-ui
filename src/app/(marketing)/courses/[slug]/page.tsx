import { notFound } from "next/navigation";
import { fetchDbCourseBySlug } from "@/lib/data/courses";
import { CourseDetailView } from "./course-detail-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await fetchDbCourseBySlug(slug);
  if (!course) notFound();

  return <CourseDetailView course={course} />;
}
