/**
 * Client-side mirror of the backend scaffolding rules (backend/src/common/
 * coding-question.ts) so authors get feedback while typing. The server is the
 * authority and validates again on save.
 */

export const CODING_LANGUAGE_OPTIONS = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "cpp", label: "C++" },
  { id: "csharp", label: "C#" },
  { id: "sql", label: "SQL" },
  { id: "abap", label: "SAP ABAP" },
] as const;

const norm = (s: string) => s.replace(/\s+/g, " ").trim();

function codeLines(code: string): string[] {
  return code
    .split(/\r?\n/)
    .map(norm)
    .filter((l) => l && !/^(\/\/|#|\*|\/\*|"\*)/.test(l));
}

/** Share (0..1) of the solution's lines that the starter code already provides. */
export function scaffoldRatio(starter: string, reference: string): number {
  const ref = codeLines(reference);
  if (ref.length === 0) return 0;
  const have = new Set(codeLines(starter));
  return ref.filter((l) => have.has(l)).length / ref.length;
}

export function scaffoldingProblems(starter: string, reference: string): string[] {
  const problems: string[] = [];
  if (!starter.trim()) return ["Add starter code."];
  if (!/TODO/i.test(starter)) problems.push("Mark what the student must complete with a TODO comment.");
  if (reference.trim()) {
    if (norm(starter) === norm(reference)) {
      problems.push("The starter code is identical to the solution.");
    } else {
      const r = scaffoldRatio(starter, reference);
      if (r < 0.2) problems.push("The starter code gives almost no scaffolding.");
      if (r > 0.9) problems.push("The starter code leaves almost nothing for the student to complete.");
    }
  }
  return problems;
}

/** Maps a question's language label ("Java", "C++", "SAP ABAP"...) to a supported id. */
export function toLanguageId(raw: string | undefined, fallbackText = ""): string {
  const text = `${raw ?? ""} ${fallbackText}`.toLowerCase();
  if (/abap|sap/.test(text)) return "abap";
  if (/typescript|\bts\b/.test(text)) return "typescript";
  if (/javascript|node|\bjs\b/.test(text)) return "javascript";
  if (/python|\bpy\b/.test(text)) return "python";
  if (/c\+\+|cpp/.test(text)) return "cpp";
  if (/c#|csharp|\.net/.test(text)) return "csharp";
  if (/\bsql\b/.test(text)) return "sql";
  if (/java/.test(text)) return "java";
  return "javascript";
}
