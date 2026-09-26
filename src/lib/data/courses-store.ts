"use client";

import { useSyncExternalStore, useEffect } from "react";
import { apiUrl, apiFetch } from "@/lib/api/base-url";
import type { Track } from "./courses";
import { mapBackendTrack } from "./courses-api";
import { fetchStudentEnrollments, getClientSessionEmail } from "./enrollments-api";

export type VideoSourceType = "upload" | "url" | "gdrive" | "onedrive";

export interface VideoItem {
  id: string;
  title: string;
  durationSeconds: number;
  durationFormatted: string;
  videoType: VideoSourceType;
  videoUrl: string; // Blob URL, MP4 link, or YouTube / Vimeo private/unlisted embed URL
  order: number;
  isFreeDemo?: boolean;
  completed?: boolean;
  notes?: string;
}

export interface SubSection {
  id: string;
  title: string;
  order: number;
  description?: string;
  videos: VideoItem[];
}

export interface SectionAssignment {
  id: string;
  title: string;
  description: string;
  type: "MCQ" | "Short Answer" | "Long Answer" | "Coding Challenge" | "File Upload" | string;
  minPassingScore: number;
  modelAnswer?: string;
  questions?: {
    id?: string;
    prompt: string;
    choices?: string[];
    correctIndex?: number;
    modelAnswer?: string;
    keywords?: string;
    type?: "MCQ" | "Short Answer" | "Long Answer" | "Coding Challenge" | "File Upload" | string;
    language?: string;
    starterCode?: string;
    testCases?: string;
    structuredTestCases?: { input: string; output: string; isHidden?: boolean }[];
    solutionCode?: string;
    fileTypes?: string;
    maxFileSizeMb?: number;
    checklist?: string;
    rubric?: string;
    minWords?: number;
    maxPoints?: number;
    explanation?: string;
    guidance?: string;
  }[];
  submissionCriteria?: string[];
  completed?: boolean;
  score?: number;
  submittedAt?: string;
}

export function canonicalizeAssessmentType(raw?: string): string {
  if (!raw) return "Short Answer Question";
  const s = raw.toLowerCase().trim().replace(/[-_]+/g, " ");
  if (s.includes("mcq") || s.includes("choice") || s === "multiple choice") {
    return "Multiple Choice (MCQ)";
  }
  if (s.includes("code") || s.includes("coding")) {
    return "Coding Challenge / Test";
  }
  if (s.includes("file") || s.includes("project") || s.includes("upload")) {
    return "Project / File Upload";
  }
  if (s.includes("long") || s.includes("comprehens")) {
    return "Long Answer / Comprehensive";
  }
  if (s.includes("short")) {
    return "Short Answer Question";
  }
  return "Short Answer Question";
}

/** The five question kinds the course builder can author. */
export type AssessmentKind = "MCQ" | "SHORT_ANSWER" | "LONG_ANSWER" | "CODING" | "FILE_UPLOAD";

/**
 * Resolve a question's kind from the human-readable label or internal key the builder stores.
 */
export function resolveAssessmentKind(raw?: string, fallback?: string): AssessmentKind {
  const s = (raw || fallback || "").toLowerCase().replace(/[-_]+/g, " ").trim();
  if (s.includes("mcq") || s.includes("choice")) return "MCQ";
  if (s.includes("file") || s.includes("project") || s.includes("upload")) return "FILE_UPLOAD";
  if (s.includes("cod")) return "CODING";
  if (s.includes("long") || s.includes("comprehens")) return "LONG_ANSWER";
  if (s.includes("short")) return "SHORT_ANSWER";
  return "SHORT_ANSWER";
}

/** Short badge label for a question kind. */
export function assessmentKindLabel(kind: AssessmentKind): string {
  switch (kind) {
    case "MCQ":
      return "Multiple Choice";
    case "SHORT_ANSWER":
      return "Short Answer";
    case "LONG_ANSWER":
      return "Long Answer";
    case "CODING":
      return "Coding Challenge";
    case "FILE_UPLOAD":
      return "File Upload";
  }
}

export interface Section {
  id: string;
  title: string;
  order: number;
  description: string;
  subsections?: SubSection[];
  directVideos?: VideoItem[];
  assignment: SectionAssignment;
}

export interface FullCourse {
  id: string;
  slug: string;
  title: string;
  track: Track;
  level: "Beginner" | "Intermediate" | "Advanced";
  durationWeeks: number;
  price: number;
  rating: number;
  studentsEnrolled: number;
  summary: string;
  thumbnail?: string;
  sections: Section[];
  createdAt: string;
  status: "Published" | "Draft";
}

export interface StudentCourseProgress {
  courseSlug: string;
  enrolledAt: string;
  completedVideoIds: string[];
  completedAssignmentIds: string[];
  assignmentScores: Record<string, number>;
  lastPlayedVideoId?: string;
  overallPercent: number;
}
// Live DB courses store - empty by default to reflect real backend data only
const INITIAL_COURSES: FullCourse[] = [];

const STORAGE_KEYS = {
  COURSES: "jks_courses_catalog_v4",
  ENROLLMENTS: "jks_student_enrollments_v2",
};

const STORE_EVENT = "jks-courses-store-change";

function safeLocalStorageGet<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeLocalStorageSet(key: string, value: unknown) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event(STORE_EVENT));
  } catch (err) {
    console.error("Failed to write to localStorage:", err);
  }
}

// Default student owned courses (empty by default for real authentication)
const DEFAULT_ENROLLED_SLUGS: string[] = [];


export function getStoredCourses(): FullCourse[] {
  return safeLocalStorageGet<FullCourse[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
}

/**
 * Save course locally and asynchronously push to MongoDB Atlas backend.
 */
export function saveCourse(newCourse: FullCourse): FullCourse {
  const current = getStoredCourses();
  const index = current.findIndex((c) => c.id === newCourse.id || c.slug === newCourse.slug);
  let updated: FullCourse[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = newCourse;
  } else {
    updated = [newCourse, ...current];
  }
  safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);

  // Background sync to MongoDB Atlas
  saveCourseToBackend(newCourse).catch((err) => {
    console.warn("[courses-store] Background save to backend failed:", err);
  });

  return newCourse;
}

/**
 * Save course with direct await on MongoDB Atlas API response.
 */
export async function saveCourseAsync(newCourse: FullCourse): Promise<FullCourse> {
  const current = getStoredCourses();
  const index = current.findIndex((c) => c.id === newCourse.id || c.slug === newCourse.slug);
  let updated: FullCourse[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = newCourse;
  } else {
    updated = [newCourse, ...current];
  }
  safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);

  try {
    const saved = await saveCourseToBackend(newCourse);
    if (saved) {
      const refreshed = getStoredCourses();
      const rIndex = refreshed.findIndex((c) => c.slug === newCourse.slug || c.id === newCourse.id);
      if (rIndex >= 0) {
        refreshed[rIndex] = saved;
        safeLocalStorageSet(STORAGE_KEYS.COURSES, refreshed);
      }
      return saved;
    }
    // The write never reached the database. Reporting success here is what
    // let an admin edit an assignment, see it in their own workspace (served
    // from this localStorage copy) and have no idea students were still being
    // served the previous version from the database.
    throw new Error(
      lastSaveError ||
        "Course could not be saved to the database. Your changes are only in this browser — please try again."
    );
  } catch (err: any) {
    console.error("[courses-store] saveCourseAsync failed:", err);
    throw err instanceof Error
      ? err
      : new Error("Course could not be saved to the database. Please try again.");
  }
}

/** Why the last backend save failed, so the caller can surface a real reason. */
let lastSaveError: string | null = null;

async function saveCourseToBackend(course: FullCourse): Promise<FullCourse | null> {
  lastSaveError = null;
  const existingList = getStoredCourses();
  const existing = existingList.find((c) => (course.id && c.id === course.id) || (course.slug && c.slug === course.slug));
  const isUpdate = Boolean(existing || course.id);
  const targetId = course.id || existing?.id || course.slug;

  const payload: any = {
    title: course.title,
    slug: course.slug,
    track: course.track,
    level: course.level,
    durationWeeks: course.durationWeeks,
    priceCents: Math.round(course.price * 100),
    price: course.price,
    rating: course.rating,
    studentsEnrolled: course.studentsEnrolled,
    summary: course.summary,
    thumbnail: course.thumbnail,
    status: course.status.toUpperCase(),
    sections: course.sections,
    sectionsJson: course.sections,
  };

  if (!isUpdate && course.id) {
    payload.id = course.id;
  }

  const endpoint = isUpdate ? `/courses/${encodeURIComponent(targetId)}` : "/courses";
  const method = isUpdate ? "PATCH" : "POST";

  try {
    const res = await apiFetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const dbCourse = await res.json();
      const track = mapBackendTrack(dbCourse.track);
      const price = dbCourse.priceCents ? Math.round(dbCourse.priceCents / 100) : course.price;
      return {
        id: dbCourse.id || course.id,
        slug: dbCourse.slug || course.slug,
        title: dbCourse.title || course.title,
        track,
        level: dbCourse.level || course.level,
        durationWeeks: dbCourse.durationWeeks || course.durationWeeks,
        price,
        rating: dbCourse.rating || course.rating,
        studentsEnrolled: dbCourse.studentsEnrolled || course.studentsEnrolled,
        summary: dbCourse.summary || course.summary,
        thumbnail: dbCourse.thumbnail || course.thumbnail,
        createdAt: dbCourse.createdAt || course.createdAt,
        status: (dbCourse.status === "PUBLISHED" || dbCourse.status === "Published" ? "Published" : "Draft") as "Published" | "Draft",
        sections: (Array.isArray(dbCourse.sectionsJson) && dbCourse.sectionsJson.length > 0)
          ? dbCourse.sectionsJson
          : course.sections,
      };
    } else {
      const errText = await res.text();
      console.error("[courses-store] API save failed:", res.status, errText);
      lastSaveError =
        res.status === 401 || res.status === 403
          ? "You are not signed in with an account allowed to edit courses. Please sign in again and retry."
          : `The server rejected the save (HTTP ${res.status}). ${errText.slice(0, 200)}`;
    }
  } catch (err: any) {
    console.warn("[courses-store] API call to save course failed:", err);
    lastSaveError = err?.message || "Could not reach the API to save this course.";
  }
  return null;
}

/**
 * Toggle or update course publication status (Published <-> Draft) directly via PATCH /courses/:id
 */
export async function toggleCourseStatus(
  courseIdOrSlug: string,
  targetStatus?: "Published" | "Draft"
): Promise<FullCourse> {
  const current = getStoredCourses();
  const existing = current.find((c) => c.id === courseIdOrSlug || c.slug === courseIdOrSlug);
  if (!existing) {
    throw new Error("Course not found in local catalog.");
  }
  const nextStatus = targetStatus || (existing.status === "Published" ? "Draft" : "Published");
  const targetId = existing.id || existing.slug || courseIdOrSlug;

  const res = await apiFetch(`/courses/${encodeURIComponent(targetId)}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ status: nextStatus.toUpperCase() }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(`Failed to update course status: ${errText || res.statusText}`);
  }

  const updatedCourse: FullCourse = {
    ...existing,
    status: nextStatus,
  };

  const updatedList = current.map((c) =>
    c.id === existing.id || c.slug === existing.slug ? updatedCourse : c
  );
  safeLocalStorageSet(STORAGE_KEYS.COURSES, updatedList);

  return updatedCourse;
}

/**
 * Delete a course from the database, then from the local catalog.
 *
 * The local removal used to happen first with the API call fire-and-forget, so
 * a rejected delete (a course that still holds enrolments, say) made the
 * course vanish from the admin's screen while it stayed live for students.
 * Nothing is removed locally now unless the database accepted the delete.
 */
export async function deleteCourse(courseIdOrSlug: string): Promise<void> {
  const current = getStoredCourses();
  const target = current.find((c) => c.id === courseIdOrSlug || c.slug === courseIdOrSlug);
  const deleteId = target?.id || courseIdOrSlug;

  let res: Response;
  try {
    res = await apiFetch(`/courses/${encodeURIComponent(deleteId)}`, {
      method: "DELETE",
    });
  } catch (err: any) {
    console.warn("[courses-store] Failed to delete course from DB:", err);
    throw new Error(err?.message || "Could not reach the API to delete this course.");
  }

  if (!res.ok) {
    let message = `The server refused the delete (HTTP ${res.status}).`;
    try {
      const body = await res.json();
      if (body?.message) message = Array.isArray(body.message) ? body.message.join(" ") : body.message;
    } catch {}
    throw new Error(message);
  }

  safeLocalStorageSet(
    STORAGE_KEYS.COURSES,
    current.filter((c) => c.id !== courseIdOrSlug && c.slug !== courseIdOrSlug)
  );
}

export function getStudentEnrollmentStorageKey(email?: string): string {
  const effectiveEmail = (email || getClientSessionEmail() || "").toLowerCase().trim();
  return effectiveEmail ? `jks_student_enrollments_${effectiveEmail}` : "jks_student_enrollments_guest";
}

export function getStudentOwnedSlugs(email?: string): string[] {
  const key = getStudentEnrollmentStorageKey(email);
  return safeLocalStorageGet<string[]>(key, DEFAULT_ENROLLED_SLUGS);
}

export function enrollStudentCourse(slug: string, email?: string): string[] {
  const key = getStudentEnrollmentStorageKey(email);
  const current = getStudentOwnedSlugs(email);
  if (!current.includes(slug)) {
    const updated = [...current, slug];
    safeLocalStorageSet(key, updated);
    return updated;
  }
  return current;
}

export function unenrollStudentCourse(slug: string, email?: string): string[] {
  const key = getStudentEnrollmentStorageKey(email);
  const current = getStudentOwnedSlugs(email);
  const updated = current.filter((s) => s !== slug);
  safeLocalStorageSet(key, updated);
  return updated;
}

// Subscribe helper for React Hook
function subscribe(callback: () => void) {
  window.addEventListener(STORE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(STORE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

let cachedCoursesSnapshot: FullCourse[] | null = null;
let cachedCoursesRaw: string | null = null;

function getCoursesSnapshot(): FullCourse[] {
  if (typeof window === "undefined") return INITIAL_COURSES;
  const raw = localStorage.getItem(STORAGE_KEYS.COURSES);
  if (raw !== cachedCoursesRaw) {
    cachedCoursesRaw = raw;
    cachedCoursesSnapshot = raw ? JSON.parse(raw) : INITIAL_COURSES;
  }
  return cachedCoursesSnapshot ?? INITIAL_COURSES;
}

let cachedEnrollmentsSnapshot: string[] | null = null;
let cachedEnrollmentsRaw: string | null = null;

function getEnrollmentsSnapshot(): string[] {
  if (typeof window === "undefined") return DEFAULT_ENROLLED_SLUGS;
  const raw = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
  if (raw !== cachedEnrollmentsRaw) {
    cachedEnrollmentsRaw = raw;
    cachedEnrollmentsSnapshot = raw ? JSON.parse(raw) : DEFAULT_ENROLLED_SLUGS;
  }
  return cachedEnrollmentsSnapshot ?? DEFAULT_ENROLLED_SLUGS;
}

/**
 * Synchronize courses store with live backend API (MongoDB Atlas DB).
 * Reflects course removals, updates, and creations immediately in the UI.
 */
export async function syncCoursesWithBackend(): Promise<FullCourse[]> {
  if (typeof window === "undefined") return getStoredCourses();
  try {
    let res: Response | null = null;

    // Only staff accounts (Admin / Instructor) need to query /courses/all for drafts
    let isStaff = false;
    try {
      const authUserRaw = localStorage.getItem("jks_auth_user");
      if (authUserRaw) {
        const authUser = JSON.parse(authUserRaw);
        if (authUser?.role === "admin" || authUser?.role === "instructor") {
          isStaff = true;
        }
      }
    } catch {}

    if (isStaff) {
      try {
        res = await apiFetch("/courses/all", {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(12000),
        });
      } catch {
        // ignore
      }
    }

    if (!res || !res.ok) {
      try {
        res = await apiFetch("/courses", {
          cache: "no-store",
          headers: { Accept: "application/json" },
          signal: AbortSignal.timeout(12000),
        });
      } catch {
        // ignore
      }
    }

    if (res && res.ok) {
      const dbCourses: any[] = await res.json();
      if (Array.isArray(dbCourses)) {
        const current = getStoredCourses();

        // Build course catalog directly from live DB courses.
        const updated: FullCourse[] = dbCourses.map((dbc) => {
          const existing = current.find((c) => c.slug === dbc.slug || c.id === dbc.id);
          const track = mapBackendTrack(dbc.track);
          const price = dbc.priceCents ? Math.round(dbc.priceCents / 100) : 24999;

          // Preserve rich section materials if matching sectionsJson or build from modules
          let sections: Section[] = [];
          if (Array.isArray(dbc.sectionsJson) && dbc.sectionsJson.length > 0) {
            sections = dbc.sectionsJson;
          } else if (existing?.sections && existing.sections.length > 0) {
            sections = existing.sections;
          } else if (Array.isArray(dbc.modules) && dbc.modules.length > 0) {
            sections = dbc.modules.map((m: any, idx: number) => {
              const subsections: SubSection[] = (m.topics || []).map((t: any, tIdx: number) => ({
                id: `sub-${t.id || tIdx}`,
                title: t.title || `Topic ${tIdx + 1}`,
                order: t.order || tIdx + 1,
                description: t.description || "",
                videos: (t.videos || []).map((v: any, vIdx: number) => ({
                  id: `v-${v.id || vIdx}`,
                  title: v.title || `Video ${vIdx + 1}`,
                  durationSeconds: v.durationSeconds || 300,
                  durationFormatted: v.durationFormatted || "5:00",
                  videoType: (v.videoType as any) || "url",
                  videoUrl: v.videoUrl || v.providerAssetId || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                  order: v.order || vIdx + 1,
                  isFreeDemo: Boolean(v.isFreeDemo),
                  notes: v.notes || "",
                })),
              }));

              return {
                id: `sec-${m.id || idx}`,
                title: m.title || `Module ${idx + 1}`,
                order: m.order || idx + 1,
                description: m.description || `Curriculum module for ${dbc.title}`,
                subsections,
                assignment: {
                  id: `asg-${m.id || idx}`,
                  title: `${m.title || "Module"} Practical Assessment`,
                  description: `Hands-on assessment and evaluation for ${m.title || "Module"}.`,
                  type: "Project Submission" as const,
                  minPassingScore: 70,
                },
              };
            });
          }

          return {
            id: dbc.id || existing?.id || `crs-${dbc.slug}`,
            slug: dbc.slug,
            title: dbc.title,
            track,
            level: dbc.level || existing?.level || "Intermediate",
            durationWeeks: dbc.durationWeeks || existing?.durationWeeks || 12,
            price,
            rating: typeof dbc.rating === "number" ? dbc.rating : existing?.rating || 5.0,
            studentsEnrolled: typeof dbc.studentsEnrolled === "number" ? dbc.studentsEnrolled : existing?.studentsEnrolled || 0,
            summary: dbc.summary || existing?.summary || "",
            thumbnail: dbc.thumbnail || existing?.thumbnail || "",
            createdAt: dbc.createdAt || existing?.createdAt || new Date().toISOString(),
            status: (dbc.status === "PUBLISHED" || dbc.status === "Published" ? "Published" : "Draft") as "Published" | "Draft",
            sections,
          };
        });

        safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);
        return updated;
      }
    }
  } catch (err) {
    console.warn("[courses-store] Live DB sync skipped:", err);
  }
  return getStoredCourses();
}

export function useAllCourses(): FullCourse[] {
  useEffect(() => {
    syncCoursesWithBackend().catch(() => {});
    const handleFocus = () => {
      syncCoursesWithBackend().catch(() => {});
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("visibilitychange", handleFocus);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("visibilitychange", handleFocus);
    };
  }, []);

  return useSyncExternalStore(subscribe, getCoursesSnapshot, () => INITIAL_COURSES);
}

const enrollmentsSnapshotCache: Record<string, { raw: string | null; slugs: string[] }> = {};

function getStudentEnrollmentsSnapshot(storageKey: string): string[] {
  if (typeof window === "undefined") return DEFAULT_ENROLLED_SLUGS;
  const raw = localStorage.getItem(storageKey);
  if (!raw) {
    if (enrollmentsSnapshotCache[storageKey] && enrollmentsSnapshotCache[storageKey].raw === null) {
      return enrollmentsSnapshotCache[storageKey].slugs;
    }
    enrollmentsSnapshotCache[storageKey] = { raw: null, slugs: DEFAULT_ENROLLED_SLUGS };
    return DEFAULT_ENROLLED_SLUGS;
  }
  if (enrollmentsSnapshotCache[storageKey] && enrollmentsSnapshotCache[storageKey].raw === raw) {
    return enrollmentsSnapshotCache[storageKey].slugs;
  }
  try {
    const slugs = JSON.parse(raw) as string[];
    enrollmentsSnapshotCache[storageKey] = { raw, slugs };
    return slugs;
  } catch {
    return DEFAULT_ENROLLED_SLUGS;
  }
}

export function useStudentOwnedCourses(userEmail?: string): FullCourse[] {
  const allCourses = useAllCourses();
  const effectiveEmail = (userEmail || getClientSessionEmail() || "").toLowerCase().trim();
  const storageKey = getStudentEnrollmentStorageKey(effectiveEmail);

  useEffect(() => {
    let isCancelled = false;
    async function syncEnrollments() {
      if (!effectiveEmail) return;
      try {
        const enrollments = await fetchStudentEnrollments(effectiveEmail);
        if (!isCancelled) {
          const activeEnrollments = Array.isArray(enrollments)
            ? enrollments.filter((e) => e.status !== "REMOVED")
            : [];
          const slugs = activeEnrollments.map((e) => e.slug).filter(Boolean);
          if (Array.isArray(enrollments)) {
            safeLocalStorageSet(storageKey, slugs);
          }
        }
      } catch (err) {
        console.warn("[courses-store] Failed to sync student enrollments:", err);
      }
    }
    syncEnrollments();
    const handleProgressChange = () => {
      syncEnrollments();
    };
    window.addEventListener("jks_video_progress_changed", handleProgressChange);
    window.addEventListener("focus", handleProgressChange);
    return () => {
      isCancelled = true;
      window.removeEventListener("jks_video_progress_changed", handleProgressChange);
      window.removeEventListener("focus", handleProgressChange);
    };
  }, [effectiveEmail, storageKey]);

  const ownedSlugs = useSyncExternalStore(
    subscribe,
    () => getStudentEnrollmentsSnapshot(storageKey),
    () => DEFAULT_ENROLLED_SLUGS
  );
  return allCourses.filter((course) => ownedSlugs.includes(course.slug));
}

export function getFullCourseBySlug(slug: string): FullCourse | undefined {
  const courses = getStoredCourses();
  return courses.find((c) => c.slug === slug);
}



/**
 * Normalize a raw backend course document into the shape the UI renders.
 *
 * `sectionsJson` is the single source of truth for curriculum and assignment
 * content — the relational `modules` tree is rebuilt from it on every save and
 * carries no assignment data, so it is only used as a last-resort skeleton.
 */
export function normalizeDbCourse(dbCourse: any, existing?: FullCourse): FullCourse {
  const rawSections = Array.isArray(dbCourse?.sectionsJson)
    ? dbCourse.sectionsJson
    : Array.isArray(dbCourse?.sections)
    ? dbCourse.sections
    : [];

  const sections: Section[] = rawSections.map((sec: any, idx: number) => ({
    id: sec.id || `sec-${idx + 1}`,
    title: sec.title || "",
    order: sec.order || idx + 1,
    description: sec.description || "",
    subsections: Array.isArray(sec.subsections) ? sec.subsections : [],
    directVideos: Array.isArray(sec.directVideos) ? sec.directVideos : [],
    assignment: {
      id: sec.assignment?.id || `asg-${idx + 1}`,
      title: sec.assignment?.title || "",
      description: sec.assignment?.description || "",
      type: canonicalizeAssessmentType(sec.assignment?.type),
      minPassingScore:
        typeof sec.assignment?.minPassingScore === "number" ? sec.assignment.minPassingScore : 70,
      modelAnswer: sec.assignment?.modelAnswer || "",
      questions: Array.isArray(sec.assignment?.questions)
        ? sec.assignment.questions.map((q: any, qIdx: number) => ({
            id: q.id || `q-${qIdx + 1}`,
            prompt: q.prompt || "",
            type: canonicalizeAssessmentType(q.type || sec.assignment?.type),
            choices: Array.isArray(q.choices) ? q.choices : [],
            correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
            modelAnswer: q.modelAnswer || "",
            keywords: q.keywords || "",
            language: q.language || "JavaScript",
            starterCode: q.starterCode || "",
            testCases: q.testCases || "",
            structuredTestCases: Array.isArray(q.structuredTestCases) ? q.structuredTestCases : [],
            solutionCode: q.solutionCode || "",
            fileTypes: q.fileTypes || "",
            maxFileSizeMb: typeof q.maxFileSizeMb === "number" ? q.maxFileSizeMb : 25,
            checklist: q.checklist || "",
            rubric: q.rubric || "",
            minWords: q.minWords,
            maxPoints: typeof q.maxPoints === "number" ? q.maxPoints : 10,
            explanation: q.explanation || "",
            guidance: q.guidance || "",
          }))
        : [],
    },
  }));

  const price = dbCourse?.priceCents
    ? Math.round(dbCourse.priceCents / 100)
    : typeof dbCourse?.price === "number"
    ? dbCourse.price
    : existing?.price || 0;

  return {
    id: dbCourse?.id || existing?.id || `crs-${dbCourse?.slug}`,
    slug: dbCourse?.slug || existing?.slug || "",
    title: dbCourse?.title || existing?.title || "",
    track: mapBackendTrack(dbCourse?.track),
    level: dbCourse?.level || existing?.level || "Intermediate",
    durationWeeks: dbCourse?.durationWeeks || existing?.durationWeeks || 12,
    price,
    rating: typeof dbCourse?.rating === "number" ? dbCourse.rating : existing?.rating || 5.0,
    studentsEnrolled:
      typeof dbCourse?.studentsEnrolled === "number"
        ? dbCourse.studentsEnrolled
        : existing?.studentsEnrolled || 0,
    summary: dbCourse?.summary || existing?.summary || "",
    thumbnail: dbCourse?.thumbnail || existing?.thumbnail || "",
    sections: sections.length > 0 ? sections : existing?.sections || [],
    createdAt: dbCourse?.createdAt || existing?.createdAt || new Date().toISOString(),
    status: (dbCourse?.status === "PUBLISHED" || dbCourse?.status === "Published"
      ? "Published"
      : "Draft") as "Published" | "Draft",
  };
}

/**
 * Write a course into the local catalog WITHOUT pushing it back to the API.
 *
 * `saveCourse` is a staff action — it POSTs to /courses, which students are not
 * allowed to do. Refreshing a student's cached copy of a course must never make
 * that write, otherwise every course page view fires a rejected request.
 */
export function cacheCourseLocally(course: FullCourse): FullCourse {
  const current = getStoredCourses();
  const index = current.findIndex((c) => c.id === course.id || c.slug === course.slug);
  const updated = index >= 0 ? [...current] : [course, ...current];
  if (index >= 0) updated[index] = course;
  safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);
  return course;
}

/**
 * Read one course straight from the database and refresh the local cache.
 *
 * Enrolled students were reading curriculum out of localStorage, so an
 * assignment an admin edited afterwards kept rendering with its old title,
 * type and questions until the cache happened to be rebuilt. Every student
 * surface that shows assignment content goes through here instead.
 */
export async function fetchLiveCourseBySlug(slug: string): Promise<FullCourse | null> {
  if (!slug) return null;
  try {
    const res = await apiFetch(`/courses/${encodeURIComponent(slug)}`, {
      cache: "no-store",
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    const dbCourse = await res.json();
    if (!dbCourse?.slug && !dbCourse?.id) return null;
    const normalized = normalizeDbCourse(dbCourse, getFullCourseBySlug(slug));
    cacheCourseLocally(normalized);
    return normalized;
  } catch (err) {
    console.warn("[courses-store] Live course fetch failed for", slug, err);
    return null;
  }
}
