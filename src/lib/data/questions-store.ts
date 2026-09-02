export interface Question {
  id: string;
  category:
    | "Java Full Stack"
    | "React 19 & Next.js"
    | "Spring Boot Microservices"
    | "Data Structures & Algorithms"
    | "System Design"
    | "SAP S/4HANA"
    | ".NET 9";
  difficulty: "Easy" | "Medium" | "Hard";
  type: "MCQ" | "Multi-Select" | "Code Snippet";
  questionText: string;
  codeSnippet?: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
  explanation: string;
  createdAt: string;
}

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: "Q-101",
    category: "Java Full Stack",
    difficulty: "Medium",
    type: "Code Snippet",
    questionText: "What is the result of executing the following Spring Boot concurrent transaction under Optimistic Locking?",
    codeSnippet: `@Transactional\npublic void processOrder(Long orderId) {\n  Order order = orderRepo.findByIdWithLock(orderId);\n  order.setStatus(OrderStatus.CONFIRMED);\n  orderRepo.save(order);\n}`,
    options: [
      "Throws OptimisticLockException if version timestamp mismatches on commit",
      "Locks the database table with an exclusive table lock",
      "Silently overwrites the conflicting record with last write wins",
      "Automatically retries indefinitely until success",
    ],
    correctOptionIndex: 0,
    marks: 5,
    explanation: "Optimistic locking checks the @Version entity field during transaction commit and throws OptimisticLockException when concurrent modification occurs.",
    createdAt: "2026-08-20T10:00:00Z",
  },
  {
    id: "Q-102",
    category: "React 19 & Next.js",
    difficulty: "Hard",
    type: "MCQ",
    questionText: "In React 19 and Next.js 15 App Router, what is the primary purpose of the useActionState hook?",
    options: [
      "Manage form state transitions and async action results seamlessly without manual loading booleans",
      "Cache global server components in client memory",
      "Trigger client-side router navigation",
      "Replace React Context for all deep prop drilling",
    ],
    correctOptionIndex: 0,
    marks: 5,
    explanation: "useActionState manages pending state, returned action results, and optimistic states for Server Actions without boilerplate useEffect or useState.",
    createdAt: "2026-08-22T14:00:00Z",
  },
  {
    id: "Q-103",
    category: "System Design",
    difficulty: "Hard",
    type: "MCQ",
    questionText: "Which architecture pattern guarantees eventual consistency across independent microservice databases without distributed 2PC locks?",
    options: [
      "Saga Pattern with Orchestration / Choreography",
      "Single Monolithic Shared Database",
      "Synchronous REST Cascades",
      "Database Triggers across remote network hosts",
    ],
    correctOptionIndex: 0,
    marks: 10,
    explanation: "The Saga Pattern coordinates a sequence of local transactions with compensating rollback actions to maintain consistency without blocking locks.",
    createdAt: "2026-08-25T11:00:00Z",
  },
  {
    id: "Q-104",
    category: "Data Structures & Algorithms",
    difficulty: "Easy",
    type: "MCQ",
    questionText: "What is the average time complexity of searching and inserting an element in a balanced Red-Black Tree?",
    options: ["O(log N)", "O(1)", "O(N)", "O(N log N)"],
    correctOptionIndex: 0,
    marks: 2,
    explanation: "Red-Black Trees maintain logarithmic tree height guarantees, ensuring O(log N) worst and average search/insert times.",
    createdAt: "2026-08-26T09:00:00Z",
  },
  {
    id: "Q-105",
    category: "SAP S/4HANA",
    difficulty: "Medium",
    type: "MCQ",
    questionText: "In SAP ABAP RESTful Application Programming Model (RAP), what layer defines the core business logic and behavioral validations?",
    options: [
      "Behavior Definition (BDEF) and Implementation Classes",
      "CDS View Entities (Data Layer only)",
      "SAP Fiori Elements Floorplan",
      "SAP Gateway OData Service Binding",
    ],
    correctOptionIndex: 0,
    marks: 5,
    explanation: "RAP Behavior Definitions (BDEF) declare CRUD operations, validations, actions, and determinations executed by the ABAP runtime.",
    createdAt: "2026-08-28T16:00:00Z",
  },
];

const QUESTIONS_STORAGE_KEY = "jks_questions_store_v1";

export function getStoredQuestions(): Question[] {
  if (typeof window === "undefined") return INITIAL_QUESTIONS;
  try {
    const raw = localStorage.getItem(QUESTIONS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(INITIAL_QUESTIONS));
      return INITIAL_QUESTIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_QUESTIONS;
  }
}

export function saveStoredQuestions(questions: Question[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (err) {
    console.error("Failed to save questions:", err);
  }
}

export function addQuestion(q: Omit<Question, "id" | "createdAt">): Question {
  const current = getStoredQuestions();
  const newQ: Question = {
    ...q,
    id: `Q-${Math.floor(200 + Math.random() * 800)}`,
    createdAt: new Date().toISOString(),
  };

  const updated = [newQ, ...current];
  saveStoredQuestions(updated);
  return newQ;
}

export function deleteQuestion(id: string): void {
  const current = getStoredQuestions();
  const updated = current.filter((q) => q.id !== id);
  saveStoredQuestions(updated);
}
