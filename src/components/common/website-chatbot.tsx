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
  Clock,
} from "lucide-react";
import { addLead } from "@/lib/data/leads-store";

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
    text: "Hello! 👋 Welcome to JKS Learning. I'm Jordan, your AI Admissions & Career Advisor. How can I help accelerate your tech career today?",
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

  // Determine if current page is an allowed marketing/public page where chatbot is helpful
  const isAllowedPage = useMemo(() => {
    if (!pathname) return false;
    // Disallow all admin, instructor, and dashboard workspaces
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/instructor") ||
      pathname.startsWith("/dashboard")
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

  const handleSendMessage = (textToSend?: string) => {
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

    setTimeout(() => {
      generateBotResponse(text);
      setIsTyping(false);
    }, 800);
  };

  const generateBotResponse = (userQuery: string) => {
    const q = userQuery.toLowerCase();
    let replyText = "";
    let options: string[] | undefined;
    let isLeadForm = false;

    if (q.includes("course") || q.includes("syllabus") || q.includes("program")) {
      replyText =
        "We offer 4 premier enterprise certification tracks:\n\n1. ☕ **Java Full Stack Mastery** (Spring Boot 3, Microservices, React 19, AWS)\n2. ⚛️ **Modern Frontend Engineering** (Next.js 16, TypeScript, Three.js 3D)\n3. 🏢 **SAP S/4HANA Enterprise Systems** (FI/CO, MM, SD & ABAP on Cloud)\n4. 🔷 **.NET 9 Enterprise Microservices** (C# 13, ASP.NET Core, Azure Cloud)\n\nWhich technology aligns with your career target?";
      options = [
        "Java Full Stack Details ☕",
        "Frontend Engineering ⚛️",
        "SAP S/4HANA 🏢",
        ".NET 9 Cloud 🔷",
      ];
    } else if (q.includes("fee") || q.includes("scholarship") || q.includes("discount") || q.includes("price") || q.includes("cost")) {
      replyText =
        "💎 Course Tuition starts from **₹29,999** (inclusive of live cohort classes, hands-on capstone projects, placement assistance, and tax invoice).\n\n🎉 **Early Admission Discount:** Use coupon `ADMISSION10` during registration for an instant 10% scholarship!\n\nWould you like to speak to an admissions advisor or register online?";
      options = [
        "Register for Cohort 📝",
        "Talk to Admissions Advisor 📞",
        "Check Placement Record 💼",
      ];
    } else if (q.includes("placement") || q.includes("job") || q.includes("salary") || q.includes("package") || q.includes("hike")) {
      replyText =
        "📈 **JKS Learning Placement Highlights:**\n• **94.8%** Verified Placement Rate within 180 days\n• **₹12.4 LPA** Average Starting Package for Full Stack graduates\n• **₹28.5 LPA** Highest CTC secured at Tier-1 MNCs & Product firms\n• 150+ Hiring Partners (Infosys, TCS, Cognizant, Wipro, Accenture, Thoughtworks)\n\nWould you like our career team to review your resume?";
      options = [
        "Book Free Career Call 📞",
        "Explore Course Tracks 🚀",
        "WhatsApp Direct 💬",
      ];
    } else if (q.includes("counselor") || q.includes("advisor") || q.includes("call") || q.includes("contact") || q.includes("talk")) {
      replyText =
        "Awesome! Our senior admissions counselors Sneha and Kavita can provide personalized 1-on-1 batch selection, syllabus breakdown, and scholarship advice.\n\nPlease fill out your details below to schedule an immediate call:";
      isLeadForm = true;
    } else if (q.includes("java")) {
      replyText =
        "🔥 **Java Full Stack Developer Mastery** is our flagship 24-week cohort.\n\n• Core Java 21, Spring Boot 3, Hibernate\n• Distributed Microservices, Kafka, Redis\n• React 19, Tailwind CSS, TypeScript\n• AWS Cloud Deployment & CI/CD Pipelines\n• 4 Production Grade Capstone Projects\n\nNext Cohort starts **Monday (Morning & Weekend Batches Available)**.";
      options = [
        "Register with Scholarship 📝",
        "Schedule Syllabus Walkthrough 📞",
      ];
    } else if (q.includes("frontend")) {
      replyText =
        "⚡ **Modern Frontend Engineering** covers:\n• React 19, Next.js 16 App Router, Server Actions\n• TypeScript strict typing, Tailwind CSS v4\n• Interactive Three.js / WebGL 3D experiences & Framer Motion\n• High performance state management & GraphQL\n\nPerfect for junior to mid-level engineers targeting product companies.";
      options = [
        "Register for Frontend 📝",
        "Talk to Admissions Team 📞",
      ];
    } else if (q.includes("register") || q.includes("admission") || q.includes("enroll")) {
      replyText =
        "You can register online directly through our automated enrollment portal! You'll select your batch timing, apply your discount coupon, and receive an instant GST Tax Invoice receipt.";
      options = [
        "Open Registration Portal 📝",
        "Talk to Counselor First 📞",
      ];
    } else {
      replyText =
        "Thank you for reaching out! I can help you with course curriculums, batch timings, early-bird scholarships, and scheduling a direct consultation with our academic team.\n\nWhat would you like to explore?";
      options = [
        "Explore Courses 🚀",
        "Fee & Scholarships 💰",
        "Speak to Advisor 📞",
      ];
    }

    const botMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "bot",
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      options,
      isLeadForm,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    setIsSubmittingLead(true);
    try {
      addLead({

        name: leadForm.name,
        email: leadForm.email || `${leadForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        phone: leadForm.phone,
        interestedCourse: leadForm.course,
        source: "website_chatbot",
        status: "new",
        priority: "high",
        notes: "Requested instant advisor callback via Website AI Chatbot",
      });




      setLeadSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: "bot",
          text: `🎉 Thank you **${leadForm.name}**! Your consultation request for **${leadForm.course}** has been assigned to our senior admissions counselor.\n\nYou will receive a call or WhatsApp message at **${leadForm.phone}** within 15 minutes!`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingLead(false);
    }
  };

  return (
    <>
      {/* Floating Launcher Button */}
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
        {/* Auto-fading speech bubble tooltip (shows for 3.5s on load, or when hovered) */}
        <AnimatePresence>
          {!isOpen && (showGuidanceTooltip || isHovered) && (
            <motion.div
              initial={{ opacity: 0, x: 15, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="hidden sm:flex items-center gap-2.5 rounded-2xl border border-blue-100 bg-white/95 px-4 py-2.5 shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] backdrop-blur-md cursor-pointer hover:shadow-lg hover:border-blue-300 transition-all group"
              onClick={() => setIsOpen(true)}
            >
              <div className="relative flex h-2.5 w-2.5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                  Need Course Guidance?
                  <Sparkles className="h-3 w-3 text-amber-500" />
                </div>
                <div className="text-[10px] text-slate-500 font-medium">Admissions Advisor Online</div>
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
          className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full shadow-[0_10px_35px_rgba(37,99,235,0.45)] hover:shadow-[0_15px_40px_rgba(37,99,235,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer ring-4 ring-white/90 hover:ring-cyan-300 bg-slate-900"
          aria-label="Toggle Course Advisor Chatbot"
        >
          {/* Subtle Outer Pulse Glow */}
          <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 via-cyan-400 to-indigo-500 opacity-40 blur-sm group-hover:opacity-80 transition-opacity" />

          {isOpen ? (
            <div className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-slate-950 text-white">
              <X className="h-6 w-6 transition-transform group-hover:rotate-90 duration-200" />
            </div>
          ) : (
            <div className="relative z-10 h-full w-full overflow-hidden rounded-full">
              <Image
                src="/software-agent.png"
                alt="JKS AI Career Advisor"
                fill
                sizes="64px"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/20" />
            </div>
          )}

          {/* Green Online Beacon */}
          {!isOpen && (
            <span className="absolute bottom-0 right-0 z-20 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white shadow-xs" />
            </span>
          )}

          {/* Unread Pill Badge */}
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white border-2 border-white shadow-md">
              1
            </span>
          )}
        </button>
      </div>

      {/* Chat Window Modal / Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[620px] max-h-[85vh] w-[calc(100vw-2rem)] max-w-sm sm:max-w-[430px] flex-col overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35),0_0_0_1px_rgba(255,255,255,0.8)] backdrop-blur-2xl"
          >
            {/* Chatbot Luxury Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-4 text-white shrink-0 border-b border-white/10">
              {/* Ambient radial glow */}
              <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-blue-600/30 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-500/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl overflow-hidden bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/30 ring-1 ring-white/20">
                    <div className="relative h-full w-full rounded-[14px] overflow-hidden bg-slate-900">
                      <Image
                        src="/software-agent.png"
                        alt="JKS AI Career Advisor"
                        fill
                        sizes="44px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-slate-950 bg-emerald-500 shadow-xs" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-sm font-black tracking-tight truncate">JKS AI Career Advisor</h3>
                      <span className="inline-flex items-center rounded-full bg-blue-500/20 px-2 py-0.5 text-[9px] font-extrabold text-cyan-300 border border-cyan-400/30 shrink-0">
                        AI 2.0
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                      </span>
                      <span>Admissions Team Online</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <a
                    href="https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 rounded-xl bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500 hover:text-white transition-all shadow-xs"
                    title="Direct WhatsApp"
                  >
                    WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => setMessages(INITIAL_BOT_MESSAGES)}
                    title="Restart Conversation"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white transition-colors cursor-pointer"
                  >
                    <Clock className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close Chat"
                    className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-slate-300 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Sub-Header Notice Strip */}
              <div className="relative z-10 mt-3 flex items-center justify-between rounded-xl bg-white/5 border border-white/10 px-3 py-1.5 text-[11px] text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3 w-3 text-amber-300" />
                  <span>Ask fees, syllabus, or placement records</span>
                </span>
                <span className="text-[10px] text-cyan-300 font-semibold">24/7 Live</span>
              </div>
            </div>

            {/* Chat Body & Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-white">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-end gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {/* Bot Micro-Avatar */}
                  {msg.sender === "bot" && (
                    <div className="relative h-7 w-7 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 shadow-xs mb-1">
                      <Image
                        src="/software-agent.png"
                        alt="AI"
                        fill
                        sizes="28px"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  <div className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"} max-w-[85%]`}>
                    <div
                      className={`rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-xs ${
                        msg.sender === "user"
                          ? "bg-gradient-to-r from-[#2563EB] to-blue-600 text-white rounded-br-xs shadow-blue-500/20"
                          : "bg-white text-slate-800 border border-slate-100 rounded-bl-xs shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
                      }`}
                    >
                      <div className="whitespace-pre-line font-medium">{msg.text}</div>
                    </div>

                    <span className="mt-1 text-[10px] text-slate-400 px-1 font-medium">{msg.timestamp}</span>

                    {/* Interactive Quick Action Pills */}
                    {msg.options && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
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
                            className="rounded-full border border-blue-200 bg-white px-3.5 py-1.5 text-[11px] font-bold text-[#2563EB] shadow-2xs hover:bg-blue-50 hover:border-blue-300 hover:shadow-xs transition-all active:scale-95 cursor-pointer"
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
                        className="mt-3 w-full rounded-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50/40 to-indigo-50/40 p-4 shadow-md shadow-blue-500/10 space-y-3 text-xs"
                      >
                        <div className="font-black text-slate-900 flex items-center gap-1.5 text-sm">
                          <Sparkles className="h-4 w-4 text-blue-600" />
                          <span>Instant Advisor Callback</span>
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Ramesh Kumar"
                            value={leadForm.name}
                            onChange={(e) => setLeadForm({ ...leadForm, name: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700">Mobile / WhatsApp *</label>
                          <input
                            type="tel"
                            required
                            placeholder="+91 98765 43210"
                            value={leadForm.phone}
                            onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-bold text-slate-700">Preferred Course Track</label>
                          <select
                            value={leadForm.course}
                            onChange={(e) => setLeadForm({ ...leadForm, course: e.target.value })}
                            className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
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
                          className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-[#2563EB] to-blue-600 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-blue-800 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
                        >
                          {isSubmittingLead ? "Submitting Request..." : "Request Instant Callback"}
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="relative h-7 w-7 rounded-full overflow-hidden shrink-0 ring-1 ring-slate-200 shadow-xs">
                    <Image
                      src="/software-agent.png"
                      alt="AI"
                      fill
                      sizes="28px"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 rounded-2xl px-3.5 py-2.5 shadow-2xs">
                    <span className="h-2 w-2 rounded-full bg-blue-600 animate-bounce" />
                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-bounce delay-150" />
                    <span className="h-2 w-2 rounded-full bg-indigo-600 animate-bounce delay-300" />
                    <span className="text-[11px] text-slate-400 ml-1 font-medium">Advisor is typing...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar & Footer */}
            <div className="border-t border-slate-100 bg-white p-3.5 space-y-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ask about syllabus, fees, scholarships..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all placeholder:text-slate-400 font-medium"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-cyan-500 text-white shadow-md shadow-blue-500/25 hover:scale-105 active:scale-95 transition-all disabled:opacity-40 disabled:pointer-events-none cursor-pointer shrink-0"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>

              <div className="flex items-center justify-center text-[10px] text-slate-400 font-medium">
                <span>⚡ Instant AI Career Guidance · JKS Learning</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
