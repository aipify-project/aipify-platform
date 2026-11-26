import { NextResponse } from "next/server";
import {
  buildCspPublicLinkPath,
  callCspRpc,
  evaluateSalesLinkGates,
  failClosedJson,
  normalizeChannel,
  parsePartnerOverview,
  resolveCspProductDestination,
} from "@/lib/certified-sales-partner";
import { evaluateCspCopyLinkEligibility } from "@/lib/certified-sales-partner/copy-link-eligibility";
import { loadOwnLinkVisitCounts, type CspLinkStatsClient } from "@/lib/certified-sales-partner/partner-link-stats";
import { parseCspPortalView } from "@/lib/certified-sales-partner/portal-view";
import { CSP_CATALOG_PRODUCT_KEYS } from "@/lib/certified-sales-partner/product-catalog-display";
import { createClient } from "@/lib/supabase/server";
import { createServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * List the signed-in partner's OWN links (from their own Core overview) with visit counts and
 * per-product copy-link eligibility. Visit counts are read with the service role for those link ids
 * only; a failed read returns `visits: null` ("not reported"), never an invented 0.
 */
export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const overview = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const view = parseCspPortalView(overview.data);
    const ownIds = view.links.map((l) => l.id).filter((id): id is string => typeof id === "string");
    let counts: Map<string, number> | null = null;
    try {
      counts = await loadOwnLinkVisitCounts(createServiceRoleClient() as unknown as CspLinkStatsClient, ownIds);
    } catch {
      counts = null;
    }

    return NextResponse.json({
      found: true,
      backend_ready: true,
      links: view.links
        .filter((l) => l.code)
        .map((l) => ({
          code: l.code,
          channel: l.channel,
          active: l.active,
          created_at: l.createdAt,
          visits: counts && l.id ? (counts.get(l.id) ?? 0) : null,
        })),
      eligibility: Object.fromEntries(
        CSP_CATALOG_PRODUCT_KEYS.map((key) => {
          const e = evaluateCspCopyLinkEligibility(view.overview, key);
          return [key, { allowed: e.allowed, reason: e.reason }];
        }),
      ),
    });
  } catch {
    return NextResponse.json({ error: "links_load_failed" }, { status: 500 });
  }
}

/**
 * Issue a personal product/channel link.
 *
 * Gates (partner approved, product published, certification passed, agreement) are DERIVED SERVER-SIDE
 * from `csp_get_partner_overview`. Any gate flags in the request body are ignored. `product_id` may be
 * the Core product id or a product key (e.g. `kompis_web`). The returned `path` is the public
 * `/p/{code}/{productKey}` attribution path (Core's `/r/<code>` placeholder is kept as `core_path`).
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      product_id?: unknown;
      product_key?: unknown;
      channel?: unknown;
    };

    const productRef =
      typeof body.product_id === "string" && body.product_id.trim()
        ? body.product_id.trim()
        : typeof body.product_key === "string"
          ? body.product_key.trim()
          : "";
    if (!productRef) {
      return NextResponse.json({ error: "product_id_required" }, { status: 400 });
    }

    const channel = normalizeChannel(typeof body.channel === "string" ? body.channel : undefined);
    const overview = await callCspRpc(supabase, "csp_get_partner_overview");
    if (!overview.ready) {
      const closed = failClosedJson(overview);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const evaluation = evaluateSalesLinkGates(parsePartnerOverview(overview.data), productRef);
    if (!evaluation.allowed || !evaluation.productId) {
      return NextResponse.json({ error: "sales_link_gates_not_met", gates: evaluation.gates }, { status: 403 });
    }

    // Do not issue a Core link for a product without a public destination (no orphan/dead links).
    if (resolveCspProductDestination(evaluation.productKey) === null) {
      return NextResponse.json({ error: "product_not_sellable_yet" }, { status: 409 });
    }

    const created = await callCspRpc(supabase, "csp_create_attribution_link", {
      p_product_id: evaluation.productId,
      p_channel: channel,
    });
    if (!created.ready) {
      const closed = failClosedJson(created);
      return NextResponse.json(closed.body, { status: closed.status });
    }
    // Core returns the placeholder `/r/<code>`; remap to the canonical `/p/{code}/{productKey}` route.
    const core = (created.data && typeof created.data === "object" ? created.data : {}) as Record<string, unknown>;
    const publicPath =
      typeof core.code === "string"
        ? buildCspPublicLinkPath({
            code: core.code,
            productKey: typeof core.product_key === "string" ? core.product_key : (evaluation.productKey ?? ""),
            channel: typeof core.channel === "string" ? core.channel : channel,
          })
        : null;
    if (!publicPath) {
      // Link exists in Core but has no public product destination yet — never hand out a dead URL.
      return NextResponse.json({ ...core, path: null, error: "public_link_unavailable" }, { status: 409 });
    }
    return NextResponse.json({ ...core, core_path: core.path ?? null, path: publicPath });
  } catch {
    return NextResponse.json({ error: "link_create_failed" }, { status: 500 });
  }
}

/**
 * Deactivate one of the signed-in partner's own sales links by code.
 * Requires Core RPC `csp_deactivate_attribution_link` (SQL candidate V4 — PREPARED_ONLY until applied).
 * Fail-closed when the RPC is missing; never invents success.
 */
export async function PATCH(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = (await request.json().catch(() => ({}))) as {
      code?: unknown;
      action?: unknown;
    };
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const action = typeof body.action === "string" ? body.action.trim() : "deactivate";
    if (!code) {
      return NextResponse.json({ error: "link_code_required" }, { status: 400 });
    }
    if (action !== "deactivate") {
      return NextResponse.json({ error: "unsupported_action" }, { status: 400 });
    }

    const result = await callCspRpc(supabase, "csp_deactivate_attribution_link", {
      p_code: code,
    });
    if (!result.ready) {
      const closed = failClosedJson(result);
      return NextResponse.json(closed.body, { status: closed.status });
    }

    const data =
      result.data && typeof result.data === "object" && !Array.isArray(result.data)
        ? (result.data as Record<string, unknown>)
        : {};
    if (data.found === false) {
      const err = typeof data.error === "string" ? data.error : "link_deactivate_failed";
      const status =
        err === "forbidden" || err === "partner_not_active"
          ? 403
          : err === "link_not_found"
            ? 404
            : 400;
      return NextResponse.json({ found: false, error: err }, { status });
    }

    return NextResponse.json({
      found: true,
      backend_ready: true,
      changed: data.changed === true,
      code: typeof data.code === "string" ? data.code : code,
      active: false,
    });
  } catch {
    return NextResponse.json({ error: "link_deactivate_failed" }, { status: 500 });
  }
}
