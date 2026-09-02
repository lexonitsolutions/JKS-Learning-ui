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
} from "lucide-react";
import { JksLogo } from "@/components/common/jks-logo";
import { createInvoice, type Invoice } from "@/lib/data/invoices-store";
import { InvoiceModal } from "@/components/common/invoice-modal";

const AVAILABLE_COURSES = [
  {
    id: "java-full-stack",
    slug: "java-full-stack-mastery",
    title: "Java Full Stack Developer Mastery",
    subtitle: "Spring Boot 3, Distributed Microservices, React 19, Kafka & AWS Cloud",
    duration: "24 Weeks (Live Cohort)",
    nextBatch: "Starts Sept 5, 2026",
    seatsLeft: 4,
    price: 45000,
    discount: 5000,
    popular: true,
    curriculum: ["Core Java 21 & OOP", "Spring Boot 3 Microservices", "React 19 & Next.js", "Docker, Kafka, AWS"],
    batches: [
      { id: "b1", label: "Weekday Morning", time: "7:30 AM - 9:30 AM IST", days: "Mon - Fri" },
      { id: "b2", label: "Weekend Intensive", time: "10:00 AM - 2:00 PM IST", days: "Sat - Sun" },
      { id: "b3", label: "Weekday Evening", time: "7:00 PM - 9:00 PM IST", days: "Mon - Fri" },
    ],
  },
  {
    id: "modern-frontend",
    slug: "modern-frontend-engineering",
    title: "Modern Frontend Engineering",
    subtitle: "React 19, Next.js 15, TypeScript, Web Performance & Micro-Frontends",
    duration: "16 Weeks (Live Cohort)",
    nextBatch: "Starts Sept 8, 2026",
    seatsLeft: 6,
    price: 35000,
    discount: 3500,
    popular: false,
    curriculum: ["React 19 & Hooks", "Next.js 15 App Router", "Tailwind & Framer Motion", "Performance Profiling"],
    batches: [
      { id: "b1", label: "Weekday Morning", time: "8:00 AM - 10:00 AM IST", days: "Mon - Fri" },
      { id: "b2", label: "Weekend Intensive", time: "10:00 AM - 2:00 PM IST", days: "Sat - Sun" },
    ],
  },
  {
    id: "sap-s4hana",
    slug: "sap-s4hana-enterprise",
    title: "SAP S/4HANA Enterprise Systems",
    subtitle: "SAP ABAP Cloud, CDS Views, Fiori Elements & S/4HANA Integrations",
    duration: "20 Weeks (Live Sandboxes)",
    nextBatch: "Starts Sept 12, 2026",
    seatsLeft: 3,
    price: 65000,
    discount: 7500,
    popular: false,
    curriculum: ["ABAP Cloud Syntax", "Core Data Services (CDS)", "Fiori & OData v4", "BADI & Enhancement Framework"],
    batches: [
      { id: "b1", label: "Weekend Intensive", time: "9:00 AM - 1:00 PM IST", days: "Sat - Sun" },
      { id: "b2", label: "Weekday Evening", time: "7:30 PM - 9:30 PM IST", days: "Mon - Fri" },
    ],
  },
  {
    id: "dotnet-microservices",
    slug: "dotnet-full-stack-developer",
    title: ".NET 9 Enterprise Microservices & Cloud",
    subtitle: "C# 13, ASP.NET Core, Clean Architecture, Entity Framework & Azure",
    duration: "20 Weeks (Live Cohort)",
    nextBatch: "Starts Sept 10, 2026",
    seatsLeft: 5,
    price: 45000,
    discount: 5000,
    popular: false,
    curriculum: ["C# 13 & .NET 9 Core", "Clean Architecture", "Microservices & MediatR", "Azure Container Apps"],
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

  // Form State
  const initialCourse =
    AVAILABLE_COURSES.find((c) => c.slug === preSelectedSlug) || AVAILABLE_COURSES[0];
  const [selectedCourse, setSelectedCourse] = useState(initialCourse);
  const [selectedBatch, setSelectedBatch] = useState(initialCourse.batches[0]);

  const [studentInfo, setStudentInfo] = useState({
    name: "",
    email: "",
    phone: "",
    city: "Hyderabad, Telangana",
    qualification: "B.Tech / MCA",
    experience: "Fresher (2025/2026 Batch)",
    linkedin: "",
  });

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
    if (couponCode.toUpperCase() === "ADMISSION10" || couponCode.toUpperCase() === "EARLYBIRD" || couponCode.toUpperCase() === "JKS10") {
      setCouponApplied(true);
    } else {
      alert("Invalid coupon code. Try ADMISSION10 for instant discount.");
    }
  };

  const handleSubmitEnrollment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      const invoice = createInvoice({
        studentName: studentInfo.name,
        studentEmail: studentInfo.email,
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
      setIsProcessing(false);
      setStep(4);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-bg-light text-text-heading py-12 px-4 sm:px-6 lg:px-16 font-sans">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Page Hero Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 border border-blue-200 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-primary-blue">
            <Sparkles className="h-3.5 w-3.5 text-primary-blue" /> Fast-Track Online Admissions &amp; GST Invoicing
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-text-heading tracking-tight">
            Enroll in Career Accelerator
          </h1>
          <p className="text-sm text-text-body max-w-xl mx-auto leading-relaxed">
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
                  ? "border-primary-blue bg-white text-primary-blue shadow-lg shadow-primary-blue/10 ring-2 ring-primary-blue/20 font-bold"
                  : step > s.num
                  ? "border-emerald-500/40 bg-emerald-50 text-emerald-800"
                  : "border-border bg-white/70 text-text-body/60"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold font-mono ${
                    step > s.num
                      ? "bg-emerald-600 text-white"
                      : step === s.num
                      ? "bg-primary-blue text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {step > s.num ? <Check className="h-3.5 w-3.5" /> : `0${s.num}`}
                </span>
                <span className="font-bold hidden sm:inline">{s.title}</span>
              </div>
              <div className="text-[11px] text-text-body/70 mt-1 hidden sm:block">{s.subtitle}</div>
            </div>
          ))}
        </div>

        {/* ======================================================== */}
        {/* STEP 1: SELECT CAREER TRACK & LIVE BATCH                  */}
        {/* ======================================================== */}
        {step === 1 && (
          <div className="space-y-6 rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading">1. Select Your Engineering Track</h2>
                <p className="text-xs text-text-body">All programs include live faculty mentorship, enterprise capstones &amp; AI interview preparation.</p>
              </div>
              <span className="text-xs text-primary-blue font-bold">Step 1 of 3</span>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {AVAILABLE_COURSES.map((course) => {
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
                        ? "border-primary-blue bg-blue-50/50 shadow-md ring-2 ring-primary-blue/20"
                        : "border-border bg-white hover:border-primary-blue/40 hover:shadow-sm"
                    }`}
                  >
                    {course.popular && (
                      <span className="absolute top-4 right-4 rounded-full bg-primary-blue px-3 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider shadow-xs">
                        ★ Most Enrolled
                      </span>
                    )}

                    <div className="pr-16">
                      <h3 className="font-bold text-base text-text-heading group-hover:text-primary-blue transition-colors">
                        {course.title}
                      </h3>
                      <p className="mt-1 text-xs text-text-body leading-relaxed line-clamp-2">
                        {course.subtitle}
                      </p>
                    </div>

                    {/* Key Modules Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {course.curriculum.map((c, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    {/* Footer Row */}
                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                      <div>
                        <span className="text-text-body font-medium">{course.duration}</span>
                        <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-0.5">
                          <Clock className="h-3 w-3" /> {course.nextBatch}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-mono font-extrabold text-lg text-primary-blue">
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
            <div className="rounded-2xl border border-blue-100 bg-blue-50/30 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-text-heading flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary-blue" /> Select Preferred Batch Timing for {selectedCourse.title}:
                </label>
                <span className="rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5">
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
                          ? "border-primary-blue bg-white text-primary-blue font-bold shadow-sm ring-1 ring-primary-blue/30"
                          : "border-slate-200 bg-white text-text-body hover:border-primary-blue/40"
                      }`}
                    >
                      <div className="text-xs font-bold text-primary-blue">{batch.label}</div>
                      <div className="text-xs text-text-heading mt-1 font-mono font-semibold">{batch.time}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{batch.days}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-blue px-6 sm:px-7 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer"
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
          <div className="space-y-6 rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading">2. Student Academic &amp; Contact Dossier</h2>
                <p className="text-xs text-text-body">Required for LMS portal login credentials, verified certification &amp; tax invoice generation.</p>
              </div>
              <span className="text-xs text-primary-blue font-bold">Step 2 of 3</span>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
              <div>
                <label className="font-bold text-slate-700">Full Legal Name (as on Govt ID / Certificate) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Varma"
                  value={studentInfo.name}
                  onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-text-heading outline-none focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">WhatsApp / Mobile Number (for batch alerts) *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={studentInfo.phone}
                  onChange={(e) => setStudentInfo({ ...studentInfo, phone: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-text-heading outline-none focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20 font-mono"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Email Address (for LMS credentials) *</label>
                <input
                  type="email"
                  required
                  placeholder="ramesh.varma@gmail.com"
                  value={studentInfo.email}
                  onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-text-heading outline-none focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">City / State (for Tax Invoice Address) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hyderabad, Telangana"
                  value={studentInfo.city}
                  onChange={(e) => setStudentInfo({ ...studentInfo, city: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-text-heading outline-none focus:bg-white focus:border-primary-blue focus:ring-2 focus:ring-primary-blue/20"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700">Highest Academic Qualification</label>
                <select
                  value={studentInfo.qualification}
                  onChange={(e) => setStudentInfo({ ...studentInfo, qualification: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-text-heading outline-none focus:bg-white focus:border-primary-blue"
                >
                  <option>B.Tech / B.E (CSE / IT / ECE)</option>
                  <option>MCA / M.Tech</option>
                  <option>BCA / B.Sc Computer Science</option>
                  <option>Non-IT Graduate / Diploma</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700">Current Experience Level</label>
                <select
                  value={studentInfo.experience}
                  onChange={(e) => setStudentInfo({ ...studentInfo, experience: e.target.value })}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-text-heading outline-none focus:bg-white focus:border-primary-blue"
                >
                  <option>Fresher (2025/2026 Batch Graduate)</option>
                  <option>0-2 Years IT Experience</option>
                  <option>2-5 Years IT Experience (Career Upgrade)</option>
                  <option>Non-IT Working Professional (Career Switch)</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(1)}
                aria-label="Go back to courses"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 sm:px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="button"
                disabled={!studentInfo.name || !studentInfo.phone || !studentInfo.email}
                onClick={() => setStep(3)}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-blue px-5 sm:px-7 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all disabled:opacity-40 cursor-pointer"
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
            className="space-y-6 rounded-[28px] border border-border bg-white p-6 sm:p-10 shadow-[0_12px_40px_rgba(15,23,42,0.06)]"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div>
                <h2 className="text-xl font-bold text-text-heading">3. GST Tax Invoice &amp; Payment Summary</h2>
                <p className="text-xs text-text-body">Includes 18% GST (CGST 9% + SGST 9%) with instant downloadable digital tax invoice receipt.</p>
              </div>
              <span className="text-xs text-primary-blue font-bold">Step 3 of 3</span>
            </div>

            {/* Selected Summary Badge Card */}
            <div className="rounded-2xl border border-blue-200 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 p-5 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-text-heading">{selectedCourse.title}</span>
                <span className="font-mono font-extrabold text-base text-primary-blue">
                  ₹{netPayable.toLocaleString("en-IN")}
                </span>
              </div>
              <div className="text-slate-600">
                Live Cohort: <span className="text-primary-blue font-semibold">{selectedBatch.label} ({selectedBatch.time})</span>
              </div>
              <div className="text-slate-500">
                Enrolling Student: <span className="text-text-heading font-semibold">{studentInfo.name}</span> ({studentInfo.phone} • {studentInfo.email})
              </div>
            </div>

            {/* Coupon Code Input */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/60 p-4 space-y-2">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Tag className="h-3.5 w-3.5 text-primary-blue" /> Apply Scholarship / Admission Coupon:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter coupon (e.g. ADMISSION10)"
                  className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-xs text-text-heading uppercase font-mono outline-none focus:border-primary-blue"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="rounded-xl bg-primary-blue px-4 py-2 text-xs font-bold text-white hover:bg-blue-600 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <div className="text-[11px] text-emerald-600 font-semibold flex flex-wrap items-center gap-1.5 pt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                  <span>Coupon <span className="font-mono uppercase font-bold">{couponCode}</span> applied!</span>
                  <span className="text-emerald-700 font-medium">(₹{finalDiscount.toLocaleString("en-IN")} Scholarship Discount)</span>
                </div>
              )}

            </div>

            {/* Payment Method Selector */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700">Select Payment Method:</label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
                {(["UPI", "Credit/Debit Card", "Net Banking", "No-Cost EMI"] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setPaymentMode(mode)}
                    className={`rounded-xl border p-3.5 text-center transition-all cursor-pointer ${
                      paymentMode === mode
                        ? "border-primary-blue bg-blue-50 text-primary-blue font-bold shadow-xs ring-1 ring-primary-blue/30"
                        : "border-slate-200 bg-white text-text-body hover:border-slate-300"
                    }`}
                  >
                    <CreditCard className="h-4 w-4 mx-auto mb-1 text-primary-blue" />
                    <div>{mode}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Full 18% GST Invoice Computation Breakdown */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5 space-y-2.5 text-xs">
              <div className="font-bold text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200 pb-2">
                Official Tax Invoice Itemization
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Course Standard Tuition Fee:</span>
                <span className="font-mono font-medium">₹{selectedCourse.price.toLocaleString("en-IN")}</span>
              </div>
              {finalDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Scholarship Deduction ({couponCode || "PROMO"}):</span>
                  <span className="font-mono">- ₹{finalDiscount.toLocaleString("en-IN")}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value (Excluding Tax):</span>
                <span className="font-mono">₹{taxableAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>Central GST (CGST 9%):</span>
                <span className="font-mono">₹{cgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>State GST (SGST 9%):</span>
                <span className="font-mono">₹{sgst.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between border-t-2 border-slate-900 pt-2.5 font-extrabold text-sm text-text-heading">
                <span>Total Net Investment (Incl. 18% GST):</span>
                <span className="font-mono text-primary-blue text-base">₹{netPayable.toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setStep(2)}
                aria-label="Go back to previous step"
                className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 sm:px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 shrink-0" />
                <span className="hidden sm:inline">Back</span>
              </button>

              <button
                type="submit"
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-xl bg-primary-blue px-5 sm:px-8 py-3 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer disabled:opacity-50"
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
          <div className="space-y-6 rounded-[28px] border border-emerald-200 bg-white p-8 sm:p-12 text-center shadow-[0_12px_40px_rgba(15,23,42,0.06)]">
            <div className="flex h-20 w-20 mx-auto items-center justify-center rounded-3xl bg-emerald-50 text-emerald-600 shadow-md ring-2 ring-emerald-200">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2 max-w-lg mx-auto">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-text-heading">Admission &amp; Tax Invoice Generated! 🎉</h2>
              <p className="text-xs sm:text-sm text-text-body">
                Welcome to JKS Learning, <span className="font-bold text-emerald-600">{studentInfo.name}</span>! Your enrollment in <span className="text-text-heading font-bold">{selectedCourse.title}</span> has been confirmed.
              </p>
              <div className="text-[11px] text-slate-500 font-mono">
                Tax Invoice ID: <span className="text-primary-blue font-bold">{generatedInvoice.invoiceNumber}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 justify-center pt-4">
              <button
                type="button"
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center gap-2 rounded-xl bg-primary-blue px-6 py-3.5 text-xs font-bold text-white shadow-md shadow-primary-blue/25 hover:bg-blue-600 transition-all cursor-pointer"
              >
                <Printer className="h-4 w-4" /> View &amp; Print Official Tax Invoice PDF
              </button>

              <Link
                href="/dashboard/my-courses"
                className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-all"
              >
                Launch Student Dashboard <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Printable Tax Invoice Modal */}
        <InvoiceModal
          invoice={generatedInvoice}
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
            <span className="h-2 w-2 rounded-full bg-primary-blue animate-ping" />
            Loading Official Registration Portal...
          </div>
        </div>
      }
    >
      <CourseRegistrationContent />
    </Suspense>
  );
}
