import { NextResponse } from "next/server";
import {
  mapSecondaryDomainDnsChallengeRpcError,
  parseIssueSecondaryDomainDnsChallengeInput,
  parseIssueSecondaryDomainDnsChallengeResult,
} from "@/lib/platform-portal/secondary-domain-dns-challenge";
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

/** POST — issue pending secondary-host DNS TXT challenge for an existing installation. */
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

    const parsedInput = parseIssueSecondaryDomainDnsChallengeInput(customerId, body);
    if (!parsedInput.ok) {
      return jsonError("Invalid secondary domain challenge input.", 400, parsedInput.code);
    }

    const { value } = parsedInput;
    const { data, error } = await supabase.rpc(
      "issue_platform_portal_secondary_domain_dns_challenge",
      {
        p_customer_id: value.customerId,
        p_installation_id: value.installationId,
        p_hostname: value.hostname,
        p_internal_reason: value.internalReason,
        p_idempotency_key: value.idempotencyKey,
        p_ttl_hours: value.ttlHours ?? 24,
      },
    );

    if (error) {
      const mapped = mapSecondaryDomainDnsChallengeRpcError(error.message);
      return jsonError(
        "Unable to issue secondary domain DNS challenge.",
        mapped.status,
        mapped.code,
      );
    }

    const parsed = parseIssueSecondaryDomainDnsChallengeResult(data);
    if (!parsed) {
      return jsonError("Unable to issue secondary domain DNS challenge.", 500, "unknown");
    }

    if (parsed.installationCreated || !parsed.licenseDomainReferenceUnchanged) {
      return jsonError(
        "Secondary domain challenge violated safety invariants.",
        500,
        "unknown",
      );
    }

    const status = parsed.idempotentReplay ? 200 : 201;
    return NextResponse.json(parsed, { status, headers: NO_STORE });
  } catch {
    return jsonError("Unable to issue secondary domain DNS challenge.", 500, "unknown");
  }
}

/** GET — read challenge status (no secrets). ?challengeId= */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const customerId = (id ?? "").trim();
    if (!UUID_REGEX.test(customerId)) {
      return jsonError("Invalid customer id.", 400, "invalid_customer");
    }

    const url = new URL(request.url);
    const challengeId = (url.searchParams.get("challengeId") ?? "").trim();
    if (!UUID_REGEX.test(challengeId)) {
      return jsonError("Invalid challenge id.", 400, "invalid_challenge");
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    const { data, error } = await supabase.rpc(
      "get_platform_portal_secondary_domain_dns_challenge_status",
      {
        p_customer_id: customerId,
        p_challenge_id: challengeId,
      },
    );

    if (error) {
      const mapped = mapSecondaryDomainDnsChallengeRpcError(error.message);
      return jsonError("Unable to load challenge status.", mapped.status, mapped.code);
    }

    if (data == null) {
      return jsonError("Challenge not found.", 404, "challenge_not_found");
    }

    return NextResponse.json(data, { headers: NO_STORE });
  } catch {
    return jsonError("Unable to load challenge status.", 500, "unknown");
  }
}
