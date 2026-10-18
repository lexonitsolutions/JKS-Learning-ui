"use client";

import { useState, useEffect } from "react";
import { TESTIMONIALS, type Testimonial, type CareerCategory } from "./testimonials";
import type { Track } from "./courses";

export interface SuccessStoryItem extends Testimonial {
  videoUrl?: string;
  videoDuration?: string;
  videoThumbnail?: string;
  updatedAt?: string;
}

export const SUCCESS_STORIES_STORAGE_KEY = "jks_success_stories_v2";
export const SUCCESS_STORIES_EVENT = "jks_success_stories_updated";

// Seed default stories with rich sample video testimonials to demonstrate video playback immediately
export const INITIAL_SUCCESS_STORIES: SuccessStoryItem[] = TESTIMONIALS.map((item, index) => {
  // Add sample video to first 3 testimonials for demonstration
  if (index === 0) {
    return {
      ...item,
      videoUrl: "https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ", // Embeddable video
      videoDuration: "2:45 min",
      videoThumbnail: item.avatar,
    };
  }
  if (index === 1) {
    return {
      ...item,
      videoUrl: "https://www.youtube-nocookie.com/embed/ScMzIvxBSi4",
      videoDuration: "3:10 min",
      videoThumbnail: item.avatar,
    };
  }
  return item;
});

export function getStoredSuccessStories(): SuccessStoryItem[] {
  if (typeof window === "undefined") return INITIAL_SUCCESS_STORIES;
  try {
    const raw = localStorage.getItem(SUCCESS_STORIES_STORAGE_KEY);
    if (!raw) return INITIAL_SUCCESS_STORIES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    console.error("Failed to read success stories from localStorage:", err);
  }
  return INITIAL_SUCCESS_STORIES;
}

export function saveSuccessStories(stories: SuccessStoryItem[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SUCCESS_STORIES_STORAGE_KEY, JSON.stringify(stories));
    window.dispatchEvent(new Event(SUCCESS_STORIES_EVENT));
  } catch (err) {
    console.error("Failed to save success stories to localStorage:", err);
  }
}

export function addSuccessStory(item: Omit<SuccessStoryItem, "id">): SuccessStoryItem {
  const stories = getStoredSuccessStories();
  const id = `story-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const newStory: SuccessStoryItem = {
    ...item,
    id,
    updatedAt: new Date().toISOString(),
  };
  const updated = [newStory, ...stories];
  saveSuccessStories(updated);
  return newStory;
}

export function updateSuccessStory(id: string, updates: Partial<SuccessStoryItem>): SuccessStoryItem[] {
  const stories = getStoredSuccessStories();
  const updated = stories.map((s) => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
  saveSuccessStories(updated);
  return updated;
}

export function deleteSuccessStory(id: string): SuccessStoryItem[] {
  const stories = getStoredSuccessStories();
  const updated = stories.filter((s) => s.id !== id);
  saveSuccessStories(updated);
  return updated;
}

export function resetSuccessStories(): SuccessStoryItem[] {
  if (typeof window === "undefined") return INITIAL_SUCCESS_STORIES;
  try {
    localStorage.setItem(SUCCESS_STORIES_STORAGE_KEY, JSON.stringify(INITIAL_SUCCESS_STORIES));
    window.dispatchEvent(new Event(SUCCESS_STORIES_EVENT));
  } catch (err) {
    console.error("Failed to reset success stories:", err);
  }
  return INITIAL_SUCCESS_STORIES;
}

export function useSuccessStories(): {
  stories: SuccessStoryItem[];
  saveStories: (next: SuccessStoryItem[]) => void;
  addStory: (item: Omit<SuccessStoryItem, "id">) => SuccessStoryItem;
  updateStory: (id: string, updates: Partial<SuccessStoryItem>) => void;
  deleteStory: (id: string) => void;
  resetToDefaults: () => void;
} {
  const [stories, setStories] = useState<SuccessStoryItem[]>(INITIAL_SUCCESS_STORIES);

  useEffect(() => {
    setStories(getStoredSuccessStories());

    const sync = () => {
      setStories(getStoredSuccessStories());
    };

    window.addEventListener(SUCCESS_STORIES_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(SUCCESS_STORIES_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return {
    stories,
    saveStories: (next: SuccessStoryItem[]) => {
      saveSuccessStories(next);
      setStories(next);
    },
    addStory: (item: Omit<SuccessStoryItem, "id">) => {
      const created = addSuccessStory(item);
      setStories(getStoredSuccessStories());
      return created;
    },
    updateStory: (id: string, updates: Partial<SuccessStoryItem>) => {
      const updated = updateSuccessStory(id, updates);
      setStories(updated);
    },
    deleteStory: (id: string) => {
      const updated = deleteSuccessStory(id);
      setStories(updated);
    },
    resetToDefaults: () => {
      const reset = resetSuccessStories();
      setStories(reset);
    },
  };
}

/**
 * Normalizes video URLs to ensure embeddable iframe / player compatibility
 * Supports YouTube watch URLs, short links, Bunny stream iframes, and raw MP4 links
 */
export function normalizeVideoEmbedUrl(url: string | undefined): { isEmbed: boolean; url: string; isVideoFile: boolean } {
  if (!url || !url.trim()) return { isEmbed: false, url: "", isVideoFile: false };
  const raw = url.trim();

  // Direct video file (mp4, webm, m3u8)
  if (/\.(mp4|webm|ogg|m3u8)(\?.*)?$/i.test(raw)) {
    return { isEmbed: false, url: raw, isVideoFile: true };
  }

  // YouTube Watch URL: https://www.youtube.com/watch?v=VIDEO_ID
  const ytMatch = raw.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return { isEmbed: true, url: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`, isVideoFile: false };
  }

  // Already an iframe embed URL (e.g., Bunny Stream or YouTube Embed)
  return { isEmbed: true, url: raw, isVideoFile: false };
}
