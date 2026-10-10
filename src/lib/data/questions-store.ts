import { apiFetch } from "@/lib/api/base-url";

export interface Question {
  id: string;
  category: string;
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

export type NewQuestion = Omit<Question, "id" | "createdAt">;

/**
 * The Question Bank lives in the database (/admin/question-bank), so every admin
 * sees the same questions and clearing a browser deletes nothing. It used to be
 * kept only in this browser's localStorage under `jks_questions_store_v1`.
 */

// Legacy browser-only storage. Read once to migrate, then removed.
const LEGACY_STORAGE_KEY = "jks_questions_store_v1";
// Sample questions the old store seeded into every browser; not real content.
const LEGACY_SEED_IDS = new Set(["Q-101", "Q-102", "Q-103", "Q-104", "Q-105"]);

async function readError(res: Response, fallback: string): Promise<string> {
  const data = await res.json().catch(() => ({}));
  const message = data?.message;
  if (Array.isArray(message)) return message.join(", ");
  return typeof message === "string" && message ? message : fallback;
}

async function postQuestion(q: NewQuestion): Promise<Question> {
  const res = await apiFetch("/admin/question-bank", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(q),
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not save the question to the question bank."));
  }
  return res.json();
}

/** One-time move of questions an admin had saved only in this browser. */
async function migrateLegacyQuestions(): Promise<void> {
  if (typeof window === "undefined") return;
  let legacy: Question[] = [];
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    legacy = Array.isArray(parsed) ? parsed : [];
  } catch {
    return;
  }

  const own = legacy.filter((q) => q && !LEGACY_SEED_IDS.has(q.id));
  try {
    // Only drop the local copy once every question is safely in the database.
    for (const q of own) {
      const { id: _id, createdAt: _createdAt, ...payload } = q;
      await postQuestion(payload);
    }
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch (err) {
    console.warn("Could not migrate local question bank to the server yet:", err);
  }
}

export async function fetchQuestions(): Promise<Question[]> {
  await migrateLegacyQuestions();
  const res = await apiFetch("/admin/question-bank", {
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not load the question bank."));
  }
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

export async function addQuestion(q: NewQuestion): Promise<Question> {
  return postQuestion(q);
}

export async function deleteQuestion(id: string): Promise<void> {
  const res = await apiFetch(`/admin/question-bank/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error(await readError(res, "Could not delete the question."));
  }
}
