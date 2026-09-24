import { apiUrl } from "./base-url";

export interface UploadResult {
  url: string;
  publicId: string;
  format: string;
  bytes: number;
}

export type ImageContext =
  | "user-profile"
  | "event-thumbnail"
  | "event-section"
  | "event-speaker"
  | "course-thumbnail"
  | "other";

/**
 * Upload an image file to Cloudinary via the backend upload endpoint.
 * Returns the Cloudinary URL, publicId, format, and bytes.
 *
 * @param file - The File object to upload (must pass MIME/size validation on backend)
 * @param context - Determines the Cloudinary folder the image is stored in
 */
export async function uploadImage(
  file: File,
  context: ImageContext = "other"
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("context", context);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("jks_access_token")
      : null;

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(apiUrl("/upload/image"), {
    method: "POST",
    headers,
    credentials: "include",
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ||
        `Image upload failed with status ${res.status}. Please check file type and size (max 10MB).`
    );
  }

  const data = await res.json();
  return {
    url: data.url,
    publicId: data.publicId,
    format: data.format || "",
    bytes: data.bytes || 0,
  };
}

/**
 * Delete an image from Cloudinary by its publicId via the backend.
 */
export async function deleteImage(publicId: string): Promise<void> {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("jks_access_token")
      : null;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  await fetch(apiUrl("/upload/image"), {
    method: "DELETE",
    headers,
    credentials: "include",
    body: JSON.stringify({ publicId }),
  });
}
