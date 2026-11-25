import { NextResponse } from "next/server";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson, type CspPartnerStatus } from "@/lib/certified-sales-partner";
import {
  deliverCspOnboardingEmailThrottled,
  isCspOnboardingEmailConfigured,
  type CspOnboardingEmailOutcome,
} from "@/lib/certified-sales-partner/onboarding-email";
import type { CspOnboardingEmailKind } from "@/lib/certified-sales-partner/onboarding-email-copy";
import {
  fetchCspPartnerEmailContact,
  listCspPlatformPartners,
} from "@/lib/certified-sales-partner/partner-admin-detail";
import { createClient } from "@/lib/supabase/server";

const STATUS_EMAIL_KIND: Partial<Record<string, CspOnboardingEmailKind>> = {
  approved: "approved",
  rejected: "rejected",
  needs_information: "needs_information",
};

const ALLOWED: readonly CspPartnerStatus[] = [
  "under_review",
  "needs_information",
  "approved",
  "rejected",
  "suspended",
];

/** Platform Admin partner list / status transitions — fail-closed without Core. */
export async function GET() {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const result = await callCspRpc(supabase, "csp_get_platform_overview");
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const overview: Record<string, unknown> =
      result.data && typeof result.data === "object" && !Array.isArray(result.data)
        ? { ...(result.data as Record<string, unknown>) }
        : { data: result.data };

    // Production overview may already include partners[]. If not, attach a service-role
    // directory so operators can open rows without pasting partner references.
    if (!Array.isArray(overview.partners)) {
      const listed = await listCspPlatformPartners();
      if (listed.kind === "ok") overview.partners = listed.partners;
    }

    return NextResponse.json({
      ...overview,
      email_delivery_configured: isCspOnboardingEmailConfigured(),
    });
  } catch {
    return NextResponse.json({ error: "partners_load_failed" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const denied = await guardPrivilegedPlatformApi(supabase);
    if (denied) return denied;

    const body = (await request.json()) as {
      partner_id?: string;
      status?: string;
      reason?: string;
    };
    if (!body.partner_id || !body.status) {
      return NextResponse.json({ error: "partner_id_and_status_required" }, { status: 400 });
    }
    if (!(ALLOWED as readonly string[]).includes(body.status)) {
      return NextResponse.json({ error: "invalid_partner_status" }, { status: 400 });
    }
    if (
      (body.status === "rejected" || body.status === "needs_information" || body.status === "suspended") &&
      !(typeof body.reason === "string" && body.reason.trim().length >= 3)
    ) {
      return NextResponse.json({ error: "reason_required" }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_set_partner_status", {
      p_partner_id: body.partner_id,
      p_status: body.status,
      p_reason: body.reason ?? null,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const data = result.data;
    const coreError =
      data && typeof data === "object" && "error" in data ? (data as { error?: unknown }).error : null;
    const kind = coreError ? undefined : STATUS_EMAIL_KIND[body.status];
    if (!kind) return NextResponse.json(data);

    // Notification only: never invites, creates users, or generates recovery links. The applicant
    // already authenticated when applying, so the email points to the existing partner login.
    const emailDelivery: { status: CspOnboardingEmailOutcome | "no_recipient"; kind: string } = {
      status: "no_recipient",
      kind,
    };
    const contact = await fetchCspPartnerEmailContact(body.partner_id);
    if (contact) {
      emailDelivery.status = (
        await deliverCspOnboardingEmailThrottled({
          kind,
          to: contact.email,
          locale: contact.locale,
          vars: {
            name: contact.displayName,
            reason: kind === "needs_information" ? body.reason : null,
            emailVerified: contact.emailVerified,
          },
          idempotencyKey: `csp-${kind}-${body.partner_id}-${Date.now().toString(36)}`,
        })
      ).outcome;
    }
    return NextResponse.json({
      ...(data && typeof data === "object" ? (data as Record<string, unknown>) : { data }),
      email_delivery: emailDelivery,
    });
  } catch {
    return NextResponse.json({ error: "partner_status_update_failed" }, { status: 500 });
  }
}
