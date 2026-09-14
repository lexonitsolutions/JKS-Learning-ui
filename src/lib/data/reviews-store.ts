"use client";

import { useSyncExternalStore } from "react";
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

const REVIEWS_EVENT = "jks-reviews-changed";

export function getCourseReviewsStorageKey(slug: string): string {
  return `jks_reviews_${slug.toLowerCase().trim()}`;
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
    localStorage.setItem(storageKey, JSON.stringify(reviews));
    window.dispatchEvent(new Event(REVIEWS_EVENT));
  } catch (err) {
    console.error("Failed to save reviews to localStorage:", err);
  }
}

export function getCourseReviews(courseSlug: string): CourseReview[] {
  return safeGetReviews(getCourseReviewsStorageKey(courseSlug));
}

export function addCourseReview(
  courseSlug: string,
  review: {
    studentName: string;
    studentEmail?: string;
    studentAvatar?: string;
    rating: number;
    title: string;
    reviewText: string;
  }
): CourseReview {
  const key = getCourseReviewsStorageKey(courseSlug);
  const current = safeGetReviews(key);
  const email = (review.studentEmail || getClientSessionEmail() || "student@jkslearning.dev").toLowerCase().trim();

  // Format date
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const newReview: CourseReview = {
    id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    courseSlug,
    studentName: review.studentName || "Verified Student",
    studentEmail: email,
    studentAvatar: review.studentAvatar,
    rating: Math.max(1, Math.min(5, Math.round(review.rating))),
    title: review.title.trim(),
    reviewText: review.reviewText.trim(),
    createdAt: now.toISOString(),
    formattedDate,
  };

  // Upsert or prepend review
  const existingIdx = current.findIndex((r) => r.studentEmail === email);
  let updated: CourseReview[];
  if (existingIdx >= 0) {
    updated = [...current];
    updated[existingIdx] = newReview;
  } else {
    updated = [newReview, ...current];
  }

  safeSetReviews(key, updated);

  // Dispatch custom event for admin notifications
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("jks_review_submitted", {
        detail: { review: newReview, courseSlug },
      })
    );
  }

  return newReview;
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

export function computeRatingStats(reviews: CourseReview[]): CourseRatingStats {
  if (reviews.length === 0) {
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
    const star = Math.max(1, Math.min(5, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5;
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

function subscribeReviews(callback: () => void) {
  window.addEventListener(REVIEWS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(REVIEWS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useCourseReviews(courseSlug: string) {
  const storageKey = getCourseReviewsStorageKey(courseSlug);

  const reviews = useSyncExternalStore(
    subscribeReviews,
    () => safeGetReviews(storageKey),
    () => EMPTY_REVIEWS
  );

  const stats = computeRatingStats(reviews);

  return {
    reviews,
    stats,
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
