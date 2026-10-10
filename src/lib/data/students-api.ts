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
  completionApproved?: boolean;
  completionRequestedAt?: string | null;
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

const STUDENTS_STORAGE_KEY = "jks_students_roster_cache_v2";
const LEADERBOARD_STORAGE_KEY = "jks_leaderboard_cache_v3";

export async function fetchAdminStudents(query?: {
  courseSlug?: string;
  courseId?: string;
  instructorId?: string;
}): Promise<AdminStudentRecord[]> {
  const isUnfiltered = !query?.courseSlug && !query?.courseId && !query?.instructorId;
  try {
    const params = new URLSearchParams();
    if (query?.courseSlug && query.courseSlug !== "all") params.set("courseSlug", query.courseSlug);
    if (query?.courseId) params.set("courseId", query.courseId);
    if (query?.instructorId) params.set("instructorId", query.instructorId);

    const queryString = params.toString() ? `?${params.toString()}` : "";
    const res = await apiFetch(`/admin/students${queryString}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        if (isUnfiltered && typeof window !== "undefined") {
          try {
            localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(data));
          } catch {}
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("Backend /admin/students unavailable, returning fallback:", (err as Error)?.message || err);
  }

  // Fallback to cached students if available
  if (isUnfiltered && typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(STUDENTS_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
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
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(LEADERBOARD_STORAGE_KEY, JSON.stringify(data));
          } catch {}
        }
        return data;
      }
    }
  } catch (err) {
    console.warn("Leaderboard API not reachable, computing fallback:", err);
  }

  if (typeof window !== "undefined") {
    try {
      const cached = localStorage.getItem(LEADERBOARD_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (parsed && Array.isArray(parsed.leaderboard) && parsed.leaderboard.length > 0) {
          return parsed;
        }
      }
    } catch {}
  }

  // Backend unreachable and nothing cached: show an empty board rather than
  // invented learners with made-up streaks and scores.
  return {
    leaderboard: [],
    topStreaks: [],
    topSolvers: [],
    metrics: {
      totalActiveLearners: 0,
      totalCompletedLessons: 0,
      totalChallengesSolved: 0,
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
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
  status?: string;
  createdAt: string;
}

export interface UserProfileUpdate {
  name?: string;
  phone?: string;
  avatarUrl?: string | null;
  avatarPublicId?: string | null;
}

export async function fetchMyProfile(email?: string): Promise<UserProfileDto | null> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const res = await apiFetch("/users/profile", {
      headers,
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
  dto: UserProfileUpdate,
  email?: string
): Promise<{ success: boolean; data?: UserProfileDto; error?: string }> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    const res = await apiFetch("/users/profile", {
      method: "PATCH",
      headers,
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
  source?: "submission" | "curriculum" | "sheet_log" | "individual";
  assignmentTitle?: string;
  assignmentType?: string;
  question?: string;
  studentAnswer?: string;
  options?: string[];
  correctAnswer?: string;
  isCorrect?: boolean;
  submissionFileUrl?: string;
  submissionFileName?: string;
  submittedAt?: string;
  dueDate?: string;
  status?: string;
  marks?: number;
  maxMarks?: number;
  feedback?: string;
  enrollmentDate?: string;
  courseStatus?: string;
  isRetake?: boolean;
  attemptsCount?: number;
  attempts?: Array<{
    attemptNumber: number;
    submittedAt: string;
    score?: number;
    passed?: boolean;
    answers?: any;
  }>;
  submissionDetails?: {
    score?: number;
    maxMarks?: number;
    passed?: boolean;
    minPass?: number;
    attemptCount?: number;
    isRetake?: boolean;
    questions?: Array<{
      questionIndex: number;
      prompt?: string;
      type?: string;
      choices?: string[];
      correctAnswer?: any;
      studentAnswer?: any;
      selectedChoiceText?: string;
      isCorrect?: boolean;
      earned?: number;
      max?: number;
    }>;
  };
  answersJson?: any;
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

export interface PendingEnrollmentItem {
  id: string;
  enrollmentId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  studentPhone?: string;
  studentAddress?: string;
  courseId: string;
  courseSlug: string;
  courseTitle: string;
  track?: string;
  batchTiming?: string;
  enrolledAt: string;
  couponCode?: string | null;
  discountAmount?: number;
  finalAmount?: number;
  paymentMode?: string;
  status?: string;
}

/**
 * Fetches all student course enrollments currently waiting for admin review/approval
 */
export async function fetchPendingEnrollments(): Promise<PendingEnrollmentItem[]> {
  try {
    const res = await apiFetch("/admin/enrollments/pending", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        return data;
      }
    }
  } catch (err) {
    console.warn("Failed to fetch pending enrollments:", err);
  }
  return [];
}

/**
 * Approves a pending enrollment, unlocking course access and notifying the student
 */
export async function approveEnrollment(
  enrollmentId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await apiFetch(`/admin/enrollments/${encodeURIComponent(enrollmentId)}/approve`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }

    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.message || "Failed to approve enrollment." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to approve enrollment." };
  }
}

/**
 * Rejects a pending enrollment with an optional explanation reason and notifies the student
 */
export async function rejectEnrollment(
  enrollmentId: string,
  reason?: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await apiFetch(`/admin/enrollments/${encodeURIComponent(enrollmentId)}/reject`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reason }),
    });

    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }

    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.message || "Failed to reject enrollment." };
  } catch (err: any) {
    return { success: false, error: err?.message || "Failed to reject enrollment." };
  }
}
