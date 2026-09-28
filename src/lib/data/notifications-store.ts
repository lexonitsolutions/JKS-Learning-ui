"use client";

import { useSyncExternalStore, useEffect } from "react";
import { apiFetch, apiUrl } from "@/lib/api/base-url";
import { getClientSessionEmail } from "./enrollments-api";

export type NotificationType =
  | "enrollment"
  | "assessment"
  | "qa"
  | "review"
  | "certificate"
  | "system"
  | "course"
  | "resume"
  | "interview"
  | "tutor";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string; // ISO date
  formattedDate: string;
  read: boolean;
  type: NotificationType;
  link?: string;
  actorId?: string;
  actorName?: string;
  courseId?: string;
  courseName?: string;
  batchTiming?: string;
  priority?: "LOW" | "NORMAL" | "HIGH" | "URGENT";
  entityType?: string;
  entityId?: string;
}

const NOTIFICATIONS_EVENT = "jks-notifications-changed";

export function getNotificationsStorageKey(
  role: "admin" | "instructor" | "student",
  email?: string
): string {
  if (role === "admin") {
    return "jks_admin_notifications_v2";
  }
  if (role === "instructor") {
    return "jks_instructor_notifications_v2";
  }
  const effectiveEmail = (email || getClientSessionEmail() || "guest").toLowerCase().trim();
  return `jks_student_notifications_v2_${effectiveEmail}`;
}

const EMPTY_NOTIFS: AppNotification[] = [];
const notifsCache: Record<string, { raw: string | null; data: AppNotification[] }> = {};

function formatTimeAgo(isoDate: string): string {
  try {
    const now = Date.now();
    const then = new Date(isoDate).getTime();
    if (isNaN(then)) return "Just now";
    const diffSec = Math.max(0, Math.floor((now - then) / 1000));
    if (diffSec < 60) return "Just now";
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays}d ago`;
    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Recently";
  }
}

function mapBackendTypeToCategory(backendType?: string): NotificationType {
  if (!backendType) return "system";
  const upper = backendType.toUpperCase();
  if (upper.includes("ENROLL") || upper.includes("REGISTRATION") || upper.includes("SIGNUP")) {
    return "enrollment";
  }
  if (upper.includes("ASSIGNMENT")) {
    return "assessment";
  }
  if (upper.includes("RESUME")) {
    return "resume";
  }
  if (upper.includes("INTERVIEW")) {
    return "interview";
  }
  if (upper.includes("CERTIFICATE")) {
    return "certificate";
  }
  if (upper.includes("TUTOR")) {
    return "tutor";
  }
  if (upper.includes("VIDEO") || upper.includes("SECTION") || upper.includes("COURSE")) {
    return "course";
  }
  return "system";
}

function normalizeNotification(raw: any): AppNotification {
  const timestamp = raw.createdAt || raw.timestamp || new Date().toISOString();
  return {
    id: raw.id || `notif-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    title: raw.title || "Notification",
    body: raw.body || raw.message || "",
    timestamp,
    formattedDate: formatTimeAgo(timestamp),
    read: Boolean(raw.read ?? raw.isRead),
    type: raw.type ? mapBackendTypeToCategory(raw.type) : "system",
    link: raw.link || undefined,
    actorId: raw.actorId,
    actorName: raw.actorName,
    courseId: raw.courseId,
    courseName: raw.courseName,
    batchTiming: raw.batchTiming,
    priority: raw.priority || "NORMAL",
    entityType: raw.entityType,
    entityId: raw.entityId,
  };
}

function safeGetNotifications(storageKey: string): AppNotification[] {
  if (typeof window === "undefined") return EMPTY_NOTIFS;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) return EMPTY_NOTIFS;
    if (notifsCache[storageKey] && notifsCache[storageKey].raw === raw) {
      return notifsCache[storageKey].data;
    }
    const data = JSON.parse(raw) as AppNotification[];
    notifsCache[storageKey] = { raw, data };
    return data;
  } catch {
    return EMPTY_NOTIFS;
  }
}

function safeSetNotifications(storageKey: string, notifs: AppNotification[]) {
  if (typeof window === "undefined") return;
  try {
    const raw = JSON.stringify(notifs);
    localStorage.setItem(storageKey, raw);
    notifsCache[storageKey] = { raw, data: notifs };
    window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
  } catch (err) {
    console.error("Failed to save notifications to localStorage:", err);
  }
}

let activeEventSource: EventSource | null = null;
let sseSubscribersCount = 0;

function setupRealtimeSse(onNotification: (notif: AppNotification) => void) {
  if (typeof window === "undefined") return () => {};

  sseSubscribersCount++;
  if (!activeEventSource) {
    try {
      const streamUrl = apiUrl("/notifications/stream");
      activeEventSource = new EventSource(streamUrl, { withCredentials: true });

      activeEventSource.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload && payload.type === "notification" && payload.data) {
            const normalized = normalizeNotification(payload.data);
            onNotification(normalized);
          }
        } catch (e) {
          // Heartbeats or ping frames can be silently ignored
        }
      };

      activeEventSource.onerror = () => {
        // SSE auto-reconnects natively; no throw needed
      };
    } catch {
      // Browsers or environments where EventSource fails gracefully fallback to polling
    }
  }

  return () => {
    sseSubscribersCount--;
    if (sseSubscribersCount <= 0 && activeEventSource) {
      activeEventSource.close();
      activeEventSource = null;
    }
  };
}

export async function fetchLiveNotifications(
  role: "admin" | "instructor" | "student",
  email?: string
): Promise<AppNotification[]> {
  const storageKey = getNotificationsStorageKey(role, email);
  try {
    const res = await apiFetch("/notifications?page=1&limit=50");
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data.items)
        ? data.items
        : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data)
        ? data
        : [];
      const normalized = list.map(normalizeNotification);
      safeSetNotifications(storageKey, normalized);
      return normalized;
    }
  } catch (err) {
    console.warn("[Notifications] Live fetch fallback to local cache:", err);
  }
  return safeGetNotifications(storageKey);
}

export async function markNotificationRead(
  id: string,
  role: "admin" | "instructor" | "student",
  email?: string
) {
  const key = getNotificationsStorageKey(role, email);
  const current = safeGetNotifications(key);
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  safeSetNotifications(key, updated);

  try {
    await apiFetch(`/notifications/${id}/read`, { method: "PATCH" });
  } catch (e) {
    console.warn("[Notifications] Remote mark-read failed:", e);
  }
}

export async function markAllNotificationsRead(
  role: "admin" | "instructor" | "student",
  email?: string
) {
  const key = getNotificationsStorageKey(role, email);
  const current = safeGetNotifications(key);
  const updated = current.map((n) => ({ ...n, read: true }));
  safeSetNotifications(key, updated);

  try {
    await apiFetch("/notifications/read-all", { method: "PATCH" });
  } catch (e) {
    console.warn("[Notifications] Remote mark-all-read failed:", e);
  }
}

export function clearNotifications(
  role: "admin" | "instructor" | "student",
  email?: string
) {
  const key = getNotificationsStorageKey(role, email);
  safeSetNotifications(key, []);
}

function subscribeNotifications(callback: () => void) {
  window.addEventListener(NOTIFICATIONS_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(NOTIFICATIONS_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

export function useNotifications(
  role: "admin" | "instructor" | "student",
  email?: string
) {
  const effectiveEmail = (email || getClientSessionEmail() || "").toLowerCase().trim();
  const storageKey = getNotificationsStorageKey(role, effectiveEmail);

  const notifications = useSyncExternalStore(
    subscribeNotifications,
    () => safeGetNotifications(storageKey),
    () => EMPTY_NOTIFS
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    // 1. Initial background fetch to populate real data
    fetchLiveNotifications(role, effectiveEmail);

    // 2. Real-time SSE stream hookup
    const cleanupSse = setupRealtimeSse((newNotif) => {
      const current = safeGetNotifications(storageKey);
      if (!current.some((x) => x.id === newNotif.id)) {
        safeSetNotifications(storageKey, [newNotif, ...current]);
      }
    });

    // 3. Fallback polling every 30s to keep counters fresh
    const pollInterval = setInterval(() => {
      fetchLiveNotifications(role, effectiveEmail);
    }, 30_000);

    return () => {
      cleanupSse();
      clearInterval(pollInterval);
    };
  }, [role, effectiveEmail, storageKey]);

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => markNotificationRead(id, role, effectiveEmail),
    markAllAsRead: () => markAllNotificationsRead(role, effectiveEmail),
    clearAll: () => clearNotifications(role, effectiveEmail),
    refresh: () => fetchLiveNotifications(role, effectiveEmail),
  };
}
