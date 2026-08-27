"use client";

import { useSyncExternalStore } from "react";
import type { Track } from "./courses";

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

// Initial Seed Courses with Sections, Subsections, Videos and Section Assignments
const INITIAL_COURSES: FullCourse[] = [
  {
    id: "crs-java-fullstack",
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Developer Mastery",
    track: "Full Stack",
    level: "Intermediate",
    durationWeeks: 16,
    price: 24999,
    rating: 4.8,
    studentsEnrolled: 2140,
    summary:
      "Core Java, Spring Boot, REST APIs, React, and production deployment — built around real enterprise project work.",
    createdAt: "2026-06-01T00:00:00Z",
    status: "Published",
    sections: [
      {
        id: "sec-1",
        title: "Section 1: Enterprise Java Foundations & Core Architecture",
        order: 1,
        description: "Master modern Java 21 features, memory layout, OOP patterns, and multithreading.",
        subsections: [
          {
            id: "sub-1-1",
            title: "Subsection 1.1: Language Internals & JVM",
            order: 1,
            videos: [
              {
                id: "v-1",
                title: "01. JVM Architecture, Garbage Collection & Memory Model",
                durationSeconds: 180,
                durationFormatted: "3:00",
                videoType: "url",
                videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                order: 1,
                isFreeDemo: true,
                completed: true,
              },
              {
                id: "v-2",
                title: "02. Modern Java 21 Features: Records, Virtual Threads & Pattern Matching",
                durationSeconds: 240,
                durationFormatted: "4:00",
                videoType: "url",
                videoUrl: "https://www.youtube.com/watch?v=k1BneeJTDcU",
                order: 2,
                completed: true,
              },
            ],
          },
          {
            id: "sub-1-2",
            title: "Subsection 1.2: Concurrency & Asynchronous Streams",
            order: 2,
            videos: [
              {
                id: "v-3",
                title: "03. CompletableFuture, Reactive Streams & Thread Safety",
                durationSeconds: 210,
                durationFormatted: "3:30",
                videoType: "url",
                videoUrl: "https://www.youtube.com/watch?v=28aEWu_yV_c",
                order: 3,
                completed: false,
              },
            ],
          },
        ],
        assignment: {
          id: "asg-1",
          title: "Section 1 Assessment: High-Performance Concurrent Java",
          description: "Build a lock-free thread-safe cache using concurrent collections and virtual threads.",
          type: "Coding Challenge",
          minPassingScore: 75,
          questions: [
            {
              prompt: "Which Java 21 feature allows lightweight thread scheduling on top of carrier OS threads?",
              choices: [
                "Virtual Threads (Project Loom)",
                "ForkJoinPool Executors",
                "Reactive Mono Publisher",
                "ThreadLocal Context",
              ],
              correctIndex: 0,
            },
            {
              prompt: "What is the primary advantage of Record patterns in modern Java switch statements?",
              choices: [
                "Deconstruct record components directly with type safety",
                "Automatically implement serialization without reflection",
                "Allocate records on the native stack",
                "Bypass garbage collection cycles",
              ],
              correctIndex: 0,
            },
          ],
          completed: true,
          score: 95,
        },
      },
      {
        id: "sec-2",
        title: "Section 2: Spring Boot 3 & Microservice API Engineering",
        order: 2,
        description: "Design and implement production-ready REST services with Spring Data JPA and Security.",
        directVideos: [
          {
            id: "v-4",
            title: "04. Spring Boot 3 Core: Dependency Injection & Auto-Configuration",
            durationSeconds: 260,
            durationFormatted: "4:20",
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=9SGDpanrc8U",
            order: 1,
            completed: false,
          },
          {
            id: "v-5",
            title: "05. Designing Resilient Microservices with Resilience4j & OpenFeign",
            durationSeconds: 300,
            durationFormatted: "5:00",
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=gq4S-ovwvL0",
            order: 2,
            completed: false,
          },
        ],
        assignment: {
          id: "asg-2",
          title: "Section 2 Assessment: Spring Boot Microservices API",
          description: "Implement a rate-limited REST API with JWT authentication and circuit breakers.",
          type: "Project Submission",
          minPassingScore: 80,
          submissionCriteria: [
            "REST endpoint with HTTP 201/400/401/404 standard responses",
            "Spring Security stateless JWT filter verification",
            "Resilience4j CircuitBreaker fallback implementation",
          ],
          completed: false,
        },
      },
      {
        id: "sec-3",
        title: "Section 3: Production Cloud & Kubernetes Capstone",
        order: 3,
        description: "Deploy multi-tier containerized architectures to cloud infrastructure with CI/CD.",
        directVideos: [
          {
            id: "v-6",
            title: "06. Docker Multi-Stage Builds & Kubernetes Pod Orchestration",
            durationSeconds: 320,
            durationFormatted: "5:20",
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=X48VuDVv0do",
            order: 1,
            completed: false,
          },
        ],
        assignment: {
          id: "asg-3",
          title: "Section 3 Capstone: Enterprise Production Deployment",
          description: "Submit GitHub repository and live deployment URL for the microservices cluster.",
          type: "Project Submission",
          minPassingScore: 85,
          completed: false,
        },
      },
    ],
  },
  {
    id: "crs-react-frontend",
    slug: "modern-frontend-engineering",
    title: "Modern Frontend Engineering with React",
    track: "Frontend",
    level: "Beginner",
    durationWeeks: 10,
    price: 15999,
    rating: 4.9,
    studentsEnrolled: 3020,
    summary: "HTML/CSS/JS fundamentals through advanced React, TypeScript, and performance optimization.",
    createdAt: "2026-07-01T00:00:00Z",
    status: "Published",
    sections: [
      {
        id: "sec-react-1",
        title: "Section 1: Modern JavaScript & TypeScript Foundations",
        order: 1,
        description: "ESNext syntax, asynchronous promises, and TypeScript generics.",
        directVideos: [
          {
            id: "v-r1",
            title: "01. TypeScript Deep Dive: Generics, Discriminated Unions & Utility Types",
            durationSeconds: 200,
            durationFormatted: "3:20",
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=BCg4U1FzODs",
            order: 1,
            isFreeDemo: true,
            completed: true,
          },
        ],
        assignment: {
          id: "asg-r1",
          title: "Section 1 Assessment: TypeScript Type Safety Challenge",
          description: "Solve 5 advanced TypeScript utility type puzzles.",
          type: "MCQ",
          minPassingScore: 80,
          questions: [
            {
              prompt: "Which TypeScript utility type constructs a type with all properties of T set to optional?",
              choices: ["Partial<T>", "Required<T>", "Record<K,T>", "Readonly<T>"],
              correctIndex: 0,
            },
          ],
          completed: false,
        },
      },
      {
        id: "sec-react-2",
        title: "Section 2: React 19 Architecture & State",
        order: 2,
        description: "Server Actions, hooks, memoization, and custom hooks.",
        directVideos: [
          {
            id: "v-r2",
            title: "02. React 19 Compiler, Actions, and optimistic state updates",
            durationSeconds: 280,
            durationFormatted: "4:40",
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=w7ejDZ8SWv8",
            order: 1,
            completed: false,
          },
        ],
        assignment: {
          id: "asg-r2",
          title: "Section 2 Assessment: Real-Time Kanban Dashboard",
          description: "Build an interactive optimistic UI board with drag-and-drop state.",
          type: "Coding Challenge",
          minPassingScore: 75,
          completed: false,
        },
      },
    ],
  },
  {
    id: "crs-sap-abap",
    slug: "sap-abap-professional",
    title: "SAP ABAP Professional Track",
    track: "SAP",
    level: "Intermediate",
    durationWeeks: 12,
    price: 28999,
    rating: 4.6,
    studentsEnrolled: 860,
    summary: "ABAP programming, module pool, RICEFW objects, and S/4HANA extensibility for enterprise consulting roles.",
    createdAt: "2026-08-01T00:00:00Z",
    status: "Published",
    sections: [
      {
        id: "sec-sap-1",
        title: "Section 1: ABAP Core Data Dictionary & Modularization",
        order: 1,
        description: "Data elements, domains, structures, transparent tables, and function modules.",
        directVideos: [
          {
            id: "v-s1",
            title: "01. SAP Architecture & Data Dictionary Mastery",
            durationSeconds: 220,
            durationFormatted: "3:40",
            videoType: "url",
            videoUrl: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            order: 1,
            isFreeDemo: true,
            completed: false,
          },
        ],
        assignment: {
          id: "asg-s1",
          title: "Section 1 Assessment: SAP Data Dictionary Design",
          description: "Create a complete schema for Purchase Order header and item tables.",
          type: "MCQ",
          minPassingScore: 75,
          completed: false,
        },
      },
    ],
  },
];

const STORAGE_KEYS = {
  COURSES: "jks_courses_catalog_v2",
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

// Initial student owned courses (default student enrolled in Java Full Stack & React Frontend)
const DEFAULT_ENROLLED_SLUGS = ["java-full-stack-mastery", "modern-frontend-engineering"];

export function getStoredCourses(): FullCourse[] {
  return safeLocalStorageGet<FullCourse[]>(STORAGE_KEYS.COURSES, INITIAL_COURSES);
}

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
  return newCourse;
}

export function deleteCourse(courseId: string) {
  const current = getStoredCourses();
  const updated = current.filter((c) => c.id !== courseId);
  safeLocalStorageSet(STORAGE_KEYS.COURSES, updated);
}

export function getStudentOwnedSlugs(): string[] {
  return safeLocalStorageGet<string[]>(STORAGE_KEYS.ENROLLMENTS, DEFAULT_ENROLLED_SLUGS);
}

export function enrollStudentCourse(slug: string): string[] {
  const current = getStudentOwnedSlugs();
  if (!current.includes(slug)) {
    const updated = [...current, slug];
    safeLocalStorageSet(STORAGE_KEYS.ENROLLMENTS, updated);
    return updated;
  }
  return current;
}

export function unenrollStudentCourse(slug: string): string[] {
  const current = getStudentOwnedSlugs();
  const updated = current.filter((s) => s !== slug);
  safeLocalStorageSet(STORAGE_KEYS.ENROLLMENTS, updated);
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

export function useAllCourses(): FullCourse[] {
  return useSyncExternalStore(subscribe, getCoursesSnapshot, () => INITIAL_COURSES);
}

export function useStudentOwnedCourses(): FullCourse[] {
  const allCourses = useAllCourses();
  const ownedSlugs = useSyncExternalStore(
    subscribe,
    getEnrollmentsSnapshot,
    () => DEFAULT_ENROLLED_SLUGS
  );
  return allCourses.filter((course) => ownedSlugs.includes(course.slug));
}

export function getFullCourseBySlug(slug: string): FullCourse | undefined {
  const courses = getStoredCourses();
  return courses.find((c) => c.slug === slug);
}
