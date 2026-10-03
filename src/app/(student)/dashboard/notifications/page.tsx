"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  CheckCheck,
  Trash2,
  MessageSquare,
  Star,
  Trophy,
  BookOpen,
  Award,
  ExternalLink,
  Check,
  Inbox,
  Clock,
  Sparkles,
  ClipboardCheck,
} from "lucide-react";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { Reveal } from "@/lib/motion/reveal";
import {
  useNotifications,
  type AppNotification,
  type NotificationType,
} from "@/lib/data/notifications-store";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useUser } from "@clerk/nextjs";

type StudentTabFilter =
  | "all"
  | "unread"
  | "courses"
  | "assessments"
  | "certificates"
  | "system";

export default function StudentNotificationsPage() {
  const router = useRouter();
  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const userEmail =
    clerkUser?.primaryEmailAddress?.emailAddress || session?.email || "";

  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } =
    useNotifications("student", userEmail);

  const [activeTab, setActiveTab] = useState<StudentTabFilter>("all");

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "unread") return !notif.read;
    if (activeTab === "courses") return notif.type === "course" || notif.type === "enrollment";
    if (activeTab === "assessments") return notif.type === "assessment";
    if (activeTab === "certificates") return notif.type === "certificate";
    if (activeTab === "system") {
      return notif.type === "system" || notif.type === "qa" || notif.type === "review";
    }
    return true;
  });

  const getIconForType = (type: NotificationType) => {
    switch (type) {
      case "certificate":
        return <Award className="h-4 w-4 text-emerald-600" />;
      case "assessment":
        return <ClipboardCheck className="h-4 w-4 text-purple-600" />;
      case "course":
      case "enrollment":
        return <BookOpen className="h-4 w-4 text-blue-600" />;
      case "qa":
        return <MessageSquare className="h-4 w-4 text-blue-500" />;
      case "review":
        return <Star className="h-4 w-4 text-amber-500 fill-amber-400" />;
      default:
        return <Bell className="h-4 w-4 text-indigo-500" />;
    }
  };

  return (
    <>
      <DashboardTopbar
        title="Notifications"
        subtitle="Track your curriculum progress, assignment reviews, course completion milestones, and mentor updates."
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
                { id: "courses", label: "Courses & Progress" },
                { id: "assessments", label: "Assignments & Quizzes" },
                { id: "certificates", label: "Certificates" },
                { id: "system", label: "Mentors & Q&A" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as StudentTabFilter)}
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
                  ? "You are all caught up! No unread notifications right now."
                  : "Notifications for your enrolled courses, quizzes, and mentor feedbacks will appear here."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button") || (e.target as HTMLElement).closest("a")) return;
                      if (notif.link) {
                        markAsRead(notif.id);
                        router.push(notif.link);
                      }
                    }}
                    className={`group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border p-4 sm:p-5 transition-all ${
                      notif.link ? "cursor-pointer hover:shadow-md" : ""
                    } ${
                      !notif.read
                        ? "border-blue-200 dark:border-blue-900/60 bg-blue-50/30 dark:bg-blue-950/20 shadow-xs hover:border-blue-300 dark:hover:border-blue-800"
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
                          {notif.courseName && (
                            <span className="rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                              {notif.courseName}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {notif.body}
                        </p>
                        <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 font-mono">
                          <Clock className="h-3 w-3 inline mr-1" />
                          <span>{notif.formattedDate}</span>
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
                          <span>Open</span>
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
