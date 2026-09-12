import { apiUrl } from "@/lib/api/base-url";
import type { Course, Track } from "./courses";

export interface BackendTopic {
  id: string;
  title: string;
  order: number;
  videos?: {
    id: string;
    title: string;
    durationSeconds: number;
    isFreeDemo: boolean;
  }[];
}

export interface BackendModule {
  id: string;
  title: string;
  order: number;
  topics?: BackendTopic[];
}

export interface BackendCourse {
  id: string;
  slug: string;
  title: string;
  track: "FULL_STACK" | "FRONTEND" | "SAP" | "DOTNET" | string;
  summary: string;
  priceCents: number;
  status: string;
  level?: string;
  durationWeeks?: number;
  thumbnail?: string;
  rating?: number;
  studentsEnrolled?: number;
  sectionsJson?: any;
  createdAt: string;
  updatedAt: string;
  modules?: BackendModule[];
}

export function mapBackendTrack(track: string): Track {
  const upper = track?.toUpperCase() || "";
  if (upper.includes("FRONTEND")) return "Frontend";
  if (upper.includes("SAP")) return "SAP";
  return "Full Stack";
}

/**
 * 4 Real Enterprise Courses matching the exact MongoDB Atlas database schema
 */
export const REAL_DB_COURSES: Course[] = [
  {
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Developer Mastery",
    track: "Full Stack",
    level: "Intermediate",
    durationWeeks: 16,
    price: 29999,
    rating: 4.9,
    studentsEnrolled: 2140,
    summary:
      "Enterprise Spring Boot 3, Microservices, Kafka, Docker & React 19 architecture built around real enterprise project work.",
    modules: [
      {
        title: "Core Java & Advanced Concurrency",
        topics: ["JVM Memory Model & Garbage Collection Tuning", "Java Concurrency & Virtual Threads", "OOP Principles & Design Patterns"],
      },
      {
        title: "Spring Boot 3 & Microservices Architecture",
        topics: ["Distributed Transaction Management (Saga Pattern)", "Orchestration vs Choreography with Apache Kafka", "Spring Security & OAuth2"],
      },
      {
        title: "Frontend with React & Next.js",
        topics: ["React 19 Architecture", "State Management & Server Actions", "Full Stack API Integration"],
      },
      {
        title: "CI/CD & Cloud Deployment",
        topics: ["Docker & Kubernetes Orchestration", "Cloud CI/CD Pipelines", "Production Monitoring"],
      },
    ],
  },
  {
    slug: "modern-frontend-engineering",
    title: "Modern Frontend Engineering (React 19 & Next.js)",
    track: "Frontend",
    level: "Beginner",
    durationWeeks: 10,
    price: 24999,
    rating: 4.9,
    studentsEnrolled: 3020,
    summary:
      "React 19, Next.js App Router, Tailwind CSS, TypeScript & Three.js 3D WebGL for enterprise frontend architects.",
    modules: [
      {
        title: "Modern Web & TypeScript Fundamentals",
        topics: ["Semantic Architecture & Modern Layouts", "Advanced TypeScript in Practice", "Core Web Vitals & Browser APIs"],
      },
      {
        title: "React 19 & Next.js App Router",
        topics: ["Server Components & Streaming SSR", "Custom Hooks & High-performance State", "Framer Motion & Micro-interactions"],
      },
      {
        title: "3D Visuals & Performance Engineering",
        topics: ["Three.js & React Three Fiber (R3F)", "Bundle Optimization & Code Splitting", "Automated Testing with Playwright"],
      },
    ],
  },
  {
    slug: "sap-s4hana-enterprise-systems",
    title: "SAP S/4HANA Enterprise Systems",
    track: "SAP",
    level: "Intermediate",
    durationWeeks: 12,
    price: 34999,
    rating: 4.8,
    studentsEnrolled: 1500,
    summary:
      "SAP S/4HANA FI/CO, MM, SD configuration, ABAP Cloud on BTP & Clean Core architecture for enterprise consultants.",
    modules: [
      {
        title: "SAP S/4HANA Architecture & Business Suite",
        topics: ["S/4HANA Core & In-Memory Database Architecture", "Enterprise Structure & Organization Setup", "Fiori UX & Launchpad Configuration"],
      },
      {
        title: "Functional Configuration (MM & FI/CO)",
        topics: ["Procure-to-Pay End-to-End Cycle", "General Ledger & Financial Accounting", "Material Master & Inventory Management"],
      },
      {
        title: "ABAP Cloud & Clean Core on BTP",
        topics: ["ABAP RESTful Application Programming (RAP)", "Core Data Services (CDS Views)", "Side-by-Side Extensibility on SAP BTP"],
      },
    ],
  },
  {
    slug: "dotnet-full-stack-developer",
    title: ".NET 9 Enterprise Microservices & Cloud",
    track: "Full Stack",
    level: "Intermediate",
    durationWeeks: 14,
    price: 27999,
    rating: 4.8,
    studentsEnrolled: 1380,
    summary:
      "C# 13, ASP.NET Core Web API, Entity Framework Core 9, Azure & Blazor WebAssembly for high-scale enterprise applications.",
    modules: [
      {
        title: "C# 13 & Advanced Object-Oriented Architecture",
        topics: ["Modern C# Features & Pattern Matching", "Asynchronous Programming & Channels", "Clean Architecture Principles"],
      },
      {
        title: "ASP.NET Core Web APIs & Microservices",
        topics: ["High-throughput REST & gRPC Services", "Entity Framework Core 9 & Performance Tuning", "Identity & JWT Token Security"],
      },
      {
        title: "Cloud Deployment & Azure Integration",
        topics: ["Azure Container Apps & Kubernetes", "Event-Driven Messaging with Azure Service Bus", "CI/CD Deployment Pipelines"],
      },
    ],
  },
];

export function transformBackendCourse(bc: BackendCourse): Course {
  const fallback = REAL_DB_COURSES.find((c) => c.slug === bc.slug);
  const track = mapBackendTrack(bc.track);

  let modules = fallback?.modules || [];
  if (Array.isArray(bc.sectionsJson) && bc.sectionsJson.length > 0) {
    modules = bc.sectionsJson.map((s: any) => ({
      title: s.title,
      topics: s.subsections?.map((sub: any) => sub.title) || s.directVideos?.map((v: any) => v.title) || ["Module Lecture Topics"],
    }));
  } else if (bc.modules && bc.modules.length > 0) {
    modules = bc.modules.map((m) => ({
      title: m.title,
      topics:
        m.topics && m.topics.length > 0
          ? m.topics.map((t) => t.title)
          : ["Architecture & Foundations", "Practical Exercises & Labs"],
    }));
  }

  return {
    slug: bc.slug,
    title: bc.title,
    track,
    level: (bc.level as any) || fallback?.level || "Intermediate",
    durationWeeks: bc.durationWeeks || fallback?.durationWeeks || (track === "Frontend" ? 10 : track === "SAP" ? 12 : 16),
    price: bc.priceCents ? Math.round(bc.priceCents / 100) : fallback?.price || 24999,
    rating: typeof bc.rating === "number" ? bc.rating : fallback?.rating || 4.9,
    studentsEnrolled: typeof bc.studentsEnrolled === "number" ? bc.studentsEnrolled : fallback?.studentsEnrolled || 0,
    summary: bc.summary || fallback?.summary || "",
    modules,
  };
}

/**
 * Fetch published courses directly from backend MongoDB database.
 * Falls back to REAL_DB_COURSES if backend is unreachable or booting up.
 */
export async function fetchDbCourses(): Promise<Course[]> {
  try {
    const res = await fetch(apiUrl("/courses"), {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data.map((item: BackendCourse) => transformBackendCourse(item));
      }
    }
  } catch (_err) {
    // Gracefully fallback to real course data if backend is offline or starting up
  }

  return REAL_DB_COURSES;
}

/**
 * Fetch a single published course by slug directly from backend MongoDB database.
 * Falls back to REAL_DB_COURSES if backend is unreachable.
 */
export async function fetchDbCourseBySlug(slug: string): Promise<Course | undefined> {
  try {
    const res = await fetch(apiUrl(`/courses/${encodeURIComponent(slug)}`), {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.slug) {
        return transformBackendCourse(data);
      }
    }
  } catch (_err) {
    // Gracefully fallback
  }

  return REAL_DB_COURSES.find((c) => c.slug === slug);
}

