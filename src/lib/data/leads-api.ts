import { apiFetch } from "@/lib/api/base-url";

export interface BackendLeadNote {
  id: string;
  leadId?: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface BackendLead {
  id: string;
  name: string;
  phone: string;
  email?: string | null;
  interestedCourse: string;
  source: "WALK_IN" | "META_ADS" | "GOOGLE_ADS" | "CHATBOT" | "REFERRAL" | "WEBSITE";
  status: "NEW" | "CONTACTED" | "INTERESTED" | "ENROLLED" | "DROPPED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  counselorId?: string | null;
  counselor?: {
    id: string;
    name: string;
    email: string;
  } | null;
  notes?: BackendLeadNote[];
  createdAt: string;
  updatedAt: string;
}

export async function fetchAdminLeads(): Promise<BackendLead[]> {
  try {
    const res = await apiFetch("/admin/leads", {
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) return data;
    }
  } catch (err) {
    console.warn("Failed to fetch leads from backend:", err);
  }
  return [];
}

export async function updateLeadStatus(
  id: string,
  status: BackendLead["status"],
  note?: string
): Promise<BackendLead | null> {
  try {
    const res = await apiFetch(`/admin/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to update lead status:", err);
  }
  return null;
}

export async function addLeadNote(
  id: string,
  note: string
): Promise<BackendLeadNote | null> {
  try {
    const res = await apiFetch(`/admin/leads/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note }),
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.error("Failed to add lead note:", err);
  }
  return null;
}
