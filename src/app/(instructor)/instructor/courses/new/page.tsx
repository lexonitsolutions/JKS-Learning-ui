"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Plus,
  Trash2,
  Upload,
  Video,
  FileText,
  CheckCircle2,
  Layers,
  Sparkles,
  PlayCircle,
  X,
  FolderTree,
  ChevronDown,
  ChevronUp,
  Lock,
  Award,
  ShieldCheck,
  ClipboardCheck,
  Sliders,
  Check,
  HelpCircle,
  Loader2,
  AlertCircle,
  Code2,
  ArrowDownToLine,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { ImportCourseModal } from "@/components/admin/import-course-modal";
import {
  saveCourse,
  saveCourseAsync,
  getStoredCourses,
  canonicalizeAssessmentType,
  type FullCourse,
  type Section,
  type SubSection,
  type VideoItem,
  type VideoSourceType,
} from "@/lib/data/courses-store";
import type { Track } from "@/lib/data/courses";
import { mapBackendTrack } from "@/lib/data/courses-api";
import { apiFetch } from "@/lib/api/base-url";
import { fetchInstructors } from "@/lib/auth/use-mock-auth";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import { CourseThumbnailUploader } from "@/components/admin/course-thumbnail-uploader";
import {
  requestDirectUploadTicket,
  uploadVideoToBunnyStream,
} from "@/lib/data/videos-api";

import { VideoAssignmentManager } from "@/components/admin/video-assignment-manager";
import { SyllabusTemplateSelector } from "@/components/admin/syllabus-template-selector";

type StepNumber = 1 | 2 | 3 | 4;

interface StepTab {
  step: StepNumber;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STEPS: StepTab[] = [
  { step: 1, label: "1. Course Basics & Syllabus", shortLabel: "Basics & Syllabus", icon: Layers },
  { step: 2, label: "2. Curriculum, Videos & Assignments", shortLabel: "Curriculum & Assignments", icon: Video },
  { step: 3, label: "3. Anti-Skip & Security", shortLabel: "Anti-Skip", icon: Lock },
  { step: 4, label: "4. Certificate & Publish", shortLabel: "Certificate", icon: Award },

];

function InstructorNewCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams?.get("edit");

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingCourseId, setExistingCourseId] = useState<string | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [originalRating, setOriginalRating] = useState<number>(5.0);
  const [originalStudentsEnrolled, setOriginalStudentsEnrolled] = useState<number>(0);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importSuccessMessage, setImportSuccessMessage] = useState<string | null>(null);
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [selectedSyllabusTemplateId, setSelectedSyllabusTemplateId] = useState<string | null>(null);

  const clearFieldError = (fieldKey: string) => {
    setFieldErrors((prev) => {
      if (!prev[fieldKey]) return prev;
      const next = { ...prev };
      delete next[fieldKey];
      return next;
    });
    setValidationError(null);
  };

  const handleImportSections = (importedSections: Section[], replaceCurrent: boolean) => {
    if (!importedSections || importedSections.length === 0) return;

    // Check if current course only has 1 empty default draft section
    const isCurrentDraftEmpty =
      sections.length === 1 &&
      !sections[0].title.trim() &&
      (!sections[0].directVideos || sections[0].directVideos.length === 0) &&
      (!sections[0].subsections || sections[0].subsections.length === 0);

    if (replaceCurrent || isCurrentDraftEmpty) {
      const reordered = importedSections.map((sec, idx) => ({
        ...sec,
        order: idx + 1,
      }));
      setSections(reordered);
    } else {
      const currentCount = sections.length;
      const reorderedImported = importedSections.map((sec, idx) => ({
        ...sec,
        order: currentCount + idx + 1,
      }));
      setSections([...sections, ...reorderedImported]);
    }

    const totalLessons = importedSections.reduce(
      (acc, s) =>
        acc +
        (s.directVideos?.length || 0) +
        (s.subsections?.reduce((subAcc, sub) => subAcc + (sub.videos?.length || 0), 0) || 0),
      0
    );
    const totalAsg = importedSections.filter((s) => s.assignment?.title?.trim()).length;

    setImportSuccessMessage(
      `Successfully imported ${importedSections.length} section(s) with ${totalLessons} lesson(s) and ${totalAsg} assignment(s)!`
    );
    setTimeout(() => setImportSuccessMessage(null), 6000);
  };


  // Scroll to top whenever step changes so user never encounters stuck scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Step 1: Basic Info State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [track, setTrack] = useState<string>("Full Stack");
  const [subTrack, setSubTrack] = useState<string>("");
  const [availableTracks, setAvailableTracks] = useState<string[]>([
    "Full Stack",
    "Frontend",
    "SAP",
    "DotNet",
    "Cloud & DevOps",
    "Data Science & AI",
  ]);
  const [customTrackInput, setCustomTrackInput] = useState("");
  const [showCustomTrackInput, setShowCustomTrackInput] = useState(false);
  const [level, setLevel] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [durationWeeks, setDurationWeeks] = useState<number | string>("");
  const [price, setPrice] = useState<number | string>("");
  const [summary, setSummary] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const TRACK_SUBTRACKS: Record<string, string[]> = {
    SAP: [
      "SAP B1",
      "SAP Ariba",
      "SAP S/4HANA",
      "SAP ABAP",
      "SAP FICO",
      "SAP MM",
      "SAP SD",
      "SAP SuccessFactors",
      "SAP Basis",
    ],
    "Full Stack": [
      "Java Full Stack",
      "MERN / Full Stack JavaScript",
      "Python Full Stack",
      ".NET Cloud Architecture",
      "Spring Boot & Angular",
    ],
    Frontend: [
      "React 19 & Next.js",
      "Angular Enterprise Architecture",
      "Vue.js & Nuxt Architect",
      "React Native Mobile",
    ],
    DotNet: [
      ".NET 9 Web API & Microservices",
      "Azure Cloud Architecture",
      "C# Enterprise Systems",
      "Microservices & Kubernetes",
    ],
    "Cloud & DevOps": [
      "AWS Cloud Architecture",
      "Azure DevOps & CI/CD",
      "Docker & Kubernetes",
      "Terraform & GitOps",
    ],
    "Data Science & AI": [
      "Applied Generative AI & LLMs",
      "Python Data Science & ML",
      "Data Engineering & PySpark",
    ],
  };

  const getSubTracksForTrack = (selectedTrack: string): string[] => {
    const norm = (selectedTrack || "").toLowerCase();
    if (norm.includes("sap")) return TRACK_SUBTRACKS["SAP"];
    if (norm.includes("front")) return TRACK_SUBTRACKS["Frontend"];
    if (norm.includes("dotnet") || norm.includes(".net")) return TRACK_SUBTRACKS["DotNet"];
    if (norm.includes("cloud") || norm.includes("devops")) return TRACK_SUBTRACKS["Cloud & DevOps"];
    if (norm.includes("data") || norm.includes("ai")) return TRACK_SUBTRACKS["Data Science & AI"];
    return TRACK_SUBTRACKS["Full Stack"];
  };

  // Step 1: Instructor / Faculty State
  const [instructorsList, setInstructorsList] = useState<{ id: string; name: string; email: string }[]>([
    { id: "6aafc1a7d80072434f90eb89", name: "Davood Khan", email: "pattandavood123@gmail.com" },
    { id: "6aad83b294e145c985052247", name: "Jouli Srikanth", email: "joulisrikanth123@gmail.com" },
  ]);
  const [selectedInstructorId, setSelectedInstructorId] = useState<string>("6aafc1a7d80072434f90eb89");

  useEffect(() => {
    fetchInstructors()
      .then((list) => {
        if (list && list.length > 0) setInstructorsList(list);
      })
      .catch(() => {});
  }, []);

  const createDefaultQuestion = (qType: string) => {
    const canonical = canonicalizeAssessmentType(qType);
    let defaultChoices: string[] = [];
    let defaultFileTypes = ".zip, .pdf, .docx";
    let defaultChecklist = "";
    let defaultRubric = "";
    let defaultPoints = 10;

    if (canonical === "Multiple Select (Multi-Choice)") {
      defaultChoices = ["Option A", "Option B", "Option C", "Option D"];
      defaultPoints = 10;
    } else if (canonical === "Multiple Choice (MCQ)") {
      defaultChoices = ["Option A", "Option B", "Option C", "Option D"];
      defaultPoints = 5;
    } else if (canonical === "Project / File Upload") {
      defaultFileTypes = ".zip, .pdf, .docx";
      defaultChecklist = "- Source code archive (ZIP)\n- Execution screenshots / demo\n- Project documentation (PDF)";
      defaultRubric = "- Architecture & Modularity: 40%\n- Functional Implementation: 40%\n- Documentation & Best Practices: 20%";
      defaultPoints = 50;
    } else if (canonical === "Long Answer / Comprehensive") {
      defaultRubric = "- Concept & Architectural Clarity: 40%\n- Implementation & Technical Depth: 40%\n- Edge Cases & Best Practices: 20%";
      defaultPoints = 20;
    } else {
      defaultPoints = 10;
    }

    return {
      id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      prompt: "",
      type: canonical,
      choices: defaultChoices,
      correctIndex: 0,
      correctIndices: canonical === "Multiple Select (Multi-Choice)" ? [0, 1] : [0],
      modelAnswer: "",
      keywords: "",
      language: "JavaScript",
      starterCode: "",
      testCases: "",
      structuredTestCases: [],
      solutionCode: "",
      fileTypes: defaultFileTypes,
      maxFileSizeMb: 25,
      checklist: defaultChecklist,
      rubric: defaultRubric,
      minWords: 50,
      maxPoints: defaultPoints,
      explanation: "",
    };
  };

  // Step 2 & Step 3 & Step 4: Sections Builder State
  const [sections, setSections] = useState<Section[]>([
    {
      id: `sec-${Date.now()}`,
      title: "",
      order: 1,
      description: "",
      subsections: [],
      directVideos: [],
      assignment: {
        id: `asg-${Date.now()}`,
        title: "",
        description: "",
        type: "Short Answer Question",
        minPassingScore: 70,
        modelAnswer: "",
        questions: [
          {
            id: `q-${Date.now()}-init`,
            prompt: "",
            type: "Short Answer Question",
            choices: [],
            correctIndex: 0,
            modelAnswer: "",
            keywords: "",
            language: "JavaScript",
            starterCode: "",
            testCases: "",
            structuredTestCases: [],
            solutionCode: "",
            fileTypes: ".zip, .pdf, .docx",
            maxFileSizeMb: 25,
            checklist: "",
            rubric: "",
            minWords: 50,
            maxPoints: 10,
            explanation: "",
          },
        ],
      },
    },
  ]);

  // Step 3: Anti-Skip Settings State
  const [antiSkipEnforced, setAntiSkipEnforced] = useState(true);
  const [requireFullWatchToUnlockAssignment, setRequireFullWatchToUnlockAssignment] = useState(true);
  const [preventForwardSeeking, setPreventForwardSeeking] = useState(true);
  const [playbackSpeedCap, setPlaybackSpeedCap] = useState("1.5x");

  // Step 5: Certificate Settings State
  const [certificateTitle, setCertificateTitle] = useState("");
  const [requireAllVideosComplete, setRequireAllVideosComplete] = useState(true);
  const [requireAllAssignmentsPassed, setRequireAllAssignmentsPassed] = useState(true);

  // Video In-App Preview modal
  const [previewVideo, setPreviewVideo] = useState<{
    title: string;
    videoUrl: string;
    videoType: VideoSourceType;
    durationFormatted: string;
  } | null>(null);

  // Success toast / redirect state
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedSuccess, setPublishedSuccess] = useState(false);

  // Auto-Save Draft State
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [showDraftBanner, setShowDraftBanner] = useState(false);
  const [draftPayload, setDraftPayload] = useState<any>(null);
  const draftStorageKey = editSlug ? `jks_course_wizard_draft_${editSlug}` : "jks_course_wizard_draft_new";

  // Check for saved draft on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftStorageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.savedAt) {
          setDraftPayload(parsed);
          setShowDraftBanner(true);
          setDraftSavedAt(
            new Date(parsed.savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          );
        }
      }
    } catch {}
  }, [draftStorageKey]);

  const handleRestoreDraft = () => {
    if (!draftPayload) return;
    if (draftPayload.title !== undefined) setTitle(draftPayload.title);
    if (draftPayload.slug !== undefined) setSlug(draftPayload.slug);
    if (draftPayload.track !== undefined) setTrack(draftPayload.track);
    if (draftPayload.subTrack !== undefined) setSubTrack(draftPayload.subTrack);
    if (draftPayload.customTrackInput !== undefined) setCustomTrackInput(draftPayload.customTrackInput);
    if (draftPayload.level !== undefined) setLevel(draftPayload.level);
    if (draftPayload.durationWeeks !== undefined) setDurationWeeks(draftPayload.durationWeeks);
    if (draftPayload.price !== undefined) setPrice(draftPayload.price);
    if (draftPayload.summary !== undefined) setSummary(draftPayload.summary);
    if (draftPayload.thumbnailUrl !== undefined) setThumbnailUrl(draftPayload.thumbnailUrl);
    if (draftPayload.sections !== undefined) setSections(draftPayload.sections);
    if (draftPayload.selectedInstructorId !== undefined) setSelectedInstructorId(draftPayload.selectedInstructorId);
    if (draftPayload.antiSkipEnforced !== undefined) setAntiSkipEnforced(draftPayload.antiSkipEnforced);
    if (draftPayload.requireFullWatchToUnlockAssignment !== undefined) setRequireFullWatchToUnlockAssignment(draftPayload.requireFullWatchToUnlockAssignment);
    if (draftPayload.preventForwardSeeking !== undefined) setPreventForwardSeeking(draftPayload.preventForwardSeeking);
    if (draftPayload.playbackSpeedCap !== undefined) setPlaybackSpeedCap(draftPayload.playbackSpeedCap);
    if (draftPayload.certificateTitle !== undefined) setCertificateTitle(draftPayload.certificateTitle);
    if (draftPayload.requireAllVideosComplete !== undefined) setRequireAllVideosComplete(draftPayload.requireAllVideosComplete);
    if (draftPayload.requireAllAssignmentsPassed !== undefined) setRequireAllAssignmentsPassed(draftPayload.requireAllAssignmentsPassed);
    setShowDraftBanner(false);
  };

  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem(draftStorageKey);
    } catch {}
    setShowDraftBanner(false);
    setDraftSavedAt(null);
    setDraftPayload(null);
  };

  // Debounced auto-save draft effect
  useEffect(() => {
    if (!title.trim() || isLoadingEdit) return;

    setIsDraftSaving(true);
    const timer = setTimeout(() => {
      try {
        const now = Date.now();
        const payload = {
          title,
          slug,
          track,
          subTrack,
          customTrackInput,
          level,
          durationWeeks,
          price,
          summary,
          thumbnailUrl,
          sections,
          selectedInstructorId,
          antiSkipEnforced,
          requireFullWatchToUnlockAssignment,
          preventForwardSeeking,
          playbackSpeedCap,
          certificateTitle,
          requireAllVideosComplete,
          requireAllAssignmentsPassed,
          savedAt: now,
        };
        localStorage.setItem(draftStorageKey, JSON.stringify(payload));
        setIsDraftSaving(false);
        setDraftSavedAt(
          new Date(now).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        );
      } catch (err) {
        console.warn("Failed to auto-save course wizard draft:", err);
        setIsDraftSaving(false);
      }
    }, 1500);

    return () => clearTimeout(timer);
  }, [
    title,
    slug,
    track,
    subTrack,
    customTrackInput,
    level,
    durationWeeks,
    price,
    summary,
    thumbnailUrl,
    sections,
    selectedInstructorId,
    antiSkipEnforced,
    requireFullWatchToUnlockAssignment,
    preventForwardSeeking,
    playbackSpeedCap,
    certificateTitle,
    requireAllVideosComplete,
    requireAllAssignmentsPassed,
    isLoadingEdit,
    draftStorageKey,
  ]);

  // Clean up draft on successful publishing
  useEffect(() => {
    if (publishedSuccess) {
      try {
        localStorage.removeItem(draftStorageKey);
      } catch {}
    }
  }, [publishedSuccess, draftStorageKey]);

  // Load existing course when ?edit=<slug> is present
  useEffect(() => {
    if (!editSlug) return;
    let isMounted = true;
    setIsLoadingEdit(true);

    async function loadCourse() {
      try {
        let courseData: any = null;
        try {
          const res = await apiFetch(`/courses/${encodeURIComponent(editSlug!)}`);
          if (res.ok) {
            courseData = await res.json();
          }
        } catch {}

        if (!courseData) {
          const stored = getStoredCourses();
          courseData = stored.find(
            (c) => c.slug === editSlug || c.id === editSlug
          );
        }

        if (courseData && isMounted) {
          setIsEditMode(true);
          setExistingCourseId(courseData.id || null);
          // Preserve original rating and enrollment count so updates don't overwrite them
          setOriginalRating(typeof courseData.rating === "number" ? courseData.rating : 5.0);
          setOriginalStudentsEnrolled(typeof courseData.studentsEnrolled === "number" ? courseData.studentsEnrolled : 0);
          setTitle(courseData.title || "");
          setSlug(courseData.slug || "");
          const mappedTrack = mapBackendTrack(courseData.track);
          setTrack(mappedTrack);
          if (courseData.subTrack) setSubTrack(courseData.subTrack);
          if (courseData.level) setLevel(courseData.level);
          if (courseData.durationWeeks) setDurationWeeks(courseData.durationWeeks);
          if (courseData.priceCents !== undefined && courseData.priceCents !== null) {
            setPrice(Math.round(courseData.priceCents / 100));
          } else if (courseData.price !== undefined) {
            setPrice(courseData.price);
          } else {
            setPrice(0);
          }
          if (courseData.summary) setSummary(courseData.summary);
          if (courseData.thumbnail) setThumbnailUrl(courseData.thumbnail);
          if (courseData.instructorUserIds && courseData.instructorUserIds.length > 0) {
            setSelectedInstructorId(courseData.instructorUserIds[0]);
          }
          if (courseData.syllabusTemplateId) {
            setSelectedSyllabusTemplateId(courseData.syllabusTemplateId);
          }

          let rawSections = courseData.sectionsJson || courseData.sections;
          if ((!Array.isArray(rawSections) || rawSections.length === 0) && Array.isArray(courseData.modules) && courseData.modules.length > 0) {
            rawSections = courseData.modules.map((m: any, idx: number) => ({
              id: `sec-${m.id || idx}`,
              title: m.title || `Module ${idx + 1}`,
              order: m.order || idx + 1,
              description: m.description || "",
              subsections: (m.topics || []).map((t: any, tIdx: number) => ({
                id: `sub-${t.id || tIdx}`,
                title: t.title || `Topic ${tIdx + 1}`,
                order: t.order || tIdx + 1,
                description: t.description || "",
                videos: (t.videos || []).map((v: any, vIdx: number) => ({
                  id: `v-${v.id || vIdx}`,
                  title: v.title || `Video ${vIdx + 1}`,
                  durationSeconds: v.durationSeconds || 300,
                  durationFormatted: v.durationFormatted || "5:00",
                  videoType: (v.videoType as any) || "url",
                  videoUrl: v.videoUrl || v.providerAssetId || "",
                  order: v.order || vIdx + 1,
                  isFreeDemo: Boolean(v.isFreeDemo),
                  notes: v.notes || "",
                })),
              })),
              directVideos: [],
              assignment: {
                id: `asg-${m.id || idx}`,
                title: `${m.title || "Module"} Practical Assessment`,
                description: `Hands-on assessment and evaluation for ${m.title || "Module"}.`,
                type: "Multiple Choice (MCQ)",
                minPassingScore: 70,
                questions: [],
              },
            }));
          }
          if (Array.isArray(rawSections) && rawSections.length > 0) {
            const normalizedSections = rawSections.map((sec: any, idx: number) => {
              const asgType = canonicalizeAssessmentType(sec.assignment?.type);
              const rawQuestions = Array.isArray(sec.assignment?.questions) ? sec.assignment.questions : [];
              const normalizedQuestions = rawQuestions.map((q: any, qIdx: number) => {
                const rawQType =
                  q.type ||
                  (Array.isArray(q.choices) && q.choices.length > 1 ? "Multiple Choice (MCQ)" : undefined) ||
                  (q.starterCode || q.testCases ? "Coding Challenge / Test" : undefined) ||
                  asgType;

                return {
                  id: q.id || `q-${Date.now()}-${qIdx}`,
                  prompt: q.prompt || "",
                  type: canonicalizeAssessmentType(rawQType),
                  choices: Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : ["Option A", "Option B", "Option C", "Option D"],
                  correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
                  correctIndices: Array.isArray(q.correctIndices)
                    ? q.correctIndices
                    : typeof q.correctIndex === "number"
                    ? [q.correctIndex]
                    : [0],
                  modelAnswer: q.modelAnswer || "",
                keywords: q.keywords || "",
                language: q.language || "JavaScript",
                starterCode: q.starterCode || "",
                testCases: q.testCases || "",
                structuredTestCases: Array.isArray(q.structuredTestCases) ? q.structuredTestCases : [],
                solutionCode: q.solutionCode || "",
                fileTypes: q.fileTypes || ".zip, .pdf, .docx",
                maxFileSizeMb: typeof q.maxFileSizeMb === "number" ? q.maxFileSizeMb : 25,
                checklist: q.checklist || "",
                rubric: q.rubric || "",
                minWords: typeof q.minWords === "number" ? q.minWords : 50,
                maxPoints: typeof q.maxPoints === "number" ? q.maxPoints : 10,
                explanation: q.explanation || "",
              };
            });

              return {
                id: sec.id || `sec-${Date.now()}-${idx}`,
                title: sec.title || "",
                order: sec.order || idx + 1,
                description: sec.description || "",
                subsections: Array.isArray(sec.subsections) ? sec.subsections : [],
                directVideos: Array.isArray(sec.directVideos) ? sec.directVideos : [],
                assignment: {
                  id: sec.assignment?.id || `asg-${Date.now()}-${idx}`,
                  title: sec.assignment?.title || "",
                  description: sec.assignment?.description || "",
                  type: asgType,
                  minPassingScore:
                    typeof sec.assignment?.minPassingScore === "number"
                      ? sec.assignment.minPassingScore
                      : 70,
                  modelAnswer: sec.assignment?.modelAnswer || "",
                  questions: normalizedQuestions,
                },
              };
            });
            setSections(normalizedSections);
          }

          if (courseData.certificateTitle) {
            setCertificateTitle(courseData.certificateTitle);
          } else if (courseData.title) {
            setCertificateTitle(`Certified ${courseData.title} Specialist`);
          }
        }
      } catch (err) {
        console.error("Failed to load course for editing:", err);
      } finally {
        if (isMounted) setIsLoadingEdit(false);
      }
    }

    loadCourse();
    return () => {
      isMounted = false;
    };
  }, [editSlug]);

  // Sequential Stage Validation with Field Targeting
  interface StepValidation {
    valid: boolean;
    message: string;
    fieldId?: string;
    fieldKey?: string;
    step: StepNumber;
  }

  const validateStepWithField = (step: StepNumber): StepValidation => {
    if (step === 1) {
      if (!title.trim()) {
        return {
          valid: false,
          message: "Please enter a valid course title (at least 3 characters) before proceeding.",
          fieldId: "field-course-title",
          fieldKey: "title",
          step: 1,
        };
      }
      if (title.trim().length < 3) {
        return {
          valid: false,
          message: `Course title must have at least 3 characters (currently ${title.trim().length}).`,
          fieldId: "field-course-title",
          fieldKey: "title",
          step: 1,
        };
      }
      if (!slug.trim()) {
        return {
          valid: false,
          message: "Please provide a valid URL slug for the course.",
          fieldId: "field-course-slug",
          fieldKey: "slug",
          step: 1,
        };
      }
      if (slug.trim().length < 2) {
        return {
          valid: false,
          message: `URL slug must have at least 2 characters (currently ${slug.trim().length}).`,
          fieldId: "field-course-slug",
          fieldKey: "slug",
          step: 1,
        };
      }
      if (price === "" || Number(price) < 0 || isNaN(Number(price))) {
        return {
          valid: false,
          message: "Please enter a valid course price (₹0 or higher).",
          fieldId: "field-course-price",
          fieldKey: "price",
          step: 1,
        };
      }
      if (!summary.trim()) {
        return {
          valid: false,
          message: "Please provide a course summary (at least 10 characters) explaining the course.",
          fieldId: "field-course-summary",
          fieldKey: "summary",
          step: 1,
        };
      }
      if (summary.trim().length < 10) {
        return {
          valid: false,
          message: `Course summary must have at least 10 characters (currently ${summary.trim().length}).`,
          fieldId: "field-course-summary",
          fieldKey: "summary",
          step: 1,
        };
      }
      return { valid: true, message: "", step: 1 };
    }

    if (step === 2) {
      if (!sections || sections.length === 0) {
        return {
          valid: false,
          message: "Please add at least one curriculum section.",
          fieldId: "field-add-section-btn",
          fieldKey: "sections",
          step: 2,
        };
      }
      for (let i = 0; i < sections.length; i++) {
        if (!sections[i].title.trim()) {
          return {
            valid: false,
            message: `Section ${i + 1} requires a descriptive title before proceeding.`,
            fieldId: `field-section-title-${i}`,
            fieldKey: `section-title-${i}`,
            step: 2,
          };
        }
        if (sections[i].title.trim().length < 2) {
          return {
            valid: false,
            message: `Section ${i + 1} title must be at least 2 characters (currently ${sections[i].title.trim().length}).`,
            fieldId: `field-section-title-${i}`,
            fieldKey: `section-title-${i}`,
            step: 2,
          };
        }
      }
      const totalVideosCount = sections.reduce((acc, s) => {
        const subVids =
          s.subsections?.reduce((subAcc, sub) => subAcc + (sub.videos?.length || 0), 0) || 0;
        const dirVids = s.directVideos?.length || 0;
        return acc + subVids + dirVids;
      }, 0);
      if (totalVideosCount < 1) {
        return {
          valid: false,
          message: "Please add at least one video lecture to the curriculum before moving forward.",
          fieldId: "field-section-videos-0",
          fieldKey: "section-videos-0",
          step: 2,
        };
      }
      return { valid: true, message: "", step: 2 };
    }

    if (step === 3 || step === 4) {
      return { valid: true, message: "", step };
    }
    if (false && step === 3) {
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (!sec.assignment.title.trim()) {
          return {
            valid: false,
            message: `Please enter an Assignment Title for Section ${i + 1} requirement.`,
            fieldId: `field-assignment-title-${i}`,
            fieldKey: `assignment-title-${i}`,
            step: 3,
          };
        }
        if (
          typeof sec.assignment.minPassingScore !== "number" ||
          sec.assignment.minPassingScore < 40 ||
          sec.assignment.minPassingScore > 100
        ) {
          return {
            valid: false,
            message: `Section ${i + 1} passing mark must be between 40% and 100%.`,
            fieldId: `field-assignment-passmark-${i}`,
            fieldKey: `assignment-passmark-${i}`,
            step: 3,
          };
        }
      }
      return { valid: true, message: "", step: 3 };
    }

    if (step === 4) {
      return { valid: true, message: "", step: 4 };
    }

    return { valid: true, message: "", step: 4 };
  };

  const validateStep = (step: StepNumber): { valid: boolean; message: string } => {
    const res = validateStepWithField(step);
    return { valid: res.valid, message: res.message };
  };

  const scrollToAndHighlightField = (fieldId: string, fieldKey: string, message: string, targetStep: StepNumber) => {
    setFieldErrors((prev) => ({ ...prev, [fieldKey]: message }));
    setValidationError(message);

    const executeScroll = () => {
      const el = document.getElementById(fieldId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        const focusable = el.querySelector("input, textarea, select") as HTMLElement | null;
        if (focusable) {
          setTimeout(() => focusable.focus(), 250);
        } else if ("focus" in el) {
          setTimeout(() => (el as HTMLElement).focus(), 250);
        }
      }
    };

    if (targetStep !== currentStep) {
      setCurrentStep(targetStep);
      setTimeout(executeScroll, 200);
    } else {
      executeScroll();
    }
  };

  const isStepAccessible = (targetStep: StepNumber): boolean => {
    for (let s = 1; s < targetStep; s++) {
      const check = validateStepWithField(s as StepNumber);
      if (!check.valid) return false;
    }
    return true;
  };

  const handleStepClick = (targetStep: StepNumber) => {
    if (targetStep === currentStep) return;
    if (targetStep < currentStep) {
      setValidationError(null);
      setCurrentStep(targetStep);
      return;
    }
    for (let s = 1; s < targetStep; s++) {
      const check = validateStepWithField(s as StepNumber);
      if (!check.valid) {
        if (check.fieldId && check.fieldKey) {
          scrollToAndHighlightField(check.fieldId, check.fieldKey, check.message, check.step);
        } else {
          setValidationError(check.message);
        }
        return;
      }
    }
    setValidationError(null);
    setCurrentStep(targetStep);
  };

  const handleNextStep = () => {
    const check = validateStepWithField(currentStep);
    if (!check.valid) {
      if (check.fieldId && check.fieldKey) {
        scrollToAndHighlightField(check.fieldId, check.fieldKey, check.message, check.step);
      } else {
        setValidationError(check.message);
      }
      return;
    }
    setValidationError(null);
    if (currentStep < 4) {
      setCurrentStep((currentStep + 1) as StepNumber);
    }
  };

  // Helper to generate slug from title
  const handleTitleChange = (val: string) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "")
    );
  };

  // Section handlers
  const addSection = () => {
    const newOrder = sections.length + 1;
    const newSec: Section = {
      id: `sec-${Date.now()}`,
      title: "",
      order: newOrder,
      description: "",
      subsections: [],
      directVideos: [],
      assignment: {
        id: `asg-${Date.now()}`,
        title: "",
        description: "",
        type: "Short Answer Question",
        minPassingScore: 70,
        modelAnswer: "",
        questions: [createDefaultQuestion("Short Answer Question")],
      },
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (secId: string) => {
    if (sections.length <= 1) return;
    setSections(
      sections
        .filter((s) => s.id !== secId)
        .map((s, idx) => ({ ...s, order: idx + 1 }))
    );
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === sections.length - 1) return;
    const updated = [...sections];
    const targetIdx = direction === "up" ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setSections(updated.map((s, idx) => ({ ...s, order: idx + 1 })));
  };

  // Subsection handlers
  const addSubsectionToSection = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentSubs = sec.subsections || [];
    const newSubOrder = currentSubs.length + 1;
    const newSub: SubSection = {
      id: `sub-${Date.now()}`,
      title: "",
      order: newSubOrder,
      videos: [],
    };
    sec.subsections = [...currentSubs, newSub];
    setSections(updated);
  };

  const removeSubsection = (sectionIndex: number, subsectionId: string) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    if (sec.subsections) {
      sec.subsections = sec.subsections
        .filter((sub) => sub.id !== subsectionId)
        .map((sub, idx) => ({ ...sub, order: idx + 1 }));
    }
    setSections(updated);
  };

  // Video handlers
  const addDirectVideo = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentVideos = sec.directVideos || [];
    const newOrder = currentVideos.length + 1;
    const newVidId = `v-${Date.now()}`;
    const newVid: VideoItem = {
      id: newVidId,
      title: "",
      durationSeconds: 0,
      durationFormatted: "",
      videoType: "upload",
      videoUrl: "",
      order: newOrder,
    };
    sec.directVideos = [...currentVideos, newVid];
    setSections(updated);

    setTimeout(() => {
      const el = document.getElementById(`video-card-${newVidId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-[#2563EB]");
        setTimeout(() => el.classList.remove("ring-2", "ring-[#2563EB]"), 1800);
      }
    }, 120);
  };

  const removeDirectVideo = (sectionIndex: number, videoId: string) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    if (sec.directVideos) {
      sec.directVideos = sec.directVideos
        .filter((v) => v.id !== videoId)
        .map((v, idx) => ({ ...v, order: idx + 1 }));
    }
    setSections(updated);
  };

  const addVideoToSubsection = (sectionIndex: number, subsectionIndex: number) => {
    const updated = [...sections];
    const sub = updated[sectionIndex].subsections?.[subsectionIndex];
    if (!sub) return;
    const newOrder = sub.videos.length + 1;
    const newVidId = `v-${Date.now()}`;
    const newVid: VideoItem = {
      id: newVidId,
      title: "",
      durationSeconds: 0,
      durationFormatted: "",
      videoType: "upload",
      videoUrl: "",
      order: newOrder,
    };
    sub.videos = [...sub.videos, newVid];
    setSections(updated);

    setTimeout(() => {
      const el = document.getElementById(`video-card-${newVidId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-[#2563EB]");
        setTimeout(() => el.classList.remove("ring-2", "ring-[#2563EB]"), 1800);
      }
    }, 120);
  };

  const removeVideoFromSubsection = (
    sectionIndex: number,
    subsectionIndex: number,
    videoId: string
  ) => {
    const updated = [...sections];
    const sub = updated[sectionIndex].subsections?.[subsectionIndex];
    if (!sub) return;
    sub.videos = sub.videos
      .filter((v) => v.id !== videoId)
      .map((v, idx) => ({ ...v, order: idx + 1 }));
    setSections(updated);
  };

  // Assignment Question Handlers
  const addQuestionToAssignment = (sectionIndex: number) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    const currentQuestions = asg.questions || [];
    const qType = canonicalizeAssessmentType(asg.type);
    const newQId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newQ = {
      ...createDefaultQuestion(qType),
      id: newQId,
    };

    asg.questions = [...currentQuestions, newQ];
    setSections(updated);

    setTimeout(() => {
      const el = document.getElementById(`question-card-${newQId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-[#2563EB]");
        setTimeout(() => el.classList.remove("ring-2", "ring-[#2563EB]"), 1800);
      }
    }, 120);
  };

  const removeQuestionFromAssignment = (sectionIndex: number, questionIndex: number) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions) {
      asg.questions = asg.questions.filter((_, idx) => idx !== questionIndex);
    }
    setSections(updated);
  };

  const updateQuestionPrompt = (sectionIndex: number, questionIndex: number, prompt: string) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      asg.questions[questionIndex].prompt = prompt;
    }
    setSections(updated);
  };

  const updateQuestionField = (
    sectionIndex: number,
    questionIndex: number,
    field: string,
    val: any
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      const q = asg.questions[questionIndex] as any;
      q[field] = val;
      if (field === "type") {
        const canonical = canonicalizeAssessmentType(val);
        q.type = canonical;
        if (
          (canonical === "Multiple Choice (MCQ)" || canonical === "Multiple Select (Multi-Choice)") &&
          (!q.choices || q.choices.length === 0)
        ) {
          q.choices = ["Option A", "Option B", "Option C", "Option D"];
          q.correctIndex = 0;
          q.correctIndices = canonical === "Multiple Select (Multi-Choice)" ? [0, 1] : [0];
          if (!q.maxPoints) q.maxPoints = canonical === "Multiple Select (Multi-Choice)" ? 10 : 5;
        } else if (canonical === "Coding Challenge / Test") {
          if (!q.starterCode) {
            q.starterCode = "// Write your solution function here\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n";
          }
          if (!q.testCases) {
            q.testCases = "Input: solution([1, 2, 3]) => Expected Output: 6\nInput: solution([4, 5]) => Expected Output: 9";
          }
          if (!q.language) q.language = "JavaScript";
          if (!q.maxPoints) q.maxPoints = 25;
        } else if (canonical === "Project / File Upload") {
          if (!q.fileTypes) q.fileTypes = ".zip, .pdf, .docx";
          if (!q.checklist) q.checklist = "- Source code archive (ZIP)\n- Execution screenshots / demo\n- Project documentation (PDF)";
          if (!q.maxFileSizeMb) q.maxFileSizeMb = 25;
          if (!q.maxPoints) q.maxPoints = 50;
        } else if (canonical === "Long Answer / Comprehensive") {
          if (!q.rubric) q.rubric = "- Concept & Architectural Clarity: 40%\n- Implementation & Technical Depth: 40%\n- Edge Cases & Best Practices: 20%";
          if (!q.minWords) q.minWords = 100;
          if (!q.maxPoints) q.maxPoints = 20;
        } else if (canonical === "Short Answer Question") {
          if (!q.maxPoints) q.maxPoints = 10;
        }
      }
    }
    setSections(updated);
  };

  const updateQuestionChoice = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number,
    val: string
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      const choices = [...(asg.questions[questionIndex].choices || [])];
      choices[choiceIndex] = val;
      asg.questions[questionIndex].choices = choices;
    }
    setSections(updated);
  };

  const setQuestionCorrectIndex = (
    sectionIndex: number,
    questionIndex: number,
    correctIndex: number
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      asg.questions[questionIndex].correctIndex = correctIndex;
      (asg.questions[questionIndex] as any).correctIndices = [correctIndex];
    }
    setSections(updated);
  };

  const toggleQuestionCorrectIndex = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      const q = asg.questions[questionIndex] as any;
      const current: number[] = Array.isArray(q.correctIndices)
        ? [...q.correctIndices]
        : typeof q.correctIndex === "number"
        ? [q.correctIndex]
        : [0];
      const next = current.includes(choiceIndex)
        ? current.filter((i: number) => i !== choiceIndex)
        : [...current, choiceIndex].sort((a: number, b: number) => a - b);
      q.correctIndices = next.length > 0 ? next : [choiceIndex];
      q.correctIndex = q.correctIndices[0] ?? 0;
    }
    setSections(updated);
  };

  const addChoiceToQuestion = (sectionIndex: number, questionIndex: number) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      const choices = [...(asg.questions[questionIndex].choices || [])];
      choices.push("");
      asg.questions[questionIndex].choices = choices;
    }
    setSections(updated);
  };

  const removeChoiceFromQuestion = (
    sectionIndex: number,
    questionIndex: number,
    choiceIndex: number
  ) => {
    const updated = [...sections];
    const asg = updated[sectionIndex].assignment;
    if (asg.questions && asg.questions[questionIndex]) {
      let choices = [...(asg.questions[questionIndex].choices || [])];
      if (choices.length <= 2) return;
      choices = choices.filter((_, idx) => idx !== choiceIndex);
      asg.questions[questionIndex].choices = choices;
      if ((asg.questions[questionIndex].correctIndex ?? 0) >= choices.length) {
        asg.questions[questionIndex].correctIndex = 0;
      }
    }
    setSections(updated);
  };

  // Video file upload state tracking
  const [uploadProgress, setUploadProgress] = useState<
    Record<
      string,
      {
        status: "idle" | "uploading" | "ready" | "error";
        percent: number;
        fileName?: string;
        error?: string;
      }
    >
  >({});

  const getVideoDurationFromFile = (file: File): Promise<{ seconds: number; formatted: string }> => {
    return new Promise((resolve) => {
      try {
        const video = document.createElement("video");
        video.preload = "metadata";
        const url = URL.createObjectURL(file);
        video.onloadedmetadata = () => {
          URL.revokeObjectURL(url);
          const sec = Math.round(video.duration || 0);
          const h = Math.floor(sec / 3600);
          const m = Math.floor((sec % 3600) / 60);
          const s = Math.floor(sec % 60);
          const formatted = h > 0
            ? `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
            : `${m}:${s.toString().padStart(2, "0")}`;
          resolve({ seconds: sec, formatted });
        };
        video.onerror = () => {
          URL.revokeObjectURL(url);
          resolve({ seconds: 0, formatted: "" });
        };
        video.src = url;
      } catch {
        resolve({ seconds: 0, formatted: "" });
      }
    });
  };

  // Direct Bunny Stream video file upload handler
  const handleVideoFileUpload = async (
    videoId: string,
    videoTitle: string,
    file: File | undefined,
    onSetUrl: (url: string, durationSeconds?: number, durationFormatted?: string) => void
  ) => {
    if (!file) return;

    let detectedSeconds = 0;
    let detectedFormatted = "";
    try {
      const meta = await getVideoDurationFromFile(file);
      detectedSeconds = meta.seconds;
      detectedFormatted = meta.formatted;
    } catch {}

    setUploadProgress((prev) => ({
      ...prev,
      [videoId]: { status: "uploading", percent: 0, fileName: file.name },
    }));

    try {
      const ticket = await requestDirectUploadTicket({
        title: videoTitle || file.name.replace(/\.[^/.]+$/, ""),
        courseId: slug || "new-course",
      });

      const res = await uploadVideoToBunnyStream(ticket, file, (percent) => {
        setUploadProgress((prev) => ({
          ...prev,
          [videoId]: { status: "uploading", percent, fileName: file.name },
        }));
      });

      const finalUrl = res.iframeEmbedUrl || res.playbackUrl || ticket.uploadUrl;
      onSetUrl(finalUrl, detectedSeconds, detectedFormatted);

      setUploadProgress((prev) => ({
        ...prev,
        [videoId]: { status: "ready", percent: 100, fileName: file.name },
      }));
    } catch (err: any) {
      console.warn("Bunny Stream direct upload fallback to local preview object URL:", err);
      const fallbackUrl = URL.createObjectURL(file);
      onSetUrl(fallbackUrl, detectedSeconds, detectedFormatted);
      setUploadProgress((prev) => ({
        ...prev,
        [videoId]: { status: "ready", percent: 100, fileName: file.name },
      }));
    }
  };

  // Save & Publish
  const handlePublishCourse = async (status: "Published" | "Draft" = "Published") => {
    // Validate stages 1 to 3 before submitting
    for (let s = 1; s <= 2; s++) {
      const check = validateStepWithField(s as StepNumber);
      if (!check.valid) {
        if (check.fieldId && check.fieldKey) {
          scrollToAndHighlightField(check.fieldId, check.fieldKey, check.message, check.step);
        } else {
          setValidationError(check.message);
        }
        return;
      }
    }

    setIsPublishing(true);
    setSaveError(null);

    const selectedInstructor = instructorsList.find((i) => i.id === selectedInstructorId);

    const newCourse: FullCourse = {
      id: existingCourseId || `crs-${Date.now()}`,
      slug: slug || `course-${Date.now()}`,
      title,
      track: track as Track,
      subTrack: subTrack.trim() || undefined,
      level,
      durationWeeks: Number(durationWeeks) || 12,
      price: price !== "" && !isNaN(Number(price)) && Number(price) >= 0 ? Number(price) : 0,
      // Preserve existing rating and enrollment count when editing
      rating: isEditMode ? originalRating : 5.0,
      studentsEnrolled: isEditMode ? originalStudentsEnrolled : 0,
      summary,
      thumbnail: thumbnailUrl,
      sections,
      createdAt: new Date().toISOString(),
      status,
      instructorUserIds: selectedInstructorId ? [selectedInstructorId] : ["6aafc1a7d80072434f90eb89"],
      instructorName: selectedInstructor?.name || "Davood Khan",
      syllabusTemplateId: selectedSyllabusTemplateId || null,
    };

    try {
      await saveCourseAsync(newCourse);
      setPublishedSuccess(true);
      setTimeout(() => {
        setIsPublishing(false);
        router.push("/instructor/courses");
      }, 1200);
    } catch (err: any) {
      console.error("[CourseBuilder] Save failed:", err);
      setSaveError(err?.message || "Failed to save course. Please try again.");
      setIsPublishing(false);
    }
  };

  // Total counts calculation
  const totalDirectVideos = sections.reduce((acc, s) => acc + (s.directVideos?.length || 0), 0);
  const totalSubVideos = sections.reduce(
    (acc, s) => acc + (s.subsections?.reduce((subAcc, sub) => subAcc + sub.videos.length, 0) || 0),
    0
  );
  const totalVideos = totalDirectVideos + totalSubVideos;
  const totalSubsections = sections.reduce((acc, s) => acc + (s.subsections?.length || 0), 0);

  return (
    <>
      <DashboardTopbar
        title={isEditMode ? "Edit Course" : "New Course"}
        subtitle="Configure multi-section curriculum, anti-skip verification, passing marks, and certificates."
        userInitials="IN"
      />

      <div className="flex-1 space-y-4 sm:space-y-6 p-3.5 sm:p-6 lg:p-8 lg:pt-4 max-w-7xl mx-auto w-full">
        {/* Top Header & Breadcrumbs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-b border-slate-200/80 dark:border-slate-800 pb-3 sm:pb-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/instructor/courses"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors shrink-0"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Courses</span>
            </Link>
            <span className="hidden sm:inline text-xs text-slate-400 dark:text-slate-500 font-medium">/</span>
            <span className="hidden sm:inline text-xs font-semibold text-slate-900 dark:text-white">
              {isEditMode ? `Editing: ${title || "Course"}` : "Stage Workflow Course Builder"}
            </span>

            {isDraftSaving ? (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Loader2 className="h-3 w-3 animate-spin text-amber-600" /> Auto-saving draft...
              </span>
            ) : draftSavedAt ? (
              <span className="hidden md:inline-flex items-center gap-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Auto-saved draft ({draftSavedAt})
              </span>
            ) : null}
          </div>

          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => handlePublishCourse("Draft")}
              disabled={isPublishing}
              className="w-full sm:w-auto flex items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 sm:px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handlePublishCourse("Published")}
              disabled={isPublishing}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 sm:px-5 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {publishedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                  <span className="truncate">{isEditMode ? "Updated!" : "Published!"}</span>
                </>
              ) : isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin shrink-0 text-white" />
                  <span className="truncate">{isEditMode ? "Saving & Updating..." : "Publishing..."}</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 shrink-0" />
                  <span className="truncate">{isEditMode ? "Save & Update" : "Publish Course"}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* STEP PROGRESS BAR INDICATOR WITH SEQUENTIAL GATING */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 rounded-2xl sm:rounded-[20px] border border-white/80 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary p-1 sm:p-2 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
          {STEPS.map((s) => {
            const isActive = currentStep === s.step;
            const isDone = currentStep > s.step;
            const isAccessible = isStepAccessible(s.step);

            return (
              <button
                key={s.step}
                type="button"
                onClick={() => handleStepClick(s.step)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-1 sm:gap-2 rounded-xl p-1.5 sm:px-3 sm:py-2 text-center sm:text-left transition-all ${
                  isActive
                    ? "bg-[#2563EB] text-white shadow-md shadow-blue-500/20"
                    : isDone
                    ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 hover:bg-emerald-100/70 dark:hover:bg-emerald-900/40"
                    : isAccessible
                    ? "text-slate-500 dark:text-slate-400 hover:bg-slate-100/70 dark:hover:bg-surface-hover hover:text-slate-800 dark:hover:text-slate-200"
                    : "text-slate-400/60 dark:text-slate-600 cursor-not-allowed opacity-60"
                }`}
              >
                <div
                  className={`flex h-5 w-5 sm:h-6 sm:w-6 shrink-0 items-center justify-center rounded-md sm:rounded-lg text-[10px] sm:text-[11px] font-bold ${
                    isActive
                      ? "bg-white/20 text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : !isAccessible
                      ? "bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {isDone ? (
                    <Check className="h-3 w-3 sm:h-3.5 sm:w-3.5 stroke-[3]" />
                  ) : !isAccessible ? (
                    <Lock className="h-3 w-3" />
                  ) : (
                    s.step
                  )}
                </div>
                <span className="hidden lg:inline truncate text-xs font-bold">{s.label}</span>
                <span className="inline lg:hidden text-[10px] sm:text-xs font-medium sm:font-bold truncate">{s.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* DRAFT RECOVERY BANNER */}
        {showDraftBanner && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                Found an uncommitted auto-saved draft for this course{draftSavedAt ? ` from ${draftSavedAt}` : ""}.
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleRestoreDraft}
                className="font-bold underline hover:no-underline text-amber-900 dark:text-amber-200 cursor-pointer"
              >
                Restore Draft
              </button>
              <span>•</span>
              <button
                type="button"
                onClick={handleDiscardDraft}
                className="text-amber-700 dark:text-amber-400 hover:text-amber-950 dark:hover:text-white cursor-pointer"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* VALIDATION ERROR BANNER */}
        {validationError && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-amber-300 dark:border-amber-700/80 bg-amber-50 dark:bg-amber-950/40 px-4 py-3 text-xs text-amber-900 dark:text-amber-200 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span className="font-semibold">{validationError}</span>
            </div>
            <button
              type="button"
              onClick={() => setValidationError(null)}
              className="text-amber-700 hover:text-amber-950 dark:text-amber-400 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* SAVE ERROR BANNER */}
        {saveError && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-red-300 dark:border-red-700/80 bg-red-50 dark:bg-red-950/40 px-4 py-3 text-xs text-red-900 dark:text-red-200 shadow-xs">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 shrink-0" />
              <span className="font-semibold">Save failed: {saveError}</span>
            </div>
            <button
              type="button"
              onClick={() => setSaveError(null)}
              className="text-red-700 hover:text-red-950 dark:text-red-400 dark:hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* LOADING EDIT BANNER */}
        {isLoadingEdit && (
          <div className="flex items-center gap-2 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/70 dark:bg-blue-950/40 px-4 py-2.5 text-xs font-semibold text-blue-700 dark:text-blue-300">
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
            <span>Loading course data for editing...</span>
          </div>
        )}

        {/* STEP CONTENT VIEWPORT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
          {/* LEFT 2 COLS: Active Step Content Form */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <AnimatePresence mode="wait">
              {/* STEP 1: COURSE BASICS & MEDIA */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-2xl sm:rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4 sm:space-y-5"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 shrink-0">
                      <Layers className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">Step 1: Course Profile & Metadata</h2>
                      <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium line-clamp-1">Primary details shown across catalog, payments, and certificates</p>
                    </div>
                  </div>

                  {/* Course Title Field */}
                  <div id="field-course-title" className="transition-all">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Course Title <span className="text-rose-500">*</span>
                      </label>
                      <span className={`text-[11px] font-semibold transition-colors ${title.trim().length >= 3 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}`}>
                        {title.trim().length}/3 min chars
                      </span>
                    </div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => {
                        handleTitleChange(e.target.value);
                        if (e.target.value.trim().length >= 3) clearFieldError("title");
                      }}
                      placeholder="e.g. Enterprise Distributed Systems & Cloud Architecture"
                      className={`mt-1.5 w-full rounded-xl border px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none transition-all duration-200 ${
                        fieldErrors.title
                          ? "border-2 border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/25"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                      }`}
                    />
                    {fieldErrors.title && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{fieldErrors.title}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* URL Slug Field */}
                    <div id="field-course-slug" className="transition-all">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          URL Slug <span className="text-rose-500">*</span>
                        </label>
                        <span className={`text-[11px] font-semibold transition-colors ${slug.trim().length >= 2 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}`}>
                          {slug.trim().length}/2 min chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => {
                          setSlug(e.target.value);
                          if (e.target.value.trim().length >= 2) clearFieldError("slug");
                        }}
                        placeholder="e.g. enterprise-distributed-systems"
                        className={`mt-1.5 w-full rounded-xl border px-3.5 py-2 text-xs font-mono text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none transition-all duration-200 ${
                          fieldErrors.slug
                            ? "border-2 border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/25"
                            : "border-slate-200 dark:border-slate-700 bg-slate-50/60 dark:bg-surface-elevated focus:border-[#2563EB]"
                        }`}
                      />
                      {fieldErrors.slug && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{fieldErrors.slug}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* ACADEMIC TRACK & SUB-TRACK SECTION */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated/40 p-4 space-y-4">
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          Academic Track <span className="text-slate-400 font-normal lowercase">(select preset or edit directly)</span>
                        </label>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Click to select preset, then edit the text freely below
                        </span>
                      </div>

                      {/* Preset Track Pills */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {availableTracks.map((t) => {
                          const isSelected =
                            track.toLowerCase().trim() === t.toLowerCase().trim() ||
                            (t === "SAP" && track.toLowerCase().includes("sap"));
                          return (
                            <button
                              key={t}
                              type="button"
                              onClick={() => {
                                setTrack(t);
                                const subList = getSubTracksForTrack(t);
                                if (subList.length > 0 && !subList.includes(subTrack)) {
                                  setSubTrack(subList[0]);
                                }
                              }}
                              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-[#2563EB] text-white shadow-xs scale-[1.02]"
                                  : "bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 dark:hover:border-blue-500"
                              }`}
                            >
                              {t}
                            </button>
                          );
                        })}
                      </div>

                      {/* Editable Track Input */}
                      <input
                        type="text"
                        value={track}
                        onChange={(e) => setTrack(e.target.value)}
                        placeholder="e.g. SAP, Full Stack, Frontend, DotNet, Cloud..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30"
                      />
                    </div>

                    {/* SUB-TRACK SECTION */}
                    <div className="pt-3 border-t border-slate-200/80 dark:border-slate-800">
                      <div className="flex flex-wrap items-center justify-between gap-1 mb-1.5">
                        <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                          <span>Sub-Track / Module Specialization</span>
                          <span className="rounded bg-blue-100 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-300 px-1.5 py-0.5 text-[10px] font-bold">
                            {track || "Track"}
                          </span>
                        </label>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          Choose a sub-track or edit custom specialization
                        </span>
                      </div>

                      {/* Dynamic Sub-Track Pills (SAP B1, SAP Ariba, SAP S/4HANA, etc.) */}
                      <div className="flex flex-wrap items-center gap-1.5 mb-2">
                        {getSubTracksForTrack(track).map((st) => {
                          const isSelected = subTrack.toLowerCase().trim() === st.toLowerCase().trim();
                          return (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setSubTrack(st)}
                              className={`rounded-lg px-2.5 py-1 text-[11.5px] font-bold transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-emerald-600 text-white shadow-xs scale-[1.02]"
                                  : "bg-white dark:bg-surface-secondary border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-400 dark:hover:border-emerald-500"
                              }`}
                            >
                              {st}
                            </button>
                          );
                        })}
                      </div>

                      {/* Editable Sub-Track Input */}
                      <input
                        type="text"
                        value={subTrack}
                        onChange={(e) => setSubTrack(e.target.value)}
                        placeholder="e.g. SAP B1, SAP Ariba, SAP S/4HANA, or custom specialization..."
                        className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 dark:focus:ring-emerald-900/30"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Experience Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as "Beginner" | "Intermediate" | "Advanced")}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                      >
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Duration (Weeks)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="52"
                        value={durationWeeks}
                        onChange={(e) => setDurationWeeks(e.target.value === "" ? "" : Number(e.target.value))}
                        placeholder="e.g. 12"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    {/* Course Fee Field */}
                    <div id="field-course-price" className="transition-all">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Course Fee (₹) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="500"
                        value={price}
                        onChange={(e) => {
                          const val = e.target.value === "" ? "" : Number(e.target.value);
                          setPrice(val);
                          if (val !== "" && Number(val) >= 0) clearFieldError("price");
                        }}
                        placeholder="e.g. 19999"
                        className={`mt-1.5 w-full rounded-xl border px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none transition-all duration-200 ${
                          fieldErrors.price
                            ? "border-2 border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/25"
                            : "border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg focus:border-[#2563EB]"
                        }`}
                      />
                      {fieldErrors.price && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <span>{fieldErrors.price}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Assigned Faculty & Instructor */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Assigned Lead Tutor / Faculty
                    </label>
                    <select
                      value={selectedInstructorId}
                      onChange={(e) => setSelectedInstructorId(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                    >
                      {instructorsList.map((inst) => (
                        <option key={inst.id} value={inst.id}>
                          {inst.name} ({inst.email})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Assigned tutor shown to students for mentorship and course credentials.
                    </p>
                  </div>

                  {/* Course Summary Field */}
                  <div id="field-course-summary" className="transition-all">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Course Summary & Objectives <span className="text-rose-500">*</span>
                      </label>
                      <span className={`text-[11px] font-semibold transition-colors ${summary.trim().length >= 10 ? "text-emerald-600 dark:text-emerald-400" : "text-slate-400 dark:text-slate-400"}`}>
                        {summary.trim().length}/10 min chars
                      </span>
                    </div>
                    <textarea
                      rows={2}
                      value={summary}
                      onChange={(e) => {
                        setSummary(e.target.value);
                        if (e.target.value.trim().length >= 10) clearFieldError("summary");
                      }}
                      placeholder="e.g. Deep dive into cloud-native microservices, event-driven architectures with Kafka, and resilient backend design..."
                      className={`mt-1.5 w-full rounded-xl border p-3 text-xs font-medium text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none transition-all duration-200 ${
                        fieldErrors.summary
                          ? "border-2 border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/25"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg focus:border-[#2563EB]"
                      }`}
                    />
                    {fieldErrors.summary && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{fieldErrors.summary}</span>
                      </p>
                    )}
                  </div>

                  {/* Thumbnail / Media Upload Box */}
                  {/* Reusable Syllabus Template Selector */}
                  <SyllabusTemplateSelector
                    selectedTemplateId={selectedSyllabusTemplateId}
                    onSelectTemplate={(tpl) => {
                      if (!tpl) {
                        setSelectedSyllabusTemplateId(null);
                        return;
                      }
                      setSelectedSyllabusTemplateId(tpl.id);
                    }}
                    onImportModules={(importedSections: any) => {
                      handleImportSections(importedSections, false);
                    }}
                  />

                  {/* Thumbnail / Media Upload Box */}
                  <CourseThumbnailUploader
                    thumbnailUrl={thumbnailUrl}
                    onThumbnailChange={setThumbnailUrl}
                    title={title}
                    track={track}
                    level={level}
                  />
                </motion.div>
              )}

              {/* STEP 2: CURRICULUM, SECTIONS, SUBSECTIONS & VIDEOS */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-4"
                >
                  {importSuccessMessage && (
                    <div className="flex items-center justify-between rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                        <span>{importSuccessMessage}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setImportSuccessMessage(null)}
                        className="text-emerald-700 dark:text-emerald-400 hover:opacity-75"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">Step 2: Sections, Subsections & Video Lessons</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Upload video files or paste private URLs for every section & subsection.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setIsImportModalOpen(true)}
                        className="flex items-center justify-center gap-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/70 dark:bg-indigo-950/40 px-3.5 py-2 text-xs font-bold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer w-full sm:w-auto"
                      >
                        <ArrowDownToLine className="h-4 w-4 text-indigo-600 dark:text-indigo-400" /> Import from Existing Course
                      </button>
                      <button
                        type="button"
                        onClick={addSection}
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer w-full sm:w-auto"
                      >
                        <Plus className="h-4 w-4" /> Add Section
                      </button>
                    </div>
                  </div>

                  {/* SECTIONS LIST */}
                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.04)] space-y-5 transition-all hover:border-[#2563EB]/40 dark:hover:border-blue-500/40"
                    >
                      {/* Section Top Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
                        <div id={`field-section-title-${secIdx}`} className="flex items-start gap-2 sm:gap-3 flex-1 min-w-0 transition-all">
                          <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white shrink-0 mt-0.5">
                            {secIdx + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <input
                              type="text"
                              value={section.title}
                              onChange={(e) => {
                                const updated = [...sections];
                                updated[secIdx].title = e.target.value;
                                setSections(updated);
                                if (e.target.value.trim().length >= 2) clearFieldError(`section-title-${secIdx}`);
                              }}
                              placeholder={`Section ${secIdx + 1} Title (at least 2 chars)`}
                              className={`w-full rounded-lg border bg-white dark:bg-input-bg px-3 py-1.5 text-xs sm:text-sm font-bold text-slate-900 dark:text-white outline-none transition-all duration-200 ${
                                fieldErrors[`section-title-${secIdx}`]
                                  ? "border-2 border-rose-500 ring-4 ring-rose-500/20 bg-rose-50/40 dark:bg-rose-950/25"
                                  : "border-slate-200 dark:border-slate-700 focus:border-[#2563EB]"
                              }`}
                            />
                            {fieldErrors[`section-title-${secIdx}`] && (
                              <p className="mt-1 flex items-center gap-1.5 text-[11px] font-bold text-rose-600 dark:text-rose-400 animate-in fade-in slide-in-from-top-1">
                                <AlertCircle className="h-3 w-3 shrink-0" />
                                <span>{fieldErrors[`section-title-${secIdx}`]}</span>
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => moveSection(secIdx, "up")}
                            disabled={secIdx === 0}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Move Up"
                          >
                            <ChevronUp className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => moveSection(secIdx, "down")}
                            disabled={secIdx === sections.length - 1}
                            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-700 dark:hover:text-slate-200 disabled:opacity-30 cursor-pointer"
                            title="Move Down"
                          >
                            <ChevronDown className="h-4 w-4" />
                          </button>
                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
                              title="Delete Section"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Dedicated Scroll Container for Section Body */}
                      <div className="max-h-[640px] overflow-y-auto pr-1 sm:pr-2 space-y-5 custom-scrollbar">
                        {/* Section Description */}
                      <div>
                        <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                          Section Description
                        </label>
                        <input
                          type="text"
                          value={section.description}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[secIdx].description = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="Brief overview of concepts covered in this section..."
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      {/* SUBSECTIONS AREA (OPTIONAL) */}
                      <div className="space-y-3 rounded-xl bg-slate-50/70 dark:bg-surface-elevated p-3 sm:p-4 border border-slate-100 dark:border-slate-800">
                        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                            <FolderTree className="h-4 w-4 text-[#2563EB] dark:text-blue-400 shrink-0" />
                            <span>Subsections ({section.subsections?.length || 0})</span>
                            <span className="hidden sm:inline text-[11px] font-normal text-slate-400 dark:text-slate-400">Optional nested lesson groupings</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubsectionToSection(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 shadow-xs hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Subsection
                          </button>
                        </div>

                        {section.subsections && section.subsections.length > 0 ? (
                          <div className="space-y-3 pl-1 sm:pl-3 border-l-2 border-blue-200 dark:border-blue-900/60">
                            {section.subsections.map((sub, subIdx) => (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-slate-200 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-3 sm:p-3.5 shadow-xs space-y-3"
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <span className="rounded bg-blue-100 dark:bg-blue-950/50 px-1.5 py-0.5 text-[10px] font-bold text-[#2563EB] dark:text-blue-400 shrink-0">
                                      {secIdx + 1}.{subIdx + 1}
                                    </span>
                                    <input
                                      type="text"
                                      value={sub.title}
                                      onChange={(e) => {
                                        const updated = [...sections];
                                        if (updated[secIdx].subsections) {
                                          updated[secIdx].subsections![subIdx].title = e.target.value;
                                          setSections(updated);
                                        }
                                      }}
                                      placeholder="Subsection Title"
                                      className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSubsection(secIdx, sub.id)}
                                    className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Subsection Videos */}
                                <div className="space-y-2.5 pl-1 sm:pl-3">
                                  {sub.videos.map((vid, vidIdx) => (
                                    <div
                                      key={vid.id}
                                      id={`video-card-${vid.id}`}
                                      className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-3 space-y-2.5 text-xs shadow-2xs transition-all duration-300"
                                    >
                                      <div className="flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 flex-1 min-w-0">
                                          <Video className="h-3.5 w-3.5 text-[#2563EB] dark:text-blue-400 shrink-0" />
                                          <input
                                            type="text"
                                            value={vid.title}
                                            onChange={(e) => {
                                              const updated = [...sections];
                                              updated[secIdx].subsections![subIdx].videos[vidIdx].title = e.target.value;
                                              setSections(updated);
                                            }}
                                            placeholder="Subsection Video Title"
                                            className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>

                                        <button
                                          type="button"
                                          onClick={() => removeVideoFromSubsection(secIdx, subIdx, vid.id)}
                                          className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors shrink-0"
                                          title="Remove Video"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>

                                      {/* Subsection Video Source: Upload or Paste URL */}
                                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                          <div className="sm:col-span-4 lg:col-span-3">
                                            <select
                                              value={vid.videoType}
                                              onChange={(e) => {
                                                const newType = e.target.value as VideoSourceType;
                                                const updated = [...sections];
                                                const currentVid = updated[secIdx].subsections![subIdx].videos[vidIdx];
                                                currentVid.videoType = newType;
                                                if (newType !== "upload") {
                                                  currentVid.durationSeconds = 0;
                                                  currentVid.durationFormatted = "";
                                                }
                                                if (newType === "upload" && (currentVid.videoUrl.includes("youtube.com") || currentVid.videoUrl.includes("drive.google.com") || currentVid.videoUrl.includes("onedrive"))) {
                                                  currentVid.videoUrl = "";
                                                }
                                                setSections(updated);
                                              }}
                                              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                            >
                                              <option value="upload">Upload Video File</option>
                                              <option value="url">Web URL (YouTube / Vimeo)</option>
                                              <option value="gdrive">Google Drive Link</option>
                                              <option value="onedrive">OneDrive Link</option>
                                            </select>
                                          </div>

                                          <div className="sm:col-span-8 lg:col-span-7">
                                            {vid.videoType === "url" ? (
                                              <input
                                                type="text"
                                                value={vid.videoUrl}
                                                onChange={(e) => {
                                                  const updated = [...sections];
                                                  updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = e.target.value;
                                                  setSections(updated);
                                                }}
                                                placeholder="https://... YouTube or Vimeo video link"
                                                className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                              />
                                            ) : vid.videoType === "gdrive" ? (
                                              <input
                                                type="text"
                                                value={vid.videoUrl}
                                                onChange={(e) => {
                                                  const updated = [...sections];
                                                  updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = e.target.value;
                                                  setSections(updated);
                                                }}
                                                placeholder="https://drive.google.com/file/d/.../view (Google Drive share link)"
                                                className="w-full rounded-md border border-blue-200 dark:border-blue-900 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                              />
                                            ) : vid.videoType === "onedrive" ? (
                                              <input
                                                type="text"
                                                value={vid.videoUrl}
                                                onChange={(e) => {
                                                  const updated = [...sections];
                                                  updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = e.target.value;
                                                  setSections(updated);
                                                }}
                                                placeholder="https://1drv.ms/... or https://...-my.sharepoint.com/... (OneDrive link)"
                                                className="w-full rounded-md border border-sky-200 dark:border-sky-900 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                              />
                                            ) : (
                                            <div className="space-y-1.5">
                                              <div className="flex flex-wrap items-center gap-2">
                                                <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-400 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/40 px-3 py-1.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                                  <Upload className="h-3 w-3" />
                                                  <span>{vid.videoUrl ? "Replace Video" : "Upload Video File"}</span>
                                                  <input
                                                    type="file"
                                                    accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
                                                    className="hidden"
                                                    disabled={uploadProgress[vid.id]?.status === "uploading"}
                                                    onChange={(e) => {
                                                      const file = e.target.files?.[0];
                                                      if (file) {
                                                        handleVideoFileUpload(vid.id, vid.title, file, (url, sec, formatted) => {
                                                          const updated = [...sections];
                                                          const target = updated[secIdx].subsections![subIdx].videos[vidIdx];
                                                          target.videoUrl = url;
                                                          if (sec !== undefined) target.durationSeconds = sec;
                                                          if (formatted !== undefined) target.durationFormatted = formatted;
                                                          setSections(updated);
                                                        });
                                                      }
                                                    }}
                                                  />
                                                </label>

                                                {uploadProgress[vid.id]?.status === "uploading" ? (
                                                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                                    <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                                                    <span>Uploading {uploadProgress[vid.id]?.percent}%...</span>
                                                  </div>
                                                ) : vid.videoUrl ? (
                                                  <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                                    <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                                    <span>✓ Video Uploaded {vid.durationFormatted ? `(${vid.durationFormatted})` : "(Ready)"}</span>
                                                  </div>
                                                ) : (
                                                  <span className="text-[10px] text-slate-400 dark:text-slate-400">
                                                    Upload MP4, WebM, or MOV video lecture
                                                  </span>
                                                )}
                                              </div>

                                              {uploadProgress[vid.id]?.status === "uploading" && (
                                                <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                                  <div
                                                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-200"
                                                    style={{ width: `${uploadProgress[vid.id]?.percent || 0}%` }}
                                                  />
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </div>

                                        <div className="sm:col-span-12 lg:col-span-2 flex items-center justify-end">
                                          <button
                                            type="button"
                                            onClick={() => {
                                              if (!vid.videoUrl) {
                                                alert("Please upload a video or paste a video URL first before previewing.");
                                                return;
                                              }
                                              setPreviewVideo({
                                                title: vid.title || "Subsection Video Preview",
                                                videoUrl: vid.videoUrl,
                                                videoType: vid.videoType,
                                                durationFormatted: vid.durationFormatted,
                                              });
                                            }}
                                            className={`flex w-full items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                                              vid.videoUrl
                                                ? "bg-blue-50 dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 border border-blue-200 dark:border-blue-800/60"
                                                : "bg-slate-100 dark:bg-slate-800/60 text-slate-400 border border-slate-200/60 dark:border-slate-800"
                                            }`}
                                          >
                                            <PlayCircle className="h-3.5 w-3.5" /> Preview
                                          </button>
                                        </div>
                                      </div>

                                      {/* Video-Level Optional Assignment Manager */}
                                      <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                                        <VideoAssignmentManager
                                          video={vid}
                                          videoIndexLabel={`Video ${vidIdx + 1}`}
                                          onUpdate={(updatedVid) => {
                                            const updated = [...sections];
                                            updated[secIdx].subsections![subIdx].videos[vidIdx] = updatedVid;
                                            setSections(updated);
                                          }}
                                        />
                                      </div>
                                    </div>
                                  ))}

                                  <button
                                    type="button"
                                    onClick={() => addVideoToSubsection(secIdx, subIdx)}
                                    className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                                  >
                                    <Plus className="h-3 w-3" /> Add video to subsection
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-[11px] text-slate-400 dark:text-slate-400 italic">No subsections added yet. You can add direct videos below.</p>
                        )}
                      </div>

                      {/* DIRECT SECTION VIDEOS */}
                      <div
                        id={`field-section-videos-${secIdx}`}
                        className={`space-y-3 rounded-2xl transition-all ${
                          fieldErrors[`section-videos-${secIdx}`]
                            ? "border-2 border-rose-500 ring-4 ring-rose-500/20 p-3 bg-rose-50/40 dark:bg-rose-950/25"
                            : ""
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                            <Video className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Direct Section Videos ({section.directVideos?.length || 0})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              addDirectVideo(secIdx);
                              clearFieldError(`section-videos-${secIdx}`);
                            }}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Video
                          </button>
                        </div>

                        {fieldErrors[`section-videos-${secIdx}`] && (
                          <div className="flex items-center gap-2 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 p-2.5 text-xs font-bold text-rose-700 dark:text-rose-300 animate-in fade-in slide-in-from-top-1">
                            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600 dark:text-rose-400" />
                            <span>{fieldErrors[`section-videos-${secIdx}`]}</span>
                          </div>
                        )}

                        {section.directVideos?.map((vid, vidIdx) => (
                          <div
                            key={vid.id}
                            id={`video-card-${vid.id}`}
                            className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated p-3 sm:p-3.5 space-y-2.5 transition-all duration-300"
                          >
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
                                  {vidIdx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={vid.title}
                                  onChange={(e) => {
                                    const updated = [...sections];
                                    updated[secIdx].directVideos![vidIdx].title = e.target.value;
                                    setSections(updated);
                                  }}
                                  placeholder="Video Lecture Title"
                                  className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => removeDirectVideo(secIdx, vid.id)}
                                className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors shrink-0"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>

                            {/* Video Source Selector: Upload or Paste URL */}
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                              <div className="sm:col-span-4 lg:col-span-3">
                                <select
                                  value={vid.videoType}
                                  onChange={(e) => {
                                    const newType = e.target.value as VideoSourceType;
                                    const updated = [...sections];
                                    const currentVid = updated[secIdx].directVideos![vidIdx];
                                    currentVid.videoType = newType;
                                    if (newType !== "upload") {
                                      currentVid.durationSeconds = 0;
                                      currentVid.durationFormatted = "";
                                    }
                                    if (newType === "upload" && (currentVid.videoUrl.includes("youtube.com") || currentVid.videoUrl.includes("drive.google.com") || currentVid.videoUrl.includes("onedrive"))) {
                                      currentVid.videoUrl = "";
                                    }
                                    setSections(updated);
                                  }}
                                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                >
                                  <option value="upload">Upload Video File</option>
                                  <option value="url">Web URL (YouTube / Vimeo)</option>
                                  <option value="gdrive">Google Drive Link</option>
                                  <option value="onedrive">OneDrive Link</option>
                                </select>
                              </div>

                              <div className="sm:col-span-8 lg:col-span-7">
                                {vid.videoType === "url" ? (
                                  <input
                                    type="text"
                                    value={vid.videoUrl}
                                    onChange={(e) => {
                                      const updated = [...sections];
                                      updated[secIdx].directVideos![vidIdx].videoUrl = e.target.value;
                                      setSections(updated);
                                    }}
                                    placeholder="https://... YouTube, Vimeo, or Bunny Stream URL"
                                    className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                  />
                                ) : vid.videoType === "gdrive" ? (
                                  <input
                                    type="text"
                                    value={vid.videoUrl}
                                    onChange={(e) => {
                                      const updated = [...sections];
                                      updated[secIdx].directVideos![vidIdx].videoUrl = e.target.value;
                                      setSections(updated);
                                    }}
                                    placeholder="https://drive.google.com/file/d/.../view (Google Drive share link)"
                                    className="w-full rounded-md border border-blue-200 dark:border-blue-900 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                  />
                                ) : vid.videoType === "onedrive" ? (
                                  <input
                                    type="text"
                                    value={vid.videoUrl}
                                    onChange={(e) => {
                                      const updated = [...sections];
                                      updated[secIdx].directVideos![vidIdx].videoUrl = e.target.value;
                                      setSections(updated);
                                    }}
                                    placeholder="https://1drv.ms/... or https://...-my.sharepoint.com/... (OneDrive link)"
                                    className="w-full rounded-md border border-sky-200 dark:border-sky-900 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
                                  />
                                ) : (
                                  <div className="space-y-1.5">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <label className="flex items-center gap-1.5 cursor-pointer rounded-md border border-dashed border-blue-400 dark:border-blue-700 bg-blue-50/70 dark:bg-blue-950/40 px-3 py-1.5 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
                                        <Upload className="h-3 w-3" />
                                        <span>{vid.videoUrl ? "Change Video File" : "Select MP4 Video"}</span>
                                        <input
                                          type="file"
                                          accept="video/mp4,video/quicktime,video/webm,video/x-matroska,video/*"
                                          className="hidden"
                                          disabled={uploadProgress[vid.id]?.status === "uploading"}
                                          onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                              handleVideoFileUpload(vid.id, vid.title, file, (url, sec, formatted) => {
                                                  const updated = [...sections];
                                                  const target = updated[secIdx].directVideos![vidIdx];
                                                  target.videoUrl = url;
                                                  if (sec !== undefined) target.durationSeconds = sec;
                                                  if (formatted !== undefined) target.durationFormatted = formatted;
                                                  setSections(updated);
                                                });
                                            }
                                          }}
                                        />
                                      </label>

                                      {uploadProgress[vid.id]?.status === "uploading" ? (
                                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                                          <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-600 dark:text-blue-400" />
                                          <span>Uploading {uploadProgress[vid.id]?.percent}%...</span>
                                        </div>
                                      ) : vid.videoUrl ? (
                                        <div className="flex items-center gap-1.5 rounded-md bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-2 py-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                                          <CheckCircle2 className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                          <span>Uploaded {vid.durationFormatted ? `(${vid.durationFormatted})` : "to Bunny Stream (Ready)"}</span>
                                        </div>
                                      ) : (
                                        <span className="text-[10px] text-slate-400 dark:text-slate-400">
                                          Direct MP4 upload to Bunny CDN
                                        </span>
                                      )}
                                    </div>

                                    {uploadProgress[vid.id]?.status === "uploading" && (
                                      <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                                        <div
                                          className="h-full bg-gradient-to-r from-blue-600 to-indigo-500 transition-all duration-200"
                                          style={{ width: `${uploadProgress[vid.id]?.percent || 0}%` }}
                                        />
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="sm:col-span-12 lg:col-span-2 flex items-center justify-end">
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!vid.videoUrl) {
                                      alert("Please upload a video or paste a video URL first before previewing.");
                                      return;
                                    }
                                    setPreviewVideo({
                                      title: vid.title || "Direct Video Preview",
                                      videoUrl: vid.videoUrl,
                                      videoType: vid.videoType,
                                      durationFormatted: vid.durationFormatted,
                                    });
                                  }}
                                  className={`flex w-full items-center justify-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold transition-colors cursor-pointer ${
                                    vid.videoUrl
                                      ? "bg-blue-100 dark:bg-blue-950/70 text-[#2563EB] dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/60"
                                      : "bg-slate-100 dark:bg-surface-elevated text-slate-400 dark:text-slate-400 cursor-not-allowed"
                                  }`}
                                  title="Test In-App Player"
                                >
                                  <PlayCircle className="h-3.5 w-3.5" /> Preview
                                </button>
                              </div>
                            </div>

                            {/* Video-Level Optional Assignment Manager */}
                            <div className="pt-2 border-t border-slate-200/80 dark:border-slate-800">
                              <VideoAssignmentManager
                                video={vid}
                                videoIndexLabel={`Video ${vidIdx + 1}`}
                                onUpdate={(updatedVid) => {
                                  const updated = [...sections];
                                  updated[secIdx].directVideos![vidIdx] = updatedVid;
                                  setSections(updated);
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 3: ANTI-SKIP OPTIONS & STAGE PROTECTION POLICY */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 3: Anti-Skip Options & Integrity Rules</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Prevent video scrubbing and enforce sequential milestones before unlocking assignments
                      </p>
                    </div>
                  </div>

                  {/* Banner Alert */}
                  <div className="rounded-2xl border border-blue-100 dark:border-blue-900/50 bg-[#EFF6FF]/70 dark:bg-blue-950/30 p-4 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-bold text-[#2563EB] dark:text-blue-400">
                      <Sparkles className="h-4 w-4" />
                      Anti-Skip Video Protection Enforcement
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      When enabled, students cannot skip or fast-forward unwatched video segments. They must complete 100% of the lecture to unlock the section assignment.
                    </p>
                  </div>

                  {/* Anti-Skip Toggles */}
                  <div className="space-y-3">
                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Enforce 100% Video Watch (No Fast-Forwarding)
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Disables seek forward bar for unwatched portions of the video.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={antiSkipEnforced}
                        onChange={(e) => setAntiSkipEnforced(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer mt-0.5"
                      />
                    </label>

                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Lock Section Assignment Until Video Is Finished
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Students cannot submit or take the assignment without watching all section videos.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={requireFullWatchToUnlockAssignment}
                        onChange={(e) => setRequireFullWatchToUnlockAssignment(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer mt-0.5"
                      />
                    </label>

                    <label className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-surface-elevated p-4 cursor-pointer hover:border-blue-300 dark:hover:border-blue-600/50 transition-colors">
                      <div className="space-y-0.5">
                        <div className="text-xs font-bold text-slate-900 dark:text-white">
                          Enforce Sequential Stage Progression
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400">
                          Section N+1 remains locked until Section N video and assignment are both completed.
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={preventForwardSeeking}
                        onChange={(e) => setPreventForwardSeeking(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer mt-0.5"
                      />
                    </label>
                  </div>

                  {/* Playback Speed Cap */}
                  <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">Maximum Allowed Playback Speed</div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">Limits acceleration to ensure material retention</div>
                    </div>
                    <select
                      value={playbackSpeedCap}
                      onChange={(e) => setPlaybackSpeedCap(e.target.value)}
                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1 text-xs font-bold text-slate-800 dark:text-white outline-none"
                    >
                      <option value="1.0x">1.0x (Normal speed only)</option>
                      <option value="1.25x">1.25x</option>
                      <option value="1.5x">1.5x (Recommended)</option>
                      <option value="2.0x">2.0x</option>
                    </select>
                  </div>
                </motion.div>
              )}

              {/* STEP 4: ACCREDITED CERTIFICATE & FINAL PUBLISHING */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-6"
                >
                  <div className="flex items-center gap-2.5 border-b border-slate-100 dark:border-slate-800 pb-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400">
                      <Award className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: Accredited Certificate & Unlock Criteria</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                        Configure verified credential issued upon completing all course stages
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Accredited Certificate Title
                    </label>
                    <input
                      type="text"
                      value={certificateTitle}
                      onChange={(e) => setCertificateTitle(e.target.value)}
                      placeholder="e.g. Certified Distributed Cloud Architect"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* Certificate Unlock Rules */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-surface-elevated p-5 space-y-3">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                      Automated Certificate Unlock Rules
                    </h4>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAllVideosComplete}
                        onChange={(e) => setRequireAllVideosComplete(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        100% of all section video lectures completed with Anti-Skip verification
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={requireAllAssignmentsPassed}
                        onChange={(e) => setRequireAllAssignmentsPassed(e.target.checked)}
                        className="h-4 w-4 accent-[#2563EB]"
                      />
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        All section milestone assignments submitted and scored above passing threshold
                      </span>
                    </label>
                  </div>

                  {/* Certificate Live Preview */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Live Certificate Preview
                    </label>
                    <div className="rounded-2xl border-4 border-double border-amber-300/80 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 p-6 text-white shadow-xl space-y-4">
                      <div className="flex items-start justify-between border-b border-white/10 pb-4">
                        <div>
                          <div className="text-[10px] font-bold uppercase tracking-widest text-amber-400">
                            JKS Learning Institute of Technology
                          </div>
                          <div className="mt-1 text-base font-extrabold text-white">
                            {certificateTitle || title || "Certified Professional Graduate"}
                          </div>
                        </div>
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300">
                          <Award className="h-6 w-6" />
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-300">
                        <div>
                          <span className="text-slate-400">Recipient:</span>{" "}
                          <span className="font-bold text-white">[Student Full Name]</span>
                        </div>
                        <div className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                          <ShieldCheck className="h-4 w-4" /> VERIFIED-ID: JKS-2026-XXXX
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Multi-Step Navigation Buttons */}
            <div className="flex items-center justify-between gap-2 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3 sm:p-4 shadow-xs">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentStep((currentStep - 1) as StepNumber)}
                  className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3 sm:px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              <div className="flex items-center gap-2 sm:gap-2.5">
                {currentStep < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextStep}
                    className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-[#2563EB] px-4 sm:px-5 py-2 sm:py-2.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handlePublishCourse("Published")}
                    disabled={isPublishing}
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {publishedSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                        <span className="truncate">{isEditMode ? "Updated!" : "Published!"}</span>
                      </>
                    ) : isPublishing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin shrink-0 text-white" />
                        <span className="truncate">{isEditMode ? "Saving & Updating Course..." : "Publishing Course..."}</span>
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 shrink-0" />
                        <span className="truncate">{isEditMode ? "Save & Update Course" : "Publish Course"}</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT 1 COL: Live Course Publishing Summary Sidebar */}
          <div className="space-y-6">
            <div className="sticky top-20 rounded-2xl sm:rounded-[22px] border border-white/70 dark:border-slate-800/80 bg-white/85 dark:bg-surface-secondary p-4 sm:p-6 shadow-[0_8px_30px_rgb(20,50,100,0.06)] backdrop-blur-xl space-y-4 sm:space-y-5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2.5 sm:pb-3">
                Course Workflow Summary
              </h3>

              {/* Live Course Card Preview with Thumbnail */}
              <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-elevated shadow-xs">
                <div className="relative aspect-video w-full overflow-hidden bg-slate-900 flex items-center justify-center">
                  {thumbnailUrl ? (
                    <img
                      src={thumbnailUrl}
                      alt="Course thumbnail preview"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-500 text-center p-3">
                      <Layers className="h-6 w-6 text-slate-500 mb-1" />
                      <span className="text-[10px] font-semibold text-slate-400">No Thumbnail Set</span>
                    </div>
                  )}
                  <span className="absolute top-2 left-2 rounded-md bg-blue-600/90 backdrop-blur-xs px-2 py-0.5 text-[9px] font-bold text-white shadow-xs">
                    {track}
                  </span>
                  <span className="absolute bottom-2 right-2 rounded-md bg-slate-900/80 backdrop-blur-xs px-2 py-0.5 text-[9px] font-medium text-slate-200">
                    {level}
                  </span>
                </div>
                <div className="p-3 space-y-1">
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {title || "Untitled Course"}
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400">
                      {durationWeeks ? `${durationWeeks} Weeks` : "—"}
                    </span>
                    <span className="font-extrabold text-[#2563EB] dark:text-blue-400">
                      {price !== "" && Number(price) >= 0
                        ? `₹${Number(price).toLocaleString("en-IN")}`
                        : "₹0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stat Cards */}
              <div className="grid grid-cols-2 gap-2 text-center text-xs">
                <div className="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-3">
                  <div className="text-lg font-extrabold text-[#2563EB] dark:text-blue-400">{sections.length}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Sections</div>
                </div>
                <div className="rounded-xl bg-purple-50 dark:bg-purple-950/40 p-3">
                  <div className="text-lg font-extrabold text-purple-700 dark:text-purple-300">{totalSubsections}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Subsections</div>
                </div>
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-950/40 p-3">
                  <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">{totalVideos}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Total Videos</div>
                </div>
                <div className="rounded-xl bg-amber-50 dark:bg-amber-950/40 p-3">
                  <div className="text-lg font-extrabold text-amber-700 dark:text-amber-400">{sections.length}</div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Assignments</div>
                </div>
              </div>

              {/* Anti-Skip & Certification Meta */}
              <div className="rounded-xl border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-4 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Track:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{track}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Anti-Skip:</span>
                  <span className="font-bold text-emerald-700 dark:text-emerald-400">100% Enforced</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-medium">Avg Pass Mark:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {Math.round(
                      sections.reduce((acc, s) => acc + (s.assignment.minPassingScore || 0), 0) /
                        (sections.length || 1)
                    )}
                    %
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200/80 dark:border-slate-800 pt-2 text-sm font-extrabold">
                  <span className="text-slate-700 dark:text-slate-300">Course Price:</span>
                  <span className="text-[#2563EB] dark:text-blue-400">
                    {price !== "" && Number(price) >= 0
                      ? `₹${Number(price).toLocaleString("en-IN")}`
                      : "₹0"}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handlePublishCourse("Published")}
                  disabled={isPublishing}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {publishedSuccess ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 animate-bounce" /> {isEditMode ? "Updated Successfully!" : "Published Successfully!"}
                    </>
                  ) : isPublishing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-white" /> {isEditMode ? "Saving & Updating..." : "Publishing & Syncing..."}
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" /> {isEditMode ? "Save & Update Course" : "Publish & Activate Course"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* VIDEO IN-APP PLAYBACK TEST MODAL */}
      {previewVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="relative flex w-full max-w-3xl flex-col rounded-2xl border border-slate-800 bg-slate-950 p-5 text-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <PlayCircle className="h-5 w-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white truncate max-w-md">
                  In-App Player Test: {previewVideo.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="my-4">
              <InAppVideoPlayer
                title={previewVideo.title}
                videoUrl={previewVideo.videoUrl}
                videoType={previewVideo.videoType}
                durationFormatted={previewVideo.durationFormatted}
                autoPlay={true}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Verified: In-app embedded frame without external redirection.</span>
              <button
                type="button"
                onClick={() => setPreviewVideo(null)}
                className="rounded-lg bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Course Curriculum & Assignments Modal */}
      <ImportCourseModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        currentCourseSlugOrId={editSlug || existingCourseId || undefined}
        onImport={handleImportSections}
      />

      {/* FLOATING SAVE & SYNC PROGRESS MODAL OVERLAY */}
      <AnimatePresence>
        {isPublishing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.92, opacity: 0, y: 10 }}
              className="relative w-full max-w-md rounded-2xl sm:rounded-3xl border border-white/20 bg-white/95 dark:bg-slate-900/95 p-6 sm:p-8 text-center shadow-2xl backdrop-blur-2xl dark:border-slate-800"
            >
              {publishedSuccess ? (
                <div className="space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 ring-8 ring-emerald-500/10">
                    <CheckCircle2 className="h-8 w-8 animate-bounce" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white">
                      {isEditMode ? "Course Updated Successfully!" : "Course Published Successfully!"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Redirecting back to course catalog...
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[#2563EB]/20 border-t-[#2563EB] animate-spin" />
                    <Sparkles className="h-6 w-6 text-[#2563EB] dark:text-blue-400 animate-pulse" />
                  </div>

                  <div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                      {isEditMode ? "Saving & Updating Course..." : "Publishing Course Catalog..."}
                    </h3>
                    <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Uploading syllabus, lecture links, quizzes, and sequential stage verification rules to server database...
                    </p>
                  </div>

                  {/* Animated Progress indicator bar */}
                  <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-[#2563EB] via-indigo-500 to-cyan-400 rounded-full"
                      initial={{ width: "15%" }}
                      animate={{ width: ["20%", "65%", "90%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </div>

                  <div className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-1.5">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#2563EB]" />
                    <span>Syncing with JKS Learning API</span>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default function InstructorNewCoursePage() {
  return (
    <React.Suspense
      fallback={
        <div className="flex h-96 w-full items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      }
    >
      <InstructorNewCourseContent />
    </React.Suspense>
  );
}
