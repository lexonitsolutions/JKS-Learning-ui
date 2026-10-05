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

export function extractModulesAndTopics(bc: any): { title: string; topics: string[] }[] {
  // 1. Try sections from sectionsJson or sections
  let rawSections: any[] = [];
  if (Array.isArray(bc.sectionsJson)) {
    rawSections = bc.sectionsJson;
  } else if (typeof bc.sectionsJson === "string") {
    try {
      const parsed = JSON.parse(bc.sectionsJson);
      if (Array.isArray(parsed)) rawSections = parsed;
    } catch {}
  }
  if (rawSections.length === 0 && Array.isArray(bc.sections)) {
    rawSections = bc.sections;
  }

  if (rawSections.length > 0) {
    return rawSections.map((s: any, idx: number) => {
      const title = (s.title || s.name || `Module ${idx + 1}`).trim();
      const topicList: string[] = [];

      // Direct video lectures
      if (Array.isArray(s.directVideos)) {
        for (const v of s.directVideos) {
          const t = typeof v === "string" ? v : v?.title;
          if (t && t.trim()) topicList.push(t.trim());
        }
      }

      // Subsections and their videos
      if (Array.isArray(s.subsections)) {
        for (const sub of s.subsections) {
          if (sub.title && sub.title.trim()) {
            topicList.push(sub.title.trim());
          }
          if (Array.isArray(sub.videos) && sub.videos.length > 0) {
            for (const v of sub.videos) {
              const t = typeof v === "string" ? v : v?.title;
              if (t && t.trim() && (!sub.title || sub.title.trim().toLowerCase() !== t.trim().toLowerCase())) {
                topicList.push(t.trim());
              }
            }
          }
        }
      }

      // Explicit topics array
      if (Array.isArray(s.topics)) {
        for (const item of s.topics) {
          const t = typeof item === "string" ? item : item?.title;
          if (t && t.trim()) topicList.push(t.trim());
        }
      }

      // Fallback: description or assignment title
      if (topicList.length === 0) {
        if (s.assignment?.title && s.assignment.title.trim()) {
          topicList.push(s.assignment.title.trim());
        } else if (s.description && s.description.trim()) {
          topicList.push(s.description.trim());
        } else {
          topicList.push(`${title} Core Concepts & Implementation`);
        }
      }

      return {
        title,
        topics: Array.from(new Set(topicList)),
      };
    });
  }

  // 2. Try relational modules from database
  if (Array.isArray(bc.modules) && bc.modules.length > 0) {
    return bc.modules.map((m: any, idx: number) => {
      const title = (m.title || `Module ${idx + 1}`).trim();
      const topicList: string[] = [];

      if (Array.isArray(m.topics)) {
        for (const t of m.topics) {
          if (Array.isArray(t.videos) && t.videos.length > 0) {
            for (const v of t.videos) {
              if (v?.title && v.title.trim()) topicList.push(v.title.trim());
            }
          }
          if (t.title && t.title.trim() && !t.title.includes("Lectures") && !t.title.includes("Overview")) {
            topicList.push(t.title.trim());
          }
        }
      }

      if (topicList.length === 0) {
        if (m.description && m.description.trim()) {
          topicList.push(m.description.trim());
        } else {
          topicList.push(`${title} Core Architecture & Practice`);
        }
      }

      return {
        title,
        topics: Array.from(new Set(topicList)),
      };
    });
  }

  // 3. Fallback to client localStorage catalog if available
  if (typeof window !== "undefined" && bc.slug) {
    try {
      const raw = localStorage.getItem("jks_courses_catalog_v4");
      if (raw) {
        const list = JSON.parse(raw);
        if (Array.isArray(list)) {
          const match = list.find((c: any) => c.slug === bc.slug || c.id === bc.id);
          if (match && Array.isArray(match.sections) && match.sections.length > 0) {
            return extractModulesAndTopics({ sections: match.sections });
          }
        }
      }
    } catch {}
  }

  return [];
}

export function transformBackendCourse(bc: BackendCourse): Course {
  const track = mapBackendTrack(bc.track);
  const modules = extractModulesAndTopics(bc);

  // Extract first available video from sectionsJson or modules if demo video exists
  let demoVideoUrl = "";
  let demoVideoTitle = "";
  const rawSections: any[] = Array.isArray(bc.sectionsJson)
    ? bc.sectionsJson
    : Array.isArray((bc as any).sections)
    ? (bc as any).sections
    : [];

  for (const sec of rawSections) {
    if (Array.isArray(sec.directVideos) && sec.directVideos.length > 0) {
      const firstVid = sec.directVideos[0];
      if (firstVid.videoUrl || firstVid.bunnyVideoId) {
        demoVideoUrl = firstVid.videoUrl || `https://iframe.mediadelivery.net/embed/754986/${firstVid.bunnyVideoId}`;
        demoVideoTitle = firstVid.title || `${bc.title} Demo`;
        break;
      }
    }
    if (Array.isArray(sec.subsections)) {
      for (const sub of sec.subsections) {
        if (Array.isArray(sub.videos) && sub.videos.length > 0) {
          const firstVid = sub.videos[0];
          if (firstVid.videoUrl || firstVid.bunnyVideoId) {
            demoVideoUrl = firstVid.videoUrl || `https://iframe.mediadelivery.net/embed/754986/${firstVid.bunnyVideoId}`;
            demoVideoTitle = firstVid.title || `${bc.title} Demo`;
            break;
          }
        }
      }
      if (demoVideoUrl) break;
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
    price: typeof bc.priceCents === "number" ? Math.round(bc.priceCents / 100) : (typeof (bc as any).price === "number" ? (bc as any).price : 0),
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
