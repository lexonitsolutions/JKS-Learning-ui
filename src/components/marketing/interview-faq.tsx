"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: "How does the AI adapt difficulty during the interview in real time?",
    a: "Our AI engine evaluates not just keyword matches, but structural depth, edge case anticipation, and clarity. If you answer an architecture question with senior-level nuance, the next question automatically escalates into distributed failure modes and tradeoff evaluations. If you struggle, it adjusts to test fundamental mechanics without breaking interview flow.",
  },
  {
    q: "How is JKS AI Mock Interview different from generic ChatGPT or LeetCode?",
    a: "Unlike static LeetCode problem sets or unstructured chat prompts, JKS simulates realistic 1-on-1 enterprise interview dynamics. It evaluates 5 discrete competencies (Technical Depth, Problem Solving, Communication, Answer Quality, and Confidence) against thousands of calibrated candidate benchmarks, delivering a structured diagnostic report and targeted curriculum study plan.",
  },
  {
    q: "Can I practice for specific tracks like SAP, Java Full Stack, or Frontend?",
    a: "Yes. JKS provides specialized tracks with domain-accurate question banks and evaluation matrices: React 19 / Next.js frontend, Java Spring Boot & Microservices, SAP S/4HANA (CAP/RAP/Clean Core), and Distributed System Design.",
  },
  {
    q: "Can I retake interviews and track my score improvements over time?",
    a: "Absolutely. You can run unlimited mock interviews. Your dashboard tracks performance trajectories across all 5 axes, showing exactly how each study recommendation translates to measurable score increases over time.",
  },
  {
    q: "How long does a mock interview session typically take?",
    a: "Sessions are designed for high efficiency: a focused 5 to 10 question adaptive round takes approximately 12–18 minutes. Your comprehensive readiness report and study plan are generated instantly the moment you finish.",
  },
];

export function InterviewFaq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="mx-auto max-w-3xl space-y-3">
      {FAQS.map((faq, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={idx}
            className={`rounded-xl border transition-all duration-200 overflow-hidden ${
              isOpen
                ? "border-primary-blue/40 bg-white shadow-sm"
                : "border-border bg-bg-light/60 hover:bg-white"
            }`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between p-5 text-left font-semibold text-text-heading cursor-pointer text-sm sm:text-base"
            >
              <span className="flex items-center gap-3">
                <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-mono ${
                  isOpen ? "bg-primary-blue text-white" : "bg-primary-blue/10 text-primary-blue"
                }`}>
                  {idx + 1}
                </span>
                {faq.q}
              </span>
              <ChevronDown
                className={`h-4 w-4 text-text-body transition-transform duration-200 ${
                  isOpen ? "rotate-180 text-primary-blue" : ""
                }`}
              />
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-text-body border-t border-border/40">
                    {faq.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
