"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageSquare,
  Star,
  Trophy,
  BookOpen,
  ExternalLink,
  Check,
  Shield,
  Users,
  GraduationCap,
  ClipboardCheck,
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

type AdminTabFilter =
  | "all"
  | "unread"
  | "students"
  | "tutors"
  | "courses"
  | "assignments"
  | "enrollments"
  | "system";

export default function AdminNotificationsPage() {
  const session = useMockSession();
  const adminEmail = session?.email || "admin@jkslearning.dev";

  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll, refresh } =
    useNotifications("admin", adminEmail);

  const [activeTab, setActiveTab] = useState<AdminTabFilter>("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "students") {
      return (
        notif.type === "enrollment" ||
        notif.type === "course" ||
        notif.type === "resume" ||
        notif.type === "interview"
      );
    }
    if (activeTab === "tutors") return notif.type === "tutor";
    if (activeTab === "courses") return notif.type === "course";
    if (activeTab === "assignments") return notif.type === "assessment";
    if (activeTab === "enrollments") return notif.type === "enrollment";
    if (activeTab === "system") {
      return notif.type === "system" || notif.type === "qa" || notif.type === "review";
    }
    return true;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "tutor":
        return <GraduationCap className="h-4 w-4 text-purple-600" />;
      case "assessment":
        return <ClipboardCheck className="h-4 w-4 text-amber-500" />;
      case "course":
        return <Trophy className="h-4 w-4 text-blue-500" />;
      case "enrollment":
        return <BookOpen className="h-4 w-4 text-emerald-500" />;
      case "review":
        return <Star className="h-4 w-4 text-amber-500 fill-amber-400" />;
      case "qa":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      default:
        return <Shield className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <>
      <DashboardTopbar
        title="Admin Notifications"
        subtitle="Real-time alerts for student enrollments, assignment submissions, tutor actions, and system milestones."
      />

      <div className="flex-1 space-y-6 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4 max-w-5xl mx-auto w-full">
        {/* Top Control Bar */}
        <Reveal>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
              {[
                { id: "all", label: `All (${notifications.length})` },
                { id: "unread", label: `Unread (${unreadCount})` },
                { id: "students", label: "Student Activity" },
                { id: "tutors", label: "Tutor Activity" },
                { id: "courses", label: "Courses" },
                { id: "assignments", label: "Assignments" },
                { id: "enrollments", label: "Enrollments" },
                { id: "system", label: "System & Reviews" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as AdminTabFilter)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Batch Action Buttons */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => markAllAsRead()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-surface-hover shadow-xs cursor-pointer transition-colors"
                >
                  <CheckCheck className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                  <span>Mark all as read</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm("Clear all notifications?")) {
                      clearAll();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 shadow-xs cursor-pointer transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Clear</span>
                </button>
              )}
            </div>
          </div>
        </Reveal>

        {/* Notifications Stream */}
        <Reveal>
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 p-12 text-center bg-white/50 dark:bg-surface/50">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 mb-4">
                <Inbox className="h-7 w-7 stroke-[1.5]" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No notifications in this filter
              </h3>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 max-w-sm">
                {activeTab === "unread"
                  ? "You're all caught up! No unread notifications right now."
                  : "Live alerts from system events, enrollments, and tutor actions will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
                      !notif.read
                        ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs"
                        : "border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-elevated hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
                        {getIconForType(notif.type)}
                      </div>
                      <div className="min-w-0 flex-1 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4
                            className={`text-sm tracking-tight ${
                              !notif.read
                                ? "font-bold text-slate-900 dark:text-white"
                                : "font-semibold text-slate-800 dark:text-slate-200"
                            }`}
                          >
                            {notif.title}
                          </h4>
                          {!notif.read && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[9px] font-black text-white uppercase tracking-wider">
                              New
                            </span>
                          )}
                          <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-bold text-slate-600 dark:text-slate-400 capitalize">
                            {notif.type}
                          </span>
                          {notif.courseName && (
                            <span className="rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              {notif.courseName}
                            </span>
                          )}
                          {notif.batchTiming && (
                            <span className="rounded-md bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                              {notif.batchTiming}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {notif.body}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                          <Clock className="h-3 w-3 inline mr-1" />
                          <span>{notif.formattedDate}</span>
                          {notif.actorName && <span>• Actor: {notif.actorName}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => markAsRead(notif.id)}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800/60 px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span>Review</span>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      )}
                      {!notif.read && (
                        <button
                          type="button"
                          onClick={() => markAsRead(notif.id)}
                          title="Mark as read"
                          className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Reveal>
      </div>
    </>
  );
}
