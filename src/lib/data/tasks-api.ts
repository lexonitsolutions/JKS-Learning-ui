import { apiFetch } from "@/lib/api/base-url";
import { getStoredCourses, syncCoursesWithBackend, type FullCourse } from "@/lib/data/courses-store";

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
  instructorScore?: number;
  feedback?: string;
  instructorFeedback?: string;
  evaluatedAt?: string;
  isRetake?: boolean;
  attemptCount?: number;
  attempts?: any[];
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
  status:
    | "PENDING"
    | "ASSIGNED"
    | "IN_PROGRESS"
    | "SUBMITTED"
    | "REVIEWED"
    | "COMPLETED"
    | "FAILED"
    | "RETRY_AVAILABLE"
    | "OVERDUE"
    | string;
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

export function normalizeTaskQuestion(q: any, fallbackIndex = 0): TaskQuestion {
  const rawType = String(q?.type || "").toUpperCase().trim();
  let taskType: TaskQuestion["type"] = "SHORT_ANSWER";
  if (rawType.includes("LONG") || rawType.includes("COMPREHENS") || rawType.includes("ESSAY")) {
    taskType = "LONG_ANSWER";
  } else if (rawType.includes("FILE") || rawType.includes("UPLOAD") || rawType.includes("PROJECT")) {
    taskType = "FILE_UPLOAD";
  } else if (rawType.includes("SHORT") || rawType.includes("TEXT") || rawType.includes("CODE")) {
    taskType = "SHORT_ANSWER";
  } else if (rawType.includes("MCQ") || rawType.includes("CHOICE")) {
    taskType = "MCQ";
  } else if (Array.isArray(q?.choices) && q.choices.length > 1) {
    taskType = "MCQ";
  }

  const isMcq = taskType === "MCQ";

  return {
    id: q?.id || `q-${Date.now()}-${fallbackIndex + 1}`,
    type: taskType,
    prompt: q?.prompt || "",
    modelAnswer: taskType === "SHORT_ANSWER" || taskType === "LONG_ANSWER" ? q?.modelAnswer || q?.solutionCode || "" : undefined,
    choices: isMcq && Array.isArray(q?.choices) && q.choices.length > 0 ? q.choices : isMcq ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
    correctAnswer: isMcq ? (typeof q?.correctAnswer === "number" ? q.correctAnswer : (typeof q?.correctIndex === "number" ? q.correctIndex : 0)) : undefined,
    maxPoints: typeof q?.maxPoints === "number" && q.maxPoints > 0 ? q.maxPoints : taskType === "LONG_ANSWER" ? 20 : taskType === "SHORT_ANSWER" ? 10 : 5,
  };
}

/**
 * Safely extracts section assignments from course curriculums and maps to ReusableAssessment format.
 */
export function extractCourseAssignments(courses: FullCourse[]): ReusableAssessment[] {
  const result: ReusableAssessment[] = [];
  const seen = new Set<string>();

  for (const course of courses || []) {
    if (!course || !Array.isArray(course.sections)) continue;
    const courseTitle = course.title || "Course Assignment";
    const courseId = course.id || course.slug;

    for (let secIdx = 0; secIdx < course.sections.length; secIdx++) {
      const sec = course.sections[secIdx];
      if (!sec || !sec.assignment) continue;
      const asg = sec.assignment;
      const title = asg.title?.trim();
      if (!title) continue;

      const dedupeKey = `${(course.slug || course.id || "").toLowerCase()}:::${title.toLowerCase()}`;
      if (seen.has(dedupeKey)) continue;
      seen.add(dedupeKey);

      // Convert questions to TaskQuestion[]
      let questions: TaskQuestion[] = Array.isArray(asg.questions) && asg.questions.length > 0
        ? asg.questions.map((q: any, qIdx: number) => normalizeTaskQuestion(q, qIdx))
        : [];

      // If assignment has no questions array, create a single question matching assignment type
      if (questions.length === 0) {
        const rawAsgType = String(asg.type || "").toUpperCase().trim();
        let fallbackType: TaskQuestion["type"] = "SHORT_ANSWER";
        if (rawAsgType.includes("LONG") || rawAsgType.includes("COMPREHENS") || rawAsgType.includes("ESSAY")) {
          fallbackType = "LONG_ANSWER";
        } else if (rawAsgType.includes("FILE") || rawAsgType.includes("UPLOAD") || rawAsgType.includes("PROJECT")) {
          fallbackType = "FILE_UPLOAD";
        } else if (rawAsgType.includes("MCQ") || rawAsgType.includes("CHOICE")) {
          fallbackType = "MCQ";
        }

        const asgAny = asg as any;
        questions = [
          {
            id: `q-${courseId}-${secIdx}-1`,
            type: fallbackType,
            prompt: asgAny.prompt || asg.title || asg.description || "",
            modelAnswer: asgAny.modelAnswer || "",
            choices: fallbackType === "MCQ" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
            correctAnswer: fallbackType === "MCQ" ? 0 : undefined,
            maxPoints: typeof asgAny.maxPoints === "number" && asgAny.maxPoints > 0 ? asgAny.maxPoints : 100,
          },
        ];
      }

      result.push({
        id: asg.id || `course-asg-${courseId}-${secIdx}`,
        title,
        description:
          asg.description?.trim() ||
          `Practical assignment for section "${sec.title || `Section ${secIdx + 1}`}" in ${courseTitle}.`,
        instructions:
          asg.modelAnswer?.trim() ||
          (asg.minPassingScore ? `Minimum passing score: ${asg.minPassingScore}%` : "Complete all questions thoroughly and submit your answers."),
        courseId,
        courseTitle,
        dueDate: undefined,
        requiredFiles: asg.type?.toLowerCase().includes("file") ? ".pdf, .zip, .java, .py, .docx" : undefined,
        questions,
        timesAssigned: 0,
        assignedStudents: [],
        createdAt: course.createdAt || new Date().toISOString(),
      });
    }
  }

  return result;
}

/**
 * Synchronous getter that immediately resolves real assignments from cached courses and local templates.
 */
export function getStoredMasterAssessments(): ReusableAssessment[] {
  if (typeof window === "undefined") return DEFAULT_MASTER_ASSESSMENTS;
  try {
    const courses = getStoredCourses();
    const courseAssessments = extractCourseAssignments(courses);
    if (courseAssessments.length > 0) {
      const map = new Map<string, ReusableAssessment>();
      courseAssessments.forEach((asm) => {
        const key = `${(asm.courseTitle || "").toLowerCase().trim()}:::${asm.title.toLowerCase().trim()}`;
        map.set(key, asm);
      });

      // Merge custom templates from localStorage
      const raw = localStorage.getItem(MASTER_ASSESSMENTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((custom: ReusableAssessment) => {
            if (!custom || !custom.title) return;
            if (custom.id === "asm-python-basics" || custom.id === "asm-java-intro") return;
            const key = `${(custom.courseTitle || "").toLowerCase().trim()}:::${custom.title.toLowerCase().trim()}`;
            if (!map.has(key)) {
              map.set(key, custom);
            }
          });
        }
      }

      const all = Array.from(map.values());
      all.sort((a, b) => {
        const courseCompare = (a.courseTitle || "").localeCompare(b.courseTitle || "");
        if (courseCompare !== 0) return courseCompare;
        return a.title.localeCompare(b.title);
      });
      return all;
    }
  } catch {}
  return DEFAULT_MASTER_ASSESSMENTS;
}

/**
 * Asynchronously fetches and aggregates all real reusable assignments from:
 * 1. Live database course curriculums
 * 2. Previously assigned tasks in the database
 * 3. Custom saved master templates
 */
export async function fetchAllReusableAssessments(): Promise<ReusableAssessment[]> {
  try {
    // 1. Sync courses with backend to ensure latest DB sections and assignments
    let courses: FullCourse[] = [];
    try {
      courses = await syncCoursesWithBackend();
    } catch {
      courses = getStoredCourses();
    }
    if (!courses || courses.length === 0) {
      courses = getStoredCourses();
    }

    // 2. Extract assignments from all courses
    const courseAssessments = extractCourseAssignments(courses);

    // 3. Fetch past admin-assigned tasks to track usage and capture any non-course standalone tasks
    let pastTasks: IndividualTask[] = [];
    try {
      pastTasks = await fetchAdminTasks();
    } catch {}

    const assignmentMap = new Map<string, ReusableAssessment>();

    // Index all course assessments first
    courseAssessments.forEach((asm) => {
      const key = `${(asm.courseTitle || "").toLowerCase().trim()}:::${asm.title.toLowerCase().trim()}`;
      assignmentMap.set(key, { ...asm });
    });

    // Cross-reference with past assigned tasks
    if (Array.isArray(pastTasks)) {
      pastTasks.forEach((t) => {
        if (!t.title) return;
        const key = `${(t.courseTitle || "").toLowerCase().trim()}:::${t.title.toLowerCase().trim()}`;
        const existing = assignmentMap.get(key);

        if (existing) {
          existing.timesAssigned = (existing.timesAssigned || 0) + 1;
          if (t.assignedStudentEmail && !existing.assignedStudents.includes(t.assignedStudentEmail)) {
            existing.assignedStudents.push(t.assignedStudentEmail);
          }
          if ((!existing.questions || existing.questions.length === 0) && t.questions && t.questions.length > 0) {
            existing.questions = t.questions.map((q, idx) => normalizeTaskQuestion(q, idx));
          }
        } else {
          // Check if it matches by title only
          let foundByTitle: ReusableAssessment | undefined;
          for (const item of assignmentMap.values()) {
            if (item.title.toLowerCase().trim() === t.title.toLowerCase().trim()) {
              foundByTitle = item;
              break;
            }
          }

          if (foundByTitle) {
            foundByTitle.timesAssigned = (foundByTitle.timesAssigned || 0) + 1;
            if (t.assignedStudentEmail && !foundByTitle.assignedStudents.includes(t.assignedStudentEmail)) {
              foundByTitle.assignedStudents.push(t.assignedStudentEmail);
            }
          } else {
            // Standalone custom task created previously
            assignmentMap.set(key, {
              id: `task-asm-${t.id}`,
              title: t.title.trim(),
              description: t.description || "",
              instructions: t.instructions,
              courseId: t.courseId,
              courseTitle: t.courseTitle || "General Track",
              dueDate: t.dueDate,
              requiredFiles: t.requiredFiles,
              questions: (t.questions || []).map((q, idx) => normalizeTaskQuestion(q, idx)),
              timesAssigned: 1,
              assignedStudents: t.assignedStudentEmail ? [t.assignedStudentEmail] : [],
              createdAt: t.createdAt || new Date().toISOString(),
            });
          }
        }
      });
    }

    // 4. Merge any custom saved templates in localStorage
    try {
      const raw = localStorage.getItem(MASTER_ASSESSMENTS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          parsed.forEach((custom: ReusableAssessment) => {
            if (!custom || !custom.title) return;
            // Exclude mock templates if real assignments exist
            if (custom.id === "asm-python-basics" || custom.id === "asm-java-intro") return;
            const key = `${(custom.courseTitle || "").toLowerCase().trim()}:::${custom.title.toLowerCase().trim()}`;
            if (!assignmentMap.has(key)) {
              assignmentMap.set(key, custom);
            }
          });
        }
      }
    } catch {}

    const all = Array.from(assignmentMap.values());
    if (all.length > 0) {
      // Sort alphabetically by course, then by title
      all.sort((a, b) => {
        const courseCompare = (a.courseTitle || "").localeCompare(b.courseTitle || "");
        if (courseCompare !== 0) return courseCompare;
        return a.title.localeCompare(b.title);
      });
      return all;
    }
  } catch (err) {
    console.warn("Failed to load aggregated reusable assessments:", err);
  }

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
  payload: { score: number; feedback: string; instructorFeedback?: string; status?: "Completed" | "Failed" | string }
): Promise<{ success: boolean; data?: IndividualTask; error?: string }> {
  try {
    const res = await apiFetch(`/admin/tasks/${encodeURIComponent(taskId)}/review`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        score: Number(payload.score),
        feedback: payload.feedback,
        instructorFeedback: payload.instructorFeedback || payload.feedback,
        status: payload.status,
      }),
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

export async function deleteAdminTask(
  taskId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await apiFetch(`/admin/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
    });
    if (res.ok) {
      return { success: true };
    }
    // Fallback to /tasks/:id and /assessments/tasks/:id
    const fallbackRes = await apiFetch(`/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
    });
    if (fallbackRes.ok) {
      return { success: true };
    }
    const fallbackRes2 = await apiFetch(`/assessments/tasks/${encodeURIComponent(taskId)}`, {
      method: "DELETE",
    });
    if (fallbackRes2.ok) {
      return { success: true };
    }
    const errData = await res.json().catch(() => ({}));
    return { success: false, error: errData.message || "Failed to delete task" };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error deleting task" };
  }
}

export function deleteStoredMasterAssessment(id: string): ReusableAssessment[] {
  const existing = getStoredMasterAssessments();
  const updated = existing.filter((a) => a.id !== id);
  try {
    localStorage.setItem(MASTER_ASSESSMENTS_KEY, JSON.stringify(updated));
  } catch {}
  return updated;
}

export async function fetchStudentAssignedTasks(studentEmail: string): Promise<IndividualTask[]> {
  try {
    // Try /tasks/student/:email and /assessments/tasks/student/:email
    let res = await apiFetch(`/tasks/student/${encodeURIComponent(studentEmail)}`, {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (!res.ok && res.status === 404) {
      res = await apiFetch(`/assessments/tasks/student/${encodeURIComponent(studentEmail)}`, {
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      });
    }
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
    score?: number;
    instructorScore?: number;
    autoScore?: number;
  }
): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    let res = await apiFetch(`/tasks/${encodeURIComponent(taskId)}/submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok && res.status === 404) {
      res = await apiFetch(`/assessments/tasks/${encodeURIComponent(taskId)}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    }
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
