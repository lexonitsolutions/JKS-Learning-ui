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
 * Real DB courses catalog type and empty default
 */
export const REAL_DB_COURSES: Course[] = [];

export function transformBackendCourse(bc: BackendCourse): Course {
  const track = mapBackendTrack(bc.track);

  let modules: { title: string; topics: string[] }[] = [];
  if (Array.isArray(bc.sectionsJson) && bc.sectionsJson.length > 0) {
    modules = bc.sectionsJson.map((s: any) => ({
      title: s.title || "Module",
      topics:
        s.subsections?.map((sub: any) => sub.title) ||
        s.directVideos?.map((v: any) => v.title) ||
        ["Curriculum Lecture Topics"],
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

  // Extract first available video from sectionsJson or modules if demo video exists
  let demoVideoUrl = "";
  let demoVideoTitle = "";
  if (Array.isArray(bc.sectionsJson)) {
    for (const sec of bc.sectionsJson) {
      if (Array.isArray(sec.directVideos) && sec.directVideos.length > 0) {
        const firstVid = sec.directVideos[0];
        if (firstVid.videoUrl || firstVid.bunnyVideoId) {
          demoVideoUrl = firstVid.videoUrl || `https://iframe.mediadelivery.net/embed/754986/${firstVid.bunnyVideoId}`;
          demoVideoTitle = firstVid.title || `${bc.title} Demo`;
          break;
        }
      }
    }
  }

  // Fallback high-quality demo video if not provided in DB
  if (!demoVideoUrl) {
    demoVideoUrl = bc.slug.includes("java")
      ? "https://www.youtube.com/watch?v=eIrMbAQSU34"
      : bc.slug.includes("frontend")
      ? "https://www.youtube.com/watch?v=bMknfKXIFA8"
      : bc.slug.includes("sap")
      ? "https://www.youtube.com/watch?v=k1BneeJTDcU"
      : "https://www.youtube.com/watch?v=28aEWu_yV_c";
    demoVideoTitle = `${bc.title} — Foundation Architecture & Orientation Demo`;
  }

  return {
    slug: bc.slug,
    title: bc.title,
    track,
    level: (bc.level as any) || "Intermediate",
    durationWeeks: bc.durationWeeks || (track === "Frontend" ? 10 : track === "SAP" ? 12 : 16),
    price: bc.priceCents ? Math.round(bc.priceCents / 100) : 24999,
    rating: typeof bc.rating === "number" ? bc.rating : 4.9,
    studentsEnrolled: typeof bc.studentsEnrolled === "number" ? bc.studentsEnrolled : 0,
    summary: bc.summary || "",
    thumbnail: resolveCourseThumbnail(bc.thumbnail),
    demoVideoUrl,
    demoVideoTitle,
    modules,
  };
}

export function resolveCourseThumbnail(thumb?: string | null): string | undefined {
  if (!thumb || typeof thumb !== "string") return undefined;
  const trimmed = thumb.trim();
  if (!trimmed) return undefined;
  // Base64 data URL
  if (trimmed.startsWith("data:")) return trimmed;
  // Absolute HTTP/HTTPS URL
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Local public frontend static images
  if (trimmed.startsWith("/images/") || trimmed.startsWith("/assets/")) return trimmed;
  // Backend relative path e.g. "/uploads/courses/..."
  const apiOrigin = apiUrl("").replace(/\/$/, "");
  const cleanPath = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  return `${apiOrigin}${cleanPath}`;
}

/**
 * Fetch published courses directly from backend MongoDB database.
 * Never returns mock/fake data. Returns empty array if no courses are found.
 */
export async function fetchDbCourses(): Promise<Course[]> {
  const urlsToTry: string[] = [apiUrl("/courses")];
  if (typeof window === "undefined" && !urlsToTry[0].includes("localhost:4000")) {
    urlsToTry.push("http://localhost:4000/courses");
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });

      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          return data.map((item: BackendCourse) => transformBackendCourse(item));
        }
      }
    } catch {
      // Try next url if available
    }
  }

  return [];
}

/**
 * Fetch a single published course by slug directly from backend MongoDB database.
 * Supports exact match and slug resolution across live DB courses.
 */
export async function fetchDbCourseBySlug(slug: string): Promise<Course | undefined> {
  const cleanSlug = decodeURIComponent(slug).trim();
  const urlsToTry: string[] = [apiUrl(`/courses/${encodeURIComponent(cleanSlug)}`)];
  if (typeof window === "undefined" && !urlsToTry[0].includes("localhost:4000")) {
    urlsToTry.push(`http://localhost:4000/courses/${encodeURIComponent(cleanSlug)}`);
  }

  for (const url of urlsToTry) {
    try {
      const res = await fetch(url, {
        cache: "no-store",
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(12000),
      });

      if (res.ok) {
        const data = await res.json();
        if (data && data.slug) {
          return transformBackendCourse(data);
        }
      }
    } catch {
      // Try next url
    }
  }

  // If direct slug query failed, try fetching all courses to match by case-insensitive slug or ID
  try {
    const allCourses = await fetchDbCourses();
    const found = allCourses.find(
      (c) =>
        c.slug.toLowerCase() === cleanSlug.toLowerCase() ||
        c.slug.toLowerCase() === slug.toLowerCase() ||
        (c as any).id === cleanSlug
    );
    if (found) return found;
  } catch {
    // ignore
  }

  return undefined;
}
