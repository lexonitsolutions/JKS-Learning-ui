"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Plus,
  Trash2,
  BookOpen,
  Calendar,
  FileText,
  HelpCircle,
  Upload,
  User,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileCode,
  GraduationCap,
  Sparkles,
  Layers,
  Award,
} from "lucide-react";
import { createAdminTask, type TaskQuestion, type IndividualTask } from "@/lib/data/tasks-api";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";
import { getStoredCourses, type FullCourse } from "@/lib/data/courses-store";
import { fetchDbCourses } from "@/lib/data/courses-api";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (task: IndividualTask) => void;
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  track: string;
  topics: string[];
  isEnrolled?: boolean;
}

export function CreateTaskModal({ isOpen, onClose, onCreated }: CreateTaskModalProps) {
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
  const [selectedStudentEmail, setSelectedStudentEmail] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const [primaryType, setPrimaryType] = useState<"SHORT_ANSWER" | "LONG_ANSWER" | "MCQ" | "FILE_UPLOAD">("SHORT_ANSWER");
  const [taskMarks, setTaskMarks] = useState<number>(100);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [requiredFiles, setRequiredFiles] = useState(".pdf, .zip, .java, .py");
  
  // Questions list (starts with 1 primary question)
  const [questions, setQuestions] = useState<TaskQuestion[]>([
    {
      id: "q-1",
      type: "SHORT_ANSWER",
      prompt: "",
      maxPoints: 100,
      modelAnswer: "",
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load students and comprehensive course list
  useEffect(() => {
    if (!isOpen) return;

    // 1. Fetch Students
    fetchAdminStudents().then((data) => {
      setStudents(data);
      if (data.length > 0 && !selectedStudentEmail) {
        setSelectedStudentEmail(data[0].email);
      }
    });

    // 2. Load courses from both live DB and stored courses
    const loadCoursesData = async () => {
      const stored = getStoredCourses();
      let liveDb: any[] = [];
      try {
        liveDb = await fetchDbCourses();
      } catch {
        // fallback to stored courses
      }

      const map = new Map<string, CourseItem>();

      stored.forEach((c) => {
        const topics = (c.sections || []).map((s) => s.title).filter(Boolean);
        map.set(c.id, {
          id: c.id,
          title: c.title,
          slug: c.slug,
          track: c.track || "Full Stack",
          topics,
        });
      });

      liveDb.forEach((c) => {
        const existing = map.get(c.id);
        const dbTopics = (c.modules || []).map((m: any) => m.title).filter(Boolean);
        if (existing) {
          existing.topics = Array.from(new Set([...existing.topics, ...dbTopics]));
        } else {
          map.set(c.id, {
            id: c.id,
            title: c.title,
            slug: c.slug,
            track: c.track || "Full Stack",
            topics: dbTopics,
          });
        }
      });

      setAllCourses(Array.from(map.values()));
    };

    loadCoursesData();
  }, [isOpen]);

  // Selected student details
  const selectedStudent = useMemo(() => {
    return students.find((s) => s.email.toLowerCase() === selectedStudentEmail.toLowerCase());
  }, [students, selectedStudentEmail]);

  // Enrolled courses of the selected student
  const studentEnrolledCourses = useMemo(() => {
    if (!selectedStudent || !selectedStudent.enrollments) return [];
    return selectedStudent.enrollments.map((e) => ({
      id: e.courseId,
      title: e.courseTitle,
      slug: e.courseSlug,
      track: e.track,
    }));
  }, [selectedStudent]);

  // Auto-select course when student changes
  useEffect(() => {
    if (studentEnrolledCourses.length > 0) {
      const currentExists = studentEnrolledCourses.some((c) => c.id === selectedCourseId);
      if (!currentExists) {
        setSelectedCourseId(studentEnrolledCourses[0].id);
      }
    } else if (allCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(allCourses[0].id);
    }
  }, [selectedStudentEmail, studentEnrolledCourses, allCourses]);

  // Current selected course object
  const currentCourse = useMemo(() => {
    return (
      allCourses.find((c) => c.id === selectedCourseId) ||
      (studentEnrolledCourses.find((c) => c.id === selectedCourseId)
        ? {
            id: selectedCourseId,
            title: studentEnrolledCourses.find((c) => c.id === selectedCourseId)!.title,
            slug: studentEnrolledCourses.find((c) => c.id === selectedCourseId)!.slug,
            track: studentEnrolledCourses.find((c) => c.id === selectedCourseId)!.track,
            topics: [],
          }
        : null)
    );
  }, [allCourses, studentEnrolledCourses, selectedCourseId]);

  // When course changes, update topic selection
  useEffect(() => {
    if (currentCourse && currentCourse.topics.length > 0) {
      setSelectedTopic(currentCourse.topics[0]);
    } else {
      setSelectedTopic("CUSTOM");
    }
  }, [currentCourse]);

  // When topic changes, update Title & Description suggestions if empty or default
  useEffect(() => {
    const topicName = selectedTopic === "CUSTOM" ? customTopic : selectedTopic;
    if (topicName && topicName !== "CUSTOM") {
      setTitle((prev) => {
        if (!prev || prev.includes("Assignment") || prev.includes("Task")) {
          return `${topicName} Practical Task`;
        }
        return prev;
      });
      setDescription((prev) => {
        if (!prev || prev.startsWith("Hands-on")) {
          return `Hands-on coursework assignment covering ${topicName} concepts, implementation, and proctored verification.`;
        }
        return prev;
      });
      // Update first question prompt if empty
      setQuestions((prev) => {
        if (prev.length === 1 && !prev[0].prompt) {
          const copy = [...prev];
          copy[0] = {
            ...copy[0],
            prompt: `Explain the core principles and demonstrate a working solution for ${topicName}.`,
          };
          return copy;
        }
        return prev;
      });
    }
  }, [selectedTopic, customTopic]);

  // When primary type changes, update the first question
  const handlePrimaryTypeChange = (newType: "SHORT_ANSWER" | "LONG_ANSWER" | "MCQ" | "FILE_UPLOAD") => {
    setPrimaryType(newType);
    setQuestions((prev) => {
      if (prev.length === 0) {
        return [
          {
            id: `q-${Date.now()}`,
            type: newType,
            prompt: "",
            maxPoints: taskMarks,
            modelAnswer: newType === "SHORT_ANSWER" || newType === "LONG_ANSWER" ? "" : undefined,
            choices: newType === "MCQ" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
            correctAnswer: newType === "MCQ" ? 0 : undefined,
          },
        ];
      }
      const copy = [...prev];
      copy[0] = {
        ...copy[0],
        type: newType,
        maxPoints: taskMarks,
        modelAnswer: newType === "SHORT_ANSWER" || newType === "LONG_ANSWER" ? copy[0].modelAnswer || "" : undefined,
        choices: newType === "MCQ" ? copy[0].choices || ["Option A", "Option B", "Option C", "Option D"] : undefined,
        correctAnswer: newType === "MCQ" ? copy[0].correctAnswer || 0 : undefined,
      };
      return copy;
    });
  };

  const handleAddQuestion = (type: TaskQuestion["type"]) => {
    const newQ: TaskQuestion = {
      id: `q-${Date.now()}-${questions.length + 1}`,
      type,
      prompt: "",
      maxPoints: type === "LONG_ANSWER" ? 20 : type === "SHORT_ANSWER" ? 10 : 5,
      modelAnswer: type === "SHORT_ANSWER" || type === "LONG_ANSWER" ? "" : undefined,
      choices: type === "MCQ" ? ["Option A", "Option B", "Option C", "Option D"] : undefined,
      correctAnswer: type === "MCQ" ? 0 : undefined,
    };
    setQuestions((prev) => [...prev, newQ]);
  };

  const handleUpdateQuestion = (index: number, patch: Partial<TaskQuestion>) => {
    setQuestions((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...patch };
      return copy;
    });
  };

  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 1) return; // Keep at least one question
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const handleChoiceChange = (qIndex: number, cIndex: number, text: string) => {
    setQuestions((prev) => {
      const copy = [...prev];
      const q = { ...copy[qIndex] };
      if (q.choices) {
        const newChoices = [...q.choices];
        newChoices[cIndex] = text;
        q.choices = newChoices;
      }
      copy[qIndex] = q;
      return copy;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !selectedStudentEmail.trim()) {
      setErrorMessage("Please enter task title, description, and assign to a student.");
      return;
    }

    if (questions.some((q) => !q.prompt.trim())) {
      setErrorMessage("Please ensure every question has a prompt before assigning.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const topicLabel = selectedTopic === "CUSTOM" ? customTopic.trim() : selectedTopic;
      const courseTitle = currentCourse ? currentCourse.title : undefined;
      const courseId = currentCourse ? currentCourse.id : undefined;

      const res = await createAdminTask({
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim() || (topicLabel ? `Topic: ${topicLabel}` : undefined),
        courseId,
        courseTitle,
        assignedStudentId: selectedStudent?.id,
        assignedStudentEmail: selectedStudentEmail.trim().toLowerCase(),
        assignedStudentName: selectedStudent?.name,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        requiredFiles: primaryType === "FILE_UPLOAD" ? requiredFiles.trim() : undefined,
        questions: questions.map((q) => ({
          ...q,
          maxPoints: q.maxPoints || taskMarks,
        })),
      });

      if (res.success && res.data) {
        onCreated(res.data);
        onClose();
      } else {
        setErrorMessage(res.error || "Failed to create individual assignment.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Assign Course Task to Student
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Assign a customized task (Student &rarr; Course &rarr; Topic &rarr; Type &rarr; Question &rarr; Marks &rarr; Due Date)
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* STEP 1 & 2: Student & Course Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                1. Select Student *
              </label>
              <select
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
                required
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              >
                {students.map((s) => {
                  const enrolledCount = s.enrollments ? s.enrollments.length : 0;
                  return (
                    <option key={s.id} value={s.email}>
                      {s.name} ({s.email}) · {enrolledCount} {enrolledCount === 1 ? "Course" : "Courses"}
                    </option>
                  );
                })}
              </select>
              {selectedStudent && (
                <p className="mt-1 text-[11px] text-blue-600 dark:text-blue-400 font-medium">
                  {selectedStudent.name} is enrolled in {studentEnrolledCourses.length} active course(s).
                </p>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                2. Select Course *
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              >
                {studentEnrolledCourses.length > 0 && (
                  <optgroup label="Student's Enrolled Courses">
                    {studentEnrolledCourses.map((c) => (
                      <option key={`enrolled-${c.id}`} value={c.id}>
                        ⭐ {c.title} ({c.track})
                      </option>
                    ))}
                  </optgroup>
                )}

                <optgroup label="All System Courses">
                  {allCourses
                    .filter((c) => !studentEnrolledCourses.some((se) => se.id === c.id))
                    .map((c) => (
                      <option key={`all-${c.id}`} value={c.id}>
                        {c.title} ({c.track})
                      </option>
                    ))}
                </optgroup>

                <option value="">-- General / Independent Task --</option>
              </select>
              {currentCourse && (
                <p className="mt-1 text-[11px] text-slate-400">
                  Track: {currentCourse.track} · {currentCourse.topics.length} Curriculum Modules
                </p>
              )}
            </div>
          </div>

          {/* STEP 3: Topic / Curriculum Section */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/40 p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                3. Course Topic / Module Section
              </label>
              <span className="text-[10px] text-slate-400 font-medium">
                Choose from course syllabus or type custom
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select
                value={selectedTopic}
                onChange={(e) => setSelectedTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              >
                {currentCourse && currentCourse.topics.length > 0 ? (
                  <>
                    <optgroup label="Course Syllabus Modules">
                      {currentCourse.topics.map((t, i) => (
                        <option key={i} value={t}>
                          {t}
                        </option>
                      ))}
                    </optgroup>
                    <option value="CUSTOM">+ Type Custom Topic...</option>
                  </>
                ) : (
                  <>
                    <option value="CUSTOM">Custom Topic</option>
                  </>
                )}
              </select>

              {selectedTopic === "CUSTOM" && (
                <input
                  type="text"
                  required
                  value={customTopic}
                  onChange={(e) => setCustomTopic(e.target.value)}
                  placeholder="e.g. Microservices Architecture &amp; Kafka Event Sinks"
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              )}
            </div>
          </div>

          {/* STEP 4 & 5: Assignment Type & Marks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                4. Primary Assignment Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-1.5">
                {[
                  { id: "SHORT_ANSWER", label: "Short Answer", desc: "Concise answers" },
                  { id: "LONG_ANSWER", label: "Long Answer", desc: "Detailed essays" },
                  { id: "MCQ", label: "MCQ Test", desc: "4 choices" },
                  { id: "FILE_UPLOAD", label: "File Upload", desc: "Zip, PDF, Code" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => handlePrimaryTypeChange(t.id as any)}
                    className={`rounded-xl border p-2 text-left transition-all cursor-pointer ${
                      primaryType === t.id
                        ? "border-[#2563EB] bg-blue-50/80 dark:bg-blue-950/50 text-[#2563EB] dark:text-blue-400 font-bold shadow-xs"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="text-xs">{t.label}</div>
                    <div className="text-[10px] opacity-75 font-normal">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Marks / Max Points
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={taskMarks}
                onChange={(e) => {
                  const val = Number(e.target.value) || 100;
                  setTaskMarks(val);
                  if (questions.length === 1) {
                    handleUpdateQuestion(0, { maxPoints: val });
                  }
                }}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Title & Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Task Title *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Build Real-time Chat Microservice with WebSockets"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* Description & Instructions */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
              Task Description &amp; Scope *
            </label>
            <textarea
              rows={2}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the objective and expected outcomes of this assignment..."
              className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
            />
          </div>

          {primaryType === "FILE_UPLOAD" && (
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Required Files / Submission Formats
              </label>
              <input
                type="text"
                value={requiredFiles}
                onChange={(e) => setRequiredFiles(e.target.value)}
                placeholder="e.g. .pdf, .zip, .java, .sql"
                className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-medium text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
              <p className="mt-1 text-[10px] text-slate-400">Accepted file extensions separated by commas</p>
            </div>
          )}

          {/* QUESTIONS BUILDER SECTION */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  Assignment Questions ({questions.length})
                </h4>
                <p className="text-[11px] text-slate-400">
                  Questions to be completed and answered by the student
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddQuestion("SHORT_ANSWER")}
                  className="rounded-lg bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 text-[#2563EB] dark:text-blue-400 px-2.5 py-1 text-[11px] font-bold hover:bg-blue-100 cursor-pointer"
                >
                  + Short Answer
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("LONG_ANSWER")}
                  className="rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 text-[11px] font-bold hover:bg-indigo-100 cursor-pointer"
                >
                  + Long Answer
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("MCQ")}
                  className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-[11px] font-bold hover:bg-emerald-100 cursor-pointer"
                >
                  + MCQ Test
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("FILE_UPLOAD")}
                  className="rounded-lg bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 px-2.5 py-1 text-[11px] font-bold hover:bg-purple-100 cursor-pointer"
                >
                  + File Upload
                </button>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated/60 p-3.5 space-y-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                      Question {idx + 1} &mdash;{" "}
                      <span className="text-[#2563EB] dark:text-blue-400 uppercase text-[10px]">
                        {q.type.replace("_", " ")}
                      </span>
                    </span>
                    {questions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="text-slate-400 hover:text-rose-600 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase">
                      Question Prompt *
                    </label>
                    <input
                      type="text"
                      required
                      value={q.prompt}
                      onChange={(e) => handleUpdateQuestion(idx, { prompt: e.target.value })}
                      placeholder="e.g. Explain how SAP ABAP Data Dictionary creates transparent tables"
                      className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Short & Long Answer: Admin Model Answer */}
                  {(q.type === "SHORT_ANSWER" || q.type === "LONG_ANSWER") && (
                    <div className="rounded-lg bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 p-2.5 space-y-1">
                      <label className="block text-[10px] font-bold text-blue-900 dark:text-blue-300 uppercase">
                        Admin Model Answer / Rubric (Used for Auto-Evaluation &amp; Matching)
                      </label>
                      <textarea
                        rows={2}
                        value={q.modelAnswer || ""}
                        onChange={(e) => handleUpdateQuestion(idx, { modelAnswer: e.target.value })}
                        placeholder="Enter the ideal model answer or key concepts student answers will be evaluated against..."
                        className="w-full rounded-md border border-blue-200 dark:border-blue-800 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  )}

                  {/* MCQ Options */}
                  {q.type === "MCQ" && q.choices && (
                    <div className="space-y-2 pt-1">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">
                        Choices (Select the radio button corresponding to the correct answer)
                      </label>
                      <div className="space-y-1.5">
                        {q.choices.map((choice, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id}`}
                              checked={q.correctAnswer === cIdx}
                              onChange={() => handleUpdateQuestion(idx, { correctAnswer: cIdx })}
                              className="accent-[#2563EB] cursor-pointer"
                            />
                            <input
                              type="text"
                              required
                              value={choice}
                              onChange={(e) => handleChoiceChange(idx, cIdx, e.target.value)}
                              placeholder={`Option ${cIdx + 1}`}
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-elevated cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Assigning...</span>
                </>
              ) : (
                <span>Assign Task to Student</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
