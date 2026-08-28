export interface StudentCourseProgress {
  courseId: string;
  courseTitle: string;
  track: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  hoursSpent: number;
  lastActive: string;
  grade: string;
  certificateEarned: boolean;
}

export interface StudentAssignmentSubmission {
  id: string;
  title: string;
  courseTitle: string;
  submittedAt: string;
  score: number;
  status: "Graded" | "Under Review" | "Resubmitted";
  aiAnalysis: {
    humanScore: number; // e.g. 94%
    aiScore: number; // e.g. 6%
    verdict: "Authentic Human Work" | "AI-Assisted (Safe)" | "High AI Generated Alert";
    plagiarismRate: number; // e.g. 1.8%
    syntacticComplexity: "Advanced" | "Moderate" | "Standard";
    keyFindings: string[];
  };
  feedback: string;
}

export interface StudentQuizResult {
  id: string;
  title: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  durationMinutes: number;
  attemptDate: string;
  status: "Passed" | "Failed";
}

export interface StudentCertificate {
  id: string;
  courseTitle: string;
  track: string;
  verificationId: string;
  issueDate: string;
  grade: string;
  downloadUrl?: string;
}

export interface StudentActivityLog {
  id: string;
  timestamp: string;
  type: "quiz" | "assignment" | "interview" | "video" | "certificate";
  title: string;
  description: string;
  badgeColor: string;
}

export interface DetailedStudentProfile {
  id: string;
  slug: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  avatarUrl?: string;
  role: string;
  status: "Active" | "Inactive";
  joinedDate: string;
  lastActive: string;
  tier: "Diamond Scholar" | "Gold Pioneer" | "Silver Explorer";
  
  // Progress Rating & Velocity
  performanceRating: number; // e.g. 4.9 out of 5.0
  performanceTier: string; // e.g. "Top 5% Performer"
  masteryScore: number; // e.g. 92/100
  learningPace: "High Velocity" | "Consistent Pace" | "Moderate Pace";
  
  // Analytics
  analytics: {
    totalHoursLearned: number;
    dayStreak: number;
    completionRate: number;
    aiInterviewAvgScore: number;
    totalAssessmentsPassed: number;
    weeklyStudyHours: { day: string; hours: number }[];
    skillsRadar: { skill: string; score: number }[];
  };

  courses: StudentCourseProgress[];
  assignments: StudentAssignmentSubmission[];
  quizzes: StudentQuizResult[];
  certificates: StudentCertificate[];
  timeline: StudentActivityLog[];
}

export const DETAILED_STUDENTS: Record<string, DetailedStudentProfile> = {
  "priya-nair": {
    id: "stu-101",
    slug: "priya-nair",
    name: "Priya Nair",
    email: "priya.nair@example.com",
    phone: "+91 98765 43210",
    location: "Bengaluru, India",
    role: "Aspiring SAP MM & Supply Chain Architect",
    status: "Active",
    joinedDate: "2026-05-12",
    lastActive: "Today at 02:45 PM",
    tier: "Diamond Scholar",
    performanceRating: 4.9,
    performanceTier: "Top 3% Platform Performer",
    masteryScore: 94,
    learningPace: "High Velocity",
    analytics: {
      totalHoursLearned: 148.5,
      dayStreak: 24,
      completionRate: 92,
      aiInterviewAvgScore: 89,
      totalAssessmentsPassed: 14,
      weeklyStudyHours: [
        { day: "Mon", hours: 3.5 },
        { day: "Tue", hours: 4.2 },
        { day: "Wed", hours: 5.0 },
        { day: "Thu", hours: 3.8 },
        { day: "Fri", hours: 6.1 },
        { day: "Sat", hours: 7.5 },
        { day: "Sun", hours: 4.0 },
      ],
      skillsRadar: [
        { skill: "SAP MM & ERP", score: 95 },
        { skill: "Supply Chain Logic", score: 92 },
        { skill: "Procurement Lifecycle", score: 90 },
        { skill: "Inventory Valuation", score: 88 },
        { skill: "AI Readiness", score: 89 },
      ],
    },
    courses: [
      {
        courseId: "sap-mm-consultant",
        courseTitle: "SAP MM Functional Consultant Mastery",
        track: "SAP Enterprise",
        progress: 100,
        totalLessons: 48,
        completedLessons: 48,
        hoursSpent: 86,
        lastActive: "2026-08-25",
        grade: "A+ (96%)",
        certificateEarned: true,
      },
      {
        courseId: "jks-ai-agentic-architecture",
        courseTitle: "JKS Generative AI & Agentic Systems",
        track: "AI & Agents",
        progress: 68,
        totalLessons: 36,
        completedLessons: 24,
        hoursSpent: 62.5,
        lastActive: "2026-08-27",
        grade: "A (91%)",
        certificateEarned: false,
      },
    ],
    assignments: [
      {
        id: "asg-01",
        title: "P2P (Procure-to-Pay) End-to-End Configuration Blueprint",
        courseTitle: "SAP MM Functional Consultant Mastery",
        submittedAt: "2026-08-14 11:30 AM",
        score: 96,
        status: "Graded",
        aiAnalysis: {
          humanScore: 94,
          aiScore: 6,
          verdict: "Authentic Human Work",
          plagiarismRate: 1.2,
          syntacticComplexity: "Advanced",
          keyFindings: [
            "Demonstrates authentic domain vocabulary & custom enterprise parameter tables.",
            "High variance in sentence structure consistent with human expert writing.",
            "Zero patterns of generative template repetition detected.",
          ],
        },
        feedback: "Exceptional mastery of SAP MM release strategies and automatic account determination.",
      },
      {
        id: "asg-02",
        title: "Enterprise Multi-Agent RAG Orchestrator Architecture",
        courseTitle: "JKS Generative AI & Agentic Systems",
        submittedAt: "2026-08-23 04:15 PM",
        score: 91,
        status: "Graded",
        aiAnalysis: {
          humanScore: 88,
          aiScore: 12,
          verdict: "AI-Assisted (Safe)",
          plagiarismRate: 2.1,
          syntacticComplexity: "Advanced",
          keyFindings: [
            "Source code and schema diagrams show original architectural implementation.",
            "Theoretical summary shows minor AI paraphrasing assistance within acceptable limits.",
          ],
        },
        feedback: "Robust LangGraph agent design with graceful error fallback strategies.",
      },
    ],
    quizzes: [
      {
        id: "qz-01",
        title: "SAP MM Material Master & Vendor Evaluation",
        category: "SAP MM",
        score: 98,
        totalQuestions: 25,
        correctAnswers: 24,
        durationMinutes: 18,
        attemptDate: "2026-07-28",
        status: "Passed",
      },
      {
        id: "qz-02",
        title: "Inventory Management & Goods Movement (MIGO/MIRO)",
        category: "SAP MM",
        score: 92,
        totalQuestions: 20,
        correctAnswers: 18,
        durationMinutes: 15,
        attemptDate: "2026-08-05",
        status: "Passed",
      },
      {
        id: "qz-03",
        title: "Vector Embeddings & Semantic Indexing",
        category: "AI & Agents",
        score: 90,
        totalQuestions: 20,
        correctAnswers: 18,
        durationMinutes: 14,
        attemptDate: "2026-08-20",
        status: "Passed",
      },
    ],
    certificates: [
      {
        id: "cert-01",
        courseTitle: "SAP MM Functional Consultant Mastery",
        track: "SAP Enterprise",
        verificationId: "CERT-8F21A9",
        issueDate: "2026-07-30",
        grade: "Distinction (96%)",
      },
    ],
    timeline: [
      {
        id: "log-1",
        timestamp: "Today at 02:45 PM",
        type: "video",
        title: "Completed Lesson: Production RAG Guardrails",
        description: "Finished 32-minute deep dive on hallucination prevention.",
        badgeColor: "bg-blue-500",
      },
      {
        id: "log-2",
        timestamp: "Yesterday at 06:10 PM",
        type: "interview",
        title: "AI Mock Interview: Scenario Assessment",
        description: "Scored 89/100 on SAP S/4HANA Migration strategy simulation.",
        badgeColor: "bg-indigo-500",
      },
      {
        id: "log-3",
        timestamp: "Aug 23, 2026",
        type: "assignment",
        title: "Submitted Assignment: Multi-Agent RAG Orchestrator",
        description: "AI writing scan verified 94% authentic human code implementation.",
        badgeColor: "bg-emerald-500",
      },
      {
        id: "log-4",
        timestamp: "Jul 30, 2026",
        type: "certificate",
        title: "Certificate Issued: SAP MM Functional Consultant",
        description: "Verified on JKS Ledger with ID: CERT-8F21A9.",
        badgeColor: "bg-amber-500",
      },
    ],
  },

  "arjun-mehta": {
    id: "stu-102",
    slug: "arjun-mehta",
    name: "Arjun Mehta",
    email: "arjun.mehta@example.com",
    phone: "+91 99887 76655",
    location: "Mumbai, India",
    role: "Full Stack Java & Microservices Specialist",
    status: "Active",
    joinedDate: "2026-04-03",
    lastActive: "2 hours ago",
    tier: "Diamond Scholar",
    performanceRating: 4.8,
    performanceTier: "Top 5% Platform Performer",
    masteryScore: 91,
    learningPace: "High Velocity",
    analytics: {
      totalHoursLearned: 194.0,
      dayStreak: 31,
      completionRate: 88,
      aiInterviewAvgScore: 86,
      totalAssessmentsPassed: 18,
      weeklyStudyHours: [
        { day: "Mon", hours: 4.0 },
        { day: "Tue", hours: 5.5 },
        { day: "Wed", hours: 4.8 },
        { day: "Thu", hours: 6.0 },
        { day: "Fri", hours: 5.2 },
        { day: "Sat", hours: 8.0 },
        { day: "Sun", hours: 6.5 },
      ],
      skillsRadar: [
        { skill: "Java 21 & Spring Boot", score: 96 },
        { skill: "Microservices & Docker", score: 92 },
        { skill: "Kafka & Redis", score: 88 },
        { skill: "React 19 Frontend", score: 85 },
        { skill: "AI Readiness", score: 84 },
      ],
    },
    courses: [
      {
        courseId: "java-full-stack-mastery",
        courseTitle: "Java Full Stack Enterprise Mastery",
        track: "Full Stack",
        progress: 100,
        totalLessons: 64,
        completedLessons: 64,
        hoursSpent: 128,
        lastActive: "2026-08-20",
        grade: "A+ (95%)",
        certificateEarned: true,
      },
      {
        courseId: "jks-dsa-mastery",
        courseTitle: "JKS DSA & Algorithms Mastery",
        track: "Algorithms",
        progress: 74,
        totalLessons: 42,
        completedLessons: 31,
        hoursSpent: 66,
        lastActive: "2026-08-26",
        grade: "A (88%)",
        certificateEarned: false,
      },
    ],
    assignments: [
      {
        id: "asg-03",
        title: "Distributed Order Management System with Event Sourcing",
        courseTitle: "Java Full Stack Enterprise Mastery",
        submittedAt: "2026-07-18 08:45 PM",
        score: 95,
        status: "Graded",
        aiAnalysis: {
          humanScore: 92,
          aiScore: 8,
          verdict: "Authentic Human Work",
          plagiarismRate: 0.9,
          syntacticComplexity: "Advanced",
          keyFindings: [
            "Production-level concurrency constructs and custom Kafka serialization logic.",
            "Detailed benchmark performance metrics handwritten by author.",
          ],
        },
        feedback: "Outstanding architecture. High marks on transactional outbox pattern handling.",
      },
    ],
    quizzes: [
      {
        id: "qz-04",
        title: "Spring Boot 3, Virtual Threads & Concurrency",
        category: "Java Full Stack",
        score: 96,
        totalQuestions: 25,
        correctAnswers: 24,
        durationMinutes: 20,
        attemptDate: "2026-07-10",
        status: "Passed",
      },
    ],
    certificates: [
      {
        id: "cert-02",
        courseTitle: "Java Full Stack Enterprise Mastery",
        track: "Full Stack",
        verificationId: "CERT-3B77E2",
        issueDate: "2026-07-22",
        grade: "Distinction (95%)",
      },
    ],
    timeline: [
      {
        id: "log-5",
        timestamp: "2 hours ago",
        type: "video",
        title: "Solved: Red-Black Tree Balancing Problem",
        description: "Completed hard-tier DSA challenge with O(log n) solution.",
        badgeColor: "bg-purple-500",
      },
      {
        id: "log-6",
        timestamp: "Aug 18, 2026",
        type: "interview",
        title: "AI Technical Mock Interview",
        description: "Scored 84/100 in Spring Microservices & AWS Cloud.",
        badgeColor: "bg-blue-500",
      },
    ],
  },

  "sneha-kulkarni": {
    id: "stu-103",
    slug: "sneha-kulkarni",
    name: "Sneha Kulkarni",
    email: "sneha.kulkarni@example.com",
    phone: "+91 91234 56789",
    location: "Pune, India",
    role: "Senior Frontend & Design System Engineer",
    status: "Active",
    joinedDate: "2026-06-18",
    lastActive: "5 hours ago",
    tier: "Diamond Scholar",
    performanceRating: 4.9,
    performanceTier: "Top 2% Platform Performer",
    masteryScore: 96,
    learningPace: "High Velocity",
    analytics: {
      totalHoursLearned: 112.0,
      dayStreak: 42,
      completionRate: 95,
      aiInterviewAvgScore: 91,
      totalAssessmentsPassed: 12,
      weeklyStudyHours: [
        { day: "Mon", hours: 4.0 },
        { day: "Tue", hours: 3.5 },
        { day: "Wed", hours: 4.5 },
        { day: "Thu", hours: 5.0 },
        { day: "Fri", hours: 6.0 },
        { day: "Sat", hours: 6.5 },
        { day: "Sun", hours: 5.5 },
      ],
      skillsRadar: [
        { skill: "React 19 & Next.js", score: 98 },
        { skill: "TypeScript & Web APIs", score: 94 },
        { skill: "Performance Optimization", score: 96 },
        { skill: "Frontend System Design", score: 93 },
        { skill: "AI Readiness", score: 91 },
      ],
    },
    courses: [
      {
        courseId: "modern-frontend-engineering",
        courseTitle: "JKS Modern React & Next.js",
        track: "Frontend",
        progress: 100,
        totalLessons: 45,
        completedLessons: 45,
        hoursSpent: 72,
        lastActive: "2026-08-15",
        grade: "A+ (98%)",
        certificateEarned: true,
      },
      {
        courseId: "jks-frontend-system-design",
        courseTitle: "JKS Frontend System Design",
        track: "System Design",
        progress: 82,
        totalLessons: 30,
        completedLessons: 25,
        hoursSpent: 40,
        lastActive: "2026-08-27",
        grade: "A (94%)",
        certificateEarned: false,
      },
    ],
    assignments: [
      {
        id: "asg-04",
        title: "High-Throughput Virtualized Data Grid with WebGL Acceleration",
        courseTitle: "JKS Modern React & Next.js",
        submittedAt: "2026-06-25 10:15 PM",
        score: 98,
        status: "Graded",
        aiAnalysis: {
          humanScore: 97,
          aiScore: 3,
          verdict: "Authentic Human Work",
          plagiarismRate: 0.5,
          syntacticComplexity: "Advanced",
          keyFindings: [
            "Ultra-clean hand-crafted canvas rendering shaders.",
            "Zero standard boilerplate — custom memory pooling implementation.",
          ],
        },
        feedback: "Masterpiece assignment. 60 FPS under 100k row test load.",
      },
    ],
    quizzes: [
      {
        id: "qz-05",
        title: "React Fiber Architecture & Reconciliation",
        category: "Frontend",
        score: 100,
        totalQuestions: 20,
        correctAnswers: 20,
        durationMinutes: 12,
        attemptDate: "2026-06-22",
        status: "Passed",
      },
    ],
    certificates: [
      {
        id: "cert-03",
        courseTitle: "JKS Modern React & Next.js",
        track: "Frontend",
        verificationId: "CERT-9C14D0",
        issueDate: "2026-06-30",
        grade: "Distinction (98%)",
      },
    ],
    timeline: [
      {
        id: "log-7",
        timestamp: "5 hours ago",
        type: "video",
        title: "Completed Lesson: Micro-Frontend Module Federation",
        description: "Finished deep dive on dynamic remotes and shared dependencies.",
        badgeColor: "bg-blue-500",
      },
      {
        id: "log-8",
        timestamp: "Aug 18, 2026",
        type: "interview",
        title: "AI Technical Mock Interview: React 19",
        description: "Scored 91/100 (Top 1% score on platform).",
        badgeColor: "bg-emerald-500",
      },
    ],
  },
};

// Helper fallback for students without a detailed record yet
export function getStudentProfile(slugOrName: string): DetailedStudentProfile {
  const normalized = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (DETAILED_STUDENTS[normalized]) {
    return DETAILED_STUDENTS[normalized];
  }

  // Generate a dynamic high-fidelity profile
  const readableName = slugOrName
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: `stu-${Math.floor(1000 + Math.random() * 9000)}`,
    slug: normalized,
    name: readableName,
    email: `${normalized}@example.com`,
    phone: "+91 98765 00000",
    location: "Hyderabad, India",
    role: "Full Stack & Cloud Developer",
    status: "Active",
    joinedDate: "2026-05-15",
    lastActive: "1 day ago",
    tier: "Gold Pioneer",
    performanceRating: 4.7,
    performanceTier: "Top 10% Platform Performer",
    masteryScore: 88,
    learningPace: "Consistent Pace",
    analytics: {
      totalHoursLearned: 92.5,
      dayStreak: 15,
      completionRate: 82,
      aiInterviewAvgScore: 85,
      totalAssessmentsPassed: 9,
      weeklyStudyHours: [
        { day: "Mon", hours: 2.5 },
        { day: "Tue", hours: 3.5 },
        { day: "Wed", hours: 4.0 },
        { day: "Thu", hours: 3.0 },
        { day: "Fri", hours: 4.5 },
        { day: "Sat", hours: 5.0 },
        { day: "Sun", hours: 3.5 },
      ],
      skillsRadar: [
        { skill: "Core Programming", score: 88 },
        { skill: "System Architecture", score: 82 },
        { skill: "Problem Solving", score: 85 },
        { skill: "Database & APIs", score: 86 },
        { skill: "AI Readiness", score: 85 },
      ],
    },
    courses: [
      {
        courseId: "java-full-stack-mastery",
        courseTitle: "Java Full Stack Enterprise Mastery",
        track: "Full Stack",
        progress: 78,
        totalLessons: 64,
        completedLessons: 50,
        hoursSpent: 75,
        lastActive: "2026-08-25",
        grade: "A (88%)",
        certificateEarned: false,
      },
    ],
    assignments: [
      {
        id: "asg-gen-01",
        title: "RESTful Microservices & Spring Cloud Gateway Integration",
        courseTitle: "Java Full Stack Enterprise Mastery",
        submittedAt: "2026-08-15 02:20 PM",
        score: 88,
        status: "Graded",
        aiAnalysis: {
          humanScore: 91,
          aiScore: 9,
          verdict: "Authentic Human Work",
          plagiarismRate: 1.5,
          syntacticComplexity: "Advanced",
          keyFindings: [
            "Original custom route predicates and circuit breaker filters.",
            "Author's unique variable naming and code style consistent throughout.",
          ],
        },
        feedback: "Solid architecture and clear documentation of JWT filter chain.",
      },
    ],
    quizzes: [
      {
        id: "qz-gen-01",
        title: "Spring Security & OAuth2 Protocols",
        category: "Backend Security",
        score: 88,
        totalQuestions: 20,
        correctAnswers: 18,
        durationMinutes: 16,
        attemptDate: "2026-08-10",
        status: "Passed",
      },
    ],
    certificates: [],
    timeline: [
      {
        id: "log-gen-1",
        timestamp: "Yesterday",
        type: "video",
        title: "Completed Lesson: Spring Cloud Config Server",
        description: "Finished 28-minute lesson and configured local Git repo properties.",
        badgeColor: "bg-blue-500",
      },
      {
        id: "log-gen-2",
        timestamp: "Aug 15, 2026",
        type: "assignment",
        title: "Assignment Graded: Spring Cloud Gateway",
        description: "Scored 88/100 with verified 91% human writing authenticity.",
        badgeColor: "bg-emerald-500",
      },
    ],
  };
}
