"use client";

import { useSyncExternalStore, useEffect } from "react";
import { apiUrl, apiFetch } from "@/lib/api/base-url";
import type { Track } from "./courses";
import { mapBackendTrack } from "./courses-api";
import { fetchStudentEnrollments, getClientSessionEmail } from "./enrollments-api";

export type VideoSourceType = "upload" | "url";

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
  type: "MCQ" | "Coding Challenge" | "Project Submission" | "Architectural Design";
  minPassingScore: number;
  questions?: {
    prompt: string;
    choices?: string[];
    correctIndex?: number;
  }[];
  submissionCriteria?: string[];
  completed?: boolean;
  score?: number;
  submittedAt?: string;
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
  } catch (err) {
    console.error("[courses-store] saveCourseAsync failed:", err);
  }

  return newCourse;
}

async function saveCourseToBackend(course: FullCourse): Promise<FullCourse | null> {
  const payload = {
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

  try {
    const res = await apiFetch("/courses", {
      method: "POST",
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
    }
  } catch (err) {
    console.warn("[courses-store] API call to save course failed:", err);
  }
  return null;
}

export function deleteCourse(courseIdOrSlug: string) {
  const current = getStoredCourses();
  const target = current.find((c) => c.id === courseIdOrSlug || c.slug === courseIdOrSlug);
  const updated = current.filter((c) => c.id !== courseIdOrSlug && c.slug !== courseIdOrSlug);
  safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);

  const deleteId = target?.id || courseIdOrSlug;
  apiFetch(`/courses/${encodeURIComponent(deleteId)}`, {
    method: "DELETE",
  }).catch((err) => {
    console.warn("[courses-store] Failed to delete course from DB:", err);
  });
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
          signal: AbortSignal.timeout(3000),
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
          signal: AbortSignal.timeout(3000),
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
          const slugs = Array.isArray(enrollments) ? enrollments.map((e) => e.slug) : [];
          safeLocalStorageSet(storageKey, slugs);
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
    return () => {
      isCancelled = true;
      window.removeEventListener("jks_video_progress_changed", handleProgressChange);
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


