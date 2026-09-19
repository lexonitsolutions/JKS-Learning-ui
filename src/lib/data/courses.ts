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
}

export const COURSES: Course[] = [];

export const TRACKS: Track[] = ["Full Stack", "Frontend", "SAP"];

export function getCourseBySlug(slug: string): Course | undefined {
  return undefined;
}

export { fetchDbCourses, fetchDbCourseBySlug } from "./courses-api";
