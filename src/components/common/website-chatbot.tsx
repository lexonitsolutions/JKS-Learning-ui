"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setHasUnread(false);
    }
  }, [isOpen, messages]);

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
    let botReplyText = "";
    let options: string[] | undefined = undefined;
    let isLeadForm = false;

    if (q.includes("course") || q.includes("explore")) {
      botReplyText =
        "We offer enterprise-grade job-ready programs across: \n• **Java Full Stack Developer Mastery** (Spring Boot 3, Microservices, AWS)\n• **Modern Frontend Engineering** (React 19, Next.js 15, TypeScript)\n• **SAP S/4HANA Enterprise Systems**\n• **.NET 9 Enterprise Microservices**\n\nAll programs include real capstone projects and AI Mock Interviews!";
      options = ["Fee & Scholarship Info 💰", "Book a Free Demo Class 🎓", "Request Callback 📞"];
    } else if (q.includes("fee") || q.includes("scholarship") || q.includes("cost") || q.includes("discount")) {
      botReplyText =
        "Our comprehensive 16–24 week accelerator tracks range from ₹35,000 to ₹65,000 with flexible 0% EMI options. We also offer merit-based scholarships up to 30% off based on our diagnostic test!";
      options = ["Claim Scholarship 🎁", "Talk to Live Counselor 📞", "Explore Courses 🚀"];
    } else if (q.includes("placement") || q.includes("salary") || q.includes("hike") || q.includes("job")) {
      botReplyText =
        "Our graduates achieve an average **75% salary hike** with top placement packages reaching **₹16.5 LPA** at companies like Infosys, Capgemini, TCS, and high-growth product startups. We provide 100% placement assistance, resume reviews, and adaptive AI mock interview practice.";
      options = ["Talk to Live Counselor 📞", "Explore Top Courses 🚀", "Book a Free Demo Class 🎓"];
    } else if (q.includes("counselor") || q.includes("talk") || q.includes("call") || q.includes("demo") || q.includes("scholarship")) {
      botReplyText =
        "Great! Please share your contact details below, and our senior academic counselor will connect with you immediately via Call or WhatsApp with personalized syllabus and discount details:";
      isLeadForm = true;
    } else {
      botReplyText =
        "Thanks for reaching out! Would you like to speak with our admissions team, explore our course syllabus, or check your eligibility for our placement guarantee?";
      options = ["Explore Top Courses 🚀", "Fee & Scholarship Info 💰", "Talk to Live Counselor 📞"];
    }

    const botMsg: ChatMessage = {
      id: `bot-${Date.now()}`,
      sender: "bot",
      text: botReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      options,
      isLeadForm,
    };

    setMessages((prev) => [...prev, botMsg]);
  };

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadForm.name || !leadForm.phone) return;

    setIsSubmittingLead(true);

    try {
      addLead({
        name: leadForm.name,
        phone: leadForm.phone,
        email: leadForm.email || `${leadForm.name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        interestedCourse: leadForm.course,
        source: "website_chatbot",
        campaignName: "Website_Chatbot_Enquiry",
        status: "new",
        priority: "high",
        notes: `Enquiry submitted via Chatbot for ${leadForm.course}`,
      });

      setLeadSubmitted(true);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: "bot",
          text: `🎉 Thank you, ${leadForm.name}! Your enquiry has been registered. Our senior admissions counselor has been assigned and will call you at ${leadForm.phone} shortly.`,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          options: ["Connect on WhatsApp Now 💬", "Explore Courses 🚀"],
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
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden sm:flex items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 px-4 py-2.5 shadow-xl backdrop-blur-md cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setIsOpen(true)}
          >
            <div className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-left">
              <div className="text-xs font-bold text-slate-900">Need Course Guidance?</div>
              <div className="text-[10px] text-slate-500">Admissions Advisor Online</div>
            </div>
          </motion.div>
        )}

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#2563EB] to-cyan-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform cursor-pointer"
          aria-label="Toggle Course Advisor Chatbot"
        >
          {hasUnread && !isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                1
              </span>
            </span>
          )}
          {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        </button>
      </div>

      {/* Chat Window Modal / Popup */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 flex h-[580px] w-[calc(100vw-2rem)] max-w-sm sm:max-w-md flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            {/* Chatbot Header */}
            <div className="flex items-center justify-between bg-gradient-to-r from-[#0B1120] via-slate-900 to-[#1E3A8A] p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <Bot className="h-5 w-5" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="text-sm font-bold">JKS Career Advisor</h3>
                    <span className="rounded bg-blue-500/30 px-1.5 py-0.2 text-[9px] font-bold text-cyan-300">
                      AI Powered
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-emerald-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Admissions Team Online</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <a
                  href="https://wa.me/919876543210?text=Hi%20JKS%20Learning,%20I%20want%20to%20know%20more%20about%20your%20courses."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 rounded-xl bg-emerald-600 px-2.5 py-1 text-[11px] font-bold text-white hover:bg-emerald-700 transition-colors"
                  title="Direct WhatsApp"
                >
                  WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Body & Scroll Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/70">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-[#2563EB] text-white rounded-br-xs shadow-xs"
                        : "bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs"
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>

                  <span className="mt-1 text-[10px] text-slate-400 px-1">{msg.timestamp}</span>

                  {/* Interactive Quick Action Pills */}
                  {msg.options && (
                    <div className="mt-2.5 flex flex-wrap gap-1.5 max-w-[90%]">
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
                            } else {
                              handleSendMessage(opt);
                            }
                          }}
                          className="rounded-full border border-blue-200 bg-white px-3 py-1 text-[11px] font-semibold text-[#2563EB] shadow-2xs hover:bg-blue-50 hover:border-blue-300 transition-all cursor-pointer"
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
                      className="mt-3 w-full max-w-[90%] rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-blue-50/50 p-4 shadow-sm space-y-3 text-xs"
                    >
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-blue-600" />
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
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-600"
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
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-600"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-bold text-slate-700">Preferred Course</label>
                        <select
                          value={leadForm.course}
                          onChange={(e) => setLeadForm({ ...leadForm, course: e.target.value })}
                          className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-2 text-xs text-slate-900 outline-none focus:border-blue-600"
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
                        className="w-full flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] py-2.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isSubmittingLead ? "Submitting..." : "Get Free Syllabus & Callback"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </form>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-3 py-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce delay-100" />
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 animate-bounce delay-200" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="border-t border-slate-200 bg-white p-3 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about syllabus, fees, placements..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="flex-1 rounded-xl border border-slate-200 px-3.5 py-2.5 text-xs text-slate-900 outline-none focus:border-blue-600 placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#2563EB] text-white hover:bg-blue-700 transition-colors disabled:opacity-40 cursor-pointer shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
