import { apiFetch, apiUrl } from "@/lib/api/base-url";

export type EventMode = "ONLINE" | "OFFLINE" | "HYBRID";
export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";
export type RegistrationEmailStatus = "PENDING" | "SENT" | "FAILED";

export interface EventItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  bannerUrl?: string | null;
  mode: EventMode;
  status: EventStatus;
  venueOrLink: string;
  startDate: string;
  endDate?: string | null;
  sessionDetails?: string | null;
  speakerName?: string | null;
  speakerRole?: string | null;
  speakerBio?: string | null;
  speakerAvatar?: string | null;
  maxCapacity?: number | null;
  registeredCount?: number;
  isSoldOut?: boolean;
  availableSpots?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventRegistrationItem {
  id: string;
  eventId: string;
  fullName: string;
  email: string;
  mobile: string;
  notes?: string | null;
  emailStatus: RegistrationEmailStatus;
  registeredAt: string;
}

export interface CreateEventPayload {
  title: string;
  slug?: string;
  description: string;
  bannerUrl?: string;
  mode?: EventMode;
  status?: EventStatus;
  venueOrLink: string;
  startDate: string;
  endDate?: string;
  sessionDetails?: string;
  speakerName?: string;
  speakerRole?: string;
  speakerBio?: string;
  speakerAvatar?: string;
  maxCapacity?: number;
}

export interface RegisterEventPayload {
  fullName: string;
  email: string;
  mobile: string;
  notes?: string;
}

// ── Public API ──────────────────────────────────────────────────

export async function fetchPublicEvents(params?: {
  mode?: string;
  search?: string;
}): Promise<EventItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.mode && params.mode !== "ALL") query.append("mode", params.mode);
    if (params?.search) query.append("search", params.search);

    const res = await apiFetch(`/events?${query.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) || [];
  } catch (err) {
    console.warn("Failed to fetch public events:", err);
    return [];
  }
}

export async function fetchPublicEventBySlug(slug: string): Promise<EventItem | null> {
  try {
    const res = await apiFetch(`/events/${encodeURIComponent(slug)}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch event for slug ${slug}:`, err);
    return null;
  }
}

export async function registerForEvent(
  eventId: string,
  payload: RegisterEventPayload
): Promise<{ success: boolean; data?: EventRegistrationItem; error?: string }> {
  try {
    const res = await apiFetch(`/events/${eventId}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: body?.message || "Failed to complete registration. Please try again.",
      };
    }

    return { success: true, data: body };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || "Network error. Please verify your connection.",
    };
  }
}

// ── Admin API ───────────────────────────────────────────────────

export async function fetchAdminEvents(params?: {
  status?: string;
  search?: string;
}): Promise<EventItem[]> {
  try {
    const query = new URLSearchParams();
    if (params?.status && params.status !== "ALL") query.append("status", params.status);
    if (params?.search) query.append("search", params.search);

    const res = await apiFetch(`/admin/events?${query.toString()}`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()) || [];
  } catch (err) {
    console.warn("Failed to fetch admin events:", err);
    return [];
  }
}

export async function fetchAdminEventById(id: string): Promise<EventItem | null> {
  try {
    const res = await apiFetch(`/admin/events/${id}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch event ${id}:`, err);
    return null;
  }
}

export async function createAdminEvent(
  payload: CreateEventPayload
): Promise<{ success: boolean; data?: EventItem; error?: string }> {
  try {
    const res = await apiFetch("/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: body?.message || "Failed to create event." };
    }

    return { success: true, data: body };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error." };
  }
}

export async function updateAdminEvent(
  id: string,
  payload: Partial<CreateEventPayload>
): Promise<{ success: boolean; data?: EventItem; error?: string }> {
  try {
    const res = await apiFetch(`/admin/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const body = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { success: false, error: body?.message || "Failed to update event." };
    }

    return { success: true, data: body };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error." };
  }
}

export async function deleteAdminEvent(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await apiFetch(`/admin/events/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      return { success: false, error: body?.message || "Failed to delete event." };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err?.message || "Network error." };
  }
}

export async function fetchAdminEventRegistrations(
  eventId: string
): Promise<{ event: { id: string; title: string; maxCapacity?: number | null }; totalCount: number; registrations: EventRegistrationItem[] } | null> {
  try {
    const res = await apiFetch(`/admin/events/${eventId}/registrations`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn(`Failed to fetch registrations for event ${eventId}:`, err);
    return null;
  }
}

export function getExportEventRegistrationsUrl(eventId: string): string {
  return apiUrl(`/admin/events/${eventId}/registrations/export`);
}
