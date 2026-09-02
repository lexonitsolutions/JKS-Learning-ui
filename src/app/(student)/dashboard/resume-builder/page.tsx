"use client";

import React, { useState } from "react";
import {
  FileText,
  Printer,
  Download,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  Globe,
  Link2,
  Code2,
  Phone,
  Mail,
  MapPin,
  Eye,
  Sliders,
} from "lucide-react";

import { DashboardTopbar } from "@/components/dashboard/topbar";

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  points: string[];
}

interface ProjectItem {
  id: string;
  title: string;
  techStack: string;
  liveUrl?: string;
  points: string[];
}

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  year: string;
  score: string;
}

export default function ResumeBuilderPage() {
  const [template, setTemplate] = useState<"modern" | "minimalist" | "executive">("modern");

  // Personal Info
  const [personal, setPersonal] = useState({
    fullName: "Rohan Kulkarni",
    headline: "Full Stack Java & Cloud Engineer",
    email: "rohan.kulkarni@gmail.com",
    phone: "+91 98230 45678",
    location: "Bengaluru, Karnataka",
    linkedin: "linkedin.com/in/rohan-kulkarni",
    github: "github.com/rohankulkarni",
    portfolio: "rohankulkarni.dev",
    summary:
      "Results-driven Software Engineer with strong foundations in Spring Boot 3, Microservices, React 19, and AWS cloud architecture. Built production-ready fintech settlement pipelines handling 10,000+ daily events with 99.9% uptime. Certified JKS Learning Java Full Stack Graduate.",
  });

  // Skills
  const [skills, setSkills] = useState({
    languages: "Java 21, JavaScript (ES6+), TypeScript, SQL, Python",
    frameworks: "Spring Boot 3, Spring Cloud, React 19, Next.js 15, Node.js",
    databases: "PostgreSQL, MongoDB, Redis, Hibernate/JPA",
    cloudDevOps: "AWS (S3, ECS, Lambda), Docker, Kubernetes, GitHub Actions, Kafka",
    coreCS: "Data Structures & Algorithms, Distributed System Design, REST APIs, Microservices",
  });

  // Experience
  const [experiences, setExperiences] = useState<ExperienceItem[]>([
    {
      id: "exp-1",
      role: "Associate Software Engineer",
      company: "Nexus Technologies",
      location: "Bengaluru, India",
      startDate: "July 2025",
      endDate: "Present",
      points: [
        "Architected and deployed 4 RESTful microservices in Spring Boot 3 with automated CI/CD pipelines.",
        "Reduced database query latency by 42% by integrating Redis distributed caching clusters.",
        "Collaborated with frontend engineering teams to integrate React 19 stateful dashboards.",
      ],
    },
  ]);

  // Projects
  const [projects, setProjects] = useState<ProjectItem[]>([
    {
      id: "proj-1",
      title: "Fintech Real-Time Ledger & Payment Orchestrator",
      techStack: "Java 21, Spring Cloud, Kafka, PostgreSQL, Docker, AWS",
      liveUrl: "github.com/rohankulkarni/fintech-ledger",
      points: [
        "Implemented distributed saga orchestration for multi-currency payment rollbacks with zero race conditions.",
        "Benchmarked system under stress testing: Sustained 4,500 TPS with sub-80ms p99 latency.",
      ],
    },
    {
      id: "proj-2",
      title: "AI-Powered Course Readiness & Diagnostic Engine",
      techStack: "Next.js 15, TypeScript, Tailwind CSS, OpenAI API, PostgreSQL",
      liveUrl: "github.com/rohankulkarni/ai-readiness-engine",
      points: [
        "Built responsive 5-axis candidate evaluation graphs with adaptive question recommendation algorithms.",
        "Integrated real-time speech-to-text feedback for live AI technical interview simulations.",
      ],
    },
  ]);

  // Education
  const [educations, setEducations] = useState<EducationItem[]>([
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science & Engineering",
      institution: "Visvesvaraya Technological University",
      year: "2021 - 2025",
      score: "8.84 CGPA",
    },
  ]);

  // Certifications
  const [certifications, setCertifications] = useState<string[]>([
    "Java Full Stack Developer Mastery — JKS Learning (Verified ID: JKS-CERT-2026-0891)",
    "AWS Certified Solutions Architect – Associate (SAA-C03)",
  ]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <DashboardTopbar
        title="ATS Resume Builder"
        subtitle="Build, customize, and export professional tech resumes tailored for top product companies"
        userInitials="RK"
      />

      <div className="flex-1 p-4 pt-3 sm:p-6 lg:p-8 lg:pt-4 space-y-6">
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-700">Choose Template:</span>
            <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-100 p-1">
              {[
                { id: "modern", label: "Modern Tech" },
                { id: "minimalist", label: "ATS Minimalist" },
                { id: "executive", label: "Executive Pro" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTemplate(t.id as any)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                    template === t.id
                      ? "bg-white text-[#2563EB] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 rounded-xl bg-[#2563EB] px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-blue-700 transition-colors cursor-pointer"
            >
              <Printer className="h-4 w-4" /> Download PDF / Print Resume
            </button>
          </div>
        </div>

        {/* Split-Screen Layout: Editor (Left) & Real-Time Preview (Right) */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* ======================================================== */}
          {/* LEFT: FORM EDITORS (5 Cols)                              */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-4 print:hidden">
            {/* Personal Details */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sliders className="h-4 w-4 text-blue-600" /> Personal &amp; Contact Info
              </h3>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Full Name</label>
                  <input
                    type="text"
                    value={personal.fullName}
                    onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Job Title</label>
                  <input
                    type="text"
                    value={personal.headline}
                    onChange={(e) => setPersonal({ ...personal, headline: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-600">Email</label>
                  <input
                    type="email"
                    value={personal.email}
                    onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-600">Phone</label>
                  <input
                    type="tel"
                    value={personal.phone}
                    onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-600">LinkedIn Profile</label>
                <input
                  type="text"
                  value={personal.linkedin}
                  onChange={(e) => setPersonal({ ...personal, linkedin: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">GitHub Profile</label>
                <input
                  type="text"
                  value={personal.github}
                  onChange={(e) => setPersonal({ ...personal, github: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">Professional Summary</label>
                <textarea
                  rows={3}
                  value={personal.summary}
                  onChange={(e) => setPersonal({ ...personal, summary: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Technical Skills */}
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3 text-xs">
              <h3 className="font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-cyan-600" /> Technical Skills
              </h3>

              <div>
                <label className="font-semibold text-slate-600">Languages</label>
                <input
                  type="text"
                  value={skills.languages}
                  onChange={(e) => setSkills({ ...skills, languages: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">Frameworks &amp; Libraries</label>
                <input
                  type="text"
                  value={skills.frameworks}
                  onChange={(e) => setSkills({ ...skills, frameworks: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-600">Cloud &amp; DevOps</label>
                <input
                  type="text"
                  value={skills.cloudDevOps}
                  onChange={(e) => setSkills({ ...skills, cloudDevOps: e.target.value })}
                  className="mt-1 w-full rounded-xl border border-slate-200 p-2 text-xs outline-none focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: LIVE ATS PREVIEW (7 Cols / Full in Print)         */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 flex justify-center print:col-span-12 print:w-full">
            <div
              className={`w-full max-w-[800px] min-h-[1050px] bg-white p-8 sm:p-10 shadow-2xl rounded-2xl border border-slate-200 text-slate-800 space-y-6 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full ${
                template === "modern"
                  ? "border-t-8 border-t-[#2563EB]"
                  : template === "executive"
                  ? "border-t-8 border-t-slate-900"
                  : ""
              }`}
            >
              {/* Header */}
              <div className="border-b border-slate-200 pb-4 space-y-2">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {personal.fullName}
                </h1>
                <div className="text-sm font-bold text-[#2563EB]">{personal.headline}</div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3.5 w-3.5 text-slate-400" /> {personal.email}
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3.5 w-3.5 text-slate-400" /> {personal.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" /> {personal.location}
                  </span>
                  <span className="flex items-center gap-1 text-blue-600">
                    <Link2 className="h-3.5 w-3.5" /> {personal.linkedin}
                  </span>
                  <span className="flex items-center gap-1 text-slate-800">
                    <Code2 className="h-3.5 w-3.5" /> {personal.github}
                  </span>

                </div>
              </div>

              {/* Summary */}
              {personal.summary && (
                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
                </div>
              )}

              {/* Technical Skills */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  Technical Expertise
                </h2>
                <div className="grid grid-cols-1 gap-1 text-xs">
                  <div>
                    <span className="font-bold text-slate-800">Languages: </span>
                    <span className="text-slate-600">{skills.languages}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Frameworks: </span>
                    <span className="text-slate-600">{skills.frameworks}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Databases: </span>
                    <span className="text-slate-600">{skills.databases}</span>
                  </div>
                  <div>
                    <span className="font-bold text-slate-800">Cloud &amp; DevOps: </span>
                    <span className="text-slate-600">{skills.cloudDevOps}</span>
                  </div>
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  Work Experience
                </h2>
                {experiences.map((exp) => (
                  <div key={exp.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{exp.role} — <span className="text-[#2563EB]">{exp.company}</span></span>
                      <span className="text-slate-500 font-mono text-[11px]">{exp.startDate} - {exp.endDate}</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {exp.points.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Capstone Projects */}
              <div className="space-y-3">
                <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                  Key Projects &amp; Architectures
                </h2>
                {projects.map((proj) => (
                  <div key={proj.id} className="space-y-1 text-xs">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span>{proj.title}</span>
                      {proj.liveUrl && <span className="text-blue-600 font-mono text-[11px]">{proj.liveUrl}</span>}
                    </div>
                    <div className="text-[11px] text-slate-500 italic">Tech Stack: {proj.techStack}</div>
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {proj.points.map((pt, idx) => (
                        <li key={idx}>{pt}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Education & Certifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Education
                  </h2>
                  {educations.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="font-bold text-slate-900">{edu.degree}</div>
                      <div className="text-slate-600">{edu.institution}</div>
                      <div className="text-slate-500 text-[11px]">{edu.year} • {edu.score}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1">
                    Verified Certifications
                  </h2>
                  {certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-700">
                      <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
