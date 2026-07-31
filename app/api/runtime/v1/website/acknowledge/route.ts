import { NextResponse } from "next/server";
import { createPublicAnonSupabaseClient } from "@/lib/supabase/public-anon";
import {
  extractInstallationToken,
  isValidRuntimeIdempotencyKey,
  RUNTIME_NO_STORE_HEADERS,
} from "@/lib/customer-website-runtime";

const MAX_BODY_BYTES = 16_384;

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

export async function POST(request: Request) {
  const token = extractInstallationToken(request);
  if (!token) {
    return NextResponse.json(
      { ok: false, reason: "invalid_token" },
      { status: 401, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json(
      { ok: false, reason: "payload_too_large" },
      { status: 413, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = asRecord(await request.json());
  } catch {
    return NextResponse.json(
      { ok: false, reason: "invalid_body" },
      { status: 400, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  const idempotencyKey = body.idempotencyKey;
  if (!isValidRuntimeIdempotencyKey(idempotencyKey)) {
    return NextResponse.json(
      { ok: false, reason: "invalid_idempotency_key" },
      { status: 400, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  const path = typeof body.path === "string" ? body.path : "";
  if (!path || path.length > 500) {
    return NextResponse.json(
      { ok: false, reason: "invalid_path" },
      { status: 400, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  // Client cannot force verified — server computes status.
  if (body.status != null || body.verified != null) {
    return NextResponse.json(
      { ok: false, reason: "client_status_forbidden" },
      { status: 400, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }

  try {
    const supabase = createPublicAnonSupabaseClient();
    const { data, error } = await supabase.rpc("acknowledge_customer_website_runtime", {
      p_token: token,
      p_idempotency_key: idempotencyKey,
      p_payload: {
        path,
        locale: typeof body.locale === "string" ? body.locale : null,
        observed_manifest_checksum:
          typeof body.observedManifestChecksum === "string" ? body.observedManifestChecksum : "",
        observed_page_checksum:
          typeof body.observedPageChecksum === "string" ? body.observedPageChecksum : "",
        observed_version_ref:
          typeof body.observedVersionRef === "string" ? body.observedVersionRef : null,
        runtime_app_version:
          typeof body.runtimeAppVersion === "string" ? body.runtimeAppVersion : null,
        runtime_deployment_ref:
          typeof body.runtimeDeploymentRef === "string" ? body.runtimeDeploymentRef : null,
        http_status: typeof body.httpStatus === "number" ? body.httpStatus : null,
        rendered_at: typeof body.renderedAt === "string" ? body.renderedAt : null,
      },
    });
    if (error) {
      return NextResponse.json(
        { ok: false, reason: "acknowledge_failed" },
        { status: 400, headers: RUNTIME_NO_STORE_HEADERS },
      );
    }
    return NextResponse.json(data, { headers: RUNTIME_NO_STORE_HEADERS });
  } catch {
    return NextResponse.json(
      { ok: false, reason: "unavailable" },
      { status: 503, headers: RUNTIME_NO_STORE_HEADERS },
    );
  }
}
