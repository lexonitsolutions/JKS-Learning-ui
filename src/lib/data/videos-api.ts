import { apiFetch, apiUrl } from "@/lib/api/base-url";

export interface DirectUploadTicket {
  uploadUrl: string;
  videoUid: string;
  videoId?: string;
  libraryId?: string;
  accessKey?: string;
  playbackUrl?: string;
  iframeEmbedUrl?: string;
  thumbnailUrl?: string;
  authorizationSignature?: string;
  authorizationExpire?: number;
  tusEndpoint?: string;
  expiresAt: string;
}

export interface VideoMetadata {
  id: string;
  uid: string;
  bunnyVideoId?: string;
  bunnyLibraryId?: string;
  title: string;
  durationSeconds: number;
  status:
    | "pendingupload"
    | "uploading"
    | "downloading"
    | "queued"
    | "processing"
    | "inprogress"
    | "transcoding"
    | "ready"
    | "error"
    | "failed";
  playbackUrl: string;
  thumbnailUrl: string;
  hlsManifestUrl: string;
  dashManifestUrl?: string;
  iframeEmbedUrl: string;
  mp4Url?: string;
  isFreeDemo: boolean;
  createdAt: string;
}

export interface CreateDirectUploadParams {
  title: string;
  courseId?: string;
  moduleId?: string;
  topicId?: string;
  maxDurationSeconds?: number;
  isFreeDemo?: boolean;
}

/**
 * Step 1: Request a one-time Direct Creator Upload ticket from backend API
 */
export async function requestDirectUploadTicket(
  params: CreateDirectUploadParams
): Promise<DirectUploadTicket> {
  const res = await apiFetch("/videos/direct-upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to request direct upload ticket: ${errorText || res.statusText}`);
  }

  return res.json();
}

/**
 * Step 2: Upload large video file directly from browser to Bunny Stream
 * Uses direct binary HTTP PUT or TUS protocol without overloading the NestJS backend.
 */
export function uploadVideoToBunnyStream(
  ticket: DirectUploadTicket,
  file: File,
  onProgress?: (progressPercent: number, bytesUploaded: number, totalBytes: number) => void
): Promise<{ success: boolean; videoUid: string; playbackUrl?: string; iframeEmbedUrl?: string; thumbnailUrl?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const targetUrl = ticket.uploadUrl;

    xhr.open("PUT", targetUrl, true);
    xhr.setRequestHeader("Content-Type", "application/octet-stream");
    if (ticket.accessKey) {
      xhr.setRequestHeader("AccessKey", ticket.accessKey);
    }

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent, event.loaded, event.total);
        }
      };
    }

    xhr.onload = () => {
      // Bunny Stream returns 200/201 on successful upload
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({
          success: true,
          videoUid: ticket.videoUid || ticket.videoId || "",
          playbackUrl: ticket.playbackUrl,
          iframeEmbedUrl: ticket.iframeEmbedUrl,
          thumbnailUrl: ticket.thumbnailUrl,
        });
      } else {
        // Fallback for mock/local development demo endpoints
        if (targetUrl.includes("demo")) {
          resolve({
            success: true,
            videoUid: ticket.videoUid || ticket.videoId || "",
            playbackUrl: ticket.playbackUrl,
            iframeEmbedUrl: ticket.iframeEmbedUrl,
            thumbnailUrl: ticket.thumbnailUrl,
          });
          return;
        }
        reject(
          new Error(
            `Bunny Stream upload failed with HTTP status ${xhr.status}: ${xhr.statusText || "Upload rejected"}`
          )
        );
      }
    };

    xhr.onerror = () => {
      // In local development or mock environments, resolve gracefully
      if (targetUrl.includes("demo") || targetUrl.includes("localhost")) {
        resolve({
          success: true,
          videoUid: ticket.videoUid || ticket.videoId || "",
          playbackUrl: ticket.playbackUrl,
          iframeEmbedUrl: ticket.iframeEmbedUrl,
          thumbnailUrl: ticket.thumbnailUrl,
        });
        return;
      }
      reject(new Error("Network error during Bunny Stream video upload."));
    };

    xhr.send(file);
  });
}


/**
 * Step 3: Fetch video status & streaming URLs from Bunny Stream
 */
export async function fetchVideoDetails(videoId: string): Promise<VideoMetadata> {
  const res = await apiFetch(`/videos/${videoId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch video details for ${videoId}`);
  }
  return res.json();
}

export interface BunnyReadinessStatus {
  isReady: boolean;
  isProcessing: boolean;
  isError: boolean;
  statusText: string;
}

/**
 * Checks Bunny Stream embed URL directly or via backend API.
 * Bunny Stream's embed endpoints respond with Access-Control-Allow-Origin: *
 * When transcoding: returns page with "Processing video" or temporary 500 error.
 * When finished: returns rich player HTML (>3000 bytes, no "Processing video").
 */
export async function checkBunnyEmbedStatus(embedUrl: string): Promise<BunnyReadinessStatus> {
  if (!embedUrl) {
    return { isReady: false, isProcessing: false, isError: true, statusText: "No embed URL provided" };
  }

  // 1. Try fetching the embed HTML (cross-origin CORS is enabled by Bunny)
  try {
    const res = await fetch(embedUrl, {
      method: "GET",
      cache: "no-store",
    });

    if (res.status === 500 || res.status === 502 || res.status === 503 || res.status === 504) {
      return {
        isReady: false,
        isProcessing: true,
        isError: true,
        statusText: `Bunny CDN status ${res.status}: Initializing stream cluster`,
      };
    }

    const html = await res.text();

    // Check for 500 error page inside Bunny embed
    if (/<h1>\s*500\s*<\/h1>/i.test(html) || /<title>.*500.*<\/title>/i.test(html)) {
      return {
        isReady: false,
        isProcessing: true,
        isError: true,
        statusText: "Bunny CDN 500: Stream initializing",
      };
    }

    // Check for Processing video placeholder
    if (/Processing\s+video/i.test(html)) {
      return {
        isReady: false,
        isProcessing: true,
        isError: false,
        statusText: "Processing video on Bunny CDN (Encoding multi-resolution streams)",
      };
    }

    // Ready player HTML
    if (html.length > 3000 && !/Processing\s+video/i.test(html)) {
      return {
        isReady: true,
        isProcessing: false,
        isError: false,
        statusText: "Ready",
      };
    }

    // Default processing if neither ready nor explicit error
    return {
      isReady: false,
      isProcessing: true,
      isError: false,
      statusText: "Processing stream...",
    };
  } catch (err: any) {
    // If direct fetch fails, fallback to backend details check if videoId is present
    const guidMatch = embedUrl.match(/[0-9a-fA-F-]{36}/);
    if (guidMatch && guidMatch[0]) {
      try {
        const details = await fetchVideoDetails(guidMatch[0]);
        if (details.status === "ready") {
          return { isReady: true, isProcessing: false, isError: false, statusText: "Ready" };
        }
        return {
          isReady: false,
          isProcessing:
            details.status === "processing" ||
            details.status === "inprogress" ||
            details.status === "uploading" ||
            details.status === "queued" ||
            details.status === "transcoding",
          isError: details.status === "error" || details.status === "failed",
          statusText: "Encoding on Bunny CDN",
        };
      } catch {}
    }

    return {
      isReady: false,
      isProcessing: true,
      isError: false,
      statusText: "Checking stream status...",
    };
  }
}

