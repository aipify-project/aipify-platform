import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { performCustomerWebsiteRuntimeHttpCheck } from "@/lib/customer-website-runtime/http-verify";

const headers = { "Cache-Control": "no-store" };

function asRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

/** GET — Platform runtime delivery status (platform admin). */
export async function GET(
  _request: Request,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const { organizationId } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }

    const { data, error } = await supabase.rpc("platform_get_customer_website_runtime_status", {
      p_organization_id: organizationId,
    });
    if (error) {
      return NextResponse.json(
        { error: "Runtime status unavailable.", code: "runtime_status_failed" },
        { status: 400, headers },
      );
    }
    return NextResponse.json(data, { headers });
  } catch {
    return NextResponse.json(
      { error: "Runtime status unavailable.", code: "unknown" },
      { status: 500, headers },
    );
  }
}

/**
 * POST actions:
 * - action=config → update mounted paths / homepage / enabled
 * - action=verify-http → SSRF-safe HTTP read-back + record
 */
export async function POST(
  request: Request,
  context: { params: Promise<{ organizationId: string }> },
) {
  try {
    const { organizationId } = await context.params;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized", code: "unauthorized" }, { status: 401, headers });
    }

    const body = asRecord(await request.json().catch(() => null));
    const action = typeof body.action === "string" ? body.action : "config";
    const internalReason =
      typeof body.internalReason === "string" && body.internalReason.trim()
        ? body.internalReason.trim()
        : "";
    const confirmation = body.confirmation === true;

    if (!internalReason || !confirmation) {
      return NextResponse.json(
        { error: "Confirmation and internal reason are required.", code: "confirmation_required" },
        { status: 400, headers },
      );
    }

    if (action === "config") {
      const mountedPaths = Array.isArray(body.mountedPaths)
        ? body.mountedPaths.filter((item): item is string => typeof item === "string")
        : [];
      const { data, error } = await supabase.rpc("platform_update_customer_website_runtime_config", {
        p_organization_id: organizationId,
        p_mounted_paths: mountedPaths,
        p_homepage_enabled: body.homepageEnabled === true,
        p_enabled: body.enabled !== false,
        p_fallback_mode:
          body.fallbackMode === "unavailable" ? "unavailable" : "customer_runtime",
        p_internal_reason: internalReason,
        p_confirmation: true,
      });
      if (error) {
        return NextResponse.json(
          { error: "Runtime config could not be updated.", code: "config_failed" },
          { status: 400, headers },
        );
      }
      return NextResponse.json(data, { headers });
    }

    if (action === "verify-http") {
      const path = typeof body.path === "string" ? body.path : "";
      const locale = typeof body.locale === "string" ? body.locale : "en";
      const idempotencyKey =
        typeof body.idempotencyKey === "string" && body.idempotencyKey.length >= 8
          ? body.idempotencyKey
          : `cwrh-${Date.now().toString(36)}`;

      const statusRes = await supabase.rpc("platform_get_customer_website_runtime_status", {
        p_organization_id: organizationId,
      });
      if (statusRes.error) {
        return NextResponse.json(
          { error: "Runtime status unavailable.", code: "runtime_status_failed" },
          { status: 400, headers },
        );
      }
      const statusRow = asRecord(statusRes.data);
      // Domain comes from website status chain via separate website status if needed.
      const websiteStatus = await supabase.rpc("platform_get_customer_website_status", {
        p_organization_id: organizationId,
      });
      const website = asRecord(asRecord(websiteStatus.data).website);
      // Host must be resolved server-side from delivery — fetch domain from customer_domains via status
      const delivery = await supabase.rpc("get_platform_portal_app_kompis_delivery_status", {
        p_customer_id: organizationId,
      });
      const deliveryRow = asRecord(delivery.data);
      const domain = asRecord(deliveryRow.domain);
      const hostname = typeof domain.hostname === "string" ? domain.hostname : "";
      if (!hostname) {
        return NextResponse.json(
          { error: "Verified domain is required.", code: "domain_required" },
          { status: 400, headers },
        );
      }

      const http = await performCustomerWebsiteRuntimeHttpCheck({
        hostname,
        path: path || (Array.isArray(statusRow.mounted_paths) ? String(statusRow.mounted_paths[0] ?? "/") : "/"),
        locale,
      });

      const { data, error } = await supabase.rpc("platform_record_customer_website_runtime_http_check", {
        p_organization_id: organizationId,
        p_path: http.requestedPath,
        p_locale: locale,
        p_requested_host: http.requestedHost,
        p_http_status: http.httpStatus,
        p_observed_version_header: http.observedVersionHeader,
        p_observed_manifest_checksum: http.observedManifestChecksum,
        p_observed_page_checksum: http.observedPageChecksum,
        p_observed_installation_header: http.observedInstallationHeader,
        p_redirect_hops: http.redirectHops,
        p_failure_reason: http.failureReason,
        p_idempotency_key: idempotencyKey,
        p_internal_reason: internalReason,
        p_confirmation: true,
      });
      if (error) {
        return NextResponse.json(
          { error: "HTTP verification could not be recorded.", code: "http_verify_failed" },
          { status: 400, headers },
        );
      }
      return NextResponse.json(
        { http, recorded: data, websiteId: website.id ?? null },
        { headers },
      );
    }

    return NextResponse.json({ error: "Unknown action.", code: "invalid_action" }, { status: 400, headers });
  } catch {
    return NextResponse.json(
      { error: "Runtime action failed.", code: "unknown" },
      { status: 500, headers },
    );
  }
}
