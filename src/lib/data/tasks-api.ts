import { apiFetch } from "@/lib/api/base-url";

export interface TaskQuestion {
  id: string;
  type: "SHORT_ANSWER" | "LONG_ANSWER" | "MCQ" | "FILE_UPLOAD";
  prompt: string;
  modelAnswer?: string;
  choices?: string[];
  correctAnswer?: number;
  maxPoints?: number;
}

export interface TaskSubmissionData {
  submittedAt: string;
  answers: Record<string, any>;
  uploadedFileName?: string;
  uploadedFileUrl?: string;
  score?: number;
  feedback?: string;
  evaluatedAt?: string;
}

export interface IndividualTask {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  assignedStudentId?: string;
  assignedStudentEmail: string;
  dueDate?: string;
  requiredFiles?: string;
  questions?: TaskQuestion[];
  status: "PENDING" | "SUBMITTED" | "REVIEWED" | "COMPLETED" | "OVERDUE";
  submission?: TaskSubmissionData;
  createdById?: string;
  createdAt: string;
  updatedAt?: string;
}

export async function fetchAdminTasks(): Promise<IndividualTask[]> {
  try {
    const res = await apiFetch("/admin/tasks", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch admin tasks from backend:", err);
  }
  return [];
}

export async function createAdminTask(payload: {
  title: string;
  description: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  assignedStudentId?: string;
  assignedStudentEmail: string;
  assignedStudentName?: string;
  dueDate?: string;
  requiredFiles?: string;
  questions?: TaskQuestion[];
}): Promise<{ success: boolean; data?: IndividualTask; error?: string }> {
  try {
    const res = await apiFetch("/admin/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to create task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error creating task" };
  }
}

export interface StudentTarget {
  id?: string;
  email: string;
  name?: string;
}

export interface BatchAssignPayload {
  title: string;
  description: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  students: StudentTarget[];
  dueDate?: string;
  requiredFiles?: string;
  questions?: TaskQuestion[];
}

export async function batchAssignAdminTasks(
  payload: BatchAssignPayload
): Promise<{ success: boolean; count?: number; tasks?: IndividualTask[]; error?: string }> {
  try {
    const res = await apiFetch("/admin/tasks/batch-assign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const result = await res.json();
      return { success: true, count: result.count, tasks: result.tasks };
    }

    // Fallback: If batch-assign route returns 404, fall back to individual calls
    if (res.status === 404) {
      const created: IndividualTask[] = [];
      for (const st of payload.students) {
        const single = await createAdminTask({
          title: payload.title,
          description: payload.description,
          instructions: payload.instructions,
          courseId: payload.courseId,
          courseTitle: payload.courseTitle,
          assignedStudentId: st.id,
          assignedStudentEmail: st.email,
          assignedStudentName: st.name,
          dueDate: payload.dueDate,
          requiredFiles: payload.requiredFiles,
          questions: payload.questions,
        });
        if (single.success && single.data) {
          created.push(single.data);
        }
      }
      return { success: true, count: created.length, tasks: created };
    }

    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to batch assign tasks" };
  } catch (err: any) {
    // Fallback to sequential creation
    try {
      const created: IndividualTask[] = [];
      for (const st of payload.students) {
        const single = await createAdminTask({
          title: payload.title,
          description: payload.description,
          instructions: payload.instructions,
          courseId: payload.courseId,
          courseTitle: payload.courseTitle,
          assignedStudentId: st.id,
          assignedStudentEmail: st.email,
          assignedStudentName: st.name,
          dueDate: payload.dueDate,
          requiredFiles: payload.requiredFiles,
          questions: payload.questions,
        });
        if (single.success && single.data) {
          created.push(single.data);
        }
      }
      return { success: true, count: created.length, tasks: created };
    } catch (fallbackErr: any) {
      return { success: false, error: err?.message || fallbackErr?.message || "Network error batch assigning tasks" };
    }
  }
}

export interface ReusableAssessment {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  courseId?: string;
  courseTitle?: string;
  dueDate?: string;
  requiredFiles?: string;
  questions?: TaskQuestion[];
  timesAssigned: number;
  assignedStudents: string[]; // List of emails assigned to
  createdAt: string;
}

const MASTER_ASSESSMENTS_KEY = "jks_reusable_assessments_v1";

const DEFAULT_MASTER_ASSESSMENTS: ReusableAssessment[] = [
  {
    id: "asm-python-basics",
    title: "Python Basics Assessment",
    description: "Assessment covering Python core data structures, list comprehensions, dictionary operations, and function decorators.",
    instructions: "Answer all programming questions thoroughly. Provide code snippets with clear explanation of time complexity.",
    courseTitle: "Python Machine Learning",
    timesAssigned: 3,
    assignedStudents: [],
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q-py-1",
        type: "SHORT_ANSWER",
        prompt: "Explain mutable vs immutable types in Python with 2 concrete examples.",
        maxPoints: 20,
        modelAnswer: "Lists/dicts are mutable; tuples/strings are immutable.",
      },
      {
        id: "q-py-2",
        type: "LONG_ANSWER",
        prompt: "Write a Python function that uses a decorator to log execution time of any given function.",
        maxPoints: 40,
        modelAnswer: "def timer(func):\n  def wrapper(*args, **kwargs):\n    start = time.time()\n    res = func(*args, **kwargs)\n    print(time.time() - start)\n    return res\n  return wrapper",
      },
      {
        id: "q-py-3",
        type: "MCQ",
        prompt: "What is the time complexity of searching a key in a Python dictionary on average?",
        maxPoints: 40,
        choices: ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
        correctAnswer: 0,
      },
    ],
  },
  {
    id: "asm-java-intro",
    title: "Java Introduction Practical Task",
    description: "Hands-on assessment on OOP principles, Polymorphism, Abstract classes vs Interfaces in Java 21.",
    instructions: "Implement code according to clean code principles and Java naming conventions.",
    courseTitle: "Complete Java Course In Telugu | From Basics To Advanced",
    timesAssigned: 2,
    assignedStudents: [],
    createdAt: new Date().toISOString(),
    questions: [
      {
        id: "q-java-1",
        type: "SHORT_ANSWER",
        prompt: "Explain the key differences between abstract classes and interfaces in modern Java.",
        maxPoints: 50,
      },
      {
        id: "q-java-2",
        type: "LONG_ANSWER",
        prompt: "Provide an example of runtime polymorphism using Method Overriding in Java with code.",
        maxPoints: 50,
      },
    ],
  },
];

export function getStoredMasterAssessments(): ReusableAssessment[] {
  if (typeof window === "undefined") return DEFAULT_MASTER_ASSESSMENTS;
  try {
    const raw = localStorage.getItem(MASTER_ASSESSMENTS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_MASTER_ASSESSMENTS;
}

export function saveStoredMasterAssessment(assessment: Omit<ReusableAssessment, "id" | "createdAt" | "timesAssigned" | "assignedStudents">): ReusableAssessment {
  const existing = getStoredMasterAssessments();
  const foundIdx = existing.findIndex((a) => a.title.trim().toLowerCase() === assessment.title.trim().toLowerCase());
  
  const record: ReusableAssessment = {
    ...assessment,
    id: foundIdx >= 0 ? existing[foundIdx].id : `asm-${Date.now()}`,
    timesAssigned: foundIdx >= 0 ? existing[foundIdx].timesAssigned : 0,
    assignedStudents: foundIdx >= 0 ? existing[foundIdx].assignedStudents : [],
    createdAt: foundIdx >= 0 ? existing[foundIdx].createdAt : new Date().toISOString(),
  };

  let updated: ReusableAssessment[];
  if (foundIdx >= 0) {
    updated = [...existing];
    updated[foundIdx] = { ...updated[foundIdx], ...record };
  } else {
    updated = [record, ...existing];
  }

  try {
    localStorage.setItem(MASTER_ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch {}

  return record;
}

export function recordAssessmentAssigned(title: string, studentEmails: string[]) {
  const existing = getStoredMasterAssessments();
  const foundIdx = existing.findIndex((a) => a.title.trim().toLowerCase() === title.trim().toLowerCase());
  if (foundIdx >= 0) {
    const updated = [...existing];
    const prevList = updated[foundIdx].assignedStudents || [];
    const merged = Array.from(new Set([...prevList, ...studentEmails]));
    updated[foundIdx] = {
      ...updated[foundIdx],
      timesAssigned: (updated[foundIdx].timesAssigned || 0) + studentEmails.length,
      assignedStudents: merged,
    };
    try {
      localStorage.setItem(MASTER_ASSESSMENTS_KEY, JSON.stringify(updated));
    } catch {}
  }
}

export async function reviewTaskSubmission(
  taskId: string,
  payload: { score: number; feedback: string }
): Promise<{ success: boolean; data?: IndividualTask; error?: string }> {
  try {
    const res = await apiFetch(`/admin/tasks/${encodeURIComponent(taskId)}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to review task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error reviewing task" };
  }
}

export async function fetchStudentAssignedTasks(studentEmail: string): Promise<IndividualTask[]> {
  try {
    const res = await apiFetch(`/assessments/tasks/student/${encodeURIComponent(studentEmail)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch student assigned tasks:", err);
  }
  return [];
}

export async function submitStudentTask(
  taskId: string,
  payload: {
    studentEmail: string;
    answers: Record<string, any>;
    uploadedFileName?: string;
    uploadedFileUrl?: string;
  }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const res = await apiFetch(`/assessments/tasks/${encodeURIComponent(taskId)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (res.ok) {
      const data = await res.json();
      return { success: true, data };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to submit task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error submitting task" };
  }
}
