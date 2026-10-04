import { TaskQuestion } from "./tasks-api";

export interface QuestionEvaluation {
  id: string;
  type: string;
  prompt: string;
  maxPoints: number;
  earnedPoints: number;
  isCorrect: boolean;
  studentAnswer: any;
  studentAnswerText: string;
  correctAnswerText: string;
  studentChoiceIdx: number | null;
  correctChoiceIdx: number | null;
  matchScore: number | null;
}

export interface AssessmentEvaluationResult {
  score: number;
  totalEarned: number;
  totalMax: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  evaluations: QuestionEvaluation[];
}

/**
 * Checks if task genuinely specifies required files (not an empty array or empty string).
 */
export function hasTaskExplicitFiles(files: any): boolean {
  if (!files) return false;
  if (Array.isArray(files)) {
    return files.some(
      (f) => typeof f === "string" && f.trim().length > 0 && f.trim() !== "[]" && f.trim().toLowerCase() !== "none"
    );
  }
  if (typeof files === "string") {
    const trimmed = files.trim();
    return (
      trimmed.length > 0 &&
      trimmed !== "[]" &&
      trimmed.toLowerCase() !== "none" &&
      trimmed.toLowerCase() !== "null"
    );
  }
  return false;
}

/**
 * Evaluates a single question against student's answer.
 */
export function evaluateQuestionAnswer(
  q: TaskQuestion,
  studentAns: any,
  uploadedFileName?: string
): QuestionEvaluation {
  const maxPts = q.maxPoints && q.maxPoints > 0 ? q.maxPoints : q.type === "LONG_ANSWER" ? 20 : 10;
  const isMcq = q.type === "MCQ";

  if (isMcq) {
    const choices = q.choices || [];
    let studentChoiceIdx: number | null = null;
    let studentAnswerText = "";

    if (typeof studentAns === "number") {
      studentChoiceIdx = studentAns;
      studentAnswerText = choices[studentAns] || `Option ${studentAns + 1}`;
    } else if (typeof studentAns === "string" && /^\d+$/.test(studentAns.trim())) {
      const idx = parseInt(studentAns.trim(), 10);
      studentChoiceIdx = idx;
      studentAnswerText = choices[idx] || `Option ${idx + 1}`;
    } else if (typeof studentAns === "string" && studentAns.trim().length > 0) {
      studentAnswerText = studentAns.trim();
      const matchedIdx = choices.findIndex(
        (c) => c.trim().toLowerCase() === studentAns.trim().toLowerCase()
      );
      if (matchedIdx !== -1) {
        studentChoiceIdx = matchedIdx;
      }
    }

    let correctChoiceIdx: number | null = null;
    let correctAnswerText = "";

    if (typeof q.correctAnswer === "number") {
      correctChoiceIdx = q.correctAnswer;
      correctAnswerText = choices[q.correctAnswer] || `Option ${q.correctAnswer + 1}`;
    } else if (typeof q.correctAnswer === "string" && /^\d+$/.test(String(q.correctAnswer).trim())) {
      const idx = parseInt(String(q.correctAnswer).trim(), 10);
      correctChoiceIdx = idx;
      correctAnswerText = choices[idx] || `Option ${idx + 1}`;
    } else if (typeof q.correctAnswer === "string" && String(q.correctAnswer).trim().length > 0) {
      correctAnswerText = String(q.correctAnswer).trim();
      const matchedIdx = choices.findIndex(
        (c) => c.trim().toLowerCase() === String(q.correctAnswer).trim().toLowerCase()
      );
      if (matchedIdx !== -1) {
        correctChoiceIdx = matchedIdx;
      }
    }

    const isAnswered = studentChoiceIdx !== null || studentAnswerText.length > 0;
    const isCorrect =
      isAnswered &&
      ((studentChoiceIdx !== null && correctChoiceIdx !== null && studentChoiceIdx === correctChoiceIdx) ||
        (studentAnswerText.length > 0 &&
          correctAnswerText.length > 0 &&
          studentAnswerText.toLowerCase() === correctAnswerText.toLowerCase()));

    return {
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      maxPoints: maxPts,
      earnedPoints: isCorrect ? maxPts : 0,
      isCorrect,
      studentAnswer: studentAns,
      studentAnswerText: studentAnswerText || "(No answer selected)",
      correctAnswerText: correctAnswerText || "Not specified",
      studentChoiceIdx,
      correctChoiceIdx,
      matchScore: isCorrect ? 100 : 0,
    };
  }

  if (q.type === "FILE_UPLOAD") {
    const file = studentAns || uploadedFileName;
    const isProvided = typeof file === "string" && file.trim().length > 0;
    return {
      id: q.id,
      type: q.type,
      prompt: q.prompt,
      maxPoints: maxPts,
      earnedPoints: isProvided ? maxPts : 0,
      isCorrect: isProvided,
      studentAnswer: file,
      studentAnswerText: isProvided ? String(file) : "(No file uploaded)",
      correctAnswerText: "Valid solution file uploaded",
      studentChoiceIdx: null,
      correctChoiceIdx: null,
      matchScore: isProvided ? 100 : 0,
    };
  }

  // SHORT_ANSWER / LONG_ANSWER
  const text = typeof studentAns === "string" ? studentAns.trim() : "";
  const isAnswered = text.length > 0;
  let matchScore = 0;
  let isCorrect = false;
  let earned = 0;

  if (isAnswered) {
    if (q.modelAnswer && q.modelAnswer.trim().length > 0) {
      const modelWords = q.modelAnswer
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 3);

      if (modelWords.length > 0) {
        const studentLower = text.toLowerCase();
        let matches = 0;
        modelWords.forEach((w) => {
          if (studentLower.includes(w)) matches++;
        });
        const ratio = matches / modelWords.length;
        matchScore = Math.min(100, Math.round(ratio * 100));

        if (ratio >= 0.5) {
          isCorrect = true;
          earned = maxPts;
        } else if (ratio >= 0.25) {
          isCorrect = true;
          earned = Math.round(maxPts * 0.5);
        } else {
          // Meaningless or unrelated text
          isCorrect = false;
          earned = 0;
        }
      } else {
        // Model answer has no distinctive keywords, credit if substantial response provided
        isCorrect = text.length >= 10;
        earned = isCorrect ? maxPts : 0;
        matchScore = isCorrect ? 80 : 20;
      }
    } else {
      // No model answer configured by faculty: tentative provisional points if meaningful
      isCorrect = text.length >= 5;
      earned = isCorrect ? maxPts : 0;
      matchScore = isCorrect ? 75 : 0;
    }
  }

  return {
    id: q.id,
    type: q.type,
    prompt: q.prompt,
    maxPoints: maxPts,
    earnedPoints: earned,
    isCorrect,
    studentAnswer: text,
    studentAnswerText: text || "(No answer submitted)",
    correctAnswerText: q.modelAnswer || "Instructor evaluation required",
    studentChoiceIdx: null,
    correctChoiceIdx: null,
    matchScore,
  };
}

/**
 * Evaluates all questions in an assessment and computes an accurate, unmocked score.
 */
export function evaluateAssessmentSubmission(
  questions: TaskQuestion[],
  answers: Record<string, any>,
  uploadedFileName?: string
): AssessmentEvaluationResult {
  if (!questions || questions.length === 0) {
    return {
      score: 0,
      totalEarned: 0,
      totalMax: 0,
      correctCount: 0,
      incorrectCount: 0,
      unansweredCount: 0,
      evaluations: [],
    };
  }

  let totalEarned = 0;
  let totalMax = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;
  const evaluations: QuestionEvaluation[] = [];

  questions.forEach((q, idx) => {
    const studentAns =
      answers[q.id] !== undefined
        ? answers[q.id]
        : answers[idx] !== undefined
        ? answers[idx]
        : answers[String(idx)];

    const evaluation = evaluateQuestionAnswer(q, studentAns, uploadedFileName);
    evaluations.push(evaluation);

    totalEarned += evaluation.earnedPoints;
    totalMax += evaluation.maxPoints;

    if (!studentAns && studentAns !== 0) {
      unansweredCount++;
      incorrectCount++;
    } else if (evaluation.isCorrect) {
      correctCount++;
    } else {
      incorrectCount++;
    }
  });

  const score = totalMax > 0 ? Math.round((totalEarned / totalMax) * 100) : 0;

  return {
    score,
    totalEarned,
    totalMax,
    correctCount,
    incorrectCount,
    unansweredCount,
    evaluations,
  };
}
