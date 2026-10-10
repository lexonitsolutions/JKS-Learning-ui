"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  X,
  BookOpen,
  Users,
  GraduationCap,
  Sparkles,
  ClipboardCheck,
  Calendar,
  Award,
  CreditCard,
  Settings,
  FolderTree,
  FileText,
  Activity,
  Megaphone,
  BrainCircuit,
  Trophy,
  Code2,
  Bookmark,
  User,
  ArrowRight,
  CornerDownLeft,
  Command,
  ExternalLink,
  Laptop,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getStoredCourses, type FullCourse } from "@/lib/data/courses-store";
import { fetchInstructors, useMockSession, type StoredInstructor } from "@/lib/auth/use-mock-auth";
import { getStoredLeads } from "@/lib/data/leads-store";
import {
  fetchAdminStudents,
  fetchLeaderboardData,
  type AdminStudentRecord,
  type LeaderboardItem,
} from "@/lib/data/students-api";
import { TESTIMONIALS } from "@/lib/data/testimonials";

export type SearchContextMode = "auto" | "public" | "student" | "admin" | "instructor";

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle?: string;
  category: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
  tags?: string[];
  external?: boolean;
}

// Global Custom Event trigger helper
export function openGlobalSearch() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("jks_open_global_search"));
  }
}

interface GlobalSearchModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  mode?: SearchContextMode;
}

export function GlobalSearchModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  mode = "auto",
}: GlobalSearchModalProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [internalOpen, setInternalOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [courses, setCourses] = useState<FullCourse[]>([]);
  const [tutors, setTutors] = useState<StoredInstructor[]>([]);
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [leaderboardUsers, setLeaderboardUsers] = useState<LeaderboardItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const isControlled = typeof controlledIsOpen === "boolean";
  const isOpen = isControlled ? controlledIsOpen : internalOpen;

  const handleClose = useCallback(() => {
    if (isControlled && controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalOpen(false);
    }
    setQuery("");
    setActiveCategory("All");
    setSelectedIndex(0);
  }, [isControlled, controlledOnClose]);

  // Pre-hydrate from localStorage cache and pre-fetch on mount for admin/instructor
  useEffect(() => {
    if (typeof window === "undefined") return;

    const isAdminOrInstructor = pathname.startsWith("/admin") || pathname.startsWith("/instructor");
    if (!isAdminOrInstructor) return;

    try {
      const cachedStudents = localStorage.getItem("jks_students_roster_cache_v2");
      if (cachedStudents) {
        const parsed = JSON.parse(cachedStudents);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStudents(parsed);
        }
      }
    } catch {}

    try {
      const cachedLb = localStorage.getItem("jks_leaderboard_cache_v2");
      if (cachedLb) {
        const parsed = JSON.parse(cachedLb);
        if (parsed && Array.isArray(parsed.leaderboard) && parsed.leaderboard.length > 0) {
          setLeaderboardUsers(parsed.leaderboard);
        }
      }
    } catch {}

    void fetchAdminStudents()
      .then((res) => {
        if (res && Array.isArray(res) && res.length > 0) setStudents(res);
      })
      .catch(() => {});

    void fetchLeaderboardData()
      .then((res) => {
        if (res && Array.isArray(res.leaderboard) && res.leaderboard.length > 0) {
          setLeaderboardUsers(res.leaderboard);
        }
      })
      .catch(() => {});
  }, [pathname]);

  const session = useMockSession();

  // Determine current effective mode based strictly on active route
  const effectiveMode: "public" | "student" | "admin" | "instructor" = useMemo(() => {
    if (mode !== "auto") return mode;
    if (pathname.startsWith("/admin")) return "admin";
    if (pathname.startsWith("/instructor")) return "instructor";
    if (pathname.startsWith("/dashboard")) return "student";
    return "public";
  }, [mode, pathname]);

  // Load courses, tutors, and fresh students whenever search opens
  useEffect(() => {
    if (!isOpen) return;

    try {
      const stored = getStoredCourses();
      if (stored && stored.length > 0) {
        setCourses(stored);
      }
    } catch {}

    void fetchInstructors()
      .then((res) => {
        if (res && res.length > 0) setTutors(res);
      })
      .catch(() => {});

    // Only query student roster when in admin or instructor workspaces
    if (effectiveMode === "admin" || effectiveMode === "instructor") {
      void fetchAdminStudents()
        .then((res) => {
          if (res && Array.isArray(res) && res.length > 0) {
            setStudents(res);
          }
        })
        .catch(() => {});

      void fetchLeaderboardData()
        .then((res) => {
          if (res && Array.isArray(res.leaderboard) && res.leaderboard.length > 0) {
            setLeaderboardUsers(res.leaderboard);
          }
        })
        .catch(() => {});
    }
  }, [isOpen, effectiveMode]);

  // Listen to Global keyboard shortcuts (Ctrl+K, Cmd+K, '/')
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          if (isControlled) {
            controlledOnClose?.();
          } else {
            setInternalOpen(true);
          }
        }
        return;
      }

      // Quick slash '/' shortcut if not already inside an input/textarea
      if (
        e.key === "/" &&
        !isOpen &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA" &&
        !(document.activeElement as HTMLElement)?.isContentEditable
      ) {
        e.preventDefault();
        setInternalOpen(true);
        return;
      }

      // Escape to close
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    const handleCustomOpen = () => {
      if (isControlled) {
        // If controlled by parent, let parent handle or toggle internal
      } else {
        setInternalOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("jks_open_global_search", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("jks_open_global_search", handleCustomOpen);
    };
  }, [isOpen, handleClose, isControlled, controlledOnClose]);

  // Auto-focus input on modal open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 50);
    }
  }, [isOpen]);

  // Build searchable items based on workspace mode
  const allItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // Helper to build deduplicated students from database, leaderboard & fallback roster
    const buildStudentSearchItems = (): SearchResultItem[] => {
      const studentMap = new Map<
        string,
        {
          id: string;
          name: string;
          email: string;
          status: string;
          enrolledCount: number;
          phone?: string;
          track?: string;
        }
      >();

      // 2. Real learners from Leaderboard
      leaderboardUsers.forEach((lb) => {
        if (!lb.name) return;
        const key = (lb.email || lb.name).toLowerCase().trim();
        const existing = studentMap.get(key);
        studentMap.set(key, {
          id: lb.id || existing?.id || `lb-${key}`,
          name: lb.name,
          email: lb.email || existing?.email || "",
          status: existing?.status || "Active",
          enrolledCount: existing?.enrolledCount ?? 0,
          track: lb.track || existing?.track,
        });
      });

      // 3. Stored admissions & registered student leads
      try {
        const storedLeads = getStoredLeads();
        storedLeads.forEach((ld) => {
          if (!ld.name) return;
          const key = (ld.email || ld.name).toLowerCase().trim();
          if (!studentMap.has(key)) {
            studentMap.set(key, {
              id: ld.id,
              name: ld.name,
              email: ld.email || "",
              phone: ld.phone,
              status: ld.status === "converted" ? "Active" : "Applicant",
              enrolledCount: ld.status === "converted" ? 1 : 0,
              track: ld.interestedCourse,
            });
          }
        });
      } catch {}

      // 4. Current logged-in student user (from localStorage, Clerk, or session)
      if (typeof window !== "undefined") {
        try {
          const authUserRaw = localStorage.getItem("jks_auth_user");
          if (authUserRaw) {
            const u = JSON.parse(authUserRaw);
            if (u?.name) {
              const key = (u.email || u.name).toLowerCase().trim();
              const existing = studentMap.get(key);
              studentMap.set(key, {
                id: u.id || existing?.id || "current-user",
                name: u.name,
                email: u.email || existing?.email || "",
                phone: u.phone || existing?.phone,
                status: existing?.status || "Active",
                enrolledCount: existing?.enrolledCount ?? 0,
                track: existing?.track,
              });
            }
          }
        } catch {}

        try {
          const clerkUser = (window as any).Clerk?.user;
          if (clerkUser) {
            const fullName =
              clerkUser.fullName ||
              `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();
            const primaryEmail =
              clerkUser.primaryEmailAddress?.emailAddress ||
              clerkUser.emailAddresses?.[0]?.emailAddress ||
              "";
            if (fullName) {
              const key = (primaryEmail || fullName).toLowerCase().trim();
              const existing = studentMap.get(key);
              studentMap.set(key, {
                id: clerkUser.id || existing?.id || "clerk-user",
                name: fullName,
                email: primaryEmail || existing?.email || "",
                status: existing?.status || "Active",
                enrolledCount: existing?.enrolledCount ?? 0,
                track: existing?.track,
              });
            }
          }
        } catch {}

        try {
          if (session?.name && session.role !== "admin" && session.role !== "instructor") {
            const key = (session.email || session.name).toLowerCase().trim();
            const existing = studentMap.get(key);
            studentMap.set(key, {
              id: (session as any)?.id || existing?.id || "mock-session-user",
              name: session.name,
              email: session.email || existing?.email || "",
              status: existing?.status || "Active",
              enrolledCount: existing?.enrolledCount ?? 0,
              track: existing?.track,
            });
          }
        } catch {}
      }

      // 5. Official Admin Students from API (highest fidelity)
      students.forEach((st) => {
        if (!st.name) return;
        const key = (st.email || st.name || st.id).toLowerCase().trim();
        const firstEnrollment = st.enrollments?.[0];
        studentMap.set(key, {
          id: st.id,
          name: st.name,
          email: st.email || "",
          phone: st.phone,
          status: st.status || "Active",
          enrolledCount: st.totalEnrolled || st.enrollments?.length || 0,
          track: firstEnrollment?.track,
        });
      });

      const studentResults: SearchResultItem[] = [];
      const isInstructorWorkspace = pathname.startsWith("/instructor");
      const isAdminWorkspace = pathname.startsWith("/admin");
      const isStudentWorkspace = pathname.startsWith("/dashboard");

      studentMap.forEach((st) => {
        const targetHref = isInstructorWorkspace
          ? `/instructor/students?search=${encodeURIComponent(st.name)}`
          : isAdminWorkspace
          ? `/admin/students?search=${encodeURIComponent(st.name)}`
          : isStudentWorkspace
          ? `/dashboard/leaderboard`
          : `/admin/students?search=${encodeURIComponent(st.name)}`;

        const subtitleParts: string[] = [];
        if (st.email) subtitleParts.push(st.email);
        if (st.phone) subtitleParts.push(st.phone);
        if (st.track) subtitleParts.push(`${st.track} Track`);
        subtitleParts.push(`${st.enrolledCount} Enrolled Course(s)`);

        const nameTokens = st.name.toLowerCase().split(/\s+/).filter(Boolean);

        studentResults.push({
          id: `student-${st.id}`,
          title: st.name,
          subtitle: subtitleParts.join(" • "),
          category: "Students",
          href: targetHref,
          icon: Users,
          badge: st.status === "BLOCKED" ? "Blocked" : st.status === "ON_HOLD" ? "On Hold" : "Student",
          badgeColor:
            st.status === "Active" || st.status === "ACTIVE"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
              : st.status === "BLOCKED"
              ? "bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-400"
              : "bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300",
          tags: [
            "student",
            "students",
            "learner",
            "enrolled",
            "candidate",
            st.name.toLowerCase(),
            ...nameTokens,
            ...(st.email ? [st.email.toLowerCase(), st.email.split("@")[0].toLowerCase()] : []),
            ...(st.phone ? [st.phone.replace(/[^0-9]/g, "")] : []),
            ...(st.track ? [st.track.toLowerCase()] : []),
          ],
        });
      });

      return studentResults;
    };

    // --- 1. ADMIN MODE ITEMS ---
    if (effectiveMode === "admin") {
      // Students
      items.push(...buildStudentSearchItems());

      // Tutors
      const tutorList = tutors;

      tutorList.forEach((tut) => {
        items.push({
          id: `admin-tutor-${tut.id}`,
          title: tut.name,
          subtitle: `${tut.role} • ${tut.email} • ${tut.assignedCourses ?? 0} Assigned Course(s)`,
          category: "Tutors",
          href: "/admin/tutors",
          icon: GraduationCap,
          badge: "Tutor",
          badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300",
          tags: ["tutor", "instructor", "faculty", "mentor", tut.name.toLowerCase(), tut.email],
        });
      });

      // Courses
      courses.forEach((c) => {
        items.push({
          id: `admin-course-${c.slug || c.id}`,
          title: c.title,
          subtitle: `${c.track} Track • ₹${c.price.toLocaleString()} • ${c.durationWeeks || 12} Weeks • ${c.status}`,
          category: "Courses",
          href: `/admin/courses`,
          icon: BookOpen,
          badge: c.status,
          badgeColor: c.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700",
          tags: ["course", c.track.toLowerCase(), c.slug, c.summary?.toLowerCase() || ""],
        });
      });

      // Admin Sections & Tools
      items.push(
        {
          id: "admin-nav-dashboard",
          title: "Admin Dashboard Overview",
          subtitle: "Executive KPIs, real-time admissions, and platform metrics",
          category: "Operations",
          href: "/admin",
          icon: Activity,
          badge: "Overview",
        },
        {
          id: "admin-nav-tutors",
          title: "Tutors Directory & Onboarding",
          subtitle: "Manage authorized tutors, assign tracks, and onboard new faculty",
          category: "Tutors",
          href: "/admin/tutors",
          icon: GraduationCap,
          badge: "Tutor",
        },
        {
          id: "admin-nav-batches",
          title: "Batches & Cohort Hierarchy",
          subtitle: "Live drilldown: Tutors → Assigned Curricula → Cohort Students",
          category: "Batches",
          href: "/admin/batches",
          icon: FolderTree,
          badge: "Live",
        },
        {
          id: "admin-nav-courses-new",
          title: "Create New Course Curriculum",
          subtitle: "Build syllabus, upload lectures, add MCQ assessments & coding tests",
          category: "Courses",
          href: "/admin/courses/new",
          icon: BookOpen,
          badge: "Builder",
        },
        {
          id: "admin-nav-syllabus",
          title: "Syllabus Curriculum Templates",
          subtitle: "Enterprise course curriculum structures and topic breakdowns",
          category: "Batches",
          href: "/admin/syllabus",
          icon: FileText,
        },
        {
          id: "admin-nav-events",
          title: "Events & Masterclasses Manager",
          subtitle: "Schedule live webinars, track participant seats and registration emails",
          category: "Operations",
          href: "/admin/events",
          icon: Calendar,
          badge: "Webinars",
        },
        {
          id: "admin-nav-assessments",
          title: "Assessments & Question Bank",
          subtitle: "Review student submissions, grading evaluations, and MCQs",
          category: "Assessments",
          href: "/admin/assessments",
          icon: ClipboardCheck,
        },
        {
          id: "admin-nav-certificates",
          title: "Certificates & Accreditations",
          subtitle: "Issue verifiable course certificates and inspect cryptographic IDs",
          category: "Operations",
          href: "/admin/certificates",
          icon: Award,
        },
        {
          id: "admin-nav-activity",
          title: "Activity Logs & System Audits",
          subtitle: "Comprehensive audit trails of logins, course updates, and student registrations",
          category: "Operations",
          href: "/admin/activity-logs",
          icon: Activity,
        },
        {
          id: "admin-nav-leads",
          title: "Leads & Prospective Student CRM",
          subtitle: "Track inquiries, follow-ups, and student admissions funnel",
          category: "Operations",
          href: "/admin/leads",
          icon: Megaphone,
        },
        {
          id: "admin-nav-payments",
          title: "Invoices & Revenue Transactions",
          subtitle: "Payment verification, invoice generation, and revenue statements",
          category: "Operations",
          href: "/admin/payments",
          icon: CreditCard,
        },
        {
          id: "admin-nav-analytics",
          title: "Platform Analytics & Reports",
          subtitle: "Course completion rates, enrollment trajectory, and student retention",
          category: "Operations",
          href: "/admin/analytics",
          icon: TrendingUp,
        },
        {
          id: "admin-nav-settings",
          title: "Admin System Settings & Policies",
          subtitle: "Notification policies, security preferences, and system parameters",
          category: "Operations",
          href: "/admin/settings",
          icon: Settings,
        }
      );
    }

    // --- 2. INSTRUCTOR WORKSPACE ITEMS ---
    if (effectiveMode === "instructor") {
      // Students Roster
      items.push(...buildStudentSearchItems());

      // Courses
      courses.forEach((c) => {
        items.push({
          id: `instructor-course-${c.slug || c.id}`,
          title: c.title,
          subtitle: `${c.track} Track • ${c.durationWeeks || 12} Weeks • Lead Tutor: ${c.instructorName || "Davood Khan"}`,
          category: "Courses",
          href: `/instructor/courses`,
          icon: BookOpen,
          badge: c.status || "Assigned",
          badgeColor: "bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300",
          tags: ["course", "curriculum", c.track.toLowerCase(), c.slug],
        });
      });

      // Instructor Hub Tools
      items.push(
        {
          id: "inst-dashboard",
          title: "Tutor Dashboard",
          subtitle: "Learner progress and cohort updates",
          category: "Operations",
          href: "/instructor",
          icon: Activity,
          badge: "Overview",
        },
        {
          id: "inst-courses",
          title: "Assigned Courses & Curricula",
          subtitle: "Manage video modules, assignments, and curriculum structure",
          category: "Courses",
          href: "/instructor/courses",
          icon: BookOpen,
        },
        {
          id: "inst-courses-new",
          title: "Create New Course Curriculum",
          subtitle: "Upload lectures, define topics, and configure coding tests",
          category: "Courses",
          href: "/instructor/courses/new",
          icon: BookOpen,
          badge: "Builder",
        },
        {
          id: "inst-students",
          title: "Student Roster & Cohort Progress",
          subtitle: "View enrolled students, video completion percentage, and milestones",
          category: "Students",
          href: "/instructor/students",
          icon: Users,
          badge: "Roster",
        },
        {
          id: "inst-assessments",
          title: "Student Assessments & Submissions",
          subtitle: "Grade coding submissions, project files, and review AI anti-skip metrics",
          category: "Assessments",
          href: "/instructor/assessments",
          icon: ClipboardCheck,
        },
        {
          id: "inst-batches",
          title: "Batches & Class Schedules",
          subtitle: "Assigned cohort schedules, meeting links, and timing slots",
          category: "Batches",
          href: "/instructor/batches",
          icon: FolderTree,
        },
        {
          id: "inst-syllabus",
          title: "Syllabus Curriculum Planner",
          subtitle: "Design enterprise syllabus structures and weekly topic outlines",
          category: "Batches",
          href: "/instructor/syllabus",
          icon: FileText,
        },
        {
          id: "inst-analytics",
          title: "Tutor Analytics",
          subtitle: "Student watch times, quiz pass rates, and assignment completion velocity",
          category: "Operations",
          href: "/instructor/analytics",
          icon: TrendingUp,
        },
        {
          id: "inst-profile",
          title: "Tutor Profile",
          subtitle: "Bio, teaching credentials, and assigned department tracks",
          category: "Operations",
          href: "/instructor/profile",
          icon: User,
        }
      );
    }

    // --- 3. STUDENT WORKSPACE ITEMS ---
    if (effectiveMode === "student") {
      // Courses
      courses.forEach((c) => {
        items.push({
          id: `student-course-${c.slug}`,
          title: c.title,
          subtitle: `${c.track} Track • ${c.durationWeeks || 12} Weeks • Lead Tutor: ${c.instructorName || "Davood Khan"}`,
          category: "Courses",
          href: `/dashboard/my-courses/${c.slug}`,
          icon: BookOpen,
          badge: "Enrolled",
          badgeColor: "bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300",
          tags: ["course", "lessons", "video", c.track.toLowerCase(), c.slug],
        });

        // Add key modules from sections if available
        if (c.sections && c.sections.length > 0) {
          c.sections.slice(0, 4).forEach((sec, sIdx) => {
            items.push({
              id: `sec-${c.slug}-${sIdx}`,
              title: `${c.title} — ${sec.title}`,
              subtitle: `Module: ${sec.description || "Video lessons & assignments"}`,
              category: "Courses",
              href: `/dashboard/my-courses/${c.slug}`,
              icon: FileText,
              badge: "Lesson",
              tags: ["module", "chapter", "lesson", sec.title.toLowerCase()],
            });
          });
        }
      });

      // Student Tools & Hub
      items.push(
        {
          id: "std-dashboard",
          title: "Student Dashboard",
          subtitle: "Your active learning metrics, streak, and enrolled curriculum progress",
          category: "Courses",
          href: "/dashboard",
          icon: BookOpen,
          badge: "Home",
        },
        {
          id: "std-my-courses",
          title: "My Enrolled Courses & Lectures",
          subtitle: "Browse video lessons, track milestones, and download course assets",
          category: "Courses",
          href: "/dashboard/my-courses",
          icon: BookOpen,
        },
        {
          id: "std-assessments",
          title: "Course Assessments & Coding Tests",
          subtitle: "Hands-on projects, MCQ evaluations, and tutor grading feedback",
          category: "Assessments",
          href: "/dashboard/assessments",
          icon: ClipboardCheck,
          badge: "Graded",
        },
        {
          id: "std-quizzes",
          title: "Knowledge Quizzes & Practice MCQs",
          subtitle: "Test your skills with speed quizzes and track your accuracy",
          category: "Assessments",
          href: "/dashboard/quizzes",
          icon: ClipboardCheck,
        },
        {
          id: "std-ai-interview",
          title: "AI Mock Interview Simulator",
          subtitle: "Realistic voice/scenario technical interviews with instant AI reports",
          category: "AI Tools",
          href: "/dashboard/ai-interview",
          icon: BrainCircuit,
          badge: "AI Powered",
          badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
        },
        {
          id: "std-ai-report",
          title: "AI Interview Evaluation Report",
          subtitle: "Comprehensive review of your strengths, grammar, and technical depth",
          category: "AI Tools",
          href: "/dashboard/ai-interview/report",
          icon: BrainCircuit,
        },
        {
          id: "std-resume-builder",
          title: "AI Resume Maker & ATS Optimizer",
          subtitle: "Create industry-standard resumes tailored for top tech job descriptions",
          category: "AI Tools",
          href: "/dashboard/resume-builder",
          icon: FileText,
          badge: "New",
          badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
        },
        {
          id: "std-certificates",
          title: "Certificates of Completion",
          subtitle: "View, download, and share your official JKS Learning verified credentials",
          category: "Account",
          href: "/dashboard/certificates",
          icon: Award,
          badge: "Verified",
        },
        {
          id: "std-leaderboard",
          title: "Student XP Leaderboard",
          subtitle: "Rankings among batchmates based on test scores and video watch streaks",
          category: "Courses",
          href: "/dashboard/leaderboard",
          icon: Trophy,
        },
        {
          id: "std-playground",
          title: "Live Code Playground",
          subtitle: "Interactive in-browser IDE for Java, JavaScript, Python, and SQL",
          category: "AI Tools",
          href: "/dashboard/playground",
          icon: Code2,
        },
        {
          id: "std-bookmarks",
          title: "Saved Bookmarks & Video Notes",
          subtitle: "Quickly review lessons and questions you marked during your studies",
          category: "Courses",
          href: "/dashboard/bookmarks",
          icon: Bookmark,
        },
        {
          id: "std-payments",
          title: "Invoices, Receipts & Billing",
          subtitle: "View fee breakdown, download official tax receipts, and payment history",
          category: "Account",
          href: "/dashboard/payments",
          icon: CreditCard,
        },
        {
          id: "std-profile",
          title: "Student Profile & Security",
          subtitle: "Update your avatar, contact phone number, and password settings",
          category: "Account",
          href: "/dashboard/profile",
          icon: User,
        }
      );
    }

    // --- 3. PUBLIC MARKETING ITEMS ---
    if (effectiveMode === "public") {
      // 1. Courses Catalog & Engineering Tracks
      courses.forEach((c) => {
        items.push({
          id: `pub-course-${c.slug || c.id}`,
          title: c.title,
          subtitle: `${c.track} Track • ${c.durationWeeks || 12} Weeks • ₹${c.price.toLocaleString()} • Lead Tutor: ${c.instructorName || "Davood Khan"}`,
          category: "Courses",
          href: c.slug ? `/courses/${c.slug}` : `/courses`,
          icon: BookOpen,
          badge: "Course",
          badgeColor: "bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300",
          tags: [
            "course",
            "courses",
            "curriculum",
            "syllabus",
            "catalog",
            c.track.toLowerCase(),
            c.slug.toLowerCase(),
            ...(c.subTrack ? [c.subTrack.toLowerCase()] : []),
            ...(c.summary ? [c.summary.toLowerCase()] : []),
          ],
        });
      });

      // Key Curated Tracks
      items.push(
        {
          id: "pub-track-java",
          title: "Java Full Stack Developer Track",
          subtitle: "Java 21, Spring Boot, Microservices, Docker, React, AWS Cloud",
          category: "Courses",
          href: "/courses",
          icon: Laptop,
          badge: "Most Popular",
          tags: ["course", "courses", "java", "spring boot", "backend", "full stack", "docker", "aws"],
        },
        {
          id: "pub-track-react",
          title: "Modern Frontend Engineering Track",
          subtitle: "React 19, Next.js App Router, TypeScript, Tailwind, System Design",
          category: "Courses",
          href: "/courses",
          icon: Laptop,
          badge: "High Demand",
          tags: ["course", "courses", "frontend", "react", "nextjs", "javascript", "typescript", "tailwind"],
        },
        {
          id: "pub-track-sap",
          title: "SAP S/4HANA Enterprise Systems Track",
          subtitle: "ABAP Cloud, Fiori, RICEFW, Enterprise MM/SD integration",
          category: "Courses",
          href: "/courses",
          icon: Laptop,
          badge: "Enterprise",
          tags: ["course", "courses", "sap", "abap", "s4hana", "erp", "fiori", "ricefw"],
        },
        {
          id: "pub-track-dotnet",
          title: ".NET 9 Enterprise Microservices Track",
          subtitle: "C# 13, ASP.NET Core, Entity Framework, Azure Serverless",
          category: "Courses",
          href: "/courses",
          icon: Laptop,
          badge: "Cloud",
          tags: ["course", "courses", "dotnet", "c#", "azure", "microservices", "aspnet"],
        },
        {
          id: "pub-track-python",
          title: "Python Machine Learning & AI Engineering Track",
          subtitle: "NumPy, Pandas, PyTorch, Scikit-learn, Neural Networks & NLP",
          category: "Courses",
          href: "/courses",
          icon: Laptop,
          badge: "AI Track",
          tags: ["course", "courses", "python", "machine learning", "ai", "deep learning", "pytorch"],
        },
        {
          id: "pub-catalog-hub",
          title: "Browse All Engineering Courses",
          subtitle: "Explore all industry-grade engineering tracks, JKS master series & verified certifications",
          category: "Courses",
          href: "/courses",
          icon: BookOpen,
          badge: "Catalog",
          tags: ["course", "courses", "all courses", "browse", "catalog"],
        }
      );

      // 2. Success Stories & Verified Alumni Placements
      items.push({
        id: "pub-stories-overview",
        title: "Student Success Stories & Placements",
        subtitle: "Read verified placement records, salary hikes, and alumni reviews at top tech firms",
        category: "Stories",
        href: "/success-stories",
        icon: Trophy,
        badge: "Verified Placements",
        badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
        tags: ["success", "stories", "story", "placements", "reviews", "alumni", "hiring", "jobs"],
      });

      TESTIMONIALS.forEach((t) => {
        items.push({
          id: `pub-story-${t.id}`,
          title: `${t.name} — ${t.role}`,
          subtitle: `${t.company} • ${t.salaryHike || ""} • Capstone: ${t.capstone}`,
          category: "Stories",
          href: "/success-stories",
          icon: Award,
          badge: t.placedCompany || "Placed",
          badgeColor: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300",
          tags: [
            "success",
            "story",
            "stories",
            "placement",
            "alumni",
            "testimonial",
            t.name.toLowerCase(),
            t.placedCompany.toLowerCase(),
            t.track.toLowerCase(),
            ...(t.role ? t.role.toLowerCase().split(/\s+/) : []),
          ],
        });
      });

      items.push({
        id: "pub-hiring-partners",
        title: "Top Hiring Partners Network",
        subtitle: "Deloitte, Razorpay, Infosys, PwC, Swiggy, Capgemini, Oracle, TCS, IBM & more",
        category: "Stories",
        href: "/success-stories",
        icon: Users,
        badge: "Hiring Partners",
        tags: ["deloitte", "razorpay", "infosys", "pwc", "swiggy", "capgemini", "oracle", "tcs", "ibm", "partners", "companies"],
      });

      // 3. AI Mock Interview Practice & Diagnostic Reports
      items.push(
        {
          id: "pub-ai-interview-main",
          title: "AI Mock Interview Practice Simulator",
          subtitle: "Simulate real engineering interviews with real-time adaptive questioning & scoring",
          category: "AI Tools",
          href: "/ai-mock-interview",
          icon: BrainCircuit,
          badge: "AI Powered",
          badgeColor: "bg-blue-50 text-[#2563EB] dark:bg-blue-950/50 dark:text-blue-300",
          tags: ["ai", "mock", "interview", "simulator", "practice", "system design", "coding", "technical interview"],
        },
        {
          id: "pub-ai-adaptive",
          title: "Adaptive Technical & System Design Questioning",
          subtitle: "Non-linear conversational AI calibrated to React, Java Spring, SAP S/4HANA & Microservices",
          category: "AI Tools",
          href: "/ai-mock-interview",
          icon: Sparkles,
          badge: "Adaptive",
          tags: ["ai", "adaptive", "questions", "interview", "react", "java", "sap", "dotnet", "system design"],
        },
        {
          id: "pub-ai-diagnostic",
          title: "Instant 5-Axis Diagnostic Reports",
          subtitle: "Scored across Technical Depth, Problem Solving, Communication, Answer Quality & Confidence",
          category: "AI Tools",
          href: "/ai-mock-interview",
          icon: ClipboardCheck,
          badge: "Report",
          tags: ["ai", "diagnostic", "score", "feedback", "report", "evaluation", "metrics"],
        },
        {
          id: "pub-ai-roadmap",
          title: "Targeted Interview Action Roadmap",
          subtitle: "Identified weak spots automatically convert into an actionable study checklist with direct lesson links",
          category: "AI Tools",
          href: "/ai-mock-interview",
          icon: TrendingUp,
          badge: "Roadmap",
          tags: ["ai", "roadmap", "action plan", "study checklist", "interview prep"],
        }
      );

      // 4. Live Events, Webinars & Bootcamps
      items.push(
        {
          id: "pub-event-webinars",
          title: "Live Tech Masterclasses & Interactive Webinars",
          subtitle: "Weekly live coding workshops, system architecture sessions & faculty Q&A",
          category: "Events",
          href: "/events",
          icon: Calendar,
          badge: "Upcoming",
          badgeColor: "bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300",
          tags: ["event", "events", "webinar", "masterclass", "workshop", "live", "session"],
        },
        {
          id: "pub-event-bootcamp",
          title: "Enterprise Architecture Weekend Bootcamp",
          subtitle: "Deep dive into distributed systems, event streams, and real-time Kafka",
          category: "Events",
          href: "/events",
          icon: Calendar,
          badge: "Free Registration",
          tags: ["event", "events", "bootcamp", "kafka", "microservices", "architecture"],
        },
        {
          id: "pub-event-cloud",
          title: "Cloud Native Microservices & Docker Hands-On",
          subtitle: "Container orchestration, API gateways, and production CI/CD workflows",
          category: "Events",
          href: "/events",
          icon: Calendar,
          badge: "Interactive",
          tags: ["event", "events", "cloud", "docker", "kubernetes", "microservices"],
        },
        {
          id: "pub-event-sap",
          title: "SAP S/4HANA Migration & Clean Core Masterclass",
          subtitle: "Enterprise ERP modernization, ABAP Cloud, and Fiori architectural design",
          category: "Events",
          href: "/events",
          icon: Calendar,
          badge: "Enterprise",
          tags: ["event", "events", "sap", "s4hana", "abap", "fiori", "erp"],
        }
      );

      // 5. About Page & Platform Philosophy
      items.push(
        {
          id: "pub-about-main",
          title: "About JKS Learning",
          subtitle: "Learn Today. Build Tomorrow — Our mission, enterprise credentials & curriculum philosophy",
          category: "About",
          href: "/about",
          icon: Users,
          badge: "About Us",
          tags: ["about", "about page", "jks", "jks learning", "mission", "vision", "who we are", "overview"],
        },
        {
          id: "pub-about-why",
          title: "Why JKS Learning — The Core Advantage",
          subtitle: "Anti-skip video enforcement, verified credentials, and production-grade project training",
          category: "About",
          href: "/about",
          icon: Award,
          badge: "Advantage",
          tags: ["about", "why jks", "methodology", "anti-skip", "verification", "hands-on"],
        },
        {
          id: "pub-about-faculty",
          title: "Expert Mentors & Faculty",
          subtitle: "Meet Davood Khan (Lead Full Stack), Dr. Rohit Kapoor (Cloud & SAP) & industry leaders",
          category: "About",
          href: "/about",
          icon: GraduationCap,
          badge: "Mentors",
          tags: ["about", "mentors", "faculty", "tutors", "davood", "rohit", "instructors", "teachers"],
        },
        {
          id: "pub-about-experience",
          title: "Learning That Goes Beyond The Classroom",
          subtitle: "Real-world capstones, peer code reviews, mock interviews, and career readiness",
          category: "About",
          href: "/about",
          icon: Laptop,
          badge: "Experience",
          tags: ["about", "experience", "journey", "capstone", "careers", "beyond classroom"],
        }
      );

      // 6. Admissions & Account Pages
      items.push(
        {
          id: "pub-page-enroll",
          title: "Course Enrollment & Admissions",
          subtitle: "Apply and reserve your seat for upcoming cohort batches",
          category: "Pages",
          href: "/register-course",
          icon: ArrowRight,
          badge: "Apply",
          tags: ["admissions", "enroll", "apply", "register course", "batch"],
        },
        {
          id: "pub-page-register",
          title: "Create Student Account",
          subtitle: "Sign up for free webinars, coding playgrounds, and learning resources",
          category: "Pages",
          href: "/register",
          icon: User,
          tags: ["register", "sign up", "create account", "new user"],
        },
        {
          id: "pub-page-login",
          title: "Sign In",
          subtitle: "Access your dashboard, lecture recordings, and mock tests",
          category: "Pages",
          href: "/login",
          icon: User,
          tags: ["login", "sign in", "portal", "student login"],
        }
      );
    }

    return items;
  }, [effectiveMode, courses, tutors, students, leaderboardUsers, pathname]);

  const matchesQuery = useCallback((item: SearchResultItem, q: string) => {
    const words = q.split(/\s+/).filter(Boolean);
    const textToSearch = `${item.title} ${item.subtitle || ""} ${item.category} ${(item.tags || []).join(" ")}`.toLowerCase();
    return words.every((word) => textToSearch.includes(word));
  }, []);

  // Everything matching the typed text, before the category filter is applied.
  const queryMatches = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    return allItems.filter((item) => matchesQuery(item, q));
  }, [allItems, query, matchesQuery]);

  // Filter tabs, with the number of results each one would show for this query.
  const categories = useMemo(() => {
    const set = new Set<string>();
    allItems.forEach((i) => set.add(i.category));
    return ["All", ...Array.from(set)];
  }, [allItems]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: queryMatches.length };
    queryMatches.forEach((i) => {
      counts[i.category] = (counts[i.category] || 0) + 1;
    });
    return counts;
  }, [queryMatches]);

  // Only populate when the user enters text
  const filteredResults = useMemo(() => {
    if (activeCategory === "All") return queryMatches;
    return queryMatches.filter((item) => item.category === activeCategory);
  }, [queryMatches, activeCategory]);

  // Adjust selectedIndex if it goes out of bounds
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Auto-scroll active item into view during keyboard navigation
  useEffect(() => {
    if (!listRef.current) return;
    const selectedEl = listRef.current.querySelector<HTMLElement>(`[data-index="${selectedIndex}"]`);
    if (selectedEl) {
      selectedEl.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  // Handle keyboard navigation inside the list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredResults.length ? prev + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredResults.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const current = filteredResults[selectedIndex];
      if (current) {
        handleSelect(current);
      }
    }
  };

  const handleSelect = (item: SearchResultItem) => {
    handleClose();
    if (item.external) {
      window.open(item.href, "_blank");
    } else {
      router.push(item.href);
    }
  };

  // Popular search recommendations when query is empty
  const popularSuggestions = useMemo(() => {
    if (effectiveMode === "admin") {
      return ["Students Directory", "Davood Khan", "Batches", "Courses", "Analytics", "Activity Logs"];
    }
    if (effectiveMode === "student") {
      return ["Java Full Stack", "AI Mock Interview", "Assessments", "Resume Builder", "Leaderboard", "Code Playground"];
    }
    return [
      "Java Full Stack",
      "AI Mock Interview",
      "Success Stories",
      "Python Machine Learning",
      "SAP S/4HANA",
      "Live Masterclass",
      "About JKS Learning",
    ];
  }, [effectiveMode]);

  // Helper for category tab icons
  const getCategoryIcon = (cat: string) => {
    switch (cat.toLowerCase()) {
      case "all":
        return Sparkles;
      case "courses":
        return BookOpen;
      case "stories":
        return Trophy;
      case "ai tools":
        return BrainCircuit;
      case "events":
        return Calendar;
      case "about":
        return Users;
      case "pages":
        return FileText;
      case "tutors":
        return GraduationCap;
      case "assessments":
        return ClipboardCheck;
      case "students":
        return Users;
      case "batches":
        return FolderTree;
      case "operations":
        return Activity;
      case "account":
        return User;
      default:
        return Search;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-2.5 sm:p-5 md:p-8 pt-[3vh] sm:pt-[6vh] md:pt-[8vh] overflow-y-auto">
          {/* Smooth Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={handleClose}
            className="fixed inset-0 bg-slate-950/60 dark:bg-black/80 backdrop-blur-md"
            aria-hidden
          />

          {/* Modal Dialog with Spring Opening Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: -20, filter: "blur(4px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.95, y: -16, filter: "blur(2px)" }}
            transition={{
              type: "spring",
              damping: 26,
              stiffness: 340,
              mass: 0.75,
            }}
            className="relative w-full max-w-2xl lg:max-w-3xl overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/90 dark:border-slate-800/90 bg-white dark:bg-[#0B132B] shadow-[0_25px_70px_rgba(15,23,42,0.25)] dark:shadow-[0_25px_70px_rgba(0,0,0,0.85)] ring-1 ring-black/5 dark:ring-white/10 z-10 flex flex-col max-h-[88vh] sm:max-h-[82vh]"
            onKeyDown={handleKeyDown}
          >
            {/* Search Header Bar */}
            <div className="flex items-center gap-2.5 sm:gap-3.5 border-b border-slate-100 dark:border-slate-800/80 px-3.5 sm:px-5 py-3 sm:py-3.5 bg-slate-50/60 dark:bg-surface/50">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 shrink-0 shadow-2xs">
                <Search className="h-4.5 w-4.5 sm:h-5 sm:w-5 stroke-[2.2]" />
              </div>

              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={
                  effectiveMode === "admin"
                    ? "Search students, tutors, courses, batches, logs…"
                    : effectiveMode === "student"
                    ? "Search courses, modules, quizzes, interviews, notes…"
                    : "Search courses, success stories, AI mock interview, events, about…"
                }
                className="w-full bg-transparent text-sm sm:text-base md:text-lg font-medium text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none"
              />

              {/* Clear button if text entered */}
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery("");
                    inputRef.current?.focus();
                  }}
                  className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                  aria-label="Clear search query"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* ESC Key Badge (Desktop) */}
              <kbd className="hidden sm:inline-flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/80 px-2 py-1 text-[11px] font-mono font-bold text-slate-400 dark:text-slate-400 shadow-2xs shrink-0">
                ESC
              </kbd>

              {/* Mobile Explicit Close Button */}
              <button
                type="button"
                onClick={handleClose}
                className="flex sm:hidden h-8 w-8 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-200/60 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer shrink-0"
                aria-label="Close search modal"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 px-3.5 sm:px-5 py-2.5 border-b border-slate-100 dark:border-slate-800/60 overflow-x-auto scrollbar-none bg-white/80 dark:bg-surface/30">
              <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1 shrink-0">
                Filter:
              </span>
              {categories.map((cat) => {
                const active = activeCategory === cat;
                const CatIcon = getCategoryIcon(cat);
                const count = categoryCounts[cat] ?? 0;
                const hasQuery = query.trim().length > 0;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveCategory(cat)}
                    className={`group flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? "bg-[#2563EB] text-white shadow-xs shadow-blue-500/25 scale-100"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/70"
                    }`}
                  >
                    <CatIcon className={`h-3.5 w-3.5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200"}`} />
                    <span>{cat}</span>
                    {hasQuery && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                          active
                            ? "bg-white/20 text-white"
                            : "bg-slate-200/60 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Search Content Area */}
            <div
              ref={listRef}
              className="custom-modal-scrollbar flex-1 overflow-y-auto p-2 sm:p-3 divide-y divide-slate-100/60 dark:divide-slate-800/40 min-h-[220px] max-h-[500px]"
            >
              {!query.trim() ? (
                /* Clean Initial Empty State — No preloaded data */
                <div className="flex flex-col items-center justify-center py-10 sm:py-14 px-4 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 mb-3 shadow-2xs">
                    <Search className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
                    Search JKS Learning
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1 leading-relaxed">
                    {effectiveMode === "public"
                      ? "Search courses, success stories, AI mock interview, events, and about page."
                      : "Start typing to search courses, modules, assessments, mock interviews, tutors, and learning tools."}
                  </p>

                  {/* Quick Search Suggestions */}
                  <div className="mt-5 w-full max-w-md">
                    <div className="flex items-center justify-center gap-1.5 text-[10.5px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                      <span>Popular Suggestions</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
                      {popularSuggestions.map((topic) => (
                        <button
                          key={topic}
                          type="button"
                          onClick={() => {
                            setQuery(topic);
                            inputRef.current?.focus();
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 hover:border-blue-400 hover:text-[#2563EB] dark:hover:text-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
                        >
                          <Search className="h-3 w-3 text-slate-400" />
                          <span>{topic}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : filteredResults.length > 0 ? (
                /* Dynamic Matching Results while entering data */
                filteredResults.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.id}
                      data-index={index}
                      onMouseEnter={() => setSelectedIndex(index)}
                      onClick={() => handleSelect(item)}
                      className={`group flex items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl cursor-pointer transition-all ${
                        isSelected
                          ? "bg-blue-50/90 dark:bg-blue-950/45 border border-blue-200/60 dark:border-blue-800/60 text-slate-900 dark:text-white shadow-2xs"
                          : "border border-transparent hover:bg-slate-50/80 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl transition-all ${
                            isSelected
                              ? "bg-[#2563EB] text-white shadow-sm shadow-blue-600/30 scale-102"
                              : "bg-slate-100 dark:bg-slate-800/90 text-slate-600 dark:text-slate-300 group-hover:bg-blue-100 dark:group-hover:bg-blue-900/40 group-hover:text-[#2563EB]"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              <HighlightMatch text={item.title} query={query} />
                            </span>
                            {item.badge && (
                              <span
                                className={`shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold ${
                                  item.badgeColor ||
                                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 hidden sm:inline">
                          {item.category}
                        </span>
                        <div
                          className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-blue-600 text-white shadow-2xs translate-x-0.5"
                              : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 group-hover:translate-x-0.5"
                          }`}
                        >
                          <CornerDownLeft className="h-3.5 w-3.5" />
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                /* No matching results state */
                <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mb-3">
                    <Search className="h-6 w-6 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    No matching results found
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mt-1">
                    We couldn&apos;t find anything matching &quot;{query}&quot;. Try searching for courses, tutors, topics, or system modules.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
                    className="mt-4 px-3.5 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer Navigation Help */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 px-4 sm:px-5 py-2.5 bg-slate-50/70 dark:bg-surface-elevated/40 text-[11px] text-slate-500 dark:text-slate-400">
              {/* Desktop keyboard cues */}
              <div className="hidden sm:flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                    ↑
                  </kbd>
                  <kbd className="rounded bg-white dark:bg-slate-800 px-1 py-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                    ↓
                  </kbd>
                  <span>navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                    ↵
                  </kbd>
                  <span>select</span>
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-mono shadow-2xs">
                    ESC
                  </kbd>
                  <span>close</span>
                </span>
              </div>

              {/* Mobile touch cue */}
              <div className="sm:hidden text-[10px] text-slate-400 font-medium">
                Tap any result to open
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {filteredResults.length}
                </span>
                <span>results</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/**
 * Helper to highlight matching characters/words in search results.
 */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query || !query.trim()) return <>{text}</>;

  const words = query.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return <>{text}</>;

  const escaped = words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark
            key={i}
            className="bg-blue-100 dark:bg-blue-900/60 text-[#2563EB] dark:text-blue-300 font-bold px-0.5 rounded"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

/**
 * Sleek Search Trigger Button to embed directly in Topbars or Headers.
 */
export function GlobalSearchTrigger({
  className = "",
  placeholder = "Search anything…",
  variant = "bar",
}: {
  className?: string;
  placeholder?: string;
  variant?: "bar" | "icon" | "compact" | "ghost";
}) {
  if (variant === "ghost") {
    return (
      <button
        type="button"
        onClick={openGlobalSearch}
        aria-label="Search courses, tutors, and platform (⌘K)"
        title="Search (⌘K)"
        className={`group relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-transparent bg-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-900/[0.06] dark:hover:bg-white/10 transition-all duration-200 cursor-pointer active:scale-95 ${className}`}
      >
        <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px] stroke-[2.2] transition-transform duration-200 group-hover:scale-110" />
        <span className="sr-only">Search</span>
      </button>
    );
  }

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={openGlobalSearch}
        aria-label="Search courses, tracks, and platform (⌘K)"
        title="Search (⌘K)"
        className={`group relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-surface/60 text-slate-700 dark:text-slate-200 hover:text-[#2563EB] dark:hover:text-blue-400 hover:border-blue-400/60 dark:hover:border-blue-500/60 hover:bg-blue-50/60 dark:hover:bg-blue-950/40 transition-all duration-200 shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer ${className}`}
      >
        <Search className="h-4 w-4 sm:h-[18px] sm:w-[18px] stroke-[2.2] transition-transform duration-200 group-hover:scale-110" />
        <span className="sr-only">Search</span>
      </button>
    );
  }

  if (variant === "compact") {
    return (
      <button
        type="button"
        onClick={openGlobalSearch}
        aria-label="Search (⌘K)"
        className={`group flex items-center gap-2 rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/80 dark:bg-surface/60 px-2.5 py-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-[#2563EB] hover:border-blue-400/60 transition-all cursor-pointer shadow-2xs active:scale-95 ${className}`}
      >
        <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors" />
        <kbd className="rounded bg-white dark:bg-slate-800 px-1.5 py-0.5 border border-slate-200 dark:border-slate-700 text-[10px] font-mono font-bold text-slate-400">
          ⌘K
        </kbd>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={openGlobalSearch}
      className={`group flex items-center justify-between gap-2.5 rounded-xl border border-slate-200/80 dark:border-slate-700/80 bg-slate-50/70 dark:bg-surface/60 px-3 py-1.5 sm:py-2 text-xs text-slate-500 dark:text-slate-400 hover:border-[#2563EB]/60 dark:hover:border-blue-500/60 hover:bg-white dark:hover:bg-surface-elevated transition-all cursor-pointer shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-2 min-w-0">
        <Search className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB] dark:group-hover:text-blue-400 transition-colors shrink-0" />
        <span className="truncate font-medium group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors">
          {placeholder}
        </span>
      </div>
      <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded-md border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800/90 px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-400 shadow-2xs shrink-0 group-hover:border-blue-300">
        <span className="text-[9px]">⌘</span>K
      </kbd>
    </button>
  );
}
