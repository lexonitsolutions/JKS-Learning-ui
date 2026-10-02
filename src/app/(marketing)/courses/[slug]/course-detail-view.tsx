"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Download,
  PlayCircle,
  Star,
  Clock,
  Users,
  CheckCircle2,
  Lock,
  X,
  Sparkles,
  ShieldCheck,
  ArrowRight,
  Tv,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MagneticButton } from "@/components/interactions/magnetic-button";
import { Reveal } from "@/lib/motion/reveal";
import { InAppVideoPlayer } from "@/components/ui/in-app-video-player";
import { CourseCheckoutModal, type CheckoutCourseItem } from "@/components/dashboard/course-checkout-modal";
import { useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { useStudentOwnedCourses } from "@/lib/data/courses-store";
import { useCourseReviews } from "@/lib/data/reviews-store";
import type { Course } from "@/lib/data/courses";

interface CourseDetailViewProps {
  course: Course;
}

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [lockedTopicPrompt, setLockedTopicPrompt] = useState<string | null>(null);

  const { reviews: reviewsList, stats: reviewStats } = useCourseReviews(course.slug);
  const liveRating = reviewStats.totalRatings > 0 ? reviewStats.averageRating : (course.rating || 5.0);
  const liveRatingCount = reviewStats.totalRatings > 0 ? reviewStats.totalRatings : ((course as any).ratingCount || 0);

  const session = useMockSession();
  const { user: clerkUser } = useUser();
  const email = (
    clerkUser?.primaryEmailAddress?.emailAddress ||
    clerkUser?.emailAddresses?.[0]?.emailAddress ||
    session?.email ||
    ""
  ).toLowerCase().trim();

  const ownedCourses = useStudentOwnedCourses(email);
  const isEnrolled = useMemo(
    () => ownedCourses.some((c) => c.slug === course.slug),
    [ownedCourses, course.slug]
  );

  const totalTopics = course.modules.reduce((sum, m) => sum + m.topics.length, 0);

  const checkoutItem: CheckoutCourseItem = {
    id: `checkout-${course.slug}`,
    slug: course.slug,
    title: course.title,
    price: course.price,
    originalPrice: Math.round(course.price * 1.5),
    level: course.level,
    durationWeeks: course.durationWeeks,
    summary: course.summary,
    track: course.track,
  };

  const demoUrl =
    course.demoVideoUrl ||
    (course.slug.includes("java")
      ? "https://www.youtube.com/watch?v=eIrMbAQSU34"
      : course.slug.includes("frontend")
      ? "https://www.youtube.com/watch?v=bMknfKXIFA8"
      : course.slug.includes("sap")
      ? "https://www.youtube.com/watch?v=k1BneeJTDcU"
      : "https://www.youtube.com/watch?v=28aEWu_yV_c");

  const demoTitle = course.demoVideoTitle || `${course.title} — Free Demo Lesson`;

  return (
    <div className="mx-auto max-w-[1280px] px-6 py-12 lg:px-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1fr_360px]">
        {/* Main column */}
        <div>
          <Reveal>
            <div className="flex items-center gap-3">
              <Badge variant="primary">{course.track}</Badge>
              {isEnrolled && (
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                  ✓ Enrolled in this Course
                </span>
              )}
            </div>
            <h1 className="text-h1 mt-3 text-text-heading">{course.title}</h1>
            <p className="mt-3 max-w-2xl text-text-body">{course.summary}</p>

            <div className="mt-4 flex flex-wrap items-center gap-5 text-body-sm text-text-body">
              <span className="flex items-center gap-1 font-semibold text-slate-800 dark:text-slate-200">
                <Star className="h-4 w-4 fill-warning text-warning" /> {liveRating} rating
                {liveRatingCount > 0 && (
                  <span className="text-text-muted font-normal">
                    ({liveRatingCount.toLocaleString()} {liveRatingCount === 1 ? "review" : "reviews"})
                  </span>
                )}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-4 w-4" /> {course.studentsEnrolled.toLocaleString()} enrolled
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> {course.durationWeeks} weeks
              </span>
            </div>
          </Reveal>

          {/* Interactive Free demo lesson card */}
          <Reveal
            variant="fade-up"
            delay={0.1}
            className="mt-8"
          >
            <div
              onClick={() => setIsDemoModalOpen(true)}
              className="group relative flex cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/50 p-5 shadow-md transition-all hover:border-blue-400 hover:shadow-lg dark:border-blue-800/60 dark:from-blue-950/40 dark:via-surface-secondary dark:to-blue-950/20"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#2563EB] text-white shadow-md shadow-blue-500/30 transition-transform group-hover:scale-110">
                  <PlayCircle className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-bold text-slate-900 dark:text-white">
                      Watch the free demo lesson
                    </span>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                      Free Preview
                    </span>
                  </div>
                  <div className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {course.modules[0]?.title} — Click to play preview lesson without sign-in required.
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1 rounded-xl bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs font-bold text-[#2563EB] dark:text-blue-400 shadow-xs border border-blue-100 dark:border-blue-800/40 group-hover:bg-[#2563EB] group-hover:text-white transition-colors">
                <span>Play Demo</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </Reveal>

          {/* Curriculum */}
          <div className="mt-12">
            <Reveal>
              <h2 className="text-h2 text-text-heading">Curriculum</h2>
              <p className="mt-1 text-body-sm text-text-body">
                {course.modules.length} modules &middot; {totalTopics} topics
              </p>
            </Reveal>
            <Reveal
              variant="stagger"
              staggerDelay={0.06}
              className="mt-6 divide-y divide-border dark:divide-slate-800/80 rounded-2xl border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary overflow-hidden shadow-xs"
            >
              {course.modules.map((module, i) => (
                <details key={module.title} className="group" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 transition-colors hover:bg-slate-50/80 dark:hover:bg-surface-hover">
                    <span className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-blue/10 dark:bg-blue-950/60 text-body-sm font-semibold text-primary-blue">
                        {i + 1}
                      </span>
                      <span className="font-semibold text-text-heading">{module.title}</span>
                    </span>
                    <ChevronDown className="h-5 w-5 text-text-body transition-transform group-open:rotate-180" />
                  </summary>
                  <ul className="space-y-2 px-5 pb-5 pl-15">
                    {module.topics.map((topic, topicIdx) => {
                      const isFirstDemoTopic = i === 0 && topicIdx === 0;

                      return (
                        <li
                          key={topic}
                          className="flex items-center justify-between gap-2 text-sm text-text-body py-1 rounded-lg px-2 transition-colors hover:bg-slate-100/60 dark:hover:bg-surface-hover"
                        >
                          <div className="flex items-center gap-2">
                            {isFirstDemoTopic ? (
                              <PlayCircle className="h-4 w-4 shrink-0 text-primary-blue" />
                            ) : (
                              <Lock className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                            )}
                            <span className={cn(isFirstDemoTopic && "font-semibold text-slate-900 dark:text-white")}>
                              {topic}
                            </span>
                          </div>

                          {isFirstDemoTopic ? (
                            <button
                              type="button"
                              onClick={() => setIsDemoModalOpen(true)}
                              className="inline-flex items-center gap-1 rounded-md bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 text-[11px] font-bold text-primary-blue hover:bg-blue-100 cursor-pointer"
                            >
                              <span>Free Demo</span>
                            </button>
                          ) : isEnrolled ? (
                            <Link
                              href={`/dashboard/my-courses/${course.slug}`}
                              className="text-[11px] font-semibold text-emerald-600 hover:underline dark:text-emerald-400"
                            >
                              Unlocked
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setLockedTopicPrompt(topic)}
                              className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 hover:text-[#2563EB] cursor-pointer"
                            >
                              <Lock className="h-3 w-3" />
                              <span>Enrolled Only</span>
                            </button>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </details>
              ))}
            </Reveal>
          </div>

          {/* What's included */}
          <div className="mt-12">
            <Reveal>
              <h2 className="text-h2 text-text-heading">What&apos;s included</h2>
            </Reveal>
            <Reveal
              as="ul"
              variant="stagger"
              staggerDelay={0.05}
              className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2"
            >
              {[
                "Lifetime access to course videos & updates",
                "Hands-on capstone project with code review",
                "Verified certificate on completion",
                "Assessments after every module",
                "Downloadable course brochure & source files",
                "Direct student community Q&A support",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-text-body">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-success" /> {item}
                </li>
              ))}
            </Reveal>

            {/* Real-time Student Reviews & Ratings */}
            <Reveal variant="fade-up" className="mt-12 space-y-5">
              <div className="flex flex-wrap items-center justify-between border-b border-border dark:border-slate-800 pb-4 gap-3">
                <div>
                  <h3 className="text-xl font-bold text-text-heading">Student Reviews & Rating</h3>
                  <p className="text-xs text-text-body mt-0.5">Authentic feedback from verified students</p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 font-black text-amber-500 text-lg">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span>{liveRating}</span>
                  </div>
                  <span className="text-xs text-text-muted">
                    ({liveRatingCount} {liveRatingCount === 1 ? "rating" : "ratings"})
                  </span>
                </div>
              </div>

              {/* Reviews distribution if ratings exist */}
              {reviewStats.totalRatings > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-border bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-surface-elevated/40">
                  <div className="flex flex-col items-center justify-center p-3 text-center border-b sm:border-b-0 sm:border-r border-border dark:border-slate-800">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">{reviewStats.averageRating}</span>
                    <div className="flex items-center gap-1 my-1.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.round(reviewStats.averageRating)
                              ? "fill-amber-400 text-amber-400"
                              : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-500 dark:text-slate-400">Average Course Rating</span>
                  </div>

                  <div className="space-y-1.5 py-1">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className="flex items-center gap-2 text-xs">
                        <span className="w-7 text-slate-600 dark:text-slate-400 font-medium">{star} ★</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full bg-amber-400 rounded-full"
                            style={{ width: `${reviewStats.percentages[star as 1 | 2 | 3 | 4 | 5] || 0}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[11px] text-slate-400">
                          {reviewStats.percentages[star as 1 | 2 | 3 | 4 | 5] || 0}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Student reviews list */}
              {reviewsList.length > 0 ? (
                <div className="space-y-3">
                  {reviewsList.slice(0, 5).map((rev) => (
                    <div
                      key={rev.id}
                      className="rounded-2xl border border-border bg-white p-4 space-y-2 dark:border-slate-800 dark:bg-surface-elevated shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-bold text-xs">
                            {rev.studentName.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-900 dark:text-white block">
                              {rev.studentName}
                            </span>
                            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              Verified Enrolled Student
                            </span>
                          </div>
                        </div>
                        <span className="text-[11px] text-slate-400">{rev.formattedDate}</span>
                      </div>

                      <div className="flex items-center gap-1 pt-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < rev.rating
                                ? "fill-amber-400 text-amber-400"
                                : "fill-slate-200 text-slate-200 dark:fill-slate-700 dark:text-slate-700"
                            }`}
                          />
                        ))}
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 ml-1.5">
                          {rev.title}
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed dark:text-slate-300">
                        {rev.reviewText}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-border p-6 text-center text-xs text-text-muted">
                  No written reviews yet. Enrolled students can rate and review this course from their learning dashboard.
                </div>
              )}
            </Reveal>
          </div>
        </div>

        {/* Sticky purchase card */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Reveal variant="scale-in" className="rounded-2xl border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary p-6 shadow-xl dark:shadow-slate-950/50">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white">
                &#8377;{course.price.toLocaleString("en-IN")}
              </span>
              <span className="text-sm font-semibold text-slate-400 line-through">
                &#8377;{Math.round(course.price * 1.5).toLocaleString("en-IN")}
              </span>
              <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                33% OFF
              </span>
            </div>

            {isEnrolled ? (
              <MagneticButton className="mt-5 block w-full">
                <Link
                  href={`/dashboard/my-courses/${course.slug}`}
                  className={cn(buttonVariants({ size: "lg" }), "w-full bg-emerald-600 hover:bg-emerald-700 font-bold")}
                >
                  Continue to Course
                </Link>
              </MagneticButton>
            ) : (
              <MagneticButton className="mt-5 block w-full">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(true)}
                  className={cn(buttonVariants({ size: "lg" }), "w-full bg-[#2563EB] hover:bg-blue-700 font-bold cursor-pointer")}
                >
                  Enroll Now
                </button>
              </MagneticButton>
            )}

            <button
              type="button"
              onClick={() => setIsDemoModalOpen(true)}
              className={cn(buttonVariants({ variant: "secondary", size: "md" }), "mt-3 w-full cursor-pointer")}
            >
              <PlayCircle className="h-4 w-4 text-[#2563EB]" /> Watch Free Demo
            </button>

            <ul className="mt-6 space-y-2.5 border-t border-border dark:border-slate-800 pt-6 text-sm text-text-body">
              <li className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-slate-400" />
                <span>{course.durationWeeks} weeks &middot; self-paced</span>
              </li>
              <li className="flex items-center gap-2">
                <Tv className="h-4 w-4 text-slate-400" />
                <span>{course.modules.length} modules &middot; {totalTopics} topics</span>
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-slate-400" />
                <span>JKS Verified Certificate on completion</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span>Instant access on enrollment</span>
              </li>
            </ul>
          </Reveal>
        </aside>
      </div>

      {/* FREE DEMO LESSON MODAL */}
      {isDemoModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-6 py-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                  <PlayCircle className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">{demoTitle}</h3>
                  <p className="text-xs text-cyan-400">Free Preview Lesson &middot; No sign-in required</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsDemoModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Video Player */}
            <div className="aspect-video w-full bg-black">
              <InAppVideoPlayer
                title={demoTitle}
                videoUrl={demoUrl}
                videoType="url"
                autoPlay={true}
                className="h-full w-full"
              />
            </div>

            {/* Footer Prompt */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-950/90 px-6 py-4 border-t border-slate-800">
              <p className="text-xs text-slate-300">
                Enjoyed the preview? Enroll now to unlock all {totalTopics} lectures, code repos, and certification.
              </p>
              {!isEnrolled && (
                <button
                  type="button"
                  onClick={() => {
                    setIsDemoModalOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#2563EB] px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-600 cursor-pointer"
                >
                  <span>Enroll for &#8377;{course.price.toLocaleString("en-IN")}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* LOCKED LESSON ENROLLMENT PROMPT MODAL */}
      {lockedTopicPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl text-center dark:border-slate-800 dark:bg-surface-secondary">
            <button
              type="button"
              onClick={() => setLockedTopicPrompt(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-500 border border-amber-200/60 dark:border-amber-800/40">
              <Lock className="h-7 w-7" />
            </div>

            <h3 className="mt-4 text-base font-extrabold text-slate-900 dark:text-white">
              Topic Locked
            </h3>
            <p className="mt-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
              &ldquo;{lockedTopicPrompt}&rdquo;
            </p>
            <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              To watch this full lesson and access remaining curriculum videos, interactive assignments, and verified certificates, please enroll in this course.
            </p>

            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setLockedTopicPrompt(null);
                  setIsCheckoutOpen(true);
                }}
                className="w-full rounded-xl bg-[#2563EB] hover:bg-blue-700 py-3 text-xs font-bold text-white shadow-md shadow-blue-500/20 cursor-pointer"
              >
                Enroll Now &middot; &#8377;{course.price.toLocaleString("en-IN")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setLockedTopicPrompt(null);
                  setIsDemoModalOpen(true);
                }}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
              >
                Watch Free Demo Instead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SECURE COURSE CHECKOUT MODAL */}
      <CourseCheckoutModal
        course={checkoutItem}
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onEnrollSuccess={() => {
          setIsCheckoutOpen(false);
        }}
      />
    </div>
  );
}
