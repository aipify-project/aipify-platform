import { NextResponse } from "next/server";
import { headers } from "next/headers";
import {
  isAuthLifecycleEmailConfigured,
  sendAuthLifecycleEmail,
} from "@/lib/auth/auth-lifecycle-email";
import { readRequestHostFromHeaders } from "@/lib/auth/auth-redirect-urls";
import {
  createSecureRecoveryLink,
  inspectPartnerAuthCapability,
} from "@/lib/auth/secure-recovery-link";
import { guardPrivilegedPlatformApi } from "@/lib/auth/platform-server-access";
import { callCspRpc, failClosedJson, type CspPartnerStatus } from "@/lib/certified-sales-partner";
import {
  deliverCspOnboardingEmailThrottled,
  isCspOnboardingEmailConfigured,
  type CspOnboardingEmailOutcome,
} from "@/lib/certified-sales-partner/onboarding-email";
import type { CspOnboardingEmailKind } from "@/lib/certified-sales-partner/onboarding-email-copy";
import { partnerAuthUserHasActiveCustomerMembership } from "@/lib/certified-sales-partner/partner-access";
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
      /** Required when approving a partner who also has an active APP customer membership. */
      confirm_active_app_customer?: boolean;
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

    if (body.status === "approved") {
      const contact = await fetchCspPartnerEmailContact(body.partner_id);
      if (contact && contact.emailVerified === false) {
        return NextResponse.json({ error: "email_verification_required" }, { status: 409 });
      }
      // APP customer membership must never silently become seller approval.
      // Operators must explicitly confirm dual-identity approvals.
      if (await partnerAuthUserHasActiveCustomerMembership(contact?.authUserId)) {
        if (body.confirm_active_app_customer !== true) {
          return NextResponse.json(
            {
              error: "confirm_active_app_customer_required",
              message:
                "This account is an active APP customer. Confirm explicitly before granting seller access.",
            },
            { status: 409 },
          );
        }
      }
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

    const emailDelivery: {
      status: CspOnboardingEmailOutcome | "no_recipient";
      kind: string;
      activation?: "sent" | "login_only" | "skipped" | "failed";
    } = {
      status: "no_recipient",
      kind,
    };
    const contact = await fetchCspPartnerEmailContact(body.partner_id);
    if (contact) {
      let activation: "sent" | "login_only" | "skipped" | "failed" = "skipped";

      if (kind === "approved") {
        const capability = await inspectPartnerAuthCapability(contact.authUserId);
        if (capability.kind === "needs_activation" && isAuthLifecycleEmailConfigured()) {
          const headerStore = await headers();
          const link = await createSecureRecoveryLink({
            email: contact.email,
            purpose: "partner_activation",
            requestHost: readRequestHostFromHeaders(headerStore),
          });
          if (link.ok) {
            const sent = await sendAuthLifecycleEmail({
              to: contact.email,
              kind: "partner_activation",
              locale: contact.locale ?? link.locale,
              name: contact.displayName,
              actionUrl: link.absoluteUrl,
              idempotencyKey: `csp-activation-${body.partner_id}`,
            });
            emailDelivery.status =
              sent.status === "accepted"
                ? "accepted"
                : sent.status === "not_configured"
                  ? "not_configured"
                  : "failed";
            activation = sent.status === "accepted" ? "sent" : "failed";
            emailDelivery.activation = activation;
            return NextResponse.json({
              ...(data && typeof data === "object" ? (data as Record<string, unknown>) : { data }),
              email_delivery: emailDelivery,
            });
          }
          activation = "failed";
        } else if (capability.kind === "credentials_ready" || capability.kind === "needs_activation") {
          activation = "login_only";
        }
      }

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
      if (kind === "approved") emailDelivery.activation = activation;
    }
    return NextResponse.json({
      ...(data && typeof data === "object" ? (data as Record<string, unknown>) : { data }),
      email_delivery: emailDelivery,
    });
  } catch {
    return NextResponse.json({ error: "partner_status_update_failed" }, { status: 500 });
  }
}
