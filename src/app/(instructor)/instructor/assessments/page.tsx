"use client";

import React, { useState } from "react";
import {
  ClipboardCheck,
  Search,
  CheckCircle2,
  Clock,
  Award,
  FileCode,
  Sparkles,
  X,
  ExternalLink,
  ChevronRight,
  MessageSquare,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";

interface SubmissionItem {
  id: string;
  studentName: string;
  studentInitials: string;
  courseTitle: string;
  assignmentTitle: string;
  type: "Coding Challenge" | "Project Submission" | "Case Study";
  submittedDate: string;
  status: "Pending Review" | "Graded";
  score?: number;
  studentCodeSnippet?: string;
  feedback?: string;
}

const INITIAL_SUBMISSIONS: SubmissionItem[] = [
  {
    id: "sub-101",
    studentName: "Priya Nair",
    studentInitials: "PN",
    courseTitle: "Java Full Stack Developer Mastery",
    assignmentTitle: "Transactional Outbox Pattern with Kafka CDC",
    type: "Coding Challenge",
    submittedDate: "Today at 2:10 PM",
    status: "Pending Review",
    studentCodeSnippet: `@Transactional
public void createOrder(OrderRequest request) {
    Order order = orderRepository.save(new Order(request));
    OutboxEvent event = new OutboxEvent("ORDER_CREATED", order.getId(), json(order));
    outboxRepository.save(event);
}`,
  },
  {
    id: "sub-102",
    studentName: "Arjun Mehta",
    studentInitials: "AM",
    courseTitle: "Java Full Stack Developer Mastery",
    assignmentTitle: "Idempotent Kafka Consumer Implementation",
    type: "Coding Challenge",
    submittedDate: "Today at 11:30 AM",
    status: "Pending Review",
    studentCodeSnippet: `@KafkaListener(topics = "orders")
public void handleOrderEvent(@Payload OrderEvent event, Acknowledgment ack) {
    if (processedEventRepo.existsById(event.getEventId())) {
        ack.acknowledge();
        return;
    }
    processOrder(event);
    processedEventRepo.save(new ProcessedEvent(event.getEventId()));
    ack.acknowledge();
}`,
  },
  {
    id: "sub-103",
    studentName: "Sneha Kulkarni",
    studentInitials: "SK",
    courseTitle: ".NET Full Stack Developer Enterprise Edition",
    assignmentTitle: "Clean Architecture CQRS Command Handler",
    type: "Project Submission",
    submittedDate: "Yesterday at 6:40 PM",
    status: "Pending Review",
    studentCodeSnippet: `public class CreateInvoiceCommandHandler : IRequestHandler<CreateInvoiceCommand, Result<Guid>>
{
    private readonly IInvoiceRepository _repository;
    public async Task<Result<Guid>> Handle(CreateInvoiceCommand cmd, CancellationToken ct) { ... }
}`,
  },
  {
    id: "sub-104",
    studentName: "Rahul Verma",
    studentInitials: "RV",
    courseTitle: "Java Full Stack Developer Mastery",
    assignmentTitle: "Spring Cloud Gateway Rate Limiting Filter",
    type: "Coding Challenge",
    submittedDate: "Aug 28, 2026",
    status: "Graded",
    score: 88,
    feedback: "Solid implementation of Redis token bucket algorithm.",
  },
  {
    id: "sub-105",
    studentName: "Karthik Reddy",
    studentInitials: "KR",
    courseTitle: "Java Full Stack Developer Mastery",
    assignmentTitle: "Kafka Distributed Event Consumer",
    type: "Coding Challenge",
    submittedDate: "Aug 27, 2026",
    status: "Graded",
    score: 95,
    feedback: "Exceptional code organization and error handling with Dead Letter Queues.",
  },
];

export default function InstructorAssessmentsPage() {
  const [submissions, setSubmissions] = useState<SubmissionItem[]>(INITIAL_SUBMISSIONS);
  const [activeTab, setActiveTab] = useState<"Pending" | "Graded">("Pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionItem | null>(null);

  // Grade form state
  const [scoreInput, setScoreInput] = useState(85);
  const [feedbackInput, setFeedbackInput] = useState("Well-structured solution with clean abstraction.");
  const [isSubmittingGrade, setIsSubmittingGrade] = useState(false);

  const pendingList = submissions.filter((s) => s.status === "Pending Review");
  const gradedList = submissions.filter((s) => s.status === "Graded");

  const displayedList = (activeTab === "Pending" ? pendingList : gradedList).filter((s) => {
    const query = searchQuery.toLowerCase();
    return (
      s.studentName.toLowerCase().includes(query) ||
      s.assignmentTitle.toLowerCase().includes(query) ||
      s.courseTitle.toLowerCase().includes(query)
    );
  });

  const handleOpenGrading = (sub: SubmissionItem) => {
    setSelectedSubmission(sub);
    setScoreInput(sub.score || 85);
    setFeedbackInput(sub.feedback || "Well-structured solution with clean abstraction.");
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    setIsSubmittingGrade(true);
    setTimeout(() => {
      const updated = submissions.map((s) =>
        s.id === selectedSubmission.id
          ? {
              ...s,
              status: "Graded" as const,
              score: Number(scoreInput),
              feedback: feedbackInput,
            }
          : s
      );
      setSubmissions(updated);
      setIsSubmittingGrade(false);
      setSelectedSubmission(null);
    }, 800);
  };

  return (
    <>
      <DashboardTopbar
        title="Assessments & Submission Grading"
        subtitle="Review student code solutions, assign scores, and deliver faculty mentorship."
        userInitials="RK"
      />

      <div className="flex-1 space-y-6 p-4 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Action & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#111827] p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveTab("Pending")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Pending"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              Pending Evaluation ({pendingList.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("Graded")}
              className={`rounded-xl px-4 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "Graded"
                  ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60"
              }`}
            >
              Graded Submissions ({gradedList.length})
            </button>
          </div>

          <div className="relative max-w-md w-full">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search by student, assignment, or course…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#121A2A] py-2 pr-3 pl-9 text-xs font-medium text-slate-800 dark:text-white outline-none shadow-xs transition-colors focus:border-[#2563EB] dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Submissions Table */}
        <div className="rounded-[24px] border border-white/80 dark:border-slate-800/80 bg-white/90 dark:bg-[#111827] shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
              <thead className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-[#151D2E] text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Student</th>
                  <th className="px-5 py-3.5">Assignment & Topic</th>
                  <th className="px-5 py-3.5">Course</th>
                  <th className="px-5 py-3.5">Submitted</th>
                  <th className="px-5 py-3.5">Status / Score</th>
                  <th className="px-5 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100/80 dark:divide-slate-800/80">
                {displayedList.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-xs font-bold text-[#2563EB] dark:text-blue-400">
                          {sub.studentInitials}
                        </div>
                        <div className="font-bold text-slate-900 dark:text-white">{sub.studentName}</div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="font-bold text-slate-900 dark:text-white">{sub.assignmentTitle}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{sub.type}</div>
                    </td>

                    <td className="px-5 py-4 text-slate-600 dark:text-slate-300 font-medium">
                      {sub.courseTitle}
                    </td>

                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400">
                      {sub.submittedDate}
                    </td>

                    <td className="px-5 py-4">
                      {sub.status === "Graded" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400">
                          <CheckCircle2 className="h-3 w-3" /> Score: {sub.score}/100
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-950/50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400">
                          <Clock className="h-3 w-3" /> Needs Evaluation
                        </span>
                      )}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenGrading(sub)}
                        className={`inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                          sub.status === "Pending Review"
                            ? "bg-[#2563EB] text-white shadow-xs hover:bg-blue-700"
                            : "border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#151D2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                      >
                        <FileCode className="h-3.5 w-3.5" />
                        <span>{sub.status === "Pending Review" ? "Grade Submission" : "View Feedback"}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Interactive Grading Modal */}
      <AnimatePresence>
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 dark:bg-slate-950/80 p-4 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative flex w-full max-w-2xl flex-col rounded-[24px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-[#111827] shadow-2xl overflow-hidden max-h-[90vh]"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-6 py-5 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400">
                    <ClipboardCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                      Evaluating: {selectedSubmission.assignmentTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                      Student: {selectedSubmission.studentName} • {selectedSubmission.courseTitle}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedSubmission(null)}
                  className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveGrade} className="p-6 space-y-4 overflow-y-auto text-xs">
                {/* Submitted Code View */}
                {selectedSubmission.studentCodeSnippet && (
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Submitted Code Solution
                    </label>
                    <div className="rounded-xl border border-slate-800 bg-[#0F172A] p-4 text-emerald-300 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed shadow-inner">
                      {selectedSubmission.studentCodeSnippet}
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Assigned Score (0 - 100) *
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      required
                      value={scoreInput}
                      onChange={(e) => setScoreInput(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-[#121A2A] p-2.5 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                      Passing Verdict
                    </label>
                    <div className="mt-2 text-xs font-bold">
                      {scoreInput >= 75 ? (
                        <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" /> Passed Minimum Threshold (75%+)
                        </span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" /> Below Pass Mark (Needs Resubmission)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Faculty Review & Feedback Notes
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Provide constructive feedback on architecture, scalability, or code cleanliness..."
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/50 dark:bg-[#121A2A] p-3 text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB] dark:placeholder-slate-500"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 shrink-0">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="rounded-xl px-4 py-2 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmittingGrade}
                    className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    {isSubmittingGrade ? "Saving Grade…" : "Submit Grade & Notify"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
