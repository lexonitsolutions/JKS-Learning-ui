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
  Search,
  CheckSquare,
  Square,
  Users,
  Repeat,
  ChevronDown,
} from "lucide-react";
import {
  batchAssignAdminTasks,
  createAdminTask,
  type TaskQuestion,
  type IndividualTask,
  type ReusableAssessment,
  saveStoredMasterAssessment,
  getStoredMasterAssessments,
  fetchAllReusableAssessments,
  recordAssessmentAssigned,
} from "@/lib/data/tasks-api";
import { fetchAdminStudents, type AdminStudentRecord } from "@/lib/data/students-api";
import { getStoredCourses } from "@/lib/data/courses-store";
import { fetchDbCourses } from "@/lib/data/courses-api";

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (task: IndividualTask) => void;
  onBatchCreated?: (tasks: IndividualTask[]) => void;
  initialAssessment?: ReusableAssessment | null;
  isReuseMode?: boolean;
}

interface CourseItem {
  id: string;
  title: string;
  slug: string;
  track: string;
  topics: string[];
}

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreated,
  onBatchCreated,
  initialAssessment,
  isReuseMode,
}: CreateTaskModalProps) {
  const [students, setStudents] = useState<AdminStudentRecord[]>([]);
  const [studentSearch, setStudentSearch] = useState("");
  const [selectedStudentEmails, setSelectedStudentEmails] = useState<string[]>([]);
  
  const [availableTemplates, setAvailableTemplates] = useState<ReusableAssessment[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("");
  const [templateSearch, setTemplateSearch] = useState<string>("");

  const [allCourses, setAllCourses] = useState<CourseItem[]>([]);
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

  // Filter templates based on optional search
  const filteredTemplates = useMemo(() => {
    if (!templateSearch.trim()) return availableTemplates;
    const q = templateSearch.toLowerCase().trim();
    return availableTemplates.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.courseTitle && t.courseTitle.toLowerCase().includes(q)) ||
        (t.description && t.description.toLowerCase().includes(q))
    );
  }, [availableTemplates, templateSearch]);

  // Group templates by Course Name for the dropdown
  const groupedTemplates = useMemo(() => {
    const map = new Map<string, ReusableAssessment[]>();
    filteredTemplates.forEach((t) => {
      const groupKey = t.courseTitle || "General Track / Standalone";
      const list = map.get(groupKey) || [];
      list.push(t);
      map.set(groupKey, list);
    });
    return Array.from(map.entries()).map(([courseName, items]) => ({
      courseName,
      items,
    }));
  }, [filteredTemplates]);

  const selectedTemplate = useMemo(() => {
    return availableTemplates.find((t) => t.id === selectedTemplateId);
  }, [availableTemplates, selectedTemplateId]);

  // Load students, courses, and apply template if passed
  useEffect(() => {
    if (!isOpen) return;

    // 1. Immediately populate from local cache
    const initialTemplates = getStoredMasterAssessments();
    setAvailableTemplates(initialTemplates);

    // 2. Asynchronously fetch live real course assessments & past tasks
    fetchAllReusableAssessments().then((liveTemplates) => {
      if (liveTemplates && liveTemplates.length > 0) {
        setAvailableTemplates(liveTemplates);
        if (initialAssessment) {
          const matched = liveTemplates.find(
            (t) =>
              t.id === initialAssessment.id ||
              t.title.toLowerCase().trim() === initialAssessment.title.toLowerCase().trim()
          );
          if (matched) {
            setSelectedTemplateId(matched.id);
            applyAssessmentTemplate(matched);
          }
        }
      }
    });

    if (initialAssessment) {
      setSelectedTemplateId(initialAssessment.id);
      applyAssessmentTemplate(initialAssessment);
    } else {
      setSelectedTemplateId("");
      setTitle("");
      setDescription("");
      setInstructions("");
      setDueDate("");
      setQuestions([
        {
          id: `q-${Date.now()}`,
          type: "SHORT_ANSWER",
          prompt: "",
          maxPoints: 100,
          modelAnswer: "",
        },
      ]);
    }

    // Fetch Students
    fetchAdminStudents().then((data) => {
      setStudents(data);
      if (data.length > 0 && selectedStudentEmails.length === 0) {
        // Pre-select first student as default or let admin choose
        setSelectedStudentEmails([data[0].email]);
      }
    });

    // Load courses
    const loadCoursesData = async () => {
      const stored = getStoredCourses();
      let liveDb: any[] = [];
      try {
        liveDb = await fetchDbCourses();
      } catch {}

      const map = new Map<string, CourseItem>();

      (stored || []).forEach((c, idx) => {
        if (!c) return;
        const cid = c.id || c.slug || `stored-${idx}`;
        const topics = (c.sections || []).map((s: any) => s.title).filter(Boolean);
        map.set(cid, {
          id: cid,
          title: c.title || "Untitled Course",
          slug: c.slug || cid,
          track: c.track || "Full Stack",
          topics,
        });
      });

      (liveDb || []).forEach((c, idx) => {
        if (!c) return;
        const cid = c.id || c.slug || `db-${idx}`;
        const existing = map.get(cid);
        const dbTopics = (c.modules || []).map((m: any) => m.title).filter(Boolean);
        if (existing) {
          existing.topics = Array.from(new Set([...existing.topics, ...dbTopics]));
        } else {
          map.set(cid, {
            id: cid,
            title: c.title || "Untitled Course",
            slug: c.slug || cid,
            track: c.track || "Full Stack",
            topics: dbTopics,
          });
        }
      });

      const uniqueCoursesList = Array.from(map.values()).filter(
        (c, index, self) => index === self.findIndex((t) => t.id === c.id)
      );

      setAllCourses(uniqueCoursesList);
    };

    loadCoursesData();
  }, [isOpen, initialAssessment]);

  // Apply template values from a reusable assessment
  const applyAssessmentTemplate = (tpl: ReusableAssessment) => {
    setTitle(tpl.title);
    setDescription(tpl.description || "");
    setInstructions(tpl.instructions || "");
    if (tpl.dueDate) {
      try {
        setDueDate(new Date(tpl.dueDate).toISOString().split("T")[0]);
      } catch {}
    }
    if (tpl.requiredFiles) setRequiredFiles(tpl.requiredFiles);
    if (tpl.questions && tpl.questions.length > 0) {
      setQuestions(tpl.questions);
      setPrimaryType(tpl.questions[0].type);
      const totalPoints = tpl.questions.reduce((sum, q) => sum + (q.maxPoints || 0), 0);
      if (totalPoints > 0) {
        setTaskMarks(totalPoints);
      }
    }
    if (tpl.courseId || tpl.courseTitle) {
      const match = allCourses.find(
        (c) =>
          (tpl.courseId && (c.id === tpl.courseId || c.slug === tpl.courseId)) ||
          (tpl.courseTitle && c.title.toLowerCase().trim() === tpl.courseTitle.toLowerCase().trim())
      );
      if (match) {
        setSelectedCourseId(match.id);
      } else if (tpl.courseId) {
        setSelectedCourseId(tpl.courseId);
      }
    }
  };

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    if (!templateId) {
      handleResetToBlank();
      return;
    }
    const tpl = availableTemplates.find((t) => t.id === templateId);
    if (tpl) {
      applyAssessmentTemplate(tpl);
    }
  };

  const handleResetToBlank = () => {
    setSelectedTemplateId("");
    setTitle("");
    setDescription("");
    setInstructions("");
    setDueDate("");
    setSelectedCourseId("");
    setQuestions([
      {
        id: `q-${Date.now()}`,
        type: "SHORT_ANSWER",
        prompt: "",
        maxPoints: 100,
        modelAnswer: "",
      },
    ]);
  };

  // Current selected course object
  const currentCourse = useMemo(() => {
    return allCourses.find((c) => c.id === selectedCourseId) || null;
  }, [allCourses, selectedCourseId]);

  // Students enrolled in current course
  const enrolledStudentEmails = useMemo(() => {
    if (!currentCourse) return [];
    return students
      .filter((s) => s.enrollments?.some((e) => e.courseId === currentCourse.id || e.courseTitle === currentCourse.title))
      .map((s) => s.email);
  }, [students, currentCourse]);

  // Filtered student list for selection UI
  const filteredStudents = useMemo(() => {
    if (!studentSearch.trim()) return students;
    const q = studentSearch.toLowerCase().trim();
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.enrollments?.some((e) => e.courseTitle.toLowerCase().includes(q))
    );
  }, [students, studentSearch]);

  const toggleStudentSelection = (email: string) => {
    setSelectedStudentEmails((prev) =>
      prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]
    );
  };

  const selectAllEnrolled = () => {
    if (enrolledStudentEmails.length > 0) {
      setSelectedStudentEmails(Array.from(new Set([...selectedStudentEmails, ...enrolledStudentEmails])));
    }
  };

  const selectAllStudents = () => {
    setSelectedStudentEmails(students.map((s) => s.email));
  };

  const clearSelection = () => {
    setSelectedStudentEmails([]);
  };

  // Primary type change
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
    if (questions.length <= 1) return;
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
    if (!title.trim() || !description.trim()) {
      setErrorMessage("Please enter an assessment title and description.");
      return;
    }

    if (selectedStudentEmails.length === 0) {
      setErrorMessage("Please select at least one student to assign this assessment to.");
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

      const studentTargets = selectedStudentEmails.map((email) => {
        const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
        return {
          id: found?.id,
          email: email.trim().toLowerCase(),
          name: found?.name,
        };
      });

      // 1. Batch assign to all selected students at once
      const res = await batchAssignAdminTasks({
        title: title.trim(),
        description: description.trim(),
        instructions: instructions.trim() || (topicLabel ? `Topic: ${topicLabel}` : undefined),
        courseId,
        courseTitle,
        students: studentTargets,
        dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        requiredFiles: primaryType === "FILE_UPLOAD" ? requiredFiles.trim() : undefined,
        questions: questions.map((q) => ({
          ...q,
          maxPoints: q.maxPoints || taskMarks,
        })),
      });

      if (res.success && res.tasks) {
        // 2. Save / update reusable assessment template for future reuse
        saveStoredMasterAssessment({
          title: title.trim(),
          description: description.trim(),
          instructions: instructions.trim() || (topicLabel ? `Topic: ${topicLabel}` : undefined),
          courseId,
          courseTitle,
          dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          requiredFiles: primaryType === "FILE_UPLOAD" ? requiredFiles.trim() : undefined,
          questions,
        });

        // Record students assigned
        recordAssessmentAssigned(title.trim(), selectedStudentEmails);

        // Notify parent
        if (onBatchCreated && res.tasks.length > 0) {
          onBatchCreated(res.tasks);
        } else if (res.tasks.length > 0) {
          res.tasks.forEach((t) => onCreated(t));
        }

        onClose();
      } else {
        setErrorMessage(res.error || "Failed to assign assessment.");
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-3 sm:p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-3xl rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 sm:p-6 shadow-2xl space-y-4 max-h-[92vh] overflow-y-auto animate-in fade-in zoom-in-95">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold shrink-0">
            <Repeat className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Assessment Assignment</span>
              <span className="rounded-full bg-blue-100 dark:bg-blue-950 px-2 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400">
                Multi-Student Reusable
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Create Assessment &rarr; Select Student(s) &rarr; Assign Assessment (reuse anytime across students)
            </p>
          </div>
        </div>

        {initialAssessment && (
          <div className="flex items-center justify-between rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3 border border-blue-200 dark:border-blue-800 text-xs">
            <span className="text-blue-800 dark:text-blue-300 font-medium">
              Assigning from template: <strong>{initialAssessment.title}</strong>
            </span>
            <button
              type="button"
              onClick={() => {
                setTitle("");
                setDescription("");
                setInstructions("");
                setDueDate("");
                setQuestions([
                  {
                    id: `q-${Date.now()}`,
                    type: "SHORT_ANSWER",
                    prompt: "",
                    maxPoints: 100,
                    modelAnswer: "",
                  },
                ]);
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 underline cursor-pointer"
            >
              Reset to Blank
            </button>
          </div>
        )}

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 p-3 text-xs font-semibold text-rose-700 dark:text-rose-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* STEP 1: Assessment Info */}
          <div className="rounded-xl border border-slate-200 dark:border-slate-800 p-3.5 space-y-3 bg-white dark:bg-surface-secondary">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#2563EB]" />
                Step 1: Assessment Details &amp; Questions
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                ✓ Available for unlimited reuse
              </span>
            </div>

            {/* Quick Reuse Existing Assignment Selector */}
            <div
              className={`rounded-2xl border transition-all p-3.5 sm:p-4 space-y-3 ${
                isReuseMode || selectedTemplateId
                  ? "border-blue-400 dark:border-blue-700 bg-gradient-to-br from-blue-50/90 via-indigo-50/50 to-white dark:from-blue-950/50 dark:via-surface-secondary dark:to-surface-secondary shadow-md shadow-blue-500/5 ring-2 ring-blue-500/20"
                  : "border-blue-200/90 dark:border-blue-800/80 bg-gradient-to-r from-blue-50/70 via-indigo-50/30 to-white dark:from-blue-950/30 dark:via-surface-secondary dark:to-surface-secondary shadow-2xs"
              }`}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#2563EB] text-white shadow-xs">
                    <Repeat className="h-4 w-4" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-blue-950 dark:text-blue-100 flex items-center gap-1.5">
                      <span>Reuse Existing Assignment</span>
                      <span className="rounded-full bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 text-[10px] font-black text-blue-700 dark:text-blue-300">
                        {availableTemplates.length} Available
                      </span>
                    </label>
                    <p className="text-[10.5px] text-blue-700/80 dark:text-blue-400">
                      Auto-fill questions and curriculum requirements from your created assignments
                    </p>
                  </div>
                </div>

                {selectedTemplateId && (
                  <button
                    type="button"
                    onClick={handleResetToBlank}
                    className="inline-flex items-center gap-1 rounded-lg bg-white dark:bg-surface-elevated px-2.5 py-1 text-[11px] font-bold text-blue-600 hover:text-blue-800 dark:text-blue-400 border border-blue-200 dark:border-blue-800 shadow-2xs cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    <span>Clear / Start Blank</span>
                  </button>
                )}
              </div>

              {/* Search Filter for Dropdown (if multiple templates) */}
              {availableTemplates.length > 5 && (
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-blue-400" />
                  <input
                    type="text"
                    placeholder="Search existing assignments by title, course, or questions..."
                    value={templateSearch}
                    onChange={(e) => setTemplateSearch(e.target.value)}
                    className="w-full rounded-xl border border-blue-200 dark:border-blue-800/80 bg-white/90 dark:bg-surface-elevated pl-8 pr-3 py-1.5 text-xs text-slate-800 dark:text-slate-100 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 placeholder:text-slate-400"
                  />
                  {templateSearch && (
                    <button
                      type="button"
                      onClick={() => setTemplateSearch("")}
                      className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-bold"
                    >
                      ×
                    </button>
                  )}
                </div>
              )}

              {/* Grouped Select Dropdown */}
              <div className="relative">
                <select
                  value={selectedTemplateId}
                  onChange={(e) => handleSelectTemplate(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-blue-300 dark:border-blue-700 bg-white dark:bg-surface-elevated px-3.5 py-2.5 pr-10 text-xs font-semibold text-slate-800 dark:text-slate-100 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/20 shadow-xs cursor-pointer transition-all"
                >
                  <option value="">
                    {availableTemplates.length === 0
                      ? "-- Loading created assignments... --"
                      : "-- Choose an Existing Assignment to Auto-Fill (Optional) --"}
                  </option>
                  {groupedTemplates.map((group) => (
                    <optgroup key={group.courseName} label={`📚 ${group.courseName} (${group.items.length})`}>
                      {group.items.map((t) => (
                        <option key={t.id} value={t.id}>
                          {t.title} — ({t.questions?.length || 0} question{t.questions?.length === 1 ? "" : "s"})
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-blue-500 dark:text-blue-400" />
              </div>

              {/* Active Selection Details Card */}
              {selectedTemplate && (
                <div className="rounded-xl bg-white dark:bg-surface-secondary border border-emerald-300/80 dark:border-emerald-800/80 p-3 space-y-1.5 shadow-2xs animate-in fade-in">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>Loaded Assignment: &ldquo;{selectedTemplate.title}&rdquo;</span>
                    </div>
                    <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 text-[10.5px] font-black shrink-0 border border-emerald-200 dark:border-emerald-800/60">
                      {selectedTemplate.questions?.length || 0} Questions Ready
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-300 line-clamp-2 italic">
                    {selectedTemplate.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[10.5px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span>
                      Course Track:{" "}
                      <strong className="text-slate-700 dark:text-slate-200">
                        {selectedTemplate.courseTitle || "General Track"}
                      </strong>
                    </span>
                    {selectedTemplate.timesAssigned > 0 && (
                      <span>
                        Previously Assigned:{" "}
                        <strong className="text-slate-700 dark:text-slate-200">
                          {selectedTemplate.timesAssigned} time(s)
                        </strong>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  Assessment Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Python Basics Assessment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  Target Course / Track
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                >
                  <option value="">-- General / Independent Track --</option>
                  {allCourses.map((c, idx) => (
                    <option key={`${c.id || c.slug || 'crs'}-${idx}`} value={c.id}>
                      {c.title} ({c.track})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                Brief Description / Objective *
              </label>
              <textarea
                rows={2}
                required
                placeholder="Describe what core skills this assessment evaluates..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>
          </div>

          {/* STEP 2: Multi-Student Selection */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/20 dark:bg-blue-950/20 p-3.5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-[#2563EB]" />
                Step 2: Select Student(s) ({selectedStudentEmails.length} Selected)
              </span>

              {/* Quick Select Buttons */}
              <div className="flex items-center gap-1.5 text-[11px]">
                {enrolledStudentEmails.length > 0 && (
                  <button
                    type="button"
                    onClick={selectAllEnrolled}
                    className="rounded-lg bg-blue-100 dark:bg-blue-900/50 px-2.5 py-1 font-bold text-[#2563EB] dark:text-blue-300 hover:bg-blue-200 transition-colors cursor-pointer"
                  >
                    Select All Enrolled ({enrolledStudentEmails.length})
                  </button>
                )}
                <button
                  type="button"
                  onClick={selectAllStudents}
                  className="rounded-lg bg-white dark:bg-surface-elevated border border-slate-200 dark:border-slate-700 px-2.5 py-1 font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Select All ({students.length})
                </button>
                <button
                  type="button"
                  onClick={clearSelection}
                  className="rounded-lg text-slate-500 hover:text-rose-600 px-1.5 py-1 font-semibold cursor-pointer"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Student Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search students by name, email, or enrolled course..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
              />
            </div>

            {/* Scrollable Student Checkbox List */}
            <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface divide-y divide-slate-100 dark:divide-slate-800">
              {filteredStudents.length === 0 ? (
                <div className="p-4 text-center text-slate-400">No students match your search.</div>
              ) : (
                filteredStudents.map((s) => {
                  const isChecked = selectedStudentEmails.includes(s.email);
                  const isEnrolledInCurrent = currentCourse
                    ? s.enrollments?.some((e) => e.courseId === currentCourse.id || e.courseTitle === currentCourse.title)
                    : false;

                  return (
                    <div
                      key={s.id}
                      onClick={() => toggleStudentSelection(s.email)}
                      className={`flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-surface-hover cursor-pointer transition-colors ${
                        isChecked ? "bg-blue-50/40 dark:bg-blue-950/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {isChecked ? (
                          <CheckSquare className="h-4 w-4 text-[#2563EB] shrink-0" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white truncate">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {s.email}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        {isEnrolledInCurrent && (
                          <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            Enrolled in Course
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400">
                          {s.enrollments?.length || 0} active tracks
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Due date picker for this batch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  Assignment Due Date (Optional)
                </label>
                <div className="relative mt-1">
                  <Calendar className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 text-[11px]">
                  Primary Submission Type
                </label>
                <select
                  value={primaryType}
                  onChange={(e) => handlePrimaryTypeChange(e.target.value as any)}
                  className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                >
                  <option value="SHORT_ANSWER">Text / Code Short Answer</option>
                  <option value="LONG_ANSWER">Long Form Project / Case Study</option>
                  <option value="MCQ">Multiple Choice Questions (Auto-Graded)</option>
                  <option value="FILE_UPLOAD">File / Project Archive Upload</option>
                </select>
              </div>
            </div>
          </div>

          {/* QUESTIONS LIST */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                Questions &amp; Tasks ({questions.length})
              </label>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAddQuestion("SHORT_ANSWER")}
                  className="rounded-lg bg-blue-50 dark:bg-blue-950/60 px-2 py-1 text-[10.5px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 transition-colors cursor-pointer"
                >
                  + Short Q
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("MCQ")}
                  className="rounded-lg bg-indigo-50 dark:bg-indigo-950/60 px-2 py-1 text-[10.5px] font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors cursor-pointer"
                >
                  + MCQ
                </button>
                <button
                  type="button"
                  onClick={() => handleAddQuestion("FILE_UPLOAD")}
                  className="rounded-lg bg-amber-50 dark:bg-amber-950/60 px-2 py-1 text-[10.5px] font-bold text-amber-700 dark:text-amber-400 hover:bg-amber-100 transition-colors cursor-pointer"
                >
                  + File Task
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {questions.map((q, idx) => (
                <div
                  key={q.id || idx}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-surface-elevated/40 p-3.5 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#2563EB] text-white text-[10px] font-black">
                        {idx + 1}
                      </span>
                      <span>Question #{idx + 1} ({q.type})</span>
                    </span>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-[10.5px] text-slate-400 font-semibold">Marks:</span>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={q.maxPoints || 20}
                          onChange={(e) => handleUpdateQuestion(idx, { maxPoints: Number(e.target.value) || 20 })}
                          className="w-14 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-0.5 text-center text-xs font-bold text-slate-900 dark:text-white"
                        />
                      </div>
                      {questions.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuestion(idx)}
                          className="text-slate-400 hover:text-rose-500 transition-colors cursor-pointer p-1"
                          title="Remove question"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      required
                      placeholder={`Enter question or problem prompt #${idx + 1}...`}
                      value={q.prompt}
                      onChange={(e) => handleUpdateQuestion(idx, { prompt: e.target.value })}
                      className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* MCQ choices */}
                  {q.type === "MCQ" && q.choices && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Options (Select Radio for Correct Answer)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {q.choices.map((choice, cIdx) => (
                          <div key={cIdx} className="flex items-center gap-2">
                            <input
                              type="radio"
                              name={`correct-${q.id || idx}`}
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
                              className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
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
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              Assigning will generate individual student records for attempt tracking.
            </span>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 dark:border-slate-700 px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-surface-elevated cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || selectedStudentEmails.length === 0}
                className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md shadow-blue-500/20 hover:bg-blue-700 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Assigning to {selectedStudentEmails.length} Students...</span>
                  </>
                ) : (
                  <span>Assign Assessment ({selectedStudentEmails.length} Students)</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
