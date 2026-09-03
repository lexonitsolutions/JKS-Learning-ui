export interface StudentEnrollment {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  track: string;
  batchTiming: string;
  progress: number;
  completedVideosCount?: number;
  enrolledAt: string;
}

export interface AdminStudentRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
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
  completedVideosCount?: number;
  completedVideoIds?: string[];
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
}

export async function fetchAdminStudents(): Promise<AdminStudentRecord[]> {
  try {
    const res = await fetch("http://localhost:4000/admin/students", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.error("Failed to fetch admin students from backend:", err);
  }
  return [];
}

export async function fetchStudentDetail(idOrSlug: string): Promise<AdminStudentDetail | null> {
  try {
    const res = await fetch(`http://localhost:4000/admin/students/${encodeURIComponent(idOrSlug)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error(`Failed to fetch student detail for ${idOrSlug}:`, err);
  }
  return null;
}
