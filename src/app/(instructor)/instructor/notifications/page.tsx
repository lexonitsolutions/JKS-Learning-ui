"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  ClipboardCheck,
  BookOpen,
  Trophy,
  ExternalLink,
  Check,
  Users,
  Clock,
  Sparkles,
  Inbox,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import {
  useNotifications,
  type AppNotification,
  type NotificationType,
} from "@/lib/data/notifications-store";
import { useMockSession } from "@/lib/auth/use-mock-auth";

type TutorTabFilter = "all" | "unread" | "assignments" | "progress" | "enrollments";

export default function InstructorNotificationsPage() {
  const session = useMockSession();
  const instructorEmail = session?.email || "tutor@jkslearning.dev";

  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } =
    useNotifications("instructor", instructorEmail);

  const [activeTab, setActiveTab] = useState<TutorTabFilter>("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "assignments") return notif.type === "assessment";
    if (activeTab === "progress") return notif.type === "course";
    if (activeTab === "enrollments") return notif.type === "enrollment";
    return true;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "assessment":
        return <ClipboardCheck className="h-4 w-4 text-purple-600" />;
      case "course":
        return <Trophy className="h-4 w-4 text-blue-600" />;
      case "enrollment":
        return <BookOpen className="h-4 w-4 text-emerald-600" />;
      default:
        return <Bell className="h-4 w-4 text-indigo-600" />;
    }
  };

  return (
    <>
      <DashboardTopbar
        title="Tutor Notification Center"
        subtitle="Manage student submissions, curriculum video milestones, and cohort enrollments for your assigned courses."
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4 max-w-5xl mx-auto w-full">
        {/* Top Control Bar */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                All ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "unread"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("assignments")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "assignments"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Submissions
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("progress")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "progress"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Student Progress
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("enrollments")}
                className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeTab === "enrollments"
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                }`}
              >
                Enrollments
              </button>
            </div>

            {/* Actions */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllAsRead()}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer self-start sm:self-auto"
              >
                <CheckCheck className="h-3.5 w-3.5 text-blue-600" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>
        </Reveal>

        {/* Notifications Stream */}
        <Reveal>
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-12 text-center shadow-xs">
                <Inbox className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  No notifications found
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  {activeTab === "unread"
                    ? "You are all caught up! No unread notifications for your courses."
                    : "There are no notifications matching the selected filter right now."}
                </p>
              </div>
            ) : (
              filteredNotifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    className={`group relative rounded-2xl border p-4 sm:p-5 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                      !notif.read
                        ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-elevated"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-800">
                        {getIconForType(notif.type)}
                      </div>

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.2 text-[9px] font-black text-white uppercase tracking-wider">
                              New
                            </span>
                          )}
                          {notif.courseName && (
                            <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                              {notif.courseName}
                            </span>
                          )}
                          {notif.batchTiming && (
                            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                              {notif.batchTiming}
                            </span>
                          )}
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                          {notif.body}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-0.5">
                          <Clock className="h-3 w-3" />
                          <span>{notif.formattedDate}</span>
                          {notif.actorName && (
                            <>
                              <span>•</span>
                              <span>By: {notif.actorName}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => markAsRead(notif.id)}
                          className="flex items-center gap-1 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 px-3 py-1.5 text-xs font-bold transition-all"
                        >
                          <span>Review</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}

                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notif.id)}
                          className="rounded-xl border border-slate-200 dark:border-slate-800 p-1.5 text-slate-500 hover:text-emerald-600 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors cursor-pointer"
                          title="Mark as read"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Reveal>
      </div>
    </>
  );
}
