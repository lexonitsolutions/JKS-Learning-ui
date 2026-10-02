"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { apiFetch } from "@/lib/api/base-url";
import { getClientSessionEmail } from "./enrollments-api";

export interface CourseReview {
  id: string;
  courseSlug: string;
  studentName: string;
  studentEmail: string;
  studentAvatar?: string;
  rating: number; // 1 to 5
  title: string;
  reviewText: string;
  createdAt: string; // ISO date
  formattedDate: string;
}

export interface CourseRatingStats {
  averageRating: number;
  totalRatings: number;
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  percentages: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

const REVIEWS_EVENT = "jks-reviews-changed";

export function getCourseReviewsStorageKey(slug: string): string {
  return `jks_reviews_${(slug || "").toLowerCase().trim()}`;
}

const EMPTY_REVIEWS: CourseReview[] = [];
const reviewsCache: Record<string, { raw: string | null; data: CourseReview[] }> = {};

function safeGetReviews(storageKey: string): CourseReview[] {
  if (typeof window === "undefined") return EMPTY_REVIEWS;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      if (reviewsCache[storageKey] && reviewsCache[storageKey].raw === null) {
        return reviewsCache[storageKey].data;
      }
      reviewsCache[storageKey] = { raw: null, data: EMPTY_REVIEWS };
      return EMPTY_REVIEWS;
    }
    if (reviewsCache[storageKey] && reviewsCache[storageKey].raw === raw) {
      return reviewsCache[storageKey].data;
    }
    const data = JSON.parse(raw) as CourseReview[];
    reviewsCache[storageKey] = { raw, data };
    return data;
  } catch {
    return EMPTY_REVIEWS;
  }
}

function safeSetReviews(storageKey: string, reviews: CourseReview[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(reviews);
    localStorage.setItem(storageKey, raw);
    reviewsCache[storageKey] = { raw, data: reviews };
    window.dispatchEvent(new Event(REVIEWS_EVENT));
  } catch (err) {
    console.error("Failed to save reviews to localStorage:", err);
  }
}

export function computeRatingStats(reviews: CourseReview[]): CourseRatingStats {
  if (!Array.isArray(reviews) || reviews.length === 0) {
    return {
      averageRating: 0,
      totalRatings: 0,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
      percentages: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    };
  }

  const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let sum = 0;

  reviews.forEach((r) => {
    const star = Math.max(1, Math.min(5, Math.round(r.rating || 5))) as 1 | 2 | 3 | 4 | 5;
    dist[star] += 1;
    sum += star;
  });

  const total = reviews.length;
  const avg = parseFloat((sum / total).toFixed(1));

  return {
    averageRating: avg,
    totalRatings: total,
    distribution: dist,
    percentages: {
      5: Math.round((dist[5] / total) * 100),
      4: Math.round((dist[4] / total) * 100),
      3: Math.round((dist[3] / total) * 100),
      2: Math.round((dist[2] / total) * 100),
      1: Math.round((dist[1] / total) * 100),
    },
  };
}

/**
 * Fetch reviews and real-time rating stats directly from backend database.
 */
export async function fetchCourseReviews(
  courseSlug: string
): Promise<{ reviews: CourseReview[]; stats: CourseRatingStats }> {
  if (!courseSlug) {
    return { reviews: EMPTY_REVIEWS, stats: computeRatingStats(EMPTY_REVIEWS) };
  }

  const key = getCourseReviewsStorageKey(courseSlug);

  try {
    const res = await apiFetch(`/courses/${encodeURIComponent(courseSlug)}/reviews`, {
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const serverReviews: CourseReview[] = Array.isArray(data?.reviews) ? data.reviews : [];
      safeSetReviews(key, serverReviews);
      const stats =
        data?.percentages && typeof data?.averageRating === "number"
          ? (data as CourseRatingStats)
          : computeRatingStats(serverReviews);

      return { reviews: serverReviews, stats };
    }
  } catch (err) {
    console.warn("[reviews-store] Failed to fetch real-time reviews from backend:", err);
  }

  const local = safeGetReviews(key);
  return { reviews: local, stats: computeRatingStats(local) };
}

export function getCourseReviews(courseSlug: string): CourseReview[] {
  return safeGetReviews(getCourseReviewsStorageKey(courseSlug));
}

/**
 * Add or update a review in backend database and update real-time rating.
 */
export async function addCourseReview(
  courseSlug: string,
  review: {
    studentName: string;
    studentEmail?: string;
    studentAvatar?: string;
    rating: number;
    title: string;
    reviewText: string;
  }
): Promise<CourseReview> {
  const key = getCourseReviewsStorageKey(courseSlug);
  const email = (
    review.studentEmail ||
    getClientSessionEmail() ||
    "student@jkslearning.dev"
  )
    .toLowerCase()
    .trim();
  const rating = Math.max(1, Math.min(5, Math.round(review.rating)));
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const optimisticReview: CourseReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    courseSlug,
    studentName: review.studentName || "Verified Student",
    studentEmail: email,
    studentAvatar: review.studentAvatar,
    rating,
    title: review.title.trim(),
    reviewText: review.reviewText.trim(),
    createdAt: now.toISOString(),
    formattedDate,
  };

  // Optimistic local update
  const current = safeGetReviews(key);
  const existingIdx = current.findIndex((r) => r.studentEmail === email);
  let updatedLocal: CourseReview[];
  if (existingIdx >= 0) {
    updatedLocal = [...current];
    updatedLocal[existingIdx] = optimisticReview;
  } else {
    updatedLocal = [optimisticReview, ...current];
  }
  safeSetReviews(key, updatedLocal);

  // Persist to backend DB so all students and visitors see real-time data
  try {
    const res = await apiFetch(`/courses/${encodeURIComponent(courseSlug)}/reviews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        studentName: review.studentName,
        studentEmail: email,
        studentAvatar: review.studentAvatar,
        rating,
        title: review.title.trim(),
        reviewText: review.reviewText.trim(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const serverReviews: CourseReview[] = Array.isArray(data?.reviews) ? data.reviews : [];
      if (serverReviews.length > 0) {
        safeSetReviews(key, serverReviews);
      }
    }
  } catch (err) {
    console.warn("[reviews-store] Failed to persist review to backend DB:", err);
  }

  // Dispatch custom event for notifications
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("jks_review_submitted", {
        detail: { review: optimisticReview, courseSlug },
      })
    );
  }

  return optimisticReview;
}

function subscribeReviews(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(REVIEWS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(REVIEWS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCourseReviews(courseSlug: string) {
  const storageKey = getCourseReviewsStorageKey(courseSlug);
  const [isLoading, setIsLoading] = useState(false);

  const reviews = useSyncExternalStore(
    subscribeReviews,
    () => safeGetReviews(storageKey),
    () => EMPTY_REVIEWS
  );

  useEffect(() => {
    if (!courseSlug) return;
    setIsLoading(true);
    fetchCourseReviews(courseSlug).finally(() => {
      setIsLoading(false);
    });
  }, [courseSlug]);

  const stats = computeRatingStats(reviews);

  return {
    reviews,
    stats,
    isLoading,
    refreshReviews: () => fetchCourseReviews(courseSlug),
    addReview: (review: {
      studentName: string;
      studentEmail?: string;
      studentAvatar?: string;
      rating: number;
      title: string;
      reviewText: string;
    }) => addCourseReview(courseSlug, review),
  };
}
