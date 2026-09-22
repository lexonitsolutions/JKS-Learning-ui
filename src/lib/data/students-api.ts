import { apiFetch } from "@/lib/api/base-url";

export interface StudentEnrollment {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  track: string;
  batchTiming: string;
  progress: number;
  completedVideosCount?: number;
  status?: string;
  completionApproved?: boolean;
  enrolledAt: string;
}

export interface AdminStudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status?: string;
  registeredAt: string;
  createdAt: string;
  enrollments: StudentEnrollment[];
  totalEnrolled: number;
}

export interface StudentCourseDetail {
  id: string;
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  track: string;
  summary: string;
  thumbnail: string;
  durationWeeks: number;
  batchTiming: string;
  progress: number;
  status?: string;
  completedVideosCount?: number;
  completedVideoIds?: string[];
  completedAssignmentIds?: string[];
  totalMilestones?: number;
  completedMilestones?: number;
  totalVideos?: number;
  totalModules?: number;
  enrolledAt: string;
  lastAccessedAt: string;
}

export interface StudentInvoiceItem {
  id: string;
  invoiceNumber: string;
  courseTitle: string;
  batchTiming: string;
  baseAmount: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  status: "PAID" | "PENDING" | "VOID";
  paymentMethod: string;
  paidAt: string | null;
  createdAt: string;
}

export interface StudentAssessmentItem {
  id: string;
  title: string;
  type: string;
  courseTitle: string;
  score: number;
  maxScore: number;
  status: string;
  submittedAt: string;
  feedback: string;
  aiAuthenticityScore: number;
  answers?: any;
}

export interface AdminStudentDetail {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  registeredAt: string;
  createdAt: string;
  enrollments: StudentCourseDetail[];
  totalEnrolled: number;
  invoices: StudentInvoiceItem[];
  assessments?: StudentAssessmentItem[];
  submissions?: StudentAssessmentItem[];
}

export async function fetchAdminStudents(): Promise<AdminStudentRecord[]> {
  try {
    const res = await apiFetch("/admin/students", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Backend /admin/students unavailable, returning fallback:", (err as Error)?.message || err);
  }
  return [];
}

export async function fetchStudentDetail(idOrSlug: string): Promise<AdminStudentDetail | null> {
  try {
    const res = await apiFetch(`/admin/students/${encodeURIComponent(idOrSlug)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn(`Backend /admin/students/${idOrSlug} unavailable:`, (err as Error)?.message || err);
  }
  return null;
}

export interface LeaderboardItem {
  id: string;
  name: string;
  email: string;
  initials: string;
  track: string;
  streakDays: number;
  completedVideos: number;
  solvedAssignments: number;
  points: number;
  accuracy: number;
  badge: string;
  isRealUser: boolean;
  createdAt: string;
  rank: number;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardItem[];
  topStreaks: LeaderboardItem[];
  topSolvers: LeaderboardItem[];
  metrics: {
    totalActiveLearners: number;
    totalCompletedLessons: number;
    totalChallengesSolved: number;
  };
}

export async function fetchLeaderboardData(): Promise<LeaderboardResponse> {
  try {
    const res = await apiFetch("/users/leaderboard", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (data && Array.isArray(data.leaderboard)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Leaderboard API not reachable, computing fallback:", err);
  }

  // Fallback if backend offline
  return {
    leaderboard: [
      {
        id: "student-davood",
        name: "Davood Khan",
        email: "pattandavood123@gmail.com",
        initials: "DK",
        track: "Full Stack",
        streakDays: 37,
        completedVideos: 9,
        solvedAssignments: 10,
        points: 2975,
        accuracy: 94,
        badge: "Grandmaster Architect",
        isRealUser: true,
        createdAt: new Date().toISOString(),
        rank: 1,
      },
      {
        id: "student-khan",
        name: "Khan Patan",
        email: "patankhan3318@gmail.com",
        initials: "KP",
        track: "Full Stack",
        streakDays: 34,
        completedVideos: 15,
        solvedAssignments: 7,
        points: 2850,
        accuracy: 98,
        badge: "Grandmaster Architect",
        isRealUser: true,
        createdAt: new Date().toISOString(),
        rank: 2,
      },
      {
        id: "peer-1",
        name: "Satish Jhamwer",
        email: "satish.j@jkslearning.internal",
        initials: "SJ",
        track: "Java Full Stack",
        streakDays: 24,
        completedVideos: 18,
        solvedAssignments: 6,
        points: 2650,
        accuracy: 96,
        badge: "Grandmaster Architect",
        isRealUser: false,
        createdAt: new Date().toISOString(),
        rank: 3,
      },
      {
        id: "peer-2",
        name: "Peeyush Raj",
        email: "peeyush.r@jkslearning.internal",
        initials: "PR",
        track: "Frontend React",
        streakDays: 19,
        completedVideos: 15,
        solvedAssignments: 5,
        points: 2150,
        accuracy: 94,
        badge: "Master Solver",
        isRealUser: false,
        createdAt: new Date().toISOString(),
        rank: 4,
      },
      {
        id: "peer-3",
        name: "Akkal Dhami",
        email: "akkal.d@jkslearning.internal",
        initials: "AD",
        track: ".NET Core Cloud",
        streakDays: 16,
        completedVideos: 12,
        solvedAssignments: 4,
        points: 1850,
        accuracy: 91,
        badge: "Pro Developer",
        isRealUser: false,
        createdAt: new Date().toISOString(),
        rank: 5,
      },
    ],
    topStreaks: [],
    topSolvers: [],
    metrics: {
      totalActiveLearners: 5,
      totalCompletedLessons: 69,
      totalChallengesSolved: 32,
    },
  };
}

export interface AdminSubmissionItem {
  id: string;
  assessmentId: string;
  userId: string;
  score: number | null;
  status: "PENDING_REVIEW" | "GRADED" | string;
  submittedAt: string;
  answers: any;
  user: {
    id: string;
    name: string;
    email: string;
    role?: string;
  };
  assessment: {
    id: string;
    title: string;
    type?: string;
    course?: {
      id: string;
      title: string;
      slug: string;
      track: string;
    } | null;
  };
}

export async function fetchAdminSubmissions(): Promise<AdminSubmissionItem[]> {
  try {
    const res = await apiFetch("/admin/submissions", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Backend /admin/submissions unavailable:", (err as Error)?.message || err);
  }
  return [];
}

export async function gradeAdminSubmission(submissionId: string, score: number): Promise<boolean> {
  try {
    const res = await apiFetch(`/admin/submissions/${encodeURIComponent(submissionId)}/grade`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score }),
    });
    return res.ok;
  } catch (err) {
    console.warn("Failed to grade submission:", err);
    return false;
  }
}

export async function updateAdminStudent(
  id: string,
  payload: { name?: string; email?: string; phone?: string; status?: string }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await apiFetch(`/admin/students/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to update student" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error updating student" };
  }
}

export async function deleteAdminStudent(id: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await apiFetch(`/admin/students/${encodeURIComponent(id)}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });
    return { success: res.ok };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to delete student" };
  }
}

export async function updateEnrollmentStatus(
  enrollmentId: string,
  status: "ACTIVE" | "PAUSED" | "REMOVED"
): Promise<{ success: boolean; data?: { status?: string }; error?: string }> {
  try {
    const res = await apiFetch(`/admin/enrollments/${encodeURIComponent(enrollmentId)}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      return { success: true, data: await res.json() };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to update enrollment status" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to update enrollment status" };
  }
}

export interface UserProfileDto {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string | null;
  createdAt: string;
}

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
}

export async function fetchMyProfile(): Promise<UserProfileDto | null> {
  try {
    const res = await apiFetch("/users/profile", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("fetchMyProfile error:", err);
  }
  return null;
}

export async function updateMyProfile(
  dto: UserProfileUpdate
): Promise<{ success: boolean; data?: UserProfileDto; error?: string }> {
  try {
    const res = await apiFetch("/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dto),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to update profile" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error updating profile" };
  }
}

// ── Student Course Tasks & DOCX Export ────────────────────────

export interface CourseTaskItem {
  id: string;
  date: string;
  topicName: string;
  programName: string;
  syntaxKeywords: string;
  whyUsing: string;
  whereUsing: string;
  whyWeAreUsing?: string;
  whereWeHaveToUse?: string;
  examplesCaseStudy: string;
  flow: string;
  outOf5: number;
  remarks: string;
  courseId?: string;
  courseTitle?: string;
  courseSlug?: string;
  source?: "submission" | "curriculum" | "sheet_log";
}

export interface StudentCourseTasksResponse {
  student: { id: string; name: string; email: string; phone?: string };
  selectedCourse: { id: string; title: string; slug: string } | null;
  availableCourses: { id: string; title: string; slug: string; taskCount: number }[];
  tasks: CourseTaskItem[];
}

export async function fetchStudentCourseTasks(
  studentIdOrSlug: string,
  courseId?: string
): Promise<StudentCourseTasksResponse | null> {
  try {
    const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
    const res = await apiFetch(`/admin/students/${encodeURIComponent(studentIdOrSlug)}/tasks${query}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn("Failed to fetch student course tasks from backend:", err);
  }
  return null;
}

export async function downloadStudentCourseTasksDocx(
  studentIdOrSlug: string,
  courseId?: string,
  courseTitle?: string
): Promise<void> {
  const query = courseId ? `?courseId=${encodeURIComponent(courseId)}` : "";
  const res = await apiFetch(`/admin/students/${encodeURIComponent(studentIdOrSlug)}/tasks/docx${query}`, {
    method: "GET",
  });
  if (!res.ok) {
    throw new Error(`Failed to download course tasks document (Status ${res.status})`);
  }
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safeName = (courseTitle || "course_tasks").toLowerCase().replace(/[^a-z0-9]+/g, "_");
  a.download = `student_tasks_${safeName}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}
