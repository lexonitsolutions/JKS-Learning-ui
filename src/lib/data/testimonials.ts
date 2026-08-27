import type { Track } from "./courses";

export type CareerCategory = "Career Switch" | "Tier-1 Placement" | "Promotion" | "Fresher to Pro";

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  placedCompany: string;
  previousRole: string;
  salaryHike?: string;
  salaryPackage?: string;
  track: Track;
  category: CareerCategory;
  scoreDelta: string;
  initialScore: number;
  finalScore: number;
  capstone: string;
  quote: string;
  highlightText?: string;
  verified: boolean;
  hiredYear: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "priya-nair",
    name: "Priya Nair",
    role: "SAP MM Functional Consultant",
    company: "Placed at Deloitte Digital",
    placedCompany: "Deloitte",
    previousRole: "Procurement Executive",
    salaryHike: "+75% Salary Hike",
    salaryPackage: "₹16.5 LPA",
    track: "SAP",
    category: "Career Switch",
    scoreDelta: "61 → 89",
    initialScore: 61,
    finalScore: 89,
    capstone: "Global S/4HANA Multi-Plant Sourcing Engine",
    quote:
      "The AI mock interview flagged exactly the gaps I had in procurement scenarios. Two attempts later, my actual interview felt like a repeat.",
    highlightText: "Mastered end-to-end P2P cycle & real-time inventory management.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "arjun-mehta",
    name: "Arjun Mehta",
    role: "Senior Java Full Stack Engineer",
    company: "Promoted to Lead within 6 months",
    placedCompany: "Infosys",
    previousRole: "Associate Developer",
    salaryHike: "+65% Salary Hike",
    salaryPackage: "₹18.0 LPA",
    track: "Full Stack",
    category: "Promotion",
    scoreDelta: "58 → 84",
    initialScore: 58,
    finalScore: 84,
    capstone: "High-Throughput Distributed Payment Gateway",
    quote:
      "Structured modules kept me from jumping around randomly. I always knew what was next and why it mattered for the final project.",
    highlightText: "Built resilient microservices with Spring Cloud & Kafka.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "sneha-kulkarni",
    name: "Sneha Kulkarni",
    role: "Frontend Systems Engineer",
    company: "Placed at Razorpay",
    placedCompany: "Razorpay",
    previousRole: "Non-tech Graduate",
    salaryHike: "First Dev Job",
    salaryPackage: "₹14.0 LPA",
    track: "Frontend",
    category: "Fresher to Pro",
    scoreDelta: "65 → 91",
    initialScore: 65,
    finalScore: 91,
    capstone: "Real-Time Collaborative Dashboard with Canvas",
    quote:
      "Certificates are verifiable, which mattered to my hiring manager. The dashboard made it easy to pick up exactly where I left off.",
    highlightText: "Zero coding background to cracking a tier-1 fintech frontend loop.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "rahul-verma",
    name: "Rahul Verma",
    role: ".NET Cloud Solutions Engineer",
    company: "Placed at Accenture Technology",
    placedCompany: "Accenture",
    previousRole: "IT Service Desk Analyst",
    salaryHike: "+90% Salary Hike",
    salaryPackage: "₹15.5 LPA",
    track: "Full Stack",
    category: "Career Switch",
    scoreDelta: "52 → 80",
    initialScore: 52,
    finalScore: 80,
    capstone: "Enterprise Event-Driven CQRS Banking Platform",
    quote:
      "I'd failed two real interviews before this. The scenario-based mock interviews were closer to the real thing than any prep video.",
    highlightText: "Escaped support desk into core enterprise cloud engineering.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "ananya-iyer",
    name: "Ananya Iyer",
    role: "Lead SAP ABAP Developer",
    company: "Placed at PwC Consulting",
    placedCompany: "PwC",
    previousRole: "Junior ABAP Developer",
    salaryHike: "+80% Salary Hike",
    salaryPackage: "₹19.2 LPA",
    track: "SAP",
    category: "Tier-1 Placement",
    scoreDelta: "60 → 88",
    initialScore: 60,
    finalScore: 88,
    capstone: "Custom RAP & OData Services for ERP Migration",
    quote:
      "The improvement plan after each mock interview was oddly specific — it told me exactly which RICEFW topics to revisit.",
    highlightText: "Demonstrated advanced RESTful Application Programming in S/4HANA.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "karthik-reddy",
    name: "Karthik Reddy",
    role: "Senior React & Next.js Architect",
    company: "Transitioned from Freelance to Product Co.",
    placedCompany: "Swiggy",
    previousRole: "Freelance Web Builder",
    salaryHike: "+110% CTC Jump",
    salaryPackage: "₹22.0 LPA",
    track: "Frontend",
    category: "Tier-1 Placement",
    scoreDelta: "70 → 93",
    initialScore: 70,
    finalScore: 93,
    capstone: "Server-Driven UI & Micro-Frontend Architecture",
    quote:
      "Watching my confidence score climb across retakes was the first objective evidence that I was actually improving.",
    highlightText: "Turned ad-hoc freelancing into a Tier-1 senior product engineer offer.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "divya-menon",
    name: "Divya Menon",
    role: "SAP SD Senior Consultant",
    company: "Placed at Capgemini",
    placedCompany: "Capgemini",
    previousRole: "Supply Chain Coordinator",
    salaryHike: "+85% Salary Hike",
    salaryPackage: "₹17.0 LPA",
    track: "SAP",
    category: "Career Switch",
    scoreDelta: "64 → 90",
    initialScore: 64,
    finalScore: 90,
    capstone: "Global Order-to-Cash (O2C) Multi-Currency System",
    quote:
      "The curriculum mapped so closely to real client work that onboarding felt redundant. I contributed from day 1.",
    highlightText: "Direct domain transition from operations to SAP consulting.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "vikram-shah",
    name: "Vikram Shah",
    role: "Backend Architect (Java / Spring)",
    company: "Cracked Tier-1 Product Engineering Loop",
    placedCompany: "Oracle",
    previousRole: "Software Engineer",
    salaryHike: "+70% Salary Hike",
    salaryPackage: "₹24.5 LPA",
    track: "Full Stack",
    category: "Tier-1 Placement",
    scoreDelta: "55 → 82",
    initialScore: 55,
    finalScore: 82,
    capstone: "Distributed Saga Orchestrator for FinTech Workflows",
    quote:
      "The capstone project became the first thing I walked interviewers through — every time. It eliminated generic questions.",
    highlightText: "Mastered distributed locks, idempotency, and high-concurrency Java.",
    verified: true,
    hiredYear: "2026",
  },
  {
    id: "neha-kapoor",
    name: "Neha Kapoor",
    role: "Frontend Engineer (Performance & WebGL)",
    company: "Placed at MediaTech Unicorn",
    placedCompany: "BrowserStack",
    previousRole: "Technical Support Rep",
    salaryHike: "+95% Salary Hike",
    salaryPackage: "₹16.0 LPA",
    track: "Frontend",
    category: "Career Switch",
    scoreDelta: "68 → 92",
    initialScore: 68,
    finalScore: 92,
    capstone: "GPU-Accelerated Data Visualization Studio",
    quote:
      "The AI interview report reads like feedback from a senior engineer, not a scorecard. It pointed out subtle memory leaks in my code.",
    highlightText: "Transformed from Tier-1 support into a core UI platform engineer.",
    verified: true,
    hiredYear: "2026",
  },
];

export const HOMEPAGE_TESTIMONIALS = TESTIMONIALS.slice(0, 6);
