import { apiFetch, ApiError } from "./base-url";

export interface SubmissionFileRef {
  id: string;
  name: string;
  size: number;
  /** Root-relative API path, e.g. /assessments/files/<id>. */
  url: string;
}

export const MAX_SUBMISSION_FILE_BYTES = 8 * 1024 * 1024;

/**
 * Turns any non-JSON failure into a readable message. A gateway, firewall or
 * school/office network filter answers blocked requests with an HTML page
 * ("403 Forbidden"), which used to surface as a raw error page or "[object]".
 */
async function failureMessage(res: Response, fallback: string): Promise<string> {
  const type = res.headers.get("content-type") || "";
  if (type.includes("application/json")) {
    const body = await res.json().catch(() => null);
    const m = Array.isArray(body?.message) ? body.message.join(" ") : body?.message;
    if (m) return String(m);
  }
  if (res.status === 403 && !type.includes("application/json")) {
    return "The upload was blocked before it reached JKS Learning (usually a network firewall, VPN or ad-blocker). Try another network or turn the VPN/blocker off, then upload again.";
  }
  if (res.status === 413) return "That file is too large. The maximum size is 8 MB.";
  if (res.status === 401) return "Your session expired. Please sign in again and retry.";
  return `${fallback} (HTTP ${res.status}).`;
}

/** Upload a student's answer file; resolves with a reference to store in the submission. */
export async function uploadSubmissionFile(file: File): Promise<SubmissionFileRef> {
  if (file.size > MAX_SUBMISSION_FILE_BYTES) {
    throw new Error("That file is larger than 8 MB. Please compress it (for example into a .zip) and try again.");
  }
  const form = new FormData();
  form.append("file", file);

  let lastError: unknown;
  // One retry covers a dropped connection or a cold-starting API.
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await apiFetch("/assessments/files", { method: "POST", body: form });
      if (!res.ok) {
        // Do not retry rejections that retrying cannot fix.
        throw Object.assign(new Error(await failureMessage(res, "Upload failed")), { fatal: res.status < 500 });
      }
      return (await res.json()) as SubmissionFileRef;
    } catch (err) {
      lastError = err;
      if ((err as { fatal?: boolean }).fatal) break;
    }
  }
  if (lastError instanceof ApiError) throw new Error("Could not reach the server. Check your connection and try again.");
  throw lastError instanceof Error ? lastError : new Error("Upload failed.");
}

/** True for links this app can open (our API paths and normal web links). */
export function isOpenableFileUrl(url?: string | null): url is string {
  return Boolean(url) && (/^\/assessments\/files\/[a-f0-9]{24}$/i.test(url!) || /^https?:\/\//i.test(url!));
}

/** Preview in a new tab, or save to disk. Needs the signed-in session, so it goes through apiFetch. */
export async function openSubmissionFile(url: string, name: string, mode: "preview" | "download"): Promise<void> {
  if (/^https?:\/\//i.test(url)) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }
  // Open the tab first (inside the click) so popup blockers allow it.
  const tab = mode === "preview" ? window.open("", "_blank") : null;
  try {
    const res = await apiFetch(`${url}${mode === "download" ? "?download=1" : ""}`);
    if (!res.ok) throw new Error(await failureMessage(res, "Could not open the file"));
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    if (mode === "preview" && tab) {
      tab.location.href = objectUrl;
    } else {
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = name || "submission";
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
    setTimeout(() => URL.revokeObjectURL(objectUrl), 60_000);
  } catch (err) {
    tab?.close();
    throw err instanceof Error ? err : new Error("Could not open the file.");
  }
}
