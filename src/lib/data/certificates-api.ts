import { apiFetch } from "@/lib/api/base-url";

export interface AdminCertificateItem {
  id: string;
  verificationId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  issuedAt: string;
  status: string;
  grade: string;
}

export async function fetchAdminCertificates(): Promise<AdminCertificateItem[]> {
  try {
    const res = await apiFetch("/admin/certificates", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch admin certificates:", err);
  }
  return [];
}

export interface PendingCompletionItem {
  enrollmentId: string;
  userId: string;
  studentName: string;
  studentEmail: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  track: string;
  completedLectures: number;
  requestedAt: string;
  status: string;
  completionApproved: boolean;
}

export async function fetchPendingCompletions(): Promise<PendingCompletionItem[]> {
  try {
    const res = await apiFetch("/admin/completion-requests", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch pending course completions:", err);
  }
  return [];
}

export async function approveCourseCompletion(
  enrollmentId: string
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await apiFetch(`/admin/enrollments/${encodeURIComponent(enrollmentId)}/approve-completion`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.message || "Failed to approve completion" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function issueCertificateByAdmin(
  userId: string,
  courseId: string
): Promise<{ success: boolean; certificate?: any; error?: string }> {
  try {
    const res = await apiFetch("/admin/certificates/issue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, courseId }),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, certificate: data };
    }
    const err = await res.json().catch(() => ({}));
    return { success: false, error: err.message || "Failed to issue certificate" };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
