/**
 * Task prompts are often pasted from a PDF/Word document as one long run with
 * dashed dividers. Turn the dividers into line breaks (and split obvious
 * parts/steps) so the text keeps the document's structure. Render the result
 * inside an element with `whitespace-pre-wrap` so line breaks and indentation
 * are preserved.
 */
export function formatQuestionPrompt(raw: string): string {
  let text = String(raw || "").replace(/\r\n/g, "\n");
  text = text.replace(/[ \t]*-{5,}[ \t]*/g, "\n");
  if (!text.includes("\n")) {
    text = text
      .replace(/\s+(?=PART \d+\s*:)/g, "\n")
      .replace(/\s+(?=SUBMISSION INSTRUCTIONS\s*:)/gi, "\n")
      .replace(/\s+(?=\d+\.\s+[A-Z])/g, "\n");
  }
  return text.replace(/\n{3,}/g, "\n\n").trim();
}
