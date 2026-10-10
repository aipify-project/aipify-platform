import { NextResponse } from "next/server";
import {
  mapSecondaryDomainDnsChallengeRpcError,
  parseVerifySecondaryDomainDnsChallengeInput,
  parseVerifySecondaryDomainDnsChallengeResult,
} from "@/lib/platform-portal/secondary-domain-dns-challenge";
import { lookupSecondaryDomainDnsChallengeToken } from "@/lib/platform-portal/secondary-domain-dns-resolve";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

/**
 * POST — authenticate platform operator, live DNS TXT lookup, then service-role
 * verify/bind with attested actor id. Client cannot self-attest verification;
 * authenticated JWT cannot execute the bind RPC directly.
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customerId = (id ?? "").trim();
    if (!UUID_REGEX.test(customerId)) {
      return jsonError("Invalid customer id.", 400, "invalid_customer");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return jsonError("Invalid JSON body.", 400, "unknown");
    }

    const bodyRecord =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : {};

    // Reject client-supplied verification / token material — DNS is server-only.
    if (
      bodyRecord.verified != null ||
      bodyRecord.p_verified != null ||
      bodyRecord.presentedToken != null ||
      bodyRecord.presented_token != null ||
      bodyRecord.dnsTxtValue != null ||
      bodyRecord.dns_txt_value != null
    ) {
      return jsonError(
        "Client DNS attestation is not accepted.",
        400,
        "forbidden",
      );
    }

    const challengeId = String(bodyRecord.challengeId ?? bodyRecord.challenge_id ?? "").trim();
    const internalReason = String(
      bodyRecord.internalReason ?? bodyRecord.internal_reason ?? "",
    ).trim();
    const idempotencyKey = String(
      bodyRecord.idempotencyKey ?? bodyRecord.idempotency_key ?? "",
    ).trim();

    if (!UUID_REGEX.test(challengeId)) {
      return jsonError("Invalid challenge id.", 400, "invalid_challenge");
    }

    // Platform authorization via authenticated session (canonical portal gate).
    const { data: statusData, error: statusError } = await supabase.rpc(
      "get_platform_portal_secondary_domain_dns_challenge_status",
      {
        p_customer_id: customerId,
        p_challenge_id: challengeId,
      },
    );

    if (statusError) {
      const mapped = mapSecondaryDomainDnsChallengeRpcError(statusError.message);
      return jsonError("Unable to load challenge.", mapped.status, mapped.code);
    }
    if (statusData == null) {
      return jsonError("Challenge not found.", 404, "challenge_not_found");
    }

    const statusRow =
      statusData && typeof statusData === "object"
        ? (statusData as Record<string, unknown>)
        : null;
    const challengeRow =
      statusRow?.challenge && typeof statusRow.challenge === "object"
        ? (statusRow.challenge as Record<string, unknown>)
        : null;
    const hostname = String(challengeRow?.hostname ?? "").trim().toLowerCase();
    const challengeStatus = String(challengeRow?.status ?? "").trim().toLowerCase();

    if (!hostname) {
      return jsonError("Challenge hostname missing.", 500, "unknown");
    }
    if (challengeStatus !== "pending") {
      return jsonError(
        "Challenge is not pending.",
        409,
        challengeStatus === "expired" ? "challenge_expired" : "challenge_not_pending",
      );
    }

    // Hostname comes from trusted challenge row, never from client host headers.
    const dns = await lookupSecondaryDomainDnsChallengeToken({ hostname });
    if (!dns.ok) {
      return jsonError(
        dns.code === "dns_txt_missing"
          ? "DNS TXT challenge record not found."
          : "DNS lookup failed.",
        409,
        dns.code,
      );
    }

    const parsedInput = parseVerifySecondaryDomainDnsChallengeInput(customerId, {
      challengeId,
      presentedToken: dns.token,
      internalReason,
      idempotencyKey,
    });
    if (!parsedInput.ok) {
      return jsonError("Invalid verify input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;

    // Bind uses service_role only — never the operator's authenticated JWT.
    const service = createServiceRoleClient();
    const { data, error } = await service.rpc(
      "verify_and_bind_platform_portal_secondary_domain_dns_challenge",
      {
        p_customer_id: value.customerId,
        p_challenge_id: value.challengeId,
        p_presented_token: value.presentedToken,
        p_internal_reason: value.internalReason,
        p_idempotency_key: value.idempotencyKey,
        p_actor_auth_user_id: user.id,
      },
    );

    if (error) {
      const mapped = mapSecondaryDomainDnsChallengeRpcError(error.message);
      return jsonError(
        "Unable to verify and bind secondary domain.",
        mapped.status,
        mapped.code,
      );
    }

    const result = parseVerifySecondaryDomainDnsChallengeResult(data);
    if (!result) {
      return jsonError("Unable to verify and bind secondary domain.", 500, "unknown");
    }

    if (result.installationCreated || !result.licenseDomainReferenceUnchanged) {
      return jsonError("Verify/bind violated safety invariants.", 500, "unknown");
    }

    if (
      result.domain.verificationStatus !== "verified" ||
      result.domain.status !== "active" ||
      !result.domain.installationId
    ) {
      return jsonError("Domain not verified after bind.", 500, "unknown");
    }

    return NextResponse.json(
      {
        ...result,
        dnsProof: {
          recordName: dns.recordName,
          matched: true,
        },
      },
      { headers: NO_STORE },
    );
  } catch {
    return jsonError("Unable to verify and bind secondary domain.", 500, "unknown");
  }
}
