/**
 * Minimal resumable TUS 1.0 client for Bunny Stream.
 *
 * Bunny authorises each request with a short-lived signature header set derived
 * on the server, so the library API key never reaches the browser. Chunks are
 * sent with XMLHttpRequest (fetch has no upload progress) and a failed chunk is
 * retried from the offset the server reports, so a dropped connection resumes
 * instead of restarting a large file.
 */
import type { TusTicket } from "@/lib/data/success-stories-api";

const CHUNK_BYTES = 8 * 1024 * 1024;
const MAX_RETRIES = 4;

export class UploadAbortedError extends Error {
  constructor() {
    super("Upload cancelled.");
    this.name = "UploadAbortedError";
  }
}

interface XhrResult {
  status: number;
  header: (name: string) => string | null;
}

function xhr(
  method: string,
  url: string,
  headers: Record<string, string>,
  body: Blob | null,
  signal: AbortSignal,
  onProgress?: (loaded: number) => void,
): Promise<XhrResult> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) return reject(new UploadAbortedError());
    const req = new XMLHttpRequest();
    req.open(method, url, true);
    for (const [k, v] of Object.entries(headers)) req.setRequestHeader(k, v);
    if (onProgress) req.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded);
    req.onload = () => resolve({ status: req.status, header: (n) => req.getResponseHeader(n) });
    req.onerror = () => reject(new Error("Network error during upload."));
    req.ontimeout = () => reject(new Error("The upload timed out."));
    const onAbort = () => {
      req.abort();
      reject(new UploadAbortedError());
    };
    signal.addEventListener("abort", onAbort, { once: true });
    req.onloadend = () => signal.removeEventListener("abort", onAbort);
    req.send(body);
  });
}

const b64 = (s: string) => btoa(unescape(encodeURIComponent(s)));

export async function tusUpload(opts: {
  file: File;
  ticket: TusTicket;
  signal: AbortSignal;
  onProgress: (percent: number) => void;
}): Promise<void> {
  const { file, ticket, signal, onProgress } = opts;
  const auth = {
    "Tus-Resumable": "1.0.0",
    AuthorizationSignature: ticket.signature,
    AuthorizationExpire: String(ticket.expire),
    VideoId: ticket.videoId,
    LibraryId: ticket.libraryId,
  };

  const created = await xhr(
    "POST",
    ticket.tusEndpoint,
    {
      ...auth,
      "Upload-Length": String(file.size),
      "Upload-Metadata": `filetype ${b64(file.type || "video/mp4")},title ${b64(file.name)}`,
    },
    null,
    signal,
  );
  const location = created.header("Location");
  if (created.status !== 201 || !location) {
    throw new Error(`The video host rejected the upload (HTTP ${created.status}).`);
  }
  const uploadUrl = new URL(location, ticket.tusEndpoint).toString();

  let offset = 0;
  let failures = 0;
  while (offset < file.size) {
    const end = Math.min(offset + CHUNK_BYTES, file.size);
    try {
      const res = await xhr(
        "PATCH",
        uploadUrl,
        { ...auth, "Upload-Offset": String(offset), "Content-Type": "application/offset+octet-stream" },
        file.slice(offset, end),
        signal,
        (loaded) => onProgress(Math.min(99, Math.round(((offset + loaded) / file.size) * 100))),
      );
      if (res.status !== 204) throw new Error(`Chunk rejected (HTTP ${res.status}).`);
      offset = Number(res.header("Upload-Offset")) || end;
      failures = 0;
      onProgress(Math.min(99, Math.round((offset / file.size) * 100)));
    } catch (err) {
      if (err instanceof UploadAbortedError) throw err;
      if (++failures > MAX_RETRIES) throw err instanceof Error ? err : new Error("Upload failed.");
      await new Promise((r) => setTimeout(r, 1000 * failures));
      // Resume from whatever the server actually received.
      try {
        const head = await xhr("HEAD", uploadUrl, auth, null, signal);
        const serverOffset = Number(head.header("Upload-Offset"));
        if (head.status === 200 && Number.isFinite(serverOffset)) offset = serverOffset;
      } catch (headErr) {
        if (headErr instanceof UploadAbortedError) throw headErr;
      }
    }
  }
  onProgress(100);
}
