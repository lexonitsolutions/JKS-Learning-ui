export type LeadStatus =
  | "new"
  | "assigned"
  | "follow_up"
  | "demo_scheduled"
  | "converted"
  | "lost";

export type LeadSource =
  | "meta_ads"
  | "google_ads"
  | "website_chatbot"
  | "instagram"
  | "referral"
  | "walk_in";

export interface LeadActivity {
  id: string;
  type: "note" | "call" | "whatsapp" | "status_change" | "assignment";
  description: string;
  author: string;
  timestamp: string;
}

export interface Counselor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  activeLeadsCount: number;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  interestedCourse: string;
  source: LeadSource;
  campaignName?: string;
  status: LeadStatus;
  assignedTo?: Counselor;
  createdDate: string;
  followUpDate?: string;
  priority: "high" | "medium" | "low";
  budget?: string;
  notes?: string;
  activities: LeadActivity[];
}

export const COUNSELORS: Counselor[] = [
  {
    id: "c1",
    name: "Priya Sharma",
    email: "priya.s@jkslearning.com",
    phone: "+91 98765 43210",
    avatar: "PS",
    activeLeadsCount: 14,
  },
  {
    id: "c2",
    name: "Rahul Verma",
    email: "rahul.v@jkslearning.com",
    phone: "+91 98765 43211",
    avatar: "RV",
    activeLeadsCount: 11,
  },
  {
    id: "c3",
    name: "Ananya Iyer",
    email: "ananya.i@jkslearning.com",
    phone: "+91 98765 43212",
    avatar: "AI",
    activeLeadsCount: 18,
  },
  {
    id: "c4",
    name: "Vikram Singh",
    email: "vikram.s@jkslearning.com",
    phone: "+91 98765 43213",
    avatar: "VS",
    activeLeadsCount: 9,
  },
];

const INITIAL_LEADS: Lead[] = [
  {
    id: "LEAD-2026-101",
    name: "Rohan Kulkarni",
    email: "rohan.kulkarni@gmail.com",
    phone: "+91 98230 45678",
    interestedCourse: "Java Full Stack Developer Mastery",
    source: "meta_ads",
    campaignName: "FB_Ad_FullStack_Bangalore_Aug26",
    status: "new",
    priority: "high",
    budget: "₹45,000",
    createdDate: "2026-08-30T10:15:00Z",
    followUpDate: "2026-08-31T11:00:00Z",
    notes: "Saw FB video ad on Microservices & Cloud architecture. Wants morning batch.",
    activities: [
      {
        id: "act-1",
        type: "status_change",
        description: "Lead captured automatically from Meta Ads Campaign (FB_Ad_FullStack_Bangalore_Aug26)",
        author: "System Bot",
        timestamp: "2026-08-30T10:15:00Z",
      },
    ],
  },
  {
    id: "LEAD-2026-102",
    name: "Sneha Reddy",
    email: "sneha.reddy@outlook.com",
    phone: "+91 97012 34567",
    interestedCourse: "Modern Frontend Engineering (React 19 & Next.js)",
    source: "website_chatbot",
    status: "assigned",
    assignedTo: COUNSELORS[0],
    priority: "high",
    budget: "₹35,000",
    createdDate: "2026-08-30T09:40:00Z",
    followUpDate: "2026-08-31T14:30:00Z",
    notes: "Inquired about Weekend batch and placement assistance in Hyderabad.",
    activities: [
      {
        id: "act-2",
        type: "status_change",
        description: "Enquiry submitted via Website AI Chatbot",
        author: "AI Assistant",
        timestamp: "2026-08-30T09:40:00Z",
      },
      {
        id: "act-3",
        type: "assignment",
        description: "Assigned to counselor Priya Sharma",
        author: "Admin",
        timestamp: "2026-08-30T09:50:00Z",
      },
    ],
  },
  {
    id: "LEAD-2026-103",
    name: "Aditya Nair",
    email: "aditya.nair@yahoo.com",
    phone: "+91 98450 11223",
    interestedCourse: "SAP S/4HANA Enterprise Systems",
    source: "google_ads",
    campaignName: "Google_Search_SAP_India_TopTier",
    status: "follow_up",
    assignedTo: COUNSELORS[2],
    priority: "medium",
    budget: "₹65,000",
    createdDate: "2026-08-29T14:20:00Z",
    followUpDate: "2026-08-31T16:00:00Z",
    notes: "Has 2 years IT support experience; switching to SAP MM/FICO.",
    activities: [
      {
        id: "act-4",
        type: "status_change",
        description: "Captured via Google Search Ad",
        author: "System Bot",
        timestamp: "2026-08-29T14:20:00Z",
      },
      {
        id: "act-5",
        type: "call",
        description: "Called candidate: Shared SAP syllabus and requested previous experience certificate.",
        author: "Ananya Iyer",
        timestamp: "2026-08-30T11:00:00Z",
      },
    ],
  },
  {
    id: "LEAD-2026-104",
    name: "Karthik Sundaram",
    email: "karthik.sundaram@gmail.com",
    phone: "+91 99401 88990",
    interestedCourse: ".NET 9 Enterprise Microservices & Cloud",
    source: "meta_ads",
    campaignName: "Insta_Reels_DotNet_Cloud_Pro",
    status: "demo_scheduled",
    assignedTo: COUNSELORS[1],
    priority: "high",
    budget: "₹45,000",
    createdDate: "2026-08-28T11:00:00Z",
    followUpDate: "2026-09-01T10:00:00Z",
    notes: "Live demo session with Senior Architect booked for Sept 1st at 10 AM.",
    activities: [
      {
        id: "act-6",
        type: "status_change",
        description: "Demo class link sent via WhatsApp & Email",
        author: "Rahul Verma",
        timestamp: "2026-08-29T15:30:00Z",
      },
    ],
  },
  {
    id: "LEAD-2026-105",
    name: "Meera Patel",
    email: "meera.patel@gmail.com",
    phone: "+91 98980 12345",
    interestedCourse: "Java Full Stack Developer Mastery",
    source: "referral",
    status: "converted",
    assignedTo: COUNSELORS[0],
    priority: "high",
    budget: "₹45,000",
    createdDate: "2026-08-25T16:00:00Z",
    notes: "Enrolled in Batch #28! Payment verified (₹45,000).",
    activities: [
      {
        id: "act-7",
        type: "status_change",
        description: "Converted to Enrolled Student. Student ID: STU-2026-042 created.",
        author: "Priya Sharma",
        timestamp: "2026-08-29T18:00:00Z",
      },
    ],
  },
  {
    id: "LEAD-2026-106",
    name: "Vikas Choudhary",
    email: "vikas.c@gmail.com",
    phone: "+91 97110 99887",
    interestedCourse: "Modern Frontend Engineering (React 19 & Next.js)",
    source: "meta_ads",
    campaignName: "FB_Frontend_Retargeting",
    status: "lost",
    assignedTo: COUNSELORS[3],
    priority: "low",
    createdDate: "2026-08-24T12:00:00Z",
    notes: "Joined local offline coaching institute. Mark as lost.",
    activities: [
      {
        id: "act-8",
        type: "status_change",
        description: "Status changed to Lost / Not Interested",
        author: "Vikram Singh",
        timestamp: "2026-08-28T14:00:00Z",
      },
    ],
  },
];

const LEADS_STORAGE_KEY = "jks_leads_crm_store_v1";

export function getStoredLeads(): Lead[] {
  if (typeof window === "undefined") return INITIAL_LEADS;
  try {
    const raw = localStorage.getItem(LEADS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(INITIAL_LEADS));
      return INITIAL_LEADS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_LEADS;
  }
}

export function saveStoredLeads(leads: Lead[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads));
  } catch (err) {
    console.error("Failed to save leads:", err);
  }
}

export function addLead(newLeadData: Omit<Lead, "id" | "createdDate" | "activities">): Lead {
  const current = getStoredLeads();
  const newLead: Lead = {
    ...newLeadData,
    id: `LEAD-2026-${Math.floor(100 + Math.random() * 900)}`,
    createdDate: new Date().toISOString(),
    activities: [
      {
        id: `act-${Date.now()}`,
        type: "status_change",
        description: `New lead created via ${newLeadData.source.replace("_", " ").toUpperCase()}`,
        author: "System Ingestion",
        timestamp: new Date().toISOString(),
      },
    ],
  };

  const updated = [newLead, ...current];
  saveStoredLeads(updated);
  return newLead;
}

export function updateLeadStatus(leadId: string, status: LeadStatus, note?: string): Lead | null {
  const current = getStoredLeads();
  const idx = current.findIndex((l) => l.id === leadId);
  if (idx === -1) return null;

  const lead = { ...current[idx] };
  lead.status = status;
  lead.activities.unshift({
    id: `act-${Date.now()}`,
    type: "status_change",
    description: `Status updated to ${status.replace("_", " ").toUpperCase()}${note ? ` (${note})` : ""}`,
    author: "Admin / Counselor",
    timestamp: new Date().toISOString(),
  });

  current[idx] = lead;
  saveStoredLeads(current);
  return lead;
}

export function assignLeadToCounselor(leadId: string, counselorId: string): Lead | null {
  const current = getStoredLeads();
  const counselor = COUNSELORS.find((c) => c.id === counselorId);
  const idx = current.findIndex((l) => l.id === leadId);
  if (idx === -1 || !counselor) return null;

  const lead = { ...current[idx] };
  lead.assignedTo = counselor;
  if (lead.status === "new") {
    lead.status = "assigned";
  }
  lead.activities.unshift({
    id: `act-${Date.now()}`,
    type: "assignment",
    description: `Lead assigned to counselor ${counselor.name}`,
    author: "Admin",
    timestamp: new Date().toISOString(),
  });

  current[idx] = lead;
  saveStoredLeads(current);
  return lead;
}

export function addLeadActivityNote(leadId: string, text: string, type: "note" | "call" | "whatsapp" = "note"): Lead | null {
  const current = getStoredLeads();
  const idx = current.findIndex((l) => l.id === leadId);
  if (idx === -1) return null;

  const lead = { ...current[idx] };
  lead.activities.unshift({
    id: `act-${Date.now()}`,
    type,
    description: text,
    author: "Counselor",
    timestamp: new Date().toISOString(),
  });

  current[idx] = lead;
  saveStoredLeads(current);
  return lead;
}
