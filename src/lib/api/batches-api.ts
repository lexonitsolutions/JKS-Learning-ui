import { apiFetch } from "./base-url";

export interface EnrolledStudentItem {
  studentId: string;
  enrollmentId: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  status: string;
  batchTiming: string;
  completionApproved: boolean;
  completedVideos: number;
  enrolledAt: string;
}

export interface BatchCourseItem {
  id: string;
  title: string;
  slug: string;
  track: string;
  status: string;
  thumbnail?: string | null;
  durationWeeks?: number | null;
  studentsCount: number;
  enrolledStudents: EnrolledStudentItem[];
}

export interface InstructorBatchHierarchy {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl: string | null;
  assignedCoursesCount: number;
  totalStudentsCount: number;
  courses: BatchCourseItem[];
}

export async function fetchBatchesHierarchy(instructorId?: string): Promise<InstructorBatchHierarchy[]> {
  const query = instructorId ? `?instructorId=${encodeURIComponent(instructorId)}` : "";
  const res = await apiFetch(`/admin/batches${query}`, {
    method: "GET",
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => "");
    throw new Error(errorText || `Failed to fetch batches hierarchy: ${res.statusText}`);
  }

  return res.json();
}
