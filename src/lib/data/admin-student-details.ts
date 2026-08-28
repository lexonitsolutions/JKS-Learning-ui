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
  instructorName?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
}

export interface RubricItem {
  criteria: string;
  maxScore: number;
  awardedScore: number;
  feedback: string;
}

export interface StudentAssignmentSubmission {
  id: string;
  title: string;
  courseTitle: string;
  courseId?: string;
  submittedAt: string;
  score: number;
  status: "Graded" | "Under Review" | "Resubmitted";
  assignmentPrompt: string;
  studentAnswers: {
    executiveSummary: string;
    methodology: string;
    codeSolution?: {
      language: string;
      filename: string;
      code: string;
    };
    configurationParameters?: {
      parameter: string;
      configuredValue: string;
      purpose: string;
    }[];
    submittedFiles?: string[];
  };
  aiAnalysis: {
    humanScore: number; // e.g. 94%
    aiScore: number; // e.g. 6%
    verdict: "Authentic Human Work" | "AI-Assisted (Safe)" | "High AI Generated Alert";
    plagiarismRate: number; // e.g. 1.2%
    syntacticComplexity: "Advanced" | "Moderate" | "Standard";
    confidenceScore: number; // e.g. 98.6%
    tokenCount: number;
    keyFindings: string[];
  };
  rubricBreakdown: RubricItem[];
  feedback: string;
}

export interface QuizQuestionDetail {
  qNumber: number;
  question: string;
  options: string[];
  studentAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
}

export interface StudentQuizResult {
  id: string;
  title: string;
  courseTitle?: string;
  category: string;
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  durationMinutes: number;
  attemptDate: string;
  status: "Passed" | "Failed";
  questionsList?: QuizQuestionDetail[];
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
  performanceRating: number;
  performanceTier: string;
  masteryScore: number;
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
        instructorName: "Rajesh Kannan (SAP Certified Lead)",
        level: "Advanced",
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
        instructorName: "Dr. Vikram Seth (AI Research Director)",
        level: "Intermediate",
      },
    ],
    assignments: [
      {
        id: "asg-01",
        title: "P2P (Procure-to-Pay) End-to-End Configuration Blueprint",
        courseTitle: "SAP MM Functional Consultant Mastery",
        courseId: "sap-mm-consultant",
        submittedAt: "2026-08-14 11:30 AM",
        score: 96,
        status: "Graded",
        assignmentPrompt:
          "Design and document a complete end-to-end Procure-to-Pay (P2P) cycle configuration for a multi-plant enterprise. Include valuation class mapping (BSX/WRX), 3-tier release strategy with classification for Purchase Orders exceeding $50k, and automated MIGO goods receipt with three-way invoice matching in MIRO.",
        studentAnswers: {
          executiveSummary:
            "Implemented an automated SAP MM P2P pipeline across Plant 1000 and Plant 2000. Configured custom release group 'MM' with release code 'L1/L2/L3' linked to CEKKO characteristics. Automatic account determination was mapped via transaction OBYC with valuation grouping code 0001.",
          methodology:
            "1. Valuation & Material Master: Configured moving average price (V) for raw materials (ROH) and standard price (S) for finished goods (FERT).\n2. Purchase Requisition to PO Automation: Automated source determination utilizing Outline Agreements and Source Lists with MRP Controller 001.\n3. Release Strategy: Designed release prerequisites where Level 3 (VP Approval) triggers on Net PO Value > INR 5,000,000.\n4. Three-Way Verification: Enforced quantity tolerances (Price variance PP: 2.5%, Quantity variance DQ: 0%) during MIRO logistics invoice verification.",
          configurationParameters: [
            { parameter: "OBYC - BSX (Inventory Posting)", configuredValue: "GL Account: 300000", purpose: "Debit balance sheet inventory on MIGO movement 101" },
            { parameter: "OBYC - WRX (GR/IR Clearing)", configuredValue: "GL Account: 310000", purpose: "Offset clearing account balanced against MIRO invoice" },
            { parameter: "Release Group / Code", configuredValue: "Group '01', Codes: M1, M2, D1", purpose: "Enforce multi-level approval hierarchy" },
            { parameter: "Movement Type", configuredValue: "101 (GR to Warehouse), 103 (GR to Blocked)", purpose: "Quality inspection routing prior to unrestricted stock" },
          ],
          codeSolution: {
            language: "abap",
            filename: "ZMM_PO_RELEASE_USEREXIT.abap",
            code: `*&---------------------------------------------------------------------*
*& Form ZMM_CHECK_PO_THRESHOLD
*& Custom Enhancement in EXIT_SAPLEBND_002 for PO Release Strategy
*&---------------------------------------------------------------------*
FORM zmm_check_po_threshold USING    p_i_cekko TYPE cekko
                            CHANGING p_e_cekko TYPE cekko.
  
  IF p_i_cekko-bsart = 'NB' AND p_i_cekko-gnetw > 5000000.
    " Escalate to Director Tier Approval
    p_e_cekko-usrc1 = 'DIR_REQ'.
    p_e_cekko-usrc2 = p_i_cekko-ekorg.
    MESSAGE s001(zmm_msg) WITH 'High value PO flagged for Tier-3 Audit'.
  ELSE.
    p_e_cekko-usrc1 = 'STD_APP'.
  ENDIF.

ENDFORM.`,
          },
          submittedFiles: ["P2P_Configuration_Blueprint_v3.pdf", "OBYC_Account_Determination_Matrix.xlsx", "ZMM_PO_RELEASE_USEREXIT.abap"],
        },
        aiAnalysis: {
          humanScore: 94,
          aiScore: 6,
          verdict: "Authentic Human Work",
          plagiarismRate: 1.2,
          syntacticComplexity: "Advanced",
          confidenceScore: 98.8,
          tokenCount: 2840,
          keyFindings: [
            "Demonstrates authentic domain vocabulary & custom enterprise parameter tables with proprietary numbering schemes.",
            "High variance in sentence burstiness and ABAP inline comments consistent with senior industry consultant writing.",
            "Zero patterns of generic generative AI template repetition detected.",
            "Custom exception handling logic in ABAP exit contains localized business constraint checks.",
          ],
        },
        rubricBreakdown: [
          { criteria: "Technical Accuracy & SAP Parameter Mapping", maxScore: 40, awardedScore: 39, feedback: "Flawless OBYC and account determination logic." },
          { criteria: "Release Strategy & Business Workflow", maxScore: 30, awardedScore: 29, feedback: "Comprehensive multi-level classification." },
          { criteria: "Edge-Case Handling & Tolerance Rules", maxScore: 20, awardedScore: 19, feedback: "Well structured price variance threshold limits." },
          { criteria: "Documentation Clarity & Code Standards", maxScore: 10, awardedScore: 9, feedback: "Clean ABAP formatting and header comments." },
        ],
        feedback: "Exceptional mastery of SAP MM release strategies and automatic account determination. Ready for enterprise-grade deployment.",
      },
      {
        id: "asg-02",
        title: "Enterprise Multi-Agent RAG Orchestrator Architecture",
        courseTitle: "JKS Generative AI & Agentic Systems",
        courseId: "jks-ai-agentic-architecture",
        submittedAt: "2026-08-23 04:15 PM",
        score: 91,
        status: "Graded",
        assignmentPrompt:
          "Build an autonomous multi-agent pipeline using LangGraph with a Supervisor Router node, Vector Retrieval tool, SQL Generator tool, and Hallucination Evaluation Critic. Implement memory checkpointers and fallback retry logic.",
        studentAnswers: {
          executiveSummary:
            "Architected a cyclical graph topology with LangGraph state machine containing 4 worker nodes: Query Planner, Qdrant Hybrid Retriever, SQL Analyst, and Fact-Checking Critic. Added cosine distance grounding filter to prevent out-of-domain hallucinations.",
          methodology:
            "Utilized StateGraph with TypedDict annotation maintaining conversation state and retrieved document provenance. Integrated self-correction loops when the Critic score falls below 0.85.",
          codeSolution: {
            language: "typescript",
            filename: "agent-orchestrator.ts",
            code: `import { StateGraph, END, START } from "@langchain/langgraph";
import { BaseMessage, HumanMessage, AIMessage } from "@langchain/core/messages";

interface AgentState {
  messages: BaseMessage[];
  queryIntent: "vector" | "sql" | "hybrid";
  retrievedContext: string[];
  hallucinationScore: number;
  retryCount: number;
}

const workflow = new StateGraph<AgentState>({
  channels: {
    messages: { value: (x, y) => x.concat(y), default: () => [] },
    queryIntent: { value: (x, y) => y ?? x, default: () => "vector" },
    retrievedContext: { value: (x, y) => y ?? x, default: () => [] },
    hallucinationScore: { value: (x, y) => y ?? x, default: () => 0 },
    retryCount: { value: (x, y) => x + (y ?? 0), default: () => 0 },
  }
});

// Router Decision Function
function routeByCritic(state: AgentState) {
  if (state.hallucinationScore >= 0.85) return END;
  if (state.retryCount > 2) return "fallbackNode";
  return "refineQueryNode";
}`,
          },
          submittedFiles: ["agent-orchestrator.ts", "rag-critic-evaluator.py", "architecture_benchmark_report.pdf"],
        },
        aiAnalysis: {
          humanScore: 88,
          aiScore: 12,
          verdict: "AI-Assisted (Safe)",
          plagiarismRate: 2.1,
          syntacticComplexity: "Advanced",
          confidenceScore: 96.4,
          tokenCount: 3120,
          keyFindings: [
            "State machine TypeScript implementation is entirely hand-written with custom typing.",
            "Theoretical summary shows minor AI grammatical refinement within acceptable enterprise standards.",
            "Benchmark test cases and latency metrics verified against live Qdrant test instance.",
          ],
        },
        rubricBreakdown: [
          { criteria: "Agent State Topology & Graph Design", maxScore: 40, awardedScore: 37, feedback: "Clean cycle handling and state isolation." },
          { criteria: "Retrieval & Tool Integration", maxScore: 30, awardedScore: 28, feedback: "Effective hybrid search implementation." },
          { criteria: "Self-Correction & Fallback Handling", maxScore: 20, awardedScore: 18, feedback: "Smart loop guard using retry count." },
          { criteria: "Code Cleanliness & Production Readiness", maxScore: 10, awardedScore: 8, feedback: "Includes production logging." },
        ],
        feedback: "Robust LangGraph agent design with graceful error fallback strategies. Highly recommended for production deployment.",
      },
    ],
    quizzes: [
      {
        id: "qz-01",
        title: "SAP MM Material Master & Vendor Evaluation",
        courseTitle: "SAP MM Functional Consultant Mastery",
        category: "SAP MM",
        score: 98,
        totalQuestions: 25,
        correctAnswers: 24,
        durationMinutes: 18,
        attemptDate: "2026-07-28",
        status: "Passed",
        questionsList: [
          {
            qNumber: 1,
            question: "Which table stores the general material data at client level in SAP ERP?",
            options: ["MARA", "MARC", "MARD", "MAKT"],
            studentAnswer: "MARA",
            correctAnswer: "MARA",
            isCorrect: true,
            explanation: "MARA stores general material data at client level. MARC is plant-specific, MARD is storage location specific, and MAKT holds descriptions.",
          },
          {
            qNumber: 2,
            question: "What transaction code is used to maintain Automatic Account Assignment parameters?",
            options: ["OBYC", "OM17", "MM01", "ME21N"],
            studentAnswer: "OBYC",
            correctAnswer: "OBYC",
            isCorrect: true,
            explanation: "OBYC is the primary configuration table for automatic posting integration between MM and FI.",
          },
          {
            qNumber: 3,
            question: "Under which movement type is standard Goods Receipt posted against a Purchase Order into unrestricted stock?",
            options: ["101", "103", "122", "201"],
            studentAnswer: "101",
            correctAnswer: "101",
            isCorrect: true,
            explanation: "Movement type 101 posts GR for purchase order directly into warehouse or designated storage location.",
          },
        ],
      },
      {
        id: "qz-02",
        title: "Inventory Management & Goods Movement (MIGO/MIRO)",
        courseTitle: "SAP MM Functional Consultant Mastery",
        category: "SAP MM",
        score: 92,
        totalQuestions: 20,
        correctAnswers: 18,
        durationMinutes: 15,
        attemptDate: "2026-08-05",
        status: "Passed",
        questionsList: [
          {
            qNumber: 1,
            question: "During MIRO invoice posting, which clearing account is debited when matching against previous Goods Receipt?",
            options: ["GR/IR Clearing Account (WRX)", "Vendor Account (KBS)", "Stock Account (BSX)", "Price Difference Account (PRD)"],
            studentAnswer: "GR/IR Clearing Account (WRX)",
            correctAnswer: "GR/IR Clearing Account (WRX)",
            isCorrect: true,
            explanation: "In MIRO, the GR/IR clearing account is debited to clear the liability created during the 101 MIGO goods receipt.",
          },
        ],
      },
      {
        id: "qz-03",
        title: "Vector Embeddings & Semantic Indexing",
        courseTitle: "JKS Generative AI & Agentic Systems",
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
        description: "AI writing scan verified 88% authentic human code implementation.",
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
    lastActive: "Yesterday",
    tier: "Diamond Scholar",
    performanceRating: 4.8,
    performanceTier: "Top 5% Platform Performer",
    masteryScore: 92,
    learningPace: "High Velocity",
    analytics: {
      totalHoursLearned: 132.0,
      dayStreak: 19,
      completionRate: 88,
      aiInterviewAvgScore: 87,
      totalAssessmentsPassed: 12,
      weeklyStudyHours: [
        { day: "Mon", hours: 4.0 },
        { day: "Tue", hours: 4.5 },
        { day: "Wed", hours: 3.5 },
        { day: "Thu", hours: 5.0 },
        { day: "Fri", hours: 5.5 },
        { day: "Sat", hours: 6.0 },
        { day: "Sun", hours: 3.5 },
      ],
      skillsRadar: [
        { skill: "Java 21 & Spring Boot", score: 94 },
        { skill: "Microservices & Docker", score: 90 },
        { skill: "PostgreSQL & JPA", score: 88 },
        { skill: "System Design", score: 86 },
        { skill: "AI Readiness", score: 85 },
      ],
    },
    courses: [
      {
        courseId: "java-full-stack-mastery",
        courseTitle: "Java Full Stack Enterprise Mastery",
        track: "Java Full Stack",
        progress: 100,
        totalLessons: 64,
        completedLessons: 64,
        hoursSpent: 98,
        lastActive: "2026-08-20",
        grade: "A+ (95%)",
        certificateEarned: true,
        instructorName: "Ananya Sharma (Principal Architect)",
        level: "Advanced",
      },
    ],
    assignments: [
      {
        id: "asg-03",
        title: "High-Throughput Order Management Microservice with Kafka",
        courseTitle: "Java Full Stack Enterprise Mastery",
        courseId: "java-full-stack-mastery",
        submittedAt: "2026-08-10 03:45 PM",
        score: 95,
        status: "Graded",
        assignmentPrompt:
          "Implement an event-driven Order Management Microservice with Spring Boot 3.3, Apache Kafka partition key distribution, distributed Saga transaction orchestration, and Redis caching.",
        studentAnswers: {
          executiveSummary:
            "Engineered an event-driven architecture processing 12,000 orders/sec with idempotent event consumers and outbox pattern to guarantee transactional delivery.",
          methodology:
            "1. Domain-Driven Design: Implemented aggregate root OrderEntity with optimistic locking (@Version).\n2. Debezium Outbox: Decoupled transactional DB updates from Kafka publishing.\n3. Resilience4j: Configured Circuit Breaker and rate limiter on external payment gateway API.",
          codeSolution: {
            language: "java",
            filename: "OrderEventConsumer.java",
            code: `@Service
@RequiredArgsConstructor
@Slf4j
public class OrderEventConsumer {

    private final OrderRepository orderRepository;
    private final InventoryClient inventoryClient;

    @KafkaListener(topics = "orders.created.v1", groupId = "order-fulfillment-group")
    @Transactional
    public void processOrderCreatedEvent(@Payload OrderCreatedEvent event, Acknowledgment ack) {
        log.info("Processing order event for orderId: {}", event.getOrderId());
        
        // Idempotency check
        if (orderRepository.existsById(event.getOrderId())) {
            log.warn("Duplicate event skipped for orderId: {}", event.getOrderId());
            ack.acknowledge();
            return;
        }

        Order order = Order.builder()
                .id(event.getOrderId())
                .status(OrderStatus.PROCESSING)
                .amount(event.getTotalAmount())
                .createdAt(Instant.now())
                .build();

        orderRepository.save(order);
        inventoryClient.reserveStock(event.getItems());
        ack.acknowledge();
    }
}`,
          },
          submittedFiles: ["OrderEventConsumer.java", "KafkaConfig.java", "SagaOrchestrator.java"],
        },
        aiAnalysis: {
          humanScore: 92,
          aiScore: 8,
          verdict: "Authentic Human Work",
          plagiarismRate: 0.9,
          syntacticComplexity: "Advanced",
          confidenceScore: 98.2,
          tokenCount: 2450,
          keyFindings: [
            "Hand-coded Kafka manual acknowledgment and idempotency logic.",
            "High variance in exception recovery patterns consistent with real production code.",
          ],
        },
        rubricBreakdown: [
          { criteria: "Kafka Producer/Consumer Mechanics", maxScore: 40, awardedScore: 38, feedback: "Excellent use of manual ack and partition keys." },
          { criteria: "Distributed Transaction & Saga", maxScore: 30, awardedScore: 29, feedback: "Well structured compensating transactions." },
          { criteria: "Resilience & Circuit Breaking", maxScore: 20, awardedScore: 19, feedback: "Clear fallback routes." },
          { criteria: "Code Cleanliness", maxScore: 10, awardedScore: 9, feedback: "Clean Lombok and logging." },
        ],
        feedback: "Outstanding event-driven implementation. Ready for high-concurrency enterprise load.",
      },
    ],
    quizzes: [
      {
        id: "qz-04",
        title: "Spring Boot 3.x, Virtual Threads & Reactive WebClient",
        courseTitle: "Java Full Stack Enterprise Mastery",
        category: "Java",
        score: 95,
        totalQuestions: 20,
        correctAnswers: 19,
        durationMinutes: 14,
        attemptDate: "2026-08-02",
        status: "Passed",
      },
    ],
    certificates: [
      {
        id: "cert-02",
        courseTitle: "Java Full Stack Enterprise Mastery",
        track: "Java Full Stack",
        verificationId: "CERT-7A44B1",
        issueDate: "2026-08-20",
        grade: "Distinction (95%)",
      },
    ],
    timeline: [
      {
        id: "log-5",
        timestamp: "Yesterday",
        type: "assignment",
        title: "Assignment Graded: Order Microservice with Kafka",
        description: "Scored 95/100 with verified 92% human authenticity.",
        badgeColor: "bg-emerald-500",
      },
    ],
  },
};

export function getStudentProfile(slugOrName: string): DetailedStudentProfile {
  const normalized = slugOrName.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  if (DETAILED_STUDENTS[normalized]) {
    return DETAILED_STUDENTS[normalized];
  }

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
        instructorName: "Senior Architect",
        level: "Intermediate",
      },
    ],
    assignments: [
      {
        id: "asg-gen-01",
        title: "RESTful Microservices & Spring Cloud Gateway Integration",
        courseTitle: "Java Full Stack Enterprise Mastery",
        courseId: "java-full-stack-mastery",
        submittedAt: "2026-08-15 02:20 PM",
        score: 88,
        status: "Graded",
        assignmentPrompt: "Configure Spring Cloud Gateway with custom route filter, JWT authorization and circuit breaker fallback routes.",
        studentAnswers: {
          executiveSummary: "Built and tested Spring Cloud Gateway with reactive route predicates and Redis token bucket rate limiting.",
          methodology: "Implemented GlobalFilter and GatewayFilterFactory with JWT claim validation and Resilience4j circuit breakers.",
          codeSolution: {
            language: "java",
            filename: "JwtAuthenticationFilter.java",
            code: `@Component
public class JwtAuthenticationFilter extends AbstractGatewayFilterFactory<JwtAuthenticationFilter.Config> {
    @Override
    public GatewayFilter apply(Config config) {
        return (exchange, chain) -> {
            String token = exchange.getRequest().getHeaders().getFirst("Authorization");
            if (token == null || !token.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }
            return chain.filter(exchange);
        };
    }
}`,
          },
          submittedFiles: ["JwtAuthenticationFilter.java", "application.yml"],
        },
        aiAnalysis: {
          humanScore: 91,
          aiScore: 9,
          verdict: "Authentic Human Work",
          plagiarismRate: 1.5,
          syntacticComplexity: "Advanced",
          confidenceScore: 97.5,
          tokenCount: 1980,
          keyFindings: [
            "Original custom route predicates and circuit breaker filters.",
            "Author's unique variable naming and code style consistent throughout.",
          ],
        },
        rubricBreakdown: [
          { criteria: "Gateway Configuration", maxScore: 50, awardedScore: 45, feedback: "Good reactive filter implementation." },
          { criteria: "Security & Rate Limiting", maxScore: 50, awardedScore: 43, feedback: "Effective token bucket parameters." },
        ],
        feedback: "Solid architecture and clear documentation of JWT filter chain.",
      },
    ],
    quizzes: [
      {
        id: "qz-gen-01",
        title: "Spring Security & OAuth2 Protocols",
        courseTitle: "Java Full Stack Enterprise Mastery",
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
