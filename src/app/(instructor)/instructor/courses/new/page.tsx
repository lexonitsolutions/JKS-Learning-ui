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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DashboardTopbar } from "@/components/dashboard/topbar";
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
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import { CourseThumbnailUploader } from "@/components/admin/course-thumbnail-uploader";
import {
  requestDirectUploadTicket,
  uploadVideoToBunnyStream,
} from "@/lib/data/videos-api";

type StepNumber = 1 | 2 | 3 | 4 | 5;

interface StepTab {
  step: StepNumber;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
}

const STEPS: StepTab[] = [
  { step: 1, label: "1. Course Basics", shortLabel: "Basics", icon: Layers },
  { step: 2, label: "2. Curriculum & Videos", shortLabel: "Curriculum", icon: Video },
  { step: 3, label: "3. Assignments & Pass Marks", shortLabel: "Assignments", icon: ClipboardCheck },
  { step: 4, label: "4. Anti-Skip & Security", shortLabel: "Anti-Skip", icon: Lock },
  { step: 5, label: "5. Certificate & Publish", shortLabel: "Certificate", icon: Award },
];

function InstructorNewCourseContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editSlug = searchParams?.get("edit");

  const [currentStep, setCurrentStep] = useState<StepNumber>(1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingCourseId, setExistingCourseId] = useState<string | null>(null);
  const [isLoadingEdit, setIsLoadingEdit] = useState(false);
  const [originalRating, setOriginalRating] = useState<number>(5.0);
  const [originalStudentsEnrolled, setOriginalStudentsEnrolled] = useState<number>(0);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Scroll to top whenever step changes so user never encounters stuck scroll
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // Step 1: Basic Info State
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [track, setTrack] = useState<string>("Full Stack");
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
        questions: [],
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
          setOriginalRating(typeof courseData.rating === "number" ? courseData.rating : 5.0);
          setOriginalStudentsEnrolled(typeof courseData.studentsEnrolled === "number" ? courseData.studentsEnrolled : 0);
          setTitle(courseData.title || "");
          setSlug(courseData.slug || "");
          const mappedTrack = mapBackendTrack(courseData.track);
          setTrack(mappedTrack);
          if (courseData.level) setLevel(courseData.level);
          if (courseData.durationWeeks) setDurationWeeks(courseData.durationWeeks);
          if (courseData.priceCents !== undefined && courseData.priceCents !== null) {
            setPrice(Math.round(courseData.priceCents / 100));
          } else if (courseData.price !== undefined) {
            setPrice(courseData.price);
          }
          if (courseData.summary) setSummary(courseData.summary);
          if (courseData.thumbnail) setThumbnailUrl(courseData.thumbnail);

          const rawSections = courseData.sectionsJson || courseData.sections;
          if (Array.isArray(rawSections) && rawSections.length > 0) {
            const normalizedSections = rawSections.map((sec: any, idx: number) => {
              const asgType = canonicalizeAssessmentType(sec.assignment?.type);
              const rawQuestions = Array.isArray(sec.assignment?.questions) ? sec.assignment.questions : [];
              const normalizedQuestions = rawQuestions.map((q: any, qIdx: number) => ({
                id: q.id || `q-${Date.now()}-${qIdx}`,
                prompt: q.prompt || "",
                type: canonicalizeAssessmentType(q.type || asgType),
                choices: Array.isArray(q.choices) && q.choices.length > 0 ? q.choices : ["Option A", "Option B", "Option C", "Option D"],
                correctIndex: typeof q.correctIndex === "number" ? q.correctIndex : 0,
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
              }));

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

  // Sequential Stage Validation
  const validateStep = (step: StepNumber): { valid: boolean; message: string } => {
    if (step === 1) {
      if (!title.trim() || title.trim().length < 3) {
        return { valid: false, message: "Please enter a valid course title (at least 3 characters) before proceeding." };
      }
      if (!slug.trim() || slug.trim().length < 2) {
        return { valid: false, message: "Please provide a valid URL slug for the course." };
      }
      if (!summary.trim() || summary.trim().length < 10) {
        return { valid: false, message: "Please provide a course summary (at least 10 characters) explaining the course." };
      }
      if (price === "" || Number(price) < 0 || isNaN(Number(price))) {
        return { valid: false, message: "Please enter a valid course price (₹0 or higher)." };
      }
      return { valid: true, message: "" };
    }

    if (step === 2) {
      if (!sections || sections.length === 0) {
        return { valid: false, message: "Please add at least one curriculum section." };
      }
      for (let i = 0; i < sections.length; i++) {
        if (!sections[i].title.trim() || sections[i].title.trim().length < 2) {
          return { valid: false, message: `Section ${i + 1} requires a descriptive title before proceeding.` };
        }
      }
      const totalVideosCount = sections.reduce((acc, s) => {
        const subVids =
          s.subsections?.reduce((subAcc, sub) => subAcc + (sub.videos?.length || 0), 0) || 0;
        const dirVids = s.directVideos?.length || 0;
        return acc + subVids + dirVids;
      }, 0);
      if (totalVideosCount < 1) {
        return { valid: false, message: "Please add at least one video lecture to the curriculum before moving forward." };
      }
      return { valid: true, message: "" };
    }

    if (step === 3) {
      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        if (!sec.assignment.title.trim()) {
          return { valid: false, message: `Please enter an Assignment Title for Section ${i + 1} requirement.` };
        }
        if (
          typeof sec.assignment.minPassingScore !== "number" ||
          sec.assignment.minPassingScore < 40 ||
          sec.assignment.minPassingScore > 100
        ) {
          return { valid: false, message: `Section ${i + 1} passing mark must be between 40% and 100%.` };
        }
      }
      return { valid: true, message: "" };
    }

    if (step === 4) {
      return { valid: true, message: "" };
    }

    return { valid: true, message: "" };
  };

  const isStepAccessible = (targetStep: StepNumber): boolean => {
    for (let s = 1; s < targetStep; s++) {
      const check = validateStep(s as StepNumber);
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
      const check = validateStep(s as StepNumber);
      if (!check.valid) {
        setValidationError(check.message);
        return;
      }
    }
    setValidationError(null);
    setCurrentStep(targetStep);
  };

  const handleNextStep = () => {
    const check = validateStep(currentStep);
    if (!check.valid) {
      setValidationError(check.message);
      return;
    }
    setValidationError(null);
    if (currentStep < 5) {
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
        questions: [],
      },
    };
    setSections([...sections, newSec]);
  };

  const removeSection = (id: string) => {
    if (sections.length <= 1) return;
    setSections(
      sections
        .filter((s) => s.id !== id)
        .map((s, idx) => ({ ...s, order: idx + 1 }))
    );
  };

  const updateSectionField = (index: number, field: keyof Section, val: any) => {
    const updated = [...sections];
    (updated[index] as any)[field] = val;
    setSections(updated);
  };

  // Subsection handlers
  const addSubsection = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentSubs = sec.subsections || [];
    const newOrder = currentSubs.length + 1;
    const newSub: SubSection = {
      id: `sub-${Date.now()}`,
      title: "",
      order: newOrder,
      videos: [],
    };
    sec.subsections = [...currentSubs, newSub];
    setSections(updated);
  };

  const removeSubsection = (sectionIndex: number, subId: string) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    if (sec.subsections) {
      sec.subsections = sec.subsections
        .filter((s) => s.id !== subId)
        .map((s, idx) => ({ ...s, order: idx + 1 }));
    }
    setSections(updated);
  };

  const updateSubsectionTitle = (sectionIndex: number, subIndex: number, title: string) => {
    const updated = [...sections];
    if (updated[sectionIndex].subsections?.[subIndex]) {
      updated[sectionIndex].subsections![subIndex].title = title;
      setSections(updated);
    }
  };

  // Video handlers
  const addDirectVideo = (sectionIndex: number) => {
    const updated = [...sections];
    const sec = updated[sectionIndex];
    const currentVids = sec.directVideos || [];
    const newOrder = currentVids.length + 1;
    const newVid: VideoItem = {
      id: `v-${Date.now()}`,
      title: "",
      durationSeconds: 0,
      durationFormatted: "0:00",
      videoType: "upload",
      videoUrl: "",
      order: newOrder,
    };
    sec.directVideos = [...currentVids, newVid];
    setSections(updated);
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
    const newVid: VideoItem = {
      id: `v-${Date.now()}`,
      title: "",
      durationSeconds: 0,
      durationFormatted: "0:00",
      videoType: "upload",
      videoUrl: "",
      order: newOrder,
    };
    sub.videos = [...sub.videos, newVid];
    setSections(updated);
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

    let defaultChoices = ["Option A", "Option B", "Option C", "Option D"];
    let defaultStarterCode = "";
    let defaultTestCases = "";
    let defaultFileTypes = ".zip, .pdf, .docx";
    let defaultChecklist = "";
    let defaultRubric = "";
    let defaultPoints = 10;

    if (qType === "Multiple Choice (MCQ)") {
      defaultChoices = ["Option A", "Option B", "Option C", "Option D"];
      defaultPoints = 5;
    } else if (qType === "Coding Challenge / Test") {
      defaultStarterCode = "// Write your solution function here\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n";
      defaultTestCases = "Input: solution([1, 2, 3]) => Expected Output: 6\nInput: solution([4, 5]) => Expected Output: 9";
      defaultPoints = 25;
    } else if (qType === "Project / File Upload") {
      defaultFileTypes = ".zip, .pdf, .docx";
      defaultChecklist = "- Source code archive (ZIP)\n- Execution screenshots / demo\n- Project documentation (PDF)";
      defaultPoints = 50;
    } else if (qType === "Long Answer / Comprehensive") {
      defaultRubric = "- Concept & Architectural Clarity: 40%\n- Implementation & Technical Depth: 40%\n- Edge Cases & Best Practices: 20%";
      defaultPoints = 20;
    } else {
      defaultPoints = 10;
    }

    asg.questions = [
      ...currentQuestions,
      {
        id: `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        prompt: "",
        type: qType,
        choices: defaultChoices,
        correctIndex: 0,
        modelAnswer: "",
        keywords: "",
        language: "JavaScript",
        starterCode: defaultStarterCode,
        testCases: defaultTestCases,
        structuredTestCases: [],
        solutionCode: "",
        fileTypes: defaultFileTypes,
        maxFileSizeMb: 25,
        checklist: defaultChecklist,
        rubric: defaultRubric,
        minWords: 50,
        maxPoints: defaultPoints,
        explanation: "",
      },
    ];
    setSections(updated);
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
        if (canonical === "Multiple Choice (MCQ)" && (!q.choices || q.choices.length === 0)) {
          q.choices = ["Option A", "Option B", "Option C", "Option D"];
          q.correctIndex = 0;
          if (!q.maxPoints) q.maxPoints = 5;
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

  const handleVideoFileUpload = async (
    videoId: string,
    videoTitle: string,
    file: File | undefined,
    onSetUrl: (url: string) => void
  ) => {
    if (!file) return;

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
      onSetUrl(finalUrl);

      setUploadProgress((prev) => ({
        ...prev,
        [videoId]: { status: "ready", percent: 100, fileName: file.name },
      }));
    } catch (err: any) {
      console.warn("Bunny Stream direct upload fallback to local preview object URL:", err);
      const fallbackUrl = URL.createObjectURL(file);
      onSetUrl(fallbackUrl);
      setUploadProgress((prev) => ({
        ...prev,
        [videoId]: { status: "ready", percent: 100, fileName: file.name },
      }));
    }
  };

  // Save & Publish
  const handlePublishCourse = async (status: "Published" | "Draft" = "Published") => {
    setIsPublishing(true);
    setSaveError(null);

    const newCourse: FullCourse = {
      id: existingCourseId || `crs-${Date.now()}`,
      slug: slug || `course-${Date.now()}`,
      title,
      track: track as Track,
      level,
      durationWeeks: Number(durationWeeks) || 12,
      price: price !== "" && Number(price) >= 0 ? Number(price) : 19999,
      rating: isEditMode ? originalRating : 5.0,
      studentsEnrolled: isEditMode ? originalStudentsEnrolled : 0,
      summary,
      thumbnail: thumbnailUrl,
      sections,
      createdAt: new Date().toISOString(),
      status,
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
        subtitle="Instructor Studio: Configure multi-section curriculum, anti-skip verification, passing marks, and certificates."
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
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 sm:gap-2 rounded-xl bg-[#2563EB] px-3.5 sm:px-5 py-2 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all hover:scale-[1.02] cursor-pointer text-center"
            >
              {publishedSuccess ? (
                <>
                  <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                  <span className="truncate">{isEditMode ? "Updated!" : "Published!"}</span>
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
        <div className="grid grid-cols-5 gap-1 sm:gap-2 rounded-2xl sm:rounded-[20px] border border-white/80 dark:border-slate-800/80 bg-white/80 dark:bg-surface-secondary p-1 sm:p-2 shadow-[0_8px_30px_rgb(20,50,100,0.04)] backdrop-blur-xl">
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

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Course Title
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => handleTitleChange(e.target.value)}
                      placeholder="e.g. Enterprise Distributed Systems & Cloud Architecture"
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/40"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        URL Slug
                      </label>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        placeholder="course-url-slug"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2 text-xs font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Academic Track / Category
                      </label>
                      <select
                        value={track}
                        onChange={(e) => {
                          if (e.target.value === "__custom__") {
                            setShowCustomTrackInput(true);
                          } else {
                            setShowCustomTrackInput(false);
                            setTrack(e.target.value);
                          }
                        }}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                      >
                        {availableTracks.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                        <option value="__custom__">+ Add Custom Track / Domain...</option>
                      </select>

                      {showCustomTrackInput && (
                        <div className="mt-2 flex items-center gap-2">
                          <input
                            type="text"
                            value={customTrackInput}
                            onChange={(e) => setCustomTrackInput(e.target.value)}
                            placeholder="Type new domain track..."
                            className="flex-1 rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-950/30 px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (customTrackInput.trim()) {
                                const newT = customTrackInput.trim();
                                if (!availableTracks.includes(newT)) {
                                  setAvailableTracks([...availableTracks, newT]);
                                }
                                setTrack(newT);
                                setCustomTrackInput("");
                                setShowCustomTrackInput(false);
                              }
                            }}
                            className="rounded-lg bg-[#2563EB] px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700"
                          >
                            Add
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Difficulty Level
                      </label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value as any)}
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-bold text-slate-800 dark:text-white outline-none"
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
                        onChange={(e) => setDurationWeeks(e.target.value)}
                        placeholder="12"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                        Tuition Fee (₹ INR)
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="19999"
                        className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-4 py-2 text-xs font-bold text-slate-900 dark:text-white outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      Course Summary & Outcomes
                    </label>
                    <textarea
                      rows={3}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      placeholder="Comprehensive overview of topics covered, industrial applications, and target proficiencies..."
                      className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3.5 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                    />
                  </div>

                  {/* THUMBNAIL UPLOADER */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                      Course Card Thumbnail Image
                    </label>
                    <CourseThumbnailUploader
                      thumbnailUrl={thumbnailUrl}
                      onThumbnailChange={setThumbnailUrl}
                      title={title}
                      track={track}
                      level={level}
                    />
                  </div>
                </motion.div>
              )}

              {/* STEP 2: MULTI-SECTION CURRICULUM & VIDEOS */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Curriculum Sections & Video Lectures</h2>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Create structured sections. Upload video files or embed YouTube/Vimeo URLs.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={addSection}
                      className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-3.5 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors cursor-pointer"
                    >
                      <Plus className="h-4 w-4" /> Add Section
                    </button>
                  </div>

                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 sm:p-6 shadow-xs space-y-5"
                    >
                      {/* Section Header */}
                      <div className="flex items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-950/60 text-xs font-bold text-[#2563EB] dark:text-blue-400">
                            {secIdx + 1}
                          </span>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => updateSectionField(secIdx, "title", e.target.value)}
                            placeholder={`Section ${secIdx + 1} Title`}
                            className="flex-1 min-w-0 rounded-lg border border-transparent hover:border-slate-200 dark:hover:border-slate-700 bg-transparent px-2 py-1 text-sm font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB] focus:bg-white dark:focus:bg-input-bg"
                          />
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => addSubsection(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Subsection
                          </button>

                          {sections.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeSection(section.id)}
                              className="text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors p-1"
                              title="Delete Section"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* SUBSECTIONS LIST */}
                      <div className="space-y-4">
                        {(section.subsections && section.subsections.length > 0) ? (
                          <div className="space-y-3.5">
                            {section.subsections.map((sub, subIdx) => (
                              <div
                                key={sub.id}
                                className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/70 dark:bg-surface-elevated p-3.5 sm:p-4 space-y-3"
                              >
                                <div className="flex items-center justify-between gap-3">
                                  <div className="flex items-center gap-2 flex-1 min-w-0">
                                    <FolderTree className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
                                    <input
                                      type="text"
                                      value={sub.title}
                                      onChange={(e) => updateSubsectionTitle(secIdx, subIdx, e.target.value)}
                                      placeholder={`Subsection ${secIdx + 1}.${subIdx + 1} Title`}
                                      className="flex-1 min-w-0 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-xs font-bold text-slate-800 dark:text-white outline-none focus:border-[#2563EB]"
                                    />
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => removeSubsection(secIdx, sub.id)}
                                    className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                    title="Remove Subsection"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </button>
                                </div>

                                {/* Subsection Videos */}
                                <div className="space-y-2 pl-2 sm:pl-3 border-l-2 border-purple-200 dark:border-purple-900/60">
                                  {sub.videos.map((vid, vidIdx) => (
                                    <div
                                      key={vid.id}
                                      className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 space-y-2"
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
                                          className="text-slate-400 hover:text-rose-500"
                                        >
                                          <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                                        <div className="sm:col-span-4 lg:col-span-3">
                                          <select
                                            value={vid.videoType}
                                            onChange={(e) => {
                                              const newType = e.target.value as VideoSourceType;
                                              const updated = [...sections];
                                              const currentVid = updated[secIdx].subsections![subIdx].videos[vidIdx];
                                              currentVid.videoType = newType;
                                              if (newType === "upload" && currentVid.videoUrl.includes("youtube.com")) {
                                                currentVid.videoUrl = "";
                                              }
                                              setSections(updated);
                                            }}
                                            className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                          >
                                            <option value="upload">Upload Video File</option>
                                            <option value="url">Paste Video URL</option>
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
                                              placeholder="https://... private video URL (Vimeo, YouTube, etc.)"
                                              className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-[11px] font-mono text-slate-700 dark:text-slate-300 dark:placeholder-slate-400 outline-none"
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
                                                        handleVideoFileUpload(vid.id, vid.title, file, (url) => {
                                                          const updated = [...sections];
                                                          updated[secIdx].subsections![subIdx].videos[vidIdx].videoUrl = url;
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
                                                    <span>✓ Video Uploaded (Ready)</span>
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
                          <p className="text-[11px] text-slate-400 italic">No subsections added yet. You can add direct videos below.</p>
                        )}
                      </div>

                      {/* DIRECT SECTION VIDEOS */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-white">
                            <Video className="h-4 w-4 text-[#2563EB] dark:text-blue-400" />
                            <span>Direct Section Videos ({section.directVideos?.length || 0})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => addDirectVideo(secIdx)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-xs hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors cursor-pointer"
                          >
                            <Plus className="h-3 w-3" /> Add Video
                          </button>
                        </div>

                        {section.directVideos?.map((vid, vidIdx) => (
                          <div
                            key={vid.id}
                            className="rounded-xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/50 dark:bg-surface-elevated p-3 sm:p-3.5 space-y-2.5"
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

                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
                              <div className="sm:col-span-4 lg:col-span-3">
                                <select
                                  value={vid.videoType}
                                  onChange={(e) => {
                                    const updated = [...sections];
                                    updated[secIdx].directVideos![vidIdx].videoType = e.target.value as VideoSourceType;
                                    setSections(updated);
                                  }}
                                  className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2 py-1.5 text-[11px] font-medium text-slate-800 dark:text-white outline-none"
                                >
                                  <option value="upload">Upload Video File (Bunny)</option>
                                  <option value="url">Paste Private URL</option>
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
                                              handleVideoFileUpload(vid.id, vid.title, file, (url) => {
                                                const updated = [...sections];
                                                updated[secIdx].directVideos![vidIdx].videoUrl = url;
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
                                          <span>Uploaded to Bunny Stream (Ready)</span>
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
                                      : "bg-slate-100 dark:bg-surface-elevated text-slate-400 cursor-not-allowed"
                                  }`}
                                  title="Test In-App Player"
                                >
                                  <PlayCircle className="h-3.5 w-3.5" /> Preview
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 3: ASSIGNMENTS & PASSING MARKS */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div className="rounded-2xl border border-emerald-100 dark:border-emerald-900/50 bg-[#ECFDF5]/70 dark:bg-emerald-950/30 p-4 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center gap-2 font-bold text-emerald-700 dark:text-emerald-400">
                      <ClipboardCheck className="h-4 w-4" />
                      Section Milestones & Minimum Passing Thresholds
                    </div>
                    <p className="mt-1 leading-relaxed text-slate-600 dark:text-slate-400">
                      Specify the evaluation criteria and pass out marks for each section. Students must achieve this score to unlock subsequent sections.
                    </p>
                  </div>

                  {sections.map((section, secIdx) => (
                    <div
                      key={section.id}
                      className="rounded-[22px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-5 sm:p-6 shadow-xs space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-200/80 dark:border-slate-800 pb-3">
                        <div className="flex items-center gap-2.5">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 dark:bg-slate-800 text-xs font-bold text-white shrink-0">
                            {secIdx + 1}
                          </span>
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                            ASSIGNMENT FOR: {section.title || `Section ${secIdx + 1}`}
                          </h3>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                          Section {secIdx + 1} Requirement
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                        <div className="sm:col-span-8">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            ASSIGNMENT TITLE
                          </label>
                          <input
                            type="text"
                            value={section.assignment.title}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].assignment.title = e.target.value;
                              setSections(updated);
                            }}
                            placeholder="e.g. Stage 1 MCQ Assessment or Coding Test"
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3.5 py-2 text-xs font-semibold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                          />
                        </div>

                        <div className="sm:col-span-4">
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                            ASSESSMENT TYPE
                          </label>
                          <select
                            value={canonicalizeAssessmentType(section.assignment.type)}
                            onChange={(e) => {
                              const newType = canonicalizeAssessmentType(e.target.value);
                              const updated = [...sections];
                              updated[secIdx].assignment.type = newType;
                              // Synchronize all questions in this section so they immediately match!
                              if (Array.isArray(updated[secIdx].assignment.questions)) {
                                updated[secIdx].assignment.questions = updated[secIdx].assignment.questions.map((q) => {
                                  const updatedQ = { ...q, type: newType };
                                  if (newType === "Multiple Choice (MCQ)" && (!updatedQ.choices || updatedQ.choices.length === 0)) {
                                    updatedQ.choices = ["Option A", "Option B", "Option C", "Option D"];
                                    updatedQ.correctIndex = 0;
                                    if (!updatedQ.maxPoints) updatedQ.maxPoints = 5;
                                  } else if (newType === "Coding Challenge / Test") {
                                    if (!updatedQ.starterCode) {
                                      updatedQ.starterCode = "// Write your solution function here\nfunction solution(input) {\n  // Your code here\n  return input;\n}\n";
                                    }
                                    if (!updatedQ.testCases) {
                                      updatedQ.testCases = "Input: solution([1, 2, 3]) => Expected Output: 6\nInput: solution([4, 5]) => Expected Output: 9";
                                    }
                                    if (!updatedQ.language) updatedQ.language = "JavaScript";
                                    if (!updatedQ.maxPoints) updatedQ.maxPoints = 25;
                                  } else if (newType === "Project / File Upload") {
                                    if (!updatedQ.fileTypes) updatedQ.fileTypes = ".zip, .pdf, .docx";
                                    if (!updatedQ.checklist) updatedQ.checklist = "- Source code archive (ZIP)\n- Execution screenshots / demo\n- Project documentation (PDF)";
                                    if (!updatedQ.maxFileSizeMb) updatedQ.maxFileSizeMb = 25;
                                    if (!updatedQ.maxPoints) updatedQ.maxPoints = 50;
                                  } else if (newType === "Long Answer / Comprehensive") {
                                    if (!updatedQ.rubric) updatedQ.rubric = "- Concept & Architectural Clarity: 40%\n- Implementation & Technical Depth: 40%\n- Edge Cases & Best Practices: 20%";
                                    if (!updatedQ.minWords) updatedQ.minWords = 100;
                                    if (!updatedQ.maxPoints) updatedQ.maxPoints = 20;
                                  } else if (newType === "Short Answer Question") {
                                    if (!updatedQ.maxPoints) updatedQ.maxPoints = 10;
                                  }
                                  return updatedQ;
                                });
                              }
                              setSections(updated);
                            }}
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                          >
                            <option value="Short Answer Question">Short Answer Question</option>
                            <option value="Multiple Choice (MCQ)">Multiple Choice (MCQ)</option>
                            <option value="Long Answer / Comprehensive">Long Answer / Comprehensive</option>
                            <option value="Coding Challenge / Test">Coding Challenge / Test</option>
                            <option value="Project / File Upload">Project / File Upload</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          INSTRUCTIONS & PROBLEM STATEMENT
                        </label>
                        <textarea
                          rows={3}
                          value={section.assignment.description}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[secIdx].assignment.description = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="e.g. Detailed problem statement and submission guidelines..."
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                          ADMIN MODEL / EXPECTED ANSWER (FOR AUTOMATIC EVALUATION & VALIDATION)
                        </label>
                        <textarea
                          rows={3}
                          value={section.assignment.modelAnswer || ""}
                          onChange={(e) => {
                            const updated = [...sections];
                            updated[secIdx].assignment.modelAnswer = e.target.value;
                            setSections(updated);
                          }}
                          placeholder="Enter the official model answer or key concepts. When students submit, their response is evaluated against this text."
                          className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-3 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      {/* PASSING OUT MARK THRESHOLD */}
                      <div className="flex items-center justify-between gap-3 rounded-2xl bg-slate-50/80 dark:bg-surface-elevated p-4 border border-slate-200/90 dark:border-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 shrink-0">
                            <Sliders className="h-4 w-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white">
                              Minimum Passing Mark to Unlock Next Stage
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                              Score required for the student to pass this milestone
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="40"
                            max="100"
                            value={section.assignment.minPassingScore}
                            onChange={(e) => {
                              const updated = [...sections];
                              updated[secIdx].assignment.minPassingScore = Number(e.target.value);
                              setSections(updated);
                            }}
                            className="w-16 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1.5 text-center text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                          />
                          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">%</span>
                        </div>
                      </div>

                      {/* ASSIGNMENT QUESTIONS BUILDER */}
                      <div className="space-y-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated/70 p-4 sm:p-5">
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/40 text-[#2563EB] dark:text-blue-400 shrink-0">
                              <HelpCircle className="h-4 w-4" />
                            </div>
                            <div>
                              <div className="text-xs font-bold text-slate-900 dark:text-white">
                                Questions & Rubric Items ({section.assignment.questions?.length || 0})
                              </div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                                Configure quiz questions or challenge prompts for this section milestone
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => addQuestionToAssignment(secIdx)}
                            className="flex items-center gap-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/40 px-3.5 py-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus className="h-3.5 w-3.5" /> <span>Add Question</span>
                          </button>
                        </div>

                        {(!section.assignment.questions || section.assignment.questions.length === 0) ? (
                          <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-800 p-6 text-center space-y-1">
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              No questions configured for this section milestone yet.
                            </p>
                            <button
                              type="button"
                              onClick={() => addQuestionToAssignment(secIdx)}
                              className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
                            >
                              + Click here to add your first question
                            </button>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {section.assignment.questions.map((q, qIdx) => {
                              const qType = canonicalizeAssessmentType(q.type || section.assignment.type);

                              return (
                                <div
                                  key={q.id || qIdx}
                                  className="rounded-xl border border-slate-200/90 dark:border-slate-700/80 bg-white dark:bg-surface-secondary p-4 sm:p-5 space-y-4 shadow-2xs"
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-2.5 flex-1 min-w-0">
                                      <span className="shrink-0 rounded-lg bg-blue-100 dark:bg-blue-950/60 px-2.5 py-1 text-xs font-black text-[#2563EB] dark:text-blue-400 mt-0.5">
                                        Q{qIdx + 1}
                                      </span>
                                      <div className="flex-1 min-w-0 space-y-2">
                                        <input
                                          type="text"
                                          value={q.prompt}
                                          onChange={(e) =>
                                            updateQuestionPrompt(secIdx, qIdx, e.target.value)
                                          }
                                          placeholder={`Question ${qIdx + 1} prompt or problem statement...`}
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-input-bg px-3 py-2 text-xs font-bold text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                        />

                                        <div className="flex flex-wrap items-center gap-2">
                                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                                            Question Type:
                                          </label>
                                          <select
                                            value={qType}
                                            onChange={(e) =>
                                              updateQuestionField(secIdx, qIdx, "type", e.target.value)
                                            }
                                            className="rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-2.5 py-1 text-[11px] font-semibold text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                                          >
                                            <option value="Short Answer Question">Short Answer Question</option>
                                            <option value="Multiple Choice (MCQ)">Multiple Choice (MCQ)</option>
                                            <option value="Long Answer / Comprehensive">Long Answer / Comprehensive</option>
                                            <option value="Coding Challenge / Test">Coding Challenge / Test</option>
                                            <option value="Project / File Upload">Project / File Upload</option>
                                          </select>
                                        </div>
                                      </div>
                                    </div>

                                    <button
                                      type="button"
                                      onClick={() => removeQuestionFromAssignment(secIdx, qIdx)}
                                      className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 cursor-pointer"
                                      title="Delete Question"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  </div>

                                  {/* 1. SHORT ANSWER QUESTION */}
                                  {qType === "Short Answer Question" && (
                                    <div className="space-y-3 pl-1.5 sm:pl-3 border-l-2 border-blue-400 dark:border-blue-600">
                                      <div className="rounded-xl bg-blue-50/70 dark:bg-blue-950/30 p-2.5 border border-blue-100 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-300">
                                        <span className="font-bold">Short Answer Evaluation: </span>
                                        Students submit concise written answers. Provide the reference model answer and key mandatory concepts for automated or manual score allocation.
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Model / Reference Answer <span className="text-rose-500">*</span>
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={q.modelAnswer || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "modelAnswer", e.target.value)
                                          }
                                          placeholder="e.g. Java is platform-independent because the compiler converts source code into bytecode (.class). This bytecode runs on any operating system equipped with a compatible Java Virtual Machine (JVM)."
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Mandatory Keywords / Key Concepts (Comma-Separated)
                                        </label>
                                        <input
                                          type="text"
                                          value={q.keywords || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "keywords", e.target.value)
                                          }
                                          placeholder="e.g. Bytecode, JVM, platform-independent, WORA, Virtual Machine"
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-2 text-xs text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                        />
                                        <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                                          AI evaluator verifies if student submission contains these essential concepts.
                                        </span>
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Max Marks / Score
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="1"
                                              max="100"
                                              value={q.maxPoints ?? 10}
                                              onChange={(e) =>
                                                updateQuestionField(secIdx, qIdx, "maxPoints", Number(e.target.value))
                                              }
                                              className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                            />
                                            <span className="text-xs text-slate-500">Points</span>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Grading Hint / Explanation Note
                                          </label>
                                          <input
                                            type="text"
                                            value={q.explanation || ""}
                                            onChange={(e) =>
                                              updateQuestionField(secIdx, qIdx, "explanation", e.target.value)
                                            }
                                            placeholder="e.g. Award full score if bytecode and JVM role are explained."
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 2. MULTIPLE CHOICE (MCQ) */}
                                  {qType === "Multiple Choice (MCQ)" && (
                                    <div className="space-y-3 pl-1.5 sm:pl-3 border-l-2 border-emerald-400 dark:border-emerald-600">
                                      <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                                        <span>Select the radio button next to the <strong>Correct Answer</strong>:</span>
                                        <button
                                          type="button"
                                          onClick={() => addChoiceToQuestion(secIdx, qIdx)}
                                          className="flex items-center gap-1 text-[11px] font-bold text-[#2563EB] dark:text-blue-400 hover:underline cursor-pointer"
                                        >
                                          <Plus className="h-3 w-3" /> Add Choice
                                        </button>
                                      </div>

                                      <div className="space-y-2">
                                        {(q.choices || []).map((choice, cIdx) => {
                                          const isCorrect = (q.correctIndex ?? 0) === cIdx;
                                          const letter = String.fromCharCode(65 + cIdx);

                                          return (
                                            <div
                                              key={cIdx}
                                              className={`flex items-center gap-2.5 rounded-xl border p-2.5 transition-colors ${
                                                isCorrect
                                                  ? "border-emerald-400 dark:border-emerald-600 bg-emerald-50/70 dark:bg-emerald-950/30"
                                                  : "border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg"
                                              }`}
                                            >
                                              <input
                                                type="radio"
                                                name={`q-correct-inst-${secIdx}-${qIdx}`}
                                                checked={isCorrect}
                                                onChange={() => setQuestionCorrectIndex(secIdx, qIdx, cIdx)}
                                                className="h-4 w-4 accent-emerald-600 cursor-pointer shrink-0 ml-1"
                                                title="Click to mark this option as correct"
                                              />
                                              <span
                                                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${
                                                  isCorrect
                                                    ? "bg-emerald-600 text-white"
                                                    : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                                                }`}
                                              >
                                                {letter}
                                              </span>
                                              <input
                                                type="text"
                                                value={choice}
                                                onChange={(e) =>
                                                  updateQuestionChoice(secIdx, qIdx, cIdx, e.target.value)
                                                }
                                                placeholder={`Option ${letter} text...`}
                                                className="min-w-0 flex-1 bg-transparent px-2 py-1 text-xs text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none font-medium"
                                              />
                                              {isCorrect && (
                                                <span className="shrink-0 rounded-md bg-emerald-100 dark:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 px-2 py-0.5 text-[10px] font-bold text-emerald-800 dark:text-emerald-300">
                                                  Correct Answer
                                                </span>
                                              )}
                                              {(q.choices?.length || 0) > 2 && (
                                                <button
                                                  type="button"
                                                  onClick={() => removeChoiceFromQuestion(secIdx, qIdx, cIdx)}
                                                  className="shrink-0 p-1 text-slate-400 hover:text-rose-500 cursor-pointer rounded-md hover:bg-rose-50 dark:hover:bg-rose-950/40"
                                                  title="Remove this choice"
                                                >
                                                  <X className="h-3.5 w-3.5" />
                                                </button>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Explanation / Correct Answer Rationale
                                          </label>
                                          <input
                                            type="text"
                                            value={q.explanation || ""}
                                            onChange={(e) =>
                                              updateQuestionField(secIdx, qIdx, "explanation", e.target.value)
                                            }
                                            placeholder="Explain why this choice is correct (shown in score breakdown)..."
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Points / Weightage
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="1"
                                              max="100"
                                              value={q.maxPoints ?? 5}
                                              onChange={(e) =>
                                                updateQuestionField(secIdx, qIdx, "maxPoints", Number(e.target.value))
                                              }
                                              className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                            />
                                            <span className="text-xs text-slate-500">Points</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 3. LONG ANSWER / COMPREHENSIVE */}
                                  {qType === "Long Answer / Comprehensive" && (
                                    <div className="space-y-3 pl-1.5 sm:pl-3 border-l-2 border-purple-400 dark:border-purple-600">
                                      <div className="rounded-xl bg-purple-50/70 dark:bg-purple-950/30 p-2.5 border border-purple-100 dark:border-purple-900/40 text-[11px] text-purple-900 dark:text-purple-300">
                                        <span className="font-bold">Comprehensive Assessment: </span>
                                        Students submit in-depth essays, architectural breakdowns, or case study responses. Define the detailed model answer and structured grading rubric.
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Comprehensive Model Answer & Key Expected Points
                                        </label>
                                        <textarea
                                          rows={4}
                                          value={q.modelAnswer || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "modelAnswer", e.target.value)
                                          }
                                          placeholder="Provide the complete ideal response, required architectural diagrams/steps, and technical arguments..."
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-900 dark:text-white dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Evaluation Rubric & Marking Scheme
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={q.rubric || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "rubric", e.target.value)
                                          }
                                          placeholder="e.g.&#10;1. Architecture & Design (40% - 8 pts)&#10;2. Scalability & Fault Tolerance (30% - 6 pts)&#10;3. Error Handling & Edge Cases (30% - 6 pts)"
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs font-mono text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Minimum Word Count
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="20"
                                              max="2000"
                                              value={q.minWords ?? 100}
                                              onChange={(e) =>
                                                updateQuestionField(secIdx, qIdx, "minWords", Number(e.target.value))
                                              }
                                              className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                            />
                                            <span className="text-xs text-slate-500">Words minimum</span>
                                          </div>
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Max Marks / Score
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="1"
                                              max="100"
                                              value={q.maxPoints ?? 20}
                                              onChange={(e) =>
                                                updateQuestionField(secIdx, qIdx, "maxPoints", Number(e.target.value))
                                              }
                                              className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                            />
                                            <span className="text-xs text-slate-500">Points</span>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                  {/* 4. CODING CHALLENGE / TEST */}
                                  {qType === "Coding Challenge / Test" && (
                                    <div className="space-y-3 pl-1.5 sm:pl-3 border-l-2 border-emerald-400 dark:border-emerald-600">
                                      <div className="rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 p-2.5 border border-emerald-100 dark:border-emerald-900/40 text-[11px] text-emerald-900 dark:text-emerald-300">
                                        <span className="font-bold">Automated Coding Evaluation: </span>
                                        Students write and test code live in an integrated IDE editor. Configure the starter code template and automated test cases.
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Target Programming Language
                                          </label>
                                          <select
                                            value={q.language || "JavaScript"}
                                            onChange={(e) =>
                                              updateQuestionField(secIdx, qIdx, "language", e.target.value)
                                            }
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                          >
                                            <option value="JavaScript">JavaScript / Node.js</option>
                                            <option value="TypeScript">TypeScript</option>
                                            <option value="Python">Python 3</option>
                                            <option value="Java">Java</option>
                                            <option value="SAP ABAP">SAP ABAP</option>
                                            <option value="C++">C++</option>
                                            <option value="C#">C# / .NET</option>
                                            <option value="SQL">SQL (PostgreSQL)</option>
                                          </select>
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Max Marks / Score
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="1"
                                              max="100"
                                              value={q.maxPoints ?? 25}
                                              onChange={(e) =>
                                                updateQuestionField(secIdx, qIdx, "maxPoints", Number(e.target.value))
                                              }
                                              className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                            />
                                            <span className="text-xs text-slate-500">Points</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <div className="flex items-center justify-between mb-1">
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase">
                                            Starter Code Template (Pre-filled in Student Editor)
                                          </label>
                                          <span className="text-[10px] text-slate-500 font-mono">Monospace editor stub</span>
                                        </div>
                                        <textarea
                                          rows={4}
                                          value={q.starterCode || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "starterCode", e.target.value)
                                          }
                                          placeholder="// Write your solution function here&#10;function solution(input) {&#10;  // Your code here&#10;  return input;&#10;}"
                                          className="w-full font-mono text-[11px] rounded-lg border border-slate-800 bg-slate-950 text-emerald-400 p-3 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Automated Test Cases (Input & Expected Output)
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={q.testCases || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "testCases", e.target.value)
                                          }
                                          placeholder="Input: solution([1, 2, 3]) => Expected Output: 6&#10;Input: solution([4, 5]) => Expected Output: 9"
                                          className="w-full font-mono text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-input-bg p-2.5 text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                                        />
                                        <span className="mt-1 block text-[10px] text-slate-500 dark:text-slate-400">
                                          Each line represents a test case parsed during automatic code execution.
                                        </span>
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Instructor Reference Solution Code
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={q.solutionCode || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "solutionCode", e.target.value)
                                          }
                                          placeholder="// Complete working reference solution for evaluation runner comparison..."
                                          className="w-full font-mono text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {/* 5. PROJECT / FILE UPLOAD */}
                                  {qType === "Project / File Upload" && (
                                    <div className="space-y-3 pl-1.5 sm:pl-3 border-l-2 border-amber-400 dark:border-amber-600">
                                      <div className="rounded-xl bg-amber-50/70 dark:bg-amber-950/30 p-2.5 border border-amber-100 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-300">
                                        <span className="font-bold">Project / File Submission: </span>
                                        Students build and submit deliverables (e.g. ZIP file containing project code, architecture PDF, or report). Define format constraints, required deliverables, and evaluation checklist.
                                      </div>

                                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Accepted File Extensions
                                          </label>
                                          <input
                                            type="text"
                                            value={q.fileTypes || ".zip, .pdf, .docx"}
                                            onChange={(e) =>
                                              updateQuestionField(secIdx, qIdx, "fileTypes", e.target.value)
                                            }
                                            placeholder=".zip, .pdf, .docx"
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                                          />
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Max File Size
                                          </label>
                                          <select
                                            value={q.maxFileSizeMb ?? 25}
                                            onChange={(e) =>
                                              updateQuestionField(secIdx, qIdx, "maxFileSizeMb", Number(e.target.value))
                                            }
                                            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                          >
                                            <option value="10">10 MB</option>
                                            <option value="25">25 MB (Standard)</option>
                                            <option value="50">50 MB</option>
                                            <option value="100">100 MB</option>
                                          </select>
                                        </div>

                                        <div>
                                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                            Max Marks / Score
                                          </label>
                                          <div className="flex items-center gap-2">
                                            <input
                                              type="number"
                                              min="1"
                                              max="100"
                                              value={q.maxPoints ?? 50}
                                              onChange={(e) =>
                                                updateQuestionField(secIdx, qIdx, "maxPoints", Number(e.target.value))
                                              }
                                              className="w-24 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg px-3 py-1.5 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-[#2563EB]"
                                            />
                                            <span className="text-xs text-slate-500">Points</span>
                                          </div>
                                        </div>
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Required Submission Deliverables / Checklist
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={q.checklist || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "checklist", e.target.value)
                                          }
                                          placeholder="e.g.&#10;1. Complete ZIP file containing all source code and assets&#10;2. Architecture & Design document (PDF)&#10;3. README.md with setup and deployment instructions"
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-800 dark:text-slate-200 dark:placeholder-slate-400 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>

                                      <div>
                                        <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                                          Grading Criteria & Verification Guide
                                        </label>
                                        <textarea
                                          rows={3}
                                          value={q.modelAnswer || ""}
                                          onChange={(e) =>
                                            updateQuestionField(secIdx, qIdx, "modelAnswer", e.target.value)
                                          }
                                          placeholder="Detail what the evaluator or verification pipeline will check when inspecting submitted archives..."
                                          className="w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-[#2563EB]"
                                        />
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}

              {/* STEP 4: ANTI-SKIP OPTIONS & STAGE PROTECTION POLICY */}
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
                      <Lock className="h-4 w-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 4: Anti-Skip Options & Integrity Rules</h2>
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

              {/* STEP 5: ACCREDITED CERTIFICATE & FINAL PUBLISHING */}
              {currentStep === 5 && (
                <motion.div
                  key="step-5"
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
                      <h2 className="text-sm font-bold text-slate-900 dark:text-white">Step 5: Accredited Certificate & Unlock Criteria</h2>
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
                {currentStep < 5 ? (
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
                    className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-emerald-600 px-4 sm:px-6 py-2 sm:py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all cursor-pointer"
                  >
                    {publishedSuccess ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 animate-bounce shrink-0" />
                        <span className="truncate">{isEditMode ? "Updated!" : "Published!"}</span>
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
                  <div className="text-lg font-extrabold text-amber-700 dark:text-amber-300">
                    {sections.reduce((acc, s) => acc + (s.assignment.questions?.length || 0), 0)}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-600 dark:text-slate-400">Questions</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handlePublishCourse("Published")}
                disabled={isPublishing}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#2563EB] py-3 text-xs font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:bg-blue-700 transition-all cursor-pointer"
              >
                {publishedSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-bounce" />
                    <span>{isEditMode ? "Updated Successfully!" : "Course Published!"}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>{isEditMode ? "Save & Update Course" : "Publish & Activate Course"}</span>
                  </>
                )}
              </button>
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
