/**
 * Keeps the resume file a student uploaded in THEIR browser only (localStorage).
 * It is never sent anywhere for storage: the server reads the file in memory to
 * extract the text and discards it.
 */
const KEY = "jks_resume_source_v1";

/** localStorage allows ~5 MB per site, shared with the resume itself. Base64 adds a third. */
export const MAX_STORED_FILE_BYTES = 1_500_000;

export interface StoredResumeSource {
  name: string;
  type: string;
  size: number;
  savedAt: string;
  /** The file as a data URL. */
  dataUrl: string;
}

export function getResumeSource(): StoredResumeSource | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v.name === "string" && typeof v.dataUrl === "string" ? (v as StoredResumeSource) : null;
  } catch {
    return null;
  }
}

export function removeResumeSource(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* storage blocked */
  }
}

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error("Could not read the file."));
    reader.readAsDataURL(file);
  });
}

export type SaveResult = { saved: true } | { saved: false; reason: string };

/** Saves a copy of the file in this browser. Never throws; reports why it could not. */
export async function saveResumeSource(file: File): Promise<SaveResult> {
  if (file.size > MAX_STORED_FILE_BYTES) {
    return {
      saved: false,
      reason: `The file is larger than ${(MAX_STORED_FILE_BYTES / 1_000_000).toFixed(1)} MB, which is more than this browser can keep.`,
    };
  }
  try {
    const record: StoredResumeSource = {
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      savedAt: new Date().toISOString(),
      dataUrl: await readAsDataUrl(file),
    };
    localStorage.setItem(KEY, JSON.stringify(record));
    return { saved: true };
  } catch {
    return { saved: false, reason: "This browser has no room left (or blocks storage), so a copy could not be kept." };
  }
}

/** Triggers a download of the stored copy. */
export function downloadResumeSource(src: StoredResumeSource): void {
  const a = document.createElement("a");
  a.href = src.dataUrl;
  a.download = src.name;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
