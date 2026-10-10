"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth, useUser } from "@clerk/nextjs";
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Bot,
  User,
  Phone,
  Mail,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  ChevronRight,
  RotateCcw,
  GraduationCap,
  Clock,
  HelpCircle,
  AlertCircle,
  ArrowDown,
  Layers,
  GripVertical,
  LifeBuoy,
} from "lucide-react";
import { apiUrl } from "@/lib/api/base-url";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.27 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.33C16.32 14.2 15.1 13.6 14.87 13.52C14.64 13.43 14.48 13.39 14.31 13.64C14.15 13.88 13.68 14.44 13.53 14.61C13.39 14.77 13.25 14.8 13 14.67C12.75 14.55 11.94 14.28 10.98 13.43C10.23 12.76 9.73 11.93 9.58 11.68C9.44 11.44 9.57 11.3 9.69 11.18C9.8 11.07 9.94 10.89 10.07 10.74C10.2 10.59 10.24 10.48 10.32 10.31C10.41 10.15 10.36 10.01 10.3 9.89C10.24 9.76 9.74 8.54 9.54 8.04C9.34 7.56 9.14 7.62 8.99 7.62C8.85 7.61 8.68 7.61 8.52 7.61C8.35 7.61 8.08 7.67 7.85 7.92C7.62 8.17 6.98 8.77 6.98 9.99C6.98 11.21 7.87 12.39 8 12.56C8.13 12.72 9.73 15.2 12.18 16.26C12.76 16.51 13.22 16.66 13.57 16.77C14.16 16.96 14.7 16.93 15.12 16.87C15.59 16.8 16.57 16.28 16.78 15.7C16.98 15.11 16.98 14.61 16.92 14.51C16.86 14.41 16.72 14.35 16.57 14.33Z" />
    </svg>
  );
}

// Lightweight Markdown Formatter to cleanly render bold text, lists, and linebreaks without layout break
function FormattedBotMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  const parseInline = (line: string) => {
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="font-bold text-slate-900 dark:text-white">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="space-y-1.5 text-[11.5px] sm:text-xs leading-relaxed break-words overflow-wrap-anywhere">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        const isBullet =
          trimmed.startsWith("•") ||
          trimmed.startsWith("- ") ||
          trimmed.startsWith("* ");

        if (isBullet) {
          const bulletContent = trimmed.replace(/^[•\-\*]\s*/, "");
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5">
              <span className="text-blue-600 dark:text-cyan-400 font-black shrink-0 mt-0.5">•</span>
              <span className="flex-1">{parseInline(bulletContent)}</span>
            </div>
          );
        }

        return <div key={idx}>{parseInline(line)}</div>;
      })}
    </div>
  );
}

export interface SuggestedCourse {
  id?: string;
  title: string;
  slug: string;
  summary?: string;
  price: number;
  duration: string;
  level: string;
  instructor: string;
  thumbnail?: string;
  url: string;
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
  suggestedCourses?: SuggestedCourse[];
  showRegistrationForm?: boolean;
  showSupportForm?: boolean;
  showRegistrationInvite?: boolean;
}

const INITIAL_BOT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-init",
    sender: "bot",
    text: "Hello! 👋 Welcome to JKS Learning. I'm your virtual learning assistant. How can I help you today?",
    timestamp: "Just now",
    options: [
      "What is JKS Learning? 🎓",
      "Explore Available Courses 🚀",
      "How Does Enrollment Work? 📝",
      "Contact Support 💬",
    ],
  },
];

const BATCH_TIMINGS = [
  "Flexible / Any Timing",
  "Morning Batch (08:00 AM - 11:00 AM IST)",
  "Afternoon Batch (01:00 PM - 04:00 PM IST)",
  "Evening Batch (06:00 PM - 09:00 PM IST)",
  "Weekend Intensive (Saturday & Sunday)",
];

const SUPPORT_CATEGORIES = [
  "Account & Login Issue",
  "Course Enrollment & Access",
  "Technical Issue / Video Player",
  "Certificates & Assessments",
  "Billing & Inquiries",
  "Other Assistance",
];

export function WebsiteChatbot() {
  const pathname = usePathname();
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const isStudentWorkspace = pathname?.startsWith("/dashboard");

  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showGuidanceTooltip, setShowGuidanceTooltip] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_BOT_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // User message tracking for 2-message soft registration invitation
  const userMessageCountRef = useRef(0);
  const [hasShownRegistrationInvite, setHasShownRegistrationInvite] = useState(false);

  // Available published courses for dropdowns
  const [publishedCourses, setPublishedCourses] = useState<Array<{ id: string; title: string; slug: string }>>([]);

  // Active inline forms
  const [activeRegistrationMsgId, setActiveRegistrationMsgId] = useState<string | null>(null);
  const [activeSupportMsgId, setActiveSupportMsgId] = useState<string | null>(null);

  // Registration Form State
  const [regForm, setRegForm] = useState({
    name: "",
    email: "",
    phone: "",
    course: "",
    batchTiming: BATCH_TIMINGS[0],
    message: "",
  });
  const [isSubmittingReg, setIsSubmittingReg] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);

  // Support Form State
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: SUPPORT_CATEGORIES[0],
    subject: "",
    description: "",
  });
  const [isSubmittingSupport, setIsSubmittingSupport] = useState(false);
  const [supportError, setSupportError] = useState<string | null>(null);

  // Draggable Launcher State
  const [launcherPos, setLauncherPos] = useState<{ x: number; y: number } | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef<{ pointerX: number; pointerY: number; startX: number; startY: number } | null>(null);
  const hasDraggedRef = useRef(false);

  // Scroll Container Ref and State
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showScrollBottomBtn, setShowScrollBottomBtn] = useState(false);
  const isAtBottomRef = useRef(true);

  // Prefill authenticated user info
  useEffect(() => {
    if (user) {
      const fullName = user.fullName || `${user.firstName || ""} ${user.lastName || ""}`.trim();
      const primaryEmail = user.primaryEmailAddress?.emailAddress || "";
      if (fullName) {
        setRegForm((prev) => ({ ...prev, name: fullName }));
        setSupportForm((prev) => ({ ...prev, name: fullName }));
      }
      if (primaryEmail) {
        setRegForm((prev) => ({ ...prev, email: primaryEmail }));
        setSupportForm((prev) => ({ ...prev, email: primaryEmail }));
      }
    }
  }, [user]);

  // Determine allowed page
  const isAllowedPage = useMemo(() => {
    if (!pathname) return false;
    if (pathname.startsWith("/admin") || pathname.startsWith("/instructor")) return false;
    if (pathname === "/login" || pathname === "/forgot-password") return false;
    if (pathname.startsWith("/dashboard")) return true;
    return (
      pathname === "/" ||
      pathname.startsWith("/courses") ||
      pathname === "/about" ||
      pathname === "/success-stories" ||
      pathname === "/ai-mock-interview" ||
      pathname === "/terms" ||
      pathname === "/privacy-policy"
    );
  }, [pathname]);

  // Load published courses for dropdowns
  useEffect(() => {
    if (!isAllowedPage) return;
    const fetchCourses = async () => {
      try {
        const res = await fetch(apiUrl("/ai/chatbot/courses"));
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setPublishedCourses(data);
            setRegForm((prev) => ({
              ...prev,
              course: prev.course || data[0].title,
            }));
          }
        }
      } catch {
        // Fallback gracefully
      }
    };
    fetchCourses();
  }, [isAllowedPage]);

  // Initialize and persist draggable position
  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const saved = localStorage.getItem("jks_chatbot_launcher_pos");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (typeof parsed.x === "number" && typeof parsed.y === "number") {
          const clampedX = Math.max(12, Math.min(window.innerWidth - 68, parsed.x));
          const clampedY = Math.max(12, Math.min(window.innerHeight - 68, parsed.y));
          setLauncherPos({ x: clampedX, y: clampedY });
          return;
        }
      }
    } catch {}

    // Default position: bottom-right
    setLauncherPos({
      x: Math.max(12, window.innerWidth - 76),
      y: Math.max(12, window.innerHeight - 76),
    });
  }, []);

  // Window resize handler to keep launcher inside viewport
  useEffect(() => {
    const handleResize = () => {
      setLauncherPos((prev) => {
        if (!prev) return null;
        return {
          x: Math.max(12, Math.min(window.innerWidth - 68, prev.x)),
          y: Math.max(12, Math.min(window.innerHeight - 68, prev.y)),
        };
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Guidance tooltip timer
  useEffect(() => {
    if (!isAllowedPage) return;
    setShowGuidanceTooltip(true);
    const timer = setTimeout(() => {
      setShowGuidanceTooltip(false);
    }, 4000);
    return () => clearTimeout(timer);
  }, [pathname, isAllowedPage]);

  // Pointer drag handlers for launcher icon
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!launcherPos) return;
    dragStartRef.current = {
      pointerX: e.clientX,
      pointerY: e.clientY,
      startX: launcherPos.x,
      startY: launcherPos.y,
    };
    hasDraggedRef.current = false;
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !dragStartRef.current) return;
    const dx = e.clientX - dragStartRef.current.pointerX;
    const dy = e.clientY - dragStartRef.current.pointerY;

    if (Math.hypot(dx, dy) > 6) {
      hasDraggedRef.current = true;
    }

    const nextX = Math.max(12, Math.min(window.innerWidth - 68, dragStartRef.current.startX + dx));
    const nextY = Math.max(12, Math.min(window.innerHeight - 68, dragStartRef.current.startY + dy));
    setLauncherPos({ x: nextX, y: nextY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    if (launcherPos) {
      try {
        localStorage.setItem("jks_chatbot_launcher_pos", JSON.stringify(launcherPos));
      } catch {}
    }

    // If movement was negligible, treat as a normal click toggle
    if (!hasDraggedRef.current) {
      setIsOpen((prev) => !prev);
      setHasUnread(false);
      setShowGuidanceTooltip(false);
    }
  };

  // Scroll Container listener to track user scroll position
  const handleScroll = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const distanceToBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const isAtBottom = distanceToBottom < 60;
    isAtBottomRef.current = isAtBottom;
    setShowScrollBottomBtn(!isAtBottom);
  }, []);

  const scrollToBottom = useCallback((smooth = true) => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
    isAtBottomRef.current = true;
    setShowScrollBottomBtn(false);
  }, []);

  // Auto-scroll when new messages arrive only if user was near bottom
  useEffect(() => {
    if (!isOpen) return;
    if (isAtBottomRef.current) {
      // Small timeout to allow DOM to render
      setTimeout(() => scrollToBottom(true), 60);
    }
  }, [messages, isTyping, isOpen, scrollToBottom]);

  if (!isAllowedPage) {
    return null;
  }

  // Handle Send Message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    userMessageCountRef.current += 1;
    const currentMsgCount = userMessageCountRef.current;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    // If user clicked or typed explicit registration request
    const isExplicitReg = /(want to register|how to register|register me|sign me up|register now)/i.test(text);

    // If user clicked or typed explicit support request
    const isExplicitSupport = /(contact support|talk to support|customer support|human help|support form)/i.test(text);

    try {
      const res = await fetch(apiUrl("/ai/chatbot/chat"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-8).map((m) => ({
            role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
            content: m.text,
          })),
          visitorInfo: user
            ? {
                name: user.fullName || user.firstName || undefined,
                email: user.primaryEmailAddress?.emailAddress || undefined,
              }
            : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI service returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMsgId = `bot-${Date.now()}`;

      // Check if 2-message soft registration invite should be offered
      const shouldOfferRegInvite =
        currentMsgCount === 2 &&
        !hasShownRegistrationInvite &&
        !isSignedIn &&
        !isExplicitReg &&
        !isExplicitSupport &&
        data.action !== "SUPPORT_FORM" &&
        data.action !== "REGISTRATION_FORM";

      if (shouldOfferRegInvite) {
        setHasShownRegistrationInvite(true);
      }

      const botMsg: ChatMessage = {
        id: botMsgId,
        sender: "bot",
        text: data.reply || "I'm here to help you explore JKS Learning. What can I help you with?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestedCourses: data.suggestedCourses,
        showRegistrationForm: isExplicitReg || data.action === "REGISTRATION_FORM",
        showSupportForm: isExplicitSupport || data.action === "SUPPORT_FORM",
        showRegistrationInvite: shouldOfferRegInvite,
      };

      if (botMsg.showRegistrationForm) {
        setActiveRegistrationMsgId(botMsgId);
      }
      if (botMsg.showSupportForm) {
        setActiveSupportMsgId(botMsgId);
      }

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Graceful error fallback
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: "I'm having trouble processing your request right now. Please try again in a moment. If the problem continues, our customer support team is available at support@jkslearning.com.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: ["Try Again 🔄", "Contact Support 💬"],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Submit Inline Registration Form
  const handleRegSubmit = async (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    setRegError(null);

    if (!regForm.name.trim() || regForm.name.trim().length < 2) {
      setRegError("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regForm.email.trim() || !emailRegex.test(regForm.email.trim())) {
      setRegError("Please enter a valid email address.");
      return;
    }

    const cleanedPhone = regForm.phone.replace(/[^0-9]/g, "").slice(0, 10);
    if (cleanedPhone.length !== 10) {
      setRegError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmittingReg(true);
    try {
      const res = await fetch(apiUrl("/notifications/public-registration"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regForm.name.trim(),
          email: regForm.email.trim().toLowerCase(),
          phone: cleanedPhone,
          interestedCourse: regForm.course || publishedCourses[0]?.title || "General Platform Inquiry",
          batchTiming: regForm.batchTiming,
          message: regForm.message?.trim() || "Registered via AI Chatbot",
          source: "CHATBOT",
        }),
      });

      if (!res.ok) {
        throw new Error("Registration submission failed. Please try again.");
      }

      setActiveRegistrationMsgId(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `🎉 **Registration Submitted Successfully!**\n\nThank you **${regForm.name}**. We have received your registration for **${regForm.course || "your chosen program"}**.\n\nOur admissions and academic support team will review your application and reach out to you at **${cleanedPhone}** with complete batch schedule options and access details.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          options: ["Explore Available Courses 🚀", "How Does Enrollment Work? 📝"],
        },
      ]);
    } catch (err: any) {
      setRegError(err?.message || "Failed to submit registration. Please verify details and retry.");
    } finally {
      setIsSubmittingReg(false);
    }
  };

  // Submit Inline Support Form
  const handleSupportSubmit = async (e: React.FormEvent, msgId: string) => {
    e.preventDefault();
    setSupportError(null);

    if (!supportForm.name.trim() || supportForm.name.trim().length < 2) {
      setSupportError("Please enter your full name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!supportForm.email.trim() || !emailRegex.test(supportForm.email.trim())) {
      setSupportError("Please enter a valid email address.");
      return;
    }

    const cleanedPhone = supportForm.phone.replace(/[^0-9]/g, "").slice(0, 10);
    if (cleanedPhone.length !== 10) {
      setSupportError("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (!supportForm.description.trim() || supportForm.description.trim().length < 5) {
      setSupportError("Please provide a description of the issue.");
      return;
    }

    setIsSubmittingSupport(true);
    try {
      const res = await fetch(apiUrl("/ai/chatbot/support-request"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: supportForm.name.trim(),
          email: supportForm.email.trim().toLowerCase(),
          phone: cleanedPhone,
          category: supportForm.category,
          subject: supportForm.subject.trim() || `${supportForm.category} inquiry`,
          description: supportForm.description.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Support request submission failed. Please try again.");
      }

      const data = await res.json();
      const ticketId = data.ticketId || "JKS-SUP-REF";

      setActiveSupportMsgId(null);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `✅ **Support Request Submitted Successfully!**\n\nYour reference number is **${ticketId}**.\n\nOur customer support team has received your request regarding **${supportForm.category}** and will contact you via email at **${supportForm.email}** or phone at **${cleanedPhone}**.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          options: ["Ask Another Question 💬", "Explore Available Courses 🚀"],
        },
      ]);
    } catch (err: any) {
      setSupportError(err?.message || "Failed to submit support request. Please try again.");
    } finally {
      setIsSubmittingSupport(false);
    }
  };

  const restartConversation = () => {
    userMessageCountRef.current = 0;
    setHasShownRegistrationInvite(false);
    setActiveRegistrationMsgId(null);
    setActiveSupportMsgId(null);
    setMessages(INITIAL_BOT_MESSAGES);
  };

  // Compute position coordinates for launcher
  const launcherStyle: React.CSSProperties = launcherPos
    ? {
        position: "fixed",
        left: `${launcherPos.x}px`,
        top: `${launcherPos.y}px`,
        zIndex: 50,
      }
    : {
        position: "fixed",
        right: "24px",
        bottom: "24px",
        zIndex: 50,
      };

  return (
    <>
      {/* Draggable Launcher Container */}
      <div
        style={launcherStyle}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`touch-none select-none flex items-center gap-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
      >
        {/* Guidance Speech Bubble Tooltip (shows on mount or when hovered) */}
        <AnimatePresence>
          {!isOpen && showGuidanceTooltip && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, x: 10 }}
              className="hidden sm:flex items-center gap-2 rounded-2xl border border-blue-200 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 px-3 py-2 shadow-xl backdrop-blur-md pointer-events-none -ml-48"
            >
              <div className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1">
                  {isStudentWorkspace ? "Need Study Guidance?" : "Questions about Courses?"}
                  <Sparkles className="h-3 w-3 text-amber-500" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isStudentWorkspace ? "AI Tutor Online" : "AI Learning Assistant Online"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Launcher Button */}
        <button
          type="button"
          aria-label="Toggle JKS Learning AI Assistant"
          className="group relative flex h-12 w-12 sm:h-13 sm:w-13 items-center justify-center rounded-full shadow-[0_8px_25px_rgba(37,99,235,0.35)] hover:shadow-[0_12px_32px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95 transition-all duration-200 ring-2 ring-white/90 dark:ring-slate-800 bg-slate-950"
        >
          {/* Subtle Outer Pulse Glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 opacity-40 blur-xs group-hover:opacity-80 transition-opacity" />

          {isOpen ? (
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-white">
              <X className="h-5 w-5 transition-transform group-hover:rotate-90 duration-200" />
            </div>
          ) : (
            <div className="relative z-10 h-full w-full overflow-hidden rounded-full">
              <Image
                src="/software-agent.png"
                alt="JKS Learning Assistant"
                fill
                sizes="52px"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
            </div>
          )}

          {/* Green Online Beacon */}
          {!isOpen && (
            <span className="absolute bottom-0 right-0 z-20 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" />
            </span>
          )}

          {/* Unread Badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[8.5px] font-black text-white border-2 border-white dark:border-slate-900 shadow-md">
              1
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Modal / Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-20 right-3 sm:right-6 sm:bottom-24 z-50 flex h-[540px] sm:h-[580px] max-h-[84vh] sm:max-h-[82vh] w-[calc(100vw-1.5rem)] max-w-[365px] sm:max-w-[400px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-[0_20px_50px_-10px_rgba(15,23,42,0.35)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            {/* Chatbot Luxury Header */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-3 sm:p-3.5 text-white shrink-0 border-b border-white/10">
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-600/30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                {/* Assistant Profile Identity */}
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-sm ring-1 ring-white/20">
                    <div className="relative h-full w-full rounded-[10px] overflow-hidden bg-slate-900">
                      <Image
                        src="/software-agent.png"
                        alt="JKS Learning Assistant"
                        fill
                        sizes="36px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-slate-950 bg-emerald-500 shadow-2xs" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold tracking-tight text-white truncate">
                      {isStudentWorkspace ? "JKS AI Learning Assistant" : "JKS Learning Assistant"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-400 font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span>Online · Verified Platform Support</span>
                    </div>
                  </div>
                </div>

                {/* Right Action Icons: WhatsApp + Close Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20have%20a%20question%20about%20your%20courses."
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Direct WhatsApp Support"
                    aria-label="Direct WhatsApp"
                    className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all shadow-xs cursor-pointer"
                  >
                    <WhatsAppIcon className="h-4 w-4 fill-current" />
                  </a>

                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Chat"
                    className="flex h-7.5 w-7.5 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Header Feature Strip */}
              <div className="relative z-10 mt-2 flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[10px] text-slate-300">
                <span className="flex items-center gap-1 truncate">
                  <Sparkles className="h-2.5 w-2.5 text-amber-300 shrink-0" />
                  <span className="truncate">Courses · Admissions · Platform Help</span>
                </span>
                <span className="text-[9px] text-cyan-300 font-semibold shrink-0 ml-1">Always Available</span>
              </div>
            </div>

            {/* Chat Body & Independent Scroll Container */}
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-3 sm:p-3.5 space-y-3 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-white dark:from-surface dark:via-surface-secondary dark:to-surface-secondary"
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Bot Avatar */}
                  {msg.sender === "bot" && (
                    <div className="relative h-6.5 w-6.5 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs mb-1">
                      <Image
                        src="/software-agent.png"
                        alt="AI"
                        fill
                        sizes="26px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[90%]`}>
                    {/* Message Bubble */}
                    <div
                      className={`rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-2xs break-words overflow-wrap-anywhere ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#2563EB] to-blue-600 text-white rounded-br-xs shadow-blue-500/20"
                          : "bg-white dark:bg-surface-elevated text-slate-800 dark:text-slate-100 border border-slate-200/80 dark:border-slate-800 rounded-bl-xs shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <div className="whitespace-pre-line text-[11.5px] sm:text-xs font-medium">{msg.text}</div>
                      ) : (
                        <FormattedBotMessage text={msg.text} />
                      )}
                    </div>

                    <span className="mt-1 text-[9px] text-slate-400 dark:text-slate-400 px-1 font-medium">
                      {msg.timestamp}
                    </span>

                    {/* Interactive Quick Option Chips */}
                    {msg.options && msg.options.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              if (opt.includes("WhatsApp")) {
                                window.open(
                                  "https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20have%20a%20question%20about%20your%20courses.",
                                  "_blank"
                                );
                              } else if (opt.includes("Try Again")) {
                                handleSendMessage("Hi");
                              } else if (opt.includes("Contact Support")) {
                                setActiveSupportMsgId(msg.id);
                              } else {
                                handleSendMessage(opt);
                              }
                            }}
                            className="rounded-full border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-surface-elevated px-2.5 py-1 text-[10.5px] font-bold text-[#2563EB] dark:text-blue-400 shadow-2xs hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-600 transition-all active:scale-95 cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Rich Course Recommendation Cards */}
                    {msg.suggestedCourses && msg.suggestedCourses.length > 0 && (
                      <div className="mt-2.5 w-full space-y-2">
                        {msg.suggestedCourses.map((c, cIdx) => (
                          <div
                            key={c.slug || cIdx}
                            className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated p-3 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col gap-2"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0 flex-1">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                                  {c.title}
                                </h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium mt-0.5 line-clamp-2">
                                  {c.summary || "Structured multi-stage curriculum with hands-on practice."}
                                </p>
                              </div>
                              <span className="shrink-0 text-xs font-extrabold text-[#2563EB] dark:text-blue-400">
                                ₹{c.price.toLocaleString("en-IN")}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-1 text-[10px] text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800/80 pt-2">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="inline-flex items-center gap-1 rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 font-semibold text-slate-700 dark:text-slate-300">
                                  <Clock className="h-2.5 w-2.5" /> {c.duration}
                                </span>
                                {c.instructor && (
                                  <span className="text-[9.5px] text-slate-500 dark:text-slate-400">
                                    By {c.instructor}
                                  </span>
                                )}
                              </div>

                              <Link
                                href={c.url || `/courses/${c.slug}`}
                                className="flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-1 font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors"
                              >
                                View Course <ExternalLink className="h-2.5 w-2.5" />
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Soft 2-Message Registration Invitation Card */}
                    {msg.showRegistrationInvite && !activeRegistrationMsgId && (
                      <div className="mt-2.5 w-full rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-br from-indigo-50/70 via-white to-blue-50/60 dark:from-indigo-950/40 dark:via-surface-secondary dark:to-surface-elevated p-3 shadow-xs space-y-2 text-xs animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-start gap-2">
                          <GraduationCap className="h-4 w-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-relaxed">
                              If you&apos;d like to take the next step, you can also register with JKS Learning to explore all available learning opportunities.
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                              Would you like to register?
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => setActiveRegistrationMsgId(msg.id)}
                            className="flex-1 flex items-center justify-center gap-1 rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                          >
                            Register Now <ArrowRight className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              // Dismiss invite for this message
                              setMessages((prev) =>
                                prev.map((m) =>
                                  m.id === msg.id ? { ...m, showRegistrationInvite: false } : m
                                )
                              );
                            }}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                          >
                            Maybe Later
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Inline Registration Form */}
                    {activeRegistrationMsgId === msg.id && (
                      <form
                        onSubmit={(e) => handleRegSubmit(e, msg.id)}
                        className="mt-2.5 w-full rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/30 dark:from-surface-secondary dark:via-surface-elevated dark:to-surface-hover p-3.5 shadow-md space-y-2.5 text-xs animate-in fade-in"
                      >
                        <div className="flex items-center justify-between border-b border-blue-100 dark:border-slate-800 pb-2">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                            <GraduationCap className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <span>JKS Student Registration</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveRegistrationMsgId(null)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            title="Close form"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {regError && (
                          <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 p-2 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{regError}</span>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={regForm.name}
                            onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Email *</label>
                            <input
                              type="email"
                              required
                              placeholder="name@gmail.com"
                              value={regForm.email}
                              onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Mobile Phone *</label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="10-digit number"
                              value={regForm.phone}
                              onChange={(e) =>
                                setRegForm({ ...regForm, phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })
                              }
                              className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Interested Program</label>
                          <select
                            value={regForm.course}
                            onChange={(e) => setRegForm({ ...regForm, course: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-[11px] text-slate-900 dark:text-white outline-none focus:border-blue-600 truncate"
                          >
                            {publishedCourses.length > 0 ? (
                              publishedCourses.map((c) => (
                                <option key={c.id} value={c.title}>
                                  {c.title}
                                </option>
                              ))
                            ) : (
                              <>
                                <option>Full stack development</option>
                                <option>Complete Java Course In Telugu</option>
                                <option>Python Machine Learning</option>
                                <option>SAP S/4HANA Enterprise Systems</option>
                              </>
                            )}
                            <option value="General Platform Inquiry">General Platform Inquiry</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Preferred Batch</label>
                          <select
                            value={regForm.batchTiming}
                            onChange={(e) => setRegForm({ ...regForm, batchTiming: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-[11px] text-slate-900 dark:text-white outline-none focus:border-blue-600"
                          >
                            {BATCH_TIMINGS.map((b) => (
                              <option key={b} value={b}>
                                {b}
                              </option>
                            ))}
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingReg}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-blue-600 py-2 text-xs font-bold text-white shadow-xs hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingReg ? "Submitting..." : "Submit Registration"}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </form>
                    )}

                    {/* Inline Customer Support Form */}
                    {activeSupportMsgId === msg.id && (
                      <form
                        onSubmit={(e) => handleSupportSubmit(e, msg.id)}
                        className="mt-2.5 w-full rounded-xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-br from-white via-rose-50/30 to-amber-50/20 dark:from-surface-secondary dark:via-surface-elevated dark:to-surface-hover p-3.5 shadow-md space-y-2.5 text-xs animate-in fade-in"
                      >
                        <div className="flex items-center justify-between border-b border-rose-100 dark:border-slate-800 pb-2">
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                            <LifeBuoy className="h-4 w-4 text-rose-600 dark:text-rose-400" />
                            <span>Customer Support Request</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setActiveSupportMsgId(null)}
                            className="text-slate-400 hover:text-rose-500 transition-colors"
                            title="Close form"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {supportError && (
                          <div className="flex items-center gap-1.5 rounded-lg bg-rose-50 dark:bg-rose-950/60 p-2 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                            <span>{supportError}</span>
                          </div>
                        )}

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={supportForm.name}
                            onChange={(e) => setSupportForm({ ...supportForm, name: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Email *</label>
                            <input
                              type="email"
                              required
                              placeholder="name@gmail.com"
                              value={supportForm.email}
                              onChange={(e) => setSupportForm({ ...supportForm, email: e.target.value })}
                              className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Mobile Phone *</label>
                            <input
                              type="tel"
                              required
                              maxLength={10}
                              placeholder="10-digit number"
                              value={supportForm.phone}
                              onChange={(e) =>
                                setSupportForm({
                                  ...supportForm,
                                  phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10),
                                })
                              }
                              className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 font-mono"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Issue Category</label>
                          <select
                            value={supportForm.category}
                            onChange={(e) => setSupportForm({ ...supportForm, category: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-[11px] text-slate-900 dark:text-white outline-none focus:border-rose-500"
                          >
                            {SUPPORT_CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Subject</label>
                          <input
                            type="text"
                            placeholder="Brief subject of the issue"
                            value={supportForm.subject}
                            onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Description *</label>
                          <textarea
                            rows={2}
                            required
                            placeholder="Please explain what happened or what help you need..."
                            value={supportForm.description}
                            onChange={(e) => setSupportForm({ ...supportForm, description: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-rose-500 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingSupport}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 py-2 text-xs font-bold text-white shadow-xs hover:from-rose-700 hover:to-rose-800 transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSubmittingSupport ? "Submitting..." : "Submit Support Request"}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="relative h-6.5 w-6.5 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs">
                    <Image
                      src="/software-agent.png"
                      alt="AI"
                      fill
                      sizes="26px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white dark:bg-surface-elevated border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-3 py-2 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce delay-300" />
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 ml-1 font-medium">Assistant is typing...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Floating 'Scroll to bottom' button when user has scrolled up */}
            {showScrollBottomBtn && (
              <button
                type="button"
                onClick={() => scrollToBottom(true)}
                className="absolute bottom-16 right-4 z-20 flex items-center gap-1 rounded-full bg-white dark:bg-surface-elevated border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[10px] font-bold text-slate-700 dark:text-slate-200 shadow-lg hover:bg-slate-50 dark:hover:bg-surface-hover transition-all animate-in fade-in cursor-pointer"
              >
                <ArrowDown className="h-3 w-3 text-blue-600" />
                <span>New messages</span>
              </button>
            )}

            {/* Input Bar & Footer */}
            <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-secondary p-2.5 sm:p-3 space-y-1.5 shrink-0">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5"
              >
                {/* Reset / New Chat Button */}
                <button
                  type="button"
                  onClick={restartConversation}
                  title="Start New Conversation"
                  aria-label="Restart Conversation"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-surface-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <input
                  type="text"
                  placeholder={
                    isStudentWorkspace
                      ? "Ask about lessons, tasks, or code..."
                      : "Ask about courses, enrollment, or platform..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-input-bg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-surface-elevated focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-cyan-500 text-white shadow-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[9.5px] text-slate-400 dark:text-slate-400 font-medium px-1">
                <span>⚡ JKS Learning Virtual Assistant</span>
                <button
                  type="button"
                  onClick={restartConversation}
                  className="flex items-center gap-1 text-[9.5px] text-slate-400 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-2.5 w-2.5" />
                  <span>Restart Chat</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
