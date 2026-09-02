import { NextResponse } from "next/server";
import { addLead, type LeadSource } from "@/lib/data/leads-store";

// Webhook endpoint for Meta (Facebook & Instagram Ads), Google Search Ads, and Zapier/Make
export async function POST(request: Request) {
  try {
    const payload = await request.json();

    // Standardized mapping across Facebook Instant Forms and Google Lead Gen extensions
    const name =
      payload.full_name ||
      payload.name ||
      `${payload.first_name || ""} ${payload.last_name || ""}`.trim() ||
      "New Ad Lead";
    const email = payload.email || "ad.lead@example.com";
    const phone = payload.phone_number || payload.phone || "+91 99000 00000";
    const interestedCourse =
      payload.interested_course ||
      payload.course ||
      payload.custom_questions?.find((q: any) => q.key?.includes("course"))?.value ||
      "Java Full Stack Developer Mastery";

    const platform = (payload.platform || payload.source || "meta_ads").toLowerCase();
    let source: LeadSource = "meta_ads";
    if (platform.includes("google")) source = "google_ads";
    else if (platform.includes("insta")) source = "instagram";
    else if (platform.includes("chat")) source = "website_chatbot";

    const campaignName = payload.campaign_name || payload.ad_name || payload.utm_campaign || "Ad_Lead_Campaign";

    const newLead = addLead({
      name,
      email,
      phone,
      interestedCourse,
      source,
      campaignName,
      status: "new",
      priority: "high",
      notes: `Ingested via Ad Webhook [${campaignName}] on ${new Date().toLocaleDateString()}`,
    });

    return NextResponse.json({
      success: true,
      message: "Lead ingested successfully",
      leadId: newLead.id,
      lead: newLead,
    });
  } catch (error) {
    console.error("Ad Webhook Error:", error);
    return NextResponse.json(
      { success: false, error: "Invalid webhook payload format" },
      { status: 400 }
    );
  }
}
