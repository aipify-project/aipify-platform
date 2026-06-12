import { NextResponse } from "next/server";
import type { WorkspaceRegistrationPayload } from "@/lib/auth/registration";
import { createClient } from "@/lib/supabase/server";

const REQUIRED_STRING_FIELDS: (keyof WorkspaceRegistrationPayload)[] = [
  "owner_full_name",
  "business_email",
  "company_name",
  "business_address",
  "postal_code",
  "city",
  "industry",
  "employee_range",
  "organization_type",
];

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as Partial<WorkspaceRegistrationPayload>;

    for (const field of REQUIRED_STRING_FIELDS) {
      const value = body[field];
      if (typeof value !== "string" || value.trim() === "") {
        return NextResponse.json({ error: `${field} is required` }, { status: 400 });
      }
    }

    if (!body.terms_accepted || !body.authority_accepted) {
      return NextResponse.json({ error: "terms_and_authority_required" }, { status: 400 });
    }

    if (!Array.isArray(body.primary_use_cases)) {
      return NextResponse.json({ error: "primary_use_cases is required" }, { status: 400 });
    }

    const payload: WorkspaceRegistrationPayload = {
      owner_full_name: body.owner_full_name!.trim(),
      business_email: body.business_email!.trim().toLowerCase(),
      owner_phone: body.owner_phone?.trim() ?? "",
      owner_country: body.owner_country?.trim() || "NO",
      company_name: body.company_name!.trim(),
      organization_number: body.organization_number?.trim() ?? "",
      business_address: body.business_address!.trim(),
      postal_code: body.postal_code!.trim(),
      city: body.city!.trim(),
      organization_country: body.organization_country?.trim() || body.owner_country?.trim() || "NO",
      website: body.website?.trim() ?? "",
      logo_url: body.logo_url?.trim() ?? "",
      industry: body.industry!.trim(),
      employee_range: body.employee_range!.trim(),
      primary_use_cases: body.primary_use_cases,
      organization_type: body.organization_type!.trim(),
      product_updates_opt_in: Boolean(body.product_updates_opt_in),
      registration_2fa_skipped: body.registration_2fa_skipped !== false,
      registration_2fa_enabled: Boolean(body.registration_2fa_enabled),
      terms_accepted: true,
      authority_accepted: true,
    };

    const { data, error } = await supabase.rpc("complete_aipify_workspace_registration", {
      p_payload: payload,
    });

    if (error) {
      const message = error.message.toLowerCase();
      if (message.includes("business_email")) {
        return NextResponse.json({ error: "businessEmailInvalid" }, { status: 400 });
      }
      if (message.includes("already completed")) {
        return NextResponse.json({ error: "alreadyCompleted" }, { status: 409 });
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to create workspace" }, { status: 500 });
  }
}
