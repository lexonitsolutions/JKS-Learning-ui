"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  X,
  Search,
  BookOpen,
  Layers,
  Video,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Check,
  CheckSquare,
  Square,
  ArrowRight,
  ArrowLeft,
  ArrowDownToLine,
  Sparkles,
  AlertCircle,
  HelpCircle,
  FileText,
  PlayCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useAllCourses,
  canonicalizeAssessmentType,
  type FullCourse,
  type Section,
  type SectionAssignment,
  type SubSection,
  type VideoItem,
} from "@/lib/data/courses-store";
import { apiFetch } from "@/lib/api/base-url";

interface ImportCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCourseSlugOrId?: string;
  onImport: (importedSections: Section[], replaceCurrent: boolean) => void;
}

export function ImportCourseModal({
  isOpen,
  onClose,
  currentCourseSlugOrId,
  onImport,
}: ImportCourseModalProps) {
  const allCourses = useAllCourses();

  // Filter out the current course if editing
  const availableCourses = useMemo(() => {
    return allCourses.filter(
      (c) =>
        c.slug !== currentCourseSlugOrId &&
        c.id !== currentCourseSlugOrId &&
        Array.isArray(c.sections) &&
        c.sections.length > 0
    );
  }, [allCourses, currentCourseSlugOrId]);

  const [step, setStep] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [activeCourse, setActiveCourse] = useState<FullCourse | null>(null);
  const [isLoadingCourse, setIsLoadingCourse] = useState(false);

  // Selection states for Step 2
  // Map of sectionId -> boolean (selected or not)
  const [selectedSectionIds, setSelectedSectionIds] = useState<Record<string, boolean>>({});
  // Map of sectionId -> boolean (import assignment or not)
  const [selectedAssignmentSectionIds, setSelectedAssignmentSectionIds] = useState<Record<string, boolean>>({});
  // Expand/collapse preview per section
  const [expandedSectionIds, setExpandedSectionIds] = useState<Record<string, boolean>>({});
  // Import mode: append or replace
  const [replaceExisting, setReplaceExisting] = useState(false);

  // Reset modal state on open/close
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSearchQuery("");
      setSelectedCourseId("");
      setActiveCourse(null);
      setSelectedSectionIds({});
      setSelectedAssignmentSectionIds({});
      setExpandedSectionIds({});
      setReplaceExisting(false);
    }
  }, [isOpen]);

  // When a course is selected, load its full details
  const handleSelectCourse = async (course: FullCourse) => {
    setSelectedCourseId(course.id || course.slug);
    setIsLoadingCourse(true);

    try {
      // Try to fetch full fresh course from backend if available
      let fullCourse = course;
      try {
        const res = await apiFetch(`/courses/${encodeURIComponent(course.slug || course.id)}`);
        if (res.ok) {
          const data = await res.json();
          if (data && (Array.isArray(data.sectionsJson) || Array.isArray(data.sections))) {
            fullCourse = {
              ...course,
              sections: data.sectionsJson || data.sections,
            };
          }
        }
      } catch {}

      setActiveCourse(fullCourse);

      // Pre-select all sections and all assignments by default for convenience
      const secMap: Record<string, boolean> = {};
      const asgMap: Record<string, boolean> = {};
      const expMap: Record<string, boolean> = {};

      (fullCourse.sections || []).forEach((sec, idx) => {
        secMap[sec.id] = true;
        // If section has an assignment with a title or questions, pre-select it
        asgMap[sec.id] = Boolean(sec.assignment?.title || sec.assignment?.description);
        // Expand the first section by default
        if (idx === 0) expMap[sec.id] = true;
      });

      setSelectedSectionIds(secMap);
      setSelectedAssignmentSectionIds(asgMap);
      setExpandedSectionIds(expMap);
      setStep(2);
    } catch {
      setActiveCourse(course);
      setStep(2);
    } finally {
      setIsLoadingCourse(false);
    }
  };

  // Filter courses by search query
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return availableCourses;
    const q = searchQuery.toLowerCase().trim();
    return availableCourses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        (c.track && c.track.toLowerCase().includes(q)) ||
        (c.level && c.level.toLowerCase().includes(q))
    );
  }, [availableCourses, searchQuery]);

  // Toggle single section
  const toggleSection = (sectionId: string) => {
    setSelectedSectionIds((prev) => {
      const nextVal = !prev[sectionId];
      // If toggling on, also enable its assignment
      if (nextVal) {
        setSelectedAssignmentSectionIds((asgPrev) => ({ ...asgPrev, [sectionId]: true }));
      }
      return { ...prev, [sectionId]: nextVal };
    });
  };

  // Toggle single assignment
  const toggleAssignment = (sectionId: string) => {
    setSelectedAssignmentSectionIds((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Toggle accordion expand
  const toggleExpand = (sectionId: string) => {
    setExpandedSectionIds((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  // Select all sections
  const handleSelectAll = (select: boolean) => {
    if (!activeCourse) return;
    const secMap: Record<string, boolean> = {};
    const asgMap: Record<string, boolean> = {};
    (activeCourse.sections || []).forEach((sec) => {
      secMap[sec.id] = select;
      asgMap[sec.id] = select ? Boolean(sec.assignment?.title) : false;
    });
    setSelectedSectionIds(secMap);
    setSelectedAssignmentSectionIds(asgMap);
  };

  // Toggle all assignments
  const handleToggleAllAssignments = (includeAll: boolean) => {
    if (!activeCourse) return;
    const asgMap: Record<string, boolean> = {};
    (activeCourse.sections || []).forEach((sec) => {
      asgMap[sec.id] = includeAll;
    });
    setSelectedAssignmentSectionIds(asgMap);
  };

  // Compute selection stats
  const totalSectionsCount = activeCourse?.sections?.length || 0;
  const selectedSectionsCount = Object.values(selectedSectionIds).filter(Boolean).length;
  const selectedAssignmentsCount = Object.entries(selectedAssignmentSectionIds).filter(
    ([secId, isSel]) => isSel && selectedSectionIds[secId]
  ).length;

  // Perform Deep Clone and Import
  const handleConfirmImport = () => {
    if (!activeCourse) return;

    const sourceSections = activeCourse.sections || [];
    const chosen = sourceSections.filter((sec) => selectedSectionIds[sec.id]);

    if (chosen.length === 0) return;

    const now = Date.now();
    const clonedSections: Section[] = chosen.map((sec, secIdx) => {
      const newSecId = `sec-${now}-${secIdx}-${Math.random().toString(36).substring(2, 6)}`;
      const shouldIncludeAssignment = Boolean(selectedAssignmentSectionIds[sec.id]);

      // Clone subsections with fresh IDs
      const clonedSubsections: SubSection[] = (sec.subsections || []).map((sub, subIdx) => {
        const newSubId = `sub-${now}-${secIdx}-${subIdx}`;
        const clonedVideos: VideoItem[] = (sub.videos || []).map((v, vIdx) => ({
          ...v,
          id: `v-${now}-${secIdx}-${subIdx}-${vIdx}`,
          order: v.order || vIdx + 1,
        }));
        return {
          ...sub,
          id: newSubId,
          order: sub.order || subIdx + 1,
          videos: clonedVideos,
        };
      });

      // Clone direct videos with fresh IDs
      const clonedDirectVideos: VideoItem[] = (sec.directVideos || []).map((v, vIdx) => ({
        ...v,
        id: `v-${now}-${secIdx}-dir-${vIdx}`,
        order: v.order || vIdx + 1,
      }));

      // Build assignment
      let clonedAssignment: SectionAssignment;
      if (shouldIncludeAssignment && sec.assignment) {
        const asg = sec.assignment;
        const asgType = canonicalizeAssessmentType(asg.type);
        const clonedQuestions = (asg.questions || []).map((q, qIdx) => ({
          ...q,
          id: `q-${now}-${secIdx}-${qIdx}`,
          type: canonicalizeAssessmentType(q.type || asgType),
          choices: Array.isArray(q.choices) ? [...q.choices] : undefined,
          structuredTestCases: Array.isArray(q.structuredTestCases) ? [...q.structuredTestCases] : undefined,
        }));

        clonedAssignment = {
          ...asg,
          id: `asg-${now}-${secIdx}`,
          title: asg.title || `${sec.title || "Section"} Practical Assessment`,
          type: asgType,
          minPassingScore: typeof asg.minPassingScore === "number" ? asg.minPassingScore : 70,
          questions: clonedQuestions,
        };
      } else {
        // Fallback default clean assignment shell
        clonedAssignment = {
          id: `asg-${now}-${secIdx}`,
          title: `${sec.title || `Section ${secIdx + 1}`} Assessment`,
          description: `Practical assessment and milestone evaluation for ${sec.title || "this section"}.`,
          type: "Short Answer Question",
          minPassingScore: 70,
          modelAnswer: "",
          questions: [],
        };
      }

      return {
        id: newSecId,
        title: sec.title || `Imported Section ${secIdx + 1}`,
        order: secIdx + 1,
        description: sec.description || "",
        subsections: clonedSubsections,
        directVideos: clonedDirectVideos,
        assignment: clonedAssignment,
      };
    });

    onImport(clonedSections, replaceExisting);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-4 bg-slate-50/70 dark:bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-[#1E5EFF] dark:text-blue-400">
              <ArrowDownToLine className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <span>Import Curriculum from Existing Course</span>
                <span className="rounded-full bg-blue-100 dark:bg-blue-950/70 px-2.5 py-0.5 text-[10px] font-bold text-[#1E5EFF] dark:text-blue-400">
                  Step {step} of 2
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {step === 1
                  ? "Select an existing course to pull curriculum modules, lessons, or assignments from."
                  : `Select which sections and assignments from "${activeCourse?.title}" to import.`}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer"
            aria-label="Close import dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* STEP 1: CHOOSE SOURCE COURSE */}
          {step === 1 && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search existing courses by title, track, or level..."
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 outline-none focus:border-[#1E5EFF] focus:bg-white dark:focus:bg-slate-900 transition-all"
                  autoFocus
                />
              </div>

              {/* Course Cards Grid */}
              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[55vh] overflow-y-auto pr-1">
                  {filteredCourses.map((c) => {
                    const secCount = c.sections?.length || 0;
                    // Count total lessons
                    let lessonCount = 0;
                    let assignmentCount = 0;
                    (c.sections || []).forEach((sec) => {
                      lessonCount += (sec.directVideos?.length || 0);
                      (sec.subsections || []).forEach((sub) => {
                        lessonCount += (sub.videos?.length || 0);
                      });
                      if (sec.assignment?.title || sec.assignment?.description) {
                        assignmentCount += 1;
                      }
                    });

                    return (
                      <button
                        key={c.id || c.slug}
                        type="button"
                        onClick={() => handleSelectCourse(c)}
                        disabled={isLoadingCourse}
                        className="flex flex-col justify-between text-left p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-[#1E5EFF] dark:hover:border-blue-500 hover:shadow-md transition-all cursor-pointer group"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <span className="rounded-md bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 text-[10px] font-bold text-[#1E5EFF] dark:text-blue-400">
                              {c.track || "Track"}
                            </span>
                            <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
                              {c.level || "Intermediate"}
                            </span>
                          </div>

                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#1E5EFF] dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                            {c.title}
                          </h3>

                          {c.summary && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                              {c.summary}
                            </p>
                          )}
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          <div className="flex items-center gap-3">
                            <span className="flex items-center gap-1">
                              <Layers className="h-3.5 w-3.5 text-slate-400" />
                              <span>{secCount} Sections</span>
                            </span>
                            <span className="flex items-center gap-1">
                              <Video className="h-3.5 w-3.5 text-slate-400" />
                              <span>{lessonCount} Lessons</span>
                            </span>
                            {assignmentCount > 0 && (
                              <span className="flex items-center gap-1">
                                <ClipboardCheck className="h-3.5 w-3.5 text-emerald-500" />
                                <span>{assignmentCount} Tests</span>
                              </span>
                            )}
                          </div>

                          <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-[#1E5EFF] group-hover:translate-x-0.5 transition-all" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6">
                  <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-2 opacity-50" />
                  <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    No matching courses found
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Try searching with another keyword or ensure other published/draft courses exist.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: SELECT SECTIONS & ASSIGNMENTS */}
          {step === 2 && activeCourse && (
            <div className="space-y-4">
              {/* Selected Course Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200/80 dark:border-blue-900/50">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white border border-slate-200 dark:border-slate-700 shadow-xs cursor-pointer transition-colors"
                    title="Change course"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#1E5EFF] dark:text-blue-400">
                      Source Course
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-slate-950 dark:text-white line-clamp-1">
                      {activeCourse.title}
                    </div>
                  </div>
                </div>

                {/* Quick Selection Toggles */}
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => handleSelectAll(true)}
                    className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Select All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectAll(false)}
                    className="rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Deselect All
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleAllAssignments(true)}
                    className="rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 transition-colors cursor-pointer"
                  >
                    All Assignments
                  </button>
                </div>
              </div>

              {/* Sections Checklist */}
              <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                {(activeCourse.sections || []).map((section, idx) => {
                  const isSectionSelected = Boolean(selectedSectionIds[section.id]);
                  const isAssignmentSelected = Boolean(selectedAssignmentSectionIds[section.id]);
                  const isExpanded = Boolean(expandedSectionIds[section.id]);

                  // Count total videos in section
                  const directCount = section.directVideos?.length || 0;
                  const subCount = section.subsections?.length || 0;
                  let subVideosCount = 0;
                  (section.subsections || []).forEach((s) => {
                    subVideosCount += s.videos?.length || 0;
                  });
                  const totalLessons = directCount + subVideosCount;

                  const hasAssignment = Boolean(section.assignment?.title || section.assignment?.description);

                  return (
                    <div
                      key={section.id}
                      className={`rounded-2xl border transition-all ${
                        isSectionSelected
                          ? "border-blue-400 dark:border-blue-600 bg-white dark:bg-slate-900/90 shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/30 opacity-70"
                      }`}
                    >
                      {/* Section Card Header */}
                      <div className="p-3.5 sm:p-4 flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                          {/* Checkbox */}
                          <button
                            type="button"
                            onClick={() => toggleSection(section.id)}
                            className="mt-0.5 sm:mt-0 text-[#1E5EFF] dark:text-blue-400 hover:scale-105 transition-transform cursor-pointer shrink-0"
                            aria-label={`Toggle section ${idx + 1}`}
                          >
                            {isSectionSelected ? (
                              <CheckSquare className="h-5 w-5" />
                            ) : (
                              <Square className="h-5 w-5 text-slate-300 dark:text-slate-600" />
                            )}
                          </button>

                          {/* Section Title & Badges */}
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => toggleSection(section.id)}>
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                                Section {idx + 1}
                              </span>
                              <span className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
                                {subCount > 0 ? `${subCount} Subsections · ` : ""}{totalLessons} Lesson{totalLessons === 1 ? "" : "s"}
                              </span>
                              {hasAssignment && (
                                <span className="rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                  Includes Assignment
                                </span>
                              )}
                            </div>

                            <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                              {section.title || `Untitled Section ${idx + 1}`}
                            </h4>
                          </div>
                        </div>

                        {/* Expand / Collapse Button */}
                        <button
                          type="button"
                          onClick={() => toggleExpand(section.id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-600 dark:hover:text-slate-200 transition-colors cursor-pointer shrink-0"
                          title={isExpanded ? "Collapse preview" : "Expand lessons preview"}
                        >
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>

                      {/* Expandable Preview: Lessons & Assignment */}
                      {isExpanded && (
                        <div className="px-3.5 sm:px-4 pb-4 pt-1 border-t border-slate-100 dark:border-slate-800 space-y-3">
                          {/* Lessons Preview */}
                          <div className="space-y-1.5 text-[11px]">
                            <div className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[10px]">
                              Included Lessons ({totalLessons})
                            </div>

                            {/* Direct Videos */}
                            {directCount > 0 && (
                              <div className="space-y-1 pl-1">
                                {section.directVideos?.map((v, vIdx) => (
                                  <div
                                    key={v.id || vIdx}
                                    className="flex items-center gap-2 text-slate-700 dark:text-slate-300 py-0.5"
                                  >
                                    <PlayCircle className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                                    <span className="line-clamp-1 flex-1">{v.title}</span>
                                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                      {v.durationFormatted || "Video"}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            )}

                            {/* Subsections & Videos */}
                            {subCount > 0 && (
                              <div className="space-y-2 pl-1">
                                {section.subsections?.map((sub, sIdx) => (
                                  <div key={sub.id || sIdx} className="space-y-1">
                                    <div className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                      <span>{sub.title}</span>
                                    </div>
                                    <div className="pl-3 space-y-0.5">
                                      {sub.videos?.map((v, vIdx) => (
                                        <div
                                          key={v.id || vIdx}
                                          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 py-0.5"
                                        >
                                          <PlayCircle className="h-3 w-3 text-slate-400 shrink-0" />
                                          <span className="line-clamp-1 flex-1">{v.title}</span>
                                          <span className="text-[10px] font-mono text-slate-400 shrink-0">
                                            {v.durationFormatted}
                                          </span>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}

                            {totalLessons === 0 && (
                              <p className="text-slate-400 italic">No video lessons configured in this section.</p>
                            )}
                          </div>

                          {/* Section Assignment Toggle Card */}
                          <div
                            className={`p-3 rounded-xl border transition-all ${
                              isAssignmentSelected && isSectionSelected
                                ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
                                : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 opacity-60"
                            }`}
                          >
                            <div className="flex items-start sm:items-center justify-between gap-3">
                              <div className="flex items-start sm:items-center gap-2.5 flex-1 min-w-0">
                                <button
                                  type="button"
                                  disabled={!isSectionSelected}
                                  onClick={() => toggleAssignment(section.id)}
                                  className="mt-0.5 sm:mt-0 text-emerald-600 dark:text-emerald-400 hover:scale-105 disabled:opacity-30 cursor-pointer shrink-0"
                                >
                                  {isAssignmentSelected && isSectionSelected ? (
                                    <CheckSquare className="h-4 w-4" />
                                  ) : (
                                    <Square className="h-4 w-4 text-slate-300 dark:text-slate-600" />
                                  )}
                                </button>

                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => isSectionSelected && toggleAssignment(section.id)}
                                >
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
                                      Assignment
                                    </span>
                                    {section.assignment?.type && (
                                      <span className="rounded-full bg-white dark:bg-slate-900 px-2 py-0.2 text-[9px] font-semibold text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                        {canonicalizeAssessmentType(section.assignment.type)}
                                      </span>
                                    )}
                                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                      Pass: {section.assignment?.minPassingScore || 70}%
                                    </span>
                                  </div>

                                  <div className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                                    {section.assignment?.title || `${section.title || "Section"} Practical Assessment`}
                                  </div>

                                  {Array.isArray(section.assignment?.questions) && section.assignment.questions.length > 0 && (
                                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                                      Includes {section.assignment.questions.length} configured question(s) &amp; tests
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Import Options: Append vs Replace */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white">Import Strategy</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      !replaceExisting
                        ? "bg-white dark:bg-slate-900 border-[#1E5EFF] text-slate-900 dark:text-white font-bold shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={!replaceExisting}
                      onChange={() => setReplaceExisting(false)}
                      className="text-[#1E5EFF]"
                    />
                    <span>Append to current sections</span>
                  </label>

                  <label
                    className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                      replaceExisting
                        ? "bg-white dark:bg-slate-900 border-[#1E5EFF] text-slate-900 dark:text-white font-bold shadow-xs"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    <input
                      type="radio"
                      name="importMode"
                      checked={replaceExisting}
                      onChange={() => setReplaceExisting(true)}
                      className="text-[#1E5EFF]"
                    />
                    <span>Replace all current sections</span>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="border-t border-slate-100 dark:border-slate-800 px-5 sm:px-6 py-3.5 bg-slate-50/70 dark:bg-slate-950/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500 dark:text-slate-400 font-medium text-center sm:text-left">
            {step === 2 && (
              <span>
                Selected: <strong className="text-slate-900 dark:text-white">{selectedSectionsCount}</strong> of {totalSectionsCount} sections ·{" "}
                <strong className="text-slate-900 dark:text-white">{selectedAssignmentsCount}</strong> assignment(s)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            {step === 2 && (
              <button
                type="button"
                onClick={handleConfirmImport}
                disabled={selectedSectionsCount === 0}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 rounded-xl bg-[#1E5EFF] hover:bg-blue-700 disabled:opacity-50 px-5 py-2 text-xs font-bold text-white shadow-sm transition-all cursor-pointer"
              >
                <ArrowDownToLine className="h-4 w-4" />
                <span>
                  Import {selectedSectionsCount} Section{selectedSectionsCount === 1 ? "" : "s"}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
