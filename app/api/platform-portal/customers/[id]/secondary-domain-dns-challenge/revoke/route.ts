import { NextResponse } from "next/server";
import { mapSecondaryDomainDnsChallengeRpcError } from "@/lib/platform-portal/secondary-domain-dns-challenge";
import { createClient } from "@/lib/supabase/server";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const NO_STORE = { "Cache-Control": "no-store" } as const;

function jsonError(message: string, status: number, code?: string) {
  return NextResponse.json(
    code ? { error: message, code } : { error: message },
    { status, headers: NO_STORE },
  );
}

/** POST — revoke a pending secondary-host DNS challenge without deleting history. */
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

    const row =
      body && typeof body === "object" && !Array.isArray(body)
        ? (body as Record<string, unknown>)
        : {};
    const challengeId = String(row.challengeId ?? row.challenge_id ?? "").trim();
    const internalReason = String(row.internalReason ?? row.internal_reason ?? "").trim();

    if (!UUID_REGEX.test(challengeId)) {
      return jsonError("Invalid challenge id.", 400, "invalid_challenge");
    }
    if (internalReason.length < 3) {
      return jsonError("Invalid internal reason.", 400, "invalid_internal_reason");
    }

    const { data, error } = await supabase.rpc(
      "revoke_platform_portal_secondary_domain_dns_challenge",
      {
        p_customer_id: customerId,
        p_challenge_id: challengeId,
        p_internal_reason: internalReason,
      },
    );

    if (error) {
      const mapped = mapSecondaryDomainDnsChallengeRpcError(error.message);
      return jsonError("Unable to revoke challenge.", mapped.status, mapped.code);
    }

    return NextResponse.json(data, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to revoke challenge.", 500, "unknown");
  }
}
