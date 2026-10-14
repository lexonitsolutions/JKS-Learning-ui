export type Track = "Full Stack" | "Frontend" | "SAP";

export interface Course {
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
  demoVideoUrl?: string;
  demoVideoTitle?: string;
  modules: { title: string; topics: string[] }[];
  /** The syllabus template an administrator assigned to this course, if any. */
  syllabus?: CourseSyllabus | null;
}

export interface CourseSyllabus {
  title: string;
  description?: string;
  modules: { title: string; description?: string; topics: string[] }[];
}

export const COURSES: Course[] = [];

export const TRACKS: Track[] = ["Full Stack", "Frontend", "SAP"];

export function getCourseBySlug(slug: string): Course | undefined {
  return undefined;
}

export { fetchDbCourses, fetchDbCourseBySlug } from "./courses-api";
