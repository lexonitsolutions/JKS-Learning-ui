"use client";

import React, { useState } from "react";
import {
  X,
  Upload,
  ClipboardCheck,
  Award,
  CheckCircle2,
  Lock,
  Plus,
  Trash2,
  Layers,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";

export interface StageConfig {
  id: string;
  stageNumber: number;
  stageTitle: string;
  videoTitle: string;
  videoDuration: string;
  assignmentTitle: string;
  assignmentType: "MCQ" | "Coding Challenge" | "Project Submission";
  minPassingScore: number;
  antiSkipEnabled: boolean;
}

export interface CourseWorkflowData {
  title: string;
  track: string;
  level: string;
  price: string;
  stages: StageConfig[];
  certificateTitle: string;
}

interface CourseWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (courseData: CourseWorkflowData) => void;
}

type StepNumber = 1 | 2 | 3 | 4;

export function CourseWorkflowModal({
  isOpen,
  onClose,
  onSave,
}: CourseWorkflowModalProps) {
  const [currentStep, setCurrentStep] = useState<StepNumber>(1);

  // Step 1: Basics
  const [title, setTitle] = useState("Enterprise Cloud & Microservices Mastery");
  const [track, setTrack] = useState("Full Stack");
  const [level, setLevel] = useState("Intermediate");
  const [price, setPrice] = useState("24,999");

  // Step 2 & 3: Sequential Stages
  const [stages, setStages] = useState<StageConfig[]>([
    {
      id: "stage-1",
      stageNumber: 1,
      stageTitle: "Core Fundamentals & Architecture",
      videoTitle: "01. Introduction to Microservices & Event Architecture",
      videoDuration: "42 mins",
      assignmentTitle: "Stage 1 Quiz: Architecture & Protocols",
      assignmentType: "MCQ",
      minPassingScore: 75,
      antiSkipEnabled: true,
    },
    {
      id: "stage-2",
      stageNumber: 2,
      stageTitle: "Backend Service Implementation",
      videoTitle: "02. Building Scalable APIs with Spring Boot & Docker",
      videoDuration: "58 mins",
      assignmentTitle: "Stage 2 Coding Test: Build a Resilient Microservice",
      assignmentType: "Coding Challenge",
      minPassingScore: 70,
      antiSkipEnabled: true,
    },
    {
      id: "stage-3",
      stageNumber: 3,
      stageTitle: "Capstone & Deployment",
      videoTitle: "03. Kubernetes Orchestration & Production CI/CD",
      videoDuration: "65 mins",
      assignmentTitle: "Final Capstone Project: End-to-End Enterprise App",
      assignmentType: "Project Submission",
      minPassingScore: 80,
      antiSkipEnabled: true,
    },
  ]);

  // Step 4: Certificate
  const [certificateTitle, setCertificateTitle] = useState("Certified Enterprise Microservices Architect");
  const [requireFullVideoWatch, setRequireFullVideoWatch] = useState(true);
  const [requireAllAssignmentsPassed, setRequireAllAssignmentsPassed] = useState(true);
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const addStage = () => {
    const newNum = stages.length + 1;
    setStages([
      ...stages,
      {
        id: `stage-${Date.now()}`,
        stageNumber: newNum,
        stageTitle: `Stage ${newNum}: Advanced Module`,
        videoTitle: `0${newNum}. Module Deep Dive`,
        videoDuration: "45 mins",
        assignmentTitle: `Stage ${newNum} Assignment`,
        assignmentType: "MCQ",
        minPassingScore: 75,
        antiSkipEnabled: true,
      },
    ]);
  };

  const removeStage = (id: string) => {
    if (stages.length <= 1) return;
    setStages(stages.filter((s) => s.id !== id).map((s, idx) => ({ ...s, stageNumber: idx + 1 })));
  };

  const handleFinish = () => {
    setIsSavedSuccess(true);
    setTimeout(() => {
      if (onSave) {
        onSave({
          title,
          track,
          level,
          price,
          stages,
          certificateTitle,
        });
      }
      setIsSavedSuccess(false);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-xs">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-[24px] border border-slate-100 bg-white shadow-2xl overflow-hidden min-h-0"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-7 py-5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EFF6FF] text-[#2563EB]">
              <Layers className="h-5 w-5 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Course Publishing & Stage Workflow Builder
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Configure sequential video milestones, stage assignments, and automated certificate unlocks
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Step Indicator Bar */}
        <div className="grid grid-cols-4 border-b border-slate-100 bg-slate-50/50 px-7 py-3 text-xs font-semibold shrink-0">
          {[
            { step: 1, label: "1. Course Basics" },
            { step: 2, label: "2. Video Stages & Anti-Skip" },
            { step: 3, label: "3. Sequential Assignments" },
            { step: 4, label: "4. Certificate Rules" },
          ].map((item) => (
            <button
              key={item.step}
              type="button"
              onClick={() => setCurrentStep(item.step as StepNumber)}
              className={`flex items-center gap-2 transition-colors ${
                currentStep === item.step
                  ? "text-[#2563EB] font-bold"
                  : currentStep > item.step
                    ? "text-emerald-600"
                    : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <div
                className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] ${
                  currentStep === item.step
                    ? "bg-[#2563EB] text-white"
                    : currentStep > item.step
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-slate-200 text-slate-500"
                }`}
              >
                {currentStep > item.step ? <CheckCircle2 className="h-3.5 w-3.5" /> : item.step}
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div
          data-lenis-prevent
          className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-7 text-slate-800 overscroll-contain"
        >
          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Course Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Microservices Architecture"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Track
                  </label>
                  <select
                    value={track}
                    onChange={(e) => setTrack(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                  >
                    <option value="Full Stack">Full Stack</option>
                    <option value="Frontend">Frontend</option>
                    <option value="SAP">SAP</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Experience Level
                  </label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    Price (₹)
                  </label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              {/* Upload Thumbnail Box */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Course Media & Banner
                </label>
                <div className="mt-1.5 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/70 p-7 text-center transition-colors hover:bg-slate-50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#EFF6FF] text-[#2563EB] shadow-xs">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="mt-3 text-sm font-bold text-slate-800">
                    Upload Course Thumbnail & Video Intro
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    PNG, JPG, MP4 up to 500MB (16:9 aspect ratio recommended)
                  </p>
                  <button
                    type="button"
                    className="mt-3 rounded-lg bg-white px-3.5 py-1.5 text-xs font-bold text-[#2563EB] border border-slate-200 shadow-xs hover:bg-slate-50"
                  >
                    Browse Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Video Stages & Anti-Skip Logic */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-blue-100 bg-[#EFF6FF]/70 p-4 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-[#2563EB]">
                  <Sparkles className="h-4 w-4" />
                  Anti-Skip Video Protection Policy
                </div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  When enabled, students cannot fast-forward or skip unwatched portions of the video. They must watch 100% of the video to unlock the corresponding stage assignment.
                </p>
              </div>

              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="relative rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs transition-all hover:border-[#2563EB]/40"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] text-xs font-bold text-white">
                          {idx + 1}
                        </span>
                        <span className="text-sm font-bold text-slate-900">
                          {stage.stageTitle}
                        </span>
                      </div>
                      {stages.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeStage(stage.id)}
                          className="text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Video Lesson Title
                        </label>
                        <input
                          type="text"
                          value={stage.videoTitle}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].videoTitle = e.target.value;
                            setStages(updated);
                          }}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Video Duration
                        </label>
                        <input
                          type="text"
                          value={stage.videoDuration}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].videoDuration = e.target.value;
                            setStages(updated);
                          }}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>
                    </div>

                    {/* Anti Skip Toggle */}
                    <div className="mt-3.5 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-2">
                        <Lock className="h-4 w-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-slate-700">
                          Enforce 100% Video Watch (No skipping allowed)
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={stage.antiSkipEnabled}
                        onChange={(e) => {
                          const updated = [...stages];
                          updated[idx].antiSkipEnabled = e.target.checked;
                          setStages(updated);
                        }}
                        className="h-4 w-4 accent-[#2563EB] cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addStage}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 py-3 text-xs font-bold text-[#2563EB] hover:bg-[#EFF6FF]/60 hover:border-[#2563EB] transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Next Stage & Video Lecture
              </button>
            </div>
          )}

          {/* STEP 3: Sequential Stage Assignments */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div className="rounded-xl border border-emerald-100 bg-[#ECFDF5]/70 p-4 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-bold text-emerald-700">
                  <ClipboardCheck className="h-4 w-4" />
                  Sequential Milestone Progression Rule
                </div>
                <p className="mt-1 leading-relaxed text-slate-600">
                  Each assignment unlocks strictly after the student completes the corresponding video lecture. Students must pass with the minimum score to unlock the subsequent stage.
                </p>
              </div>

              <div className="space-y-4">
                {stages.map((stage, idx) => (
                  <div
                    key={stage.id}
                    className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs"
                  >
                    <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                        Assignment for: {stage.stageTitle}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Assignment Name
                        </label>
                        <input
                          type="text"
                          value={stage.assignmentTitle}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].assignmentTitle = e.target.value;
                            setStages(updated);
                          }}
                          className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 uppercase">
                          Assessment Type
                        </label>
                        <select
                          value={stage.assignmentType}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].assignmentType = e.target.value as "MCQ" | "Coding Challenge" | "Project Submission";
                            setStages(updated);
                          }}
                          className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                        >
                          <option value="MCQ">MCQ Test</option>
                          <option value="Coding Challenge">Coding Challenge</option>
                          <option value="Project Submission">Project Submission</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 p-3">
                      <span className="text-xs font-medium text-slate-600">
                        Minimum Passing Threshold to Unlock Next Stage
                      </span>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="50"
                          max="100"
                          value={stage.minPassingScore}
                          onChange={(e) => {
                            const updated = [...stages];
                            updated[idx].minPassingScore = Number(e.target.value);
                            setStages(updated);
                          }}
                          className="w-16 rounded-md border border-slate-200 bg-white px-2 py-1 text-center text-xs font-bold text-slate-900"
                        />
                        <span className="text-xs font-bold text-slate-500">%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 4: Certificate Generation & Criteria */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Accredited Certificate Title
                </label>
                <input
                  type="text"
                  value={certificateTitle}
                  onChange={(e) => setCertificateTitle(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-900 outline-none focus:border-[#2563EB]"
                />
              </div>

              {/* Certificate Unlock Rules Box */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-5">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Automated Unlock Criteria for Students
                </h4>

                <div className="mt-3 space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireFullVideoWatch}
                      onChange={(e) => setRequireFullVideoWatch(e.target.checked)}
                      className="h-4 w-4 accent-[#2563EB]"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      100% of all video lectures completed without skipping
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={requireAllAssignmentsPassed}
                      onChange={(e) => setRequireAllAssignmentsPassed(e.target.checked)}
                      className="h-4 w-4 accent-[#2563EB]"
                    />
                    <span className="text-xs font-semibold text-slate-700">
                      All stage assignments submitted and graded above passing score
                    </span>
                  </label>
                </div>
              </div>

              {/* Certificate Live Preview */}
              <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 text-white shadow-lg">
                <div className="flex items-start justify-between border-b border-white/10 pb-4">
                  <div>
                    <div className="text-[11px] font-bold uppercase tracking-widest text-blue-400">
                      JKS Learning Verified Credential
                    </div>
                    <div className="mt-1 text-lg font-bold text-white">
                      {certificateTitle}
                    </div>
                  </div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-blue-300">
                    <Award className="h-6 w-6" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400">Recipient:</span>{" "}
                    <span className="font-semibold text-white">[Student Full Name]</span>
                  </div>
                  <div className="flex items-center gap-1 font-mono text-emerald-400">
                    <ShieldCheck className="h-4 w-4" /> VERIFIED-ID: JKS-2026-XXXX
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-7 py-4">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((currentStep - 1) as StepNumber)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              Cancel
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((currentStep + 1) as StepNumber)}
                className="flex items-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-colors"
              >
                Next Step <ArrowRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinish}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-700 transition-all"
              >
                {isSavedSuccess ? (
                  <>
                    <CheckCircle2 className="h-4 w-4 animate-bounce" /> Published Successfully!
                  </>
                ) : (
                  <>
                    <Award className="h-4 w-4" /> Publish Course & Activate Workflow
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
