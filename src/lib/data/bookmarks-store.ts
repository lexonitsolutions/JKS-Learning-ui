"use client";

import { useSyncExternalStore, useEffect } from "react";
import { getClientSessionEmail } from "./enrollments-api";

export interface BookmarkItem {
  id: string;
  title: string;
  course: string;
  slug: string;
  category: "Courses" | "Lectures" | "Assignments" | "Cheat Sheets" | "Interview Questions";
  type: string;
  duration: string;
  url: string;
  savedOn: string;
  thumbnail?: string;
  track?: string;
}

const BOOKMARK_CHANGE_EVENT = "jks-bookmarks-changed";

export function getBookmarksStorageKey(email?: string): string {
  const effectiveEmail = (email || getClientSessionEmail() || "").toLowerCase().trim();
  return effectiveEmail ? `jks_bookmarks_${effectiveEmail}` : "jks_bookmarks_guest";
}

const EMPTY_BOOKMARKS: BookmarkItem[] = [];
const memoryCache: Record<string, { raw: string | null; data: BookmarkItem[] }> = {};

function safeGetBookmarks(key: string): BookmarkItem[] {
  if (typeof window === "undefined") return EMPTY_BOOKMARKS;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      if (memoryCache[key] && memoryCache[key].raw === null) {
        return memoryCache[key].data;
      }
      memoryCache[key] = { raw: null, data: EMPTY_BOOKMARKS };
      return EMPTY_BOOKMARKS;
    }
    if (memoryCache[key] && memoryCache[key].raw === raw) {
      return memoryCache[key].data;
    }
    const data = JSON.parse(raw) as BookmarkItem[];
    memoryCache[key] = { raw, data };
    return data;
  } catch {
    return EMPTY_BOOKMARKS;
  }
}

function safeSetBookmarks(key: string, items: BookmarkItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(items));
    window.dispatchEvent(new Event(BOOKMARK_CHANGE_EVENT));
  } catch (err) {
    console.error("Failed to save bookmarks to localStorage:", err);
  }
}

export function getStudentBookmarks(email?: string): BookmarkItem[] {
  const key = getBookmarksStorageKey(email);
  return safeGetBookmarks(key);
}

export function isCourseBookmarked(slug: string, email?: string): boolean {
  const list = getStudentBookmarks(email);
  return list.some((item) => item.slug === slug || item.id === `bm-course-${slug}`);
}

export function toggleCourseBookmark(
  course: { id: string; slug: string; title: string; summary?: string; track?: string; thumbnail?: string; durationWeeks?: number },
  email?: string
): boolean {
  const key = getBookmarksStorageKey(email);
  const current = safeGetBookmarks(key);
  const existingIdx = current.findIndex((item) => item.slug === course.slug || item.id === `bm-course-${course.slug}`);

  if (existingIdx >= 0) {
    // Remove
    const updated = current.filter((_, idx) => idx !== existingIdx);
    safeSetBookmarks(key, updated);
    return false;
  } else {
    // Add
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newBookmark: BookmarkItem = {
      id: `bm-course-${course.slug}`,
      slug: course.slug,
      title: course.title,
      course: course.title,
      category: "Courses",
      type: `${course.track || "Engineering"} Track`,
      duration: course.durationWeeks ? `${course.durationWeeks} weeks` : "Self-paced",
      url: `/dashboard/my-courses/${course.slug}`,
      savedOn: formattedDate,
      thumbnail: course.thumbnail,
      track: course.track,
    };
    const updated = [newBookmark, ...current];
    safeSetBookmarks(key, updated);
    return true;
  }
}

export function removeBookmark(id: string, email?: string): BookmarkItem[] {
  const key = getBookmarksStorageKey(email);
  const current = safeGetBookmarks(key);
  const updated = current.filter((item) => item.id !== id);
  safeSetBookmarks(key, updated);
  return updated;
}

function subscribeBookmarks(callback: () => void) {
  window.addEventListener(BOOKMARK_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(BOOKMARK_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useStudentBookmarks(email?: string) {
  const effectiveEmail = (email || getClientSessionEmail() || "").toLowerCase().trim();
  const storageKey = getBookmarksStorageKey(effectiveEmail);

  const bookmarks = useSyncExternalStore(
    subscribeBookmarks,
    () => safeGetBookmarks(storageKey),
    () => EMPTY_BOOKMARKS
  );

  return {
    bookmarks,
    isBookmarked: (slug: string) => bookmarks.some((item) => item.slug === slug || item.id === `bm-course-${slug}`),
    toggleBookmark: (course: { id: string; slug: string; title: string; summary?: string; track?: string; thumbnail?: string; durationWeeks?: number }) =>
      toggleCourseBookmark(course, effectiveEmail),
    removeBookmark: (id: string) => removeBookmark(id, effectiveEmail),
  };
}
