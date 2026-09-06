import { apiFetch, apiUrl } from "@/lib/api/base-url";

export interface DirectUploadTicket {
  uploadUrl: string;
  videoUid: string;
  expiresAt: string;
}

export interface VideoMetadata {
  id: string;
  uid: string;
  title: string;
  durationSeconds: number;
  status: "pendingupload" | "downloading" | "queued" | "inprogress" | "ready" | "error";
  playbackUrl: string;
  thumbnailUrl: string;
  hlsManifestUrl: string;
  dashManifestUrl: string;
  iframeEmbedUrl: string;
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
 * Step 2: Upload large video file directly from the browser to Cloudflare Stream
 * without bottlenecking the NestJS backend server.
 */
export function uploadVideoToCloudflare(
  uploadUrl: string,
  file: File,
  onProgress?: (progressPercent: number, bytesUploaded: number, totalBytes: number) => void
): Promise<{ success: boolean; videoUid?: string }> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append("file", file);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadUrl, true);

    if (xhr.upload && onProgress) {
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = Math.round((event.loaded / event.total) * 100);
          onProgress(percent, event.loaded, event.total);
        }
      };
    }

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const json = JSON.parse(xhr.responseText);
          resolve({ success: true, videoUid: json?.result?.uid });
        } catch {
          resolve({ success: true });
        }
      } else {
        reject(new Error(`Cloudflare Stream upload failed with HTTP status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error("Network error during Cloudflare Stream video upload."));
    };

    xhr.send(formData);
  });
}

/**
 * Step 3: Fetch video status & streaming URLs
 */
export async function fetchVideoDetails(videoId: string): Promise<VideoMetadata> {
  const res = await apiFetch(`/videos/${videoId}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to fetch video details for ${videoId}`);
  }
  return res.json();
}
