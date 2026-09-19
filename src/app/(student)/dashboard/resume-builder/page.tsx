"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  FileText,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  CheckCircle2,
  Briefcase,
  GraduationCap,
  Award,
  Link2,
  Code2,
  Phone,
  Mail,
  MapPin,
  Eye,
  Sliders,
  RotateCcw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Globe,
  Layers,
  ArrowLeft,
  Check,
  ArrowUpDown,
} from "lucide-react";

import { DashboardTopbar } from "@/components/dashboard/topbar";
import { useUser } from "@clerk/nextjs";
import { useMockSession } from "@/lib/auth/use-mock-auth";

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
  location?: string;
  year: string;
  score: string;
}

interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year: string;
}

interface ResumeData {
  personal: {
    fullName: string;
    headline: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    portfolio: string;
    summary: string;
  };
  skills: {
    languages: string;
    frameworks: string;
    databases: string;
    cloudDevOps: string;
    coreCS: string;
  };
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  educations: EducationItem[];
  certifications: CertificationItem[];
}

export type ResumeSectionId =
  | "summary"
  | "skills"
  | "experience"
  | "projects"
  | "education"
  | "certifications";

export const DEFAULT_SECTION_ORDER: ResumeSectionId[] = [
  "summary",
  "skills",
  "experience",
  "projects",
  "education",
  "certifications",
];

export const SECTION_DISPLAY_NAMES: Record<ResumeSectionId, string> = {
  summary: "Professional Summary",
  skills: "Technical Expertise",
  experience: "Work Experience",
  projects: "Key Projects & Architectures",
  education: "Education",
  certifications: "Verified Credentials",
};

const SECTION_ORDER_STORAGE_KEY = "jks_resume_section_order_v2";

const SAMPLE_RESUME_DATA: ResumeData = {
  personal: {
    fullName: "Alex Rivera",
    headline: "Full Stack Software Engineer | Cloud & Distributed Systems",
    email: "alex.rivera@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    linkedin: "linkedin.com/in/alex-rivera-tech",
    github: "github.com/alexrivera-dev",
    portfolio: "alexrivera.dev",
    summary:
      "Results-driven Software Engineer with expertise in building scalable microservices (Java 21, Spring Boot 3, Node.js) and responsive high-traffic web applications (React 19, Next.js). Proven track record in optimizing database latencies by 38% and automating CI/CD pipelines across AWS cloud infrastructure. Certified JKS Learning Graduate.",
  },
  skills: {
    languages: "Java 21, TypeScript, JavaScript (ES6+), SQL, Python, Go",
    frameworks: "Spring Boot 3, Spring Cloud, React 19, Next.js, Node.js, Express, Tailwind CSS",
    databases: "PostgreSQL, MongoDB, Redis, Prisma, Hibernate / JPA",
    cloudDevOps: "AWS (S3, ECS, Lambda), Docker, Kubernetes, GitHub Actions, Kafka",
    coreCS: "Data Structures & Algorithms, Distributed System Design, RESTful APIs, Microservices",
  },
  experiences: [
    {
      id: "exp-1",
      role: "Full Stack Engineer",
      company: "Apex Cloud Solutions",
      location: "Bengaluru, India",
      startDate: "Jul 2024",
      endDate: "Present",
      points: [
        "Architected and deployed 6 RESTful microservices with automated Docker & GitHub Actions CI/CD pipelines.",
        "Reduced database query latency by 38% through Redis distributed caching and indexed query optimization.",
        "Integrated real-time WebSocket communication and secure OAuth2/JWT token authentication across client apps.",
      ],
    },
    {
      id: "exp-2",
      role: "Software Engineering Intern",
      company: "ZetaTech Labs",
      location: "Hyderabad, India",
      startDate: "Jan 2024",
      endDate: "Jun 2024",
      points: [
        "Developed reusable React components and client state stores that reduced frontend bundle load times by 25%.",
        "Collaborated in Agile sprints to resolve 40+ bug tickets and implement automated Jest unit test coverage.",
      ],
    },
  ],
  projects: [
    {
      id: "proj-1",
      title: "Fintech Settlement & High-Frequency Ledger",
      techStack: "Java 21, Spring Cloud, Kafka, PostgreSQL, Docker, AWS",
      liveUrl: "github.com/alexrivera/fintech-ledger",
      points: [
        "Implemented distributed saga orchestration for multi-currency transactions with zero duplicate charge states.",
        "Benchmarked under Apache JMeter: Sustained 5,000+ TPS with sub-65ms p99 response times.",
      ],
    },
    {
      id: "proj-2",
      title: "AI Technical Mock Interview & Scoring Engine",
      techStack: "Next.js 15, TypeScript, Tailwind CSS, OpenAI API, PostgreSQL",
      liveUrl: "github.com/alexrivera/ai-readiness-engine",
      points: [
        "Constructed 5-axis adaptive candidate evaluation dashboards with automated score benchmark reports.",
        "Engineered real-time speech-to-text evaluation and personalized learning track recommendation algorithms.",
      ],
    },
  ],
  educations: [
    {
      id: "edu-1",
      degree: "B.Tech in Computer Science & Engineering",
      institution: "National Institute of Technology",
      location: "Karnataka, India",
      year: "2020 - 2024",
      score: "8.92 CGPA",
    },
  ],
  certifications: [
    {
      id: "cert-1",
      title: "Full Stack Software Engineering Specialization",
      issuer: "JKS Learning (Verified ID: JKS-CERT-2026-9042)",
      year: "2025",
    },
    {
      id: "cert-2",
      title: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      year: "2025",
    },
  ],
};

const STORAGE_KEY = "jks_student_resume_v2";

export default function ResumeBuilderPage() {
  const { user: clerkUser } = useUser();
  const mockSession = useMockSession();

  const [template, setTemplate] = useState<"modern" | "minimalist" | "executive">("modern");
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving">("saved");

  // Section collapse states for clean mobile/desktop accordion
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    personal: true,
    skills: true,
    experience: true,
    projects: true,
    education: true,
    certifications: true,
  });

  const toggleSection = (sec: string) => {
    setOpenSections((prev) => ({ ...prev, [sec]: !prev[sec] }));
  };

  // Main Resume State
  const [resumeData, setResumeData] = useState<ResumeData>({
    personal: {
      fullName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      github: "",
      portfolio: "",
      summary: "",
    },
    skills: {
      languages: "",
      frameworks: "",
      databases: "",
      cloudDevOps: "",
      coreCS: "",
    },
    experiences: [],
    projects: [],
    educations: [],
    certifications: [],
  });

  const [sectionOrder, setSectionOrder] = useState<ResumeSectionId[]>(DEFAULT_SECTION_ORDER);

  // Load saved section order from localStorage
  useEffect(() => {
    try {
      const savedOrder = localStorage.getItem(SECTION_ORDER_STORAGE_KEY);
      if (savedOrder) {
        const parsed = JSON.parse(savedOrder);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((s: any) => DEFAULT_SECTION_ORDER.includes(s));
          DEFAULT_SECTION_ORDER.forEach((s) => {
            if (!valid.includes(s)) valid.push(s);
          });
          setSectionOrder(valid);
        }
      }
    } catch {}
  }, []);

  const moveSection = (idx: number, direction: -1 | 1) => {
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= sectionOrder.length) return;
    const next = [...sectionOrder];
    const [item] = next.splice(idx, 1);
    next.splice(targetIdx, 0, item);
    setSectionOrder(next);
    try {
      localStorage.setItem(SECTION_ORDER_STORAGE_KEY, JSON.stringify(next));
    } catch {}
  };

  const handleResetSectionOrder = () => {
    setSectionOrder(DEFAULT_SECTION_ORDER);
    try {
      localStorage.setItem(SECTION_ORDER_STORAGE_KEY, JSON.stringify(DEFAULT_SECTION_ORDER));
    } catch {}
  };

  // Load initial data from localStorage, or prefill with current user's details
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          setResumeData(parsed);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Default to student's real user profile details without mock names
    const realName = clerkUser?.fullName || mockSession?.name || "";
    const realEmail = clerkUser?.primaryEmailAddress?.emailAddress || mockSession?.email || "";
    if (realName || realEmail) {
      setResumeData((prev) => ({
        ...prev,
        personal: {
          ...prev.personal,
          fullName: realName,
          email: realEmail,
        },
      }));
    }
  }, [clerkUser, mockSession]);

  // Auto-save to localStorage
  const saveToStorage = useCallback((data: ResumeData) => {
    setSaveStatus("saving");
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      setTimeout(() => setSaveStatus("saved"), 350);
    } catch {
      setSaveStatus("saved");
    }
  }, []);

  const updatePersonal = (field: keyof ResumeData["personal"], value: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, personal: { ...prev.personal, [field]: value } };
      saveToStorage(updated);
      return updated;
    });
  };

  const updateSkills = (field: keyof ResumeData["skills"], value: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, skills: { ...prev.skills, [field]: value } };
      saveToStorage(updated);
      return updated;
    });
  };

  // Experience handlers
  const addExperience = () => {
    const newItem: ExperienceItem = {
      id: `exp-${Date.now()}`,
      role: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "Present",
      points: [""],
    };
    setResumeData((prev) => {
      const updated = { ...prev, experiences: [...prev.experiences, newItem] };
      saveToStorage(updated);
      return updated;
    });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, value: any) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        experiences: prev.experiences.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
      };
      saveToStorage(updated);
      return updated;
    });
  };

  const removeExperience = (id: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, experiences: prev.experiences.filter((exp) => exp.id !== id) };
      saveToStorage(updated);
      return updated;
    });
  };

  // Project handlers
  const addProject = () => {
    const newItem: ProjectItem = {
      id: `proj-${Date.now()}`,
      title: "",
      techStack: "",
      liveUrl: "",
      points: [""],
    };
    setResumeData((prev) => {
      const updated = { ...prev, projects: [...prev.projects, newItem] };
      saveToStorage(updated);
      return updated;
    });
  };

  const updateProject = (id: string, field: keyof ProjectItem, value: any) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        projects: prev.projects.map((proj) => (proj.id === id ? { ...proj, [field]: value } : proj)),
      };
      saveToStorage(updated);
      return updated;
    });
  };

  const removeProject = (id: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, projects: prev.projects.filter((p) => p.id !== id) };
      saveToStorage(updated);
      return updated;
    });
  };

  // Education handlers
  const addEducation = () => {
    const newItem: EducationItem = {
      id: `edu-${Date.now()}`,
      degree: "",
      institution: "",
      location: "",
      year: "",
      score: "",
    };
    setResumeData((prev) => {
      const updated = { ...prev, educations: [...prev.educations, newItem] };
      saveToStorage(updated);
      return updated;
    });
  };

  const updateEducation = (id: string, field: keyof EducationItem, value: string) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        educations: prev.educations.map((edu) => (edu.id === id ? { ...edu, [field]: value } : edu)),
      };
      saveToStorage(updated);
      return updated;
    });
  };

  const removeEducation = (id: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, educations: prev.educations.filter((e) => e.id !== id) };
      saveToStorage(updated);
      return updated;
    });
  };

  // Certification handlers
  const addCertification = () => {
    const newItem: CertificationItem = {
      id: `cert-${Date.now()}`,
      title: "",
      issuer: "",
      year: "",
    };
    setResumeData((prev) => {
      const updated = { ...prev, certifications: [...prev.certifications, newItem] };
      saveToStorage(updated);
      return updated;
    });
  };

  const updateCertification = (id: string, field: keyof CertificationItem, value: string) => {
    setResumeData((prev) => {
      const updated = {
        ...prev,
        certifications: prev.certifications.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
      };
      saveToStorage(updated);
      return updated;
    });
  };

  const removeCertification = (id: string) => {
    setResumeData((prev) => {
      const updated = { ...prev, certifications: prev.certifications.filter((c) => c.id !== id) };
      saveToStorage(updated);
      return updated;
    });
  };

  // Load Sample Data
  const handleLoadSample = () => {
    setResumeData(SAMPLE_RESUME_DATA);
    saveToStorage(SAMPLE_RESUME_DATA);
  };

  // Clear Form
  const handleClearAll = () => {
    if (window.confirm("Are you sure you want to clear all resume fields?")) {
      const emptyData: ResumeData = {
        personal: {
          fullName: clerkUser?.fullName || mockSession?.name || "",
          headline: "",
          email: clerkUser?.primaryEmailAddress?.emailAddress || mockSession?.email || "",
          phone: "",
          location: "",
          linkedin: "",
          github: "",
          portfolio: "",
          summary: "",
        },
        skills: {
          languages: "",
          frameworks: "",
          databases: "",
          cloudDevOps: "",
          coreCS: "",
        },
        experiences: [],
        projects: [],
        educations: [],
        certifications: [],
      };
      setResumeData(emptyData);
      saveToStorage(emptyData);
    }
  };

  const handlePrint = () => {
    // Ensure mobile view switches to preview so the resume sheet is mounted and rendered
    setMobileTab("preview");

    // Temporarily isolate light theme so dark mode does not affect printed colors or sheet styling
    const htmlEl = typeof document !== "undefined" ? document.documentElement : null;
    const wasDark = htmlEl ? htmlEl.classList.contains("dark") : false;
    if (htmlEl && wasDark) {
      htmlEl.classList.remove("dark");
      htmlEl.removeAttribute("data-theme");
      htmlEl.style.colorScheme = "light";
    }

    const originalTitle = document.title;
    const cleanName = resumeData.personal.fullName
      ? resumeData.personal.fullName.trim().replace(/[^a-zA-Z0-9]/g, "_")
      : "Resume";
    document.title = `${cleanName}_Resume`;

    // Delay briefly to allow DOM layout to update before print dialog triggers
    setTimeout(() => {
      window.print();
      // Restore previous state after print dialog closes
      setTimeout(() => {
        document.title = originalTitle;
        if (htmlEl && wasDark) {
          htmlEl.classList.add("dark");
          htmlEl.setAttribute("data-theme", "dark");
          htmlEl.style.colorScheme = "dark";
        }
      }, 500);
    }, 150);
  };

  // Dynamic Section Renderers for Templates
  const renderModernSection = (secId: ResumeSectionId) => {
    switch (secId) {
      case "summary":
        return resumeData.personal.summary ? (
          <div className="space-y-1.5">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5EFF]">
              <span className="h-2 w-2 rounded-full bg-[#1E5EFF]" />
              Professional Summary
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed pl-4 border-l-2 border-slate-200">
              {resumeData.personal.summary}
            </p>
          </div>
        ) : null;

      case "skills":
        return (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5EFF]">
              <span className="h-2 w-2 rounded-full bg-[#1E5EFF]" />
              Technical Expertise
            </h2>
            <div className="grid grid-cols-1 gap-1.5 text-xs pl-4 border-l-2 border-slate-200">
              {resumeData.skills.languages && (
                <div>
                  <span className="font-bold text-slate-900">Languages: </span>
                  <span className="text-slate-700">{resumeData.skills.languages}</span>
                </div>
              )}
              {resumeData.skills.frameworks && (
                <div>
                  <span className="font-bold text-slate-900">Frameworks &amp; Libs: </span>
                  <span className="text-slate-700">{resumeData.skills.frameworks}</span>
                </div>
              )}
              {resumeData.skills.databases && (
                <div>
                  <span className="font-bold text-slate-900">Databases &amp; ORM: </span>
                  <span className="text-slate-700">{resumeData.skills.databases}</span>
                </div>
              )}
              {resumeData.skills.cloudDevOps && (
                <div>
                  <span className="font-bold text-slate-900">Cloud &amp; DevOps: </span>
                  <span className="text-slate-700">{resumeData.skills.cloudDevOps}</span>
                </div>
              )}
              {resumeData.skills.coreCS && (
                <div>
                  <span className="font-bold text-slate-900">Core CS: </span>
                  <span className="text-slate-700">{resumeData.skills.coreCS}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "experience":
        return resumeData.experiences.length > 0 ? (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5EFF]">
              <span className="h-2 w-2 rounded-full bg-[#1E5EFF]" />
              Work Experience
            </h2>
            <div className="space-y-3 pl-4 border-l-2 border-slate-200">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-900">
                    <span>
                      {exp.role} — <span className="text-[#1E5EFF]">{exp.company}</span>
                      {exp.location && <span className="text-slate-500 font-normal"> ({exp.location})</span>}
                    </span>
                    {(exp.startDate || exp.endDate) && (
                      <span className="text-slate-500 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded">
                        {exp.startDate} - {exp.endDate}
                      </span>
                    )}
                  </div>
                  {exp.points.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1 pt-0.5">
                      {exp.points.map((pt, idx) => (
                        <li key={idx} className="leading-snug">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return resumeData.projects.length > 0 ? (
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5EFF]">
              <span className="h-2 w-2 rounded-full bg-[#1E5EFF]" />
              Key Projects &amp; Architectures
            </h2>
            <div className="space-y-3 pl-4 border-l-2 border-slate-200">
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between font-bold text-slate-900">
                    <span className="font-semibold text-slate-900">{proj.title}</span>
                    {proj.liveUrl && (
                      <span className="text-[#1E5EFF] font-mono text-[11px] underline">
                        {proj.liveUrl}
                      </span>
                    )}
                  </div>
                  {proj.techStack && (
                    <div className="text-[11px] text-slate-600 font-medium">
                      <span className="text-slate-400">Stack:</span> {proj.techStack}
                    </div>
                  )}
                  {proj.points.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pl-1">
                      {proj.points.map((pt, idx) => (
                        <li key={idx} className="leading-snug">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return resumeData.educations.length > 0 ? (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5EFF]">
              <span className="h-2 w-2 rounded-full bg-[#1E5EFF]" />
              Education
            </h2>
            <div className="space-y-2 pl-4 border-l-2 border-slate-200">
              {resumeData.educations.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-700">{edu.institution}</div>
                  <div className="text-slate-500 text-[11px]">
                    {edu.year} {edu.score ? `• ${edu.score}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div className="space-y-2">
            <h2 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E5EFF]">
              <span className="h-2 w-2 rounded-full bg-[#1E5EFF]" />
              Verified Credentials
            </h2>
            <div className="space-y-1.5 pl-4 border-l-2 border-slate-200">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="text-xs text-slate-800 flex items-start gap-1.5">
                  <Award className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-slate-900">{cert.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {cert.issuer} {cert.year ? `• ${cert.year}` : ""}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const renderMinimalistSection = (secId: ResumeSectionId) => {
    switch (secId) {
      case "summary":
        return resumeData.personal.summary ? (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs text-black leading-relaxed text-justify">
              {resumeData.personal.summary}
            </p>
          </div>
        ) : null;

      case "skills":
        return (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
              TECHNICAL SKILLS
            </h2>
            <div className="space-y-0.5 text-xs text-black">
              {resumeData.skills.languages && (
                <div>
                  <span className="font-bold">Languages: </span>
                  <span>{resumeData.skills.languages}</span>
                </div>
              )}
              {resumeData.skills.frameworks && (
                <div>
                  <span className="font-bold">Frameworks &amp; Libraries: </span>
                  <span>{resumeData.skills.frameworks}</span>
                </div>
              )}
              {resumeData.skills.databases && (
                <div>
                  <span className="font-bold">Databases &amp; Systems: </span>
                  <span>{resumeData.skills.databases}</span>
                </div>
              )}
              {resumeData.skills.cloudDevOps && (
                <div>
                  <span className="font-bold">Cloud &amp; DevOps: </span>
                  <span>{resumeData.skills.cloudDevOps}</span>
                </div>
              )}
              {resumeData.skills.coreCS && (
                <div>
                  <span className="font-bold">Core Competencies: </span>
                  <span>{resumeData.skills.coreCS}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "experience":
        return resumeData.experiences.length > 0 ? (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              WORK EXPERIENCE
            </h2>
            <div className="space-y-2.5">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="text-xs text-black space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold">
                    <span>
                      {exp.role.toUpperCase()}, {exp.company}
                      {exp.location && <span className="font-normal"> — {exp.location}</span>}
                    </span>
                    <span className="font-mono text-[11px]">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  {exp.points.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-black">
                      {exp.points.map((pt, idx) => (
                        <li key={idx} className="leading-snug">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return resumeData.projects.length > 0 ? (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-2">
              KEY PROJECTS
            </h2>
            <div className="space-y-2.5">
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="text-xs text-black space-y-0.5">
                  <div className="flex justify-between items-baseline font-bold">
                    <span>{proj.title}</span>
                    {proj.liveUrl && <span className="font-mono text-[11px] font-normal">{proj.liveUrl}</span>}
                  </div>
                  {proj.techStack && (
                    <div className="text-[11px] italic text-neutral-800">
                      Technologies: {proj.techStack}
                    </div>
                  )}
                  {proj.points.length > 0 && (
                    <ul className="list-disc list-outside pl-4 space-y-0.5 text-black">
                      {proj.points.map((pt, idx) => (
                        <li key={idx} className="leading-snug">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "education":
        return resumeData.educations.length > 0 ? (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
              EDUCATION
            </h2>
            <div className="space-y-1.5">
              {resumeData.educations.map((edu) => (
                <div key={edu.id} className="flex justify-between items-baseline text-xs text-black">
                  <div>
                    <span className="font-bold">{edu.degree}</span>, {edu.institution}
                    {edu.location && <span className="text-neutral-700"> — {edu.location}</span>}
                  </div>
                  <span className="font-mono text-[11px] shrink-0">
                    {edu.year} {edu.score ? `(${edu.score})` : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-widest text-black border-b border-black pb-0.5 mb-1.5">
              CERTIFICATIONS &amp; CREDENTIALS
            </h2>
            <div className="space-y-1 text-xs text-black">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-baseline">
                  <span className="font-medium">
                    • {cert.title} — <span className="text-neutral-700">{cert.issuer}</span>
                  </span>
                  {cert.year && <span className="font-mono text-[11px] shrink-0">{cert.year}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const renderExecutiveLeftSection = (secId: ResumeSectionId) => {
    switch (secId) {
      case "skills":
        return (
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Expertise
            </h3>
            <div className="space-y-2 text-[11px]">
              {resumeData.skills.languages && (
                <div>
                  <span className="font-bold text-slate-900 block">Languages</span>
                  <span className="text-slate-600">{resumeData.skills.languages}</span>
                </div>
              )}
              {resumeData.skills.frameworks && (
                <div>
                  <span className="font-bold text-slate-900 block">Frameworks</span>
                  <span className="text-slate-600">{resumeData.skills.frameworks}</span>
                </div>
              )}
              {resumeData.skills.databases && (
                <div>
                  <span className="font-bold text-slate-900 block">Databases</span>
                  <span className="text-slate-600">{resumeData.skills.databases}</span>
                </div>
              )}
              {resumeData.skills.cloudDevOps && (
                <div>
                  <span className="font-bold text-slate-900 block">Cloud &amp; DevOps</span>
                  <span className="text-slate-600">{resumeData.skills.cloudDevOps}</span>
                </div>
              )}
            </div>
          </div>
        );

      case "education":
        return resumeData.educations.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Education
            </h3>
            <div className="space-y-2 text-[11px]">
              {resumeData.educations.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="font-bold text-slate-900">{edu.degree}</div>
                  <div className="text-slate-600">{edu.institution}</div>
                  <div className="text-slate-500 font-mono text-[10px]">
                    {edu.year} {edu.score ? `• ${edu.score}` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "certifications":
        return resumeData.certifications.length > 0 ? (
          <div className="space-y-2">
            <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
              Certifications
            </h3>
            <div className="space-y-2 text-[11px]">
              {resumeData.certifications.map((cert) => (
                <div key={cert.id} className="space-y-0.5">
                  <div className="font-bold text-slate-900">{cert.title}</div>
                  <div className="text-slate-600 text-[10px]">
                    {cert.issuer} {cert.year ? `(${cert.year})` : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const renderExecutiveRightSection = (secId: ResumeSectionId) => {
    switch (secId) {
      case "summary":
        return resumeData.personal.summary ? (
          <div className="space-y-1.5">
            <h3 className="font-serif font-bold text-sm text-slate-900 tracking-wide border-b border-slate-200 pb-1">
              Executive Profile
            </h3>
            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {resumeData.personal.summary}
            </p>
          </div>
        ) : null;

      case "experience":
        return resumeData.experiences.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-slate-900 tracking-wide border-b border-slate-200 pb-1">
              Professional Career
            </h3>
            <div className="space-y-3.5 font-sans">
              {resumeData.experiences.map((exp) => (
                <div key={exp.id} className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold text-slate-900">
                    <span className="font-serif text-sm font-semibold">{exp.role}</span>
                    <span className="text-slate-500 font-mono text-[11px]">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="text-slate-600 font-medium text-[11px]">
                    {exp.company} {exp.location ? `• ${exp.location}` : ""}
                  </div>
                  {exp.points.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700 pt-0.5">
                      {exp.points.map((pt, idx) => (
                        <li key={idx} className="leading-snug">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      case "projects":
        return resumeData.projects.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-serif font-bold text-sm text-slate-900 tracking-wide border-b border-slate-200 pb-1">
              Key Technical Architectures
            </h3>
            <div className="space-y-3 font-sans">
              {resumeData.projects.map((proj) => (
                <div key={proj.id} className="space-y-1 text-xs">
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between font-bold text-slate-900">
                    <span className="font-semibold text-slate-900">{proj.title}</span>
                    {proj.liveUrl && (
                      <span className="text-slate-600 font-mono text-[10px] underline">
                        {proj.liveUrl}
                      </span>
                    )}
                  </div>
                  {proj.techStack && (
                    <div className="text-[11px] text-slate-500 italic">
                      {proj.techStack}
                    </div>
                  )}
                  {proj.points.length > 0 && (
                    <ul className="list-disc list-inside space-y-1 text-slate-700">
                      {proj.points.map((pt, idx) => (
                        <li key={idx} className="leading-snug">
                          {pt}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;

      default:
        return null;
    }
  };

  const userInitials =
    clerkUser?.firstName?.[0] ||
    mockSession?.name?.[0] ||
    (resumeData.personal.fullName ? resumeData.personal.fullName[0].toUpperCase() : "ST");

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 8mm 10mm !important;
              }
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
                color-scheme: light !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                overflow: visible !important;
              }
              /* Strict light mode enforcement during print: no dark mode inversion */
              .dark, [data-theme="dark"], :root {
                color-scheme: light !important;
                background-color: #ffffff !important;
              }
              header, aside, nav, footer, .print\\:hidden, button, [role="navigation"] {
                display: none !important;
                visibility: hidden !important;
              }
              /* Ensure the sheet and its contents print cleanly with exact colors */
              #printable-resume-sheet,
              #printable-resume-sheet * {
                color-scheme: light !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              #printable-resume-sheet {
                display: block !important;
                visibility: visible !important;
                position: relative !important;
                width: 100% !important;
                max-width: 100% !important;
                margin: 0 !important;
                padding: 0 !important;
                box-shadow: none !important;
                border: none !important;
                border-radius: 0 !important;
                background: #ffffff !important;
                background-color: #ffffff !important;
                color: #0f172a !important;
              }
              /* Unclutter any wrapper padding or boundaries in print */
              .resume-print-wrapper {
                display: block !important;
                width: 100% !important;
                padding: 0 !important;
                margin: 0 !important;
                overflow: visible !important;
              }
            }
          `,
        }}
      />

      <DashboardTopbar
        title="ATS Resume Builder"
        subtitle="Build, customize, and export professional tech resumes tailored for top product companies"
        userInitials={userInitials}
      />

      <div className="flex-1 p-3 sm:p-6 lg:p-8 lg:pt-4 space-y-4 sm:space-y-6">
        {/* ========================================================================= */}
        {/* TOP CONTROL BAR: Template Selector, Actions & Mobile Toggle               */}
        {/* ========================================================================= */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary p-3 sm:p-4 shadow-xs print:hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Template Selector */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 shrink-0">Template:</span>
              <div className="grid grid-cols-3 gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-surface-elevated p-1 w-full sm:w-auto">
                {[
                  { id: "modern", label: "Modern Tech", desc: "Tech Blue Accents & Pills" },
                  { id: "minimalist", label: "ATS Minimalist", desc: "Classic Monochrome" },
                  { id: "executive", label: "Executive Pro", desc: "Serif 2-Column Sidebar" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id as any)}
                    className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer text-center ${
                      template === t.id
                        ? "bg-white text-[#1E5EFF] shadow-xs dark:bg-surface-secondary dark:text-blue-400"
                        : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions & Print Button */}
            <div className="flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleLoadSample}
                  title="Load a complete tech resume example"
                  className="flex items-center gap-1 rounded-xl border border-blue-200 dark:border-blue-900/60 bg-blue-50/70 dark:bg-blue-950/40 px-2.5 py-1.5 text-[11px] font-semibold text-[#1E5EFF] dark:text-blue-400 hover:bg-blue-100/70 transition-colors cursor-pointer"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Load</span> Example
                </button>
                <button
                  type="button"
                  onClick={handleClearAll}
                  title="Clear all fields"
                  className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50/50 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Clear</span>
                </button>
              </div>

              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-1.5 rounded-xl bg-[#1E5EFF] dark:bg-blue-600 px-3.5 sm:px-4 py-1.5 text-xs font-bold text-white shadow-md hover:bg-blue-700 dark:hover:bg-blue-500 transition-all active:scale-98 cursor-pointer"
              >
                <Printer className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>

          {/* Mobile Segmented Toggle (Edit vs Preview) */}
          <div className="flex lg:hidden items-center justify-between gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="grid grid-cols-2 gap-1 rounded-xl bg-slate-100 dark:bg-surface-elevated p-1 w-full">
              <button
                type="button"
                onClick={() => setMobileTab("edit")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                  mobileTab === "edit"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-surface-secondary dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                <Sliders className="h-3.5 w-3.5 text-[#1E5EFF] dark:text-blue-400" />
                <span>Edit Details</span>
              </button>
              <button
                type="button"
                onClick={() => setMobileTab("preview")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-bold transition-all ${
                  mobileTab === "preview"
                    ? "bg-white text-slate-900 shadow-xs dark:bg-surface-secondary dark:text-white"
                    : "text-slate-500 hover:text-slate-900 dark:text-slate-400"
                }`}
              >
                <Eye className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Live Preview</span>
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* MAIN BODY: Responsive 12-Column Grid (Editor Left, Preview Right)         */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start print:block print:w-full">
          {/* ===================================================================== */}
          {/* LEFT: COMPREHENSIVE FORM EDITORS (5 Cols on desktop)                  */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-5 space-y-4 print:hidden ${
              mobileTab === "preview" ? "hidden lg:block" : "block"
            }`}
          >
            {/* Auto-save & Status indicator */}
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                {saveStatus === "saving" ? "Saving updates..." : "Auto-saved to browser"}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Live ATS Sync
              </span>
            </div>

            {/* 0. REORDER RESUME SECTIONS */}
            <div className="rounded-2xl border border-blue-200/80 dark:border-blue-900/60 bg-blue-50/40 dark:bg-blue-950/20 shadow-xs overflow-hidden">
              <div className="p-3.5 sm:p-4 border-b border-blue-100 dark:border-blue-900/40 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600 text-white shadow-xs">
                    <ArrowUpDown className="h-3.5 w-3.5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">Section Order &amp; Priority</h3>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Reorder sections to highlight your strengths</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleResetSectionOrder}
                  className="text-[10px] font-bold text-[#1E5EFF] dark:text-blue-400 hover:underline cursor-pointer"
                >
                  Reset Order
                </button>
              </div>

              <div className="p-3 space-y-1.5 bg-white/70 dark:bg-surface-secondary/70">
                {sectionOrder.map((secId, idx) => (
                  <div
                    key={secId}
                    className="flex items-center justify-between rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-surface-elevated px-3 py-1.5 text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-md bg-slate-100 dark:bg-surface-secondary font-mono text-[10px] font-extrabold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                        {idx + 1}
                      </span>
                      <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                        {SECTION_DISPLAY_NAMES[secId]}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveSection(idx, -1)}
                        title={`Move ${SECTION_DISPLAY_NAMES[secId]} Up`}
                        aria-label={`Move ${SECTION_DISPLAY_NAMES[secId]} Up`}
                        className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-surface-hover cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronUp className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === sectionOrder.length - 1}
                        onClick={() => moveSection(idx, 1)}
                        title={`Move ${SECTION_DISPLAY_NAMES[secId]} Down`}
                        aria-label={`Move ${SECTION_DISPLAY_NAMES[secId]} Down`}
                        className="flex h-6 w-6 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 dark:hover:bg-surface-hover cursor-pointer disabled:cursor-not-allowed"
                      >
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 1. PERSONAL & CONTACT DETAILS */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("personal")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-slate-900 dark:text-white hover:bg-slate-50/80 dark:hover:bg-surface transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1E5EFF] dark:text-blue-400 font-bold text-xs">
                    1
                  </span>
                  Personal &amp; Contact Details
                </span>
                {openSections.personal ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>

              {openSections.personal && (
                <div className="p-4 pt-0 space-y-3 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Alex Rivera"
                        value={resumeData.personal.fullName}
                        onChange={(e) => updatePersonal("fullName", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Target Role / Headline <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Full Stack Developer | Java & React"
                        value={resumeData.personal.headline}
                        onChange={(e) => updatePersonal("headline", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        placeholder="alex.rivera@example.com"
                        value={resumeData.personal.email}
                        onChange={(e) => updatePersonal("email", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={resumeData.personal.phone}
                        onChange={(e) => updatePersonal("phone", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Location (City, Country)</label>
                      <input
                        type="text"
                        placeholder="Bengaluru, India"
                        value={resumeData.personal.location}
                        onChange={(e) => updatePersonal("location", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">Portfolio / Website URL</label>
                      <input
                        type="text"
                        placeholder="alexrivera.dev"
                        value={resumeData.personal.portfolio}
                        onChange={(e) => updatePersonal("portfolio", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">LinkedIn Profile</label>
                      <input
                        type="text"
                        placeholder="linkedin.com/in/alex-rivera"
                        value={resumeData.personal.linkedin}
                        onChange={(e) => updatePersonal("linkedin", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300">GitHub Profile</label>
                      <input
                        type="text"
                        placeholder="github.com/alexrivera"
                        value={resumeData.personal.github}
                        onChange={(e) => updatePersonal("github", e.target.value)}
                        className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Professional Summary</label>
                    <textarea
                      rows={3}
                      placeholder="Brief 2-3 sentence overview highlighting your core tech stack, accomplishments, and career focus..."
                      value={resumeData.personal.summary}
                      onChange={(e) => updatePersonal("summary", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 2. TECHNICAL SKILLS */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("skills")}
                className="w-full flex items-center justify-between p-4 text-left font-bold text-xs text-slate-900 dark:text-white hover:bg-slate-50/80 dark:hover:bg-surface transition-colors"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 font-bold text-xs">
                    2
                  </span>
                  Technical Expertise &amp; Skills
                </span>
                {openSections.skills ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
              </button>

              {openSections.skills && (
                <div className="p-4 pt-0 space-y-3 text-xs border-t border-slate-100 dark:border-slate-800">
                  <div className="pt-3">
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Languages</label>
                    <input
                      type="text"
                      placeholder="e.g. Java 21, TypeScript, Python, SQL"
                      value={resumeData.skills.languages}
                      onChange={(e) => updateSkills("languages", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Frameworks &amp; Libraries</label>
                    <input
                      type="text"
                      placeholder="e.g. Spring Boot 3, React 19, Next.js, Node.js"
                      value={resumeData.skills.frameworks}
                      onChange={(e) => updateSkills("frameworks", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Databases &amp; ORM</label>
                    <input
                      type="text"
                      placeholder="e.g. PostgreSQL, MongoDB, Redis, Hibernate/JPA"
                      value={resumeData.skills.databases}
                      onChange={(e) => updateSkills("databases", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Cloud &amp; DevOps</label>
                    <input
                      type="text"
                      placeholder="e.g. AWS (S3, ECS, Lambda), Docker, Kubernetes, CI/CD"
                      value={resumeData.skills.cloudDevOps}
                      onChange={(e) => updateSkills("cloudDevOps", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 dark:text-slate-300">Core CS &amp; Methodologies</label>
                    <input
                      type="text"
                      placeholder="e.g. Data Structures & Algorithms, Distributed Systems, REST APIs"
                      value={resumeData.skills.coreCS}
                      onChange={(e) => updateSkills("coreCS", e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2.5 text-xs outline-none focus:border-[#1E5EFF] dark:focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 3. WORK EXPERIENCE */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection("experience")}
                  className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white text-left hover:opacity-80 transition-opacity"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
                    3
                  </span>
                  Work Experience ({resumeData.experiences.length})
                </button>
                <button
                  type="button"
                  onClick={addExperience}
                  className="flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 text-xs font-bold hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Job
                </button>
              </div>

              {openSections.experience && (
                <div className="p-4 space-y-3 text-xs">
                  {resumeData.experiences.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-slate-500">
                      <p className="text-xs">No work experiences added yet.</p>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="mt-2 text-xs font-bold text-[#1E5EFF] hover:underline"
                      >
                        + Add your first position or internship
                      </button>
                    </div>
                  ) : (
                    resumeData.experiences.map((exp, index) => (
                      <div
                        key={exp.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 space-y-2.5 bg-slate-50/50 dark:bg-surface"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Position #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeExperience(exp.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                            title="Remove position"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Job Title / Role</label>
                            <input
                              type="text"
                              placeholder="e.g. Full Stack Engineer"
                              value={exp.role}
                              onChange={(e) => updateExperience(exp.id, "role", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Company Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Apex Cloud Solutions"
                              value={exp.company}
                              onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Location</label>
                            <input
                              type="text"
                              placeholder="Bengaluru or Remote"
                              value={exp.location}
                              onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Start Date</label>
                            <input
                              type="text"
                              placeholder="e.g. Jul 2024"
                              value={exp.startDate}
                              onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">End Date</label>
                            <input
                              type="text"
                              placeholder="e.g. Present"
                              value={exp.endDate}
                              onChange={(e) => updateExperience(exp.id, "endDate", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 dark:text-slate-400">
                            Key Bullet Points (1 per line)
                          </label>
                          <textarea
                            rows={3}
                            placeholder="Architected microservices using Spring Boot 3...&#10;Reduced query latencies by 38% using Redis caching...&#10;Mentored 3 junior developers in code review sessions..."
                            value={exp.points.join("\n")}
                            onChange={(e) =>
                              updateExperience(
                                exp.id,
                                "points",
                                e.target.value.split("\n").filter((l) => l.trim().length > 0)
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 4. KEY PROJECTS */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection("projects")}
                  className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white text-left hover:opacity-80 transition-opacity"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
                    4
                  </span>
                  Technical Projects ({resumeData.projects.length})
                </button>
                <button
                  type="button"
                  onClick={addProject}
                  className="flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 px-2.5 py-1 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Project
                </button>
              </div>

              {openSections.projects && (
                <div className="p-4 space-y-3 text-xs">
                  {resumeData.projects.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-slate-500">
                      <p className="text-xs">No projects added yet.</p>
                      <button
                        type="button"
                        onClick={addProject}
                        className="mt-2 text-xs font-bold text-[#1E5EFF] hover:underline"
                      >
                        + Add a capstone or GitHub project
                      </button>
                    </div>
                  ) : (
                    resumeData.projects.map((proj, index) => (
                      <div
                        key={proj.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 space-y-2.5 bg-slate-50/50 dark:bg-surface"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Project #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeProject(proj.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                            title="Remove project"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Project Title</label>
                            <input
                              type="text"
                              placeholder="e.g. Fintech Settlement Ledger"
                              value={proj.title}
                              onChange={(e) => updateProject(proj.id, "title", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Tech Stack Used</label>
                            <input
                              type="text"
                              placeholder="e.g. Java 21, Spring Cloud, Kafka, Docker"
                              value={proj.techStack}
                              onChange={(e) => updateProject(proj.id, "techStack", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 dark:text-slate-400">
                            Project Link (GitHub / Live Demo)
                          </label>
                          <input
                            type="text"
                            placeholder="github.com/username/project"
                            value={proj.liveUrl || ""}
                            onChange={(e) => updateProject(proj.id, "liveUrl", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                          />
                        </div>

                        <div>
                          <label className="font-semibold text-slate-600 dark:text-slate-400">
                            Highlights &amp; Impact (1 per line)
                          </label>
                          <textarea
                            rows={2}
                            placeholder="Implemented distributed transaction orchestration...&#10;Handled 5,000 TPS under Apache JMeter stress testing..."
                            value={proj.points.join("\n")}
                            onChange={(e) =>
                              updateProject(
                                proj.id,
                                "points",
                                e.target.value.split("\n").filter((l) => l.trim().length > 0)
                              )
                            }
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 5. EDUCATION */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection("education")}
                  className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white text-left hover:opacity-80 transition-opacity"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 font-bold text-xs">
                    5
                  </span>
                  Education ({resumeData.educations.length})
                </button>
                <button
                  type="button"
                  onClick={addEducation}
                  className="flex items-center gap-1 rounded-lg bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 px-2.5 py-1 text-xs font-bold hover:bg-amber-100 dark:hover:bg-amber-900/60 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Degree
                </button>
              </div>

              {openSections.education && (
                <div className="p-4 space-y-3 text-xs">
                  {resumeData.educations.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-slate-500">
                      <p className="text-xs">No education records added yet.</p>
                      <button
                        type="button"
                        onClick={addEducation}
                        className="mt-2 text-xs font-bold text-[#1E5EFF] hover:underline"
                      >
                        + Add university or college degree
                      </button>
                    </div>
                  ) : (
                    resumeData.educations.map((edu, index) => (
                      <div
                        key={edu.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-3.5 space-y-2.5 bg-slate-50/50 dark:bg-surface"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Education #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeEducation(edu.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                            title="Remove education"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Degree / Qualification</label>
                            <input
                              type="text"
                              placeholder="e.g. B.Tech in Computer Science"
                              value={edu.degree}
                              onChange={(e) => updateEducation(edu.id, "degree", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Institution / University</label>
                            <input
                              type="text"
                              placeholder="e.g. Visvesvaraya Technological University"
                              value={edu.institution}
                              onChange={(e) => updateEducation(edu.id, "institution", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Location</label>
                            <input
                              type="text"
                              placeholder="e.g. Karnataka, India"
                              value={edu.location || ""}
                              onChange={(e) => updateEducation(edu.id, "location", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Year of Graduation</label>
                            <input
                              type="text"
                              placeholder="e.g. 2020 - 2024"
                              value={edu.year}
                              onChange={(e) => updateEducation(edu.id, "year", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Grade / CGPA</label>
                            <input
                              type="text"
                              placeholder="e.g. 8.8 CGPA"
                              value={edu.score}
                              onChange={(e) => updateEducation(edu.id, "score", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* 6. CERTIFICATIONS & HONORS */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-secondary shadow-xs overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => toggleSection("certifications")}
                  className="flex items-center gap-2 font-bold text-xs text-slate-900 dark:text-white text-left hover:opacity-80 transition-opacity"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 font-bold text-xs">
                    6
                  </span>
                  Verified Certifications ({resumeData.certifications.length})
                </button>
                <button
                  type="button"
                  onClick={addCertification}
                  className="flex items-center gap-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 px-2.5 py-1 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" /> Add Certificate
                </button>
              </div>

              {openSections.certifications && (
                <div className="p-4 space-y-3 text-xs">
                  {resumeData.certifications.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-300 dark:border-slate-700 p-4 text-center text-slate-500">
                      <p className="text-xs">No certifications added yet.</p>
                      <button
                        type="button"
                        onClick={addCertification}
                        className="mt-2 text-xs font-bold text-[#1E5EFF] hover:underline"
                      >
                        + Add JKS Learning verified certificate or cloud credential
                      </button>
                    </div>
                  ) : (
                    resumeData.certifications.map((cert, index) => (
                      <div
                        key={cert.id}
                        className="rounded-xl border border-slate-200 dark:border-slate-700 p-3 space-y-2 bg-slate-50/50 dark:bg-surface"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 dark:text-slate-200 text-xs">
                            Certification #{index + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCertification(cert.id)}
                            className="text-red-500 hover:text-red-700 p-1 transition-colors"
                            title="Remove certification"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">Certification Name</label>
                            <input
                              type="text"
                              placeholder="e.g. Java Full Stack Developer Mastery"
                              value={cert.title}
                              onChange={(e) => updateCertification(cert.id, "title", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                          <div>
                            <label className="font-semibold text-slate-600 dark:text-slate-400">
                              Issuing Org / Credential ID
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. JKS Learning (ID: JKS-CERT-2026)"
                              value={cert.issuer}
                              onChange={(e) => updateCertification(cert.id, "issuer", e.target.value)}
                              className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                            />
                          </div>
                        </div>

                        <div className="w-1/2">
                          <label className="font-semibold text-slate-600 dark:text-slate-400">Year / Date</label>
                          <input
                            type="text"
                            placeholder="e.g. 2025"
                            value={cert.year}
                            onChange={(e) => updateCertification(cert.id, "year", e.target.value)}
                            className="mt-1 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-input-bg text-slate-900 dark:text-white p-2 text-xs outline-none focus:border-[#1E5EFF]"
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ===================================================================== */}
          {/* RIGHT: REAL-TIME ATS PREVIEW CONTAINER (7 Cols on desktop)            */}
          {/* ===================================================================== */}
          <div
            className={`lg:col-span-7 flex flex-col items-center resume-print-wrapper print:!flex print:!col-span-12 print:!w-full print:!p-0 print:!m-0 ${
              mobileTab === "edit" ? "hidden lg:flex" : "flex"
            }`}
          >
            {/* Desktop Preview Header & Controls */}
            <div className="w-full flex items-center justify-between pb-3 px-1 text-xs text-slate-500 dark:text-slate-400 print:hidden">
              <span className="font-semibold flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-[#1E5EFF] dark:text-blue-400" />
                <span>Live Document Preview (A4 Standard)</span>
              </span>

              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium hidden sm:inline">Active Template:</span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-900 dark:text-white bg-slate-100 dark:bg-surface-elevated px-2 py-0.5 rounded-md">
                  {template === "modern" ? "Modern Tech" : template === "minimalist" ? "ATS Minimalist" : "Executive Pro"}
                </span>
              </div>
            </div>

            {/* Printable & Scaled Preview Container */}
            <div className="w-full overflow-x-auto pb-4 flex justify-center">
              <div
                id="printable-resume-sheet"
                className="w-full max-w-[820px] transition-transform duration-200"
              >
                {/* ─────────────────────────────────────────────────────────────────── */}
                {/* TEMPLATE 1: MODERN TECH                                            */}
                {/* ─────────────────────────────────────────────────────────────────── */}
                {template === "modern" && (
                  <div className="w-full min-h-[1080px] bg-white p-6 sm:p-10 shadow-xl sm:shadow-2xl rounded-2xl border-t-8 border-t-[#1E5EFF] border border-slate-200 text-slate-800 space-y-5 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full font-sans">
                    {/* Header */}
                    <div className="border-b border-slate-200 pb-4 space-y-2">
                      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                          {resumeData.personal.fullName || "Your Full Name"}
                        </h1>
                        {resumeData.personal.location && (
                          <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5 text-[#1E5EFF]" /> {resumeData.personal.location}
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold text-[#1E5EFF]">
                        {resumeData.personal.headline || "Target Engineering Headline"}
                      </div>

                      {/* Contact row with pills */}
                      <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                        {resumeData.personal.email && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 border border-slate-200/80">
                            <Mail className="h-3 w-3 text-[#1E5EFF]" /> {resumeData.personal.email}
                          </span>
                        )}
                        {resumeData.personal.phone && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 border border-slate-200/80">
                            <Phone className="h-3 w-3 text-[#1E5EFF]" /> {resumeData.personal.phone}
                          </span>
                        )}
                        {resumeData.personal.linkedin && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-blue-50/70 px-2 py-0.5 text-[#1E5EFF] border border-blue-200/80 font-medium">
                            <Link2 className="h-3 w-3" /> {resumeData.personal.linkedin}
                          </span>
                        )}
                        {resumeData.personal.github && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-slate-800 border border-slate-300/80 font-medium">
                            <Code2 className="h-3 w-3" /> {resumeData.personal.github}
                          </span>
                        )}
                        {resumeData.personal.portfolio && (
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 border border-emerald-200 font-medium">
                            <Globe className="h-3 w-3" /> {resumeData.personal.portfolio}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Dynamic Sections ordered by user preference */}
                    {sectionOrder.map((secId) => (
                      <React.Fragment key={secId}>
                        {renderModernSection(secId)}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────────── */}
                {/* TEMPLATE 2: ATS MINIMALIST (Strict Classic Monochrome)              */}
                {/* ─────────────────────────────────────────────────────────────────── */}
                {template === "minimalist" && (
                  <div className="w-full min-h-[1080px] bg-white p-6 sm:p-10 shadow-xl sm:shadow-2xl rounded-2xl border border-slate-200 text-black space-y-4 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full font-sans">
                    {/* Centered Traditional ATS Header */}
                    <div className="text-center pb-2 border-b border-black">
                      <h1 className="text-2xl sm:text-3xl font-black uppercase text-black tracking-tight">
                        {resumeData.personal.fullName || "YOUR FULL NAME"}
                      </h1>
                      {resumeData.personal.headline && (
                        <div className="text-xs font-bold text-black uppercase tracking-wider mt-1">
                          {resumeData.personal.headline}
                        </div>
                      )}

                      {/* Single Line Clean Pipe Separators */}
                      <div className="flex flex-wrap justify-center items-center gap-x-2 gap-y-0.5 text-xs text-black pt-1.5 font-normal">
                        {resumeData.personal.email && <span>{resumeData.personal.email}</span>}
                        {resumeData.personal.phone && <span>• {resumeData.personal.phone}</span>}
                        {resumeData.personal.location && <span>• {resumeData.personal.location}</span>}
                        {resumeData.personal.linkedin && <span>• {resumeData.personal.linkedin}</span>}
                        {resumeData.personal.github && <span>• {resumeData.personal.github}</span>}
                        {resumeData.personal.portfolio && <span>• {resumeData.personal.portfolio}</span>}
                      </div>
                    </div>

                    {/* Dynamic Sections ordered by user preference */}
                    {sectionOrder.map((secId) => (
                      <React.Fragment key={secId}>
                        {renderMinimalistSection(secId)}
                      </React.Fragment>
                    ))}
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────────────────── */}
                {/* TEMPLATE 3: EXECUTIVE PRO (Serif Two-Column Sidebar Layout)         */}
                {/* ─────────────────────────────────────────────────────────────────── */}
                {template === "executive" && (
                  <div className="w-full min-h-[1080px] bg-white p-6 sm:p-10 shadow-xl sm:shadow-2xl rounded-2xl border-t-8 border-t-slate-900 border border-slate-200 text-slate-900 space-y-5 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-full font-serif">
                    {/* Editorial Serif Header */}
                    <div className="border-b-2 border-slate-900 pb-4">
                      <h1 className="text-3xl sm:text-4xl font-normal tracking-wide text-slate-900">
                        {resumeData.personal.fullName || "Your Full Name"}
                      </h1>
                      <div className="mt-1 font-sans text-xs uppercase tracking-widest font-bold text-slate-600">
                        {resumeData.personal.headline || "Executive Engineering Leader"}
                      </div>
                    </div>

                    {/* 2-Column Asymmetrical Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start font-sans">
                      {/* Left Column (4 Cols): Contact, Skills, Education, Certs */}
                      <div className="md:col-span-4 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-5 text-xs">
                        {/* Contact */}
                        <div className="space-y-2">
                          <h3 className="font-serif font-bold text-xs uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1">
                            Contact Info
                          </h3>
                          <div className="space-y-1.5 text-slate-700 text-[11px]">
                            {resumeData.personal.email && (
                              <div className="flex items-center gap-1.5">
                                <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                <span className="break-all">{resumeData.personal.email}</span>
                              </div>
                            )}
                            {resumeData.personal.phone && (
                              <div className="flex items-center gap-1.5">
                                <Phone className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                <span>{resumeData.personal.phone}</span>
                              </div>
                            )}
                            {resumeData.personal.location && (
                              <div className="flex items-center gap-1.5">
                                <MapPin className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                <span>{resumeData.personal.location}</span>
                              </div>
                            )}
                            {resumeData.personal.linkedin && (
                              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                                <Link2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                <span className="break-all">{resumeData.personal.linkedin}</span>
                              </div>
                            )}
                            {resumeData.personal.github && (
                              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                                <Code2 className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                <span className="break-all">{resumeData.personal.github}</span>
                              </div>
                            )}
                            {resumeData.personal.portfolio && (
                              <div className="flex items-center gap-1.5 text-slate-900 font-semibold">
                                <Globe className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                                <span className="break-all">{resumeData.personal.portfolio}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dynamic Left Column Sections */}
                        {sectionOrder
                          .filter((secId) => ["skills", "education", "certifications"].includes(secId))
                          .map((secId) => (
                            <React.Fragment key={secId}>
                              {renderExecutiveLeftSection(secId)}
                            </React.Fragment>
                          ))}
                      </div>

                      {/* Right Column (8 Cols): Dynamic Sections */}
                      <div className="md:col-span-8 space-y-5">
                        {sectionOrder
                          .filter((secId) => ["summary", "experience", "projects"].includes(secId))
                          .map((secId) => (
                            <React.Fragment key={secId}>
                              {renderExecutiveRightSection(secId)}
                            </React.Fragment>
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Mobile Action Button (Switch to Preview) */}
      {mobileTab === "edit" && (
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className="lg:hidden fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#1E5EFF] text-white px-5 py-3.5 shadow-2xl font-bold text-xs hover:bg-blue-700 active:scale-95 transition-all cursor-pointer print:hidden"
        >
          <Eye className="h-4 w-4" />
          <span>View Resume Preview</span>
        </button>
      )}
    </>
  );
}
