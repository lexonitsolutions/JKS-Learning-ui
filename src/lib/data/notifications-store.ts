"use client";

import { useSyncExternalStore, useEffect } from "react";
import { getClientSessionEmail } from "./enrollments-api";

export type NotificationType =
  | "enrollment"
  | "assessment"
  | "qa"
  | "review"
  | "certificate"
  | "system";

export interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: string; // ISO date
  formattedDate: string;
  read: boolean;
  type: NotificationType;
  link?: string;
}

const NOTIFICATIONS_EVENT = "jks-notifications-changed";

export function getNotificationsStorageKey(role: "admin" | "student", email?: string): string {
  if (role === "admin") {
    return "jks_admin_notifications_v1";
  }
  const effectiveEmail = (email || getClientSessionEmail() || "guest").toLowerCase().trim();
  return `jks_student_notifications_${effectiveEmail}`;
}

const EMPTY_NOTIFS: AppNotification[] = [];
const notifsCache: Record<string, { raw: string | null; data: AppNotification[] }> = {};

function getInitialDefaultNotifications(storageKey: string): AppNotification[] {
  const isAdmin = storageKey.includes("admin");
  const now = new Date();
  if (isAdmin) {
    return [
      {
        id: "notif-admin-init-1",
        title: "🛡️ Administrative Monitoring Active",
        body: "Real-time metrics, student assessment grading, and course review audit streams are synchronized.",
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        formattedDate: "2h ago",
        read: false,
        type: "system",
        link: "/admin",
      },
      {
        id: "notif-admin-init-2",
        title: "📚 Curriculum Sync Operational",
        body: "All published course videos, modules, and Q&A channels are operational.",
        timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
        formattedDate: "6h ago",
        read: true,
        type: "enrollment",
        link: "/admin/courses",
      },
    ];
  }
  return [
    {
      id: "notif-student-init-1",
      title: "🎓 Welcome to JKS Learning Platform",
      body: "Your student workspace is ready. Explore your enrolled courses, complete lesson quizzes, and track your daily streak.",
      timestamp: new Date(Date.now() - 3600000 * 1).toISOString(),
      formattedDate: "1h ago",
      read: false,
      type: "system",
      link: "/dashboard/my-courses",
    },
    {
      id: "notif-student-init-2",
      title: "🏆 Leaderboard Ranking Active",
      body: "Watch lectures and complete weekly coding assessments to climb the 3D championship podium.",
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      formattedDate: "4h ago",
      read: false,
      type: "assessment",
      link: "/dashboard/leaderboard",
    },
  ];
}

function safeGetNotifications(storageKey: string): AppNotification[] {
  if (typeof window === "undefined") return EMPTY_NOTIFS;
  try {
    const raw = localStorage.getItem(storageKey);
    if (!raw) {
      const defaults = getInitialDefaultNotifications(storageKey);
      localStorage.setItem(storageKey, JSON.stringify(defaults));
      notifsCache[storageKey] = { raw: JSON.stringify(defaults), data: defaults };
      return defaults;
    }
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
    localStorage.setItem(storageKey, JSON.stringify(notifs));
    notifsCache[storageKey] = { raw: JSON.stringify(notifs), data: notifs };
    window.dispatchEvent(new Event(NOTIFICATIONS_EVENT));
  } catch (err) {
    console.error("Failed to save notifications to localStorage:", err);
  }
}

export function addNotification(
  role: "admin" | "student",
  notif: {
    title: string;
    body: string;
    type: NotificationType;
    link?: string;
  },
  email?: string
): AppNotification {
  const key = getNotificationsStorageKey(role, email);
  const current = safeGetNotifications(key);
  const now = new Date();
  const formattedDate = now.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const newNotif: AppNotification = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: notif.title.trim(),
    body: notif.body.trim(),
    timestamp: now.toISOString(),
    formattedDate,
    read: false,
    type: notif.type,
    link: notif.link,
  };

  const updated = [newNotif, ...current];
  safeSetNotifications(key, updated);
  return newNotif;
}

export function markNotificationRead(
  id: string,
  role: "admin" | "student",
  email?: string
) {
  const key = getNotificationsStorageKey(role, email);
  const current = safeGetNotifications(key);
  const updated = current.map((n) => (n.id === id ? { ...n, read: true } : n));
  safeSetNotifications(key, updated);
}

export function markAllNotificationsRead(
  role: "admin" | "student",
  email?: string
) {
  const key = getNotificationsStorageKey(role, email);
  const current = safeGetNotifications(key);
  const updated = current.map((n) => ({ ...n, read: true }));
  safeSetNotifications(key, updated);
}

export function clearNotifications(role: "admin" | "student", email?: string) {
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

// Global listener to wire app events to notifications
if (typeof window !== "undefined") {
  // 1. Review submitted -> Admin Notification
  window.addEventListener("jks_review_submitted", ((e: CustomEvent) => {
    const { review, courseSlug } = e.detail || {};
    if (!review) return;
    addNotification("admin", {
      title: `⭐ New ${review.rating}-Star Review Submitted`,
      body: `${review.studentName} posted a review for "${courseSlug}": "${review.title}"`,
      type: "review",
      link: `/dashboard/my-courses/${courseSlug}`,
    });
  }) as EventListener);

  // 2. Q&A Question asked -> Admin Notification
  window.addEventListener("jks_qa_question_created", ((e: CustomEvent) => {
    const { question, courseSlug } = e.detail || {};
    if (!question) return;
    addNotification("admin", {
      title: `💬 New Course Question Asked`,
      body: `${question.author} asked in "${question.lecture}": "${question.title}"`,
      type: "qa",
      link: `/dashboard/my-courses/${courseSlug}`,
    });
  }) as EventListener);

  // 3. Q&A Answered by Admin/Instructor -> Student Notification
  window.addEventListener("jks_qa_answer_created", ((e: CustomEvent) => {
    const { answer, question, courseSlug } = e.detail || {};
    if (!answer || !question) return;
    if (question.authorEmail) {
      addNotification(
        "student",
        {
          title: `💡 Instructor Answered Your Question`,
          body: `${answer.author} replied to your question "${question.title}": "${answer.content.slice(0, 70)}..."`,
          type: "qa",
          link: `/dashboard/my-courses/${courseSlug}`,
        },
        question.authorEmail
      );
    }
  }) as EventListener);
}

export function useNotifications(role: "admin" | "student", email?: string) {
  const effectiveEmail = (email || getClientSessionEmail() || "").toLowerCase().trim();
  const storageKey = getNotificationsStorageKey(role, effectiveEmail);

  const notifications = useSyncExternalStore(
    subscribeNotifications,
    () => safeGetNotifications(storageKey),
    () => EMPTY_NOTIFS
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    markAsRead: (id: string) => markNotificationRead(id, role, effectiveEmail),
    markAllAsRead: () => markAllNotificationsRead(role, effectiveEmail),
    clearAll: () => clearNotifications(role, effectiveEmail),
    addNotification: (notif: {
      title: string;
      body: string;
      type: NotificationType;
      link?: string;
    }) => addNotification(role, notif, effectiveEmail),
  };
}
