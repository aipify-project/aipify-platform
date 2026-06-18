import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { parseBookDemoAdvisor } from "@/lib/book-demo-discovery-center";
import { assertPublicFormSubmission, logSuspiciousSubmission } from "@/lib/public-forms/bot-protection";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function sanitize(value: unknown, max = 500): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("get_book_demo_discovery_center");
    if (error) return NextResponse.json({ found: false, error: error.message }, { status: 400 });
    const record = data as Record<string, unknown>;
    return NextResponse.json({
      found: record.found === true,
      advisor: record.advisor ? parseBookDemoAdvisor(record.advisor) : null,
      governanceNote: record.governance_note,
      privacyNote: record.privacy_note,
    });
  } catch {
    return NextResponse.json({ found: false }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;

    const businessEmailPreview = typeof body.business_email === "string" ? body.business_email.trim().toLowerCase() : "";
    const guard = assertPublicFormSubmission(
      request,
      { ...body, email: businessEmailPreview },
      "book-demo",
    );
    if (!guard.ok) {
      if (guard.log) {
        logSuspiciousSubmission("book-demo", guard.log, request.headers.get("x-forwarded-for") ?? "unknown");
      }
      return NextResponse.json({ ok: false, error: guard.error }, { status: guard.status });
    }

    const firstName = sanitize(body.first_name, 80);
    const lastName = sanitize(body.last_name, 80);
    const companyName = sanitize(body.company_name, 200);
    const businessEmail = sanitize(body.business_email, 254).toLowerCase();

    if (!firstName || !lastName || !companyName || !EMAIL_RE.test(businessEmail)) {
      return NextResponse.json({ ok: false, error: "Valid name, company, and business email are required" }, { status: 400 });
    }

    const payload = {
      p_first_name: firstName,
      p_last_name: lastName,
      p_company_name: companyName,
      p_job_title: sanitize(body.job_title, 120),
      p_business_email: businessEmail,
      p_phone: sanitize(body.phone, 40),
      p_country: sanitize(body.country, 80),
      p_company_size: sanitize(body.company_size, 40),
      p_industry: sanitize(body.industry, 80),
      p_current_challenge: sanitize(body.current_challenge, 80),
      p_additional_notes: sanitize(body.additional_notes, 2000),
      p_meeting_type: sanitize(body.meeting_type, 40) || "no_preference",
      p_lead_source: "book_demo",
    };

    const supabase = await createClient();
    const { data, error } = await supabase.rpc("submit_book_demo_request", payload);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
    }

    const { getGrowthPartnerAttributionFromCookies } = await import("@/lib/growth-partner-attribution/server");
    const attribution = await getGrowthPartnerAttributionFromCookies();
    if (attribution?.partnerSlug) {
      await supabase.rpc("capture_growth_partner_attribution", {
        p_payload: {
          partner_slug: attribution.partnerSlug,
          session_key: attribution.sessionKey,
          campaign_id: attribution.campaignId ?? "",
          utm_source: attribution.utmSource ?? "",
          utm_medium: attribution.utmMedium ?? "",
          utm_campaign: attribution.utmCampaign ?? "",
          landing_page: "/book-demo",
          destination_key: "demo_booked",
          metadata: { company_name: companyName, business_email: businessEmail },
        },
      });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to submit demo request" }, { status: 500 });
  }
}
