import { NextResponse } from "next/server";
import { getStoredLeads, addLead, type LeadSource } from "@/lib/data/leads-store";

export async function GET() {
  try {
    const leads = getStoredLeads();
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, interestedCourse, source, campaignName, budget, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: "Name and Phone are required" },
        { status: 400 }
      );
    }

    const createdLead = addLead({
      name,
      email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
      phone,
      interestedCourse: interestedCourse || "Java Full Stack Developer Mastery",
      source: (source as LeadSource) || "website_chatbot",
      campaignName: campaignName || "Direct_Enquiry",
      status: "new",
      priority: "high",
      budget: budget || "₹45,000",
      notes: notes || "Submitted via website form / chatbot",
    });

    return NextResponse.json({ success: true, lead: createdLead }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to create lead" }, { status: 500 });
  }
}
