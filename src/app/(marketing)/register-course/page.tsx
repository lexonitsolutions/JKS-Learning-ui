"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Calendar,
  Clock,
  Award,
  ShieldCheck,
  CreditCard,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  User,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Download,
  Printer,
  Tag,
  Check,
  Zap,
  Star,
  Users,
  Lock,
  X,
} from "lucide-react";
import { JksLogo } from "@/components/common/jks-logo";
import { registerCourseOnline, createInvoice, type Invoice } from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";


import { useAuth, useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";
import { fetchDbCourses } from "@/lib/data/courses";

const AVAILABLE_COURSES = [
  {
    id: "java-full-stack",
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Developer Mastery",
    subtitle: "Spring Boot 3, Distributed Microservices, React 19, Kafka & AWS Cloud",
    duration: "16 Weeks (Live Cohort)",
    nextBatch: "Starts Sept 5, 2026",
    seatsLeft: 4,
    price: 29999,
    discount: 3000,
    popular: true,
    curriculum: ["Core Java 21 & Concurrency", "Spring Boot 3 Microservices", "React 19 & Next.js", "Docker, Kafka, AWS"],
    batches: [
      { id: "b1", label: "Weekday Morning", time: "7:30 AM - 9:30 AM IST", days: "Mon - Fri" },
      { id: "b2", label: "Weekend Intensive", time: "10:00 AM - 2:00 PM IST", days: "Sat - Sun" },
      { id: "b3", label: "Weekday Evening", time: "7:00 PM - 9:00 PM IST", days: "Mon - Fri" },
    ],
  },
  {
    id: "modern-frontend",
    slug: "modern-frontend-engineering",
    title: "Modern Frontend Engineering (React 19 & Next.js)",
    subtitle: "React 19, Next.js App Router, Tailwind CSS, TypeScript & Three.js 3D WebGL",
    duration: "10 Weeks (Live Cohort)",
    nextBatch: "Starts Sept 8, 2026",
    seatsLeft: 6,
    price: 24999,
    discount: 2500,
    popular: false,
    curriculum: ["React 19 & Hooks", "Next.js App Router", "Tailwind & Three.js", "Performance Profiling"],
    batches: [
      { id: "b1", label: "Weekday Morning", time: "8:00 AM - 10:00 AM IST", days: "Mon - Fri" },
      { id: "b2", label: "Weekend Intensive", time: "10:00 AM - 2:00 PM IST", days: "Sat - Sun" },
    ],
  },
  {
    id: "sap-s4hana",
    slug: "sap-s4hana-enterprise-systems",
    title: "SAP S/4HANA Enterprise Systems",
    subtitle: "SAP S/4HANA FI/CO, MM, SD configuration, ABAP Cloud on BTP & Clean Core",
    duration: "12 Weeks (Live Sandboxes)",
    nextBatch: "Starts Sept 12, 2026",
    seatsLeft: 3,
    price: 34999,
    discount: 3500,
    popular: false,
    curriculum: ["S/4HANA Core Architecture", "Procure-to-Pay (MM) & FI/CO", "ABAP Cloud (RAP)", "BTP Clean Core Extensibility"],
    batches: [
      { id: "b1", label: "Weekend Intensive", time: "9:00 AM - 1:00 PM IST", days: "Sat - Sun" },
      { id: "b2", label: "Weekday Evening", time: "7:30 PM - 9:30 PM IST", days: "Mon - Fri" },
    ],
  },
  {
    id: "dotnet-microservices",
    slug: "dotnet-full-stack-developer",
    title: ".NET 9 Enterprise Microservices & Cloud",
    subtitle: "C# 13, ASP.NET Core Web API, Entity Framework Core 9, Azure & Blazor WebAssembly",
    duration: "14 Weeks (Live Cohort)",
    nextBatch: "Starts Sept 10, 2026",
    seatsLeft: 5,
    price: 27999,
    discount: 3000,
    popular: false,
    curriculum: ["C# 13 & .NET 9 Core", "ASP.NET Core Web APIs", "Entity Framework Core 9", "Azure Container Apps & CI/CD"],
    batches: [
      { id: "b1", label: "Weekday Morning", time: "7:30 AM - 9:30 AM IST", days: "Mon - Fri" },
      { id: "b2", label: "Weekend Intensive", time: "10:00 AM - 2:00 PM IST", days: "Sat - Sun" },
    ],
  },
];

function CourseRegistrationContent() {
  const searchParams = useSearchParams();
  const preSelectedSlug = searchParams?.get("course");

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Authentication State
  const { isSignedIn, isLoaded: isAuthLoaded } = useAuth();
  const { user: clerkUser } = useUser();
  const session = useMockSession();

  const isUserAuthenticated = (isAuthLoaded && !!isSignedIn) || !!session;
  const authenticatedEmail =
    clerkUser?.primaryEmailAddress?.emailAddress || session?.email || "";
  const authenticatedName =
    clerkUser?.fullName ||
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") ||
    session?.name ||
    "";

  // Form State
  const initialCourse =
    AVAILABLE_COURSES.find((c) => c.slug === preSelectedSlug) || AVAILABLE_COURSES[0];
  const [coursesList, setCoursesList] = useState(AVAILABLE_COURSES);
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [selectedBatch, setSelectedBatch] = useState(initialCourse.batches[0]);

  React.useEffect(() => {
    fetchDbCourses().then((dbCourses) => {
      if (Array.isArray(dbCourses)) {
        const liveSlugs = new Set(dbCourses.map((c) => c.slug));
        const filtered = AVAILABLE_COURSES.filter((c) => liveSlugs.has(c.slug));
        if (filtered.length > 0) {
          setCoursesList(filtered);
          if (!liveSlugs.has(selectedCourse.slug)) {
            setSelectedCourse(filtered[0]);
            setSelectedBatch(filtered[0].batches[0]);
          }
        }
      }
    });
  }, []);

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Hyderabad, Telangana",
    qualification: "B.Tech / MCA",
    experience: "Fresher (2025/2026 Batch)",
    linkedin: "",
  });

  const [showAuthGateModal, setShowAuthGateModal] = useState(false);

  // Auto-prefill authenticated user's email and name
  React.useEffect(() => {
    if (authenticatedEmail || authenticatedName) {
      setStudentInfo((prev) => ({
        ...prev,
        email: authenticatedEmail || prev.email,
        name: prev.name || authenticatedName,
      }));
    }
  }, [authenticatedEmail, authenticatedName]);

  // Coupon state
  const [couponCode, setCouponCode] = useState("ADMISSION10");
  const [couponApplied, setCouponApplied] = useState(true);

  const [paymentMode, setPaymentMode] = useState<Invoice["paymentMode"]>("UPI");
  const [isProcessing, setIsProcessing] = useState(false);
  const [generatedInvoice, setGeneratedInvoice] = useState<Invoice | null>(null);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // Recalculate discount
  const finalDiscount = couponApplied ? selectedCourse.discount : 0;
  const netPayable = Math.max(0, selectedCourse.price - finalDiscount);
  const taxableAmount = +(netPayable / 1.18).toFixed(2);
  const totalTax = +(netPayable - taxableAmount).toFixed(2);
  const cgst = +(totalTax / 2).toFixed(2);
  const sgst = +(totalTax / 2).toFixed(2);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      couponCode.toUpperCase() === "ADMISSION10" ||
      couponCode.toUpperCase() === "EARLYBIRD" ||
      couponCode.toUpperCase() === "JKS10"
    ) {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try ADMISSION10 for instant discount.");
    }
  };

  const handleStep1Continue = () => {
    if (!isUserAuthenticated) {
      setShowAuthGateModal(true);
      return;
    }
    setStep(2);
  };

  const handleSubmitEnrollment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isUserAuthenticated) {
      setShowAuthGateModal(true);
      return;
    }
    setIsProcessing(true);

    try {
      const invoice = await registerCourseOnline({
        studentName: studentInfo.name,
        studentEmail: studentInfo.email || authenticatedEmail,
        studentPhone: studentInfo.phone,
        studentCity: studentInfo.city,
        courseTitle: selectedCourse.title,
        courseSlug: selectedCourse.slug,
        price: selectedCourse.price,
        discount: finalDiscount,
        discountCode: couponApplied ? couponCode.toUpperCase() : undefined,
        paymentMode,
        batchTiming: `${selectedBatch.label} (${selectedBatch.time})`,
      });

      setGeneratedInvoice(invoice);
      setShowInvoiceModal(true);
      setStep(4);
    } catch (err) {
      console.error("Enrollment failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };


  return (
    <div className="min-h-screen bg-bg-light dark:bg-background text-text-heading dark:text-white py-12 px-4 sm:px-6 lg:px-16 font-sans transition-colors duration-300">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/80 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue dark:text-blue-400">
            <Sparkles className="h-3.5 w-3.5 text-primary-blue dark:text-blue-400" /> Fast-Track Online Admissions &amp; GST Invoicing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-heading dark:text-white tracking-tight">
            Enroll in Career Accelerator
          </h1>
          <p className="text-sm text-text-body dark:text-slate-300 max-w-xl mx-auto leading-relaxed">
            Select your specialized track, choose live cohort timings, apply instant scholarship discount &amp; generate official 18% GST tax invoice.
          </p>
        </div>

        {/* Stepper Progress Bar */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { num: 1, title: "Career Track & Cohort", subtitle: "Select specialization" },
            { num: 2, title: "Student Dossier", subtitle: "Credentials & Contact" },
            { num: 3, title: "GST Billing & Tax Invoice", subtitle: "Payment & Tax Receipt" },
          ].map((s) => (
            <div
              key={s.num}
              className={`relative rounded-2xl border p-4 transition-all ${
                step === s.num
                  ? "border-primary-blue bg-white dark:bg-surface-secondary text-primary-blue dark:text-blue-400 shadow-lg shadow-primary-blue/10 ring-2 ring-primary-blue/20 font-bold"
                  : step > s.num
                  ? "border-emerald-500/40 dark:border-emerald-800/40 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300"
                  : "border-border dark:border-slate-800 bg-white/70 dark:bg-surface-secondary/70 text-text-body/60 dark:text-slate-400"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono ${
                    step > s.num
                      ? "bg-emerald-600 text-white"
                      : step === s.num
                      ? "bg-primary-fill text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {step > s.num ? <Check className="h-3.5 w-3.5" /> : `0${s.num}`}
                </span>
                <span className="font-bold hidden sm:inline">{s.title}</span>
              </div>
              <div className="text-[11px] text-text-body/70 dark:text-slate-400 mt-1 hidden sm:block">{s.subtitle}</div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* STEP 1: SELECT CAREER TRACK & LIVE BATCH                  */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="space-y-6 rounded-[28px] border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading dark:text-white">1. Select Your Engineering Track</h2>
                <p className="text-xs text-text-body dark:text-slate-300">All programs include live faculty mentorship, enterprise capstones &amp; AI interview preparation.</p>
              </div>
              <span className="text-xs text-primary-blue dark:text-blue-400 font-bold">Step 1 of 3</span>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {coursesList.map((course) => {
                const isSelected = selectedCourse.id === course.id;

                return (
                  <div
                    key={course.id}
                    onClick={() => {
                      setSelectedCourse(course);
                      setSelectedBatch(course.batches[0]);
                    }}
                    className={`group relative rounded-2xl border p-5 transition-all cursor-pointer space-y-3.5 ${
                      isSelected
                        ? "border-primary-blue dark:border-blue-500/80 bg-blue-50/50 dark:bg-blue-950/20 shadow-md ring-2 ring-primary-blue/20 dark:ring-blue-500/30"
                        : "border-border dark:border-slate-800 bg-white dark:bg-surface-elevated hover:border-primary-blue/40 dark:hover:border-blue-500/50 hover:shadow-sm"
                    }`}
                  >
                    {course.popular && (
                      <span className="absolute top-4 right-4 rounded-full bg-primary-fill px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                        ★ Most Enrolled
                      </span>
                    )}

                    <div className="pr-16">
                      <h3 className="font-bold text-base text-text-heading dark:text-white group-hover:text-primary-blue dark:group-hover:text-blue-400 transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-text-body dark:text-slate-300 leading-relaxed line-clamp-2">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Key Modules Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.curriculum.map((c, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-0.5 text-[10px] text-slate-700 dark:text-slate-300 font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
                      <div>
                        <span className="text-text-body dark:text-slate-300 font-medium">{course.duration}</span>
                        <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {course.nextBatch}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-extrabold text-lg text-primary-blue dark:text-blue-400">
                          ₹{(course.price - course.discount).toLocaleString("en-IN")}
                        </div>
                        <span className="text-[10px] text-slate-400 line-through">
                          ₹{course.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Batch Schedule Selector */}
            <div className="rounded-2xl border border-blue-100 dark:border-slate-800 bg-blue-50/30 dark:bg-surface-elevated/60 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-heading dark:text-white flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-blue dark:text-blue-400" /> Select Preferred Batch Timing for {selectedCourse.title}:
                </label>
                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800">
                  🟢 {selectedCourse.seatsLeft} Seats Left in Next Cohort
                </span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 text-xs">
                {selectedCourse.batches.map((batch) => {
                  const isSelected = selectedBatch.id === batch.id;

                  return (
                    <button
                      key={batch.id}
                      type="button"
                      onClick={() => setSelectedBatch(batch)}
                      className={`rounded-xl border p-3.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary-blue dark:border-blue-500 bg-white dark:bg-surface-secondary text-primary-blue dark:text-blue-400 font-bold shadow-sm ring-1 ring-primary-blue/30"
                          : "border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-text-body dark:text-slate-300 hover:border-primary-blue/40"
                      }`}
                    >
                      <div className="text-xs font-bold text-primary-blue dark:text-blue-400">{batch.label}</div>
                      <div className="text-xs text-text-heading dark:text-white mt-1 font-mono font-semibold">{batch.time}</div>
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{batch.days}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Unauthenticated User Callout Banner */}
            {!isUserAuthenticated && (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 dark:text-amber-200">Sign in required to complete enrollment</h4>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                      You must be signed in with your student account so LMS credentials, course lectures, and tax invoices can be linked to your dashboard.
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Link
                    href={`/login?from=${encodeURIComponent(`/register-course?course=${selectedCourse.slug}`)}`}
                    className="flex-1 sm:flex-none text-center rounded-xl bg-amber-900 dark:bg-amber-800 px-4 py-2 text-xs font-bold text-white hover:bg-amber-950 transition-colors"
                  >
                    Log In →
                  </Link>
                  <Link
                    href={`/register?from=${encodeURIComponent(`/register-course?course=${selectedCourse.slug}`)}`}
                    className="flex-1 sm:flex-none text-center rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-surface-secondary px-4 py-2 text-xs font-bold text-amber-900 dark:text-amber-200 hover:bg-amber-100 dark:hover:bg-surface-elevated transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleStep1Continue}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-fill px-6 sm:px-7 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 2: STUDENT DETAILS FORM                              */}
        {/* ======================================================== */}
        {step === 2 && (
          <div className="space-y-6 rounded-[28px] border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-black/40">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading dark:text-white">2. Student Academic &amp; Contact Dossier</h2>
                <p className="text-xs text-text-body dark:text-slate-300">Required for LMS portal login credentials, verified certification &amp; tax invoice generation.</p>
              </div>
              <span className="text-xs text-primary-blue dark:text-blue-400 font-bold">Step 2 of 3</span>
            </div>

            {!isUserAuthenticated ? (
              <div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/80 dark:bg-amber-950/30 p-6 text-center space-y-4">
                <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">Sign in to fill your Student Dossier</h3>
                  <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 max-w-md mx-auto">
                    Please log in or create an account to automatically link your LMS access and certificate records.
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <Link
                    href={`/login?from=${encodeURIComponent(`/register-course?course=${selectedCourse.slug}`)}`}
                    className="rounded-xl bg-primary-fill px-5 py-2.5 text-xs font-bold text-white hover:bg-blue-600 transition-colors"
                  >
                    Log In Now →
                  </Link>
                  <Link
                    href={`/register?from=${encodeURIComponent(`/register-course?course=${selectedCourse.slug}`)}`}
                    className="rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-surface-elevated px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
                  >
                    Create Account
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Full Legal Name (as on Govt ID / Certificate) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Varma"
                    value={studentInfo.name}
                    onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg p-3 text-text-heading dark:text-white outline-none focus:bg-white dark:focus:bg-input-bg focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">WhatsApp / Mobile Number (for batch alerts) *</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={studentInfo.phone}
                    onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg p-3 text-text-heading dark:text-white outline-none focus:bg-white dark:focus:bg-input-bg focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Email Address (for LMS credentials) *</label>
                  <input
                    type="email"
                    required
                    placeholder="ramesh.varma@gmail.com"
                    value={studentInfo.email}
                    onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg p-3 text-text-heading dark:text-white outline-none focus:bg-white dark:focus:bg-input-bg focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                  />
                  {isUserAuthenticated && (
                    <div className="flex items-center gap-1.5 mt-1.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/80 dark:border-emerald-800/80 px-3 py-1.5 rounded-lg">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span>
                        Verified account email ({authenticatedEmail || studentInfo.email}) &mdash; LMS credentials and enrolled courses will be directly linked to your student dashboard.
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">City / State (for Tax Invoice Address) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hyderabad, Telangana"
                    value={studentInfo.city}
                    onChange={(e) => setStudentInfo({ ...studentInfo, city: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg p-3 text-text-heading dark:text-white outline-none focus:bg-white dark:focus:bg-input-bg focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Highest Academic Qualification</label>
                  <select
                    value={studentInfo.qualification}
                    onChange={(e) => setStudentInfo({ ...studentInfo, qualification: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg p-3 text-text-heading dark:text-white outline-none focus:bg-white dark:focus:bg-input-bg focus:border-primary-blue"
                  >
                    <option className="dark:bg-surface-secondary">B.Tech / B.E (CSE / IT / ECE)</option>
                    <option className="dark:bg-surface-secondary">MCA / M.Tech</option>
                    <option className="dark:bg-surface-secondary">BCA / B.Sc Computer Science</option>
                    <option className="dark:bg-surface-secondary">Non-IT Graduate / Diploma</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-slate-700 dark:text-slate-300">Current Experience Level</label>
                  <select
                    value={studentInfo.experience}
                    onChange={(e) => setStudentInfo({ ...studentInfo, experience: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-slate-200 dark:border-slate-700/80 bg-slate-50/70 dark:bg-input-bg p-3 text-text-heading dark:text-white outline-none focus:bg-white dark:focus:bg-input-bg focus:border-primary-blue"
                  >
                    <option className="dark:bg-surface-secondary">Fresher (2025/2026 Batch Graduate)</option>
                    <option className="dark:bg-surface-secondary">0-2 Years IT Experience</option>
                    <option className="dark:bg-surface-secondary">2-5 Years IT Experience (Career Upgrade)</option>
                    <option className="dark:bg-surface-secondary">Non-IT Working Professional (Career Switch)</option>
                  </select>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(1)}
                aria-label="Go back to courses"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3.5 sm:px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="button"
                disabled={!isUserAuthenticated || !studentInfo.name || !studentInfo.phone || !studentInfo.email}
                onClick={() => setStep(3)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-fill px-5 sm:px-7 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all disabled:opacity-40 cursor-pointer"
              >
                <span>Continue to Billing</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>

          </div>
        )}

        {/* ======================================================== */}
        {/* STEP 3: BILLING, INVOICE BREAKDOWN & PAYMENT MODE        */}
        {/* ======================================================== */}
        {step === 3 && (
          <form
            onSubmit={handleSubmitEnrollment}
            className="space-y-6 rounded-[28px] border border-border dark:border-slate-800/80 bg-white dark:bg-surface-secondary p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-black/40"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border dark:border-slate-800/80 pb-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading dark:text-white">3. GST Tax Invoice &amp; Payment Summary</h2>
                <p className="text-xs text-text-body dark:text-slate-300">Includes 18% GST (CGST 9% + SGST 9%) with instant downloadable digital tax invoice receipt.</p>
              </div>
              <span className="text-xs text-primary-blue dark:text-blue-400 font-bold">Step 3 of 3</span>
            </div>

            {/* Selected Summary Badge Card */}
            <div className="rounded-2xl border border-blue-200 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-text-heading dark:text-white">{selectedCourse.title}</span>
                <span className="font-mono font-extrabold text-base text-primary-blue dark:text-blue-400">
                  ₹{netPayable.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-slate-600 dark:text-slate-300">
                Live Cohort: <span className="text-primary-blue dark:text-blue-400 font-semibold">{selectedBatch.label} ({selectedBatch.time})</span>
              </div>
              <div className="text-slate-500 dark:text-slate-400">
                Enrolling Student: <span className="text-text-heading dark:text-white font-semibold">{studentInfo.name}</span> ({studentInfo.phone} • {studentInfo.email})
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-surface-elevated/80 p-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary-blue dark:text-blue-400" /> Apply Scholarship / Admission Coupon:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon (e.g. ADMISSION10)"
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg p-2.5 text-xs text-text-heading dark:text-white uppercase font-mono outline-none focus:border-primary-blue"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-xl bg-primary-fill px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex flex-wrap items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Coupon <span className="font-mono uppercase font-bold">{couponCode}</span> applied!</span>
                  <span className="text-emerald-700 dark:text-emerald-300 font-medium">(₹{finalDiscount.toLocaleString("en-IN")} Scholarship Discount)</span>
                </div>
              )}
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Payment Method:</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                {(["UPI", "Credit/Debit Card", "Net Banking", "No-Cost EMI"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`rounded-xl border p-3.5 text-center transition-all cursor-pointer ${
                      paymentMode === mode
                        ? "border-primary-blue dark:border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-primary-blue dark:text-blue-400 font-bold shadow-xs ring-1 ring-primary-blue/30"
                        : "border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated text-text-body dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mx-auto mb-1 text-primary-blue dark:text-blue-400" />
                    <div>{mode}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full 18% GST Invoice Computation Breakdown */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/90 dark:bg-surface-elevated p-5 space-y-2.5 text-xs">
              <div className="font-bold text-slate-500 dark:text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-200 dark:border-slate-800 pb-2">
                Official Tax Invoice Itemization
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Course Standard Tuition Fee:</span>
                <span className="font-mono font-medium">₹{selectedCourse.price.toLocaleString("en-IN")}</span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Scholarship Deduction ({couponCode || "PROMO"}):</span>
                  <span className="font-mono">- ₹{finalDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span>Taxable Value (Excluding Tax):</span>
                <span className="font-mono">₹{taxableAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>Central GST (CGST 9%):</span>
                <span className="font-mono">₹{cgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500 dark:text-slate-400 text-[11px]">
                <span>State GST (SGST 9%):</span>
                <span className="font-mono">₹{sgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 dark:border-slate-700 pt-2.5 font-extrabold text-sm text-text-heading dark:text-white">
                <span>Total Net Investment (Incl. 18% GST):</span>
                <span className="font-mono text-primary-blue dark:text-blue-400 text-base">₹{netPayable.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setStep(2)}
                aria-label="Go back to previous step"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated px-3.5 sm:px-5 py-2.5 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-fill px-5 sm:px-8 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
              >
                <span>{isProcessing ? "Processing..." : "Complete Enrollment"}</span>
                <ArrowRight className="h-4 w-4 shrink-0" />
              </button>
            </div>

          </form>
        )}

        {/* ======================================================== */}
        {/* STEP 4: ENROLLMENT CONFIRMATION & INVOICE RECEIPT         */}
        {/* ======================================================== */}
        {step === 4 && generatedInvoice && (
          <div className="space-y-6 rounded-[28px] border border-emerald-200 dark:border-emerald-800/80 bg-white dark:bg-surface-secondary p-8 sm:p-12 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)] dark:shadow-black/40">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 shadow-md ring-2 ring-emerald-200 dark:ring-emerald-800">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-heading dark:text-white">Admission &amp; Tax Invoice Generated! 🎉</h2>
              <p className="text-xs sm:text-sm text-text-body dark:text-slate-300">
                Welcome to JKS Learning, <span className="font-bold text-emerald-600 dark:text-emerald-400">{studentInfo.name}</span>! Your enrollment in <span className="text-text-heading dark:text-white font-bold">{selectedCourse.title}</span> has been confirmed.
              </p>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                Tax Invoice ID: <span className="text-primary-blue dark:text-blue-400 font-bold">{generatedInvoice.invoiceNumber}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-2 rounded-xl bg-primary-fill px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" /> View &amp; Print Official Tax Invoice PDF
              </button>

              <Link
                href="/dashboard/my-courses"
                className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-surface-elevated px-6 py-3.5 text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-surface-hover transition-all"
              >
                Launch Student Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Auth Gate Modal for Unauthenticated Users */}
        {showAuthGateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-md rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-surface-secondary p-6 sm:p-8 text-center shadow-2xl space-y-5">
              <button
                type="button"
                onClick={() => setShowAuthGateModal(false)}
                className="absolute top-4 right-4 rounded-full p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-surface-hover hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex h-16 w-16 mx-auto items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-primary-blue dark:text-blue-400 shadow-inner ring-4 ring-blue-50 dark:ring-blue-950/40">
                <Lock className="h-8 w-8 text-primary-blue dark:text-blue-400" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Sign in to Enroll</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed max-w-xs mx-auto">
                  To enroll in <strong className="text-slate-900 dark:text-white">{selectedCourse.title}</strong> and receive live cohort LMS access, please sign in to your student account.
                </p>
              </div>

              <div className="rounded-xl bg-slate-50 dark:bg-surface-elevated border border-slate-100 dark:border-slate-800 p-3 text-left space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Automatic LMS portal access provisioning</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Official GST Tax Invoice mapped to your profile</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Direct live faculty mentorship link</span>
                </div>
              </div>

              <div className="flex flex-col gap-2.5 pt-1">
                <Link
                  href={`/login?from=${encodeURIComponent(`/register-course?course=${selectedCourse.slug}`)}`}
                  className="flex items-center justify-center gap-2 rounded-xl bg-primary-fill py-3 px-4 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all"
                >
                  <span>Log In to Continue</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href={`/register?from=${encodeURIComponent(`/register-course?course=${selectedCourse.slug}`)}`}
                  className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-elevated py-3 px-4 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-surface-hover transition-colors"
                >
                  Create Free Student Account
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Printable Tax Invoice Modal */}
        <InvoiceModal
          invoice={showInvoiceModal ? generatedInvoice : null}
          onClose={() => setShowInvoiceModal(false)}
        />
      </div>

    </div>
  );
}

export default function CourseRegistrationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-bg-light flex items-center justify-center text-text-heading">
          <div className="flex items-center gap-2 text-xs font-semibold text-primary-blue">
            <span className="h-2 w-2 rounded-full bg-primary-fill animate-ping" />
            Loading Official Registration Portal...
          </div>
        </div>
      }
    >
      <CourseRegistrationContent />
    </Suspense>
  );
}
