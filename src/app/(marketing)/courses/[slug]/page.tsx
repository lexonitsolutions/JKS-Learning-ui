import { fetchDbCourseBySlug } from "@/lib/data/courses";
import { CourseDetailResolver } from "./course-detail-resolver";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await fetchDbCourseBySlug(slug);

  return <CourseDetailResolver slug={slug} initialCourse={course} />;
}
