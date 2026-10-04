"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  PhoneCall,
  ExternalLink,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { addLead } from "@/lib/data/leads-store";

function WhatsAppIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.15C10.56 20.15 9.11 19.75 7.85 19L7.55 18.82L4.43 19.64L5.26 16.6L5.06 16.29C4.24 14.99 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.27 11.92C20.28 16.46 16.59 20.15 12.05 20.15ZM16.57 14.33C16.32 14.2 15.1 13.6 14.87 13.52C14.64 13.43 14.48 13.39 14.31 13.64C14.15 13.88 13.68 14.44 13.53 14.61C13.39 14.77 13.25 14.8 13 14.67C12.75 14.55 11.94 14.28 10.98 13.43C10.23 12.76 9.73 11.93 9.58 11.68C9.44 11.44 9.57 11.3 9.69 11.18C9.8 11.07 9.94 10.89 10.07 10.74C10.2 10.59 10.24 10.48 10.32 10.31C10.41 10.15 10.36 10.01 10.3 9.89C10.24 9.76 9.74 8.54 9.54 8.04C9.34 7.56 9.14 7.62 8.99 7.62C8.85 7.61 8.68 7.61 8.52 7.61C8.35 7.61 8.08 7.67 7.85 7.92C7.62 8.17 6.98 8.77 6.98 9.99C6.98 11.21 7.87 12.39 8 12.56C8.13 12.72 9.73 15.2 12.18 16.26C12.76 16.51 13.22 16.66 13.57 16.77C14.16 16.96 14.7 16.93 15.12 16.87C15.59 16.8 16.57 16.28 16.78 15.7C16.98 15.11 16.98 14.61 16.92 14.51C16.86 14.41 16.72 14.35 16.57 14.33Z" />
    </svg>
  );
}

// Lightweight Markdown Formatter to cleanly render bold text, lists, and linebreaks
function FormattedBotMessage({ text }: { text: string }) {
  const lines = text.split("\n");

  const parseInline = (line: string) => {
    // Regex splits by **bold** text
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
    <div className="space-y-1.5 text-[11.5px] sm:text-xs leading-relaxed">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Bullet point detection
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

interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  timestamp: string;
  options?: string[];
  isLeadForm?: boolean;
}

const INITIAL_BOT_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "bot",
    text: "Hello! 👋 Welcome to JKS Learning. I'm Jordan, your Senior Admissions & Career Advisor. How can I help accelerate your tech journey today?",
    timestamp: "Just now",
    options: [
      "Explore Top Courses 🚀",
      "Fee & Scholarship Info 💰",
      "Placement & Salary Hikes 💼",
      "Talk to Live Counselor 📞",
    ],
  },
];

export function WebsiteChatbot() {
  const pathname = usePathname();
  const isStudentWorkspace = pathname?.startsWith("/dashboard");
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
  const [showGuidanceTooltip, setShowGuidanceTooltip] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_BOT_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Lead Form State inside chat
  const [leadForm, setLeadForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: "Java Full Stack Developer Mastery",
  });
  const [isSubmittingLead, setIsSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Determine if current page is an allowed page where chatbot is helpful
  const isAllowedPage = useMemo(() => {
    if (!pathname) return false;
    // Disallow admin and instructor workspaces
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/instructor")
    ) {
      return false;
    }
    // Disallow auth pages and checkout/invoice registration page
    if (
      pathname === "/login" ||
      pathname === "/register" ||
      pathname === "/forgot-password" ||
      pathname.startsWith("/register-course")
    ) {
      return false;
    }
    // Allowed in entire student workspace
    if (pathname.startsWith("/dashboard")) {
      return true;
    }
    // Allowed public pages
    return (
      pathname === "/" ||
      pathname.startsWith("/courses") ||
      pathname === "/about" ||
      pathname === "/success-stories" ||
      pathname === "/ai-mock-interview"
    );
  }, [pathname]);

  // Show the "Need Course Guidance?" tooltip for 3.5 seconds on mount/navigation, then smoothly hide it
  useEffect(() => {
    if (!isAllowedPage) return;
    setShowGuidanceTooltip(true);
    const timer = setTimeout(() => {
      setShowGuidanceTooltip(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, [pathname, isAllowedPage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
      setShowGuidanceTooltip(false);
    }
  }, [isOpen, messages]);

  if (!isAllowedPage) {
    return null;
  }

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputValue.trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputValue("");
    setIsTyping(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
      const res = await fetch(`${apiUrl}/ai/chatbot/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          conversationHistory: messages.slice(-6).map((m) => ({
            role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
            content: m.text,
          })),
          visitorInfo: leadForm.name ? { name: leadForm.name, email: leadForm.email, phone: leadForm.phone } : undefined,
        }),
      });

      if (!res.ok) {
        throw new Error(`AI service returned HTTP ${res.status}`);
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: data.reply || "Thank you for reaching out! How else can I assist your learning journey?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: data.suggestedCourses?.map((c: any) => `${c.title} (₹${c.price})`) || [
          "Explore Courses 🚀",
          "Fee & Scholarships 💰",
          "Talk to Live Counselor 📞",
        ],
        isLeadForm: !data.leadCaptured && (text.toLowerCase().includes("call") || text.toLowerCase().includes("contact") || text.toLowerCase().includes("counselor") || text.toLowerCase().includes("admission")),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      // Graceful offline/network fallback
      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: "bot",
        text: "Thank you for connecting with JKS Learning! We offer premier cohorts in Java Full Stack, Frontend Engineering, SAP S/4HANA, and .NET 9.\n\nLeave your contact details below or reach out directly on WhatsApp for an immediate counseling session.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        options: ["Talk to Live Counselor 📞", "Explore Courses 🚀"],
        isLeadForm: true,
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    const cleanedPhone = leadForm.phone.replace(/[^0-9]/g, "").slice(0, 10);
    if (cleanedPhone.length !== 10) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    setIsSubmittingLead(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

      // 1. Submit lead to backend pipeline: saves in MongoDB Lead & LeadNote, alerts Admins in-app, dispatches Admin Email
      const res = await fetch(`${apiUrl}/notifications/public-registration`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: leadForm.name.trim(),
          phone: cleanedPhone,
          email: leadForm.email?.trim() || undefined,
          interestedCourse: leadForm.course,
          source: "CHATBOT",
          message: "Instant consultation requested via Website AI Chatbot",
          batchTiming: "Immediate Callback Requested",
        }),
      });

      if (!res.ok) {
        console.warn("Backend registration endpoint returned status", res.status);
      }

      // 2. Also save to local store for UI continuity
      try {
        addLead({
          name: leadForm.name,
          email: leadForm.email || `${leadForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
          phone: cleanedPhone,
          interestedCourse: leadForm.course,
          source: "website_chatbot",
          status: "new",
          priority: "high",
          notes: "Requested instant advisor callback via Website AI Chatbot",
        });
      } catch {}

      setLeadSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text: `🎉 Thank you **${leadForm.name}**!\n\nYour consultation request for **${leadForm.course}** has been securely assigned to our senior admissions team.\n\nOur academic counselor will call or message you on WhatsApp at **${leadForm.phone}** within 15 minutes!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          options: [
            "Explore Courses 🚀",
            "Fee & Scholarships 💰",
          ],
        },
      ]);
    } catch (err) {
      console.error("Failed to submit lead:", err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  const restartConversation = () => {
    setMessages(INITIAL_BOT_MESSAGES);
    setLeadSubmitted(false);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center gap-2.5">
        {/* Auto-fading speech bubble tooltip (shows for 3.5s on load, or when hovered) */}
        <AnimatePresence>
          {!isOpen && (showGuidanceTooltip || isHovered) && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="hidden sm:flex items-center gap-2 rounded-2xl border border-blue-100 dark:border-slate-800 bg-white/95 dark:bg-surface-secondary/95 px-3 py-2 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.6)] backdrop-blur-md cursor-pointer hover:shadow-lg hover:border-blue-300 dark:hover:border-blue-500 transition-all group"
              onClick={() => setIsOpen(true)}
            >
              <div className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex items-center gap-1">
                  {isStudentWorkspace ? "Need Study Guidance?" : "Need Course Guidance?"}
                  <Sparkles className="h-3 w-3 text-amber-500" />
                </div>
                <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                  {isStudentWorkspace ? "AI Learning Tutor Online" : "Admissions Advisor Online"}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sleek Modern AI Agent Orb Launcher Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="group relative flex h-11 w-11 sm:h-13 sm:w-13 items-center justify-center rounded-full shadow-[0_6px_20px_rgba(37,99,235,0.35)] hover:shadow-[0_10px_28px_rgba(37,99,235,0.5)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ring-2 sm:ring-3 ring-white/90 dark:ring-slate-800 hover:ring-cyan-300 bg-slate-900"
          aria-label="Toggle Course Advisor Chatbot"
        >
          {/* Subtle Outer Pulse Glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 opacity-40 blur-xs group-hover:opacity-80 transition-opacity" />

          {isOpen ? (
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-white">
              <X className="h-4.5 w-4.5 transition-transform group-hover:rotate-90 duration-200" />
            </div>
          ) : (
            <div className="relative z-10 h-full w-full overflow-hidden rounded-full">
              <Image
                src="/software-agent.png"
                alt="JKS AI Career Advisor"
                fill
                sizes="52px"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
            </div>
          )}

          {/* Green Online Beacon */}
          {!isOpen && (
            <span className="absolute bottom-0 right-0 z-20 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-900 shadow-xs" />
            </span>
          )}

          {/* Unread Pill Badge */}
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
            className="fixed bottom-16 right-3 sm:right-6 sm:bottom-20 z-50 flex h-[410px] sm:h-[450px] max-h-[72vh] sm:max-h-[76vh] w-[calc(100vw-1.5rem)] max-w-[335px] sm:max-w-[355px] flex-col overflow-hidden rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-[0_20px_50px_-10px_rgba(15,23,42,0.35)] dark:shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] backdrop-blur-xl"
          >
            {/* Chatbot Luxury Header (Clean, Classic & Professional) */}
            <div className="relative overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-2.5 sm:p-3 text-white shrink-0 border-b border-white/10">
              {/* Ambient radial glow */}
              <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-blue-600/30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-24 w-24 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                {/* Advisor Profile Identity */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="relative flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-xl overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1px] shadow-sm shadow-blue-500/30 ring-1 ring-white/20">
                    <div className="relative h-full w-full rounded-[10px] overflow-hidden bg-slate-900">
                      <Image
                        src="/software-agent.png"
                        alt="JKS AI Career Advisor"
                        fill
                        sizes="34px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full border border-slate-950 bg-emerald-500 shadow-2xs" />
                  </div>

                  <div className="min-w-0">
                    <h3 className="text-xs font-bold tracking-tight text-white truncate">
                      {isStudentWorkspace ? "JKS AI Learning Assistant" : "JKS AI Career Advisor"}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[9.5px] text-emerald-400 font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      <span>{isStudentWorkspace ? "AI Tutor & Support Online" : "Admissions Advisor Online"}</span>
                    </div>
                  </div>
                </div>

                {/* Right Header Action Icons: WhatsApp SVG Icon + Close 'X' Button */}
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* WhatsApp SVG Icon Button */}
                  <a
                    href="https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses."
                    target="_blank"
                    rel="noopener noreferrer"
                    title="Chat on WhatsApp"
                    aria-label="Direct WhatsApp"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white border border-emerald-500/30 transition-all shadow-xs cursor-pointer group"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5 fill-current" />
                  </a>

                  {/* Close Window Button */}
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Chat"
                    className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 text-slate-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Sub-Header Notice Strip */}
              <div className="relative z-10 mt-2 flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-2 py-1 text-[10px] text-slate-300">
                <span className="flex items-center gap-1 truncate">
                  <Sparkles className="h-2.5 w-2.5 text-amber-300 shrink-0" />
                  <span className="truncate">Instant fees, syllabus &amp; batch guidance</span>
                </span>
                <span className="text-[9px] text-cyan-300 font-semibold shrink-0 ml-1">24/7 Live</span>
              </div>
            </div>

            {/* Chat Body & Scroll Container */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-white dark:from-surface dark:via-surface-secondary dark:to-surface-secondary">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-1.5 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Bot Micro-Avatar */}
                  {msg.sender === "bot" && (
                    <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs mb-0.5">
                      <Image
                        src="/software-agent.png"
                        alt="AI"
                        fill
                        sizes="24px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[88%]`}>
                    <div
                      className={`rounded-2xl px-3 py-2 text-xs leading-relaxed shadow-2xs ${
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

                    <span className="mt-0.5 text-[9px] text-slate-400 dark:text-slate-400 px-1 font-medium">{msg.timestamp}</span>

                    {/* Interactive Quick Action Pills */}
                    {msg.options && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {msg.options.map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              if (opt.includes("WhatsApp")) {
                                window.open(
                                  "https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses.",
                                  "_blank"
                                );
                              } else if (opt.includes("Register") || opt.includes("Registration")) {
                                window.location.href = "/register-course";
                              } else {
                                handleSendMessage(opt);
                              }
                            }}
                            className="rounded-full border border-blue-200 dark:border-blue-800/60 bg-white dark:bg-surface-elevated px-2.5 py-1 text-[10.5px] font-bold text-[#2563EB] dark:text-blue-400 shadow-2xs hover:bg-blue-50 dark:hover:bg-blue-950/50 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xs transition-all active:scale-95 cursor-pointer"
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Lead Capture Form Card */}
                    {msg.isLeadForm && !leadSubmitted && (
                      <form
                        onSubmit={handleLeadSubmit}
                        className="mt-2 w-full rounded-xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 dark:from-surface-secondary dark:via-surface-elevated dark:to-surface-hover p-3 shadow-sm shadow-blue-500/10 space-y-2 text-xs"
                      >
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5 text-xs">
                          <Sparkles className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                          <span>Instant Advisor Callback</span>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={leadForm.name}
                            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Mobile / WhatsApp *</label>
                          <input
                            type="tel"
                            inputMode="numeric"
                            maxLength={10}
                            required
                            placeholder="9876543210"
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value.replace(/[^0-9]/g, "").slice(0, 10) })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30 font-mono"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Preferred Track</label>
                          <select
                            value={leadForm.course}
                            onChange={(e) => setLeadForm({ ...leadForm, course: e.target.value })}
                            className="mt-0.5 w-full rounded-lg border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-input-bg p-2 text-[11px] text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                          >
                            <option>Java Full Stack Developer Mastery</option>
                            <option>Modern Frontend Engineering (React 19 & Next.js)</option>
                            <option>SAP S/4HANA Enterprise Systems</option>
                            <option>.NET 9 Enterprise Microservices & Cloud</option>
                          </select>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingLead}
                          className="w-full flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-[#2563EB] to-blue-600 py-2 text-xs font-bold text-white shadow-xs hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                        >
                          {isSubmittingLead ? "Submitting..." : "Request Instant Callback"}
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <div className="relative h-6 w-6 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 dark:ring-slate-700 shadow-2xs">
                    <Image
                      src="/software-agent.png"
                      alt="AI"
                      fill
                      sizes="24px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1 bg-white dark:bg-surface-elevated border border-slate-200/80 dark:border-slate-800/80 rounded-2xl px-2.5 py-1.5 shadow-2xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-bounce delay-150" />
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-600 animate-bounce delay-300" />
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 ml-1 font-medium">Advisor is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar & Footer (With relocated Reset/Restart button) */}
            <div className="border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-secondary p-2.5 space-y-1.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-1.5"
              >
                {/* Relocated Reset / New Chat Action Button */}
                <button
                  type="button"
                  onClick={restartConversation}
                  title="Start New Conversation"
                  aria-label="Restart Conversation"
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50 dark:bg-surface-elevated text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-surface-hover transition-colors shrink-0 cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>

                <input
                  type="text"
                  placeholder={
                    isStudentWorkspace
                      ? "Ask questions about lessons, tasks, or code..."
                      : "Ask about syllabus, fees, scholarships..."
                  }
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/80 dark:bg-input-bg px-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-blue-600 focus:bg-white dark:focus:bg-surface-elevated focus:ring-1 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-400 font-medium"
                />

                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-8.5 w-8.5 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2563EB] to-cyan-500 text-white shadow-xs hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[9.5px] text-slate-400 dark:text-slate-400 font-medium px-1">
                <span>⚡ Instant AI Career Guidance</span>
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
